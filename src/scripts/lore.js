(() => {
  const dataNode = document.getElementById('lore-data');
  if (!dataNode) return;
  const files = JSON.parse(dataNode.textContent);
  const buttons = [...document.querySelectorAll('[data-lore-file]')];
  const content = document.querySelector('[data-lore-body]');
  const filename = document.querySelector('[data-lore-filename]');
  const breadcrumb = document.querySelector('[data-lore-breadcrumb]');
  const status = document.querySelector('[data-lore-status]');
  let current = 0;

  const render = (index, updateHash = true) => {
    current = Math.max(0,Math.min(files.length-1,index));
    const file = files[current];
    buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===current));button.tabIndex=i===current?0:-1;});
    filename.textContent=file.filename; breadcrumb.textContent=`${file.folder} / ${file.filename}`;
    status.textContent=`chapter: ${file.folder.replace('/','')}`;
    content.replaceChildren();
    const heading=document.createElement('h2'); heading.textContent=file.title; content.append(heading);
    file.answer.forEach(text=>{const paragraph=document.createElement('p');paragraph.textContent=text;content.append(paragraph);});
    if(updateHash) history.replaceState(null,'',`#${file.slug}`);
  };
  const hashIndex = () => {
    const hash=decodeURIComponent(location.hash.slice(1));
    const index=files.findIndex(file=>file.slug===hash||file.filename===hash);
    return index<0?0:index;
  };
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>render(index));
    button.addEventListener('keydown',event=>{
      if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key)){
        event.preventDefault();
        const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:
          (index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1)+buttons.length)%buttons.length;
        buttons[next].focus(); render(next);
      }
      if(event.key==='Enter'){event.preventDefault();render(index);document.querySelector('[data-lore-content]').focus();}
    });
  });
  document.querySelector('[data-lore-content]').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();buttons[current].focus();}});
  document.querySelector('[data-copy-lore]').addEventListener('click',async event=>{
    const link=`${location.origin}${location.pathname}#${files[current].slug}`;
    try{await navigator.clipboard.writeText(link);event.currentTarget.textContent='copied';setTimeout(()=>event.currentTarget.textContent='copy link',1100);}
    catch{event.currentTarget.textContent='copy unavailable';}
  });
  addEventListener('hashchange',()=>render(hashIndex(),false));
  render(hashIndex(),false);
})();
