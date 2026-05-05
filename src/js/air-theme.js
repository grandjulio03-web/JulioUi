/**
 * Air Theme — Light / Dark switching
 *
 * Sets data-theme="dark"|"light" on <html>.
 * Saves preference to localStorage.
 * Reads system preference on first visit.
 *
 * Triggers:
 *   [data-theme-toggle]   any element — toggles on click
 *
 * API:
 *   Air.theme.toggle()         toggle light/dark
 *   Air.theme.set('dark')      set explicitly
 *   Air.theme.set('light')
 *   Air.theme.get()            returns 'dark' | 'light'
 *   Air.theme.onChange(fn)     subscribe — fn('dark'|'light')
 */
(function () {
  'use strict';

  var KEY       = 'air-theme';
  var html      = document.documentElement;
  var listeners = [];

  function emit(theme) {
    listeners.forEach(function (fn) { fn(theme); });
  }

  function set(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    emit(theme);
    updateToggles(theme);
  }

  function get() {
    return html.getAttribute('data-theme') || 'light';
  }

  function toggle() {
    set(get() === 'dark' ? 'light' : 'dark');
  }

  function updateToggles(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  function init() {
    // Load saved preference
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}

    if (saved) {
      // User explicitly chose a theme
      set(saved);
    } else {
      // Respect system preference
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.setAttribute('data-theme', 'dark');
        updateToggles('dark');
        // Don't save — let system preference keep working
      }
    }

    // Listen for system preference changes (when no saved preference)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var hasSaved = false;
        try { hasSaved = !!localStorage.getItem(KEY); } catch (err) {}
        if (!hasSaved) {
          html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          updateToggles(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Click delegation for toggle buttons
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-theme-toggle]')) toggle();
    });
  }

  // ── Public API ────────────────────────────────────────────────
  window.Air = window.Air || {};
  window.Air.theme = {
    toggle:   toggle,
    set:      set,
    get:      get,
    onChange: function (fn) { listeners.push(fn); },
  };

  // Run immediately (before DOM ready) to prevent flash
  (function () {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) {
      html.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.setAttribute('data-theme', 'dark');
    }
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
