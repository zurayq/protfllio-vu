(() => {
  const globe = document.querySelector('[data-globe]'); const wrap = document.querySelector('[data-globe-wrap]');
  if (!globe || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let angle=0, scale=1, dragging=false, startX=0, startAngle=0, rotating=false, frame;
  const draw=()=>{ globe.style.transform=`rotate(${angle}deg) scale(${scale})`; };
  wrap.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;startAngle=angle;wrap.setPointerCapture(e.pointerId)});
  wrap.addEventListener('pointermove',e=>{if(dragging){angle=startAngle+(e.clientX-startX)*.2;draw()}});
  wrap.addEventListener('pointerup',()=>{dragging=false});
  wrap.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(.7,Math.min(1.6,scale-e.deltaY*.001));draw()},{passive:false});
  document.querySelector('[data-reset-globe]').addEventListener('click',()=>{angle=0;scale=1;draw()});
  document.querySelector('[data-list-toggle]').addEventListener('click',()=>document.querySelector('.travel-list').scrollIntoView({behavior:'smooth'}));
  const toggle=document.querySelector('[data-auto-rotate]'); const tick=()=>{if(!rotating)return;angle+=.08;draw();frame=requestAnimationFrame(tick)};
  toggle.addEventListener('click',()=>{rotating=!rotating;toggle.setAttribute('aria-pressed',String(rotating));cancelAnimationFrame(frame);if(rotating)tick()});
})();
