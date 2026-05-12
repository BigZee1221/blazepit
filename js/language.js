/* ============================================================
   BLAZE PIT — LANGUAGE SWITCHER
   EN / AR (RTL) / ES
   ============================================================ */

(function () {
  const KEY = 'blazepit_lang';

  function applyLang(lang) {
    if (!translations || !translations[lang]) return;
    const t = translations[lang];
    const html = document.documentElement;

    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const els = document.querySelectorAll('[data-i18n]');
    els.forEach(el => { el.style.opacity = '0'; el.style.transition = 'opacity 0.2s ease'; });

    setTimeout(() => {
      els.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] === undefined) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else if (el.tagName === 'BUTTON' && el.dataset.state !== 'success') {
          el.textContent = t[key];
        } else if (el.tagName !== 'BUTTON') {
          el.textContent = t[key];
        }
        el.style.opacity = '1';
      });
    }, 200);

    // Active state on lang buttons
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('.lang-current').forEach(el => {
      el.textContent = lang.toUpperCase();
    });

    localStorage.setItem(KEY, lang);
    window._currentLang = lang;
  }

  function init() {
    const saved = localStorage.getItem(KEY) || 'en';
    window._currentLang = saved;
    applyLang(saved);

    // Toggle dropdowns
    document.querySelectorAll('.lang-switcher').forEach(sw => {
      const btn = sw.querySelector('.lang-btn');
      if (!btn) return;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = sw.classList.contains('open');
        document.querySelectorAll('.lang-switcher').forEach(s => s.classList.remove('open'));
        if (!isOpen) sw.classList.add('open');
      });
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLang(btn.dataset.lang);
        document.querySelectorAll('.lang-switcher').forEach(s => s.classList.remove('open'));
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.lang-switcher').forEach(s => s.classList.remove('open'));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.blazeLang = { applyLang, init };
})();
