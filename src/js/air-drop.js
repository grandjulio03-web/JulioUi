/**
 * Air Drop Engine  (Dropdown Menu)
 *
 * Init:  data-drop on .air-drop wrapper  (auto-scans on load)
 *        OR standalone: <div class="air-drop" data-drop>
 *
 * The first focusable child of .air-drop-menu is auto-focused on open.
 * Arrow keys navigate between .air-drop-item elements.
 * Escape or click-outside closes.
 *
 * API:
 *   Air.drop.open(dropEl)
 *   Air.drop.close(dropEl)
 *   Air.drop.refresh()
 */
(function () {
  'use strict';

  var openDrop = null;

  function getMenu(wrapper) {
    return wrapper.querySelector('.air-drop-menu');
  }

  function open(wrapper) {
    if (openDrop && openDrop !== wrapper) close(openDrop);

    var menu = getMenu(wrapper);
    if (!menu) return;

    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    openDrop = wrapper;

    // Focus first item
    requestAnimationFrame(function () {
      var first = menu.querySelector('.air-drop-item:not(:disabled):not(.is-disabled)');
      if (first) first.focus();
    });

    wrapper.dispatchEvent(new CustomEvent('air:drop:open', { bubbles: true }));
  }

  function close(wrapper) {
    var menu = getMenu(wrapper);
    if (!menu) return;

    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    if (openDrop === wrapper) openDrop = null;

    // Return focus to trigger
    var trigger = wrapper.querySelector('.air-drop-trigger, [data-drop-trigger]');
    if (trigger) trigger.focus();

    wrapper.dispatchEvent(new CustomEvent('air:drop:close', { bubbles: true }));
  }

  function toggle(wrapper) {
    var menu = getMenu(wrapper);
    if (!menu) return;
    menu.classList.contains('open') ? close(wrapper) : open(wrapper);
  }

  function initDrop(wrapper) {
    if (wrapper._airDropInit) return;
    wrapper._airDropInit = true;

    var menu = getMenu(wrapper);
    if (!menu) return;

    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-hidden', 'true');

    var trigger = wrapper.querySelector('.air-drop-trigger, [data-drop-trigger], button, a');
    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    }

    // Sync aria-expanded with open state
    var observer = new MutationObserver(function () {
      if (trigger) trigger.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
    });
    observer.observe(menu, { attributes: true, attributeFilter: ['class'] });

    // Click on trigger
    wrapper.addEventListener('click', function (e) {
      var item = e.target.closest('.air-drop-item');
      if (item) { close(wrapper); return; }  // close when item clicked

      var t = e.target.closest('.air-drop-trigger, [data-drop-trigger]');
      if (!t) {
        // Click anywhere in wrapper except the menu closes it if open
        if (!e.target.closest('.air-drop-menu')) toggle(wrapper);
        return;
      }
      toggle(wrapper);
    });

    // Arrow key navigation
    wrapper.addEventListener('keydown', function (e) {
      var menuOpen = menu.classList.contains('open');
      var items = Array.from(menu.querySelectorAll('.air-drop-item:not(:disabled):not(.is-disabled)'));

      if (e.key === 'Escape') { close(wrapper); return; }
      if (!menuOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(wrapper); }
        return;
      }

      var cur  = document.activeElement;
      var idx  = items.indexOf(cur);
      var next = -1;

      if (e.key === 'ArrowDown')  next = (idx + 1) % items.length;
      if (e.key === 'ArrowUp')    next = (idx - 1 + items.length) % items.length;
      if (e.key === 'Home')       next = 0;
      if (e.key === 'End')        next = items.length - 1;
      if (e.key === 'Tab')        { close(wrapper); return; }

      if (next >= 0) { e.preventDefault(); items[next].focus(); }
    });

    wrapper._airDrop = { open: open.bind(null, wrapper), close: close.bind(null, wrapper) };
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (openDrop && !openDrop.contains(e.target)) close(openDrop);
  });

  function scanAll() {
    document.querySelectorAll('[data-drop]').forEach(initDrop);
  }

  window.Air = window.Air || {};
  window.Air.drop = {
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
