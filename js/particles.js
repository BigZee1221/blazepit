/* ============================================================
   BLAZE PIT — GLOBAL EMBER PARTICLE SYSTEM
   Auto-injects a fixed canvas behind all page content
   ============================================================ */

(function () {
  /* ---- Create the global fixed canvas ---- */
  const canvas = document.createElement('canvas');
  canvas.id = 'global-particles';
  canvas.style.cssText = [
    'position:fixed',
    'inset:0',
    'width:100%',
    'height:100%',
    'z-index:0',
    'pointer-events:none',
    'opacity:0.55',
  ].join(';');
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let running = true;
  let animFrame;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function createParticle(forceBottom) {
    return {
      x:          rand(0, canvas.width),
      y:          forceBottom ? rand(canvas.height * 0.6, canvas.height + 10) : rand(0, canvas.height),
      size:       rand(1.2, 3.8),
      opacity:    rand(0.2, 0.65),
      speed:      rand(0.25, 1.1),
      drift:      rand(-0.3, 0.3),
      color:      Math.random() > 0.45 ? '#FF6B35' : '#C0392B',
      flicker:    rand(0.005, 0.02),
      flickerDir: 1,
    };
  }

  function init() {
    particles = [];
    const count = Math.round((canvas.width * canvas.height) / 22000);
    for (let i = 0; i < Math.min(Math.max(count, 30), 80); i++) {
      particles.push(createParticle(false));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
      ctx.fill();
      ctx.globalAlpha = 1;

      p.y       -= p.speed;
      p.x       += p.drift;
      p.opacity += p.flicker * p.flickerDir;
      if (p.opacity > 0.72 || p.opacity < 0.12) p.flickerDir *= -1;

      if (p.y < -8) Object.assign(p, createParticle(true));
    });
  }

  function loop() {
    if (!running) return;
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) loop();
    else if (animFrame) cancelAnimationFrame(animFrame);
  });

  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

  resize();
  init();
  loop();

  /* ---- Keep backward-compat shim for any per-section calls ---- */
  window.blazeParticles = { init: function() {} };
})();
