// Piece definitions and movement logic for each bug type

const Pieces = (() => {
  // All piece types. Expansion pieces have `expansion` field.
  const ALL_TYPES = {
    queen:       { emoji: '🐝', name: 'Queen Bee', count: 1 },
    spider:      { emoji: '🕷️', name: 'Spider', count: 2 },
    beetle:      { emoji: '🪲', name: 'Beetle', count: 2 },
    grasshopper: { emoji: '🦗', name: 'Grasshopper', count: 3 },
    ant:         { emoji: '🐜', name: 'Soldier Ant', count: 3 },
    pillbug:     { emoji: '💊', name: 'Pill Bug', count: 1, expansion: 'pillbug' },
    ladybug:     { emoji: '🐞', name: 'Ladybug', count: 1, expansion: 'ladybug' },
  };

  // Active types (filtered by expansion config) - set by setExpansions()
  let TYPES = { ...ALL_TYPES };

  function setExpansions(config) {
    TYPES = {};
    for (const [key, info] of Object.entries(ALL_TYPES)) {
      if (!info.expansion || config[info.expansion]) {
        TYPES[key] = info;
      }
    }
  }

  function getTypes() { return TYPES; }

  // Player definitions: white and black
  const PLAYERS = {
    1: { name: 'Player 1', label: 'White', color: '#555', tileFill: '#ffffff', tileStroke: '#888', tileShadow: 'rgba(0,0,0,0.15)' },
    2: { name: 'Player 2', label: 'Black', color: '#111', tileFill: '#2a2a2a', tileStroke: '#555', tileShadow: 'rgba(0,0,0,0.3)' },
  };

  // Build occupied set from pieces map (excluding a specific key if provided)
  function getOccupiedSet(pieces, excludeKey) {
    const set = new Set();
    for (const [k, stack] of pieces) {
      if (k !== excludeKey && stack.length > 0) set.add(k);
    }
    return set;
  }

  // Queen Bee / Pillbug: moves exactly 1 space by sliding
  function oneSpaceSlideMoves(q, r, pieces) {
    const occupied = getOccupiedSet(pieces, HexGrid.key(q, r));
    const moves = [];
    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      if (occupied.has(nk)) continue;
      let touchesHive = false;
      for (const nn of HexGrid.neighbors(n.q, n.r)) {
        if (occupied.has(HexGrid.key(nn.q, nn.r))) { touchesHive = true; break; }
      }
      if (!touchesHive) continue;
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
    const isOnTop = stack && stack.length > 1;
    const occupied = getOccupiedSet(pieces, null);
    const occupiedWithout = getOccupiedSet(pieces, myKey);

    const moves = [];
    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      const targetOccupied = occupied.has(nk);

      if (targetOccupied) {
        // Climbing onto another piece - check gate rule for beetle on top of hive
        if (isOnTop) {
          // On top of hive: check if both shared neighbors are taller stacks
          const targetStack = pieces.get(nk);
          const myHeight = stack.length;
          const targetHeight = targetStack ? targetStack.length : 0;
          const maxHeight = Math.max(myHeight, targetHeight);
          const shared = HexGrid.sharedNeighbors(q, r, n.q, n.r);
          let blocked = true;
          for (const s of shared) {
            const sk = HexGrid.key(s.q, s.r);
            const ss = pieces.get(sk);
            const sh = ss ? ss.length : 0;
            if (sh < maxHeight) { blocked = false; break; }
          }
          if (!blocked) moves.push(n);
        } else {
          // Ground level climbing up - always allowed
          moves.push(n);
        }
      } else {
        if (isOnTop) {
          // Climbing down from a stack
          let touchesHive = false;
          for (const nn of HexGrid.neighbors(n.q, n.r)) {
            const nnk = HexGrid.key(nn.q, nn.r);
            if (nnk !== myKey && occupied.has(nnk)) { touchesHive = true; break; }
            if (nnk === myKey && stack.length > 1) { touchesHive = true; break; }
          }
          if (touchesHive) moves.push(n);
        } else {
          // Ground level sliding
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
      if (!occupied.has(HexGrid.key(cq, cr))) continue;
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

  // Ladybug: moves exactly 3 spaces - 2 on top of the hive, then 1 down
  // Step 1: climb onto adjacent occupied hex
  // Step 2: move to another adjacent occupied hex (on top)
  // Step 3: descend to an empty hex adjacent to the step-2 hex
  function ladybugMoves(q, r, pieces) {
    const myKey = HexGrid.key(q, r);
    const occupied = getOccupiedSet(pieces, myKey);
    const results = new Set();

    // Step 1: move onto an adjacent occupied hex
    for (const n1 of HexGrid.neighbors(q, r)) {
      const n1k = HexGrid.key(n1.q, n1.r);
      if (!occupied.has(n1k)) continue; // must climb onto a piece

      // Step 2: from n1, move to another adjacent occupied hex (on top of hive)
      for (const n2 of HexGrid.neighbors(n1.q, n1.r)) {
        const n2k = HexGrid.key(n2.q, n2.r);
        if (n2k === myKey) continue; // can't go back to start
        if (n2k === n1k) continue;
        if (!occupied.has(n2k)) continue; // must stay on top of hive

        // Step 3: descend from n2 to an adjacent empty hex
        for (const n3 of HexGrid.neighbors(n2.q, n2.r)) {
          const n3k = HexGrid.key(n3.q, n3.r);
          if (n3k === myKey) continue; // can't return to start
          if (occupied.has(n3k)) continue; // must descend to empty
          results.add(n3k);
        }
      }
    }

    return [...results].map(k => HexGrid.parse(k));
  }

  // Pill Bug special: grab an adjacent piece and relocate it
  function pillbugSpecialMoves(q, r, pieces, lastMoved) {
    const specials = [];

    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      const stack = pieces.get(nk);
      if (!stack || stack.length === 0) continue;

      // Can't move a piece that was just moved/placed last turn (stun rule)
      if (lastMoved && lastMoved.q === n.q && lastMoved.r === n.r) continue;

      // Can't move a piece that's under another piece (stacked)
      if (stack.length > 1) continue;

      // One-hive rule: removing this piece must keep hive connected
      if (HexGrid.isArticulationPoint(n.q, n.r, pieces)) continue;

      // Find valid drop locations: empty spaces adjacent to pillbug
      const targets = [];
      for (const t of HexGrid.neighbors(q, r)) {
        const tk = HexGrid.key(t.q, t.r);
        if (tk === nk) continue;
        if (pieces.has(tk) && pieces.get(tk).length > 0) continue;
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

    // Check one-hive rule (only for ground-level single pieces, not beetles on top)
    if (stack.length === 1 && HexGrid.isArticulationPoint(q, r, pieces)) {
      const specials = topPiece.type === 'pillbug' ? pillbugSpecialMoves(q, r, pieces, lastMoved) : [];
      return { moves: [], specials };
    }

    let moves = [];
    switch (topPiece.type) {
      case 'queen':       moves = oneSpaceSlideMoves(q, r, pieces); break;
      case 'spider':      moves = spiderMoves(q, r, pieces); break;
      case 'beetle':      moves = beetleMoves(q, r, pieces); break;
      case 'grasshopper': moves = grasshopperMoves(q, r, pieces); break;
      case 'ant':         moves = antMoves(q, r, pieces); break;
      case 'pillbug':     moves = oneSpaceSlideMoves(q, r, pieces); break;
      case 'ladybug':     moves = ladybugMoves(q, r, pieces); break;
    }

    const specials = topPiece.type === 'pillbug' ? pillbugSpecialMoves(q, r, pieces, lastMoved) : [];
    return { moves, specials };
  }

  return {
    ALL_TYPES,
    getTypes,
    setExpansions,
    PLAYERS,
    getValidMoves,
    getOccupiedSet,
  };
})();
