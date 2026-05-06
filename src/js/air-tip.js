/**
 * Air Tip Engine  (Rich Popover)
 *
 * Init:  .air-tip wrapper is auto-scanned
 *        data-tip-trigger="hover"  (default) or "click"
 *        data-pos="bottom"  positioning hint
 *
 * Inside .air-tip any element with [data-tip-close] closes the popover.
 * Click outside or Escape also closes click-trigger popovers.
 *
 * API:
 *   Air.tip.open(tipEl)
 *   Air.tip.close(tipEl)
 *   Air.tip.refresh()
 */
(function () {
  'use strict';

  var HOVER_DELAY  = 120;   // ms before showing on hover
  var LEAVE_DELAY  = 180;   // ms before hiding on mouseleave

  function getBox(wrapper) {
    return wrapper.querySelector('.air-tip-box');
  }

  function open(wrapper) {
    var box = getBox(wrapper);
    if (!box) return;
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    wrapper.dispatchEvent(new CustomEvent('air:tip:open', { bubbles: true }));
  }

  function close(wrapper) {
    var box = getBox(wrapper);
    if (!box) return;
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    wrapper.dispatchEvent(new CustomEvent('air:tip:close', { bubbles: true }));
  }

  function initTip(wrapper) {
    if (wrapper._airTipInit) return;
    wrapper._airTipInit = true;

    var box     = getBox(wrapper);
    if (!box) return;

    var mode    = wrapper.dataset.tipTrigger || 'hover';
    var openTimer = null;
    var closeTimer = null;

    box.setAttribute('aria-hidden', 'true');
    box.setAttribute('role', 'tooltip');

    // Close button inside box
    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-tip-close], .air-tip-x')) close(wrapper);
    });

    if (mode === 'hover') {
      wrapper.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
        openTimer = setTimeout(function () { open(wrapper); }, HOVER_DELAY);
      });

      wrapper.addEventListener('mouseleave', function () {
        clearTimeout(openTimer);
        closeTimer = setTimeout(function () { close(wrapper); }, LEAVE_DELAY);
      });

      // Keep open when hovering the box itself
      box.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
      box.addEventListener('mouseleave', function () {
        closeTimer = setTimeout(function () { close(wrapper); }, LEAVE_DELAY);
      });

      // Keyboard accessibility
      wrapper.addEventListener('focusin',  function () { open(wrapper); });
      wrapper.addEventListener('focusout', function (e) {
        if (!wrapper.contains(e.relatedTarget)) close(wrapper);
      });

    } else {
      // Click mode
      wrapper.addEventListener('click', function (e) {
        if (e.target.closest('[data-tip-close], .air-tip-x')) return;
        box.classList.contains('open') ? close(wrapper) : open(wrapper);
      });

      wrapper.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close(wrapper);
      });
    }

    wrapper._airTip = { open: open.bind(null, wrapper), close: close.bind(null, wrapper) };
  }

  // Global: click outside closes click-mode tips
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.air-tip').forEach(function (wrapper) {
      if (wrapper.dataset.tipTrigger === 'click' && !wrapper.contains(e.target)) {
        close(wrapper);
      }
    });
  });

  // Global: Escape closes any open tip
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.air-tip-box.open').forEach(function (box) {
        var wrapper = box.closest('.air-tip');
        if (wrapper) close(wrapper);
      });
    }
  });

  function scanAll() {
    document.querySelectorAll('.air-tip').forEach(initTip);
  }

  window.Air = window.Air || {};
  window.Air.tip = {
    open:    open,
    close:   close,
    refresh: scanAll,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAll);
  } else {
    scanAll();
  }

}());
