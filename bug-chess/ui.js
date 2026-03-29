// UI management: player hands, click handlers, turn display

const UI = (() => {
  let handEls = { 1: null, 2: null };
  let turnEl, statusEl;

  function init() {
    handEls[1] = document.getElementById('hand-p1');
    handEls[2] = document.getElementById('hand-p2');
    turnEl = document.getElementById('turn-indicator');
    statusEl = document.getElementById('game-status');
  }

  function renderHands(gameState) {
    for (const player of [1, 2]) {
      const el = handEls[player];
      const hand = gameState.hands[player];
      const isActive = gameState.currentPlayer === player && !gameState.gameOver;
      const playerInfo = Pieces.PLAYERS[player];

      // Keep the header
      const header = el.querySelector('h3');

      el.innerHTML = '';
      el.appendChild(header);

      if (isActive) {
        el.classList.add('active-hand');
      } else {
        el.classList.remove('active-hand');
      }

      for (const [type, info] of Object.entries(Pieces.TYPES)) {
        const count = hand[type];
        const div = document.createElement('div');
        div.className = 'hand-piece';

        const canSelect = isActive && count > 0 && !gameState.gameOver;
        const mustQueen = GameState.mustPlaceQueen(player);

        if (!canSelect || (mustQueen && type !== 'queen')) {
          div.classList.add('disabled');
        }

        const isSelected = gameState.selectedHandPiece === type && isActive;
        if (isSelected) div.classList.add('selected');

        div.innerHTML = `
          <span class="emoji">${info.emoji}</span>
          <span>${info.name}</span>
          <span class="count" style="background:${playerInfo.bg};border:1px solid ${playerInfo.border}">${count}</span>
        `;

        if (canSelect && !(mustQueen && type !== 'queen')) {
          div.addEventListener('click', () => {
            if (gameState.gameOver) return;
            if (gameState.selectedHandPiece === type) {
              GameState.clearSelection();
            } else {
              GameState.selectHandPiece(type);
            }
            App.refresh();
          });
        }

        el.appendChild(div);
      }
    }
  }

  function renderTurnInfo(gameState) {
    if (gameState.gameOver) {
      if (gameState.winner === 'draw') {
        turnEl.textContent = 'Draw!';
        turnEl.style.color = '#f39c12';
      } else {
        const pInfo = Pieces.PLAYERS[gameState.winner];
        turnEl.innerHTML = `<span style="color:${pInfo.color}">${pInfo.name} Wins! 🎉</span>`;
      }
      statusEl.textContent = 'Click "New Game" to play again.';
      return;
    }

    const pInfo = Pieces.PLAYERS[gameState.currentPlayer];
    turnEl.innerHTML = `<span style="color:${pInfo.color}">${pInfo.emoji} ${pInfo.name}'s Turn</span>`;

    // Status messages
    const msgs = [];
    if (GameState.mustPlaceQueen(gameState.currentPlayer)) {
      msgs.push('⚠️ Must place Queen Bee this turn!');
    }
    if (gameState.selectedHandPiece) {
      msgs.push(`Click a highlighted hex to place your ${Pieces.TYPES[gameState.selectedHandPiece].emoji} ${Pieces.TYPES[gameState.selectedHandPiece].name}`);
    } else if (gameState.selectedPiece) {
      if (gameState.pillbugGrab) {
        msgs.push('Click a highlighted hex to drop the grabbed piece');
      } else if (gameState.validSpecials.length > 0) {
        msgs.push('Click a purple hex for Pill Bug grab, or green to move');
      } else {
        msgs.push('Click a highlighted hex to move');
      }
    } else if (gameState.pieces.size === 0) {
      msgs.push('Select a piece from your hand to begin');
    } else {
      msgs.push('Select a piece from your hand or on the board');
    }
    statusEl.textContent = msgs.join(' | ');
  }

  function update(gameState) {
    renderHands(gameState);
    renderTurnInfo(gameState);
  }

  return { init, update };
})();
