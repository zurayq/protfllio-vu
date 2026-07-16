(() => {
  const data = JSON.parse(document.getElementById('toolbox-data').textContent);
  const items = [...document.querySelectorAll('.inventory-item')];
  const detail = document.querySelector('[data-tool-detail]');
  const columns = () => matchMedia('(max-width:639px)').matches ? 4 : matchMedia('(max-width:899px)').matches ? 6 : 8;
  const select = index => {
    index = Math.max(0, Math.min(items.length - 1, index));
    items.forEach((item, i) => { item.setAttribute('aria-selected', String(i === index)); item.tabIndex = i === index ? 0 : -1; });
    const item = data[index];
    detail.innerHTML = `<div class="eyebrow">${item.category} · ${item.status}</div><h2>${item.name}</h2><p>${item.short_description}</p><div class="eyebrow">used in</div><ul>${item.used_in.map(name => `<li>${name}</li>`).join('')}</ul>`;
    return index;
  };
  let current = select(0);
  items.forEach((item, index) => {
    item.addEventListener('click', () => { current = select(index); });
    item.addEventListener('keydown', event => {
      const keys = {ArrowRight:1, ArrowLeft:-1, ArrowDown:columns(), ArrowUp:-columns()};
      if (event.key in keys) { event.preventDefault(); current = select(current + keys[event.key]); items[current].focus(); }
      if (event.key === 'Enter') current = select(index);
      if (event.key === 'Escape') { items.forEach(i => i.setAttribute('aria-selected','false')); detail.innerHTML = '<p class="muted">select an item to inspect</p>'; }
    });
  });
})();
