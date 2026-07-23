(() => {
  const dataNode=document.getElementById('wins-data');
  if(!dataNode)return;
  const wins=JSON.parse(dataNode.textContent);
  const buttons=[...document.querySelectorAll('[data-win-index]')];
  const detail=document.querySelector('[data-win-detail]');
  const icons=['⌁','⚙','◇','▦','あ','⌁','✓','▶'];
  const select=index=>{
    const item=wins[index];
    buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
    detail.innerHTML=`<p class="eyebrow">ACHIEVEMENT ${String(index+1).padStart(2,'0')} / UNLOCKED</p><div class="large-achievement-icon" aria-hidden="true">${icons[index]}</div><h2>${item.title}</h2><time>${item.year}</time><p>${item.description}</p><div class="save-flags"><span>truthful</span><span>earned</span><span>saved</span></div>`;
  };
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>select(index));
    button.addEventListener('keydown',event=>{
      const columns=innerWidth<=680?2:3;
      const delta={ArrowRight:1,ArrowLeft:-1,ArrowDown:columns,ArrowUp:-columns}[event.key];
      if(!delta)return;event.preventDefault();
      const next=Math.max(0,Math.min(buttons.length-1,index+delta));buttons[next].focus();select(next);
    });
  });
  select(0);
})();
