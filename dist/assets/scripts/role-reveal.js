(() => {
  const card=document.querySelector('[data-role-card]');
  if(!card)return;
  const secret=document.querySelector('[data-secret-panel]');
  const role=document.querySelector('[data-role-value]');
  const label=document.querySelector('[data-secret-label]');
  const value=document.querySelector('[data-secret-value]');
  const status=document.querySelector('[data-role-status]');
  const progress=document.querySelector('.hold-progress');
  const modes=[...document.querySelectorAll('[data-role-mode]')];
  const threshold=400, circumference=113;
  let holding=false,revealed=false,startTime=0,frame,timer,pointerId=null,keyboardHolding=false;
  const updateProgress=()=>{
    if(!holding)return;
    const elapsed=Math.min(threshold,performance.now()-startTime);
    progress.style.strokeDashoffset=String(circumference*(1-elapsed/threshold));
    if(elapsed>=threshold&&!revealed)reveal();
    else frame=requestAnimationFrame(updateProgress);
  };
  const begin=()=>{
    if(holding)return;
    holding=true;revealed=false;startTime=performance.now();card.classList.add('is-holding');
    status.textContent='hold steady…';cancelAnimationFrame(frame);clearTimeout(timer);frame=requestAnimationFrame(updateProgress);
  };
  const reveal=()=>{
    revealed=true;card.classList.add('is-revealed');secret.setAttribute('aria-hidden','false');
    card.setAttribute('aria-label',`${role.textContent}. ${label.textContent}: ${value.textContent}. Release to hide.`);
    status.textContent='secret visible — release to seal';
  };
  const end=()=>{
    if(!holding)return;
    holding=false;revealed=false;pointerId=null;keyboardHolding=false;
    cancelAnimationFrame(frame);card.classList.remove('is-holding','is-revealed');secret.setAttribute('aria-hidden','true');
    card.setAttribute('aria-label','Press and hold to reveal your secret role');
    progress.style.strokeDashoffset=String(circumference);status.textContent='card sealed';
  };
  const setMode=mode=>{
    end();
    modes.forEach(button=>button.classList.toggle('is-active',button.dataset.roleMode===mode));
    if(mode==='imposter'){role.textContent='IMPOSTER';label.textContent='HINT';value.textContent='survive the questions';}
    else{role.textContent='PLAYER';label.textContent='WORD';value.textContent='MOON';}
    status.textContent=`${mode} test card ready`;
  };
  card.addEventListener('pointerdown',event=>{event.preventDefault();pointerId=event.pointerId;card.setPointerCapture(pointerId);begin();});
  card.addEventListener('pointerup',end);
  card.addEventListener('pointercancel',end);
  card.addEventListener('lostpointercapture',end);
  card.addEventListener('contextmenu',event=>event.preventDefault());
  card.addEventListener('keydown',event=>{
    if(event.code!=='Space'||event.repeat)return;
    event.preventDefault();keyboardHolding=true;begin();
  });
  card.addEventListener('keyup',event=>{if(event.code==='Space'){event.preventDefault();end();}});
  card.addEventListener('blur',end);
  modes.forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.roleMode)));
  document.querySelector('[data-role-reset]').addEventListener('click',()=>setMode('player'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)end();});
})();
