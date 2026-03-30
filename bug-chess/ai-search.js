// AI Search Engine for Bug Chess
// Negamax with alpha-beta pruning, iterative deepening, move ordering,
// quiescence search, and killer move heuristic
// See STRATEGY.md for design rationale

const AISearch = (() => {

  // ======================== MOVE GENERATION ========================

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

  // ======================== HEURISTIC SCORING (for move ordering) ========================

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

  // Fast heuristic score for move ordering (not the full evaluation)
  function scoreActionForOrdering(action, state, player) {
    const opponent = player === 1 ? 2 : 1;
    const oppQueenPos = AIEval.findQueen(state.pieces, opponent);
    const myQueenPos = AIEval.findQueen(state.pieces, player);
    const turnNum = state.playerTurns[player];
    const piecesInHand = AIEval.handCount(state, player);
    let score = 0;

    if (action.kind === 'place') {
      const typePriority = getOpeningTypePriority(turnNum);
      const priorityIdx = typePriority.indexOf(action.type);
      if (priorityIdx >= 0) score += (10 - priorityIdx) * 3;

      if (turnNum === 0 && action.type === 'ant') score -= 30;
      if (turnNum === 0 && action.type === 'beetle') score -= 15;
      if (action.type === 'queen' && turnNum === 1) score += 30;
      if (action.type === 'queen' && turnNum === 0) score -= 25;
      if (piecesInHand > 3) score += 15;
      if (action.type === 'ant' && myQueenPos) score += 12;
      if (action.type === 'beetle' && myQueenPos) score += 10;

      if (oppQueenPos) {
        const dist = AIEval.hexDist(action.q, action.r, oppQueenPos.q, oppQueenPos.r);
        score += Math.max(0, 8 - dist) * 3;
        if (dist === 1) score += 20;
      }

      if (myQueenPos) {
        const mySurround = AIEval.queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
        if (mySurround >= 3) {
          const myDist = AIEval.hexDist(action.q, action.r, myQueenPos.q, myQueenPos.r);
          if (myDist > 2) score -= 10;
        }
      }

      let friendlyAdj = 0;
      for (const n of HexGrid.neighbors(action.q, action.r)) {
        const ns = state.pieces.get(HexGrid.key(n.q, n.r));
        if (ns && ns.length > 0 && ns[ns.length - 1].player === player) friendlyAdj++;
      }
      score += friendlyAdj * 2;

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

    if (action.kind === 'move') {
      if (oppQueenPos) {
        const wasAdj = AIEval.isAdjacentTo(action.fromQ, action.fromR, oppQueenPos.q, oppQueenPos.r);
        const willBeAdj = AIEval.isAdjacentTo(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);

        if (wasAdj && !willBeAdj) score -= 35;
        if (!wasAdj && willBeAdj) {
          const currentSurround = AIEval.queenSurroundCount(oppQueenPos.q, oppQueenPos.r, state.pieces);
          score += 25 + currentSurround * 10;
        }
        if (wasAdj && willBeAdj) score -= 5;

        const distAfter = AIEval.hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (distAfter === 0 && action.pieceType === 'beetle') score += 50;

        if (!wasAdj) {
          const distBefore = AIEval.hexDist(action.fromQ, action.fromR, oppQueenPos.q, oppQueenPos.r);
          score += (distBefore - distAfter) * 4;
        }
      }

      if (myQueenPos) {
        const mySurround = AIEval.queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
        const distFromMyQueen = AIEval.hexDist(action.fromQ, action.fromR, myQueenPos.q, myQueenPos.r);
        const distToMyQueen = AIEval.hexDist(action.toQ, action.toR, myQueenPos.q, myQueenPos.r);
        if (mySurround >= 3 && distFromMyQueen === 1 && distToMyQueen > 1) score -= 20;
      }

      if (action.pieceType === 'queen') {
        score -= 8;
        if (myQueenPos) {
          const mySurround = AIEval.queenSurroundCount(myQueenPos.q, myQueenPos.r, state.pieces);
          if (mySurround >= 2) {
            let newSurround = 0;
            for (const n of HexGrid.neighbors(action.toQ, action.toR)) {
              const nk = HexGrid.key(n.q, n.r);
              if (nk === HexGrid.key(action.fromQ, action.fromR)) continue;
              const ns = state.pieces.get(nk);
              if (ns && ns.length > 0) newSurround++;
            }
            if (newSurround < mySurround) score += 20;
          }
        }
      }

      if (piecesInHand > 4) score -= 10;
      if (piecesInHand > 2 && oppQueenPos) {
        const distAfter = AIEval.hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (distAfter > 2) score -= 8;
      }
    }

    if (action.kind === 'pillbug') {
      if (myQueenPos) {
        const distBefore = AIEval.hexDist(action.fromQ, action.fromR, myQueenPos.q, myQueenPos.r);
        if (distBefore === 1) score += 25;
      }
      if (oppQueenPos) {
        const distAfter = AIEval.hexDist(action.toQ, action.toR, oppQueenPos.q, oppQueenPos.r);
        if (distAfter === 1) score += 20;
      }
    }

    return score;
  }

  // ======================== STATE SIMULATION ========================

  // Clone the game state (pieces map + hands + metadata) for search
  function cloneState(state) {
    const cloned = {
      pieces: new Map(),
      hands: {
        1: { ...state.hands[1] },
        2: { ...state.hands[2] },
      },
      currentPlayer: state.currentPlayer,
      turnNumber: state.turnNumber,
      playerTurns: { ...state.playerTurns },
      queenPlaced: { ...state.queenPlaced },
      lastMoved: state.lastMoved,
      gameOver: state.gameOver,
    };
    for (const [k, stack] of state.pieces) {
      cloned.pieces.set(k, stack.map(p => ({ ...p })));
    }
    return cloned;
  }

  // Apply an action to a cloned state (modifies in place, returns the state)
  function applyAction(state, action, player) {
    if (action.kind === 'place') {
      const k = HexGrid.key(action.q, action.r);
      if (!state.pieces.has(k)) state.pieces.set(k, []);
      state.pieces.get(k).push({ player, type: action.type });
      state.hands[player][action.type]--;
      if (action.type === 'queen') state.queenPlaced[player] = true;
      state.lastMoved = null;
    } else if (action.kind === 'move') {
      const fromK = HexGrid.key(action.fromQ, action.fromR);
      const toK = HexGrid.key(action.toQ, action.toR);
      const stack = state.pieces.get(fromK);
      const piece = stack.pop();
      if (stack.length === 0) state.pieces.delete(fromK);
      if (!state.pieces.has(toK)) state.pieces.set(toK, []);
      state.pieces.get(toK).push(piece);
      state.lastMoved = { q: action.toQ, r: action.toR };
    } else if (action.kind === 'pillbug') {
      const fromK = HexGrid.key(action.fromQ, action.fromR);
      const toK = HexGrid.key(action.toQ, action.toR);
      const stack = state.pieces.get(fromK);
      const piece = stack.pop();
      if (stack.length === 0) state.pieces.delete(fromK);
      if (!state.pieces.has(toK)) state.pieces.set(toK, []);
      state.pieces.get(toK).push(piece);
      state.lastMoved = { q: action.toQ, r: action.toR };
    }

    // Advance turn
    state.playerTurns[player]++;
    state.currentPlayer = player === 1 ? 2 : 1;
    state.turnNumber++;

    return state;
  }

  // ======================== KILLER MOVE HEURISTIC ========================

  // Killer moves: moves that caused beta cutoffs at each depth
  const MAX_DEPTH = 10;
  let killerMoves = [];

  function initKillers() {
    killerMoves = new Array(MAX_DEPTH).fill(null).map(() => [null, null]);
  }

  function storeKiller(depth, action) {
    if (!action) return;
    const slot = killerMoves[depth];
    if (!slot) return;
    // Don't store duplicates
    if (slot[0] && actionsEqual(slot[0], action)) return;
    slot[1] = slot[0];
    slot[0] = action;
  }

  function isKillerMove(depth, action) {
    const slot = killerMoves[depth];
    if (!slot) return false;
    return (slot[0] && actionsEqual(slot[0], action)) ||
           (slot[1] && actionsEqual(slot[1], action));
  }

  function actionsEqual(a, b) {
    if (a.kind !== b.kind) return false;
    if (a.kind === 'place') return a.type === b.type && a.q === b.q && a.r === b.r;
    if (a.kind === 'move') return a.fromQ === b.fromQ && a.fromR === b.fromR && a.toQ === b.toQ && a.toR === b.toR;
    return a.fromQ === b.fromQ && a.fromR === b.fromR && a.toQ === b.toQ && a.toR === b.toR;
  }

  // ======================== MOVE ORDERING ========================

  // Order moves for maximum alpha-beta pruning efficiency
  function orderMoves(actions, state, player, depth, useTransposition) {
    // Get transposition table best move for this position
    let ttBestAction = null;
    if (useTransposition) {
      const hashKey = AIZobrist.hashPosition(state.pieces, state.currentPlayer);
      ttBestAction = AIZobrist.getBestMove(hashKey);
    }

    const scored = actions.map(action => {
      let priority = 0;

      // TT best move gets highest priority
      if (ttBestAction && actionsEqual(action, ttBestAction)) priority += 10000;

      // Killer moves get second priority
      if (isKillerMove(depth, action)) priority += 5000;

      // Then heuristic ordering
      priority += scoreActionForOrdering(action, state, player);

      return { action, priority };
    });

    scored.sort((a, b) => b.priority - a.priority);
    return scored.map(s => s.action);
  }

  // ======================== NEGAMAX WITH ALPHA-BETA ========================

  let nodesSearched = 0;
  let searchDeadline = 0;
  let searchAborted = false;

  // Core negamax search with alpha-beta pruning
  // Returns { score, action } from the perspective of `player`
  function negamax(state, depth, alpha, beta, player, useTransposition, quiescenceDepth) {
    nodesSearched++;

    // Time check every 1024 nodes
    if ((nodesSearched & 1023) === 0 && Date.now() > searchDeadline) {
      searchAborted = true;
      return { score: 0, action: null };
    }

    // Check transposition table
    const hashKey = useTransposition ? AIZobrist.hashPosition(state.pieces, player) : null;
    if (useTransposition && hashKey) {
      const ttResult = AIZobrist.probe(hashKey, depth, alpha, beta);
      if (ttResult && ttResult.score !== null) {
        return { score: ttResult.score, action: ttResult.bestAction };
      }
    }

    // Terminal depth or game over
    if (depth <= 0) {
      // Quiescence: if position is volatile and we have quiescence budget, extend
      if (quiescenceDepth > 0 && AIEval.isVolatile(state.pieces, player)) {
        return negamax(state, 1, alpha, beta, player, useTransposition, quiescenceDepth - 1);
      }
      const score = AIEval.evaluate(state.pieces, player, state);
      return { score, action: null };
    }

    const actions = getAllActions(state, player);
    if (actions.length === 0) {
      // No legal moves = must pass. Evaluate position.
      const score = AIEval.evaluate(state.pieces, player, state);
      return { score: score - 15, action: null }; // penalty for being forced to pass
    }

    // Order moves for better pruning
    const ordered = orderMoves(actions, state, player, depth, useTransposition);

    let bestScore = -Infinity;
    let bestAction = ordered[0];
    const opponent = player === 1 ? 2 : 1;

    for (const action of ordered) {
      if (searchAborted) break;

      // Clone state, apply move, recurse
      const childState = cloneState(state);
      applyAction(childState, action, player);

      // Negamax: negate the score from opponent's perspective
      const result = negamax(childState, depth - 1, -beta, -alpha, opponent, useTransposition, quiescenceDepth);
      const score = -result.score;

      if (score > bestScore) {
        bestScore = score;
        bestAction = action;
      }

      if (score > alpha) {
        alpha = score;
      }

      // Beta cutoff
      if (alpha >= beta) {
        storeKiller(depth, action);
        break;
      }
    }

    // Store in transposition table
    if (useTransposition && hashKey && !searchAborted) {
      let flag = AIZobrist.EXACT;
      if (bestScore <= alpha) flag = AIZobrist.UPPER_BOUND;
      if (bestScore >= beta) flag = AIZobrist.LOWER_BOUND;
      AIZobrist.store(hashKey, depth, bestScore, flag, bestAction);
    }

    return { score: bestScore, action: bestAction };
  }

  // ======================== ITERATIVE DEEPENING ========================

  // Search with iterative deepening up to maxDepth or until time runs out
  function iterativeDeepening(state, player, maxDepth, timeBudgetMs, useTransposition, quiescenceDepth) {
    searchDeadline = Date.now() + timeBudgetMs;
    searchAborted = false;
    nodesSearched = 0;
    initKillers();

    if (useTransposition) AIZobrist.clear();

    let bestResult = null;
    let completedDepth = 0;

    for (let depth = 1; depth <= maxDepth; depth++) {
      const result = negamax(state, depth, -Infinity, Infinity, player, useTransposition, quiescenceDepth || 0);

      if (searchAborted) break; // Time ran out, use previous depth's result

      bestResult = result;
      completedDepth = depth;

      // If we found a winning move, stop searching
      if (result.score >= 9000) break;
      // If we found a losing position no matter what, stop searching
      if (result.score <= -9000) break;
    }

    return {
      action: bestResult ? bestResult.action : null,
      score: bestResult ? bestResult.score : 0,
      depth: completedDepth,
      nodes: nodesSearched,
    };
  }

  // ======================== SIMPLE DELTA EVALUATION ========================

  // For medium difficulty: quick 1-ply evaluation without full search
  function simulateDelta(action, state, player) {
    const before = AIEval.evaluate(state.pieces, player, state);
    const childState = cloneState(state);
    applyAction(childState, action, player);
    const after = AIEval.evaluate(childState.pieces, player, childState);
    return after - before;
  }

  // ======================== PUBLIC API ========================

  return {
    getAllActions,
    scoreActionForOrdering,
    cloneState,
    applyAction,
    negamax,
    iterativeDeepening,
    simulateDelta,
    orderMoves,
    actionsEqual,
  };
})();
