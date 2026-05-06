/**
 * Air Stars Engine  (Interactive Rating)
 *
 * Init:  data-stars on .air-stars wrapper
 *        data-value="3"  — pre-set value
 *        data-readonly   — render only, no clicks
 *
 * Each .air-star should have data-value="1"..."5"
 * JS auto-generates stars if none exist.
 *
 * Events:
 *   air:stars:change  → detail: { value, wrapper }
 *
 * API:
 *   Air.stars.set(wrapperEl, value)
 *   Air.stars.get(wrapperEl)
 *   Air.stars.refresh()
 */
(function () {
  'use strict';

  var SVG_STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

  function initStars(wrapper) {
    if (wrapper._airStarsInit) return;
    wrapper._airStarsInit = true;

    var count    = parseInt(wrapper.dataset.stars || '5', 10);
    var readOnly = wrapper.hasAttribute('data-readonly');
    var current  = parseFloat(wrapper.dataset.value || '0');

    // Build stars if not already in DOM
    if (!wrapper.querySelector('.air-star')) {
      for (var i = 1; i <= count; i++) {
        var star = document.createElement('span');
        star.className = 'air-star';
        star.setAttribute('data-value', i);
        star.setAttribute('aria-label', i + ' star' + (i !== 1 ? 's' : ''));
        star.innerHTML = SVG_STAR;
        wrapper.appendChild(star);
      }
    }

    var stars = Array.from(wrapper.querySelectorAll('.air-star'));

    function render(val) {
      stars.forEach(function (star) {
        var v = parseFloat(star.dataset.value);
        star.classList.toggle('lit', v <= val);
      });
    }

    function set(val) {
      current = val;
      wrapper.dataset.value = val;
      render(val);
      wrapper.dispatchEvent(new CustomEvent('air:stars:change', { detail: { value: val, wrapper: wrapper }, bubbles: true }));
    }

    if (!readOnly) {
      wrapper.setAttribute('role', 'radiogroup');
      wrapper.setAttribute('aria-label', 'Rating');

      stars.forEach(function (star) {
        star.setAttribute('role', 'radio');
        star.setAttribute('tabindex', '0');
        star.setAttribute('aria-checked', parseFloat(star.dataset.value) === current ? 'true' : 'false');

        star.addEventListener('mouseenter', function () {
          render(parseFloat(star.dataset.value));
        });

        star.addEventListener('mouseleave', function () {
          render(current);
        });

        star.addEventListener('click', function () {
          var val = parseFloat(star.dataset.value);
          set(val === current ? 0 : val);  // click same star to clear
          stars.forEach(function (s) {
            s.setAttribute('aria-checked', parseFloat(s.dataset.value) === current ? 'true' : 'false');
          });
        });

        star.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            star.click();
          }
          var idx = stars.indexOf(star);
          if (e.key === 'ArrowRight' && idx < stars.length - 1) stars[idx + 1].focus();
          if (e.key === 'ArrowLeft'  && idx > 0)                stars[idx - 1].focus();
        });
      });
    }

    render(current);
    wrapper._airStars = { set: set, get: function () { return current; } };
  }

  function scanAll() {
    document.querySelectorAll('[data-stars]').forEach(initStars);
  }

  window.Air = window.Air || {};
  window.Air.stars = {
    set:     function (el, val) { if (el._airStars) el._airStars.set(val); },
    get:     function (el)      { return el._airStars ? el._airStars.get() : 0; },
    refresh: scanAll,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAll);
  } else {
    scanAll();
  }

}());
