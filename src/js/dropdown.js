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