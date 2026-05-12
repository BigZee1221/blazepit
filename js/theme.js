/* ============================================================
   BLAZE PIT — THEME (Dark / Light Toggle)
   ============================================================ */

(function () {
  const KEY = 'blazepit_theme';

  const sunSVG  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const moonSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function applyTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem(KEY, theme);
    updateIcons(theme);
  }

  function updateIcons(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.innerHTML = theme === 'light' ? moonSVG : sunSVG;
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  function toggle() {
    const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(next);
  }

  const saved = localStorage.getItem(KEY) || 'dark';
  if (saved === 'light') {
    document.body.classList.add('light-mode');
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateIcons(saved);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  });

  window.blazeTheme = { toggle, applyTheme };
})();
