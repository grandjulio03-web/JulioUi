document.addEventListener('click', function(e) {
  const btn = e.target.closest('.accordion-btn');
  const accordion = e.target.closest('.accordion');

  if (btn && accordion) {
    e.preventDefault();
    accordion.classList.toggle('is-open');
  }
});
