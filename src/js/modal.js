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
