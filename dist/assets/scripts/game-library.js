(() => {
  const dataNode=document.getElementById('game-library-data');
  if(!dataNode)return;
  const games=JSON.parse(dataNode.textContent);
  const cases=[...document.querySelectorAll('[data-game-index]')];
  const detail=document.querySelector('[data-library-detail]');
  const select=index=>{
    const game=games[index];
    cases.forEach((item,i)=>{item.classList.toggle('is-selected',i===index);item.setAttribute('aria-selected',String(i===index));item.tabIndex=i===index?0:-1;});
    detail.replaceChildren();
    const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent=`SELECTED / ${String(index+1).padStart(2,'0')}`;detail.append(eyebrow);
    const title=document.createElement('h2');title.textContent=game.title;detail.append(title);
    const summary=document.createElement('p');summary.textContent=game.summary;detail.append(summary);
    const list=document.createElement('dl');
    [['status',game.status],['latest note',game.note]].forEach(([term,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=term;dd.textContent=value;row.append(dt,dd);list.append(row);});
    detail.append(list);
    if(game.route){const link=document.createElement('a');link.className=`button${index===0?' button--accent':''}`;link.href=game.route;link.textContent=game.action;detail.append(link);}
  };
  cases.forEach((item,index)=>{
    item.addEventListener('click',()=>select(index));
    item.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?cases.length-1:(index+(event.key==='ArrowRight'?1:-1)+cases.length)%cases.length;
      cases[next].focus();cases[next].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest',inline:'center'});select(next);
    });
  });
  select(0);
})();
