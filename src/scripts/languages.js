(() => {
  const data = JSON.parse(document.getElementById('language-data').textContent);
  const tabs = [...document.querySelectorAll('[data-language]')];
  const panel = document.getElementById('language-panel');
  const show = index => {
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    const lang = data[index]; panel.dir = lang.direction; panel.lang = lang.name === 'Arabic' ? 'ar' : 'en';
    panel.innerHTML = `<div class="eyebrow">${lang.level}</div><h2>${lang.name}</h2><p>${lang.note}</p><p class="language-sample">${lang.sample || lang.sample_fallback}</p>`;
  };
  tabs.forEach((tab, index) => { tab.addEventListener('click', () => show(index)); tab.addEventListener('keydown', event => { if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return; event.preventDefault(); const next = event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length; tabs[next].focus(); show(next); }); });
  show(0);
})();
