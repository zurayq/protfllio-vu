(() => {
  const node=document.getElementById('language-data');
  if(!node)return;
  const languages=JSON.parse(node.textContent);
  const tabs=[...document.querySelectorAll('[data-language]')];
  const panel=document.getElementById('language-dialogue');
  const copy=document.querySelector('[data-dialogue-copy]');
  const name=document.querySelector('[data-dialogue-language]');
  const level=document.querySelector('[data-dialogue-level]');
  const initial=document.querySelector('[data-dialogue-initial]');
  const initials=['ع','EN','TR','IT','ⵣ'];
  const show=index=>{
    const lang=languages[index];
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    panel.dir=lang.direction;panel.lang=lang.name==='Arabic'?'ar':'en';
    name.textContent=lang.name;level.textContent=lang.level;initial.textContent=initials[index];
    copy.replaceChildren();
    const heading=document.createElement('h2');heading.textContent=lang.name;copy.append(heading);
    const note=document.createElement('p');note.textContent=lang.note;copy.append(note);
    const sample=document.createElement('p');sample.className='language-sample';sample.textContent=lang.sample||lang.sample_fallback;copy.append(sample);
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>show(index));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:
        (index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+tabs.length)%tabs.length;
      tabs[next].focus();show(next);
    });
  });
  show(0);
})();
