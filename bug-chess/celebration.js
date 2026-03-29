// Victory celebration: confetti + a few bugs + banner (performance-optimized)

const Celebration = (() => {
  let canvas, ctx;
  let particles = [];
  let bugs = [];
  let shockwaves = [];
  let animId = null;
  let startTime = 0;
  let winner = null;
  let bannerOpacity = 0;
  let bannerScale = 0;
  let active = false;

  const BUG_EMOJIS = ['🐝', '🦋', '🐞', '🐜', '🐝', '🐝'];
  const CONFETTI_COLORS = [
    '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d',
    '#c56cf0', '#feca57', '#48dbfb', '#ff6348', '#badc58',
  ];

  function init() {
    canvas = document.getElementById('celebration-canvas');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function start(winnerPlayer) {
    if (active) stop();
    active = true;
    winner = winnerPlayer;
    startTime = performance.now();
    particles = [];
    bugs = [];
    shockwaves = [];
    bannerOpacity = 0;
    bannerScale = 0;
    canvas.style.display = 'block';

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Confetti burst from center (reduced from 200 to 60)
    for (let i = 0; i < 60; i++) {
      spawnConfetti(w / 2, h / 2, true);
    }

    // One shockwave
    shockwaves.push({ x: w / 2, y: h / 2, radius: 0, opacity: 0.5, speed: 10 });

    // A handful of bugs (reduced from 40 to 10)
    for (let i = 0; i < 10; i++) {
      spawnBug(w / 2 + (Math.random() - 0.5) * 200, h / 2 + (Math.random() - 0.5) * 200);
    }

    // Side cannons (reduced from 160 to 40 total)
    setTimeout(() => {
      if (!active) return;
      for (let i = 0; i < 20; i++) spawnConfetti(0, h, false);
      for (let i = 0; i < 20; i++) spawnConfetti(w, h, false);
    }, 400);

    animate();
  }

  function spawnConfetti(x, y, explosive) {
    const angle = Math.random() * Math.PI * 2;
    const speed = explosive ? (4 + Math.random() * 8) : (5 + Math.random() * 6);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed * (explosive ? 1 : (x < window.innerWidth / 2 ? 1 : -1)),
      vy: explosive ? (Math.sin(angle) * speed - 3) : (-speed * 0.7),
      w: 4 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rot: Math.random() * 6.28,
      rotS: (Math.random() - 0.5) * 0.2,
      life: 1,
      decay: 0.003 + Math.random() * 0.004,
    });
  }

  function spawnBug(x, y) {
    bugs.push({
      x, y,
      vx: (Math.random() - 0.5) * 4,
      vy: -1 - Math.random() * 2,
      emoji: BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)],
      size: 20 + Math.random() * 16,
      phase: Math.random() * 6.28,
      life: 1,
      decay: 0.004 + Math.random() * 0.004,
    });
  }

  function animate() {
    if (!active) return;
    const elapsed = performance.now() - startTime;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // Flash (just one, simple)
    if (elapsed < 200) {
      const a = Math.max(0, 1 - elapsed / 200) * 0.3;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Shockwaves (simple arcs, no glow)
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += sw.speed;
      sw.opacity *= 0.96;
      if (sw.opacity < 0.01) { shockwaves.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,215,0,${sw.opacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Confetti (no save/restore, no rotation - just colored rects)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= 0.98;
      p.vy += 0.15;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotS;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > h + 30) {
        particles.splice(i, 1);
        continue;
      }

      // Simple rotated rect without save/restore (use setTransform)
      const alpha = Math.min(1, p.life * 2);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      // Approximate rotation with skewed rect (cheaper than transform)
      const cx = p.x, cy = p.y;
      const cos = Math.cos(p.rot), sin = Math.sin(p.rot);
      const hw = p.w / 2, hh = p.h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - hw * cos + hh * sin, cy - hw * sin - hh * cos);
      ctx.lineTo(cx + hw * cos + hh * sin, cy + hw * sin - hh * cos);
      ctx.lineTo(cx + hw * cos - hh * sin, cy + hw * sin + hh * cos);
      ctx.lineTo(cx - hw * cos - hh * sin, cy - hw * sin + hh * cos);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Bugs (emoji text - limited count so still performant)
    for (let i = bugs.length - 1; i >= 0; i--) {
      const b = bugs[i];
      b.phase += 0.06;
      b.x += b.vx + Math.sin(b.phase) * 1.5;
      b.y += b.vy + Math.cos(b.phase * 0.7);
      b.vy -= 0.01;
      b.life -= b.decay;

      if (b.life <= 0) { bugs.splice(i, 1); continue; }

      ctx.globalAlpha = Math.min(1, b.life * 3);
      ctx.font = `${b.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.emoji, b.x, b.y);
    }
    ctx.globalAlpha = 1;

    // Light confetti rain (much slower spawn rate)
    if (elapsed > 600 && elapsed < 4000 && particles.length < 30 && Math.random() < 0.15) {
      spawnConfetti(Math.random() * w, -10, false);
      const last = particles[particles.length - 1];
      last.vy = 1 + Math.random() * 2;
      last.vx = (Math.random() - 0.5) * 2;
    }

    // Winner banner (no shadowBlur, no gradient - simple and clean)
    if (elapsed > 300) {
      bannerOpacity = Math.min(1, bannerOpacity + 0.04);
      bannerScale = Math.min(1, bannerScale + 0.05);

      const scale = 0.6 + bannerScale * 0.4;

      ctx.save();
      ctx.translate(w / 2, h * 0.38);
      ctx.scale(scale, scale);
      ctx.globalAlpha = bannerOpacity;

      // Banner background (solid, no gradient)
      const bw = 460, bh = 100;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      const radius = 16;
      ctx.beginPath();
      ctx.moveTo(-bw/2 + radius, -bh/2);
      ctx.lineTo(bw/2 - radius, -bh/2);
      ctx.quadraticCurveTo(bw/2, -bh/2, bw/2, -bh/2 + radius);
      ctx.lineTo(bw/2, bh/2 - radius);
      ctx.quadraticCurveTo(bw/2, bh/2, bw/2 - radius, bh/2);
      ctx.lineTo(-bw/2 + radius, bh/2);
      ctx.quadraticCurveTo(-bw/2, bh/2, -bw/2, bh/2 - radius);
      ctx.lineTo(-bw/2, -bh/2 + radius);
      ctx.quadraticCurveTo(-bw/2, -bh/2, -bw/2 + radius, -bh/2);
      ctx.fill();

      // Winner text (solid gold, no gradient, no shadow)
      ctx.font = 'bold 38px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffd700';

      let winText;
      if (winner === 'draw') {
        winText = "It's a Draw!";
      } else {
        const pInfo = Pieces.PLAYERS[winner];
        winText = `${pInfo.name} Wins!`;
      }
      ctx.fillText(winText, 0, -10);

      ctx.font = '16px "Segoe UI", system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText('The hive has fallen', 0, 24);

      ctx.restore();
    }

    // Stop animation earlier (was 10s, now 5s)
    if (elapsed > 5000 && particles.length === 0 && bugs.length === 0) {
      document.body.style.transform = '';
      return;
    }

    animId = requestAnimationFrame(animate);
  }

  function stop() {
    active = false;
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    particles = [];
    bugs = [];
    shockwaves = [];
    document.body.style.transform = '';
    if (canvas) {
      canvas.style.display = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return { init, start, stop, resize };
})();
