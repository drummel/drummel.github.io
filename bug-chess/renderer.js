// Canvas rendering for the hex board

const Renderer = (() => {
  let canvas, ctx;
  let hexSize = 40;
  let offsetX = 0, offsetY = 0;
  let width, height;

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
  }

  function resize() {
    const container = canvas.parentElement;
    width = container.clientWidth;
    height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function setOffset(x, y) { offsetX = x; offsetY = y; }
  function getOffset() { return { x: offsetX, y: offsetY }; }
  function setHexSize(s) { hexSize = Math.max(20, Math.min(80, s)); }
  function getHexSize() { return hexSize; }

  function screenToHex(sx, sy) {
    const px = sx - width / 2 - offsetX;
    const py = sy - height / 2 - offsetY;
    return HexGrid.pixelToHex(px, py, hexSize);
  }

  function hexToScreen(q, r) {
    const { x, y } = HexGrid.hexToPixel(q, r, hexSize);
    return { x: x + width / 2 + offsetX, y: y + height / 2 + offsetY };
  }

  function drawHex(cx, cy, size, fillColor, strokeColor, lineWidth) {
    const corners = HexGrid.hexCorners(cx, cy, size);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < 6; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.closePath();
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth || 2;
      ctx.stroke();
    }
  }

  function render(gameState) {
    ctx.clearRect(0, 0, width, height);

    const { pieces, validMoves, validSpecials, selectedPiece, selectedHandPiece, pillbugGrab } = gameState;

    // Draw valid move highlights
    const moveSet = new Set(validMoves.map(m => HexGrid.key(m.q, m.r)));
    for (const m of validMoves) {
      const { x, y } = hexToScreen(m.q, m.r);
      drawHex(x, y, hexSize - 2, 'rgba(46, 204, 113, 0.3)', '#2ecc71', 2);
    }

    // Draw pillbug special grab targets
    if (validSpecials && !pillbugGrab) {
      for (const s of validSpecials) {
        const { x, y } = hexToScreen(s.from.q, s.from.r);
        drawHex(x, y, hexSize - 2, 'rgba(155, 89, 182, 0.3)', '#9b59b6', 2);
      }
    }

    // Draw placed pieces
    for (const [k, stack] of pieces) {
      if (stack.length === 0) continue;
      const { q, r } = HexGrid.parse(k);
      const { x, y } = hexToScreen(q, r);

      // Draw stack indicator (offset shadows for stacked pieces)
      for (let i = 0; i < stack.length - 1; i++) {
        const ox = -3 * (stack.length - 1 - i);
        const oy = -3 * (stack.length - 1 - i);
        const p = stack[i];
        const pInfo = Pieces.PLAYERS[p.player];
        drawHex(x + ox, y + oy, hexSize - 3, pInfo.bg, pInfo.border, 1.5);
      }

      const topPiece = stack[stack.length - 1];
      const playerInfo = Pieces.PLAYERS[topPiece.player];

      // Highlight selected piece
      const isSelected = selectedPiece && selectedPiece.q === q && selectedPiece.r === r;
      const isGrabbed = pillbugGrab && pillbugGrab.q === q && pillbugGrab.r === r;

      let fill = playerInfo.bg;
      let stroke = playerInfo.border;
      let lw = 2;
      if (isSelected) { fill = 'rgba(233, 69, 96, 0.4)'; stroke = '#e94560'; lw = 3; }
      if (isGrabbed) { fill = 'rgba(155, 89, 182, 0.4)'; stroke = '#9b59b6'; lw = 3; }

      drawHex(x, y, hexSize - 3, fill, stroke, lw);

      // Draw emoji
      const tInfo = Pieces.TYPES[topPiece.type];
      ctx.font = `${hexSize * 0.7}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tInfo.emoji, x, y + 2);

      // Stack count indicator
      if (stack.length > 1) {
        ctx.font = `bold ${hexSize * 0.3}px sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.fillText(`×${stack.length}`, x + hexSize * 0.45, y - hexSize * 0.45);
      }
    }

    // If a hand piece is selected, highlight valid placement positions
    // (already drawn above via validMoves)

    // Draw grid reference dot at center if board is empty
    if (pieces.size === 0) {
      const { x, y } = hexToScreen(0, 0);
      drawHex(x, y, hexSize - 2, 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.2)', 1);
      ctx.font = `${hexSize * 0.35}px sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Place here', x, y);
    }
  }

  return {
    init,
    resize,
    render,
    screenToHex,
    hexToScreen,
    setOffset,
    getOffset,
    setHexSize,
    getHexSize,
  };
})();
