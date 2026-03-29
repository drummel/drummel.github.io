// Canvas rendering for the hex board - white & black tile theme

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

  function drawHexShadow(cx, cy, size) {
    const corners = HexGrid.hexCorners(cx, cy + 3, size);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < 6; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fill();
  }

  function render(gameState) {
    ctx.clearRect(0, 0, width, height);

    const { pieces, validMoves, validSpecials, selectedPiece, selectedHandPiece, pillbugGrab } = gameState;

    // Draw valid move highlights
    for (const m of validMoves) {
      const { x, y } = hexToScreen(m.q, m.r);
      drawHex(x, y, hexSize - 2, 'rgba(40, 167, 69, 0.2)', '#28a745', 2.5);
      // Draw a small dot in center
      ctx.beginPath();
      ctx.arc(x, y, hexSize * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 167, 69, 0.5)';
      ctx.fill();
    }

    // Draw pillbug special grab targets (purple)
    if (validSpecials && !pillbugGrab) {
      for (const s of validSpecials) {
        const { x, y } = hexToScreen(s.from.q, s.from.r);
        drawHex(x, y, hexSize - 2, 'rgba(142, 68, 173, 0.2)', '#8e44ad', 2.5);
      }
    }

    // Draw placed pieces
    for (const [k, stack] of pieces) {
      if (stack.length === 0) continue;
      const { q, r } = HexGrid.parse(k);
      const { x, y } = hexToScreen(q, r);

      // Draw stack shadows
      for (let i = 0; i < stack.length - 1; i++) {
        const ox = -3 * (stack.length - 1 - i);
        const oy = -3 * (stack.length - 1 - i);
        const p = stack[i];
        const pInfo = Pieces.PLAYERS[p.player];
        drawHexShadow(x + ox, y + oy, hexSize - 4);
        drawHex(x + ox, y + oy, hexSize - 4, pInfo.tileFill, pInfo.tileStroke, 1.5);
      }

      const topPiece = stack[stack.length - 1];
      const playerInfo = Pieces.PLAYERS[topPiece.player];

      const isSelected = selectedPiece && selectedPiece.q === q && selectedPiece.r === r;
      const isGrabbed = pillbugGrab && pillbugGrab.q === q && pillbugGrab.r === r;

      // Shadow
      drawHexShadow(x, y, hexSize - 3);

      // Tile
      let fill = playerInfo.tileFill;
      let stroke = playerInfo.tileStroke;
      let lw = 2;
      if (isSelected) { stroke = '#28a745'; lw = 3; }
      if (isGrabbed) { stroke = '#8e44ad'; lw = 3; }

      drawHex(x, y, hexSize - 3, fill, stroke, lw);

      // Draw emoji with visibility treatment
      const tInfo = Pieces.getTypes()[topPiece.type] || Pieces.ALL_TYPES[topPiece.type];
      ctx.font = `${hexSize * 0.72}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // For dark tiles, add a subtle light circle behind the emoji for visibility
      if (topPiece.player === 2) {
        ctx.beginPath();
        ctx.arc(x, y + 1, hexSize * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fill();
      }

      ctx.fillText(tInfo.emoji, x, y + 2);

      // Stack count badge
      if (stack.length > 1) {
        const bx = x + hexSize * 0.4;
        const by = y - hexSize * 0.4;
        ctx.beginPath();
        ctx.arc(bx, by, hexSize * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.font = `bold ${hexSize * 0.22}px sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.fillText(stack.length, bx, by + 1);
      }
    }

    // Empty board guide
    if (pieces.size === 0) {
      const { x, y } = hexToScreen(0, 0);
      drawHex(x, y, hexSize - 2, 'rgba(0,0,0,0.04)', 'rgba(0,0,0,0.15)', 1.5);
      ctx.font = `${hexSize * 0.3}px sans-serif`;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
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
