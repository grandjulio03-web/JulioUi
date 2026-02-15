document.addEventListener('click', function(e) {
  const tabBtn = e.target.closest('.tab-btn');
  if (tabBtn) {
    e.preventDefault();
    const tabs = tabBtn.closest('.tabs');
    if (!tabs) return;

    const tabId = tabBtn.getAttribute('data-tab');
    const allBtns = tabs.querySelectorAll('.tab-btn');
    const allContents = tabs.querySelectorAll('.tab-content');

    allBtns.forEach(btn => btn.classList.remove('is-active'));
    allContents.forEach(content => content.classList.remove('is-active'));

    tabBtn.classList.add('is-active');
    const targetContent = tabs.querySelector(`#${tabId}`);
    if (targetContent) {
      targetContent.classList.add('is-active');
    }
  }
});
