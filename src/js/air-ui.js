/**
 * JForceX Air UI — behaviors that keep HTML minimal.
 * Include dist/my-framework.js once; use data-* hooks below.
 */
(function () {
  'use strict';

  window.JForceX = window.JForceX || {};

  /* ---------- Button loading (submit / click) ---------- */
  function ensureButtonLoadingStructure(btn) {
    if (btn.querySelector('.jf-btn__spinner')) return;
    var label = document.createElement('span');
    label.className = 'jf-btn__label';
    while (btn.firstChild) {
      label.appendChild(btn.firstChild);
    }
    var spin = document.createElement('span');
    spin.className = 'jf-btn__spinner air-spinner air-spinner--dual air-spinner--sm';
    spin.setAttribute('aria-hidden', 'true');
    btn.appendChild(label);
    btn.appendChild(spin);
  }

  function setButtonLoading(btn, loading) {
    ensureButtonLoadingStructure(btn);
    btn.classList.toggle('is-loading', loading);
    if (loading) {
      btn.setAttribute('disabled', 'disabled');
      btn.setAttribute('aria-busy', 'true');
    } else {
      btn.removeAttribute('disabled');
      btn.setAttribute('aria-busy', 'false');
    }
  }

  window.JForceX.setButtonLoading = function (btn, loading) {
    if (!btn) return;
    setButtonLoading(btn, !!loading);
    if (!loading && btn.dataset.jfOriginalLabel && btn.querySelector('.jf-btn__label')) {
      btn.querySelector('.jf-btn__label').textContent = btn.dataset.jfOriginalLabel;
      delete btn.dataset.jfOriginalLabel;
    }
  };

  function initJfLoadingButtons() {
    document.querySelectorAll('[data-jf-loading]').forEach(function (btn) {
      ensureButtonLoadingStructure(btn);
    });
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    var btn = form.querySelector('button[type="submit"][data-jf-loading], input[type="submit"][data-jf-loading]');
    if (!btn || btn.disabled) return;

    var manual = btn.hasAttribute('data-jf-loading-manual');
    var demo = form.hasAttribute('data-jf-form-demo');

    if (!demo && !manual) {
      return;
    }

    var ms = parseInt(
      btn.getAttribute('data-jf-loading-ms') ||
        form.getAttribute('data-jf-loading-ms') ||
        '1400',
      10
    );

    if (demo) {
      e.preventDefault();
    }

    if (btn.classList.contains('is-loading') && demo) {
      return;
    }

    ensureButtonLoadingStructure(btn);
    var labelEl = btn.querySelector('.jf-btn__label');
    var savingText = btn.getAttribute('data-jf-loading-label');
    if (savingText && labelEl && !btn.dataset.jfOriginalLabel) {
      btn.dataset.jfOriginalLabel = labelEl.textContent;
      labelEl.textContent = savingText;
    }

    setButtonLoading(btn, true);

    if (!manual && demo) {
      window.setTimeout(function () {
        window.JForceX.setButtonLoading(btn, false);
      }, ms);
    }
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-jf-loading-click]');
    if (!btn || btn.type === 'submit') return;
    var manual = btn.hasAttribute('data-jf-loading-manual');
    var ms = parseInt(btn.getAttribute('data-jf-loading-ms') || '1400', 10);

    ensureButtonLoadingStructure(btn);
    var labelEl = btn.querySelector('.jf-btn__label');
    var savingText = btn.getAttribute('data-jf-loading-label');
    if (savingText && labelEl && !btn.dataset.jfOriginalLabel) {
      btn.dataset.jfOriginalLabel = labelEl.textContent;
      labelEl.textContent = savingText;
    }

    setButtonLoading(btn, true);
    if (!manual) {
      window.setTimeout(function () {
        window.JForceX.setButtonLoading(btn, false);
      }, ms);
    }
  });

  /* ---------- Air bar (rib navbar) ---------- */
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-airbar-toggle]');
    if (toggle) {
      var sel = toggle.getAttribute('data-airbar-toggle');
      var panel = document.querySelector(sel);
      if (panel) {
        var opened = panel.classList.toggle('is-open');
        toggle.classList.toggle('is-active', opened);
        toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
      }
      return;
    }

    document.querySelectorAll('.air-bar__links.is-open, [data-airbar-panel].is-open').forEach(function (panel) {
      if (panel.contains(e.target)) return;
      var id = panel.id;
      var t = id ? document.querySelector('[data-airbar-toggle="#' + id + '"]') : null;
      panel.classList.remove('is-open');
      if (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Neo nav mobile toggle ---------- */
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-nav-toggle]');
    if (!toggle) return;
    var sel = toggle.getAttribute('data-nav-toggle');
    var panel = document.querySelector(sel);
    if (panel) {
      panel.classList.toggle('is-open');
    }
  });

  /* ---------- Page loader toggle ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-jf-page-loader-toggle]');
    if (!t) return;
    var sel = t.getAttribute('data-jf-page-loader-toggle');
    if (!sel) return;
    var el = document.querySelector(sel);
    if (el) {
      el.classList.toggle('is-hidden');
    }
  });

  /* ---------- Magic spinners (HTML-driven, no custom JS) ---------- */
  function ensureSpinnerChildren(el) {
    if (!el) return;
    var variant = '';
    if (el.classList.contains('spin-dot')) variant = 'dot';
    else if (el.classList.contains('spin-wave')) variant = 'wave';
    else if (el.classList.contains('spin-grid')) variant = 'grid';

    if (!variant && el.getAttribute('data-jf-spin')) {
      variant = el.getAttribute('data-jf-spin');
    }

    var required = 0;
    if (variant === 'dot') required = 3;
    if (variant === 'wave') required = 4;
    if (variant === 'grid') required = 9;
    if (!required) return;

    while (el.children.length < required) {
      el.appendChild(document.createElement('span'));
    }
    while (el.children.length > required) {
      el.removeChild(el.lastElementChild);
    }
  }

  function applySpinnerConfig(el, cfg) {
    if (!el) return;
    el.classList.add('spin');

    [
      'spin-ring',
      'spin-dual',
      'spin-orbit',
      'spin-pulse',
      'spin-flux',
      'spin-dot',
      'spin-wave',
      'spin-grid',
    ].forEach(function (c) {
      el.classList.remove(c);
    });
    ['spin-xs', 'spin-sm', 'spin-md', 'spin-lg', 'spin-xl'].forEach(function (c) {
      el.classList.remove(c);
    });
    ['spin-ace', 'spin-beta', 'spin-gamma', 'spin-delta', 'spin-epsilon'].forEach(function (c) {
      el.classList.remove(c);
    });
    ['spin-fast', 'spin-slow'].forEach(function (c) {
      el.classList.remove(c);
    });

    var variant = cfg.variant || el.getAttribute('data-jf-spin') || 'ring';
    var size = cfg.size || el.getAttribute('data-jf-spin-size') || 'md';
    var tone = cfg.tone || el.getAttribute('data-jf-spin-tone') || 'ace';
    var speed = cfg.speed || el.getAttribute('data-jf-spin-speed') || '';

    el.classList.add('spin-' + variant);
    el.classList.add('spin-' + size);
    el.classList.add('spin-' + tone);
    if (speed === 'fast' || speed === 'slow') {
      el.classList.add('spin-' + speed);
    }

    ensureSpinnerChildren(el);
  }

  function initMagicSpinners(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-jf-spin]').forEach(function (el) {
      applySpinnerConfig(el, {});
    });
  }

  function applyToSpinnerTargets(targetSel, updater) {
    if (!targetSel) return;
    document.querySelectorAll(targetSel).forEach(function (el) {
      var next = {
        variant: el.getAttribute('data-jf-spin') || '',
        size: el.getAttribute('data-jf-spin-size') || '',
        tone: el.getAttribute('data-jf-spin-tone') || '',
        speed: el.getAttribute('data-jf-spin-speed') || '',
      };
      updater(next, el);
      if (next.variant) el.setAttribute('data-jf-spin', next.variant);
      if (next.size) el.setAttribute('data-jf-spin-size', next.size);
      if (next.tone) el.setAttribute('data-jf-spin-tone', next.tone);
      if (next.speed) el.setAttribute('data-jf-spin-speed', next.speed);
      applySpinnerConfig(el, next);
    });
  }

  document.addEventListener('click', function (e) {
    var toneBtn = e.target.closest('[data-jf-spin-tone]');
    if (toneBtn) {
      applyToSpinnerTargets(
        toneBtn.getAttribute('data-jf-spin-target') || '[data-jf-spin-demo]',
        function (next) {
          next.tone = toneBtn.getAttribute('data-jf-spin-tone') || 'ace';
        }
      );
      return;
    }

    var sizeBtn = e.target.closest('[data-jf-spin-size]');
    if (sizeBtn) {
      applyToSpinnerTargets(
        sizeBtn.getAttribute('data-jf-spin-target') || '[data-jf-spin-demo]',
        function (next) {
          next.size = sizeBtn.getAttribute('data-jf-spin-size') || 'md';
        }
      );
      return;
    }

    var speedBtn = e.target.closest('[data-jf-spin-speed]');
    if (speedBtn) {
      applyToSpinnerTargets(
        speedBtn.getAttribute('data-jf-spin-target') || '[data-jf-spin-demo]',
        function (next) {
          next.speed = speedBtn.getAttribute('data-jf-spin-speed') || '';
        }
      );
      return;
    }

    var loaderToggle = e.target.closest('[data-jf-loader-toggle]');
    if (loaderToggle) {
      var sel = loaderToggle.getAttribute('data-jf-loader-toggle');
      if (!sel) return;
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.toggle('loading');
      });
    }
  });

  window.JForceX.initSpinners = function (root) {
    initMagicSpinners(root || document);
  };

  window.JForceX.spin = function (el, options) {
    if (!el) return;
    applySpinnerConfig(el, options || {});
  };

  /* ---------- Air capsule pagination (defensive) ---------- */
  function initAirCapsulePagination() {
    var roots = document.querySelectorAll('[data-jf-air-pagination]');
    if (!roots.length) {
      var prev = document.getElementById('prevBtn');
      var next = document.getElementById('nextBtn');
      var content = document.querySelector('.air-pagination-content');
      var pageBtns = document.querySelectorAll('.air-pagination .page-btn');
      if (!prev || !next || !content || !pageBtns.length) return;
      bindPagination(null, content, prev, next, pageBtns);
      return;
    }

    roots.forEach(function (root) {
      var sel = root.getAttribute('data-jf-pagination-content');
      var content = sel ? document.querySelector(sel) : document.querySelector('.air-pagination-content');
      var prev = root.querySelector('[data-jf-pagination-prev]') || root.querySelector('#prevBtn');
      var next = root.querySelector('[data-jf-pagination-next]') || root.querySelector('#nextBtn');
      var pageBtns = root.querySelectorAll('.page-btn');
      if (!content || !prev || !next || !pageBtns.length) return;
      bindPagination(root, content, prev, next, pageBtns);
    });
  }

  function bindPagination(root, content, prevBtn, nextBtn, pageButtons) {
    var pageCopy = {};
    if (root && root.getAttribute('data-jf-pagination-pages')) {
      try {
        pageCopy = JSON.parse(root.getAttribute('data-jf-pagination-pages'));
      } catch (err) {
        pageCopy = {};
      }
    }

    var current = 1;
    var total = pageButtons.length;

    function render(page) {
      current = page;
      pageButtons.forEach(function (btn) {
        var n = parseInt(btn.getAttribute('data-page'), 10);
        var active = n === page;
        btn.classList.toggle('active', active);
        btn.classList.toggle('is-active', active);
      });
      prevBtn.disabled = page === 1;
      nextBtn.disabled = page === total;
      var key = String(page);
      if (pageCopy[key]) {
        content.textContent = pageCopy[key];
      } else if (pageCopy[page]) {
        content.textContent = pageCopy[page];
      } else {
        content.textContent = 'Page ' + page + ' content goes here.';
      }
    }

    pageButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        render(parseInt(btn.getAttribute('data-page'), 10));
      });
    });
    prevBtn.addEventListener('click', function () {
      if (current > 1) render(current - 1);
    });
    nextBtn.addEventListener('click', function () {
      if (current < total) render(current + 1);
    });
  }

  function boot() {
    initJfLoadingButtons();
    initMagicSpinners(document);
    initAirCapsulePagination();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
