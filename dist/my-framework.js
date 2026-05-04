function setAccordionState(accordion, shouldOpen) {
  if (!accordion) return;
  const panel = accordion.querySelector('.accordion-panel');
  if (!panel) return;

  accordion.classList.toggle('is-open', shouldOpen);
  if (shouldOpen) {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  } else {
    panel.style.maxHeight = '0px';
  }
}

function syncOpenAccordionHeights() {
  document.querySelectorAll('.accordion.is-open .accordion-panel').forEach((panel) => {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  });
}

document.addEventListener('click', function(e) {
  const btn = e.target.closest('.accordion-btn');
  const accordion = e.target.closest('.accordion');
  if (!btn || !accordion) return;

  e.preventDefault();
  const willOpen = !accordion.classList.contains('is-open');
  setAccordionState(accordion, willOpen);
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.accordion').forEach((accordion) => {
    setAccordionState(accordion, accordion.classList.contains('is-open'));
  });
});

window.addEventListener('resize', syncOpenAccordionHeights);

document.addEventListener('click', function(e) {
  const closeBtn = e.target.closest('.alert-close');
  if (closeBtn) {
    const alert = closeBtn.closest('.alert');
    if (alert) {
      alert.remove();
    }
  }
});

// No JavaScript needed - pure CSS badges
document.addEventListener('click', function(e) {
  const prevBtn = e.target.closest('.carousel-prev');
  const nextBtn = e.target.closest('.carousel-next');
  const dot = e.target.closest('.carousel-dot');

  if (prevBtn || nextBtn || dot) {
    e.preventDefault();
    const carousel = e.target.closest('.carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    if (!track || slides.length === 0) return;

    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('is-active'));
    if (currentIndex === -1) currentIndex = 0;

    let newIndex = currentIndex;

    if (prevBtn) {
      newIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
    } else if (nextBtn) {
      newIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
    } else if (dot) {
      newIndex = Array.from(dots).indexOf(dot);
    }

    // Update track position
    track.style.transform = `translateX(-${newIndex * 100}%)`;

    // Update active states
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === newIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === newIndex);
    });
  }
});

// Initialize first slide as active
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const firstSlide = carousel.querySelector('.carousel-slide');
    const firstDot = carousel.querySelector('.carousel-dot');
    
    if (firstSlide) firstSlide.classList.add('is-active');
    if (firstDot) firstDot.classList.add('is-active');
  });
});

document.addEventListener('click', function(e) {
  const btn = e.target.closest('.dropdown-btn');
  const dropdown = e.target.closest('.dropdown-menu');

  // Close all dropdowns if clicked outside any dropdown
  if (!dropdown) {
    document.querySelectorAll('.dropdown-menu.is-open').forEach(x => x.classList.remove('is-open'));
    return;
  }

  // If clicked a button: toggle only this one, close others
  if (btn) {
    e.preventDefault();
    document.querySelectorAll('.dropdown-menu.is-open').forEach(x => { if (x !== dropdown) x.classList.remove('is-open'); });
    dropdown.classList.toggle('is-open');
  }

  // Close dropdown when clicking on an item
  if (e.target.closest('.dropdown-item')) {
    dropdown.classList.remove('is-open');
  }
});
/* ===================== Jforces Form Framework ===================== */

/**
 * Auto-adjust form container height based on label transitions
 * Prevents layout shifts and maintains smooth animations
 */

class FormLabelManager {
  constructor() {
    this.init();
  }

  init() {
    // Process all form groups on page load
    this.processAllFormGroups();
    
    // Set up mutation observer for dynamic content
    this.setupMutationObserver();
    
    // Set up resize observer for responsive changes
    this.setupResizeObserver();
  }

  processAllFormGroups() {
    const formGroups = document.querySelectorAll('.group');
    formGroups.forEach(group => this.processFormGroup(group));
  }

  processFormGroup(group) {
    const input = group.querySelector('input, select, textarea');
    const label = group.querySelector('.label');
    
    if (!input || !label) return;

    // Store initial dimensions
    this.storeInitialDimensions(group, input, label);
    
    // Set up event listeners for this specific group
    this.setupGroupListeners(group, input, label);
    
    // Calculate initial height
    this.calculateGroupHeight(group);
  }

  storeInitialDimensions(group, input, label) {
    // Store original height
    const rect = group.getBoundingClientRect();
    group.dataset.originalHeight = rect.height;
    
    // Store label positions
    const labelRect = label.getBoundingClientRect();
    const groupRect = group.getBoundingClientRect();
    label.dataset.originalTop = labelRect.top - groupRect.top;
    label.dataset.bottomTop = groupRect.height - labelRect.height + 8; // 8px for margin
  }

  setupGroupListeners(group, input, label) {
    // Focus events
    input.addEventListener('focus', () => this.handleFocus(group, label));
    input.addEventListener('blur', () => this.handleBlur(group, label));
    
    // Input events for placeholder changes
    input.addEventListener('input', () => this.handleInput(group, label));
    
    // Select change events
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => this.handleInput(group, label));
    }
  }

  handleFocus(group, label) {
    this.transitionLabelToBottom(group, label);
  }

  handleBlur(group, label) {
    const input = group.querySelector('input, select, textarea');
    if (input && !input.value && input.tagName !== 'SELECT') {
      this.transitionLabelToTop(group, label);
    } else if (input && input.tagName === 'SELECT' && !input.value) {
      this.transitionLabelToTop(group, label);
    }
  }

  handleInput(group, label) {
    const input = group.querySelector('input, select, textarea');
    if (input && (input.value || (input.tagName === 'SELECT' && input.value))) {
      this.transitionLabelToBottom(group, label);
    } else {
      this.transitionLabelToTop(group, label);
    }
  }

  transitionLabelToBottom(group, label) {
    // Calculate target height
    const inputHeight = parseFloat(getComputedStyle(group.querySelector('input, select, textarea')).height);
    const labelHeight = parseFloat(getComputedStyle(label).height);
    const targetHeight = inputHeight + labelHeight + 16; // 16px for margins
    
    // Smooth height transition
    this.animateHeight(group, targetHeight);
    
    // Update label position
    label.style.top = '100%';
    label.style.marginTop = '0.5rem';
    label.style.left = '0';
  }

  transitionLabelToTop(group, label) {
    // Return to original height
    const originalHeight = parseFloat(group.dataset.originalHeight);
    this.animateHeight(group, originalHeight);
    
    // Reset label position
    label.style.top = '0.75rem';
    label.style.marginTop = '0';
    label.style.left = '1rem';
  }

  animateHeight(element, targetHeight) {
    const startHeight = element.offsetHeight;
    const duration = 400; // Match CSS transition duration
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function matching CSS cubic-bezier(0.4, 0, 0.2, 1)
      const easeProgress = this.easeOutCubic(progress);
      
      const currentHeight = startHeight + (targetHeight - startHeight) * easeProgress;
      element.style.height = `${currentHeight}px`;
      element.style.minHeight = `${currentHeight}px`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final height is set correctly
        element.style.height = `${targetHeight}px`;
        element.style.minHeight = `${targetHeight}px`;
      }
    };

    requestAnimationFrame(animate);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  calculateGroupHeight(group) {
    const input = group.querySelector('input, select, textarea');
    const label = group.querySelector('.label');
    
    if (!input || !label) return;

    const inputHeight = parseFloat(getComputedStyle(input).height);
    const labelHeight = parseFloat(getComputedStyle(label).height);
    const labelTop = parseFloat(label.style.top) || 0.75;
    
    // Check if label is at bottom
    const isLabelAtBottom = label.style.top === '100%';
    
    let targetHeight;
    if (isLabelAtBottom) {
      targetHeight = inputHeight + labelHeight + 16; // 16px for margins
    } else {
      targetHeight = Math.max(inputHeight, labelTop + labelHeight + 16);
    }
    
    group.style.height = `${targetHeight}px`;
    group.style.minHeight = `${targetHeight}px`;
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && node.classList.contains('group')) {
                this.processFormGroup(node);
              } else {
                // Check for form groups within added nodes
                const formGroups = node.querySelectorAll && node.querySelectorAll('.group');
                if (formGroups) {
                  formGroups.forEach(group => this.processFormGroup(group));
                }
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.processAllFormGroups();
    });

    // Observe all form groups
    document.querySelectorAll('.group').forEach(group => {
      resizeObserver.observe(group);
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FormLabelManager();
  });
} else {
  new FormLabelManager();
}

// Export for manual initialization if needed
window.FormLabelManager = FormLabelManager;

document.addEventListener('click', function(e) {
  const openBtn = e.target.closest('[data-modal-open]');
  const closeBtn = e.target.closest('.modal-close');
  const modal = e.target.closest('.modal');

  if (openBtn) {
    e.preventDefault();
    const modalId = openBtn.getAttribute('data-modal-open');
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      modalEl.classList.add('is-open');
    }
  }

  if (closeBtn) {
    const modalEl = closeBtn.closest('.modal');
    if (modalEl) modalEl.classList.remove('is-open');
  } else if (modal && e.target === modal) {
    modal.classList.remove('is-open');
  }
});

document.addEventListener('click', function(e) {
  const btn = e.target.closest('.pagination-btn');
  if (btn && !btn.disabled) {
    const pagination = btn.closest('.pagination');
    if (!pagination) return;

    const currentPage = parseInt(btn.getAttribute('data-page')) || 1;
    const allBtns = pagination.querySelectorAll('.pagination-btn');
    
    allBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    
    // Custom event for page change
    const event = new CustomEvent('pagechange', {
      detail: { page: currentPage, button: btn }
    });
    pagination.dispatchEvent(event);
  }
});

document.addEventListener('click', function(e) {
  const tabBtn = e.target.closest('.tab-btn');
  if (tabBtn) {
    e.preventDefault();
    const tabs = tabBtn.closest('.tabs');
    if (!tabs) return;

    const tabId = tabBtn.getAttribute('data-tab');
    const allBtns = tabs.querySelectorAll('.tab-btn');
    const allContents = tabs.querySelectorAll('.tab-content');

    allBtns.forEach(btn => btn.classList.remove('is-active'));
    allContents.forEach(content => content.classList.remove('is-active'));

    tabBtn.classList.add('is-active');
    const targetContent = tabs.querySelector(`#${tabId}`);
    if (targetContent) {
      targetContent.classList.add('is-active');
    }
  }
});

// No JavaScript needed - pure CSS tooltips
// All functionality handled by CSS hover states
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

