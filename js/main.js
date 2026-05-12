/* ============================================================
   BLAZE PIT — MAIN JS
   Nav, scroll reveal, counters, hero animation,
   email forms, contact form, cursor, countdown
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Nav scroll ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile hamburger ---- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileOverlay = document.querySelector('.nav__mobile-overlay');
  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileOverlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileOverlay.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active nav link ---- */
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const basename = href.split('/').pop().replace('.html', '');
    const pagename = path.split('/').pop().replace('.html', '');
    const isHome = (href === 'index.html' || href === './') && (pagename === '' || pagename === 'index');
    const match  = basename && pagename.includes(basename) && basename !== '';
    if (isHome || match) link.classList.add('active');
  });

  /* ---- Scroll Reveal (IntersectionObserver) ---- */
  const revealEls = document.querySelectorAll('.reveal, .slide-in-left, .slide-in-right');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Number Counter ---- */
  function animateCounter(el) {
    const target   = parseFloat(el.getAttribute('data-count'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const prefix   = el.getAttribute('data-prefix') || '';
    const duration = 1600;
    const start    = performance.now();
    function update(now) {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 4);
      const value  = Number.isInteger(target) ? Math.round(eased * target) : (eased * target).toFixed(1);
      el.textContent = prefix + value + suffix;
      if (t < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); counterIO.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));
  }

  /* ---- Hero text reveal ---- */
  const heroReveal = document.querySelector('.hero-text-reveal');
  if (heroReveal) {
    const text  = heroReveal.textContent.trim();
    const words = text.split(' ');
    heroReveal.innerHTML = words.map((w, i) =>
      `<span class="word" style="transition-delay:${i * 85}ms">${w}&nbsp;</span>`
    ).join('');
    setTimeout(() => heroReveal.classList.add('animate'), 180);
  }

  /* ---- Hero fade-up elements ---- */
  document.querySelectorAll('.fade-up').forEach((el, i) => {
    const delay = parseInt(el.dataset.delay || i, 10);
    setTimeout(() => el.classList.add('animate'), 350 + delay * 180);
  });

  /* ---- Email forms ---- */
  document.querySelectorAll('.email-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"]');
      if (!input || !btn) return;

      if (!input.value.includes('@') || !input.value.includes('.')) {
        input.style.borderColor = '#C0392B';
        input.style.boxShadow   = '0 0 0 3px rgba(192,57,43,0.18)';
        input.focus();
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow   = '';
        }, 2200);
        return;
      }

      const lang = window._currentLang || 'en';
      const t    = translations[lang] || translations.en;
      btn.textContent  = t.email_success || "You're in! 🔥";
      btn.dataset.state = 'success';
      btn.style.background = '#27ae60';
      btn.style.minWidth   = btn.offsetWidth + 'px';
      input.value = '';

      setTimeout(() => {
        btn.textContent = t.email_cta || 'Join';
        btn.dataset.state = '';
        btn.style.background = '';
        btn.style.minWidth   = '';
      }, 3500);
    });
  });

  /* ---- Contact form ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('.form-field[data-required]').forEach(field => {
        const input = field.querySelector('input, select, textarea');
        if (!input) return;
        const val = input.value.trim();
        field.classList.remove('error');

        if (!val) { field.classList.add('error'); valid = false; return; }
        if (input.type === 'email' && (!val.includes('@') || !val.includes('.'))) {
          field.classList.add('error'); valid = false;
        }
      });

      if (!valid) return;

      const btn  = contactForm.querySelector('.submit-btn');
      const lang = window._currentLang || 'en';
      const t    = translations[lang] || translations.en;

      btn.textContent = t.sending_btn || 'Sending...';
      btn.disabled    = true;

      setTimeout(() => {
        btn.textContent = t.sent_btn || 'Sent! ✓';
        btn.style.background = '#27ae60';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = t.send_btn || 'Send It →';
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 1200);
    });
  }

  /* ---- Countdown timer (shop page) ---- */
  const cdEl = document.getElementById('countdown');
  if (cdEl) {
    const target = new Date('2026-11-11T00:00:00');
    function updateCountdown() {
      const now  = new Date();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / 86400000);
      const hrs  = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const pad  = n => String(n).padStart(2, '0');
      document.getElementById('cd-days').textContent = days;
      document.getElementById('cd-hrs').textContent  = pad(hrs);
      document.getElementById('cd-mins').textContent = pad(mins);
      document.getElementById('cd-secs').textContent = pad(secs);
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---- Custom cursor (desktop fine pointer only) ---- */
  if (window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches) {
    const dot  = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    const hoverEls = 'a, button, .card, .photo-item, .btn, .link-cta';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverEls)) {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverEls)) {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
      }
    });

    function lerpCursor() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerpCursor);
    }
    lerpCursor();
  }

  /* ---- Init plugins ---- */
  if (window.blazeParticles) {
    window.blazeParticles.init('hero-particles');
    window.blazeParticles.init('shop-particles');
  }
  if (window.blazeTilt) {
    window.blazeTilt.init('.tilt-container');
  }

  /* ---- Step highlight on scroll (how-it-works page) ---- */
  const stepRows = document.querySelectorAll('.step-row');
  if (stepRows.length && 'IntersectionObserver' in window) {
    const stepIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const num = e.target.querySelector('.step-number-big');
        if (num) num.style.textShadow = e.isIntersecting ? '0 0 30px rgba(255,107,53,0.35)' : '';
      });
    }, { threshold: 0.5 });
    stepRows.forEach(r => stepIO.observe(r));
  }

});
