(() => {
  const stage = document.querySelector('[data-music-stage]');
  const container = stage?.querySelector('.music-cards');
  const cards = [...(stage?.querySelectorAll('.music-card') || [])];
  if (!stage || !window.Matter || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const {Engine, Bodies, Body, Composite, Runner, Mouse, MouseConstraint, Events} = Matter;
  const config = JSON.parse(document.getElementById('music-data').textContent);
  const hud = document.querySelector('[data-music-hud]');
  let engine, runner, bodies = [], walls = [], mouseConstraint, frame, paused = false, gravityOn = true, staticMode = false;
  const bodyCard = new Map();

  const selectCard = card => {
    cards.forEach(item => item.setAttribute('aria-selected', String(item === card)));
    hud.innerHTML = `<span class="eyebrow">NOW SELECTED / LOCAL CARD</span><strong>${card.dataset.artist}</strong>`;
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    if (runner) Runner.stop(runner);
    if (engine) Composite.clear(engine.world, false);
  };
  const dimensions = () => {
    const box = stage.getBoundingClientRect();
    return {width: Math.max(280, box.width), height: Math.max(360, box.height)};
  };
  const addWalls = ({width, height}) => {
    const thickness = 70;
    walls = [
      Bodies.rectangle(width/2, -thickness/2, width + thickness*2, thickness, {isStatic:true, label:'ceiling'}),
      Bodies.rectangle(width/2, height + thickness/2, width + thickness*2, thickness, {isStatic:true, label:'floor'}),
      Bodies.rectangle(-thickness/2, height/2, thickness, height + thickness*2, {isStatic:true, label:'left-wall'}),
      Bodies.rectangle(width + thickness/2, height/2, thickness, height + thickness*2, {isStatic:true, label:'right-wall'}),
    ];
    Composite.add(engine.world, walls);
  };
  const build = () => {
    stop(); staticMode = false; paused = false; bodyCard.clear();
    const box = dimensions();
    engine = Engine.create({enableSleeping:false});
    engine.gravity.y = gravityOn ? config.gravity : 0;
    engine.positionIterations = 8; engine.velocityIterations = 6;
    runner = Runner.create({delta: 1000/60});
    stage.classList.add('is-physics'); container.classList.remove('static');
    const activeCards = innerWidth <= 360 ? cards.slice(0, 9) : cards;
    cards.forEach((card, index) => { card.hidden = !activeCards.includes(card); card.style.position = ''; });
    bodies = activeCards.map((card, index) => {
      const width = innerWidth <= 680 ? 96 : 132, height = innerWidth <= 680 ? 70 : 96;
      card.style.width = `${width}px`; card.style.height = `${height}px`;
      card.style.left = `${-width/2}px`; card.style.top = `${-height/2}px`;
      const body = Bodies.rectangle(
        65 + (index * 113) % Math.max(90, box.width - 110),
        45 + Math.floor(index / Math.max(1, Math.floor(box.width / 125))) * 34,
        width, height,
        {restitution:config.restitution, friction:config.friction, frictionAir:config.friction_air, chamfer:{radius:2}, label:`card-${index}`}
      );
      Body.setAngle(body, ((index % 5) - 2) * .07);
      bodyCard.set(body.id, card);
      return body;
    });
    addWalls(box); Composite.add(engine.world, bodies);

    const mouse = Mouse.create(stage);
    mouse.pixelRatio = window.devicePixelRatio || 1;
    mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {stiffness:.18, damping:.12, render:{visible:false}},
      collisionFilter: {mask: 0xFFFFFFFF},
    });
    Composite.add(engine.world, mouseConstraint);
    Events.on(mouseConstraint, 'startdrag', event => {
      const card = bodyCard.get(event.body?.id);
      if (card) { selectCard(card); card.style.zIndex = '8'; }
    });
    Events.on(mouseConstraint, 'enddrag', event => {
      const card = bodyCard.get(event.body?.id);
      if (card) card.style.zIndex = '';
    });
    Runner.run(runner, engine);
    const draw = () => {
      const current = dimensions();
      bodies.forEach((body, index) => {
        const speed = Math.hypot(body.velocity.x, body.velocity.y);
        if (speed > config.max_velocity) Body.setVelocity(body, {x:body.velocity.x*.82, y:body.velocity.y*.82});
        const halfW = activeCards[index].offsetWidth/2, halfH = activeCards[index].offsetHeight/2;
        if (body.position.x < halfW) Body.setPosition(body,{x:halfW,y:body.position.y});
        if (body.position.x > current.width-halfW) Body.setPosition(body,{x:current.width-halfW,y:body.position.y});
        if (body.position.y < halfH) Body.setPosition(body,{x:body.position.x,y:halfH});
        if (body.position.y > current.height-halfH) Body.setPosition(body,{x:body.position.x,y:current.height-halfH});
        activeCards[index].style.transform = `translate3d(${body.position.x}px,${body.position.y}px,0) rotate(${body.angle}rad)`;
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
  };
  const showStatic = () => {
    stop(); staticMode = true; stage.classList.remove('is-physics'); container.classList.add('static');
    cards.forEach(card => { card.hidden = false; card.style.cssText = ''; });
    hud.innerHTML = '<span class="eyebrow">STATIC COLLAGE</span><strong>physics paused; every artist still selectable.</strong>';
  };
  const tidy = () => {
    if (staticMode) return;
    const box = dimensions();
    const columns = Math.max(2, Math.floor(box.width / 145));
    bodies.forEach((body,index) => {
      Body.setPosition(body,{x:70+(index%columns)*Math.min(145,(box.width-140)/Math.max(1,columns-1)),y:65+Math.floor(index/columns)*110});
      Body.setVelocity(body,{x:0,y:0}); Body.setAngularVelocity(body,0); Body.setAngle(body,0);
    });
  };

  cards.forEach(card => {
    card.addEventListener('click', () => selectCard(card));
    card.addEventListener('keydown', event => {
      const index = cards.indexOf(card);
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); cards[(index+1)%cards.length].focus(); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); cards[(index-1+cards.length)%cards.length].focus(); }
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectCard(card); }
    });
  });
  document.querySelector('[data-music-pause]').addEventListener('click', event => {
    if (staticMode) return;
    paused = !paused; engine.timing.timeScale = paused ? 0 : 1; event.currentTarget.textContent = paused ? 'resume' : 'pause';
  });
  document.querySelector('[data-music-reset]').addEventListener('click', build);
  document.querySelector('[data-music-tidy]').addEventListener('click', tidy);
  document.querySelector('[data-music-gravity]').addEventListener('click', event => {
    gravityOn = !gravityOn; if (engine) engine.gravity.y = gravityOn ? config.gravity : 0;
    event.currentTarget.textContent = `gravity: ${gravityOn ? 'on' : 'off'}`;
    event.currentTarget.setAttribute('aria-pressed', String(gravityOn));
  });
  document.querySelector('[data-music-static]').addEventListener('click', showStatic);
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer=setTimeout(()=> staticMode ? null : build(), 180); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && engine) engine.timing.timeScale = 0; else if (engine && !paused) engine.timing.timeScale = 1; });
  build();
})();
