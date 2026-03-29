// Game state management: turns, placement rules, win detection

const GameState = (() => {
  let state;

  function createInitialHand() {
    const hand = {};
    for (const [type, info] of Object.entries(Pieces.TYPES)) {
      hand[type] = info.count;
    }
    return hand;
  }

  function init() {
    state = {
      // Map of "q,r" -> [{player, type}, ...] (stack, top piece is last)
      pieces: new Map(),
      hands: {
        1: createInitialHand(),
        2: createInitialHand(),
      },
      currentPlayer: 1,
      turnNumber: 1, // increments each time a player takes a turn
      playerTurns: { 1: 0, 2: 0 }, // how many turns each player has taken
      queenPlaced: { 1: false, 2: false },
      lastMoved: null, // {q, r} of the piece that moved last (for pillbug restriction)
      winner: null,
      selectedPiece: null,    // {q, r} for board piece or null
      selectedHandPiece: null, // {type} for hand piece or null
      validMoves: [],
      validSpecials: [],      // pillbug special moves
      pillbugGrab: null,      // {q,r} piece being grabbed by pillbug
      gameOver: false,
    };
    return state;
  }

  function getState() { return state; }

  // Count how many total pieces a player has placed
  function piecesPlacedCount(player) {
    return state.playerTurns[player];
  }

  // Check if player must place queen this turn (by their 4th turn, queen must be placed)
  function mustPlaceQueen(player) {
    return state.playerTurns[player] === 3 && !state.queenPlaced[player];
  }

  // Get valid placement positions for a new piece for the given player
  function getPlacementPositions(player) {
    const positions = [];

    // First piece: place at origin
    if (state.pieces.size === 0) {
      return [{ q: 0, r: 0 }];
    }

    // Second piece (first move of player 2): must be adjacent to the first piece
    if (state.pieces.size === 1) {
      const [k] = state.pieces.keys();
      const { q, r } = HexGrid.parse(k);
      return HexGrid.neighbors(q, r);
    }

    // Normal placement: must be adjacent to at least one friendly piece
    // and NOT adjacent to any enemy piece
    const emptyAdj = HexGrid.getAdjacentEmpty(state.pieces);
    for (const ek of emptyAdj) {
      const { q, r } = HexGrid.parse(ek);
      let touchesFriendly = false;
      let touchesEnemy = false;
      for (const n of HexGrid.neighbors(q, r)) {
        const nk = HexGrid.key(n.q, n.r);
        const stack = state.pieces.get(nk);
        if (stack && stack.length > 0) {
          const topPiece = stack[stack.length - 1];
          if (topPiece.player === player) touchesFriendly = true;
          else touchesEnemy = true;
        }
      }
      if (touchesFriendly && !touchesEnemy) {
        positions.push({ q, r });
      }
    }
    return positions;
  }

  // Place a piece from hand onto the board
  function placePiece(type, q, r) {
    const player = state.currentPlayer;
    if (state.hands[player][type] <= 0) return false;

    const k = HexGrid.key(q, r);
    if (!state.pieces.has(k)) state.pieces.set(k, []);
    state.pieces.get(k).push({ player, type });
    state.hands[player][type]--;

    if (type === 'queen') state.queenPlaced[player] = true;

    state.lastMoved = null; // placement doesn't count for pillbug restriction
    state.playerTurns[player]++;
    advanceTurn();
    return true;
  }

  // Move a piece on the board from one position to another
  function movePiece(fromQ, fromR, toQ, toR) {
    const fromK = HexGrid.key(fromQ, fromR);
    const toK = HexGrid.key(toQ, toR);
    const stack = state.pieces.get(fromK);
    if (!stack || stack.length === 0) return false;

    const piece = stack.pop();
    if (stack.length === 0) state.pieces.delete(fromK);

    if (!state.pieces.has(toK)) state.pieces.set(toK, []);
    state.pieces.get(toK).push(piece);

    state.lastMoved = { q: toQ, r: toR };
    state.playerTurns[state.currentPlayer]++;
    advanceTurn();
    return true;
  }

  // Pillbug special: move another piece
  function pillbugMove(pillQ, pillR, fromQ, fromR, toQ, toR) {
    const fromK = HexGrid.key(fromQ, fromR);
    const toK = HexGrid.key(toQ, toR);
    const stack = state.pieces.get(fromK);
    if (!stack || stack.length === 0) return false;

    const piece = stack.pop();
    if (stack.length === 0) state.pieces.delete(fromK);

    if (!state.pieces.has(toK)) state.pieces.set(toK, []);
    state.pieces.get(toK).push(piece);

    state.lastMoved = { q: toQ, r: toR };
    state.playerTurns[state.currentPlayer]++;
    advanceTurn();
    return true;
  }

  function advanceTurn() {
    clearSelection();
    checkWin();
    if (!state.gameOver) {
      state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      state.turnNumber++;
      // Check if current player has any valid actions; if not, they must pass
      if (!hasAnyValidAction(state.currentPlayer)) {
        // Auto-pass
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        state.turnNumber++;
      }
    }
  }

  function hasAnyValidAction(player) {
    // Check if player can place any piece
    const hand = state.hands[player];
    const hasHandPieces = Object.values(hand).some(c => c > 0);
    if (hasHandPieces) {
      const positions = getPlacementPositions(player);
      if (positions.length > 0) {
        // If must place queen, check queen is available
        if (mustPlaceQueen(player)) {
          return hand.queen > 0;
        }
        return true;
      }
    }

    // Check if player can move any piece (queen must be placed first)
    if (!state.queenPlaced[player]) return hasHandPieces;

    for (const [k, stack] of state.pieces) {
      if (stack.length === 0) continue;
      const topPiece = stack[stack.length - 1];
      if (topPiece.player !== player) continue;
      const { q, r } = HexGrid.parse(k);
      const { moves, specials } = Pieces.getValidMoves(q, r, state.pieces, state.lastMoved);
      if (moves.length > 0 || specials.length > 0) return true;
    }
    return false;
  }

  function checkWin() {
    // Check if any queen is surrounded on all 6 sides
    for (const [k, stack] of state.pieces) {
      for (const piece of stack) {
        if (piece.type === 'queen') {
          const { q, r } = HexGrid.parse(k);
          const nbrs = HexGrid.neighbors(q, r);
          const surrounded = nbrs.every(n => {
            const nk = HexGrid.key(n.q, n.r);
            const ns = state.pieces.get(nk);
            return ns && ns.length > 0;
          });
          if (surrounded) {
            // This queen is surrounded - the OTHER player wins
            const loser = piece.player;
            const winner = loser === 1 ? 2 : 1;
            // Check both queens simultaneously for draw
            if (state.winner === null) {
              state.winner = winner;
            } else {
              state.winner = 'draw';
            }
            state.gameOver = true;
          }
        }
      }
    }
  }

  // Can the current player move pieces? (queen must be placed first)
  function canMovePieces(player) {
    return state.queenPlaced[player || state.currentPlayer];
  }

  function clearSelection() {
    state.selectedPiece = null;
    state.selectedHandPiece = null;
    state.validMoves = [];
    state.validSpecials = [];
    state.pillbugGrab = null;
  }

  function selectHandPiece(type) {
    clearSelection();
    const player = state.currentPlayer;
    if (state.hands[player][type] <= 0) return;
    if (mustPlaceQueen(player) && type !== 'queen') return;

    state.selectedHandPiece = type;
    state.validMoves = getPlacementPositions(player);
  }

  function selectBoardPiece(q, r) {
    clearSelection();
    const player = state.currentPlayer;
    if (!canMovePieces(player)) return;

    const k = HexGrid.key(q, r);
    const stack = state.pieces.get(k);
    if (!stack || stack.length === 0) return;
    const topPiece = stack[stack.length - 1];
    if (topPiece.player !== player) return;

    state.selectedPiece = { q, r };
    const { moves, specials } = Pieces.getValidMoves(q, r, state.pieces, state.lastMoved);
    state.validMoves = moves;
    state.validSpecials = specials;
  }

  // Start pillbug grab mode
  function selectPillbugGrab(pillQ, pillR, grabQ, grabR) {
    const specials = state.validSpecials;
    const match = specials.find(s => s.from.q === grabQ && s.from.r === grabR);
    if (!match) return;

    state.pillbugGrab = { q: grabQ, r: grabR, pillQ, pillR };
    state.validMoves = match.to;
    state.validSpecials = [];
  }

  return {
    init,
    getState,
    getPlacementPositions,
    placePiece,
    movePiece,
    pillbugMove,
    canMovePieces,
    mustPlaceQueen,
    clearSelection,
    selectHandPiece,
    selectBoardPiece,
    selectPillbugGrab,
    piecesPlacedCount,
  };
})();
