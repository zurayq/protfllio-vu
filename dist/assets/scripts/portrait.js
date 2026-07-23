(() => {
  const portrait = document.querySelector('[data-portrait]');
  if (!portrait) return;
  const setAlt = active => {
    portrait.classList.toggle('is-alt', active);
    portrait.setAttribute('aria-pressed', String(active));
  };
  portrait.addEventListener('click', () => setAlt(!portrait.classList.contains('is-alt')));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setAlt(false); });
})();
