// Piece definitions and movement logic for each bug type

const Pieces = (() => {
  // Piece types with emoji and count per player
  const TYPES = {
    queen:       { emoji: '👑', name: 'Queen Bee', count: 1 },
    spider:      { emoji: '🕷️', name: 'Spider', count: 2 },
    beetle:      { emoji: '🪲', name: 'Beetle', count: 2 },
    grasshopper: { emoji: '🦗', name: 'Grasshopper', count: 3 },
    ant:         { emoji: '🐜', name: 'Soldier Ant', count: 3 },
    pillbug:     { emoji: '💊', name: 'Pill Bug', count: 1 },
  };

  // Player emojis/colors
  const PLAYERS = {
    1: { emoji: '🔵', name: 'Player 1', color: '#5dade2', bg: 'rgba(93,173,226,0.25)', border: '#5dade2' },
    2: { emoji: '🔴', name: 'Player 2', color: '#e74c3c', bg: 'rgba(231,76,60,0.25)', border: '#e74c3c' },
  };

  // Build occupied set from pieces map (excluding a specific key if provided)
  function getOccupiedSet(pieces, excludeKey) {
    const set = new Set();
    for (const [k, stack] of pieces) {
      if (k !== excludeKey && stack.length > 0) set.add(k);
    }
    return set;
  }

  // Queen Bee: moves exactly 1 space by sliding
  function queenMoves(q, r, pieces) {
    const occupied = getOccupiedSet(pieces, HexGrid.key(q, r));
    const moves = [];
    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      if (occupied.has(nk)) continue; // must be empty
      // Must stay connected to hive
      let touchesHive = false;
      for (const nn of HexGrid.neighbors(n.q, n.r)) {
        if (occupied.has(HexGrid.key(nn.q, nn.r))) { touchesHive = true; break; }
      }
      if (!touchesHive) continue;
      // Freedom of movement
      if (!HexGrid.canSlide(q, r, n.q, n.r, occupied)) continue;
      moves.push(n);
    }
    return moves;
  }

  // Spider: moves exactly 3 spaces by sliding along the hive edge
  function spiderMoves(q, r, pieces) {
    const occupied = getOccupiedSet(pieces, HexGrid.key(q, r));
    const results = new Set();

    function walk(cq, cr, steps, visited) {
      if (steps === 3) {
        results.add(HexGrid.key(cq, cr));
        return;
      }
      for (const n of HexGrid.neighbors(cq, cr)) {
        const nk = HexGrid.key(n.q, n.r);
        if (occupied.has(nk)) continue;
        if (visited.has(nk)) continue;
        // Must touch hive
        let touchesHive = false;
        for (const nn of HexGrid.neighbors(n.q, n.r)) {
          if (occupied.has(HexGrid.key(nn.q, nn.r))) { touchesHive = true; break; }
        }
        if (!touchesHive) continue;
        if (!HexGrid.canSlide(cq, cr, n.q, n.r, occupied)) continue;
        visited.add(nk);
        walk(n.q, n.r, steps + 1, visited);
        visited.delete(nk);
      }
    }

    const startKey = HexGrid.key(q, r);
    walk(q, r, 0, new Set([startKey]));
    results.delete(startKey);
    return [...results].map(k => HexGrid.parse(k));
  }

  // Beetle: moves 1 space, can climb on top of other pieces
  function beetleMoves(q, r, pieces) {
    const myKey = HexGrid.key(q, r);
    const stack = pieces.get(myKey);
    const isOnTop = stack && stack.length > 1; // beetle is on top of stack
    const occupied = getOccupiedSet(pieces, null); // don't exclude - beetle can move onto occupied
    const occupiedWithout = getOccupiedSet(pieces, myKey);

    const moves = [];
    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      const targetOccupied = occupied.has(nk);

      if (targetOccupied) {
        // Climbing onto another piece - always allowed if adjacent
        // But must still be connected
        moves.push(n);
      } else {
        if (isOnTop) {
          // Climbing down from a stack - can go to any adjacent empty if it stays connected
          let touchesHive = false;
          for (const nn of HexGrid.neighbors(n.q, n.r)) {
            const nnk = HexGrid.key(nn.q, nn.r);
            if (nnk !== myKey && occupied.has(nnk)) { touchesHive = true; break; }
            if (nnk === myKey && stack.length > 1) { touchesHive = true; break; }
          }
          if (touchesHive) moves.push(n);
        } else {
          // Ground level - normal sliding rules
          let touchesHive = false;
          for (const nn of HexGrid.neighbors(n.q, n.r)) {
            if (occupiedWithout.has(HexGrid.key(nn.q, nn.r))) { touchesHive = true; break; }
          }
          if (!touchesHive) continue;
          if (!HexGrid.canSlide(q, r, n.q, n.r, occupiedWithout)) continue;
          moves.push(n);
        }
      }
    }
    return moves;
  }

  // Grasshopper: jumps in a straight line over at least one piece
  function grasshopperMoves(q, r, pieces) {
    const occupied = getOccupiedSet(pieces, HexGrid.key(q, r));
    const moves = [];

    for (const dir of HexGrid.DIRECTIONS) {
      let cq = q + dir.q;
      let cr = r + dir.r;
      // Must jump over at least one piece
      if (!occupied.has(HexGrid.key(cq, cr))) continue;
      // Keep going until we find empty
      while (occupied.has(HexGrid.key(cq, cr))) {
        cq += dir.q;
        cr += dir.r;
      }
      moves.push({ q: cq, r: cr });
    }
    return moves;
  }

  // Soldier Ant: moves any number of spaces around the hive perimeter
  function antMoves(q, r, pieces) {
    const occupied = getOccupiedSet(pieces, HexGrid.key(q, r));
    const results = new Set();
    const startKey = HexGrid.key(q, r);

    function walk(cq, cr, visited) {
      for (const n of HexGrid.neighbors(cq, cr)) {
        const nk = HexGrid.key(n.q, n.r);
        if (occupied.has(nk)) continue;
        if (visited.has(nk)) continue;
        // Must touch hive
        let touchesHive = false;
        for (const nn of HexGrid.neighbors(n.q, n.r)) {
          if (occupied.has(HexGrid.key(nn.q, nn.r))) { touchesHive = true; break; }
        }
        if (!touchesHive) continue;
        if (!HexGrid.canSlide(cq, cr, n.q, n.r, occupied)) continue;
        visited.add(nk);
        results.add(nk);
        walk(n.q, n.r, visited);
      }
    }

    walk(q, r, new Set([startKey]));
    return [...results].map(k => HexGrid.parse(k));
  }

  // Pill Bug: moves 1 space like queen, PLUS special ability
  function pillbugMoves(q, r, pieces) {
    return queenMoves(q, r, pieces);
  }

  // Pill Bug special: can grab an adjacent piece and place it on another adjacent empty space
  // Returns array of { from: {q,r}, to: [{q,r}] } describing possible grabs
  function pillbugSpecialMoves(q, r, pieces, lastMoved) {
    const specials = [];
    const myKey = HexGrid.key(q, r);

    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      const stack = pieces.get(nk);
      if (!stack || stack.length === 0) continue;

      // Can't move a piece that just moved last turn
      if (lastMoved && lastMoved.q === n.q && lastMoved.r === n.r) continue;

      // Can't move a piece that's under another piece
      if (stack.length > 1) continue;

      // Check one-hive rule: removing this piece must keep hive connected
      if (HexGrid.isArticulationPoint(n.q, n.r, pieces)) continue;

      // Find valid drop locations (empty spaces adjacent to pillbug, not the grabbed piece's location)
      const targets = [];
      for (const t of HexGrid.neighbors(q, r)) {
        const tk = HexGrid.key(t.q, t.r);
        if (tk === nk) continue; // can't put back in same spot
        if (pieces.has(tk) && pieces.get(tk).length > 0) continue; // must be empty

        // The piece is being lifted over the pillbug, so freedom of movement
        // applies differently - it's being placed on top then sliding down
        targets.push(t);
      }

      if (targets.length > 0) {
        specials.push({ from: n, to: targets });
      }
    }
    return specials;
  }

  // Get valid moves for a piece at (q,r) given the board state
  function getValidMoves(q, r, pieces, lastMoved) {
    const k = HexGrid.key(q, r);
    const stack = pieces.get(k);
    if (!stack || stack.length === 0) return { moves: [], specials: [] };

    const topPiece = stack[stack.length - 1];

    // Check one-hive rule (only if piece is on ground level and not stacked)
    if (stack.length === 1 && HexGrid.isArticulationPoint(q, r, pieces)) {
      // Beetles on top of others can always move; ground pieces that are articulation points cannot
      const specials = topPiece.type === 'pillbug' ? pillbugSpecialMoves(q, r, pieces, lastMoved) : [];
      return { moves: [], specials };
    }

    let moves = [];
    switch (topPiece.type) {
      case 'queen':       moves = queenMoves(q, r, pieces); break;
      case 'spider':      moves = spiderMoves(q, r, pieces); break;
      case 'beetle':      moves = beetleMoves(q, r, pieces); break;
      case 'grasshopper': moves = grasshopperMoves(q, r, pieces); break;
      case 'ant':         moves = antMoves(q, r, pieces); break;
      case 'pillbug':     moves = pillbugMoves(q, r, pieces); break;
    }

    const specials = topPiece.type === 'pillbug' ? pillbugSpecialMoves(q, r, pieces, lastMoved) : [];
    return { moves, specials };
  }

  return {
    TYPES,
    PLAYERS,
    getValidMoves,
    getOccupiedSet,
  };
})();
