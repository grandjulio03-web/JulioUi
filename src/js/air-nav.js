/**
 * Air Nav Engine
 * Powers all air-nav variants, air-side, air-trail.
 *
 * Vocabulary: brand · links · link · end · menu · fly · tab
 *
 * Public API:
 *   Air.nav.init()        re-init all navs (after dynamic insert)
 *   Air.nav.open(nav)     open mobile panel
 *   Air.nav.close(nav)    close mobile panel
 */
(function () {
  'use strict';

  var raf = window.requestAnimationFrame || function (f) { setTimeout(f, 16); };
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.from((c || document).querySelectorAll(s)); }

  // ── Scroll handler (data-scroll attr) ───────────────────────
  function watchScroll(nav) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (!tick) {
        raf(function () {
          nav.classList.toggle('is-scrolled', window.scrollY > 40);
          tick = false;
        });
        tick = true;
      }
    }, { passive: true });
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  // ── Sliding indicator (data-indicator attr) ──────────────────
  // Rail nav → .indicator (underline)
  // Float nav → .pill (background)
  function watchIndicator(nav) {
    var wrap  = nav.querySelector('.links');
    if (!wrap) return;

    var isFloat = nav.classList.contains('float');
    var ind = document.createElement('span');
    ind.className = isFloat ? 'pill' : 'indicator';
    ind.style.opacity = '0';
    ind.setAttribute('aria-hidden', 'true');
    wrap.appendChild(ind);

    var links = $$('.link', wrap);

    function move(el) {
      var wRect = wrap.getBoundingClientRect();
      var eRect = el.getBoundingClientRect();
      ind.style.left  = (eRect.left - wRect.left) + 'px';
      ind.style.width = eRect.width + 'px';
      ind.style.opacity = '1';
    }

    function toActive() {
      var active = wrap.querySelector('.link.active');
      if (active) move(active);
      else ind.style.opacity = '0';
    }

    links.forEach(function (l) {
      l.addEventListener('mouseenter', function () { move(l); });
      l.addEventListener('focus', function () { move(l); });
    });

    wrap.addEventListener('mouseleave', toActive);
    wrap.addEventListener('focusout', function (e) {
      if (!wrap.contains(e.relatedTarget)) toActive();
    });

    raf(toActive);
    window.addEventListener('resize', function () { raf(toActive); }, { passive: true });
  }

  // ── Mobile panel — built from existing nav content ───────────
  // Developer writes links ONCE. We clone them into the panel.
  function buildPanel(nav) {
    var panel = document.createElement('div');
    panel.className = 'air-nav-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Site navigation');

    // Head: brand clone + close button
    var head = document.createElement('div');
    head.className = 'air-nav-panel-head';

    var brandEl = nav.querySelector('.brand');
    if (brandEl) head.appendChild(brandEl.cloneNode(true));

    var xBtn = document.createElement('button');
    xBtn.className = 'air-nav-panel-x';
    xBtn.setAttribute('aria-label', 'Close menu');
    xBtn.innerHTML = '&#10005;';
    head.appendChild(xBtn);
    panel.appendChild(head);

    // Links: cloned from .links
    var srcLinks = nav.querySelector('.links');
    if (srcLinks) {
      var pLinks = document.createElement('div');
      pLinks.className = 'air-nav-panel-links';
      $$('.link', srcLinks).forEach(function (a) {
        var clone = a.cloneNode(true);
        // Remove dropdown arrow text artifacts
        delete clone.dataset.fly;
        clone.removeAttribute('aria-expanded');
        clone.removeAttribute('aria-haspopup');
        pLinks.appendChild(clone);
      });
      panel.appendChild(pLinks);
    }

    // Foot: cloned action buttons
    var srcEnd = nav.querySelector('.end');
    if (srcEnd) {
      var foot = document.createElement('div');
      foot.className = 'air-nav-panel-foot';
      $$('a, button', srcEnd).forEach(function (el) {
        var clone = el.cloneNode(true);
        clone.style.width = '100%';
        foot.appendChild(clone);
      });
      panel.appendChild(foot);
    }

    return panel;
  }

  function initPanel(nav) {
    var toggle = nav.querySelector('.menu');
    if (!toggle) return;

    var panel   = buildPanel(nav);
    var shade   = document.createElement('div');
    shade.className = 'air-nav-shade';
    shade.setAttribute('aria-hidden', 'true');

    nav.appendChild(panel);
    document.body.appendChild(shade);

    function open() {
      panel.classList.add('open');
      shade.classList.add('show');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var f = panel.querySelector('.link');
      if (f) raf(function () { f.focus(); });
    }

    function close() {
      panel.classList.remove('open');
      shade.classList.remove('show');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      panel.classList.contains('open') ? close() : open();
    });

    shade.addEventListener('click', close);
    panel.querySelector('.air-nav-panel-x')?.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) close();
    });

    nav._open  = open;
    nav._close = close;
  }

  // ── Fly (dropdown) ───────────────────────────────────────────
  function initFlies(nav) {
    $$('[data-fly]', nav).forEach(function (trigger) {
      var id   = trigger.dataset.fly;
      var fly  = document.getElementById(id);
      var cell = trigger.closest('li, div');
      if (!fly) return;

      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-haspopup', 'true');

      function openFly() {
        // Close others
        $$('.fly.open', nav).forEach(function (f) {
          if (f !== fly) {
            f.classList.remove('open');
            var t = nav.querySelector('[data-fly="' + f.id + '"]');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });

        fly.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');

        // Viewport edge detection
        raf(function () {
          var r = fly.getBoundingClientRect();
          fly.classList.toggle('right', r.right > window.innerWidth - 8);
          fly.classList.toggle('left',  r.left < 8 && !fly.classList.contains('right'));
        });
      }

      function closeFly() {
        fly.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      // Hover (desktop)
      if (cell) {
        cell.addEventListener('mouseenter', openFly);
        cell.addEventListener('mouseleave', closeFly);
      }

      // Click / touch
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        fly.classList.contains('open') ? closeFly() : openFly();
      });

      // Keyboard
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          openFly();
          var first = fly.querySelector('.fly-row');
          if (first) raf(function () { first.focus(); });
        }
      });

      fly.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeFly(); trigger.focus(); }
      });
    });

    // Outside click closes all
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        $$('.fly.open', nav).forEach(function (f) { f.classList.remove('open'); });
        $$('[data-fly][aria-expanded="true"]', nav).forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // ── Floor nav (bottom bar) ───────────────────────────────────
  function initFloor(nav) {
    $$('.tab', nav).forEach(function (tab) {
      tab.addEventListener('click', function () {
        $$('.tab', nav).forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
      });
    });
  }

  // ── Main init ────────────────────────────────────────────────
  function initOne(nav) {
    if (nav._airInit) return;
    nav._airInit = true;

    if (nav.classList.contains('floor')) { initFloor(nav); return; }

    if (nav.hasAttribute('data-scroll'))    watchScroll(nav);
    if (nav.hasAttribute('data-indicator')) {
      // Wait for fonts to load so getBoundingClientRect is accurate
      var whenReady = document.fonts ? document.fonts.ready : Promise.resolve();
      whenReady.then(function () { watchIndicator(nav); });
    }

    initFlies(nav);
    initPanel(nav);
  }

  function initAll() { $$('.air-nav').forEach(initOne); }

  // ── Public API ───────────────────────────────────────────────
  window.Air = window.Air || {};
  window.Air.nav = {
    init:  initAll,
    open:  function (nav) { nav && nav._open  && nav._open(); },
    close: function (nav) { nav && nav._close && nav._close(); },
  };

  // Auto-start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

}());
