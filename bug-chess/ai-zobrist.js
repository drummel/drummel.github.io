// Zobrist Hashing & Transposition Table for Bug Chess AI
// Provides fast incremental position hashing and cached evaluation results

const AIZobrist = (() => {

  // ======================== ZOBRIST HASH TABLE ========================

  // Piece types mapped to indices for hash lookup
  const PIECE_TYPES = ['queen', 'spider', 'beetle', 'grasshopper', 'ant', 'pillbug', 'ladybug', 'mosquito'];
  const PIECE_INDEX = {};
  PIECE_TYPES.forEach((t, i) => PIECE_INDEX[t] = i);

  // Players: 1 and 2 (mapped to 0 and 1)
  const NUM_TYPES = PIECE_TYPES.length;
  const NUM_PLAYERS = 2;

  // We use a coordinate range that covers typical Hive games.
  // Hive rarely exceeds ~20 hexes in any direction from origin.
  const COORD_RANGE = 25; // -25 to +25
  const COORD_SIZE = COORD_RANGE * 2 + 1; // 51
  // Max stack height (beetles can stack)
  const MAX_HEIGHT = 6;

  // Random number table: [player][type][q_offset][r_offset][height]
  // We use 32-bit pairs since JS doesn't have native 64-bit integers
  const hashTableA = new Int32Array(NUM_PLAYERS * NUM_TYPES * COORD_SIZE * COORD_SIZE * MAX_HEIGHT);
  const hashTableB = new Int32Array(NUM_PLAYERS * NUM_TYPES * COORD_SIZE * COORD_SIZE * MAX_HEIGHT);

  // Side-to-move hash
  let sideHashA = 0;
  let sideHashB = 0;

  // Seeded PRNG (xorshift32) for reproducible hashes
  let seed = 123456789;
  function xorshift32() {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return seed;
  }

  // Initialize hash tables with random values
  function initHashTables() {
    seed = 123456789;
    for (let i = 0; i < hashTableA.length; i++) {
      hashTableA[i] = xorshift32();
      hashTableB[i] = xorshift32();
    }
    sideHashA = xorshift32();
    sideHashB = xorshift32();
  }

  // Compute index into hash table
  function hashIndex(player, type, q, r, height) {
    const pi = player - 1; // 0 or 1
    const ti = PIECE_INDEX[type];
    if (ti === undefined) return -1;
    const qi = q + COORD_RANGE;
    const ri = r + COORD_RANGE;
    const h = Math.min(height, MAX_HEIGHT - 1);
    if (qi < 0 || qi >= COORD_SIZE || ri < 0 || ri >= COORD_SIZE) return -1;
    return ((((pi * NUM_TYPES + ti) * COORD_SIZE + qi) * COORD_SIZE + ri) * MAX_HEIGHT + h);
  }

  // Compute full hash of a board position
  function hashPosition(pieces, currentPlayer) {
    let a = 0, b = 0;
    for (const [k, stack] of pieces) {
      if (stack.length === 0) continue;
      const { q, r } = HexGrid.parse(k);
      for (let h = 0; h < stack.length; h++) {
        const piece = stack[h];
        const idx = hashIndex(piece.player, piece.type, q, r, h);
        if (idx >= 0 && idx < hashTableA.length) {
          a ^= hashTableA[idx];
          b ^= hashTableB[idx];
        }
      }
    }
    if (currentPlayer === 2) {
      a ^= sideHashA;
      b ^= sideHashB;
    }
    // Combine into a string key for Map lookup
    return `${a},${b}`;
  }

  // ======================== TRANSPOSITION TABLE ========================

  // Entry flags
  const EXACT = 0;
  const LOWER_BOUND = 1; // alpha cutoff
  const UPPER_BOUND = 2; // beta cutoff

  // Fixed-size transposition table using Map with LRU-style eviction
  const MAX_TABLE_SIZE = 65536; // 64K entries
  let table = new Map();

  function store(hashKey, depth, score, flag, bestAction) {
    // Only replace if new entry is deeper or table has space
    const existing = table.get(hashKey);
    if (existing && existing.depth > depth) return; // don't overwrite deeper search

    table.set(hashKey, { depth, score, flag, bestAction });

    // Simple eviction: clear half the table when full
    if (table.size > MAX_TABLE_SIZE) {
      const entries = Array.from(table.entries());
      table = new Map(entries.slice(entries.length >> 1));
    }
  }

  function probe(hashKey, depth, alpha, beta) {
    const entry = table.get(hashKey);
    if (!entry || entry.depth < depth) return null;

    if (entry.flag === EXACT) {
      return { score: entry.score, bestAction: entry.bestAction };
    }
    if (entry.flag === LOWER_BOUND && entry.score >= beta) {
      return { score: entry.score, bestAction: entry.bestAction };
    }
    if (entry.flag === UPPER_BOUND && entry.score <= alpha) {
      return { score: entry.score, bestAction: entry.bestAction };
    }

    // Can't use the score, but we can use the best move for ordering
    return { bestAction: entry.bestAction, score: null };
  }

  function getBestMove(hashKey) {
    const entry = table.get(hashKey);
    return entry ? entry.bestAction : null;
  }

  function clear() {
    table = new Map();
  }

  function size() {
    return table.size;
  }

  // Initialize on load
  initHashTables();

  // ======================== PUBLIC API ========================

  return {
    hashPosition,
    store,
    probe,
    getBestMove,
    clear,
    size,
    EXACT,
    LOWER_BOUND,
    UPPER_BOUND,
  };
})();
