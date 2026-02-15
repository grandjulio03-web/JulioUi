document.addEventListener('click', function(e) {
  const closeBtn = e.target.closest('.alert-close');
  if (closeBtn) {
    const alert = closeBtn.closest('.alert');
    if (alert) {
      alert.remove();
    }
  }
});
