/**
 * Air Animate — Scroll-triggered entry animations
 *
 * Add data-animate="name" to any element.
 * When it enters the viewport, the class .awake is added
 * and CSS transitions/animations fire.
 *
 * data-animate="rise|fade|drop|left|right|pop|blur|flip|zoom|wipe"
 * data-delay="200"              delay before .awake (ms)
 * data-once="false"             re-animate every time (default: once)
 *
 * Stagger parent:
 * data-stagger="rise"           animates all direct children
 * data-stagger-step="80"        ms between each child (default: 70)
 *
 * API:
 *   Air.animate.refresh()       re-scan for new elements
 *   Air.animate.wake(el)        manually wake an element
 *   Air.animate.sleep(el)       manually reset (re-animate on next scroll)
 */
(function () {
  'use strict';

  var THRESHOLD = 0.12;   // 12% of element must be visible
  var ROOT_MARGIN = '0px 0px -5% 0px';  // trigger slightly before fully in view

  // ── IntersectionObserver ─────────────────────────────────────
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el    = entry.target;
      var delay = parseInt(el.dataset.delay || el.style.getPropertyValue('--anim-delay') || '0', 10);
      var once  = el.dataset.once !== 'false';

      setTimeout(function () {
        el.classList.add('awake');
        if (once) observer.unobserve(el);
      }, delay);
    });
  }, {
    threshold:  THRESHOLD,
    rootMargin: ROOT_MARGIN,
  });

  // ── Scan for animated elements ────────────────────────────────
  function scan() {
    // Single elements
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      if (el._airAnimInit) return;
      el._airAnimInit = true;

      // Apply delay as CSS custom property if set
      var delay = el.dataset.delay;
      if (delay) el.style.transitionDelay = delay + 'ms';

      observer.observe(el);
    });

    // Stagger parents
    document.querySelectorAll('[data-stagger]').forEach(function (parent) {
      if (parent._airStaggerInit) return;
      parent._airStaggerInit = true;

      var name  = parent.dataset.stagger;
      var step  = parseInt(parent.dataset.staggerStep || '70', 10);
      var once  = parent.dataset.once !== 'false';

      // Apply animation type + staggered delay to each direct child
      Array.from(parent.children).forEach(function (child, i) {
        if (!child.dataset.animate) child.dataset.animate = name;
        // Only set delay if not already specified on the child
        if (!child.dataset.delay) {
          var d = i * step;
          child.dataset.delay = d;
          child.style.transitionDelay = d + 'ms';
        }
        if (!child._airAnimInit) {
          child._airAnimInit = true;
          observer.observe(child);
        }
      });
    });
  }

  // ── MutationObserver — pick up dynamically added elements ─────
  var mutationObs = new MutationObserver(function (mutations) {
    var needsScan = false;
    mutations.forEach(function (mut) {
      mut.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) needsScan = true;
      });
    });
    if (needsScan) scan();
  });

  mutationObs.observe(document.body, { childList: true, subtree: true });

  // ── Public API ────────────────────────────────────────────────
  window.Air = window.Air || {};
  window.Air.animate = {
    refresh: scan,
    wake: function (el) {
      el.classList.add('awake');
    },
    sleep: function (el) {
      el.classList.remove('awake');
      // Re-observe so it animates again next time
      observer.observe(el);
    },
  };

  // Auto-start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }

}());
