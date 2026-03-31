// AI Evaluation Function Library for Bug Chess
// Enhanced positional evaluation with game-phase awareness
// See STRATEGY.md for design rationale

const AIEval = (() => {

  // ======================== HELPERS ========================

  function hexDist(q1, r1, q2, r2) {
    return Math.max(Math.abs(q1 - q2), Math.abs(r1 - r2), Math.abs((-q1 - r1) - (-q2 - r2)));
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

  function handCount(state, player) {
    return Object.values(state.hands[player]).reduce((a, b) => a + b, 0);
  }

  // Count how many gated sides the queen has (adjacent empty hexes she can't slide to)
  function queenGatedSides(q, r, pieces) {
    const occupied = Pieces.getOccupiedSet(pieces, HexGrid.key(q, r));
    let gated = 0;
    for (const n of HexGrid.neighbors(q, r)) {
      const nk = HexGrid.key(n.q, n.r);
      if (occupied.has(nk)) continue; // occupied, not a potential escape
      // Empty neighbor, but is it gated?
      if (!HexGrid.canSlide(q, r, n.q, n.r, occupied)) gated++;
    }
    return gated;
  }

  // Count mobile pieces of a specific type for a player
  function countMobilePieces(pieces, player, type) {
    let count = 0;
    for (const [k, stack] of pieces) {
      if (stack.length === 0) continue;
      const top = stack[stack.length - 1];
      if (top.player === player && top.type === type && stack.length === 1) {
        const { q, r } = HexGrid.parse(k);
        if (!HexGrid.isArticulationPoint(q, r, pieces)) count++;
      }
    }
    return count;
  }

  // ======================== GAME PHASE DETECTION ========================

  // Returns 'opening', 'midgame', or 'endgame'
  function detectPhase(state, player) {
    const opponent = player === 1 ? 2 : 1;
    const myTurns = state.playerTurns[player];
    const myQueen = findQueen(state.pieces, player);
    const oppQueen = findQueen(state.pieces, opponent);

    // Opening: still placing core pieces
    if (myTurns < 4) return 'opening';

    // Endgame: either queen in danger or very few pieces in hand
    if (myQueen) {
      const mySurround = queenSurroundCount(myQueen.q, myQueen.r, state.pieces);
      if (mySurround >= 3) return 'endgame';
    }
    if (oppQueen) {
      const oppSurround = queenSurroundCount(oppQueen.q, oppQueen.r, state.pieces);
      if (oppSurround >= 3) return 'endgame';
    }
    if (handCount(state, player) <= 2 && handCount(state, opponent) <= 2) return 'endgame';

    return 'midgame';
  }

  // ======================== MAIN EVALUATION FUNCTION ========================

  // Phase-aware weight multipliers
  const PHASE_WEIGHTS = {
    opening:  { queenSurround: 0.8, queenSafety: 1.2, mobility: 1.0, deployment: 1.5, proximity: 0.7 },
    midgame:  { queenSurround: 1.0, queenSafety: 1.0, mobility: 1.0, deployment: 1.0, proximity: 1.0 },
    endgame:  { queenSurround: 1.5, queenSafety: 1.5, mobility: 0.7, deployment: 0.5, proximity: 1.3 },
  };

  // Full evaluation: returns numeric score from perspective of `player`
  function evaluate(pieces, player, state) {
    const opponent = player === 1 ? 2 : 1;
    let score = 0;

    const myQueen = findQueen(pieces, player);
    const oppQueen = findQueen(pieces, opponent);

    // Determine phase (use state if available, else default to midgame)
    const phase = state ? detectPhase(state, player) : 'midgame';
    const pw = PHASE_WEIGHTS[phase];

    // ======== QUEEN SURROUND (Primary metric) ========
    if (oppQueen) {
      const s = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      if (s === 6) return 10000; // win
      score += s * 30 * pw.queenSurround;
      if (s === 5) score += 120 * pw.queenSurround;
      // Self-surround exploitation
      const selfS = selfSurroundCount(oppQueen.q, oppQueen.r, pieces, opponent);
      score += selfS * 8;
    }

    if (myQueen) {
      const s = queenSurroundCount(myQueen.q, myQueen.r, pieces);
      if (s === 6) return -10000; // loss
      score -= s * 35 * pw.queenSafety;
      if (s === 5) score -= 140 * pw.queenSafety;

      // Queen mobility (escape routes)
      const mobility = queenMobility(myQueen.q, myQueen.r, pieces);
      score += mobility * 6 * pw.queenSafety;

      // Gate detection: gated sides are worse than open sides
      const gated = queenGatedSides(myQueen.q, myQueen.r, pieces);
      score -= gated * 5 * pw.queenSafety;
    }

    // Opponent queen gate penalty (good for us — their queen is trapped)
    if (oppQueen) {
      const oppGated = queenGatedSides(oppQueen.q, oppQueen.r, pieces);
      score += oppGated * 5 * pw.queenSurround;
    }

    // ======== PIN DIFFERENTIAL ========
    const myPinned = countPinnedPieces(pieces, player);
    const oppPinned = countPinnedPieces(pieces, opponent);
    score += (oppPinned - myPinned) * 5 * pw.mobility;

    // ======== MOBILE PIECE COUNTS ========
    const myAnts = countMobileAnts(pieces, player);
    const oppAnts = countMobileAnts(pieces, opponent);
    score += myAnts * 10 * pw.mobility;
    score -= oppAnts * 8 * pw.mobility;

    // Multiple mobile ants with opponent queen under pressure
    if (myAnts >= 2 && oppQueen) {
      const oppS = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      if (oppS >= 2) score += 30 * pw.queenSurround;
    }

    // Mobile beetles
    const myBeetles = countMobilePieces(pieces, player, 'beetle');
    score += myBeetles * 6 * pw.mobility;

    // ======== PIECE PROXIMITY TO OPPONENT QUEEN ========
    if (oppQueen) {
      for (const [k, stack] of pieces) {
        if (stack.length === 0) continue;
        const top = stack[stack.length - 1];
        if (top.player === player) {
          const { q, r } = HexGrid.parse(k);
          const dist = hexDist(q, r, oppQueen.q, oppQueen.r);

          if (dist <= 3) score += (4 - dist) * 4 * pw.proximity;

          // Beetle bonuses (on queen = devastating, adjacent = major threat)
          if (top.type === 'beetle' && dist === 0) score += 40;
          if (top.type === 'beetle' && dist === 1) score += 18 * pw.proximity;

          // Ant within striking distance
          if (top.type === 'ant' && dist <= 2) score += 10 * pw.proximity;

          // Mosquito near beetle near queen (can copy beetle to climb on queen)
          if (top.type === 'mosquito' && dist <= 2) {
            // Check if a beetle is adjacent to the mosquito
            for (const mn of HexGrid.neighbors(q, r)) {
              const ms = pieces.get(HexGrid.key(mn.q, mn.r));
              if (ms && ms.length > 0 && ms[ms.length - 1].type === 'beetle') {
                score += 12 * pw.proximity;
                break;
              }
            }
          }

          // Ladybug within 2 (reaches interior hexes ants can't)
          if (top.type === 'ladybug' && dist <= 2) score += 8 * pw.proximity;
        }
      }
    }

    // ======== THREAT DETECTION (opponent pieces near our queen) ========
    if (myQueen) {
      for (const [k, stack] of pieces) {
        if (stack.length === 0) continue;
        const top = stack[stack.length - 1];
        if (top.player === opponent) {
          const { q, r } = HexGrid.parse(k);
          const dist = hexDist(q, r, myQueen.q, myQueen.r);
          // Opponent pieces near our queen = threat
          if (dist <= 2 && top.type === 'ant') score -= 8 * pw.queenSafety;
          if (dist <= 2 && top.type === 'beetle') score -= 10 * pw.queenSafety;
          if (dist === 1 && top.type === 'beetle') score -= 15 * pw.queenSafety;
        }
      }
    }

    // ======== DEPLOYMENT SCORE (pieces in hand = wasted potential) ========
    if (state) {
      const myHand = handCount(state, player);
      const oppHand = handCount(state, opponent);
      score -= myHand * 2 * pw.deployment;
      score += oppHand * 1.5 * pw.deployment;
    }

    return Math.round(score);
  }

  // ======================== QUICK EVALUATION ========================

  // Simplified evaluation for easy difficulty (fewer components, faster)
  function evaluateSimple(pieces, player) {
    const opponent = player === 1 ? 2 : 1;
    let score = 0;

    const myQueen = findQueen(pieces, player);
    const oppQueen = findQueen(pieces, opponent);

    if (oppQueen) {
      const s = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      if (s === 6) return 10000;
      score += s * 30;
    }

    if (myQueen) {
      const s = queenSurroundCount(myQueen.q, myQueen.r, pieces);
      if (s === 6) return -10000;
      score -= s * 35;
    }

    const myPinned = countPinnedPieces(pieces, player);
    const oppPinned = countPinnedPieces(pieces, opponent);
    score += (oppPinned - myPinned) * 5;

    return score;
  }

  // ======================== VOLATILITY CHECK ========================

  // Check if a position is "volatile" (queen surround recently changed)
  // Used for quiescence search extension
  function isVolatile(pieces, player) {
    const opponent = player === 1 ? 2 : 1;
    const myQueen = findQueen(pieces, player);
    const oppQueen = findQueen(pieces, opponent);

    if (myQueen) {
      const s = queenSurroundCount(myQueen.q, myQueen.r, pieces);
      if (s >= 4) return true; // near-loss
    }
    if (oppQueen) {
      const s = queenSurroundCount(oppQueen.q, oppQueen.r, pieces);
      if (s >= 4) return true; // near-win
    }
    return false;
  }

  // ======================== PUBLIC API ========================

  return {
    evaluate,
    evaluateSimple,
    isVolatile,
    detectPhase,
    // Expose helpers for use by other AI modules
    hexDist,
    findQueen,
    queenSurroundCount,
    isAdjacentTo,
    countPinnedPieces,
    countMobileAnts,
    selfSurroundCount,
    queenMobility,
    queenGatedSides,
    handCount,
  };
})();
