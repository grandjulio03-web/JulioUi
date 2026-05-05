/**
 * Air Tabs + Pagination Engine
 *
 * TABS:
 *   <div class="air-tabs" data-tabs>
 *     <div class="air-tabs-nav">
 *       <button class="air-tab active" data-tab="tab1">One</button>
 *       <button class="air-tab"        data-tab="tab2">Two</button>
 *     </div>
 *     <div class="air-panels">
 *       <div class="air-panel active" id="tab1">Content 1</div>
 *       <div class="air-panel"        id="tab2">Content 2</div>
 *     </div>
 *   </div>
 *
 * PAGINATION (display-based, no server needed):
 *   <div data-paginate data-per-page="6">
 *     <!-- any number of children — JS shows/hides them -->
 *   </div>
 *   <nav class="air-pages" data-pages-for="selector"></nav>
 *
 * API:
 *   Air.tabs.open(tabsEl, tabId)   programmatically switch tab
 *   Air.tabs.refresh()             re-scan for new tab widgets
 */
(function () {
  'use strict';

  // ── TABS ─────────────────────────────────────────────────────
  function initTabs(wrapper) {
    if (wrapper._airTabsInit) return;
    wrapper._airTabsInit = true;

    var nav    = wrapper.querySelector('.air-tabs-nav');
    var panels = wrapper.querySelector('.air-panels');
    if (!nav) return;

    function activate(btn) {
      var id = btn.dataset.tab;
      if (!id) return;

      // Deactivate all buttons
      nav.querySelectorAll('.air-tab').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        b.setAttribute('tabindex', '-1');
      });

      // Activate clicked
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.setAttribute('tabindex', '0');

      // Hide all panels, show target
      if (panels) {
        panels.querySelectorAll('.air-panel').forEach(function (p) {
          p.classList.remove('active');
          p.setAttribute('hidden', '');
        });

        var target = document.getElementById(id);
        if (target) {
          target.classList.add('active');
          target.removeAttribute('hidden');
        }
      }

      // Fire custom event
      wrapper.dispatchEvent(new CustomEvent('air:tab', { detail: { id: id }, bubbles: true }));
    }

    // Setup ARIA
    nav.querySelectorAll('.air-tab').forEach(function (btn, i) {
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
      btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
      if (btn.dataset.tab) btn.setAttribute('aria-controls', btn.dataset.tab);
    });

    if (panels) {
      panels.querySelectorAll('.air-panel').forEach(function (p) {
        p.setAttribute('role', 'tabpanel');
        if (!p.classList.contains('active')) p.setAttribute('hidden', '');
      });
    }

    // Click handler
    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('.air-tab');
      if (btn && !btn.classList.contains('active')) activate(btn);
    });

    // Arrow key navigation
    nav.addEventListener('keydown', function (e) {
      var tabs  = Array.from(nav.querySelectorAll('.air-tab'));
      var cur   = document.activeElement;
      var idx   = tabs.indexOf(cur);
      var next  = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (idx + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (idx - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        next = 0;
      } else if (e.key === 'End') {
        next = tabs.length - 1;
      }

      if (next >= 0) {
        e.preventDefault();
        tabs[next].focus();
        activate(tabs[next]);
      }
    });
  }

  // ── CLIENT-SIDE PAGINATION ────────────────────────────────────
  function initPaginate(container) {
    if (container._airPagesInit) return;
    container._airPagesInit = true;

    var perPage = parseInt(container.dataset.perPage || '6', 10);
    var current = 1;

    // Find linked .air-pages nav (or one placed immediately after)
    var navSelector = container.dataset.pagesFor;
    var nav = navSelector
      ? document.querySelector(navSelector)
      : container.nextElementSibling && container.nextElementSibling.classList.contains('air-pages')
        ? container.nextElementSibling
        : null;

    function getItems() {
      return Array.from(container.children).filter(function (el) {
        return !el.classList.contains('air-pages');
      });
    }

    function totalPages() {
      return Math.ceil(getItems().length / perPage);
    }

    function render(page) {
      current = Math.max(1, Math.min(page, totalPages()));
      var items = getItems();
      var start = (current - 1) * perPage;
      var end   = start + perPage;

      items.forEach(function (item, i) {
        item.style.display = (i >= start && i < end) ? '' : 'none';
        // Trigger entry animation on revealed items
        if (i >= start && i < end) {
          item.classList.remove('awake');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              item.classList.add('awake');
            });
          });
        }
      });

      if (nav) renderNav();

      container.dispatchEvent(new CustomEvent('air:page', {
        detail: { page: current, total: totalPages() },
        bubbles: true,
      }));
    }

    function renderNav() {
      var total = totalPages();
      nav.innerHTML = '';

      // Prev
      var prev = makePageBtn('&lsaquo;', current === 1);
      prev.classList.add('prev');
      prev.addEventListener('click', function () { if (current > 1) render(current - 1); });
      nav.appendChild(prev);

      // Page numbers with smart gap (show at most 7 buttons)
      var pages = buildPageRange(current, total);
      pages.forEach(function (p) {
        if (p === '...') {
          var gap = document.createElement('span');
          gap.className = 'air-page-gap';
          gap.textContent = '...';
          nav.appendChild(gap);
        } else {
          var btn = makePageBtn(p, false);
          if (p === current) btn.classList.add('active');
          btn.addEventListener('click', function () { render(p); });
          nav.appendChild(btn);
        }
      });

      // Next
      var next = makePageBtn('&rsaquo;', current === total);
      next.classList.add('next');
      next.addEventListener('click', function () { if (current < total) render(current + 1); });
      nav.appendChild(next);
    }

    function makePageBtn(label, disabled) {
      var btn = document.createElement('button');
      btn.className = 'air-page';
      btn.innerHTML = label;
      if (disabled) btn.classList.add('disabled');
      return btn;
    }

    function buildPageRange(cur, total) {
      if (total <= 7) {
        var range = [];
        for (var i = 1; i <= total; i++) range.push(i);
        return range;
      }
      var pages = [1];
      if (cur > 3)  pages.push('...');
      var lo = Math.max(2, cur - 1);
      var hi = Math.min(total - 1, cur + 1);
      for (var j = lo; j <= hi; j++) pages.push(j);
      if (cur < total - 2) pages.push('...');
      pages.push(total);
      return pages;
    }

    // Initial render
    render(1);
  }

  // ── Scan ─────────────────────────────────────────────────────
  function scanAll() {
    document.querySelectorAll('.air-tabs[data-tabs], .air-tabs[data-tabs=""]').forEach(initTabs);
    document.querySelectorAll('[data-paginate]').forEach(initPaginate);
  }

  // ── Public API ────────────────────────────────────────────────
  window.Air = window.Air || {};
  window.Air.tabs = {
    refresh: scanAll,
    open: function (wrapper, tabId) {
      var btn = wrapper.querySelector('[data-tab="' + tabId + '"]');
      if (btn) btn.click();
    },
  };

  // Auto-start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAll);
  } else {
    scanAll();
  }

}());
