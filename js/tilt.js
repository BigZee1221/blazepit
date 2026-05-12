/* ============================================================
   BLAZE PIT — 3D PRODUCT TILT
   Perspective tilt effect on mouse move
   ============================================================ */

(function () {
  function initTilt(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const target = container.querySelector('.tilt-target, img, .img-placeholder');
    if (!target) return;

    target.style.willChange = 'transform';

    container.addEventListener('mousemove', e => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 → 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      target.style.transition = 'transform 0.08s ease';
      target.style.transform  = `perspective(800px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.03)`;
    });

    container.addEventListener('mouseleave', () => {
      target.style.transition = 'transform 0.55s ease';
      target.style.transform  = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    });

    container.addEventListener('mouseenter', () => {
      target.style.transition = 'transform 0.08s ease';
    });
  }

  window.blazeTilt = { init: initTilt };
})();
