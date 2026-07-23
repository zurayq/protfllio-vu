(() => {
  const canvas = document.querySelector('[data-toolbox-canvas]');
  if (!canvas) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    document.querySelector('.plain-tool-catalog')?.setAttribute('open', '');
    return;
  }

  const tools = JSON.parse(document.getElementById('toolbox-data').textContent);
  const ctx = canvas.getContext('2d');
  const nextCtx = document.querySelector('[data-next-canvas]').getContext('2d');
  const holdCtx = document.querySelector('[data-hold-canvas]').getContext('2d');
  const COLS = 10, ROWS = 20, CELL = 32, STEP = 1000 / 60;
  const colors = ['#a8d26d', '#66a5a0', '#d89859', '#9f83bd', '#d4685d', '#d0ba58', '#7091c8'];
  const SHAPES = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    J: [[1,0,0],[1,1,1],[0,0,0]],
    L: [[0,0,1],[1,1,1],[0,0,0]],
    O: [[1,1],[1,1]],
    S: [[0,1,1],[1,1,0],[0,0,0]],
    T: [[0,1,0],[1,1,1],[0,0,0]],
    Z: [[1,1,0],[0,1,1],[0,0,0]],
  };
  const labels = {'C#':'C#', Java:'JV', Python:'PY', JavaScript:'JS', C:'C', Git:'GT', SQL:'SQL', '.NET':'.N', FastAPI:'FA', 'Next.js':'NX', React:'RE', Supabase:'SB', 'Three.js':'3J', SDL3:'SD', 'Altium Designer':'AL', Unity:'UN'};
  const lineMessages = ['bug fixed', 'dependency resolved', 'build passed', 'merge clean'];

  let board, piece, nextPiece, heldPiece, canHold, bag, running, paused, gameOver;
  let score, lines, level, dropAccumulator, lastTime, accumulator, animationFrame;
  let ghostEnabled = true, soundEnabled = false, audioContext, discovered = new Set();

  const overlay = document.querySelector('[data-toolbox-overlay]');
  const overlayTitle = document.querySelector('[data-overlay-title]');
  const overlayCopy = document.querySelector('[data-overlay-copy]');
  const startButton = document.querySelector('[data-game-start]');
  const scoreNode = document.querySelector('[data-score]');
  const levelNode = document.querySelector('[data-level]');
  const linesNode = document.querySelector('[data-lines]');
  const discoveredNode = document.querySelector('[data-discovered]');
  const discoveredCount = document.querySelector('[data-discovered-count]');
  const messageNode = document.querySelector('[data-line-message]');

  const cloneMatrix = matrix => matrix.map(row => [...row]);
  const emptyBoard = () => Array.from({length: ROWS}, () => Array(COLS).fill(null));
  const refillBag = () => {
    bag = Object.keys(SHAPES);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  };
  const makePiece = () => {
    if (!bag?.length) refillBag();
    const type = bag.pop();
    const toolIndex = Math.floor(Math.random() * tools.length);
    return {
      type, matrix: cloneMatrix(SHAPES[type]),
      x: Math.floor((COLS - SHAPES[type][0].length) / 2), y: type === 'I' ? -1 : 0,
      color: colors[Object.keys(SHAPES).indexOf(type)], toolIndex,
    };
  };
  const collides = (candidate, matrix = candidate.matrix, dx = 0, dy = 0) => {
    for (let y = 0; y < matrix.length; y++) for (let x = 0; x < matrix[y].length; x++) {
      if (!matrix[y][x]) continue;
      const bx = candidate.x + x + dx, by = candidate.y + y + dy;
      if (bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && board[by][bx])) return true;
    }
    return false;
  };
  const rotateMatrix = (matrix, clockwise = true) => {
    const size = matrix.length;
    const out = Array.from({length: size}, () => Array(size).fill(0));
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      if (clockwise) out[x][size - 1 - y] = matrix[y][x];
      else out[size - 1 - x][y] = matrix[y][x];
    }
    return out;
  };
  const rotate = clockwise => {
    if (!running || paused || gameOver) return;
    const rotated = rotateMatrix(piece.matrix, clockwise);
    for (const kick of [0, -1, 1, -2, 2]) {
      if (!collides(piece, rotated, kick, 0)) {
        piece.x += kick; piece.matrix = rotated; beep(330, .025); return;
      }
    }
  };
  const lockPiece = () => {
    piece.matrix.forEach((row, y) => row.forEach((value, x) => {
      if (!value) return;
      const by = piece.y + y;
      if (by < 0) { finishGame(); return; }
      board[by][piece.x + x] = {color: piece.color, toolIndex: piece.toolIndex};
    }));
    if (gameOver) return;
    clearLines();
    piece = nextPiece;
    piece.x = Math.floor((COLS - piece.matrix[0].length) / 2);
    piece.y = piece.type === 'I' ? -1 : 0;
    nextPiece = makePiece();
    canHold = true;
    if (collides(piece)) finishGame();
    drawPreviews();
  };
  const clearLines = () => {
    const cleared = [];
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(Boolean)) {
        cleared.push(...board[y].map(cell => cell.toolIndex));
        board.splice(y, 1); board.unshift(Array(COLS).fill(null)); y++;
      }
    }
    if (!cleared.length) return;
    const count = cleared.length / COLS;
    lines += count;
    score += [0, 100, 300, 500, 800][count] * level;
    level = Math.floor(lines / 8) + 1;
    cleared.forEach(index => discovered.add(index));
    updateHud();
    showLineMessage(lineMessages[(lines - 1) % lineMessages.length]);
    beep(520 + count * 70, .09);
  };
  const showLineMessage = text => {
    messageNode.textContent = text;
    clearTimeout(showLineMessage.timer);
    showLineMessage.timer = setTimeout(() => { messageNode.textContent = ''; }, 900);
  };
  const stepDown = (soft = false) => {
    if (!running || paused || gameOver) return;
    if (!collides(piece, piece.matrix, 0, 1)) {
      piece.y++;
      if (soft) { score++; updateHud(); }
    } else lockPiece();
  };
  const hardDrop = () => {
    if (!running || paused || gameOver) return;
    let distance = 0;
    while (!collides(piece, piece.matrix, 0, 1)) { piece.y++; distance++; }
    score += distance * 2; updateHud(); beep(150, .035); lockPiece();
  };
  const move = direction => {
    if (!running || paused || gameOver || collides(piece, piece.matrix, direction, 0)) return;
    piece.x += direction;
  };
  const hold = () => {
    if (!running || paused || gameOver || !canHold) return;
    if (!heldPiece) {
      heldPiece = {...piece, matrix: cloneMatrix(SHAPES[piece.type])};
      piece = nextPiece; nextPiece = makePiece();
    } else {
      const swap = heldPiece;
      heldPiece = {...piece, matrix: cloneMatrix(SHAPES[piece.type])};
      piece = {...swap, matrix: cloneMatrix(SHAPES[swap.type])};
    }
    piece.x = Math.floor((COLS - piece.matrix[0].length) / 2); piece.y = 0;
    canHold = false; drawPreviews();
  };
  const ghostY = () => {
    let y = piece.y;
    while (!collides({...piece, y}, piece.matrix, 0, 1)) y++;
    return y;
  };
  const drawCell = (context, x, y, size, cell, alpha = 1) => {
    context.save(); context.globalAlpha = alpha;
    context.fillStyle = cell.color; context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
    context.fillStyle = 'rgba(255,255,255,.22)'; context.fillRect(x * size + 3, y * size + 3, size - 6, 3);
    context.strokeStyle = 'rgba(7,12,8,.65)'; context.strokeRect(x * size + 1.5, y * size + 1.5, size - 3, size - 3);
    if (size >= 22 && cell.toolIndex !== undefined) {
      context.fillStyle = '#10150f'; context.font = `700 ${Math.max(8, size * .28)}px monospace`;
      context.textAlign = 'center'; context.textBaseline = 'middle';
      context.fillText(labels[tools[cell.toolIndex].name] || tools[cell.toolIndex].name.slice(0,2).toUpperCase(), x * size + size/2, y * size + size/2 + 1);
    }
    context.restore();
  };
  const draw = () => {
    ctx.fillStyle = '#080c09'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(91,116,93,.16)'; ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL+.5,0); ctx.lineTo(x*CELL+.5,640); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL+.5); ctx.lineTo(320,y*CELL+.5); ctx.stroke(); }
    board.forEach((row, y) => row.forEach((cell, x) => { if (cell) drawCell(ctx, x, y, CELL, cell); }));
    if (piece && running && !gameOver) {
      if (ghostEnabled) {
        const gy = ghostY();
        piece.matrix.forEach((row,y)=>row.forEach((v,x)=>{ if(v && gy+y>=0) drawCell(ctx,piece.x+x,gy+y,CELL,{color:piece.color},.18); }));
      }
      piece.matrix.forEach((row,y)=>row.forEach((v,x)=>{ if(v && piece.y+y>=0) drawCell(ctx,piece.x+x,piece.y+y,CELL,piece); }));
    }
  };
  const drawPreview = (context, item) => {
    context.fillStyle = '#0b100c'; context.fillRect(0,0,112,88);
    if (!item) return;
    const size = 21, width = item.matrix[0].length * size, height = item.matrix.length * size;
    const offsetX = Math.floor((112-width)/2/size), offsetY = Math.floor((88-height)/2/size);
    context.save(); context.translate((112-width)/2, (88-height)/2);
    item.matrix.forEach((row,y)=>row.forEach((v,x)=>{if(v) drawCell(context,x,y,size,item)}));
    context.restore();
  };
  const drawPreviews = () => { drawPreview(nextCtx, nextPiece); drawPreview(holdCtx, heldPiece); };
  const updateHud = () => {
    scoreNode.textContent = String(score).padStart(6, '0');
    levelNode.textContent = String(level).padStart(2, '0');
    linesNode.textContent = String(lines).padStart(2, '0');
    discoveredCount.textContent = `${discovered.size}/${tools.length}`;
    [...discoveredNode.children].forEach((node, index) => {
      const found = discovered.has(index); node.classList.toggle('is-found', found);
      node.textContent = found ? tools[index].name : '???';
    });
  };
  const gravityDelay = () => Math.max(90, 780 - (level - 1) * 62);
  const update = delta => {
    if (!running || paused || gameOver) return;
    dropAccumulator += delta;
    if (dropAccumulator >= gravityDelay()) { dropAccumulator = 0; stepDown(); }
  };
  const loop = time => {
    const delta = Math.min(100, time - (lastTime || time)); lastTime = time; accumulator += delta;
    while (accumulator >= STEP) { update(STEP); accumulator -= STEP; }
    draw(); animationFrame = requestAnimationFrame(loop);
  };
  const start = () => {
    board = emptyBoard(); score = 0; lines = 0; level = 1; discovered = new Set();
    refillBag(); piece = makePiece(); nextPiece = makePiece(); heldPiece = null; canHold = true;
    running = true; paused = false; gameOver = false; dropAccumulator = 0; lastTime = 0; accumulator = 0;
    overlay.classList.remove('is-visible'); updateHud(); drawPreviews();
    if (!animationFrame) animationFrame = requestAnimationFrame(loop);
  };
  const finishGame = () => {
    gameOver = true; running = false; overlayTitle.textContent = 'BUILD FAILED';
    overlayCopy.textContent = 'press R to try again'; startButton.textContent = 'restart build';
    overlay.classList.add('is-visible'); beep(90, .18);
  };
  const togglePause = () => {
    if (!running || gameOver) return;
    paused = !paused;
    overlayTitle.textContent = paused ? 'BUILD PAUSED' : 'PRESS START';
    overlayCopy.textContent = paused ? 'press P to continue' : 'build stack, clear bugs';
    startButton.textContent = paused ? 'resume build' : 'start build';
    overlay.classList.toggle('is-visible', paused);
  };
  const beep = (frequency, duration) => {
    if (!soundEnabled) return;
    audioContext ||= new AudioContext();
    const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
    oscillator.frequency.value = frequency; oscillator.type = 'square';
    gain.gain.setValueAtTime(.025, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
  };
  const perform = action => {
    ({left:()=>move(-1), right:()=>move(1), down:()=>stepDown(true), rotate:()=>rotate(true), drop:hardDrop, hold, pause:togglePause}[action] || (()=>{}))();
  };

  startButton.addEventListener('click', () => paused ? togglePause() : start());
  document.querySelector('[data-game-pause]').addEventListener('click', togglePause);
  document.querySelector('[data-game-restart]').addEventListener('click', start);
  document.querySelector('[data-game-mute]').addEventListener('click', event => {
    soundEnabled = !soundEnabled; event.currentTarget.textContent = `sound: ${soundEnabled ? 'on' : 'off'}`;
    event.currentTarget.setAttribute('aria-pressed', String(soundEnabled)); if (soundEnabled) beep(440,.05);
  });
  document.querySelector('[data-game-ghost]').addEventListener('click', event => {
    ghostEnabled = !ghostEnabled; event.currentTarget.textContent = `ghost: ${ghostEnabled ? 'on' : 'off'}`;
    event.currentTarget.setAttribute('aria-pressed', String(ghostEnabled));
  });
  document.querySelectorAll('[data-game-action]').forEach(button => {
    button.addEventListener('pointerdown', event => { event.preventDefault(); perform(button.dataset.gameAction); });
  });
  document.addEventListener('keydown', event => {
    if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' ','z','Z','x','X','c','C','p','P','r','R'].includes(event.key)) event.preventDefault();
    if (event.repeat && !['ArrowLeft','ArrowRight','ArrowDown'].includes(event.key)) return;
    const actions = {
      ArrowLeft:()=>move(-1), ArrowRight:()=>move(1), ArrowDown:()=>stepDown(true),
      ArrowUp:()=>rotate(true), x:()=>rotate(true), X:()=>rotate(true), z:()=>rotate(false), Z:()=>rotate(false),
      ' ':hardDrop, c:hold, C:hold, p:togglePause, P:togglePause, r:start, R:start,
    };
    if (!running && (event.key === 'Enter' || event.key === ' ')) start();
    else actions[event.key]?.();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && running && !paused) togglePause(); });
  board = emptyBoard(); draw(); drawPreview(nextCtx, null); drawPreview(holdCtx, null); updateHud();
})();
