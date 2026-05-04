# JForceX Component Class Reference

This guide documents the main classes currently used in the framework components.

Project motto: "Simple writing in HTML, complexity in classes for beauty on viewing."

## Air Form Component

### Container and layout

- `air-form`  
  Main wrapper for the premium form card. Adds spacing, rounded container, shadow, and vertical flow.

- `air-form__head`  
  Header block inside the form for title/intro text.

- `air-form__grid`  
  Responsive grid for placing form fields in columns.

- `air-form__field`  
  Single field wrapper. Use it for one input/select/textarea plus label/helper text.

- `air-form__actions`  
  Action row for buttons or grouped inline controls.

- `air-form__status`  
  Status message area at the end of the form (success/info state text).

### Inputs and helpers

- `air-input`  
  Styled text-like inputs (`text`, `email`, `number`, etc).

- `air-select`  
  Styled select dropdown with matching input treatment.

- `air-textarea`  
  Styled textarea that follows the same visual language as `air-input`.

- `air-form__helper`  
  Small helper text under a control for hints and guidance.

### Toggle controls

- `air-toggle`  
  Label wrapper for custom radio/checkbox rows with text and visual indicator.

- `air-radio-visual`  
  Visual radio indicator paired with a hidden native `input[type="radio"]`.

- `air-checkbox-visual`  
  Visual checkbox indicator paired with a hidden native `input[type="checkbox"]`.

## Base Form Classes

- `group`  
  Generic field group wrapper for base form controls.

- `field`  
  Standard input style for base forms.

- `select`  
  Base select class (currently set to keep native select behavior).

- `textarea`  
  Base textarea class.

- `search`  
  Search input style.

- `file`  
  File input class (currently set to keep native file input behavior).

- `range`  
  Range slider class.

- `label`  
  Label text class used below inputs in base forms.

- `hint`  
  Helper text for contextual notes.

- `alert`  
  Small alert/validation text style.

- `radio`  
  Base custom radio control.

- `checkbox`  
  Base custom checkbox control.

## Button Classes (for form actions)

### Solid buttons

- `jf-btn-ace`
- `jf-btn-beta`
- `jf-btn-gamma`
- `jf-btn-delta`
- `jf-btn-epsilon`

Use these for primary actions (recommended default submit style: `jf-btn-ace`).

### Outline buttons

- `jf-btn-outline-ace`
- `jf-btn-outline-beta`
- `jf-btn-outline-gamma`
- `jf-btn-outline-delta`
- `jf-btn-outline-epsilon`

Use for secondary/cancel actions.

### Flat buttons

- `jf-btn-flat-ace`
- `jf-btn-flat-beta`
- `jf-btn-flat-gamma`
- `jf-btn-flat-delta`
- `jf-btn-flat-epsilon`

Use when you want lower visual depth.

### Glow buttons

- `jf-btn-glow-ace`
- `jf-btn-glow-beta`
- `jf-btn-glow-gamma`
- `jf-btn-glow-delta`
- `jf-btn-glow-epsilon`

Use for strong call-to-action emphasis.

## Pagination (Air Capsule)

Air Capsule pagination is designed to keep HTML simple while CSS provides the premium visual behavior.

### Main classes

- `air-pagination`  
  Capsule shell wrapper for the pagination control.

- `air-theme-ace` / `air-theme-beta` / `air-theme-gamma` / `air-theme-delta`  
  Theme accent modifiers for Air components. Apply these to `air-form`, `air-pagination`, or a parent wrapper.

- `page-btn`  
  Numbered page button inside `air-pagination`.

- `active` or `is-active`  
  Marks the current page button.

- `pagination-ace` / `pagination-beta` / `pagination-gamma` / `pagination-delta`  
  Accent variants for active capsule color.

### Legacy-compatible classes

- `pagination`  
  Legacy pagination wrapper; now receives Air Capsule styling too.

- `pagination-btn`  
  Legacy button class; now receives Air Capsule button treatment too.

- `pagination-ellipsis`  
  Styling for ellipsis indicator (`...`) when pages are truncated.

### Minimal usage example

```html
<div class="air-pagination pagination-ace" aria-label="Pagination">
  <button id="prevBtn" disabled>‹ Prev</button>
  <button class="page-btn active" data-page="1">1</button>
  <button class="page-btn" data-page="2">2</button>
  <button class="page-btn" data-page="3">3</button>
  <button id="nextBtn">Next ›</button>
</div>
```

### Notes

- Keep JS simple: just toggle `active`/`is-active` on current page button.
- Use native `disabled` on prev/next edges.
- For a live test, open `documentation/pagination.html`.
- For all theme examples (radios + pagination), open `documentation/air-variants.html`.

## Typography (Air Type)

Air Type keeps markup short while CSS handles visual quality and hierarchy.

### Main classes

- `air-type`  
  Typography wrapper that enables Air Type token variables.

- `air-theme-ace` / `air-theme-beta` / `air-theme-gamma` / `air-theme-delta`  
  Accent variants for headings and emphasis.

- `air-type-card`  
  Soft content container for typography demos/sections.

- `air-type-kicker`  
  Small uppercase intro line above a heading.

- `air-type-title`  
  Main heading style with balanced line-height and weight.

- `air-type-gradient`  
  Gradient text accent layer for highlighted words.

- `air-type-lead`  
  Lead paragraph style for intro descriptions.

- `air-type-muted`  
  Secondary body copy style.

- `air-type-note`  
  Highlighted note/callout block.

- `air-type-emphasis`  
  Inline accent emphasis for words or short phrases.

### Legacy utility classes (still supported)

- `text-small`, `text-normal`, `text-large`, `text-heading`
- `text-light`, `text-regular`, `text-bold`
- `heading-light`, `heading-bold`, `subheading`, `body-text`, `caption`

### Test page

- Open `documentation/typograph.html` to test the new Air Type style and variants.

## Display and Grid Utilities

### Display classes

- `d-block`, `d-inline`, `d-inline-block`, `d-none`
- `d-flex`, `d-inline-flex`
- `d-grid`, `d-inline-grid`
- `d-flow-root`, `d-contents`, `d-list-item`
- `d-table`, `d-inline-table`, `d-table-row`, `d-table-cell`, `d-table-caption`

### Auto-responsive display classes

- Visibility:
  - `d-mobile-only`, `d-tablet-only`, `d-desktop-only`
- Mobile (`max-width: 767px`):
  - `d-mobile-none`, `d-mobile-block`, `d-mobile-inline`, `d-mobile-inline-block`, `d-mobile-flex`, `d-mobile-grid`
- Tablet (`768px - 1023px`):
  - `d-tablet-none`, `d-tablet-block`, `d-tablet-inline`, `d-tablet-inline-block`, `d-tablet-flex`, `d-tablet-grid`
- Desktop (`min-width: 1024px`):
  - `d-desktop-none`, `d-desktop-block`, `d-desktop-inline`, `d-desktop-inline-block`, `d-desktop-flex`, `d-desktop-grid`

### Grid structure classes

- `grid`, `grid-2`, `grid-3`, `grid-4`
- `grid-cols-auto-fit-200`, `grid-cols-auto-fill-160`
- `grid-auto-responsive`, `grid-auto-responsive-sm`, `grid-auto-responsive-lg`

### Grid template area layouts

- `grid-areas-dashboard`
  - Use with: `grid-area-sidebar`, `grid-area-header`, `grid-area-main`, `grid-area-stats`

- `grid-areas-magazine`
  - Use with: `grid-area-hero`, `grid-area-side`, `grid-area-content`, `grid-area-ads`

### Test page

- Open `documentation/display.html` for full display and grid-area examples.

## Position Utilities

- `pos-static`, `pos-relative`, `pos-absolute`, `pos-fixed`, `pos-sticky`
- `inset-0`, `top-0`, `right-0`, `bottom-0`, `left-0`
- `top-50`, `left-50`, `center-xy`
- `z-0`, `z-10`, `z-50`, `z-100`, `z-1000`

Responsive position helpers:
- Mobile: `pos-mobile-*`
- Tablet: `pos-tablet-*`
- Desktop: `pos-desktop-*`

## Navigation (Neo Navbar)

### Main classes

- `neo-nav` (base navbar shell)
- `neo-nav--beta`, `neo-nav--gamma`, `neo-nav--delta` (accent variants)
- `neo-nav--hero` (dark/hero style)
- `neo-nav__brand`
- `neo-nav__links` (menu container)
- `neo-nav__link`
- `neo-nav__actions`
- `neo-nav__cta`
- `neo-nav__toggle` (mobile menu trigger)

### Test pages

- `documentation/navbar-showcase.html` (new navbar set)
- `documentation/ribnavbar.html` (air-bar variant)

## Air Tables

Bootstrap-style behavior without Bootstrap: wrap a normal `<table>` in `.air-table`, add modifiers on the wrapper.

### Structure

- `air-table` — outer shell (radius, shadow, border)
- `air-table__scroll` — optional inner wrapper for horizontal scroll (`overflow-x: auto`)
- `air-table__caption` — use on `<caption>` for styled title

### Modifiers (like Bootstrap table utilities)

- `air-table--striped` — alternating row tint
- `air-table--hover` — row hover highlight
- `air-table--bordered` — cell grid borders
- `air-table--sm` — compact padding
- `air-table--sticky` — sticky header inside scroll area (with `air-table__scroll`)
- `air-table--rail` — left accent bar on row hover (Air signature)
- `air-table--dark` — inverse / dark panel
- `air-table--ace`, `air-table--beta`, `air-table--gamma`, `air-table--delta`, `air-table--epsilon` — full framework palette (default base `.air-table` matches ace if you omit tone)

### Cell helpers

- `air-td-muted`, `air-td-strong`, `air-badge-cell`

### Test page

- `documentation/air-tables.html`

## Air Cards

Premium card system: short HTML, rich CSS. Works beside legacy `.card` classes.

### Structure

- `air-card` — shell (radius, shadow, border)
- `air-card__media` — image wrapper (add a ratio modifier)
- `air-card__img` — `<img>` class
- `air-card__overlay` — absolutely positioned layer(s) inside media
- `air-card__body`, `air-card__kicker`, `air-card__title`, `air-card__meta`, `air-card__content`, `air-card__actions`
- `air-card__badge`, `air-card__badge--accent`

### Palette tones

- `air-card--ace`, `air-card--beta`, `air-card--gamma`, `air-card--delta`, `air-card--epsilon`

### Media aspect ratios

- `air-card__media--16-9`, `--4-3`, `--1-1`, `--3-4`, `--21-9`, `--tall`

### Overlays

- `air-card__overlay--gradient-b` — bottom readability fade
- `air-card__overlay--gradient-t` — top fade
- `air-card__overlay--glass` — frosted glass
- `air-card__overlay--vignette` — radial vignette
- `air-card__overlay--tint-ace` — duotone-style multiply tint
- `air-card__overlay--center`, `--split-label`
- `air-card__overlay--interactive` — `pointer-events: auto` for links/buttons in overlay

### Modifiers (interaction & layout)

- `air-card--lift` — hover lift + chromatic shadow
- `air-card--media-zoom` — image scale on hover
- `air-card--tilt` — subtle 3D tilt on hover
- `air-card--glass` — frosted card background
- `air-card--dark` — dark theme body
- `air-card--compact` — tighter padding
- `air-card--flush` — slightly reduced top body padding
- `air-card--bar` — top accent border (tone color)
- `air-card--split` — image | body side-by-side from `768px` up
- `air-card--reveal` — overlay/title intensify on hover
- `air-card--shine` — light sweep across card on hover
- `air-card--orbit` — animated chromatic border ring on hover
- `air-card--pulse` — soft pulsing shadow ring on hover

### Test page

- `documentation/air-cards.html`

## Air Loaders & Spinners

Simple markup, motion and palette in CSS. Uses framework colors via internal variables (customize by overriding `--spinner-*` on `.air-spinner` if needed).

### Base

- `air-spinner` — required on spinner roots
- `air-spinner--sm` / `air-spinner--md` / `air-spinner--lg` — size (dual, chroma, breath respect these; capsule uses width classes implicitly)

### Variants (single element)

- `air-spinner--dual` — counter-rotating two-tone rings (signature)
- `air-spinner--chroma` — conic gradient ring
- `air-spinner--breath` — radial “breathing” pulse with delta-tinted ring
- `air-spinner--capsule` — horizontal capsule sweep (Air bar metaphor)

### Variants (three `<span>` children inside `.air-spinner`)

- `air-spinner--wave` — three vertical bars, staggered wave
- `air-spinner--orbit-dots` — three dots placed on a ring, whole group rotates

### Inline row

- `air-loader-row` — flex row for label + spinner
- `air-loader-row__text`

### Full-page overlay

- `air-page-loader` — fixed full viewport, blur backdrop
- `air-page-loader--dark` — dark glass overlay
- `air-page-loader__label` — uppercase kicker under spinner
- `is-hidden` — hide overlay (opacity + visibility + no pointer events)

### Test page

- `documentation/air-loaders.html`

## Air UI (framework JavaScript)

Load **`dist/my-framework.js`** once. Source modules live in `src/js/`; rebuild with `npm run build-js`.

### Button loading

- `data-jf-loading` on `button[type="submit"]` (or `input[type="submit"]`) inside a form.
- `data-jf-form-demo` on `<form>` — prevents submit and auto-clears loading after a delay (demos only).
- `data-jf-loading-label="Saving…"` — optional text while loading.
- `data-jf-loading-ms="1600"` — delay before auto-clear (button or form).
- `data-jf-loading-manual` on button — framework sets loading on submit; **you** call `JForceX.setButtonLoading(button, false)` when done (real `fetch` flows). Do not use `data-jf-form-demo` with manual unless you preventDefault yourself.
- `data-jf-loading-click` on a non-submit `button` — same loading pattern on click (auto timeout unless `data-jf-loading-manual`).

### Page loader toggle

- `data-jf-page-loader-toggle="#selector"` on any button — toggles `is-hidden` on the target (e.g. `.air-page-loader`).

### Rib navbar

- `data-airbar-toggle="#panel-id"` + panel with matching `id` (and optional `data-airbar-panel`).

### Neo nav (mobile)

- `data-nav-toggle="#panel-id"` — toggles `is-open` on the linked menu.

### Air capsule pagination

- `data-jf-air-pagination` on `.air-pagination`, plus `data-jf-pagination-content="#content-id"`.
- Optional `data-jf-pagination-pages='{"1":"…","2":"…"}'` for copy per page.
- If those attributes are missing, legacy `#prevBtn` / `#nextBtn` + `.air-pagination-content` + `.air-pagination .page-btn` still bind when all exist.

### API

- `JForceX.setButtonLoading(element, boolean)` — manual loading control.
