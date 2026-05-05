/**
 * Air Modal Engine
 *
 * Triggers:  data-open="modal-id"   opens target modal/drawer
 *            data-close             closes nearest parent modal/drawer
 * Backdrop click + Escape also close.
 *
 * API:
 *   Air.modal.open('id')
 *   Air.modal.close('id')    (or Air.modal.close() for topmost)
 *   Air.modal.onOpen(fn)     subscribe — fn(modalEl)
 *   Air.modal.onClose(fn)    subscribe — fn(modalEl)
 */
(function () {
  'use strict';

  var stack    = [];   // open modal stack
  var openCbs  = [];
  var closeCbs = [];

  function emit(cbs, el) { cbs.forEach(function (fn) { fn(el); }); }

  // ── Focus trap ───────────────────────────────────────────────
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function trapFocus(modal, e) {
    var box   = modal.querySelector('.air-modal-box, .air-drawer');
    if (!box) return;
    var items = Array.from(box.querySelectorAll(FOCUSABLE)).filter(function (el) {
      return !el.closest('[hidden]') && el.offsetParent !== null;
    });
    if (!items.length) return;
    var first = items[0];
    var last  = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // ── Open ─────────────────────────────────────────────────────
  function openModal(id) {
    var el = document.getElementById(id);
    if (!el || el.classList.contains('open')) return;

    el.classList.add('open');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('role', el.classList.contains('air-drawer') ? 'complementary' : 'dialog');

    var prevFocus = document.activeElement;
    el._prevFocus = prevFocus;

    // Prevent body scroll when a stacked modal is present
    stack.push(el);
    if (stack.length === 1) document.body.style.overflow = 'hidden';

    // Focus first focusable element
    var box = el.querySelector('.air-modal-box, .air-drawer');
    if (box) {
      var first = box.querySelector(FOCUSABLE);
      if (first) requestAnimationFrame(function () { first.focus(); });
    }

    el._trapFn = function (e) { if (e.key === 'Tab') trapFocus(el, e); };
    document.addEventListener('keydown', el._trapFn);

    emit(openCbs, el);
  }

  // ── Close ─────────────────────────────────────────────────────
  function closeModal(el) {
    if (!el || !el.classList.contains('open')) return;

    el.classList.remove('open');
    el.removeAttribute('aria-modal');

    stack = stack.filter(function (m) { return m !== el; });
    if (stack.length === 0) document.body.style.overflow = '';

    if (el._trapFn) document.removeEventListener('keydown', el._trapFn);

    if (el._prevFocus && el._prevFocus.focus) {
      requestAnimationFrame(function () { el._prevFocus.focus(); });
    }

    emit(closeCbs, el);
  }

  function closeById(id) {
    var el = id ? document.getElementById(id) : stack[stack.length - 1];
    if (el) closeModal(el);
  }

  // ── Event delegation ──────────────────────────────────────────
  document.addEventListener('click', function (e) {
    // Open trigger
    var opener = e.target.closest('[data-open]');
    if (opener) { openModal(opener.dataset.open); return; }

    // Close trigger inside modal
    var closer = e.target.closest('[data-close]');
    if (closer) {
      var parent = closer.closest('.air-modal, .air-drawer');
      if (parent) { closeModal(parent); return; }
    }

    // Backdrop click (clicked the .air-modal itself, not the box)
    if (e.target.classList.contains('air-modal')) {
      closeModal(e.target);
    }
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && stack.length) closeModal(stack[stack.length - 1]);
  });

  // ── Public API ────────────────────────────────────────────────
  window.Air = window.Air || {};
  window.Air.modal = {
    open:    openModal,
    close:   closeById,
    onOpen:  function (fn) { openCbs.push(fn); },
    onClose: function (fn) { closeCbs.push(fn); },
  };

}());
