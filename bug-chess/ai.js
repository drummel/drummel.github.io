// AI opponent for Bug Chess
// 4 difficulty levels with proper Hive strategy

const AI = (() => {
  let difficulty = 'medium';
  let aiPlayer = 2;
  let enabled = false;

  function setDifficulty(d) { difficulty = d; }
  function getDifficulty() { return difficulty; }
  function setEnabled(e) { enabled = e; }
  function isEnabled() { return enabled; }
  function getAIPlayer() { return aiPlayer; }

  // ======================== ACTION GENERATION ========================

  function getAllActions(state, player) {
    const actions = [];
    const hand = state.hands[player];
    const mustQueen = GameState.mustPlaceQueen(player);

    // Placement actions
    const hasHandPieces = Object.values(hand).some(c => c > 0);
    if (hasHandPieces) {
      const positions = GameState.getPlacementPositions(player);
      for (const pos of positions) {
        for (const [type] of Object.entries(Pieces.getTypes())) {
          if (hand[type] <= 0) continue;
          if (mustQueen && type !== 'queen') continue;
          actions.push({ kind: 'place', type, q: pos.q, r: pos.r });
        }
      }
    }

    // Movement actions (only if queen placed)
    if (state.queenPlaced[player]) {
      for (const [k, stack] of state.pieces) {
        if (stack.length === 0) continue;
        const topPiece = stack[stack.length - 1];
        if (topPiece.player !== player) continue;
        const { q, r } = HexGrid.parse(k);
        const { moves, specials } = Pieces.getValidMoves(q, r, state.pieces, state.lastMoved);
        for (const m of moves) {
          actions.push({ kind: 'move', fromQ: q, fromR: r, toQ: m.q, toR: m.r, pieceType: topPiece.type });
        }
        for (const s of specials) {
          for (const t of s.to) {
            actions.push({ kind: 'pillbug', pillQ: q, pillR: r, fromQ: s.from.q, fromR: s.from.r, toQ: t.q, toR: t.r });
          }
        }
      }
    }

    return actions;
  }

  function executeAction(action) {
    switch (action.kind) {
      case 'place': GameState.placePiece(action.type, action.q, action.r); break;
      case 'move':  GameState.movePiece(action.fromQ, action.fromR, action.toQ, action.toR); break;
      case 'pillbug': GameState.pillbugMove(action.pillQ, action.pillR, action.fromQ, action.fromR, action.toQ, action.toR); break;
    }
  }

  // ======================== BOARD ANALYSIS HELPERS ========================

  function hexDist(q1, r1, q2, r2) {
    return Math.max(Math.abs(q1 - q2), Math.abs(r1 - r2), Math.abs((-q1-r1) - (-q2-r2)));
  }

  function findQueen(pieces, player) {
    for (const [k, stack] of pieces) {
      for (const piece of stack) {
        if (piece.type === 'queen' && piece.player === player) return HexGrid.parse(k);
      }
    }
    return null;
  }

  function queenSurroundCount(q, r, pieces) {
    let count = 0;
    for (const n of HexGrid.neighbors(q, r)) {
      const ns = pieces.get(HexGrid.key(n.q, n.r));
      if (ns && ns.length > 0) count++;
    }
    return count;
  }

  function queenEmptyNeighbors(q, r, pieces) {
    const empty = [];
    for (const n of HexGrid.neighbors(q, r)) {
      const ns = pieces.get(HexGrid.key(n.q, n.r));
      if (!ns || ns.length === 0) empty.push(n);
    }
    return empty;
  }

  // Count how many of a player's pieces are pinned (articulation points)
  function countPinnedPieces(pieces, player) {
    let pinned = 0;
    for (const [k, stack] of pieces) {
      if (stack.length === 0) continue;
      const top = stack[stack.length - 1];
      if (top.player === player && stack.length === 1) {
        const { q, r } = HexGrid.parse(k);
        if (HexGrid.isArticulationPoint(q, r, pieces)) pinned++;
      }
    }
    return pinned;
  }

  // Count mobile ants for a player
  function countMobileAnts(pieces, player, lastMoved) {
    let count = 0;
    for (const [k, stack] of pieces) {
      if (stack.length === 0) continue;
      const top = stack[stack.length - 1];
      if (top.player === player && top.type === 'ant' && stack.length === 1) {
        const { q, r } = HexGrid.parse(k);
        if (!HexGrid.isArticulationPoint(q, r, pieces)) count++;
      }
    }
    return count;
  }

  // Count pieces adjacent to a queen that belong to its OWN player (self-surround)
  function selfSurroundCount(q, r, pieces, queenPlayer) {
    let count = 0;
    for (const n of HexGrid.neighbors(q, r)) {
      const ns = pieces.get(HexGrid.key(n.q, n.r));
      if (ns && ns.length > 0 && ns[ns.length - 1].player === queenPlayer) count++;
    }
    return count;
  }

  // Check how many moves a queen would have (mobility)
  function queenMobility(q, r, pieces) {
    const occupied = Pieces.getOccupiedSet(pieces, HexGrid.key(q, r));
    let moves = 0;
    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      if (occupied.has(nk)) continue;
      let touchesHive = false;
      for (const nn of HexGrid.neighbors(n.q, n.r)) {
        if (occupied.has(HexGrid.key(nn.q, nn.r))) { touchesHive = true; break; }
      }
      if (!touchesHive) continue;
      if (!HexGrid.canSlide(q, r, n.q, n.r, occupied)) continue;
      moves++;
    }
    return moves;
  }

  // ======================== OPENING BOOK ========================
  // Hive opening principles:
  // - Never lead with queen or ant on turn 1
  // - Good openers: beetle, spider, grasshopper
  // - Place queen on turn 2 or 3 (not turn 1, and don't wait until forced on turn 4)
  // - After queen, deploy ants for offense and beetles to threaten queen
  // - Place pieces to create a compact shape, not a long chain

  // Opening priorities based on tournament-level play:
  // Ant-first or Spider-first are both strong competitive openers.
  // Queen on turn 2 is near-universal at tournament level.
  const OPENING_PRIORITY = {
    // Turn 1: ant is the strongest competitive opener, spider/grasshopper also good
    0: ['ant', 'spider', 'grasshopper', 'beetle', 'ladybug', 'mosquito', 'pillbug'],
    // Turn 2: queen MUST go down to unlock movement
    1: ['queen'],
    // Turn 3: deploy offense (ant if not placed yet, beetle for queen pressure)
    2: ['ant', 'beetle', 'mosquito', 'grasshopper', 'spider', 'ladybug'],
    // Turn 4+: ants and beetles are the primary offensive weapons
    3: ['ant', 'beetle', 'mosquito', 'ladybug', 'grasshopper', 'spider', 'pillbug'],
  };

  function getOpeningTypePriority(turnNum) {
    if (turnNum <= 3) return OPENING_PRIORITY[turnNum] || OPENING_PRIORITY[3];
    return OPENING_PRIORITY[3];
  }

  // ======================== STRATEGIC SCORING ========================

  function scoreAction(action, state, player, difficultyLevel) {
    const opponent = player === 1 ? 2 : 1;
    const myQueenPos = findQueen(state.pieces, player);
    const oppQueenPos = findQueen(state.pieces, opponent);
    const turnNum = state.playerTurns[player];
    let score = 0;

    // === PLACEMENT ===
    if (action.kind === 'place') {
      const typePriority = getOpeningTypePriority(turnNum);
      const priorityIdx = typePriority.indexOf(action.type);
      // Higher priority types get higher scores (index 0 = best)
      if (priorityIdx >= 0) score += (10 - priorityIdx) * 3;
      else score -= 5;

      // Place queen on turn 2 to unlock movement (tournament standard)
      if (action.type === 'queen' && turnNum === 1) score += 30;
      // Never place queen on turn 1 (too exposed, no support pieces)
      if (action.type === 'queen' && turnNum === 0) score -= 25;

      // After queen is placed, prefer offensive pieces
      if (myQueenPos && (action.type === 'ant' || action.type === 'beetle')) score += 8;

      // Placement position scoring
      if (oppQueenPos) {
        const dist = hexDist(action.q, action.r, oppQueenPos.q, oppQueenPos.r);
        // Place pieces near the opponent's queen
        score += Math.max(0, 8 - dist) * 3;
        // Adjacent to opponent queen is excellent
        if (dist === 1) score += 20;
      }

      // Protect own queen - place near it for defense
      if (myQueenPos) {
        const myDist = hexDist(action.q, action.r, myQueenPos.q, myQueenPos.r);
        const mySurround = queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
        // If own queen is threatened, don't place too far away
        if (mySurround >= 3 && myDist > 2) score -= 10;
      }

      // Prefer compact placement (adjacent to multiple friendly pieces)
      let friendlyAdj = 0;
      for (const n of HexGrid.neighbors(action.q, action.r)) {
        const ns = state.pieces.get(HexGrid.key(n.q, n.r));
        if (ns && ns.length > 0 && ns[ns.length - 1].player === player) friendlyAdj++;
      }
      score += friendlyAdj * 2; // compact is good, avoid long chains

      // Queen safety: don't place queen where it has few escape routes
      if (action.type === 'queen') {
        let openNeighbors = 0;
        for (const n of HexGrid.neighbors(action.q, action.r)) {
          const ns = state.pieces.get(HexGrid.key(n.q, n.r));
          if (!ns || ns.length === 0) openNeighbors++;
        }
        score += openNeighbors * 3; // more open = safer queen
        // Don't place queen adjacent to opponent pieces
        let enemyAdj = 0;
        for (const n of HexGrid.neighbors(action.q, action.r)) {
          const ns = state.pieces.get(HexGrid.key(n.q, n.r));
          if (ns && ns.length > 0 && ns[ns.length - 1].player === opponent) enemyAdj++;
        }
        score -= enemyAdj * 8;
      }
    }

    // === MOVEMENT ===
    if (action.kind === 'move') {
      // --- OFFENSE: move toward opponent queen ---
      if (oppQueenPos) {
        const distBefore = hexDist(action.fromQ, action.fromR, oppQueenPos.q, oppQueenPos.r);
        const distAfter = hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        const improvement = distBefore - distAfter;
        score += improvement * 6;

        // Landing adjacent to opponent queen is very strong
        if (distAfter === 1) {
          const currentSurround = queenSurroundCount(oppQueenPos.q, oppQueenPos.r, state.pieces);
          score += 20 + currentSurround * 8; // more surrounded = higher value
        }

        // Landing ON opponent queen (beetle) is devastating
        if (distAfter === 0 && action.pieceType === 'beetle') score += 50;

        // Ant offense: ants are best at reaching and surrounding the queen
        if (action.pieceType === 'ant' && distAfter <= 2) score += 12;

        // Beetle offense: beetles near queen are very threatening
        if (action.pieceType === 'beetle' && distAfter <= 2) score += 15;
      }

      // --- DEFENSE: protect own queen ---
      if (myQueenPos) {
        const mySurround = queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
        const distFromMyQueen = hexDist(action.fromQ, action.fromR, myQueenPos.q, myQueenPos.r);
        const distToMyQueen = hexDist(action.toQ, action.toR, myQueenPos.q, myQueenPos.r);

        // If our queen is in danger (3+ sides surrounded), prioritize defense
        if (mySurround >= 3) {
          // Moving a piece AWAY from threatened queen is bad
          if (distFromMyQueen === 1 && distToMyQueen > 1) score -= 25;
          // Moving to block an empty space next to our queen is great defense
          const emptyNbrs = queenEmptyNeighbors(myQueenPos.q, myQueenPos.r, state.pieces);
          for (const en of emptyNbrs) {
            if (action.toQ === en.q && action.toR === en.r) {
              // But only if the piece is friendly (we're filling our own queen's space)
              // Actually this is BAD - we'd be surrounding our own queen
              score -= 15;
            }
          }
        }

        // If our queen is very threatened (5 sides), desperate defense
        if (mySurround >= 5) {
          // Try to move an enemy piece away (if we have pillbug)
          // Or move our pieces to create an escape route
          score += 30; // any move is valuable when desperate
        }
      }

      // --- Don't move queen unnecessarily ---
      if (action.pieceType === 'queen') {
        // Moving queen is usually bad unless escaping danger
        score -= 8;
        if (myQueenPos) {
          const mySurround = queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
          if (mySurround >= 2) {
            // Queen escaping is good
            const newSurround = countSurroundAt(action.toQ, action.toR, state.pieces, player);
            if (newSurround < mySurround) score += 20;
          }
        }
      }

      // --- Avoid moving pieces that pin opponent pieces ---
      // If our piece is preventing an opponent piece from moving, don't move it
      if (!HexGrid.isArticulationPoint(action.fromQ, action.fromR, state.pieces)) {
        // Not an articulation point, ok to move
      } else {
        // Our piece is critical to hive connectivity - should already be blocked by rules
      }
    }

    // === PILLBUG SPECIAL ===
    if (action.kind === 'pillbug') {
      // Moving enemy piece away from our queen
      if (myQueenPos) {
        const distBefore = hexDist(action.fromQ, action.fromR, myQueenPos.q, myQueenPos.r);
        if (distBefore === 1) score += 25; // pull attacker away from queen
      }
      // Moving any piece next to opponent queen
      if (oppQueenPos) {
        const distAfter = hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (distAfter === 1) score += 20;
      }
    }

    return score;
  }

  // Count how many neighbors a position would have (predictive)
  function countSurroundAt(q, r, pieces, excludePlayer) {
    let count = 0;
    for (const n of HexGrid.neighbors(q, r)) {
      const ns = pieces.get(HexGrid.key(n.q, n.r));
      if (ns && ns.length > 0) count++;
    }
    return count;
  }

  // ======================== BOARD EVALUATION ========================

  function evaluateBoard(pieces, player) {
    const opponent = player === 1 ? 2 : 1;
    let score = 0;

    const myQueen = findQueen(pieces, player);
    const oppQueen = findQueen(pieces, opponent);

    // === QUEEN LIBERTY COUNT (most important heuristic) ===
    if (oppQueen) {
      const s = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      score += s * 30;
      if (s === 6) return 10000;
      if (s === 5) score += 120;
      // Bonus if opponent's OWN pieces surround their queen (they did it to themselves)
      const selfS = selfSurroundCount(oppQueen.q, oppQueen.r, pieces, opponent);
      score += selfS * 8; // exploit opponent's self-surround
    }

    if (myQueen) {
      const s = queenSurroundCount(myQueen.q, myQueen.r, pieces);
      score -= s * 35;
      if (s === 6) return -10000;
      if (s === 5) score -= 140;

      // Queen mobility (escape routes)
      const mobility = queenMobility(myQueen.q, myQueen.r, pieces);
      score += mobility * 6;
    }

    // === PIN COUNT ===
    const myPinned = countPinnedPieces(pieces, player);
    const oppPinned = countPinnedPieces(pieces, opponent);
    score += (oppPinned - myPinned) * 5; // more opponent pins = better

    // === MOBILE ANTS (key offensive resource) ===
    const myAnts = countMobileAnts(pieces, player, null);
    const oppAnts = countMobileAnts(pieces, opponent, null);
    score += myAnts * 10; // mobile ants are extremely valuable
    score -= oppAnts * 8;
    // Two mobile ants is near-winning if opponent queen is exposed
    if (myAnts >= 2 && oppQueen) {
      const oppS = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      if (oppS >= 2) score += 30;
    }

    // === PIECE PROXIMITY TO OPPONENT QUEEN ===
    if (oppQueen) {
      for (const [k, stack] of pieces) {
        if (stack.length === 0) continue;
        const top = stack[stack.length - 1];
        if (top.player === player) {
          const { q, r } = HexGrid.parse(k);
          const dist = hexDist(q, r, oppQueen.q, oppQueen.r);
          if (dist <= 3) score += (4 - dist) * 4;
          // Beetle on/adjacent to queen is devastating
          if (top.type === 'beetle' && dist === 0) score += 40;
          if (top.type === 'beetle' && dist === 1) score += 18;
          if (top.type === 'ant' && dist <= 2) score += 10;
        }
      }
    }

    return score;
  }

  // Simulate an action and evaluate the resulting board
  function simulateAction(action, state, player) {
    const clonedPieces = new Map();
    for (const [k, stack] of state.pieces) {
      clonedPieces.set(k, stack.map(p => ({ ...p })));
    }

    if (action.kind === 'place') {
      const k = HexGrid.key(action.q, action.r);
      if (!clonedPieces.has(k)) clonedPieces.set(k, []);
      clonedPieces.get(k).push({ player, type: action.type });
    } else if (action.kind === 'move' || action.kind === 'pillbug') {
      const fromK = HexGrid.key(action.fromQ, action.fromR);
      const toK = HexGrid.key(action.toQ, action.toR);
      const stack = clonedPieces.get(fromK);
      const piece = stack.pop();
      if (stack.length === 0) clonedPieces.delete(fromK);
      if (!clonedPieces.has(toK)) clonedPieces.set(toK, []);
      clonedPieces.get(toK).push(piece);
    }

    return evaluateBoard(clonedPieces, player);
  }

  // ======================== DIFFICULTY-BASED PICKING ========================

  function pickAction(state) {
    const actions = getAllActions(state, aiPlayer);
    if (actions.length === 0) return null;

    switch (difficulty) {
      case 'easy':       return pickEasy(actions, state);
      case 'medium':     return pickMedium(actions, state);
      case 'hard':       return pickHard(actions, state);
      case 'impossible': return pickImpossible(actions, state);
      default:           return pickMedium(actions, state);
    }
  }

  // EASY: uses opening book loosely, random from top 50%
  function pickEasy(actions, state) {
    const scored = actions.map(a => ({
      action: a,
      score: scoreAction(a, state, aiPlayer) + Math.random() * 40,
    }));
    scored.sort((a, b) => b.score - a.score);
    // Pick randomly from top half
    const pool = scored.slice(0, Math.max(1, Math.ceil(scored.length / 2)));
    return pool[Math.floor(Math.random() * pool.length)].action;
  }

  // MEDIUM: uses opening book + heuristics, small randomness
  function pickMedium(actions, state) {
    const scored = actions.map(a => ({
      action: a,
      score: scoreAction(a, state, aiPlayer) + Math.random() * 10,
    }));
    scored.sort((a, b) => b.score - a.score);
    // Pick from top 3
    const top = scored.slice(0, Math.min(3, scored.length));
    return top[Math.floor(Math.random() * top.length)].action;
  }

  // HARD: heuristics + 1-ply simulation, picks from top 2
  function pickHard(actions, state) {
    const scored = actions.map(a => {
      const heuristic = scoreAction(a, state, aiPlayer);
      const simScore = simulateAction(a, state, aiPlayer);
      return { action: a, score: heuristic * 2 + simScore + Math.random() * 5 };
    });
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, Math.min(2, scored.length));
    return top[Math.floor(Math.random() * top.length)].action;
  }

  // IMPOSSIBLE: deep heuristics + simulation + opponent response analysis
  function pickImpossible(actions, state) {
    const opponent = aiPlayer === 1 ? 2 : 1;
    let bestScore = -Infinity;
    let bestAction = actions[0];

    for (const action of actions) {
      const heuristic = scoreAction(action, state, aiPlayer) * 3;
      const simScore = simulateAction(action, state, aiPlayer) * 2;

      // 2-ply: simulate our move, then find opponent's best response
      let opponentBestCounter = 0;
      // Clone state after our move
      const clonedPieces = new Map();
      for (const [k, stack] of state.pieces) {
        clonedPieces.set(k, stack.map(p => ({ ...p })));
      }
      const clonedHands = { 1: { ...state.hands[1] }, 2: { ...state.hands[2] } };
      const clonedQueenPlaced = { ...state.queenPlaced };
      const clonedTurns = { ...state.playerTurns };

      // Apply our action
      if (action.kind === 'place') {
        const k = HexGrid.key(action.q, action.r);
        if (!clonedPieces.has(k)) clonedPieces.set(k, []);
        clonedPieces.get(k).push({ player: aiPlayer, type: action.type });
        clonedHands[aiPlayer][action.type]--;
        if (action.type === 'queen') clonedQueenPlaced[aiPlayer] = true;
        clonedTurns[aiPlayer]++;
      } else if (action.kind === 'move' || action.kind === 'pillbug') {
        const fromK = HexGrid.key(action.fromQ, action.fromR);
        const toK = HexGrid.key(action.toQ, action.toR);
        const stack = clonedPieces.get(fromK);
        const piece = stack.pop();
        if (stack.length === 0) clonedPieces.delete(fromK);
        if (!clonedPieces.has(toK)) clonedPieces.set(toK, []);
        clonedPieces.get(toK).push(piece);
        clonedTurns[aiPlayer]++;
      }

      // Evaluate from opponent's perspective (negated = bad for us)
      const oppEval = evaluateBoard(clonedPieces, opponent);
      opponentBestCounter = -oppEval * 0.5;

      const totalScore = heuristic + simScore + opponentBestCounter;
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestAction = action;
      }
    }

    return bestAction;
  }

  // ======================== PUBLIC API ========================

  function takeTurn(state) {
    if (!enabled || state.currentPlayer !== aiPlayer || state.gameOver) return false;
    const action = pickAction(state);
    if (!action) return false;
    executeAction(action);
    return true;
  }

  return {
    setDifficulty, getDifficulty, setEnabled, isEnabled, getAIPlayer, takeTurn,
  };
})();
