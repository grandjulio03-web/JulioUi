/**
 * Air Reel Engine  (Carousel / Slider)
 *
 * Init:  data-reel on .air-reel wrapper
 *        data-autoplay="3000"  — autoplay interval in ms
 *        data-loop             — wrap at ends
 *
 * API:
 *   Air.reel.next(reelEl)
 *   Air.reel.prev(reelEl)
 *   Air.reel.go(reelEl, index)
 *   Air.reel.refresh()
 */
(function () {
  'use strict';

  function initReel(wrapper) {
    if (wrapper._airReelInit) return;
    wrapper._airReelInit = true;

    var track    = wrapper.querySelector('.air-reel-track');
    var slides   = track ? Array.from(track.querySelectorAll('.air-reel-slide')) : [];
    var dotsEl   = wrapper.querySelector('.air-reel-dots');
    var prevBtn  = wrapper.querySelector('.air-reel-prev');
    var nextBtn  = wrapper.querySelector('.air-reel-next');
    var isFade   = wrapper.classList.contains('fade');
    var isLoop   = wrapper.hasAttribute('data-loop');
    var autoplay = parseInt(wrapper.dataset.autoplay || '0', 10);

    if (!slides.length) return;

    var current  = 0;
    var total    = slides.length;
    var timer    = null;
    var dots     = [];

    // Build dots if container exists
    if (dotsEl) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'air-reel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsEl.appendChild(dot);
        dots.push(dot);
      });
    }

    function update() {
      if (isFade) {
        slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
      } else {
        track.style.transform = 'translateX(' + (-current * 100) + '%)';
      }

      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });

      // Nav button state
      if (!isLoop) {
        if (prevBtn) prevBtn.classList.toggle('is-disabled', current === 0);
        if (nextBtn) nextBtn.classList.toggle('is-disabled', current === total - 1);
      }

      wrapper.dispatchEvent(new CustomEvent('air:reel', { detail: { index: current, total: total }, bubbles: true }));
    }

    function goTo(index) {
      if (isLoop) {
        current = ((index % total) + total) % total;
      } else {
        current = Math.max(0, Math.min(index, total - 1));
      }
      update();
      resetAutoplay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetAutoplay() {
      if (!autoplay) return;
      clearInterval(timer);
      timer = setInterval(next, autoplay);
    }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Swipe / drag support
    var startX  = 0;
    var isDrag  = false;

    wrapper.addEventListener('pointerdown', function (e) {
      startX = e.clientX;
      isDrag = true;
      wrapper.setPointerCapture(e.pointerId);
    });

    wrapper.addEventListener('pointerup', function (e) {
      if (!isDrag) return;
      isDrag = false;
      var delta = e.clientX - startX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? next() : prev();
      }
    });

    // Keyboard
    wrapper.setAttribute('tabindex', '0');
    wrapper.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    // Pause autoplay on hover
    if (autoplay) {
      wrapper.addEventListener('mouseenter', function () { clearInterval(timer); });
      wrapper.addEventListener('mouseleave',  resetAutoplay);
      resetAutoplay();
    }

    // Initial state
    slides[0].classList.add('active');
    update();

    wrapper._airReel = { next: next, prev: prev, goTo: goTo };
  }

  function scanAll() {
    document.querySelectorAll('[data-reel]').forEach(initReel);
  }

  window.Air = window.Air || {};
  window.Air.reel = {
    next:    function (el) { if (el._airReel) el._airReel.next(); },
    prev:    function (el) { if (el._airReel) el._airReel.prev(); },
    go:      function (el, i) { if (el._airReel) el._airReel.goTo(i); },
    refresh: scanAll,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAll);
  } else {
    scanAll();
  }

}());
