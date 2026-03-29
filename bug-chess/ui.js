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
    const types = Pieces.getTypes();

    for (const player of [1, 2]) {
      const el = handEls[player];
      const hand = gameState.hands[player];
      const isActive = gameState.currentPlayer === player && !gameState.gameOver;
      const playerInfo = Pieces.PLAYERS[player];

      const header = el.querySelector('h3');
      el.innerHTML = '';
      el.appendChild(header);

      if (isActive) {
        el.classList.add('active-hand');
      } else {
        el.classList.remove('active-hand');
      }

      for (const [type, info] of Object.entries(types)) {
        const count = hand[type];
        if (count === undefined) continue; // expansion not active

        const div = document.createElement('div');
        div.className = 'hand-piece';

        const canSelect = isActive && count > 0 && !gameState.gameOver;
        const mustQueen = GameState.mustPlaceQueen(player);

        if (!canSelect || (mustQueen && type !== 'queen')) {
          div.classList.add('disabled');
        }

        const isSelected = gameState.selectedHandPiece === type && isActive;
        if (isSelected) div.classList.add('selected');

        // Count badge color based on player
        const badgeBg = player === 1 ? '#888' : '#222';

        div.innerHTML = `
          <span class="emoji">${info.emoji}</span>
          <span class="piece-name">${info.name}</span>
          <span class="count" style="background:${badgeBg}">${count}</span>
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
        turnEl.style.color = '#e67e22';
      } else {
        const pInfo = Pieces.PLAYERS[gameState.winner];
        turnEl.innerHTML = `<span style="color:${pInfo.color}"><b>${pInfo.name} (${pInfo.label}) Wins!</b></span>`;
      }
      statusEl.textContent = 'Click "New Game" to play again.';
      return;
    }

    const pInfo = Pieces.PLAYERS[gameState.currentPlayer];
    const tilePreview = gameState.currentPlayer === 1 ? '&#11036;' : '&#11035;';
    turnEl.innerHTML = `<span style="color:${pInfo.color}">${tilePreview} ${pInfo.name}'s Turn (${pInfo.label})</span>`;

    const msgs = [];
    if (GameState.mustPlaceQueen(gameState.currentPlayer)) {
      msgs.push('Must place Queen Bee this turn!');
    }
    if (gameState.selectedHandPiece) {
      const t = Pieces.getTypes()[gameState.selectedHandPiece];
      msgs.push(`Click a green hex to place ${t.emoji} ${t.name}`);
    } else if (gameState.selectedPiece) {
      if (gameState.pillbugGrab) {
        msgs.push('Click a green hex to drop the grabbed piece');
      } else if (gameState.validSpecials.length > 0) {
        msgs.push('Purple = Pill Bug grab, Green = move');
      } else if (gameState.validMoves.length > 0) {
        msgs.push('Click a green hex to move');
      } else {
        msgs.push('This piece cannot move (pinned)');
      }
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
