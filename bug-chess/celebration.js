// Victory celebration: confetti, flying bugs, light show, screen effects

const Celebration = (() => {
  let canvas, ctx;
  let particles = [];
  let bugs = [];
  let flashes = [];
  let shockwaves = [];
  let animId = null;
  let startTime = 0;
  let winner = null;
  let bannerOpacity = 0;
  let bannerScale = 0;
  let screenShake = { x: 0, y: 0, intensity: 0 };
  let hueRotate = 0;
  let active = false;

  const BUG_EMOJIS = ['🐝', '🦋', '🐛', '🐞', '🦗', '🐜', '🕷️', '🪲', '🦟', '🐝', '🐝', '🐝'];
  const CONFETTI_COLORS = [
    '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d',
    '#c56cf0', '#ff9ff3', '#feca57', '#48dbfb', '#ff6348',
    '#7bed9f', '#70a1ff', '#eccc68', '#ff7979', '#badc58',
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
    flashes = [];
    shockwaves = [];
    bannerOpacity = 0;
    bannerScale = 0;
    screenShake.intensity = 15;
    canvas.style.display = 'block';

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Initial explosion of confetti from center
    for (let i = 0; i < 200; i++) {
      spawnConfetti(w / 2, h / 2, true);
    }

    // Central shockwave
    shockwaves.push({ x: w / 2, y: h / 2, radius: 0, maxRadius: Math.max(w, h), opacity: 0.6, speed: 12 });

    // Release the bugs! Swarm from center outward
    for (let i = 0; i < 40; i++) {
      spawnBug(w / 2 + (Math.random() - 0.5) * 100, h / 2 + (Math.random() - 0.5) * 100);
    }

    // Side confetti cannons with delay
    setTimeout(() => {
      for (let i = 0; i < 80; i++) spawnConfetti(0, h, false);
      for (let i = 0; i < 80; i++) spawnConfetti(w, h, false);
      shockwaves.push({ x: 0, y: h, radius: 0, maxRadius: w, opacity: 0.3, speed: 8 });
      shockwaves.push({ x: w, y: h, radius: 0, maxRadius: w, opacity: 0.3, speed: 8 });
    }, 400);

    // More bugs released in waves
    setTimeout(() => {
      for (let i = 0; i < 25; i++) spawnBug(Math.random() * w, h + 20);
    }, 600);
    setTimeout(() => {
      for (let i = 0; i < 25; i++) spawnBug(Math.random() * w, h + 20);
    }, 1200);

    // Flash sequence
    flashes.push({ time: 0, duration: 150, color: 'rgba(255,255,255,0.4)' });
    flashes.push({ time: 200, duration: 100, color: 'rgba(255,215,0,0.3)' });
    flashes.push({ time: 500, duration: 80, color: 'rgba(255,255,255,0.2)' });

    animate();
  }

  function spawnConfetti(x, y, explosive) {
    const angle = Math.random() * Math.PI * 2;
    const speed = explosive ? (4 + Math.random() * 10) : (6 + Math.random() * 8);
    const vx = Math.cos(angle) * speed * (explosive ? 1 : (x < window.innerWidth / 2 ? 1 : -1));
    const vy = explosive ? (Math.sin(angle) * speed - 4) : (-speed * 0.8 + Math.random() * 2);

    particles.push({
      x, y, vx, vy,
      width: 4 + Math.random() * 8,
      height: 3 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 15,
      gravity: 0.15 + Math.random() * 0.1,
      drag: 0.98,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.05 + Math.random() * 0.1,
      life: 1,
      decay: 0.001 + Math.random() * 0.002,
    });
  }

  function spawnBug(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    bugs.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      emoji: BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)],
      size: 16 + Math.random() * 24,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 4,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleAmp: 1 + Math.random() * 3,
      life: 1,
      decay: 0.002 + Math.random() * 0.003,
      // Bees do a little dance pattern
      danceTimer: 0,
      danceInterval: 30 + Math.random() * 60,
    });
  }

  function animate() {
    if (!active) return;
    const elapsed = performance.now() - startTime;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // Screen shake (decays over time)
    if (screenShake.intensity > 0.5) {
      screenShake.x = (Math.random() - 0.5) * screenShake.intensity;
      screenShake.y = (Math.random() - 0.5) * screenShake.intensity;
      screenShake.intensity *= 0.92;
      document.body.style.transform = `translate(${screenShake.x}px, ${screenShake.y}px)`;
    } else {
      document.body.style.transform = '';
    }

    // Hue rotate cycling on background (subtle)
    hueRotate = (hueRotate + 2) % 360;
    if (elapsed < 3000) {
      const intensity = Math.max(0, 1 - elapsed / 3000) * 0.3;
      canvas.parentElement.style.filter = `hue-rotate(${hueRotate}deg) saturate(${1 + intensity})`;
    } else {
      canvas.parentElement.style.filter = '';
    }

    // Draw flashes
    for (const flash of flashes) {
      if (elapsed >= flash.time && elapsed < flash.time + flash.duration) {
        const progress = (elapsed - flash.time) / flash.duration;
        const alpha = Math.sin(progress * Math.PI);
        ctx.fillStyle = flash.color.replace(/[\d.]+\)$/, alpha * 0.6 + ')');
        ctx.fillRect(0, 0, w, h);
      }
    }

    // Draw shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += sw.speed;
      sw.opacity *= 0.97;
      if (sw.opacity < 0.01) { shockwaves.splice(i, 1); continue; }

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 215, 0, ${sw.opacity})`;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inner glow ring
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius * 0.95, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${sw.opacity * 0.5})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Update and draw confetti
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= p.drag;
      p.vy += p.gravity;
      p.vy *= p.drag;
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.5;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > h + 50) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.fillStyle = p.color;
      // Draw as a ribbon/rectangle shape
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      // Add shine
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width * 0.4, p.height);
      ctx.restore();
    }

    // Update and draw bugs
    for (let i = bugs.length - 1; i >= 0; i--) {
      const b = bugs[i];
      b.wobblePhase += 0.08;
      b.danceTimer++;

      // Bugs change direction periodically (dancing)
      if (b.danceTimer >= b.danceInterval) {
        b.danceTimer = 0;
        const newAngle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        b.vx = Math.cos(newAngle) * speed;
        b.vy = Math.sin(newAngle) * speed;
      }

      b.x += b.vx + Math.sin(b.wobblePhase) * b.wobbleAmp;
      b.y += b.vy + Math.cos(b.wobblePhase * 0.7) * b.wobbleAmp * 0.5;
      b.rotation += b.rotSpeed;
      b.life -= b.decay;

      // Gentle upward drift
      b.vy -= 0.02;

      // Bounce off edges gently
      if (b.x < -30) b.vx = Math.abs(b.vx);
      if (b.x > w + 30) b.vx = -Math.abs(b.vx);
      if (b.y < -30) b.vy = Math.abs(b.vy) * 0.5;
      if (b.y > h + 30) b.vy = -Math.abs(b.vy);

      if (b.life <= 0) {
        bugs.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation * Math.PI / 180);
      ctx.globalAlpha = Math.min(1, b.life * 3);
      ctx.font = `${b.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.emoji, 0, 0);
      ctx.restore();
    }

    // Ongoing sparkle confetti rain (lighter after initial burst)
    if (elapsed > 500 && elapsed < 8000 && Math.random() < 0.3) {
      spawnConfetti(Math.random() * w, -10, false);
      particles[particles.length - 1].vy = 1 + Math.random() * 2;
      particles[particles.length - 1].vx = (Math.random() - 0.5) * 2;
    }

    // Draw winner banner (fades in and scales up)
    if (elapsed > 300) {
      bannerOpacity = Math.min(1, bannerOpacity + 0.03);
      bannerScale = Math.min(1, bannerScale + 0.04);

      const scale = 0.5 + bannerScale * 0.5 + Math.sin(elapsed / 300) * 0.02;

      ctx.save();
      ctx.translate(w / 2, h * 0.38);
      ctx.scale(scale, scale);
      ctx.globalAlpha = bannerOpacity;

      // Glow behind text
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      ctx.shadowBlur = 30 + Math.sin(elapsed / 200) * 10;

      // Banner background
      const bw = 500, bh = 120;
      const gradient = ctx.createLinearGradient(-bw/2, 0, bw/2, 0);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.15, 'rgba(0,0,0,0.75)');
      gradient.addColorStop(0.85, 'rgba(0,0,0,0.75)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(-bw/2, -bh/2, bw, bh);

      // Winner text
      ctx.shadowBlur = 0;
      ctx.font = 'bold 42px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Gold gradient text
      const textGrad = ctx.createLinearGradient(0, -20, 0, 20);
      textGrad.addColorStop(0, '#ffd700');
      textGrad.addColorStop(0.5, '#fff8dc');
      textGrad.addColorStop(1, '#ffd700');
      ctx.fillStyle = textGrad;

      let winText;
      if (winner === 'draw') {
        winText = "It's a Draw!";
      } else {
        const pInfo = Pieces.PLAYERS[winner];
        winText = `${pInfo.name} Wins!`;
      }
      ctx.fillText(winText, 0, -8);

      // Sub-text
      ctx.font = '18px "Segoe UI", system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('The hive has fallen', 0, 30);

      ctx.restore();
    }

    // Auto-stop after a while but keep banner
    if (elapsed > 10000 && particles.length === 0 && bugs.length === 0) {
      // Keep canvas showing but stop spawning
      document.body.style.transform = '';
      canvas.parentElement.style.filter = '';
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
    flashes = [];
    shockwaves = [];
    document.body.style.transform = '';
    if (canvas) {
      canvas.style.display = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    const parent = canvas && canvas.parentElement;
    if (parent) parent.style.filter = '';
  }

  return { init, start, stop, resize };
})();
