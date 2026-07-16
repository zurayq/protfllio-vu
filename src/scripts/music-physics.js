(() => {
  const stage=document.querySelector('[data-music-stage]'); const cards=[...document.querySelectorAll('.music-card')];
  if(!stage||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  let engine,runner,renderFrame,bodies=[],paused=false,speed=1;
  const staticMode=()=>{cancelAnimationFrame(renderFrame);if(runner&&window.Matter)Matter.Runner.stop(runner);stage.classList.remove('is-physics');stage.querySelector('.music-cards').classList.add('static');cards.forEach(c=>c.style.transform='')};
  const start=()=>{
    if(!window.Matter)return; const {Engine,Bodies,Body,Composite,Runner}=Matter; const box=stage.getBoundingClientRect(); engine=Engine.create();engine.gravity.y=.55;runner=Runner.create();
    stage.classList.add('is-physics');stage.querySelector('.music-cards').classList.remove('static');
    const walls=[Bodies.rectangle(box.width/2,box.height+20,box.width,40,{isStatic:true}),Bodies.rectangle(-20,box.height/2,40,box.height,{isStatic:true}),Bodies.rectangle(box.width+20,box.height/2,40,box.height,{isStatic:true})];
    bodies=cards.map((card,i)=>{const rect=card.getBoundingClientRect();const w=rect.width,h=rect.height;const body=Bodies.rectangle(70+(i*97)%Math.max(100,box.width-100),-60-i*22,w,h,{restitution:.42,friction:.18,frictionAir:.012});card.style.position='absolute';card.style.left=`${-w/2}px`;card.style.top=`${-h/2}px`;return body}); Composite.add(engine.world,[...walls,...bodies]);Runner.run(runner,engine);
    const draw=()=>{bodies.forEach((body,i)=>{const v=body.velocity;if(Math.hypot(v.x,v.y)>18)Body.setVelocity(body,{x:v.x*.88,y:v.y*.88});cards[i].style.transform=`translate(${body.position.x}px,${body.position.y}px) rotate(${body.angle}rad)`});renderFrame=requestAnimationFrame(draw)};draw();
  };
  const load=document.createElement('script');load.src='/assets/vendor/matter.min.js';load.onload=start;load.onerror=staticMode;document.head.append(load);
  document.querySelector('[data-music-pause]').addEventListener('click',()=>{if(!engine)return;paused=!paused;engine.timing.timeScale=paused?0:speed});
  document.querySelector('[data-music-reset]').addEventListener('click',()=>{staticMode();start()});
  document.querySelector('[data-music-tidy]').addEventListener('click',()=>{if(!window.Matter)return;bodies.forEach((b,i)=>Matter.Body.setPosition(b,{x:70+(i%6)*145,y:70+Math.floor(i/6)*120}))});
  document.querySelector('[data-music-reduce]').addEventListener('click',staticMode);
  document.querySelectorAll('[data-speed]').forEach(button=>button.addEventListener('click',()=>{speed=parseFloat(button.dataset.speed);if(engine&&!paused)engine.timing.timeScale=speed}));
})();
