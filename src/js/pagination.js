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
