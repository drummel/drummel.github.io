// AI opponent for Bug Chess
// Supports 4 difficulty levels: easy, medium, hard, impossible

const AI = (() => {
  let difficulty = 'medium'; // easy, medium, hard, impossible
  let aiPlayer = 2; // AI always plays as player 2 (black)
  let enabled = false;

  function setDifficulty(d) { difficulty = d; }
  function getDifficulty() { return difficulty; }
  function setEnabled(e) { enabled = e; }
  function isEnabled() { return enabled; }
  function getAIPlayer() { return aiPlayer; }

  // Get all valid actions for a player: placements + moves + pillbug specials
  function getAllActions(state, player) {
    const actions = [];
    const hand = state.hands[player];
    const mustQueen = GameState.mustPlaceQueen(player);

    // Placement actions
    const hasHandPieces = Object.values(hand).some(c => c > 0);
    if (hasHandPieces) {
      const positions = GameState.getPlacementPositions(player);
      for (const pos of positions) {
        for (const [type, info] of Object.entries(Pieces.getTypes())) {
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

  // Execute an action
  function executeAction(action) {
    switch (action.kind) {
      case 'place':
        GameState.placePiece(action.type, action.q, action.r);
        break;
      case 'move':
        GameState.movePiece(action.fromQ, action.fromR, action.toQ, action.toR);
        break;
      case 'pillbug':
        GameState.pillbugMove(action.pillQ, action.pillR, action.fromQ, action.fromR, action.toQ, action.toR);
        break;
    }
  }

  // Count how many of a queen's 6 neighbors are occupied
  function queenSurroundCount(q, r, pieces) {
    let count = 0;
    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      const ns = pieces.get(nk);
      if (ns && ns.length > 0) count++;
    }
    return count;
  }

  // Find a player's queen position
  function findQueen(pieces, player) {
    for (const [k, stack] of pieces) {
      for (const piece of stack) {
        if (piece.type === 'queen' && piece.player === player) {
          return HexGrid.parse(k);
        }
      }
    }
    return null;
  }

  // Hex distance
  function hexDist(q1, r1, q2, r2) {
    const s1 = -q1 - r1, s2 = -q2 - r2;
    return Math.max(Math.abs(q1 - q2), Math.abs(r1 - r2), Math.abs(s1 - s2));
  }

  // Score an action based on heuristics
  function scoreAction(action, state, player) {
    const opponent = player === 1 ? 2 : 1;
    const myQueenPos = findQueen(state.pieces, player);
    const oppQueenPos = findQueen(state.pieces, opponent);
    let score = 0;

    // === PLACEMENT SCORING ===
    if (action.kind === 'place') {
      // Queen placement priority
      if (action.type === 'queen') {
        // Place queen early but not first move
        if (state.playerTurns[player] >= 2) score += 5;
        // Prefer safer positions (fewer enemy neighbors)
        const neighbors = HexGrid.neighbors(action.q, action.r);
        let enemyAdj = 0;
        for (const n of neighbors) {
          const nk = HexGrid.key(n.q, n.r);
          const ns = state.pieces.get(nk);
          if (ns && ns.length > 0 && ns[ns.length - 1].player === opponent) enemyAdj++;
        }
        score -= enemyAdj * 3;
      }

      // Ant and beetle are strong pieces - save them or place strategically
      if (action.type === 'ant') score += 3;
      if (action.type === 'beetle') score += 2;
      if (action.type === 'spider') score += 1;

      // Place near opponent's queen if possible
      if (oppQueenPos) {
        const dist = hexDist(action.q, action.r, oppQueenPos.q, oppQueenPos.r);
        score += Math.max(0, 5 - dist);
      }
    }

    // === MOVEMENT SCORING ===
    if (action.kind === 'move') {
      // Moving toward opponent's queen is good
      if (oppQueenPos) {
        const distBefore = hexDist(action.fromQ, action.fromR, oppQueenPos.q, oppQueenPos.r);
        const distAfter = hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        score += (distBefore - distAfter) * 4;

        // Adjacent to opponent queen is great
        if (distAfter === 1) score += 15;
        // ON opponent queen surroundings - count how many sides filled
        if (distAfter === 1) {
          const oppSurround = queenSurroundCount(oppQueenPos.q, oppQueenPos.r, state.pieces);
          score += oppSurround * 5; // more surrounded = higher value to add another
        }
      }

      // Moving away from own queen if it's threatened
      if (myQueenPos) {
        const myDistBefore = hexDist(action.fromQ, action.fromR, myQueenPos.q, myQueenPos.r);
        const myDistAfter = hexDist(action.toQ, action.toR, myQueenPos.q, myQueenPos.r);
        const mySurround = queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
        // Don't move pieces away from a threatened queen
        if (mySurround >= 3 && myDistBefore === 1 && myDistAfter > 1) {
          score -= 10;
        }
      }

      // Ants are best movers - prefer moving them offensively
      if (action.pieceType === 'ant') score += 2;
      if (action.pieceType === 'beetle' && oppQueenPos) {
        const dist = hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (dist <= 1) score += 10; // beetle on/near queen is devastating
      }
    }

    // === PILLBUG SPECIAL SCORING ===
    if (action.kind === 'pillbug') {
      // Moving an opponent's piece away from our queen is great
      if (myQueenPos) {
        const distBefore = hexDist(action.fromQ, action.fromR, myQueenPos.q, myQueenPos.r);
        if (distBefore === 1) score += 12; // pull enemy away from our queen
      }
      // Moving any piece next to opponent's queen
      if (oppQueenPos) {
        const distAfter = hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (distAfter === 1) score += 10;
      }
    }

    return score;
  }

  // Simulate an action and evaluate board position
  function simulateAndEvaluate(action, state, player) {
    // Deep-clone the pieces map and hands
    const clonedPieces = new Map();
    for (const [k, stack] of state.pieces) {
      clonedPieces.set(k, stack.map(p => ({ ...p })));
    }
    const clonedHands = {
      1: { ...state.hands[1] },
      2: { ...state.hands[2] },
    };
    const clonedQueenPlaced = { ...state.queenPlaced };
    const clonedPlayerTurns = { ...state.playerTurns };

    // Apply the action to cloned state
    if (action.kind === 'place') {
      const k = HexGrid.key(action.q, action.r);
      if (!clonedPieces.has(k)) clonedPieces.set(k, []);
      clonedPieces.get(k).push({ player, type: action.type });
      clonedHands[player][action.type]--;
      if (action.type === 'queen') clonedQueenPlaced[player] = true;
      clonedPlayerTurns[player]++;
    } else if (action.kind === 'move') {
      const fromK = HexGrid.key(action.fromQ, action.fromR);
      const toK = HexGrid.key(action.toQ, action.toR);
      const stack = clonedPieces.get(fromK);
      const piece = stack.pop();
      if (stack.length === 0) clonedPieces.delete(fromK);
      if (!clonedPieces.has(toK)) clonedPieces.set(toK, []);
      clonedPieces.get(toK).push(piece);
    } else if (action.kind === 'pillbug') {
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

  // Static board evaluation from a player's perspective
  function evaluateBoard(pieces, player) {
    const opponent = player === 1 ? 2 : 1;
    let score = 0;

    const myQueen = findQueenInPieces(pieces, player);
    const oppQueen = findQueenInPieces(pieces, opponent);

    if (oppQueen) {
      const oppSurround = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      score += oppSurround * 20; // surround opponent = very good
      if (oppSurround === 6) score += 1000; // win!
    }

    if (myQueen) {
      const mySurround = queenSurroundCount(myQueen.q, myQueen.r, pieces);
      score -= mySurround * 25; // our queen surrounded = very bad
      if (mySurround === 6) score -= 1000; // loss!
    }

    // Count pieces near opponent queen
    if (oppQueen) {
      for (const [k, stack] of pieces) {
        if (stack.length === 0) continue;
        const top = stack[stack.length - 1];
        if (top.player === player) {
          const { q, r } = HexGrid.parse(k);
          const dist = hexDist(q, r, oppQueen.q, oppQueen.r);
          if (dist <= 2) score += (3 - dist) * 3;
        }
      }
    }

    // Mobility: more moves available is better
    let myMoves = 0;
    for (const [k, stack] of pieces) {
      if (stack.length === 0) continue;
      const top = stack[stack.length - 1];
      if (top.player === player) {
        const { q, r } = HexGrid.parse(k);
        const { moves } = Pieces.getValidMoves(q, r, pieces, null);
        myMoves += moves.length;
      }
    }
    score += myMoves * 0.5;

    return score;
  }

  function findQueenInPieces(pieces, player) {
    for (const [k, stack] of pieces) {
      for (const piece of stack) {
        if (piece.type === 'queen' && piece.player === player) {
          return HexGrid.parse(k);
        }
      }
    }
    return null;
  }

  // Pick the best action based on difficulty
  function pickAction(state) {
    const actions = getAllActions(state, aiPlayer);
    if (actions.length === 0) return null;

    switch (difficulty) {
      case 'easy': return pickEasy(actions, state);
      case 'medium': return pickMedium(actions, state);
      case 'hard': return pickHard(actions, state);
      case 'impossible': return pickImpossible(actions, state);
      default: return pickMedium(actions, state);
    }
  }

  // Easy: mostly random with slight preference for placements
  function pickEasy(actions, state) {
    // 70% random, 30% use basic scoring
    if (Math.random() < 0.7) {
      return actions[Math.floor(Math.random() * actions.length)];
    }
    return pickWithScoring(actions, state, 0.5);
  }

  // Medium: use heuristic scoring with some randomness
  function pickMedium(actions, state) {
    return pickWithScoring(actions, state, 0.3);
  }

  // Hard: use heuristic scoring + simulation with little randomness
  function pickHard(actions, state) {
    const scored = actions.map(a => {
      const heuristic = scoreAction(a, state, aiPlayer);
      const simScore = simulateAndEvaluate(a, state, aiPlayer);
      return { action: a, score: heuristic * 2 + simScore };
    });
    scored.sort((a, b) => b.score - a.score);

    // Pick from top 3 with weighted randomness
    const top = scored.slice(0, Math.min(3, scored.length));
    const weights = top.map((_, i) => Math.pow(0.5, i));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalWeight;
    for (let i = 0; i < top.length; i++) {
      r -= weights[i];
      if (r <= 0) return top[i].action;
    }
    return top[0].action;
  }

  // Impossible: exhaustive simulation, always picks the best
  function pickImpossible(actions, state) {
    let bestScore = -Infinity;
    let bestAction = actions[0];

    for (const action of actions) {
      const heuristic = scoreAction(action, state, aiPlayer) * 3;
      const simScore = simulateAndEvaluate(action, state, aiPlayer) * 2;

      // For impossible, also consider opponent's best response
      let opponentThreat = 0;
      // Simulate our move, then check opponent's best counter
      const clonedPieces = new Map();
      for (const [k, stack] of state.pieces) {
        clonedPieces.set(k, stack.map(p => ({ ...p })));
      }
      // Quick threat assessment: how much can opponent surround our queen after this move?
      const myQueen = findQueenInPieces(state.pieces, aiPlayer);
      if (myQueen) {
        const mySurround = queenSurroundCount(myQueen.q, myQueen.r, state.pieces);
        if (mySurround >= 4) opponentThreat -= 30; // we're in danger, prioritize defense
      }

      const totalScore = heuristic + simScore + opponentThreat;
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestAction = action;
      }
    }

    return bestAction;
  }

  // Generic scoring-based pick with randomness factor
  function pickWithScoring(actions, state, randomFactor) {
    const scored = actions.map(a => ({
      action: a,
      score: scoreAction(a, state, aiPlayer) + (Math.random() * randomFactor * 20),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0].action;
  }

  // Called by App after player's turn, if AI is enabled and it's AI's turn
  function takeTurn(state) {
    if (!enabled || state.currentPlayer !== aiPlayer || state.gameOver) return false;

    const action = pickAction(state);
    if (!action) return false;

    executeAction(action);
    return true;
  }

  return {
    setDifficulty,
    getDifficulty,
    setEnabled,
    isEnabled,
    getAIPlayer,
    takeTurn,
  };
})();
