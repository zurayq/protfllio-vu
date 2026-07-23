(() => {
  const canvas = document.querySelector('[data-globe]');
  const wrap = document.querySelector('[data-globe-wrap]');
  if (!canvas || !wrap || !window.d3 || !window.topojson) return;
  const pins = JSON.parse(document.getElementById('travel-data').textContent);
  const context = canvas.getContext('2d');
  const tooltip = document.querySelector('[data-globe-tooltip]');
  const readout = document.querySelector('[data-view-coordinates]');
  const locationCard = document.querySelector('[data-selected-location]');
  const locationButtons = [...document.querySelectorAll('[data-location-index]')];
  const autoButton = document.querySelector('[data-auto-rotate]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const projection = d3.geoOrthographic().precision(.35).clipAngle(90);
  const path = d3.geoPath(projection, context);
  const graticule = d3.geoGraticule10();
  let land, borders, rotation = [-22, -37, 0], scaleFactor = 1, selectedIndex = 0;
  let width = 680, height = 680, pointerStart, rotationStart, lastMove, velocity = [0,0], inertiaFrame, autoFrame, autoRotate = false;
  const pointers = new Map();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    width = Math.max(300, rect.width || 680); height = width;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    projection.translate([width/2,height/2]).scale(width*.43*scaleFactor).rotate(rotation);
    draw();
  };
  const visible = coordinates => d3.geoDistance(coordinates, [-rotation[0], -rotation[1]]) < Math.PI / 2;
  const drawSphere = () => {
    context.beginPath(); path({type:'Sphere'});
    context.fillStyle = '#c8d9d1'; context.fill();
    context.strokeStyle = '#31463c'; context.lineWidth = 1.5; context.stroke();
  };
  const draw = () => {
    context.clearRect(0,0,width,height);
    projection.rotate(rotation).scale(width*.43*scaleFactor);
    drawSphere();
    context.beginPath(); path(graticule);
    context.strokeStyle = 'rgba(49,70,60,.18)'; context.lineWidth = .7; context.stroke();
    if (land) {
      context.beginPath(); path(land);
      context.fillStyle = '#eef0e8'; context.fill();
      context.strokeStyle = '#5a6d63'; context.lineWidth = .55; context.stroke();
    }
    if (borders) {
      context.beginPath(); path(borders);
      context.strokeStyle = 'rgba(50,66,58,.72)'; context.lineWidth = .5; context.stroke();
    }
    pins.forEach((pin,index) => {
      if (!visible(pin.coordinates)) return;
      const point = projection(pin.coordinates);
      context.save();
      context.translate(point[0],point[1]);
      context.fillStyle = index === selectedIndex ? '#a74338' : '#315f7d';
      context.beginPath(); context.arc(0,0,index === selectedIndex ? 7 : 5,0,Math.PI*2); context.fill();
      context.strokeStyle = '#f7f8f3'; context.lineWidth = 2; context.stroke();
      context.fillStyle = '#17221d'; context.font = '600 11px ui-monospace, monospace';
      context.textAlign = 'left'; context.fillText(pin.name, 11, 4);
      context.restore();
    });
    const center = [-rotation[0], -rotation[1]];
    readout.textContent = `${Math.abs(center[0]).toFixed(1)}°${center[0] >= 0 ? 'E':'W'} / ${Math.abs(center[1]).toFixed(1)}°${center[1] >= 0 ? 'N':'S'}`;
  };
  const clampRotation = value => [value[0], Math.max(-80,Math.min(80,value[1])), 0];
  const stopInertia = () => cancelAnimationFrame(inertiaFrame);
  const startInertia = () => {
    if (reducedMotion || Math.hypot(...velocity) < .08) return;
    const tick = () => {
      velocity[0] *= .94; velocity[1] *= .94;
      rotation = clampRotation([rotation[0] + velocity[0], rotation[1] - velocity[1], 0]);
      draw();
      if (Math.hypot(...velocity) > .015) inertiaFrame = requestAnimationFrame(tick);
    };
    tick();
  };
  const selectLocation = index => {
    selectedIndex = index;
    locationButtons.forEach((button,i)=>button.setAttribute('aria-selected',String(i===index)));
    const pin = pins[index];
    locationCard.innerHTML = `<p class="eyebrow">${pin.category.toUpperCase()} / ${pin.coordinates[1].toFixed(4)}°N ${pin.coordinates[0].toFixed(4)}°E</p><h2>${pin.name}, ${pin.country}</h2><p>${pin.description}</p>`;
    draw();
  };
  const centerLocation = index => {
    const [longitude,latitude] = pins[index].coordinates;
    rotation = [-longitude,-latitude,0]; selectLocation(index); draw();
  };
  const nearestPin = (x,y) => {
    let best = null, distance = 18;
    pins.forEach((pin,index)=>{
      if (!visible(pin.coordinates)) return;
      const [px,py] = projection(pin.coordinates), d = Math.hypot(px-x,py-y);
      if (d < distance) { best=index; distance=d; }
    });
    return best;
  };
  const localPoint = event => {
    const rect = canvas.getBoundingClientRect();
    return [(event.clientX-rect.left)*(width/rect.width),(event.clientY-rect.top)*(height/rect.height)];
  };

  wrap.addEventListener('pointerdown', event => {
    stopInertia(); pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    wrap.setPointerCapture(event.pointerId);
    if (pointers.size === 1) {
      pointerStart = [event.clientX,event.clientY]; rotationStart = [...rotation];
      lastMove = {x:event.clientX,y:event.clientY,time:performance.now()}; velocity=[0,0];
    } else if (pointers.size === 2) {
      const pair=[...pointers.values()]; wrap.pinchDistance=Math.hypot(pair[0].x-pair[1].x,pair[0].y-pair[1].y); wrap.pinchScale=scaleFactor;
    }
  });
  wrap.addEventListener('pointermove', event => {
    const current = pointers.get(event.pointerId);
    if (!current) {
      const [x,y] = localPoint(event), index=nearestPin(x,y);
      tooltip.hidden = index === null;
      if (index !== null) { tooltip.textContent=`${pins[index].name}, ${pins[index].country}`; tooltip.style.left=`${event.clientX-wrap.getBoundingClientRect().left+12}px`; tooltip.style.top=`${event.clientY-wrap.getBoundingClientRect().top+12}px`; }
      return;
    }
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if (pointers.size === 2) {
      const pair=[...pointers.values()], distance=Math.hypot(pair[0].x-pair[1].x,pair[0].y-pair[1].y);
      scaleFactor=Math.max(.7,Math.min(1.75,wrap.pinchScale*(distance/wrap.pinchDistance))); draw(); return;
    }
    const sensitivity = 180 / Math.max(320,width);
    const now = performance.now(), dt=Math.max(8,now-lastMove.time);
    const dx=event.clientX-pointerStart[0], dy=event.clientY-pointerStart[1];
    rotation=clampRotation([rotationStart[0]+dx*sensitivity,rotationStart[1]-dy*sensitivity,0]);
    velocity=[(event.clientX-lastMove.x)*sensitivity*(16/dt),(event.clientY-lastMove.y)*sensitivity*(16/dt)];
    lastMove={x:event.clientX,y:event.clientY,time:now}; draw();
  });
  const release = event => {
    const wasClick = pointerStart && Math.hypot(event.clientX-pointerStart[0],event.clientY-pointerStart[1]) < 6;
    pointers.delete(event.pointerId);
    if (wasClick) { const [x,y]=localPoint(event), index=nearestPin(x,y); if(index!==null) selectLocation(index); }
    if (!pointers.size) startInertia();
  };
  wrap.addEventListener('pointerup', release);
  wrap.addEventListener('pointercancel', release);
  wrap.addEventListener('pointerleave', () => { if (!pointers.size) tooltip.hidden=true; });
  wrap.addEventListener('wheel', event => {
    event.preventDefault(); scaleFactor=Math.max(.7,Math.min(1.75,scaleFactor*Math.exp(-event.deltaY*.001))); draw();
  }, {passive:false});
  document.querySelector('[data-reset-globe]').addEventListener('click',()=>{rotation=[-22,-37,0];scaleFactor=1;selectLocation(0);draw();});
  document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{scaleFactor=Math.max(.7,Math.min(1.75,scaleFactor+Number(button.dataset.zoom)*.12));draw();}));
  locationButtons.forEach((button,index)=>{
    button.addEventListener('click',()=>centerLocation(index));
    button.addEventListener('keydown',event=>{
      if (!['ArrowUp','ArrowDown'].includes(event.key)) return;
      event.preventDefault(); const next=(index+(event.key==='ArrowDown'?1:-1)+locationButtons.length)%locationButtons.length;
      locationButtons[next].focus(); centerLocation(next);
    });
  });
  const autoTick = () => {
    if (!autoRotate) return;
    rotation[0] += .035; draw(); autoFrame=requestAnimationFrame(autoTick);
  };
  autoButton.addEventListener('click',()=>{
    if (reducedMotion) return;
    autoRotate=!autoRotate; autoButton.textContent=`auto: ${autoRotate?'on':'off'}`; autoButton.setAttribute('aria-pressed',String(autoRotate));
    cancelAnimationFrame(autoFrame); if(autoRotate)autoTick();
  });
  let resizeTimer; addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resize,100);});

  fetch('/assets/world/countries.json')
    .then(response => { if(!response.ok) throw new Error('world data unavailable'); return response.json(); })
    .then(world => {
      land = topojson.feature(world, world.objects.countries);
      borders = topojson.mesh(world, world.objects.countries, (a,b)=>a!==b);
      resize();
    })
    .catch(() => {
      locationCard.insertAdjacentHTML('beforeend','<p class="map-credit">country data could not be loaded; location list remains available.</p>');
      resize();
    });
  selectLocation(0); resize();
})();
