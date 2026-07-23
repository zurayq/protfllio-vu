(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const media = matchMedia('(prefers-color-scheme: dark)');
  let explicit = localStorage.getItem('theme');
  const updateLabel = () => toggle?.setAttribute('aria-label', root.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode');
  toggle?.addEventListener('click', () => {
    root.classList.toggle('dark');
    explicit = root.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', explicit);
    updateLabel();
  });
  media.addEventListener('change', event => { if (!explicit) { root.classList.toggle('dark', event.matches); updateLabel(); } });
  updateLabel();
  requestAnimationFrame(() => root.classList.add('theme-ready'));
})();
