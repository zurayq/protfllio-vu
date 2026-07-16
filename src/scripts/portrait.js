(() => {
  const portrait = document.querySelector('[data-portrait]');
  if (!portrait) return;
  portrait.addEventListener('click', () => portrait.classList.toggle('is-alt'));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') portrait.classList.remove('is-alt'); });
})();
