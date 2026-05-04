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
