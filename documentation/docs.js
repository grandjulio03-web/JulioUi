/**
 * Air Docs — Shared documentation utilities
 *
 * • Injects sidebar navigation
 * • Marks active page link
 * • Copy-to-clipboard for code blocks
 * • Mobile sidebar toggle
 * • Scroll spy for section headings
 */
(function () {
  'use strict';

  /* ── Sidebar HTML ─────────────────────────────────────────── */
  var SIDEBAR_HTML = [
    '<a href="index.html" class="docs-logo">',
    '  <div class="air-nav-logo-icon" style="width:28px;height:28px;font-size:0.75rem;flex-shrink:0;">A</div>',
    '  Air Framework',
    '</a>',

    '<span class="docs-nav-section">Getting Started</span>',
    '<a href="index.html"         class="docs-nav-link">Overview</a>',
    '<a href="getting-started.html" class="docs-nav-link">Quick Start</a>',
    '<a href="variables.html"    class="docs-nav-link">Design Tokens</a>',

    '<span class="docs-nav-section">Typography</span>',
    '<a href="typography.html"   class="docs-nav-link">Typography</a>',

    '<span class="docs-nav-section">Layout</span>',
    '<a href="display-grid.html" class="docs-nav-link">Display & Grid</a>',
    '<a href="display-grid.html#positioning" class="docs-nav-link">Positioning</a>',
    '<a href="utilities.html"    class="docs-nav-link">Utilities</a>',

    '<span class="docs-nav-section">Components</span>',
    '<a href="buttons.html"      class="docs-nav-link">Buttons</a>',
    '<a href="cards.html"        class="docs-nav-link">Cards</a>',
    '<a href="badges.html"       class="docs-nav-link">Badges & Chips</a>',
    '<a href="alerts.html"       class="docs-nav-link">Alerts & Toasts</a>',
    '<a href="forms.html"        class="docs-nav-link">Forms</a>',
    '<a href="modals.html"       class="docs-nav-link">Modals & Drawers</a>',
    '<a href="tooltips.html"     class="docs-nav-link">Tooltips</a>',
    '<a href="tabs.html"         class="docs-nav-link">Tabs</a>',
    '<a href="pagination.html"   class="docs-nav-link">Pagination</a>',
    '<a href="tables.html"       class="docs-nav-link">Tables</a>',
    '<a href="loaders.html"      class="docs-nav-link">Loaders</a>',

    '<span class="docs-nav-section">Navigation</span>',
    '<a href="navigation.html"   class="docs-nav-link">Air Nav (Rail)</a>',
    '<a href="navigation.html#float" class="docs-nav-link">Float Nav</a>',
    '<a href="navigation.html#floor" class="docs-nav-link">Floor Nav</a>',
    '<a href="navigation.html#side"  class="docs-nav-link">Sidebar</a>',
    '<a href="navigation.html#trail" class="docs-nav-link">Breadcrumb</a>',

    '<span class="docs-nav-section">Visuals</span>',
    '<a href="backgrounds.html"  class="docs-nav-link">Backgrounds</a>',
    '<a href="animations.html"   class="docs-nav-link">Animations</a>',
    '<a href="theme.html"        class="docs-nav-link">Light / Dark Theme</a>',

    '<div class="docs-sidebar-foot">',
    '  <button class="air-theme-btn" data-theme-toggle style="width:100%;border-radius:0.75rem;gap:0.5rem;font-size:0.8rem;font-weight:600;color:var(--air-500);">',
    '    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    '    <svg class="icon-sun"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    '    Toggle theme',
    '  </button>',
    '</div>',
  ].join('\n');

  /* ── Inject sidebar ──────────────────────────────────────── */
  function injectSidebar() {
    var container = document.getElementById('docs-sidebar-container');
    if (!container) return;
    container.innerHTML = SIDEBAR_HTML;

    // Mark active link
    var page = window.location.pathname.split('/').pop() || 'index.html';
    container.querySelectorAll('.docs-nav-link').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href.split('#')[0] === page) {
        a.classList.add('active');
      }
    });
  }

  /* ── Copy to clipboard ───────────────────────────────────── */
  function initCopyButtons() {
    document.querySelectorAll('.docs-copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var block = btn.closest('.docs-demo, .docs-code-wrap')
                       .querySelector('.docs-code-block');
        if (!block) return;

        var text = block.innerText || block.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          btn.textContent = 'Error';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });
      });
    });
  }

  /* ── Mobile toggle ───────────────────────────────────────── */
  function initMobileToggle() {
    var toggleBtn = document.getElementById('docs-menu-btn');
    var sidebar   = document.getElementById('docs-sidebar-container');
    if (!toggleBtn || !sidebar) return;

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:9;display:none;';
    document.body.appendChild(overlay);

    toggleBtn.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      overlay.style.display = open ? 'block' : 'none';
    });

    overlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    injectSidebar();
    initCopyButtons();
    initMobileToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
