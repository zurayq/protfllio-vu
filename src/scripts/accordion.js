(() => {
  const setOpen = (button, content, open) => {
    button.setAttribute('aria-expanded', String(open));
    content.classList.toggle('is-open', open);
  };
  document.querySelectorAll('.details-toggle[aria-controls]').forEach(button => {
    const content = document.getElementById(button.getAttribute('aria-controls'));
    if (content) button.addEventListener('click', () => setOpen(button, content, button.getAttribute('aria-expanded') !== 'true'));
  });
  document.querySelectorAll('[data-close-for]').forEach(button => button.addEventListener('click', () => {
    const content = document.getElementById(button.dataset.closeFor);
    const opener = document.querySelector(`[aria-controls="${button.dataset.closeFor}"]`);
    if (content && opener) { setOpen(opener, content, false); opener.focus(); }
  }));
  document.querySelectorAll('[data-copy-link]').forEach(button => button.addEventListener('click', async () => {
    const previous = button.textContent;
    try { await navigator.clipboard.writeText(location.origin + location.pathname + button.dataset.copyLink); button.textContent = 'copied'; }
    catch { location.hash = button.dataset.copyLink; }
    setTimeout(() => { button.textContent = previous; }, 1200);
  }));
  const openHash = () => {
    if (!location.hash) return;
    const card = document.querySelector(location.hash);
    const opener = card?.querySelector('.details-toggle[aria-controls]');
    const content = opener && document.getElementById(opener.getAttribute('aria-controls'));
    if (opener && content) setOpen(opener, content, true);
  };
  openHash(); addEventListener('hashchange', openHash);
})();
