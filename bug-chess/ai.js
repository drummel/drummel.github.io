// AI opponent for Bug Chess
// 4 difficulty levels with proper Hive strategy
// See STRATEGY.md for detailed design rationale

const AI = (() => {
  let difficulty = 'medium';
  let aiPlayer = 2;
  let enabled = false;
  let moveHistory = []; // track recent moves for oscillation detection

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

  function isAdjacentTo(q1, r1, q2, r2) {
    return hexDist(q1, r1, q2, r2) === 1;
  }

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

  function countMobileAnts(pieces, player) {
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

  function selfSurroundCount(q, r, pieces, queenPlayer) {
    let count = 0;
    for (const n of HexGrid.neighbors(q, r)) {
      const ns = pieces.get(HexGrid.key(n.q, n.r));
      if (ns && ns.length > 0 && ns[ns.length - 1].player === queenPlayer) count++;
    }
    return count;
  }

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

  // How many pieces does a player still have in hand?
  function handCount(state, player) {
    return Object.values(state.hands[player]).reduce((a, b) => a + b, 0);
  }

  // ======================== OPENING BOOK ========================

  const OPENING_PRIORITY = {
    0: ['spider', 'grasshopper', 'ladybug', 'pillbug', 'mosquito', 'beetle'],
    1: ['queen'],
    2: ['ant', 'beetle', 'mosquito', 'grasshopper', 'spider', 'ladybug'],
    3: ['ant', 'beetle', 'mosquito', 'ladybug', 'grasshopper', 'spider', 'pillbug'],
  };

  function getOpeningTypePriority(turnNum) {
    if (turnNum <= 3) return OPENING_PRIORITY[turnNum] || OPENING_PRIORITY[3];
    return OPENING_PRIORITY[3];
  }

  // ======================== OSCILLATION DETECTION ========================

  function getMoveKey(action) {
    if (action.kind === 'place') return `p:${action.type}:${action.q},${action.r}`;
    if (action.kind === 'move') return `m:${action.fromQ},${action.fromR}:${action.toQ},${action.toR}`;
    return `pb:${action.fromQ},${action.fromR}:${action.toQ},${action.toR}`;
  }

  function isOscillating(action) {
    if (action.kind !== 'move') return false;
    // Check if this move reverses a recent move (piece going back where it was)
    for (let i = moveHistory.length - 1; i >= Math.max(0, moveHistory.length - 4); i--) {
      const prev = moveHistory[i];
      if (prev.kind === 'move' &&
          prev.fromQ === action.toQ && prev.fromR === action.toR &&
          prev.toQ === action.fromQ && prev.toR === action.fromR) {
        return true;
      }
    }
    return false;
  }

  // ======================== STRATEGIC SCORING ========================

  function scoreAction(action, state, player) {
    const opponent = player === 1 ? 2 : 1;
    const myQueenPos = findQueen(state.pieces, player);
    const oppQueenPos = findQueen(state.pieces, opponent);
    const turnNum = state.playerTurns[player];
    const piecesInHand = handCount(state, player);
    let score = 0;

    // ======== OSCILLATION PENALTY ========
    if (isOscillating(action)) score -= 50;

    // ======== PLACEMENT ========
    if (action.kind === 'place') {
      const typePriority = getOpeningTypePriority(turnNum);
      const priorityIdx = typePriority.indexOf(action.type);
      if (priorityIdx >= 0) score += (10 - priorityIdx) * 3;

      // First piece pinned forever — don't waste ants/beetles
      if (turnNum === 0 && action.type === 'ant') score -= 30;
      if (turnNum === 0 && action.type === 'beetle') score -= 15;

      // Queen timing
      if (action.type === 'queen' && turnNum === 1) score += 30;
      if (action.type === 'queen' && turnNum === 0) score -= 25;

      // DEPLOYMENT URGENCY: strongly prefer getting pieces onto the board
      // Pieces in hand are useless — each unplayed piece is wasted potential
      if (piecesInHand > 3) score += 15; // strong incentive to keep placing
      if (action.type === 'ant' && myQueenPos) score += 12; // ants are urgent
      if (action.type === 'beetle' && myQueenPos) score += 10;

      // Position scoring
      if (oppQueenPos) {
        const dist = hexDist(action.q, action.r, oppQueenPos.q, oppQueenPos.r);
        score += Math.max(0, 8 - dist) * 3;
        if (dist === 1) score += 20;
      }

      if (myQueenPos) {
        const myDist = hexDist(action.q, action.r, myQueenPos.q, myQueenPos.r);
        const mySurround = queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
        if (mySurround >= 3 && myDist > 2) score -= 10;
      }

      // Compact placement
      let friendlyAdj = 0;
      for (const n of HexGrid.neighbors(action.q, action.r)) {
        const ns = state.pieces.get(HexGrid.key(n.q, n.r));
        if (ns && ns.length > 0 && ns[ns.length - 1].player === player) friendlyAdj++;
      }
      score += friendlyAdj * 2;

      // Queen safety
      if (action.type === 'queen') {
        let openNeighbors = 0, enemyAdj = 0;
        for (const n of HexGrid.neighbors(action.q, action.r)) {
          const ns = state.pieces.get(HexGrid.key(n.q, n.r));
          if (!ns || ns.length === 0) openNeighbors++;
          else if (ns[ns.length - 1].player === opponent) enemyAdj++;
        }
        score += openNeighbors * 3;
        score -= enemyAdj * 8;
      }
    }

    // ======== MOVEMENT ========
    if (action.kind === 'move') {

      // --- CRITICAL: Check what we're LEAVING behind ---
      // If the piece is currently adjacent to the opponent's queen, moving it
      // AWAY reduces their surround count — this is terrible unless we're
      // moving to another adjacent hex (maintaining surround) or winning.
      if (oppQueenPos) {
        const wasAdjacentToOppQueen = isAdjacentTo(action.fromQ, action.fromR, oppQueenPos.q, oppQueenPos.r);
        const willBeAdjacentToOppQueen = isAdjacentTo(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);

        if (wasAdjacentToOppQueen && !willBeAdjacentToOppQueen) {
          // Moving AWAY from opponent's queen — heavy penalty
          score -= 35;
        }

        if (!wasAdjacentToOppQueen && willBeAdjacentToOppQueen) {
          // Moving TO opponent's queen from far away — this is the good move
          const currentSurround = queenSurroundCount(oppQueenPos.q, oppQueenPos.r, state.pieces);
          score += 25 + currentSurround * 10;
        }

        if (wasAdjacentToOppQueen && willBeAdjacentToOppQueen) {
          // Shuffling between two queen-adjacent hexes — nearly useless
          score -= 5;
        }

        // Beetle on queen
        const distAfter = hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (distAfter === 0 && action.pieceType === 'beetle') score += 50;

        // General approach bonus (only if not already adjacent)
        if (!wasAdjacentToOppQueen) {
          const distBefore = hexDist(action.fromQ, action.fromR, oppQueenPos.q, oppQueenPos.r);
          score += (distBefore - distAfter) * 4;
        }
      }

      // --- DEFENSE ---
      if (myQueenPos) {
        const mySurround = queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
        const distFromMyQueen = hexDist(action.fromQ, action.fromR, myQueenPos.q, myQueenPos.r);
        const distToMyQueen = hexDist(action.toQ, action.toR, myQueenPos.q, myQueenPos.r);

        if (mySurround >= 3 && distFromMyQueen === 1 && distToMyQueen > 1) {
          score -= 20; // don't abandon a threatened queen
        }
      }

      // --- Don't move queen unless escaping ---
      if (action.pieceType === 'queen') {
        score -= 8;
        if (myQueenPos) {
          const mySurround = queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
          if (mySurround >= 2) {
            // Simulate: would the new position have fewer neighbors?
            const newSurround = (() => {
              let c = 0;
              for (const n of HexGrid.neighbors(action.toQ, action.toR)) {
                const nk = HexGrid.key(n.q, n.r);
                if (nk === HexGrid.key(action.fromQ, action.fromR)) continue; // we're leaving
                const ns = state.pieces.get(nk);
                if (ns && ns.length > 0) c++;
              }
              return c;
            })();
            if (newSurround < mySurround) score += 20; // escaping is good
          }
        }
      }

      // --- Prefer placing over aimless movement ---
      // If we have lots of pieces in hand, moving is usually worse than placing
      if (piecesInHand > 4) score -= 10;
      if (piecesInHand > 2 && oppQueenPos) {
        const distAfter = hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (distAfter > 2) score -= 8; // not even threatening, just place instead
      }
    }

    // ======== PILLBUG SPECIAL ========
    if (action.kind === 'pillbug') {
      if (myQueenPos) {
        const distBefore = hexDist(action.fromQ, action.fromR, myQueenPos.q, myQueenPos.r);
        if (distBefore === 1) score += 25;
      }
      if (oppQueenPos) {
        const distAfter = hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (distAfter === 1) score += 20;
      }
    }

    return score;
  }

  // ======================== BOARD EVALUATION ========================

  function evaluateBoard(pieces, player) {
    const opponent = player === 1 ? 2 : 1;
    let score = 0;

    const myQueen = findQueen(pieces, player);
    const oppQueen = findQueen(pieces, opponent);

    if (oppQueen) {
      const s = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      score += s * 30;
      if (s === 6) return 10000;
      if (s === 5) score += 120;
      const selfS = selfSurroundCount(oppQueen.q, oppQueen.r, pieces, opponent);
      score += selfS * 8;
    }

    if (myQueen) {
      const s = queenSurroundCount(myQueen.q, myQueen.r, pieces);
      score -= s * 35;
      if (s === 6) return -10000;
      if (s === 5) score -= 140;
      const mobility = queenMobility(myQueen.q, myQueen.r, pieces);
      score += mobility * 6;
    }

    const myPinned = countPinnedPieces(pieces, player);
    const oppPinned = countPinnedPieces(pieces, opponent);
    score += (oppPinned - myPinned) * 5;

    const myAnts = countMobileAnts(pieces, player);
    const oppAnts = countMobileAnts(pieces, opponent);
    score += myAnts * 10;
    score -= oppAnts * 8;
    if (myAnts >= 2 && oppQueen) {
      const oppS = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      if (oppS >= 2) score += 30;
    }

    if (oppQueen) {
      for (const [k, stack] of pieces) {
        if (stack.length === 0) continue;
        const top = stack[stack.length - 1];
        if (top.player === player) {
          const { q, r } = HexGrid.parse(k);
          const dist = hexDist(q, r, oppQueen.q, oppQueen.r);
          if (dist <= 3) score += (4 - dist) * 4;
          if (top.type === 'beetle' && dist === 0) score += 40;
          if (top.type === 'beetle' && dist === 1) score += 18;
          if (top.type === 'ant' && dist <= 2) score += 10;
        }
      }
    }

    return score;
  }

  // DELTA evaluation: how much does the board improve from this action?
  function simulateDelta(action, state, player) {
    const before = evaluateBoard(state.pieces, player);

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

    const after = evaluateBoard(clonedPieces, player);
    return after - before;
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

  function pickEasy(actions, state) {
    const scored = actions.map(a => ({
      action: a,
      score: scoreAction(a, state, aiPlayer) + Math.random() * 40,
    }));
    scored.sort((a, b) => b.score - a.score);
    const pool = scored.slice(0, Math.max(1, Math.ceil(scored.length / 2)));
    return pool[Math.floor(Math.random() * pool.length)].action;
  }

  function pickMedium(actions, state) {
    const scored = actions.map(a => ({
      action: a,
      score: scoreAction(a, state, aiPlayer) + Math.random() * 10,
    }));
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, Math.min(3, scored.length));
    return top[Math.floor(Math.random() * top.length)].action;
  }

  function pickHard(actions, state) {
    const scored = actions.map(a => {
      const heuristic = scoreAction(a, state, aiPlayer);
      const delta = simulateDelta(a, state, aiPlayer);
      return { action: a, score: heuristic * 2 + delta * 3 + Math.random() * 5 };
    });
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, Math.min(2, scored.length));
    return top[Math.floor(Math.random() * top.length)].action;
  }

  function pickImpossible(actions, state) {
    const opponent = aiPlayer === 1 ? 2 : 1;
    let bestScore = -Infinity;
    let bestAction = actions[0];

    for (const action of actions) {
      const heuristic = scoreAction(action, state, aiPlayer) * 2;
      const delta = simulateDelta(action, state, aiPlayer) * 3;

      // 2-ply: evaluate opponent's perspective after our move
      const clonedPieces = new Map();
      for (const [k, stack] of state.pieces) {
        clonedPieces.set(k, stack.map(p => ({ ...p })));
      }

      if (action.kind === 'place') {
        const k = HexGrid.key(action.q, action.r);
        if (!clonedPieces.has(k)) clonedPieces.set(k, []);
        clonedPieces.get(k).push({ player: aiPlayer, type: action.type });
      } else if (action.kind === 'move' || action.kind === 'pillbug') {
        const fromK = HexGrid.key(action.fromQ, action.fromR);
        const toK = HexGrid.key(action.toQ, action.toR);
        const stack = clonedPieces.get(fromK);
        const piece = stack.pop();
        if (stack.length === 0) clonedPieces.delete(fromK);
        if (!clonedPieces.has(toK)) clonedPieces.set(toK, []);
        clonedPieces.get(toK).push(piece);
      }

      // How good does the board look for the opponent after our move?
      // (higher opponent eval = worse for us)
      const oppEval = evaluateBoard(clonedPieces, opponent);
      const counterPenalty = -oppEval * 0.5;

      const totalScore = heuristic + delta + counterPenalty;
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

    // Track move for oscillation detection
    moveHistory.push(action);
    if (moveHistory.length > 10) moveHistory.shift();

    executeAction(action);
    return true;
  }

  function reset() {
    moveHistory = [];
  }

  return {
    setDifficulty, getDifficulty, setEnabled, isEnabled, getAIPlayer, takeTurn, reset,
  };
})();
