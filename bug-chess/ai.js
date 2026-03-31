// AI opponent for Bug Chess
// Orchestrator that delegates to ai-eval.js, ai-zobrist.js, ai-search.js
// 4 difficulty levels: easy, medium, hard, impossible
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

  // ======================== OSCILLATION DETECTION ========================

  function isOscillating(action) {
    if (action.kind !== 'move') return false;
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

  // ======================== DIFFICULTY CONFIGURATIONS ========================

  // Each difficulty level defines search parameters and behavior
  const DIFFICULTY_CONFIG = {
    easy: {
      maxDepth: 0,          // no tree search, heuristic only
      timeBudgetMs: 200,
      useTransposition: false,
      quiescenceDepth: 0,
      noise: 40,            // large random noise for natural mistakes
      topN: 0,              // 0 = use percentage-based selection
      topPercent: 0.5,      // pick from top 50%
      useSimulation: false,
      useFullEval: false,   // use simple eval
    },
    medium: {
      maxDepth: 2,          // 2-ply search
      timeBudgetMs: 800,
      useTransposition: false,
      quiescenceDepth: 0,
      noise: 8,
      topN: 3,
      topPercent: 0,
      useSimulation: true,
      useFullEval: true,
    },
    hard: {
      maxDepth: 4,          // 3-4 ply with iterative deepening
      timeBudgetMs: 2000,
      useTransposition: true,
      quiescenceDepth: 1,
      noise: 0,
      topN: 1,              // always pick the best
      topPercent: 0,
      useSimulation: true,
      useFullEval: true,
    },
    impossible: {
      maxDepth: 6,          // 4-6 ply with iterative deepening
      timeBudgetMs: 3500,
      useTransposition: true,
      quiescenceDepth: 2,
      noise: 0,
      topN: 1,
      topPercent: 0,
      useSimulation: true,
      useFullEval: true,
    },
  };

  // ======================== ACTION PICKING ========================

  function pickAction(state) {
    const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
    const actions = AISearch.getAllActions(state, aiPlayer);
    if (actions.length === 0) return null;
    if (actions.length === 1) return actions[0];

    // Filter out oscillating moves (add heavy penalty instead of removing,
    // so we still have options if all moves oscillate)
    const oscillationPenalty = new Set();
    for (const a of actions) {
      if (isOscillating(a)) oscillationPenalty.add(a);
    }

    if (config.maxDepth >= 2) {
      // Tree search path (medium, hard, impossible)
      return pickWithSearch(actions, state, config, oscillationPenalty);
    } else {
      // Heuristic-only path (easy)
      return pickHeuristic(actions, state, config, oscillationPenalty);
    }
  }

  // Heuristic-only picking for Easy difficulty
  function pickHeuristic(actions, state, config, oscillationPenalty) {
    const scored = actions.map(action => {
      let score = AISearch.scoreActionForOrdering(action, state, aiPlayer);
      if (oscillationPenalty.has(action)) score -= 50;
      // Add Gaussian-ish noise for natural mistakes (sum of 3 uniform = approx normal)
      if (config.noise > 0) {
        score += (Math.random() + Math.random() + Math.random() - 1.5) * config.noise;
      }
      return { action, score };
    });

    scored.sort((a, b) => b.score - a.score);

    if (config.topPercent > 0) {
      const pool = scored.slice(0, Math.max(1, Math.ceil(scored.length * config.topPercent)));
      return pool[Math.floor(Math.random() * pool.length)].action;
    }

    const topN = Math.min(config.topN || 1, scored.length);
    const pool = scored.slice(0, topN);
    return pool[Math.floor(Math.random() * pool.length)].action;
  }

  // Tree search picking for Medium, Hard, Impossible
  function pickWithSearch(actions, state, config, oscillationPenalty) {
    const result = AISearch.iterativeDeepening(
      state,
      aiPlayer,
      config.maxDepth,
      config.timeBudgetMs,
      config.useTransposition,
      config.quiescenceDepth
    );

    if (result.action) {
      // Check if the best action is oscillating
      if (oscillationPenalty.has(result.action) && actions.length > 1) {
        // Re-search with the oscillating move excluded concept:
        // Fall back to heuristic scoring to pick a non-oscillating alternative
        const nonOscillating = actions.filter(a => !oscillationPenalty.has(a));
        if (nonOscillating.length > 0) {
          // Quick 1-ply evaluation of alternatives
          let bestAlt = nonOscillating[0];
          let bestAltScore = -Infinity;
          for (const action of nonOscillating) {
            const delta = AISearch.simulateDelta(action, state, aiPlayer);
            const heuristic = AISearch.scoreActionForOrdering(action, state, aiPlayer);
            const totalScore = heuristic + delta * 2;
            if (totalScore > bestAltScore) {
              bestAltScore = totalScore;
              bestAlt = action;
            }
          }
          return bestAlt;
        }
      }

      // For medium: add small noise by occasionally picking 2nd/3rd best
      if (config.noise > 0 && config.topN > 1) {
        // Re-score top actions with noise
        const topActions = actions.slice(0, Math.min(config.topN * 2, actions.length));
        const rescored = topActions.map(action => {
          const delta = AISearch.simulateDelta(action, state, aiPlayer);
          const heuristic = AISearch.scoreActionForOrdering(action, state, aiPlayer);
          let score = heuristic * 2 + delta * 3;
          if (oscillationPenalty.has(action)) score -= 50;
          score += (Math.random() + Math.random() + Math.random() - 1.5) * config.noise;
          return { action, score };
        });
        rescored.sort((a, b) => b.score - a.score);
        const pool = rescored.slice(0, Math.min(config.topN, rescored.length));
        return pool[Math.floor(Math.random() * pool.length)].action;
      }

      return result.action;
    }

    // Fallback: heuristic-only
    return pickHeuristic(actions, state, config, oscillationPenalty);
  }

  // ======================== EXECUTE ACTION ========================

  function executeAction(action) {
    switch (action.kind) {
      case 'place': GameState.placePiece(action.type, action.q, action.r); break;
      case 'move':  GameState.movePiece(action.fromQ, action.fromR, action.toQ, action.toR); break;
      case 'pillbug': GameState.pillbugMove(action.pillQ, action.pillR, action.fromQ, action.fromR, action.toQ, action.toR); break;
    }
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
    AIZobrist.clear();
  }

  return {
    setDifficulty, getDifficulty, setEnabled, isEnabled, getAIPlayer, takeTurn, reset,
  };
})();
