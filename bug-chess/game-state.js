// Game state management: turns, placement rules, win detection

const GameState = (() => {
  let state;
  let expansionConfig = { pillbug: true, ladybug: true };

  function setExpansions(config) {
    expansionConfig = { ...config };
    Pieces.setExpansions(config);
  }

  function getExpansions() { return expansionConfig; }

  function createInitialHand() {
    const hand = {};
    for (const [type, info] of Object.entries(Pieces.getTypes())) {
      hand[type] = info.count;
    }
    return hand;
  }

  function init() {
    Pieces.setExpansions(expansionConfig);
    state = {
      pieces: new Map(),
      hands: {
        1: createInitialHand(),
        2: createInitialHand(),
      },
      currentPlayer: 1,
      turnNumber: 1,
      playerTurns: { 1: 0, 2: 0 },
      queenPlaced: { 1: false, 2: false },
      lastMoved: null, // {q, r} of the piece that was last physically moved (for pillbug stun)
      winner: null,
      selectedPiece: null,
      selectedHandPiece: null,
      validMoves: [],
      validSpecials: [],
      pillbugGrab: null,
      gameOver: false,
    };
    return state;
  }

  function getState() { return state; }

  function mustPlaceQueen(player) {
    return state.playerTurns[player] === 3 && !state.queenPlaced[player];
  }

  // Get valid placement positions for a new piece for the given player
  function getPlacementPositions(player) {
    // First piece: place at origin
    if (state.pieces.size === 0) {
      return [{ q: 0, r: 0 }];
    }

    // Second piece (first move of player 2): adjacent to the first piece
    if (state.pieces.size === 1) {
      const [k] = state.pieces.keys();
      const { q, r } = HexGrid.parse(k);
      return HexGrid.neighbors(q, r);
    }

    // Normal: adjacent to friendly, NOT adjacent to enemy (check top of stacks)
    const emptyAdj = HexGrid.getAdjacentEmpty(state.pieces);
    const positions = [];
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

    // Placement counts as the last moved piece for pillbug stun rule
    state.lastMoved = { q, r };
    state.playerTurns[player]++;
    advanceTurn();
    return true;
  }

  // Move a piece on the board
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

    // The moved piece is stunned (last moved), not the pillbug
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
      // If current player has no valid actions, auto-pass
      if (!hasAnyValidAction(state.currentPlayer)) {
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        state.turnNumber++;
      }
    }
  }

  function hasAnyValidAction(player) {
    const hand = state.hands[player];
    const hasHandPieces = Object.values(hand).some(c => c > 0);
    if (hasHandPieces) {
      const positions = getPlacementPositions(player);
      if (positions.length > 0) {
        if (mustPlaceQueen(player)) {
          return hand.queen > 0;
        }
        return true;
      }
    }

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
    let winnersFound = [];
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
            // This queen is surrounded; the OTHER player wins
            winnersFound.push(piece.player === 1 ? 2 : 1);
          }
        }
      }
    }
    if (winnersFound.length === 2) {
      state.winner = 'draw';
      state.gameOver = true;
    } else if (winnersFound.length === 1) {
      state.winner = winnersFound[0];
      state.gameOver = true;
    }
  }

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
    setExpansions,
    getExpansions,
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
  };
})();
