// Main application: wires everything together

const App = (() => {
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let dragOffset = { x: 0, y: 0 };

  function init() {
    setupSetupScreen();
  }

  function setupSetupScreen() {
    const overlay = document.getElementById('setup-overlay');
    const toggles = overlay.querySelectorAll('.expansion-toggle');

    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
      });
    });

    document.getElementById('btn-start-game').addEventListener('click', () => {
      const config = {};
      toggles.forEach(toggle => {
        const key = toggle.dataset.expansion;
        config[key] = toggle.classList.contains('active');
      });
      GameState.setExpansions(config);
      overlay.classList.add('hidden');
      startGame();
    });
  }

  function startGame() {
    const canvas = document.getElementById('board-canvas');
    Renderer.init(canvas);
    UI.init();
    GameState.init();

    setupBoardEvents(canvas);
    setupControlEvents();
    window.addEventListener('resize', () => {
      Renderer.resize();
      refresh();
    });

    refresh();
  }

  function refresh() {
    const state = GameState.getState();
    Renderer.render(state);
    UI.update(state);
  }

  function setupBoardEvents(canvas) {
    const container = document.getElementById('board-container');

    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = false;
      dragStart = { x: e.clientX, y: e.clientY };
      dragOffset = { ...Renderer.getOffset() };
      container.classList.add('dragging');

      const onMove = (e2) => {
        const dx = e2.clientX - dragStart.x;
        const dy = e2.clientY - dragStart.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging = true;
        Renderer.setOffset(dragOffset.x + dx, dragOffset.y + dy);
        refresh();
      };
      const onUp = (e2) => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        container.classList.remove('dragging');
        if (!isDragging) {
          handleBoardClick(e2);
        }
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });

    // Touch support
    let touchStart = null;
    let touchOffset = null;
    let touchMoved = false;

    container.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
      touchOffset = { ...Renderer.getOffset() };
      touchMoved = false;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!touchStart || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) touchMoved = true;
      Renderer.setOffset(touchOffset.x + dx, touchOffset.y + dy);
      refresh();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      if (!touchMoved && touchStart) {
        const rect = canvas.getBoundingClientRect();
        const x = touchStart.x - rect.left;
        const y = touchStart.y - rect.top;
        handleBoardClickAt(x, y);
      }
      touchStart = null;
    });

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -3 : 3;
      Renderer.setHexSize(Renderer.getHexSize() + delta);
      refresh();
    }, { passive: false });
  }

  function handleBoardClick(e) {
    const canvas = document.getElementById('board-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleBoardClickAt(x, y);
  }

  function handleBoardClickAt(x, y) {
    const state = GameState.getState();
    if (state.gameOver) return;

    const hex = Renderer.screenToHex(x, y);
    const k = HexGrid.key(hex.q, hex.r);

    // Pillbug grab in progress
    if (state.pillbugGrab) {
      const isValidDrop = state.validMoves.some(m => m.q === hex.q && m.r === hex.r);
      if (isValidDrop) {
        GameState.pillbugMove(
          state.pillbugGrab.pillQ, state.pillbugGrab.pillR,
          state.pillbugGrab.q, state.pillbugGrab.r,
          hex.q, hex.r
        );
      } else {
        GameState.clearSelection();
      }
      refresh();
      return;
    }

    // Hand piece selected - try to place
    if (state.selectedHandPiece) {
      const isValid = state.validMoves.some(m => m.q === hex.q && m.r === hex.r);
      if (isValid) {
        GameState.placePiece(state.selectedHandPiece, hex.q, hex.r);
      } else {
        GameState.clearSelection();
      }
      refresh();
      return;
    }

    // Board piece selected - try to move or pillbug grab
    if (state.selectedPiece) {
      const isValidMove = state.validMoves.some(m => m.q === hex.q && m.r === hex.r);
      if (isValidMove) {
        GameState.movePiece(state.selectedPiece.q, state.selectedPiece.r, hex.q, hex.r);
        refresh();
        return;
      }

      const isSpecialTarget = state.validSpecials.some(s => s.from.q === hex.q && s.from.r === hex.r);
      if (isSpecialTarget) {
        GameState.selectPillbugGrab(
          state.selectedPiece.q, state.selectedPiece.r,
          hex.q, hex.r
        );
        refresh();
        return;
      }

      if (state.selectedPiece.q === hex.q && state.selectedPiece.r === hex.r) {
        GameState.clearSelection();
        refresh();
        return;
      }
    }

    // Try to select a board piece
    const stack = state.pieces.get(k);
    if (stack && stack.length > 0) {
      const topPiece = stack[stack.length - 1];
      if (topPiece.player === state.currentPlayer) {
        if (GameState.canMovePieces(state.currentPlayer)) {
          GameState.selectBoardPiece(hex.q, hex.r);
        }
      }
    } else {
      GameState.clearSelection();
    }
    refresh();
  }

  function setupControlEvents() {
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
      Renderer.setHexSize(Renderer.getHexSize() + 5);
      refresh();
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
      Renderer.setHexSize(Renderer.getHexSize() - 5);
      refresh();
    });
    document.getElementById('btn-reset-view').addEventListener('click', () => {
      Renderer.setOffset(0, 0);
      Renderer.setHexSize(40);
      refresh();
    });
    document.getElementById('btn-new-game').addEventListener('click', () => {
      // Show setup screen again
      document.getElementById('setup-overlay').classList.remove('hidden');
      // Re-sync toggle states with current config
      const config = GameState.getExpansions();
      document.querySelectorAll('.expansion-toggle').forEach(toggle => {
        const key = toggle.dataset.expansion;
        if (config[key]) toggle.classList.add('active');
        else toggle.classList.remove('active');
      });
    });
  }

  return { init, refresh };
})();

document.addEventListener('DOMContentLoaded', App.init);
