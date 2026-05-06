/**
 * Air Fold Engine  (Accordion / Collapse)
 *
 * Init:  data-fold on .air-fold wrapper
 *        data-single → only one item open at a time
 *
 * Toggle a specific item:  Air.fold.toggle(itemEl)
 * Open/close by index:     Air.fold.open(wrapperEl, 0)
 *                          Air.fold.close(wrapperEl, 0)
 * Refresh (new DOM):       Air.fold.refresh()
 */
(function () {
  'use strict';

  function initFold(wrapper) {
    if (wrapper._airFoldInit) return;
    wrapper._airFoldInit = true;

    var single = wrapper.hasAttribute('data-single');

    function toggle(item) {
      var isOpen = item.classList.contains('open');

      // Single mode: close all others first
      if (single && !isOpen) {
        Array.from(wrapper.querySelectorAll('.air-fold-item.open')).forEach(function (el) {
          if (el !== item) close(el);
        });
      }

      isOpen ? close(item) : open(item);
    }

    function open(item) {
      item.classList.add('open');
      var trigger = item.querySelector('.air-fold-trigger');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'true');
      }
      wrapper.dispatchEvent(new CustomEvent('air:fold:open', { detail: { item: item }, bubbles: true }));
    }

    function close(item) {
      item.classList.remove('open');
      var trigger = item.querySelector('.air-fold-trigger');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
      wrapper.dispatchEvent(new CustomEvent('air:fold:close', { detail: { item: item }, bubbles: true }));
    }

    // Setup ARIA
    wrapper.querySelectorAll('.air-fold-item').forEach(function (item) {
      var trigger = item.querySelector('.air-fold-trigger');
      var panel   = item.querySelector('.air-fold-panel');
      if (!trigger) return;

      trigger.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
      if (panel) {
        var id = panel.id || ('air-fold-panel-' + Math.random().toString(36).slice(2));
        panel.id = id;
        trigger.setAttribute('aria-controls', id);
      }
    });

    // Click delegation
    wrapper.addEventListener('click', function (e) {
      var trigger = e.target.closest('.air-fold-trigger');
      if (!trigger) return;
      var item = trigger.closest('.air-fold-item');
      if (item && wrapper.contains(item)) toggle(item);
    });

    // Keyboard: Enter / Space on trigger
    wrapper.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var trigger = e.target.closest('.air-fold-trigger');
      if (!trigger) return;
      e.preventDefault();
      var item = trigger.closest('.air-fold-item');
      if (item && wrapper.contains(item)) toggle(item);
    });

    // Expose on wrapper
    wrapper._airFold = { open: open, close: close, toggle: toggle };
  }

  function scanAll() {
    document.querySelectorAll('[data-fold]').forEach(initFold);
  }

  // Public API
  window.Air = window.Air || {};
  window.Air.fold = {
    refresh: scanAll,
    toggle: function (itemEl) {
      var wrapper = itemEl.closest('[data-fold]');
      if (wrapper && wrapper._airFold) wrapper._airFold.toggle(itemEl);
    },
    open: function (wrapperEl, index) {
      var item = wrapperEl.querySelectorAll('.air-fold-item')[index];
      if (item && wrapperEl._airFold) wrapperEl._airFold.open(item);
    },
    close: function (wrapperEl, index) {
      var item = wrapperEl.querySelectorAll('.air-fold-item')[index];
      if (item && wrapperEl._airFold) wrapperEl._airFold.close(item);
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAll);
  } else {
    scanAll();
  }

}());
