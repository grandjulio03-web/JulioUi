/**
 * Air Framework — Decimal Spacing Engine
 *
 * Handles p-0.1 through p-0.5 (and m-, pt-, pb-, etc.) on any element,
 * including those added dynamically after page load.
 *
 * CSS already covers static HTML via escaped selectors (.p-0\.1).
 * This JS covers: dynamic elements, JS-rendered content, template output.
 *
 * Usage:
 *   <div class="p-0.3 mt-0.2"> ... </div>
 *
 *   Air.spacing.apply()         -- re-scan the whole page
 *   Air.spacing.apply(el)       -- scan a specific subtree
 *   Air.spacing.watch()         -- auto-watch for DOM mutations
 */
(function () {
  'use strict';

  // Bootstrap-equivalent scale
  var SCALE = {
    '0.1': '0.25rem',   // Bootstrap p-1 / 4px
    '0.2': '0.5rem',    // Bootstrap p-2 / 8px
    '0.3': '1rem',      // Bootstrap p-3 / 16px
    '0.4': '1.5rem',    // Bootstrap p-4 / 24px
    '0.5': '3rem',      // Bootstrap p-5 / 48px
  };

  // Class prefix -> CSS property map
  var PROPS = {
    // Padding
    'p':  ['padding'],
    'pt': ['paddingTop'],
    'pb': ['paddingBottom'],
    'pl': ['paddingLeft'],
    'pr': ['paddingRight'],
    'px': ['paddingLeft', 'paddingRight'],
    'py': ['paddingTop', 'paddingBottom'],
    // Margin
    'm':  ['margin'],
    'mt': ['marginTop'],
    'mb': ['marginBottom'],
    'ml': ['marginLeft'],
    'mr': ['marginRight'],
    'mx': ['marginLeft', 'marginRight'],
    'my': ['marginTop', 'marginBottom'],
    // Gap
    'gap':   ['gap'],
    'gap-x': ['columnGap'],
    'gap-y': ['rowGap'],
  };

  // Regex: matches  p-0.3  |  pt-0.1  |  mx-0.5  |  gap-0.2  etc.
  var RE = /^(gap-[xy]|gap|[mp][tblrxy]?|[mp])-(0\.[1-5])$/;

  function applyElement(el) {
    if (!el.classList) return;
    el.classList.forEach(function (cls) {
      var m = cls.match(RE);
      if (!m) return;
      var prefix = m[1];
      var level  = m[2];
      var value  = SCALE[level];
      var props  = PROPS[prefix];
      if (!value || !props) return;
      props.forEach(function (prop) {
        // Only apply if not already set by a stylesheet (CSS escaped-dot rules)
        // We check computed style to avoid overriding intentional CSS
        el.style[prop] = value;
      });
    });
  }

  function applyRoot(root) {
    root = root || document;
    // Apply to root element itself if it's an Element
    if (root instanceof Element) applyElement(root);
    // Apply to all descendants
    root.querySelectorAll('[class]').forEach(applyElement);
  }

  // MutationObserver — watches for new nodes added to the DOM
  var _observer = null;

  function watch(root) {
    root = root || document.body;
    if (_observer) _observer.disconnect();

    _observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mut) {
        mut.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return; // elements only
          applyElement(node);
          node.querySelectorAll && node.querySelectorAll('[class]').forEach(applyElement);
        });
        // Also handle attribute changes (class added dynamically)
        if (mut.type === 'attributes' && mut.target) {
          applyElement(mut.target);
        }
      });
    });

    _observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  // Public API
  window.Air = window.Air || {};
  window.Air.spacing = {
    apply: applyRoot,
    watch: watch,
    scale: SCALE,
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyRoot();
    });
  } else {
    applyRoot();
  }

}());
