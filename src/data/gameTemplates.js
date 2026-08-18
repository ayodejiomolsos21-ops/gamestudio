/**
 * Standalone, robust HTML5 games that run self-contained inside iframes.
 * They have zero external dependencies and use pure HTML, CSS, and JS with Canvas.
 */

export const standaloneGameHtml = {
  '2048': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>2048</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; user-select: none; }
  body { background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 10px; }
  .header { display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 420px; margin-bottom: 12px; }
  .title { font-size: 32px; font-weight: 800; color: #f59e0b; }
  .scores { display: flex; gap: 8px; }
  .score-box { background: #1e293b; padding: 6px 14px; border-radius: 8px; text-align: center; border: 1px solid #334155; }
  .score-label { font-size: 10px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; }
  .score-val { font-size: 18px; font-weight: bold; color: #fff; }
  .controls { display: flex; justify-content: space-between; width: 100%; max-width: 420px; margin-bottom: 12px; }
  .btn { background: #3b82f6; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .btn:hover { background: #2563eb; }
  #grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #1e293b; padding: 12px; border-radius: 12px; width: 100%; max-width: 420px; aspect-ratio: 1; border: 2px solid #334155; position: relative; }
  .cell { background: #334155; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; transition: transform 0.1s ease-in-out, background 0.15s; }
  .cell[data-val="2"] { background: #e2e8f0; color: #1e293b; }
  .cell[data-val="4"] { background: #fef08a; color: #1e293b; }
  .cell[data-val="8"] { background: #f97316; color: #fff; }
  .cell[data-val="16"] { background: #ea580c; color: #fff; }
  .cell[data-val="32"] { background: #ef4444; color: #fff; }
  .cell[data-val="64"] { background: #dc2626; color: #fff; }
  .cell[data-val="128"] { background: #eab308; color: #fff; font-size: 20px; box-shadow: 0 0 10px #eab308; }
  .cell[data-val="256"] { background: #f59e0b; color: #fff; font-size: 20px; box-shadow: 0 0 15px #f59e0b; }
  .cell[data-val="512"] { background: #10b981; color: #fff; font-size: 20px; box-shadow: 0 0 15px #10b981; }
  .cell[data-val="1024"] { background: #06b6d4; color: #fff; font-size: 18px; box-shadow: 0 0 20px #06b6d4; }
  .cell[data-val="2048"] { background: #8b5cf6; color: #fff; font-size: 18px; box-shadow: 0 0 25px #8b5cf6; }
  .overlay { position: absolute; inset: 0; background: rgba(15,23,42,0.85); display: none; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; }
  .instructions { margin-top: 14px; font-size: 13px; color: #94a3b8; text-align: center; }
</style>
</head>
<body>
<div class="header">
  <div class="title">2048</div>
  <div class="scores">
    <div class="score-box"><div class="score-label">Score</div><div class="score-val" id="score">0</div></div>
    <div class="score-box"><div class="score-label">Best</div><div class="score-val" id="best">0</div></div>
  </div>
</div>
<div class="controls">
  <button class="btn" onclick="initGame()">New Game</button>
  <span style="font-size: 13px; color: #94a3b8; align-self: center;">Swipe or use Arrow Keys</span>
</div>
<div id="grid">
  <div class="overlay" id="overlay">
    <h2 id="over-title" style="margin-bottom: 12px; font-size: 28px;">Game Over!</h2>
    <button class="btn" onclick="initGame()">Try Again</button>
  </div>
</div>
<div class="instructions">Use Arrow Keys or WASD to slide tiles. Merge identical numbers to reach 2048!</div>
<script>
  let grid = Array(4).fill(null).map(() => Array(4).fill(0));
  let score = 0;
  let best = parseInt(localStorage.getItem('2048_best') || '0');
  document.getElementById('best').innerText = best;

  function initGame() {
    grid = Array(4).fill(null).map(() => Array(4).fill(0));
    score = 0;
    document.getElementById('score').innerText = '0';
    document.getElementById('overlay').style.display = 'none';
    spawnTile();
    spawnTile();
    render();
  }

  function spawnTile() {
    const empty = [];
    for(let r=0; r<4; r++) {
      for(let c=0; c<4; c++) {
        if(grid[r][c] === 0) empty.push({r, c});
      }
    }
    if(empty.length > 0) {
      const {r, c} = empty[Math.floor(Math.random() * empty.length)];
      grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function render() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';
    for(let r=0; r<4; r++) {
      for(let c=0; c<4; c++) {
        const val = grid[r][c];
        const cell = document.createElement('div');
        cell.className = 'cell';
        if(val > 0) {
          cell.setAttribute('data-val', val);
          cell.innerText = val;
        }
        gridEl.appendChild(cell);
      }
    }
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';
    overlay.innerHTML = '<h2 id="over-title" style="margin-bottom:12px;font-size:28px;">Game Over!</h2><button class="btn" onclick="initGame()">Try Again</button>';
    gridEl.appendChild(overlay);
  }

  function slide(row) {
    let arr = row.filter(v => v !== 0);
    for(let i=0; i<arr.length-1; i++) {
      if(arr[i] === arr[i+1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i+1] = 0;
      }
    }
    arr = arr.filter(v => v !== 0);
    while(arr.length < 4) arr.push(0);
    return arr;
  }

  function moveLeft() {
    let moved = false;
    for(let r=0; r<4; r++) {
      const old = [...grid[r]];
      grid[r] = slide(grid[r]);
      if(grid[r].some((v, i) => v !== old[i])) moved = true;
    }
    return moved;
  }

  function rotate() {
    grid = grid[0].map((_, c) => grid.map(row => row[c]).reverse());
  }

  function move(dir) {
    let moved = false;
    if(dir === 'left') moved = moveLeft();
    else if(dir === 'right') { rotate(); rotate(); moved = moveLeft(); rotate(); rotate(); }
    else if(dir === 'up') { rotate(); rotate(); rotate(); moved = moveLeft(); rotate(); }
    else if(dir === 'down') { rotate(); moved = moveLeft(); rotate(); rotate(); rotate(); }

    if(moved) {
      spawnTile();
      document.getElementById('score').innerText = score;
      if(score > best) {
        best = score;
        localStorage.setItem('2048_best', best);
        document.getElementById('best').innerText = best;
      }
      render();
      checkGameOver();
    }
  }

  function checkGameOver() {
    for(let r=0; r<4; r++) {
      for(let c=0; c<4; c++) {
        if(grid[r][c] === 0) return;
        if(c < 3 && grid[r][c] === grid[r][c+1]) return;
        if(r < 3 && grid[r][c] === grid[r+1][c]) return;
      }
    }
    const overlay = document.getElementById('overlay');
    if(overlay) overlay.style.display = 'flex';
  }

  window.addEventListener('keydown', e => {
    if(['ArrowUp','KeyW'].includes(e.code)) { e.preventDefault(); move('up'); }
    else if(['ArrowDown','KeyS'].includes(e.code)) { e.preventDefault(); move('down'); }
    else if(['ArrowLeft','KeyA'].includes(e.code)) { e.preventDefault(); move('left'); }
    else if(['ArrowRight','KeyD'].includes(e.code)) { e.preventDefault(); move('right'); }
  });

  // Touch controls
  let tsX = 0, tsY = 0;
  window.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; tsY = e.touches[0].clientY; }, {passive: false});
  window.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tsX;
    const dy = e.changedTouches[0].clientY - tsY;
    if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      move(dx > 0 ? 'right' : 'left');
    } else if(Math.abs(dy) > 30) {
      move(dy > 0 ? 'down' : 'up');
    }
  }, {passive: false});

  initGame();
</script>
</body>
</html>`,

  'snake': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Snake Deluxe</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; }
  body { background:#090d16; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:10px; overflow:hidden; }
  .header { display:flex; justify-content:space-between; width:400px; max-width:100%; margin-bottom:8px; font-weight:bold; }
  .canvas-wrap { position:relative; border:3px solid #10b981; border-radius:10px; box-shadow:0 0 20px rgba(16,185,129,0.2); overflow:hidden; }
  canvas { background:#030712; display:block; }
  .ui-overlay { position:absolute; inset:0; background:rgba(3,7,18,0.85); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; }
  .btn { background:#10b981; color:#030712; border:none; padding:10px 24px; border-radius:6px; font-weight:bold; font-size:16px; cursor:pointer; }
  .btn:hover { background:#059669; color:#fff; }
  .instructions { margin-top:8px; font-size:12px; color:#9ca3af; }
</style>
</head>
<body>
<div class="header">
  <span style="color:#10b981;">🐍 SNAKE</span>
  <span>Score: <span id="score" style="color:#f59e0b">0</span> | Best: <span id="best" style="color:#38bdf8">0</span></span>
</div>
<div class="canvas-wrap">
  <canvas id="c" width="400" height="400"></canvas>
  <div class="ui-overlay" id="start-screen">
    <h2>Neon Snake</h2>
    <p style="color:#9ca3af;font-size:14px;">Use Arrow keys or WASD</p>
    <button class="btn" onclick="startGame()">Start Game</button>
  </div>
</div>
<div class="instructions">Arrow Keys / WASD to steer. Collect food and don't hit walls!</div>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const gridSize = 20;
  const tileCount = canvas.width / gridSize;
  let snake = [{x: 10, y: 10}];
  let food = {x: 15, y: 15, isGold: false};
  let dx = 1, dy = 0, nextDx = 1, nextDy = 0;
  let score = 0, best = parseInt(localStorage.getItem('snake_best') || '0');
  let gameInterval = null;
  let isRunning = false;
  document.getElementById('best').innerText = best;

  function startGame() {
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    dx = 1; dy = 0; nextDx = 1; nextDy = 0;
    score = 0;
    document.getElementById('score').innerText = score;
    document.getElementById('start-screen').style.display = 'none';
    placeFood();
    isRunning = true;
    if(gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 90);
  }

  function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    food.isGold = Math.random() < 0.15;
    for(let segment of snake) {
      if(segment.x === food.x && segment.y === food.y) placeFood();
    }
  }

  function gameLoop() {
    dx = nextDx; dy = nextDy;
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Collision with walls
    if(head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      return gameOver();
    }
    // Collision with self
    for(let i=0; i<snake.length; i++) {
      if(snake[i].x === head.x && snake[i].y === head.y) return gameOver();
    }

    snake.unshift(head);
    if(head.x === food.x && head.y === food.y) {
      score += food.isGold ? 50 : 10;
      document.getElementById('score').innerText = score;
      if(score > best) {
        best = score;
        localStorage.setItem('snake_best', best);
        document.getElementById('best').innerText = best;
      }
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    // Background Grid
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1;
    for(let i=0; i<=canvas.width; i+=gridSize) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Food
    ctx.fillStyle = food.isGold ? '#fbbf24' : '#ef4444';
    ctx.shadowBlur = 10;
    ctx.shadowColor = food.isGold ? '#fbbf24' : '#ef4444';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI*2);
    ctx.fill();

    // Snake
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#10b981';
    for(let i=0; i<snake.length; i++) {
      ctx.fillStyle = i === 0 ? '#34d399' : '#10b981';
      ctx.fillRect(snake[i].x * gridSize + 1, snake[i].y * gridSize + 1, gridSize - 2, gridSize - 2);
    }
    ctx.shadowBlur = 0;
  }

  function gameOver() {
    isRunning = false;
    clearInterval(gameInterval);
    const screen = document.getElementById('start-screen');
    screen.innerHTML = '<h2 style="color:#ef4444">Game Over!</h2><p>Final Score: ' + score + '</p><button class="btn" onclick="startGame()">Play Again</button>';
    screen.style.display = 'flex';
  }

  window.addEventListener('keydown', e => {
    if(['ArrowUp','KeyW'].includes(e.code) && dy !== 1) { nextDx = 0; nextDy = -1; }
    else if(['ArrowDown','KeyS'].includes(e.code) && dy !== -1) { nextDx = 0; nextDy = 1; }
    else if(['ArrowLeft','KeyA'].includes(e.code) && dx !== 1) { nextDx = -1; nextDy = 0; }
    else if(['ArrowRight','KeyD'].includes(e.code) && dx !== -1) { nextDx = 1; nextDy = 0; }
  });
</script>
</body>
</html>`,

  'flappy-bird': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flappy Bird</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0f172a; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; font-family:sans-serif; color:#fff; overflow:hidden; }
  .wrap { position:relative; border-radius:12px; overflow:hidden; border:3px solid #38bdf8; box-shadow:0 10px 25px rgba(0,0,0,0.5); }
  canvas { display:block; background:#70c5ce; }
  .instructions { margin-top:10px; font-size:13px; color:#94a3b8; }
</style>
</head>
<body>
<div class="wrap">
  <canvas id="c" width="360" height="520"></canvas>
</div>
<div class="instructions">Press Space or Tap screen to Flap!</div>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let bird = { x: 50, y: 200, vy: 0, radius: 12, gravity: 0.28, jump: -6.2 };
  let pipes = [];
  let score = 0, best = parseInt(localStorage.getItem('flappy_best') || '0');
  let state = 'START'; // START, PLAYING, GAMEOVER
  let frame = 0;

  function reset() {
    bird.y = 200;
    bird.vy = 0;
    pipes = [];
    score = 0;
    frame = 0;
    state = 'START';
  }

  function flap() {
    if(state === 'START') { state = 'PLAYING'; bird.vy = bird.jump; }
    else if(state === 'PLAYING') { bird.vy = bird.jump; }
    else if(state === 'GAMEOVER') { reset(); }
  }

  window.addEventListener('keydown', e => { if(e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); flap(); } });
  canvas.addEventListener('click', flap);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); flap(); });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if(state === 'PLAYING') {
      frame++;
      bird.vy += bird.gravity;
      bird.y += bird.vy;

      if(frame % 95 === 0) {
        const gap = 125;
        const minH = 50;
        const maxH = canvas.height - 100 - gap - minH;
        const topH = Math.floor(Math.random() * maxH) + minH;
        pipes.push({ x: canvas.width, top: topH, bottom: topH + gap, passed: false });
      }

      for(let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 2.2;

        // Score
        if(!p.passed && p.x + 50 < bird.x) {
          p.passed = true;
          score++;
          if(score > best) { best = score; localStorage.setItem('flappy_best', best); }
        }

        // Collision
        if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + 52) {
          if(bird.y - bird.radius < p.top || bird.y + bird.radius > p.bottom) {
            state = 'GAMEOVER';
          }
        }

        if(p.x < -60) pipes.splice(i, 1);
      }

      if(bird.y + bird.radius >= canvas.height - 60 || bird.y - bird.radius <= 0) {
        state = 'GAMEOVER';
      }
    }
  }

  function draw() {
    // Sky
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // City Silhouette / Clouds
    ctx.fillStyle = '#8ce8f2';
    ctx.beginPath();
    ctx.arc(80, 100, 30, 0, Math.PI*2); ctx.arc(110, 90, 40, 0, Math.PI*2); ctx.arc(140, 100, 30, 0, Math.PI*2);
    ctx.fill();

    // Pipes
    for(const p of pipes) {
      ctx.fillStyle = '#22c55e';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 3;
      // Top Pipe
      ctx.fillRect(p.x, 0, 52, p.top);
      ctx.strokeRect(p.x, 0, 52, p.top);
      ctx.fillRect(p.x - 3, p.top - 20, 58, 20);
      ctx.strokeRect(p.x - 3, p.top - 20, 58, 20);

      // Bottom Pipe
      ctx.fillRect(p.x, p.bottom, 52, canvas.height - p.bottom - 60);
      ctx.strokeRect(p.x, p.bottom, 52, canvas.height - p.bottom - 60);
      ctx.fillRect(p.x - 3, p.bottom, 58, 20);
      ctx.strokeRect(p.x - 3, p.bottom, 58, 20);
    }

    // Ground
    ctx.fillStyle = '#ded895';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 14);

    // Bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    const angle = state === 'PLAYING' ? Math.min(Math.PI/4, Math.max(-Math.PI/4, bird.vy * 0.08)) : 0;
    ctx.rotate(angle);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(5, -4, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(6, -4, 2, 0, Math.PI*2); ctx.fill();
    // Beak
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(16, 2); ctx.lineTo(8, 6); ctx.fill();
    ctx.restore();

    // Score Display
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 6;
    ctx.fillText(score, canvas.width / 2, 60);
    ctx.shadowBlur = 0;

    if(state === 'START') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(20, 160, canvas.width - 40, 180);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('FLAPPY BIRD', canvas.width / 2, 210);
      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.fillText('Tap or Space to Start', canvas.width / 2, 260);
      ctx.fillText('Best: ' + best, canvas.width / 2, 300);
    } else if(state === 'GAMEOVER') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(20, 150, canvas.width - 40, 200);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('GAME OVER', canvas.width / 2, 200);
      ctx.fillStyle = '#fff';
      ctx.font = '18px sans-serif';
      ctx.fillText('Score: ' + score, canvas.width / 2, 240);
      ctx.fillText('Best: ' + best, canvas.width / 2, 270);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Click to Restart', canvas.width / 2, 315);
    }
  }

  loop();
</script>
</body>
</html>`,

  'tetris': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tetris Master</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New', monospace; }
  body { background:#0f172a; color:#fff; display:flex; justify-content:center; align-items:center; min-height:100vh; padding:10px; }
  .game-container { display:flex; gap:16px; background:#1e293b; padding:16px; border-radius:12px; border:2px solid #334155; box-shadow:0 8px 30px rgba(0,0,0,0.6); }
  canvas { background:#0b0f19; border:2px solid #475569; display:block; border-radius:4px; }
  .side-panel { display:flex; flex-direction:column; justify-content:space-between; width:130px; }
  .panel-box { background:#0f172a; border:1px solid #334155; border-radius:8px; padding:8px; text-align:center; margin-bottom:8px; }
  .panel-title { font-size:11px; color:#94a3b8; text-transform:uppercase; margin-bottom:4px; }
  .panel-val { font-size:18px; font-weight:bold; color:#38bdf8; }
  .btn { background:#3b82f6; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; width:100%; }
  .btn:hover { background:#2563eb; }
</style>
</head>
<body>
<div class="game-container">
  <canvas id="tetris" width="220" height="440"></canvas>
  <div class="side-panel">
    <div>
      <div class="panel-box"><div class="panel-title">Score</div><div class="panel-val" id="score">0</div></div>
      <div class="panel-box"><div class="panel-title">Lines</div><div class="panel-val" id="lines">0</div></div>
      <div class="panel-box"><div class="panel-title">Level</div><div class="panel-val" id="level">1</div></div>
      <div class="panel-box"><div class="panel-title">Next</div><canvas id="next" width="80" height="80" style="margin:auto;"></canvas></div>
    </div>
    <div>
      <button class="btn" onclick="startTetris()">Restart</button>
      <div style="font-size:10px;color:#94a3b8;margin-top:8px;text-align:center;">Arrows/WASD<br>Up = Rotate<br>Space = Hard Drop</div>
    </div>
  </div>
</div>
<script>
  const canvas = document.getElementById('tetris');
  const ctx = canvas.getContext('2d');
  const nextCanvas = document.getElementById('next');
  const nextCtx = nextCanvas.getContext('2d');
  const COLS = 10, ROWS = 20, BLOCK = 22;
  const COLORS = [null, '#06b6d4', '#3b82f6', '#f97316', '#eab308', '#22c55e', '#a855f7', '#ef4444'];
  const SHAPES = [
    [],
    [[1,1,1,1]], // I
    [[2,0,0],[2,2,2]], // J
    [[0,0,3],[3,3,3]], // L
    [[4,4],[4,4]], // O
    [[0,5,5],[5,5,0]], // S
    [[0,6,0],[6,6,6]], // T
    [[7,7,0],[0,7,7]]  // Z
  ];

  let board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  let current = null, next = null;
  let score = 0, lines = 0, level = 1;
  let dropInterval = 800, lastTime = 0, dropCounter = 0;
  let isGameOver = false;

  function randomPiece() {
    const id = Math.floor(Math.random() * 7) + 1;
    return { shape: SHAPES[id], color: id, x: Math.floor(COLS/2) - Math.floor(SHAPES[id][0].length/2), y: 0 };
  }

  function startTetris() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    score = 0; lines = 0; level = 1;
    document.getElementById('score').innerText = '0';
    document.getElementById('lines').innerText = '0';
    document.getElementById('level').innerText = '1';
    isGameOver = false;
    current = randomPiece();
    next = randomPiece();
    lastTime = performance.now();
    requestAnimationFrame(update);
  }

  function collide(b, piece) {
    const s = piece.shape;
    for(let y=0; y<s.length; y++) {
      for(let x=0; x<s[y].length; x++) {
        if(s[y][x] !== 0) {
          const bx = piece.x + x;
          const by = piece.y + y;
          if(bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && b[by][bx] !== 0)) return true;
        }
      }
    }
    return false;
  }

  function merge(b, piece) {
    piece.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if(val !== 0 && piece.y + y >= 0) b[piece.y + y][piece.x + x] = piece.color;
      });
    });
  }

  function rotate(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
  }

  function clearLines() {
    let rowCount = 0;
    for(let y = ROWS - 1; y >= 0; y--) {
      if(board[y].every(v => v !== 0)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        rowCount++;
        y++;
      }
    }
    if(rowCount > 0) {
      lines += rowCount;
      const pts = [0, 100, 300, 500, 800];
      score += pts[rowCount] * level;
      level = Math.floor(lines / 10) + 1;
      dropInterval = Math.max(120, 800 - (level - 1) * 70);
      document.getElementById('score').innerText = score;
      document.getElementById('lines').innerText = lines;
      document.getElementById('level').innerText = level;
    }
  }

  function drop() {
    current.y++;
    if(collide(board, current)) {
      current.y--;
      merge(board, current);
      clearLines();
      current = next;
      next = randomPiece();
      if(collide(board, current)) {
        isGameOver = true;
      }
    }
    dropCounter = 0;
  }

  function hardDrop() {
    while(!collide(board, current)) { current.y++; }
    current.y--;
    drop();
  }

  function drawMatrix(ctx, matrix, offset, colorId, blockSize) {
    matrix.forEach((row, y) => {
      row.forEach((val, x) => {
        if(val !== 0) {
          ctx.fillStyle = COLORS[colorId || val];
          ctx.fillRect((offset.x + x) * blockSize + 1, (offset.y + y) * blockSize + 1, blockSize - 2, blockSize - 2);
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.fillRect((offset.x + x) * blockSize + 1, (offset.y + y) * blockSize + 1, blockSize - 2, 4);
        }
      });
    });
  }

  function update(time = 0) {
    const delta = time - lastTime;
    lastTime = time;
    dropCounter += delta;
    if(dropCounter > dropInterval && !isGameOver) {
      drop();
    }

    // Draw main board
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(ctx, board, {x:0, y:0}, null, BLOCK);
    if(current && !isGameOver) {
      drawMatrix(ctx, current.shape, {x: current.x, y: current.y}, current.color, BLOCK);
    }

    // Draw Next
    nextCtx.fillStyle = '#0f172a';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if(next) {
      const offX = (4 - next.shape[0].length) / 2;
      const offY = (4 - next.shape.length) / 2;
      drawMatrix(nextCtx, next.shape, {x: offX, y: offY}, next.color, 18);
    }

    if(isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, 160, canvas.width, 100);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width/2, 205);
      ctx.font = '12px Courier New';
      ctx.fillStyle = '#fff';
      ctx.fillText('Press Restart', canvas.width/2, 235);
    } else {
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('keydown', e => {
    if(isGameOver) return;
    if(['ArrowLeft','KeyA'].includes(e.code)) {
      current.x--;
      if(collide(board, current)) current.x++;
    } else if(['ArrowRight','KeyD'].includes(e.code)) {
      current.x++;
      if(collide(board, current)) current.x--;
    } else if(['ArrowDown','KeyS'].includes(e.code)) {
      drop();
    } else if(['ArrowUp','KeyW'].includes(e.code)) {
      const rotated = rotate(current.shape);
      const old = current.shape;
      current.shape = rotated;
      if(collide(board, current)) current.shape = old;
    } else if(e.code === 'Space') {
      e.preventDefault();
      hardDrop();
    }
  });

  startTetris();
</script>
</body>
</html>`,

  'dino-runner': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>T-Rex Dino Runner</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; }
  body { background:#0f172a; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .game-box { position:relative; width:600px; max-width:95vw; height:240px; background:#f8fafc; border-radius:12px; border:3px solid #64748b; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.5); }
  canvas { display:block; width:100%; height:100%; }
  .instructions { margin-top:12px; font-size:13px; color:#94a3b8; }
</style>
</head>
<body>
<div class="game-box">
  <canvas id="c" width="600" height="240"></canvas>
</div>
<div class="instructions">Press Space or Up Arrow to Jump, Down Arrow to Duck!</div>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let dino = { x: 50, y: 160, w: 34, h: 44, vy: 0, jump: -12.5, isGrounded: true, ducking: false };
  let obstacles = [];
  let clouds = [{x: 200, y: 40}, {x: 450, y: 60}];
  let score = 0, best = parseInt(localStorage.getItem('dino_best') || '0');
  let speed = 6;
  let isGameOver = false;
  let spawnTimer = 0;

  function reset() {
    dino.y = 160;
    dino.vy = 0;
    obstacles = [];
    score = 0;
    speed = 6;
    isGameOver = false;
  }

  function jump() {
    if(isGameOver) { reset(); return; }
    if(dino.isGrounded) {
      dino.vy = dino.jump;
      dino.isGrounded = false;
    }
  }

  window.addEventListener('keydown', e => {
    if(e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    if(e.code === 'ArrowDown') { dino.ducking = true; }
  });
  window.addEventListener('keyup', e => {
    if(e.code === 'ArrowDown') { dino.ducking = false; }
  });
  canvas.addEventListener('click', jump);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); jump(); });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if(isGameOver) return;
    score += 0.2;
    speed += 0.0005;

    // Dino Physics
    dino.vy += 0.65;
    dino.y += dino.vy;
    const groundY = dino.ducking ? 180 : 160;
    if(dino.y >= groundY) {
      dino.y = groundY;
      dino.vy = 0;
      dino.isGrounded = true;
    }

    // Clouds
    for(const c of clouds) {
      c.x -= speed * 0.25;
      if(c.x < -60) c.x = canvas.width + Math.random() * 80;
    }

    // Obstacles
    spawnTimer++;
    if(spawnTimer > Math.max(50, 110 - speed * 4)) {
      if(Math.random() < 0.6) {
        // Cactus or Pterodactyl
        const isBird = score > 150 && Math.random() < 0.3;
        obstacles.push({
          x: canvas.width,
          y: isBird ? 135 : 170,
          w: isBird ? 30 : (Math.random() < 0.5 ? 20 : 36),
          h: isBird ? 22 : 34,
          isBird: isBird
        });
        spawnTimer = 0;
      }
    }

    for(let i=obstacles.length-1; i>=0; i--) {
      const o = obstacles[i];
      o.x -= speed;

      // Collision box
      const dh = dino.ducking ? 24 : 44;
      if(dino.x + dino.w - 6 > o.x && dino.x + 6 < o.x + o.w && dino.y + dh - 4 > o.y && dino.y < o.y + o.h) {
        isGameOver = true;
        if(score > best) {
          best = Math.floor(score);
          localStorage.setItem('dino_best', best);
        }
      }

      if(o.x < -50) obstacles.splice(i, 1);
    }
  }

  function draw() {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground Line
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 204);
    ctx.lineTo(canvas.width, 204);
    ctx.stroke();

    // Clouds
    ctx.fillStyle = '#cbd5e1';
    for(const c of clouds) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI*2);
      ctx.arc(c.x+15, c.y-5, 18, 0, Math.PI*2);
      ctx.arc(c.x+30, c.y, 14, 0, Math.PI*2);
      ctx.fill();
    }

    // Dino
    ctx.fillStyle = '#334155';
    const dh = dino.ducking ? 24 : 44;
    const dw = dino.ducking ? 48 : 34;
    ctx.fillRect(dino.x, dino.y, dw, dh);
    // Eye
    ctx.fillStyle = '#fff';
    ctx.fillRect(dino.x + (dino.ducking ? 38 : 22), dino.y + 6, 4, 4);

    // Obstacles
    for(const o of obstacles) {
      ctx.fillStyle = o.isBird ? '#0284c7' : '#16a34a';
      ctx.fillRect(o.x, o.y, o.w, o.h);
    }

    // Scores
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'right';
    ctx.fillText('HI ' + String(best).padStart(5, '0') + '  ' + String(Math.floor(score)).padStart(5, '0'), canvas.width - 20, 30);

    if(isGameOver) {
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('G A M E  O V E R', canvas.width/2, 110);
      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText('Click or press Space to Restart', canvas.width/2, 140);
    }
  }

  loop();
</script>
</body>
</html>`,

  'breakout': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Breakout Smash</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; }
  body { background:#090d16; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; }
  .header { display:flex; justify-content:space-between; width:480px; max-width:95vw; margin-bottom:8px; font-weight:bold; }
  canvas { background:#030712; border:2px solid #38bdf8; border-radius:8px; box-shadow:0 0 20px rgba(56,189,248,0.2); display:block; cursor:none; }
  .instructions { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="header">
  <span style="color:#38bdf8">💥 BREAKOUT</span>
  <span>Score: <span id="score" style="color:#facc15">0</span> | Lives: <span id="lives" style="color:#ef4444">❤️❤️❤️</span></span>
</div>
<canvas id="c" width="480" height="420"></canvas>
<div class="instructions">Move mouse or use Left/Right arrows to move paddle!</div>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let paddle = { x: 200, y: 390, w: 80, h: 12, speed: 7 };
  let ball = { x: 240, y: 300, vx: 3.5, vy: -3.5, r: 6 };
  let bricks = [];
  let rows = 5, cols = 8;
  let score = 0, lives = 3;
  let isGameOver = false, isWon = false;

  const brickColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

  function initBricks() {
    bricks = [];
    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        bricks.push({ x: c * 58 + 10, y: r * 22 + 40, w: 52, h: 16, alive: true, color: brickColors[r] });
      }
    }
  }

  function resetGame() {
    score = 0; lives = 3; isGameOver = false; isWon = false;
    document.getElementById('score').innerText = '0';
    document.getElementById('lives').innerText = '❤️❤️❤️';
    ball.x = 240; ball.y = 300; ball.vx = 3.5; ball.vy = -3.5;
    initBricks();
  }

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left - paddle.w/2;
  });

  window.addEventListener('keydown', e => {
    if(e.code === 'ArrowLeft') paddle.x -= 25;
    if(e.code === 'ArrowRight') paddle.x += 25;
    if(isGameOver || isWon) resetGame();
  });
  canvas.addEventListener('click', () => { if(isGameOver || isWon) resetGame(); });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if(isGameOver || isWon) return;

    paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, paddle.x));

    ball.x += ball.vx;
    ball.y += ball.vy;

    // Walls
    if(ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) ball.vx = -ball.vx;
    if(ball.y - ball.r <= 0) ball.vy = -ball.vy;

    // Paddle collision
    if(ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
      const hit = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
      ball.vx = hit * 5;
      ball.vy = -Math.abs(ball.vy);
    }

    // Bottom loss
    if(ball.y > canvas.height) {
      lives--;
      document.getElementById('lives').innerText = '❤️'.repeat(lives);
      if(lives <= 0) {
        isGameOver = true;
      } else {
        ball.x = paddle.x + paddle.w/2;
        ball.y = 300;
        ball.vx = 3.5;
        ball.vy = -3.5;
      }
    }

    // Bricks collision
    let aliveCount = 0;
    for(const b of bricks) {
      if(b.alive) {
        aliveCount++;
        if(ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w && ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
          b.alive = false;
          ball.vy = -ball.vy;
          score += 20;
          document.getElementById('score').innerText = score;
        }
      }
    }
    if(aliveCount === 0) isWon = true;
  }

  function draw() {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paddle
    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#38bdf8';
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

    // Ball
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bricks
    for(const b of bricks) {
      if(b.alive) {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(b.x, b.y, b.w, 4);
      }
    }

    if(isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 150, canvas.width, 120);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width/2, 200);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('Click to Try Again', canvas.width/2, 235);
    } else if(isWon) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 150, canvas.width, 120);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VICTORY!', canvas.width/2, 200);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('Click to Play Again', canvas.width/2, 235);
    }
  }

  resetGame();
  loop();
</script>
</body>
</html>`,

  'pong': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pong Classic</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New', monospace; }
  body { background:#030712; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; }
  .header { display:flex; justify-content:space-between; width:500px; max-width:95vw; margin-bottom:8px; font-size:18px; }
  canvas { background:#000; border:3px solid #334155; border-radius:8px; display:block; }
  .controls { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="header">
  <span style="color:#38bdf8">Player: <span id="p1">0</span></span>
  <span style="color:#f43f5e">CPU: <span id="p2">0</span></span>
</div>
<canvas id="c" width="500" height="340"></canvas>
<div class="controls">Move paddle with Mouse or W/S Keys. First to 7 wins!</div>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let p1 = { y: 130, w: 12, h: 75, score: 0 };
  let p2 = { y: 130, w: 12, h: 75, score: 0, speed: 3.8 };
  let ball = { x: 250, y: 170, vx: 4, vy: 3, r: 6 };

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    p1.y = e.clientY - rect.top - p1.h/2;
  });

  window.addEventListener('keydown', e => {
    if(e.code === 'KeyW' || e.code === 'ArrowUp') p1.y -= 25;
    if(e.code === 'KeyS' || e.code === 'ArrowDown') p1.y += 25;
  });

  function resetBall() {
    ball.x = 250;
    ball.y = 170;
    ball.vx = (Math.random() < 0.5 ? 4 : -4);
    ball.vy = (Math.random() * 4 - 2);
  }

  function loop() {
    // Player bounds
    p1.y = Math.max(0, Math.min(canvas.height - p1.h, p1.y));
    
    // AI paddle
    const targetY = ball.y - p2.h/2;
    p2.y += (targetY - p2.y) * 0.085;
    p2.y = Math.max(0, Math.min(canvas.height - p2.h, p2.y));

    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    if(ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) ball.vy = -ball.vy;

    // Paddle 1 Collision
    if(ball.x - ball.r <= 20 + p1.w && ball.y >= p1.y && ball.y <= p1.y + p1.h) {
      ball.vx = Math.abs(ball.vx) * 1.05;
      ball.vy = (ball.y - (p1.y + p1.h/2)) * 0.15;
    }
    // Paddle 2 Collision
    if(ball.x + ball.r >= canvas.width - 20 - p2.w && ball.y >= p2.y && ball.y <= p2.y + p2.h) {
      ball.vx = -Math.abs(ball.vx) * 1.05;
      ball.vy = (ball.y - (p2.y + p2.h/2)) * 0.15;
    }

    // Scoring
    if(ball.x < 0) {
      p2.score++;
      document.getElementById('p2').innerText = p2.score;
      resetBall();
    } else if(ball.x > canvas.width) {
      p1.score++;
      document.getElementById('p1').innerText = p1.score;
      resetBall();
    }

    // Draw
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center dotted line
    ctx.strokeStyle = '#334155';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0); ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(20, p1.y, p1.w, p1.h);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(canvas.width - 20 - p2.w, p2.y, p2.w, p2.h);

    // Ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fill();

    requestAnimationFrame(loop);
  }

  loop();
</script>
</body>
</html>`,

  'minesweeper': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Minesweeper</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; user-select:none; }
  body { background:#0f172a; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:10px; }
  .box { background:#1e293b; padding:14px; border-radius:10px; border:2px solid #334155; box-shadow:0 8px 25px rgba(0,0,0,0.5); }
  .top-bar { display:flex; justify-content:space-between; align-items:center; background:#0f172a; padding:8px 14px; border-radius:6px; margin-bottom:12px; border:1px solid #334155; }
  .stat { font-family:'Courier New', monospace; font-size:22px; font-weight:bold; color:#ef4444; background:#000; padding:2px 8px; border-radius:4px; }
  .face-btn { font-size:24px; background:#334155; border:none; border-radius:6px; cursor:pointer; padding:2px 8px; }
  #board { display:grid; grid-template-columns:repeat(9, 32px); gap:3px; }
  .cell { width:32px; height:32px; background:#475569; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:15px; cursor:pointer; }
  .cell:hover { background:#64748b; }
  .cell.revealed { background:#0f172a; cursor:default; }
  .cell[data-n="1"] { color:#38bdf8; }
  .cell[data-n="2"] { color:#22c55e; }
  .cell[data-n="3"] { color:#ef4444; }
  .cell[data-n="4"] { color:#818cf8; }
  .cell[data-n="5"] { color:#f59e0b; }
  .cell.mine { background:#dc2626; color:#fff; }
  .instructions { margin-top:10px; font-size:12px; color:#94a3b8; text-align:center; }
</style>
</head>
<body>
<div class="box">
  <div class="top-bar">
    <div class="stat" id="mine-count">010</div>
    <button class="face-btn" id="face" onclick="initGame()">🙂</button>
    <div class="stat" id="timer">000</div>
  </div>
  <div id="board"></div>
</div>
<div class="instructions">Left click to reveal | Right click or long press to flag 🚩</div>
<script>
  const ROWS = 9, COLS = 9, MINES = 10;
  let grid = [], revealed = [], flags = [];
  let gameOver = false, timer = 0, timerId = null, started = false;

  function initGame() {
    gameOver = false; started = false; timer = 0;
    clearInterval(timerId);
    document.getElementById('timer').innerText = '000';
    document.getElementById('mine-count').innerText = String(MINES).padStart(3, '0');
    document.getElementById('face').innerText = '🙂';

    grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    revealed = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    flags = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));

    // Place mines
    let placed = 0;
    while(placed < MINES) {
      let r = Math.floor(Math.random() * ROWS);
      let c = Math.floor(Math.random() * COLS);
      if(grid[r][c] !== 'M') {
        grid[r][c] = 'M';
        placed++;
      }
    }

    // Numbers
    for(let r=0; r<ROWS; r++) {
      for(let c=0; c<COLS; c++) {
        if(grid[r][c] === 'M') continue;
        let count = 0;
        for(let dr=-1; dr<=1; dr++) {
          for(let dc=-1; dc<=1; dc++) {
            if(r+dr >= 0 && r+dr < ROWS && c+dc >= 0 && c+dc < COLS && grid[r+dr][c+dc] === 'M') count++;
          }
        }
        grid[r][c] = count;
      }
    }
    render();
  }

  function render() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for(let r=0; r<ROWS; r++) {
      for(let c=0; c<COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell' + (revealed[r][c] ? ' revealed' : '');
        if(revealed[r][c]) {
          if(grid[r][c] === 'M') {
            cell.className += ' mine';
            cell.innerText = '💣';
          } else if(grid[r][c] > 0) {
            cell.innerText = grid[r][c];
            cell.setAttribute('data-n', grid[r][c]);
          }
        } else if(flags[r][c]) {
          cell.innerText = '🚩';
        }

        cell.addEventListener('click', () => handleClick(r, c));
        cell.addEventListener('contextmenu', e => { e.preventDefault(); handleRightClick(r, c); });
        board.appendChild(cell);
      }
    }
  }

  function handleClick(r, c) {
    if(gameOver || flags[r][c] || revealed[r][c]) return;
    if(!started) {
      started = true;
      timerId = setInterval(() => {
        timer++;
        document.getElementById('timer').innerText = String(Math.min(999, timer)).padStart(3, '0');
      }, 1000);
    }

    if(grid[r][c] === 'M') {
      gameOver = true;
      clearInterval(timerId);
      document.getElementById('face').innerText = '😵';
      for(let i=0; i<ROWS; i++) {
        for(let j=0; j<COLS; j++) {
          if(grid[i][j] === 'M') revealed[i][j] = true;
        }
      }
      render();
      return;
    }

    reveal(r, c);
    render();
    checkWin();
  }

  function reveal(r, c) {
    if(r < 0 || r >= ROWS || c < 0 || c >= COLS || revealed[r][c] || flags[r][c]) return;
    revealed[r][c] = true;
    if(grid[r][c] === 0) {
      for(let dr=-1; dr<=1; dr++) {
        for(let dc=-1; dc<=1; dc++) reveal(r+dr, c+dc);
      }
    }
  }

  function handleRightClick(r, c) {
    if(gameOver || revealed[r][c]) return;
    flags[r][c] = !flags[r][c];
    let flagCount = flags.flat().filter(Boolean).length;
    document.getElementById('mine-count').innerText = String(Math.max(0, MINES - flagCount)).padStart(3, '0');
    render();
  }

  function checkWin() {
    let unrevealedSafe = 0;
    for(let r=0; r<ROWS; r++) {
      for(let c=0; c<COLS; c++) {
        if(!revealed[r][c] && grid[r][c] !== 'M') unrevealedSafe++;
      }
    }
    if(unrevealedSafe === 0) {
      gameOver = true;
      clearInterval(timerId);
      document.getElementById('face').innerText = '😎';
    }
  }

  initGame();
</script>
</body>
</html>`,

  'space-invaders': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Space Invaders</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New', monospace; }
  body { background:#030712; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; }
  .header { display:flex; justify-content:space-between; width:440px; max-width:95vw; margin-bottom:8px; font-weight:bold; }
  canvas { background:#000; border:2px solid #a855f7; border-radius:8px; box-shadow:0 0 20px rgba(168,85,247,0.25); display:block; }
  .instructions { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="header">
  <span style="color:#a855f7">👾 SPACE INVADERS</span>
  <span>Score: <span id="score" style="color:#22c55e">0</span></span>
</div>
<canvas id="c" width="440" height="480"></canvas>
<div class="instructions">Arrow keys or A/D to move, Space to shoot lasers!</div>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let player = { x: 200, y: 440, w: 28, h: 16, speed: 5 };
  let bullets = [];
  let alienBullets = [];
  let aliens = [];
  let alienDir = 1, alienSpeed = 1, alienDrop = false;
  let score = 0, isGameOver = false, isWon = false;

  function initAliens() {
    aliens = [];
    for(let r=0; r<4; r++) {
      for(let c=0; c<8; c++) {
        aliens.push({ x: c * 44 + 40, y: r * 32 + 40, w: 24, h: 18, color: ['#f43f5e','#a855f7','#38bdf8','#22c55e'][r] });
      }
    }
  }

  let keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if(e.code === 'Space') {
      e.preventDefault();
      if(bullets.length < 3) bullets.push({ x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 10, vy: -7 });
    }
    if(isGameOver || isWon) { initAliens(); score = 0; isGameOver = false; isWon = false; }
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if(isGameOver || isWon) return;

    if(keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(10, player.x - player.speed);
    if(keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(canvas.width - player.w - 10, player.x + player.speed);

    // Bullets
    for(let i=bullets.length-1; i>=0; i--) {
      bullets[i].y += bullets[i].vy;
      if(bullets[i].y < 0) bullets.splice(i, 1);
    }

    // Alien bullets
    if(Math.random() < 0.03 && aliens.length > 0) {
      const shooter = aliens[Math.floor(Math.random() * aliens.length)];
      alienBullets.push({ x: shooter.x + shooter.w/2, y: shooter.y + shooter.h, w: 3, h: 8, vy: 4 });
    }
    for(let i=alienBullets.length-1; i>=0; i--) {
      const b = alienBullets[i];
      b.y += b.vy;
      if(b.x > player.x && b.x < player.x + player.w && b.y > player.y && b.y < player.y + player.h) {
        isGameOver = true;
      }
      if(b.y > canvas.height) alienBullets.splice(i, 1);
    }

    // Alien movement
    let changeDir = false;
    for(const a of aliens) {
      a.x += alienDir * alienSpeed;
      if(a.x + a.w > canvas.width - 15 || a.x < 15) changeDir = true;
      if(a.y + a.h >= player.y) isGameOver = true;
    }
    if(changeDir) {
      alienDir *= -1;
      for(const a of aliens) a.y += 14;
    }

    // Bullet-Alien collisions
    for(let bi=bullets.length-1; bi>=0; bi--) {
      const b = bullets[bi];
      for(let ai=aliens.length-1; ai>=0; ai--) {
        const a = aliens[ai];
        if(b.x > a.x && b.x < a.x + a.w && b.y > a.y && b.y < a.y + a.h) {
          aliens.splice(ai, 1);
          bullets.splice(bi, 1);
          score += 50;
          document.getElementById('score').innerText = score;
          break;
        }
      }
    }

    if(aliens.length === 0) isWon = true;
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars background
    ctx.fillStyle = '#fff';
    for(let i=0; i<15; i++) {
      ctx.fillRect((i * 67 + (score % 50)) % canvas.width, (i * 91) % canvas.height, 2, 2);
    }

    // Player
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(player.x, player.y + 6, player.w, player.h - 6);
    ctx.fillRect(player.x + player.w/2 - 3, player.y, 6, 6);

    // Bullets
    ctx.fillStyle = '#38bdf8';
    for(const b of bullets) ctx.fillRect(b.x, b.y, b.w, b.h);

    // Alien bullets
    ctx.fillStyle = '#ef4444';
    for(const b of alienBullets) ctx.fillRect(b.x, b.y, b.w, b.h);

    // Aliens
    for(const a of aliens) {
      ctx.fillStyle = a.color;
      ctx.fillRect(a.x, a.y, a.w, a.h);
      ctx.fillStyle = '#000';
      ctx.fillRect(a.x + 4, a.y + 4, 4, 4);
      ctx.fillRect(a.x + a.w - 8, a.y + 4, 4, 4);
    }

    if(isGameOver) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width/2, 240);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('Press any key to retry', canvas.width/2, 275);
    } else if(isWon) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EARTH SAVED!', canvas.width/2, 240);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('Press any key for next round', canvas.width/2, 275);
    }
  }

  initAliens();
  loop();
</script>
</body>
</html>`,

  'tower-stack': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tower Stack</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; }
  body { background:#0a0f1d; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .header { display:flex; justify-content:space-between; width:340px; max-width:95vw; margin-bottom:8px; font-weight:bold; }
  canvas { background:#030712; border:2px solid #6366f1; border-radius:10px; display:block; box-shadow:0 0 25px rgba(99,102,241,0.25); cursor:pointer; }
  .instructions { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="header">
  <span style="color:#6366f1">🏙️ TOWER STACK</span>
  <span>Score: <span id="score" style="color:#38bdf8">0</span> | Best: <span id="best" style="color:#facc15">0</span></span>
</div>
<canvas id="c" width="340" height="460"></canvas>
<div class="instructions">Click or press Space to place block precisely on top!</div>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const BLOCK_HEIGHT = 20;
  let stack = [];
  let current = null;
  let score = 0, best = parseInt(localStorage.getItem('stack_best') || '0');
  let speed = 2.8, dir = 1;
  let isGameOver = false;
  let cameraOffset = 0;
  document.getElementById('best').innerText = best;

  function getColor(index) {
    const hue = (index * 14) % 360;
    return 'hsl(' + hue + ', 85%, 60%)';
  }

  function initGame() {
    stack = [
      { x: 70, y: canvas.height - BLOCK_HEIGHT, w: 200, color: getColor(0) }
    ];
    score = 0;
    speed = 2.8;
    cameraOffset = 0;
    isGameOver = false;
    document.getElementById('score').innerText = '0';
    spawnBlock();
  }

  function spawnBlock() {
    const prev = stack[stack.length - 1];
    current = {
      x: 0,
      y: prev.y - BLOCK_HEIGHT,
      w: prev.w,
      color: getColor(stack.length)
    };
    dir = 1;
  }

  function placeBlock() {
    if(isGameOver) { initGame(); return; }
    const prev = stack[stack.length - 1];
    const diff = current.x - prev.x;

    if(Math.abs(diff) >= current.w) {
      isGameOver = true;
      if(score > best) {
        best = score;
        localStorage.setItem('stack_best', best);
        document.getElementById('best').innerText = best;
      }
      return;
    }

    // Trim overhang
    if(diff > 0) {
      current.w -= diff;
    } else {
      current.w += diff;
      current.x = prev.x;
    }

    // Perfect bonus
    if(Math.abs(diff) < 3) {
      current.x = prev.x;
      current.w = prev.w;
    }

    stack.push(current);
    score++;
    document.getElementById('score').innerText = score;
    speed = Math.min(6.5, speed + 0.12);

    if(stack.length > 8) {
      cameraOffset += BLOCK_HEIGHT;
    }
    spawnBlock();
  }

  window.addEventListener('keydown', e => { if(e.code === 'Space') { e.preventDefault(); placeBlock(); } });
  canvas.addEventListener('click', placeBlock);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); placeBlock(); });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if(isGameOver) return;
    current.x += speed * dir;
    if(current.x + current.w >= canvas.width) {
      current.x = canvas.width - current.w;
      dir = -1;
    } else if(current.x <= 0) {
      current.x = 0;
      dir = 1;
    }
  }

  function draw() {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(0, cameraOffset);

    // Draw stack
    for(const b of stack) {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, BLOCK_HEIGHT);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(b.x, b.y, b.w, 3);
    }

    // Draw current block
    if(current && !isGameOver) {
      ctx.fillStyle = current.color;
      ctx.fillRect(current.x, current.y, current.w, BLOCK_HEIGHT);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(current.x, current.y, current.w, 3);
    }

    ctx.restore();

    if(isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, 160, canvas.width, 130);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width/2, 210);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Final Score: ' + score, canvas.width/2, 240);
      ctx.fillStyle = '#6366f1';
      ctx.fillText('Tap to Play Again', canvas.width/2, 268);
    }
  }

  initGame();
  loop();
</script>
</body>
</html>`,

  'asteroids': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Asteroids Retro</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New', monospace; }
  body { background:#030712; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; }
  .header { display:flex; justify-content:space-between; width:480px; max-width:95vw; margin-bottom:8px; font-weight:bold; }
  canvas { background:#000; border:2px solid #38bdf8; border-radius:8px; display:block; }
  .instructions { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="header">
  <span style="color:#38bdf8">🚀 ASTEROIDS</span>
  <span>Score: <span id="score" style="color:#22c55e">0</span></span>
</div>
<canvas id="c" width="480" height="420"></canvas>
<div class="instructions">Arrow Left/Right = Rotate, Up = Thrust, Space = Fire Lasers</div>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let ship = { x: 240, y: 210, r: 12, a: 0, rot: 0, thrust: false, vx: 0, vy: 0 };
  let lasers = [];
  let roids = [];
  let score = 0, isGameOver = false;

  function createAsteroid(x, y, r) {
    return {
      x: x || Math.random() * canvas.width,
      y: y || Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (r === 35 ? 1.5 : 2.5),
      vy: (Math.random() - 0.5) * (r === 35 ? 1.5 : 2.5),
      r: r || 35,
      vert: 10,
      offs: Array(10).fill(0).map(() => Math.random() * 0.4 + 0.8)
    };
  }

  function initGame() {
    ship.x = 240; ship.y = 210; ship.a = -Math.PI/2; ship.vx = 0; ship.vy = 0;
    lasers = [];
    roids = [createAsteroid(), createAsteroid(), createAsteroid(), createAsteroid()];
    score = 0; isGameOver = false;
    document.getElementById('score').innerText = '0';
  }

  let keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if(e.code === 'Space') {
      e.preventDefault();
      if(!isGameOver && lasers.length < 5) {
        lasers.push({
          x: ship.x + Math.cos(ship.a) * ship.r,
          y: ship.y + Math.sin(ship.a) * ship.r,
          vx: Math.cos(ship.a) * 7 + ship.vx,
          vy: Math.sin(ship.a) * 7 + ship.vy,
          life: 45
        });
      }
    }
    if(isGameOver && e.code === 'Space') initGame();
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if(isGameOver) return;

    // Ship Rotation
    if(keys['ArrowLeft'] || keys['KeyA']) ship.a -= 0.08;
    if(keys['ArrowRight'] || keys['KeyD']) ship.a += 0.08;

    // Thrust
    ship.thrust = keys['ArrowUp'] || keys['KeyW'];
    if(ship.thrust) {
      ship.vx += Math.cos(ship.a) * 0.15;
      ship.vy += Math.sin(ship.a) * 0.15;
    } else {
      ship.vx *= 0.985;
      ship.vy *= 0.985;
    }

    ship.x += ship.vx;
    ship.y += ship.vy;

    // Screen wrap ship
    if(ship.x < 0) ship.x = canvas.width;
    else if(ship.x > canvas.width) ship.x = 0;
    if(ship.y < 0) ship.y = canvas.height;
    else if(ship.y > canvas.height) ship.y = 0;

    // Lasers
    for(let i=lasers.length-1; i>=0; i--) {
      const l = lasers[i];
      l.x += l.vx;
      l.y += l.vy;
      l.life--;
      if(l.x < 0) l.x = canvas.width; else if(l.x > canvas.width) l.x = 0;
      if(l.y < 0) l.y = canvas.height; else if(l.y > canvas.height) l.y = 0;
      if(l.life <= 0) lasers.splice(i, 1);
    }

    // Asteroids
    for(let i=roids.length-1; i>=0; i--) {
      const r = roids[i];
      r.x += r.vx;
      r.y += r.vy;
      if(r.x < -r.r) r.x = canvas.width + r.r; else if(r.x > canvas.width + r.r) r.x = -r.r;
      if(r.y < -r.r) r.y = canvas.height + r.r; else if(r.y > canvas.height + r.r) r.y = -r.r;

      // Ship collision
      const dist = Math.hypot(ship.x - r.x, ship.y - r.y);
      if(dist < ship.r + r.r) {
        isGameOver = true;
      }

      // Laser collision
      for(let li=lasers.length-1; li>=0; li--) {
        const l = lasers[li];
        if(Math.hypot(l.x - r.x, l.y - r.y) < r.r) {
          lasers.splice(li, 1);
          score += (r.r > 25 ? 20 : 50);
          document.getElementById('score').innerText = score;
          if(r.r > 20) {
            roids.push(createAsteroid(r.x, r.y, r.r / 2));
            roids.push(createAsteroid(r.x, r.y, r.r / 2));
          }
          roids.splice(i, 1);
          break;
        }
      }
    }

    if(roids.length < 3) {
      roids.push(createAsteroid());
    }
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ship
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.a);
    ctx.beginPath();
    ctx.moveTo(ship.r, 0);
    ctx.lineTo(-ship.r, -ship.r * 0.7);
    ctx.lineTo(-ship.r * 0.5, 0);
    ctx.lineTo(-ship.r, ship.r * 0.7);
    ctx.closePath();
    ctx.stroke();

    if(ship.thrust) {
      ctx.strokeStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-ship.r * 0.6, -4);
      ctx.lineTo(-ship.r * 1.5, 0);
      ctx.lineTo(-ship.r * 0.6, 4);
      ctx.stroke();
    }
    ctx.restore();

    // Lasers
    ctx.fillStyle = '#22c55e';
    for(const l of lasers) {
      ctx.beginPath();
      ctx.arc(l.x, l.y, 2.5, 0, Math.PI*2);
      ctx.fill();
    }

    // Asteroids
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    for(const r of roids) {
      ctx.beginPath();
      for(let j=0; j<r.vert; j++) {
        const ang = (j / r.vert) * Math.PI * 2;
        const rad = r.r * r.offs[j];
        const x = r.x + Math.cos(ang) * rad;
        const y = r.y + Math.sin(ang) * rad;
        if(j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    if(isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 150, canvas.width, 120);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CRASHED!', canvas.width/2, 200);
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText('Press Space to Restart', canvas.width/2, 235);
    }
  }

  initGame();
  loop();
</script>
</body>
</html>`,

  'connect4': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Connect Four</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; }
  body { background:#0f172a; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:10px; }
  .header { display:flex; justify-content:space-between; align-items:center; width:380px; max-width:95vw; margin-bottom:12px; }
  .title { font-size:24px; font-weight:bold; color:#38bdf8; }
  .board { background:#1e3a8a; padding:12px; border-radius:14px; border:3px solid #3b82f6; display:grid; grid-template-columns:repeat(7, 1fr); gap:8px; width:380px; max-width:95vw; box-shadow:0 10px 30px rgba(0,0,0,0.5); }
  .slot { aspect-ratio:1; background:#0f172a; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:transform 0.15s; }
  .slot:hover { transform:scale(1.04); }
  .slot.p1 { background:#ef4444; box-shadow:inset 0 0 10px rgba(0,0,0,0.4); }
  .slot.p2 { background:#facc15; box-shadow:inset 0 0 10px rgba(0,0,0,0.4); }
  .status { margin-top:14px; font-size:16px; font-weight:bold; }
  .btn { margin-top:10px; background:#3b82f6; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-weight:bold; cursor:pointer; }
</style>
</head>
<body>
<div class="header">
  <div class="title">CONNECT 4</div>
  <button class="btn" onclick="initGame()">Reset</button>
</div>
<div class="board" id="board"></div>
<div class="status" id="status">Your Turn (🔴 Red)</div>
<script>
  const ROWS = 6, COLS = 7;
  let grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  let currentPlayer = 1; // 1 = Red (Player), 2 = Yellow (CPU)
  let isGameOver = false;

  function initGame() {
    grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    currentPlayer = 1;
    isGameOver = false;
    document.getElementById('status').innerText = 'Your Turn (🔴 Red)';
    render();
  }

  function render() {
    const b = document.getElementById('board');
    b.innerHTML = '';
    for(let r=0; r<ROWS; r++) {
      for(let c=0; c<COLS; c++) {
        const slot = document.createElement('div');
        slot.className = 'slot' + (grid[r][c] === 1 ? ' p1' : grid[r][c] === 2 ? ' p2' : '');
        slot.addEventListener('click', () => makeMove(c));
        b.appendChild(slot);
      }
    }
  }

  function makeMove(c) {
    if(isGameOver || currentPlayer !== 1) return;
    for(let r=ROWS-1; r>=0; r--) {
      if(grid[r][c] === 0) {
        grid[r][c] = 1;
        render();
        if(checkWin(1)) {
          document.getElementById('status').innerText = '🎉 You Won!';
          isGameOver = true;
          return;
        }
        currentPlayer = 2;
        document.getElementById('status').innerText = 'CPU Thinking... (🟡 Yellow)';
        setTimeout(cpuMove, 400);
        return;
      }
    }
  }

  function cpuMove() {
    if(isGameOver) return;
    // Check if CPU can win in 1 move
    for(let c=0; c<COLS; c++) {
      for(let r=ROWS-1; r>=0; r--) {
        if(grid[r][c] === 0) {
          grid[r][c] = 2;
          if(checkWin(2)) { render(); document.getElementById('status').innerText = 'CPU Won! 🟡'; isGameOver = true; return; }
          grid[r][c] = 0;
          break;
        }
      }
    }
    // Block Player win in 1 move
    for(let c=0; c<COLS; c++) {
      for(let r=ROWS-1; r>=0; r--) {
        if(grid[r][c] === 0) {
          grid[r][c] = 1;
          if(checkWin(1)) { grid[r][c] = 2; render(); currentPlayer = 1; document.getElementById('status').innerText = 'Your Turn (🔴 Red)'; return; }
          grid[r][c] = 0;
          break;
        }
      }
    }
    // Fallback: pick valid center-weighted column
    const valid = [];
    for(let c=0; c<COLS; c++) if(grid[0][c] === 0) valid.push(c);
    if(valid.length === 0) { document.getElementById('status').innerText = "It's a Draw!"; isGameOver = true; return; }
    valid.sort((a,b) => Math.abs(3-a) - Math.abs(3-b));
    const chosenCol = valid[Math.random() < 0.6 ? 0 : Math.floor(Math.random()*valid.length)];

    for(let r=ROWS-1; r>=0; r--) {
      if(grid[r][chosenCol] === 0) {
        grid[r][chosenCol] = 2;
        break;
      }
    }
    render();
    if(checkWin(2)) {
      document.getElementById('status').innerText = 'CPU Won! 🟡';
      isGameOver = true;
      return;
    }
    currentPlayer = 1;
    document.getElementById('status').innerText = 'Your Turn (🔴 Red)';
  }

  function checkWin(p) {
    // Horizontal
    for(let r=0; r<ROWS; r++) {
      for(let c=0; c<=COLS-4; c++) {
        if(grid[r][c]===p && grid[r][c+1]===p && grid[r][c+2]===p && grid[r][c+3]===p) return true;
      }
    }
    // Vertical
    for(let r=0; r<=ROWS-4; r++) {
      for(let c=0; c<COLS; c++) {
        if(grid[r][c]===p && grid[r+1][c]===p && grid[r+2][c]===p && grid[r+3][c]===p) return true;
      }
    }
    // Diagonal down-right
    for(let r=0; r<=ROWS-4; r++) {
      for(let c=0; c<=COLS-4; c++) {
        if(grid[r][c]===p && grid[r+1][c+1]===p && grid[r+2][c+2]===p && grid[r+3][c+3]===p) return true;
      }
    }
    // Diagonal up-right
    for(let r=3; r<ROWS; r++) {
      for(let c=0; c<=COLS-4; c++) {
        if(grid[r][c]===p && grid[r-1][c+1]===p && grid[r-2][c+2]===p && grid[r-3][c+3]===p) return true;
      }
    }
    return false;
  }

  initGame();
</script>
</body>
</html>`,

  'tictactoe': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tic Tac Toe Master</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; }
  body { background:#0f172a; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:10px; }
  .box { background:#1e293b; padding:20px; border-radius:14px; border:2px solid #334155; box-shadow:0 8px 30px rgba(0,0,0,0.5); text-align:center; }
  .grid { display:grid; grid-template-columns:repeat(3, 85px); gap:8px; margin:16px auto; }
  .cell { width:85px; height:85px; background:#0f172a; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:38px; font-weight:800; cursor:pointer; border:1px solid #334155; transition:0.15s; }
  .cell:hover { background:#1e293b; border-color:#38bdf8; }
  .cell[data-v="X"] { color:#38bdf8; }
  .cell[data-v="O"] { color:#f43f5e; }
  .status { font-size:16px; font-weight:bold; margin-bottom:8px; min-height:24px; color:#e2e8f0; }
  .btn { background:#3b82f6; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-weight:bold; cursor:pointer; }
</style>
</head>
<body>
<div class="box">
  <h2 style="color:#38bdf8;margin-bottom:4px;">TIC-TAC-TOE</h2>
  <div class="status" id="status">You play as ❌ (AI is ⭕)</div>
  <div class="grid" id="grid"></div>
  <button class="btn" onclick="init()">Restart Match</button>
</div>
<script>
  let b = Array(9).fill('');
  let gameOver = false;

  function init() {
    b = Array(9).fill('');
    gameOver = false;
    document.getElementById('status').innerText = 'You play as ❌ (AI is ⭕)';
    render();
  }

  function render() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for(let i=0; i<9; i++) {
      const c = document.createElement('div');
      c.className = 'cell';
      c.innerText = b[i];
      if(b[i]) c.setAttribute('data-v', b[i]);
      c.addEventListener('click', () => userMove(i));
      grid.appendChild(c);
    }
  }

  function userMove(i) {
    if(b[i] !== '' || gameOver) return;
    b[i] = 'X';
    render();
    if(check(b, 'X')) {
      document.getElementById('status').innerText = '🎉 You Won!';
      gameOver = true;
      return;
    }
    if(!b.includes('')) {
      document.getElementById('status').innerText = "It's a Tie!";
      gameOver = true;
      return;
    }
    document.getElementById('status').innerText = 'AI Thinking...';
    setTimeout(aiMove, 250);
  }

  function aiMove() {
    if(gameOver) return;
    const best = minimax(b, 'O');
    b[best.index] = 'O';
    render();
    if(check(b, 'O')) {
      document.getElementById('status').innerText = '⭕ AI Won!';
      gameOver = true;
      return;
    }
    if(!b.includes('')) {
      document.getElementById('status').innerText = "It's a Tie!";
      gameOver = true;
      return;
    }
    document.getElementById('status').innerText = 'Your Turn (❌)';
  }

  function check(board, p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(w => w.every(idx => board[idx] === p));
  }

  function minimax(newBoard, player) {
    const avail = newBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    if(check(newBoard, 'X')) return { score: -10 };
    if(check(newBoard, 'O')) return { score: 10 };
    if(avail.length === 0) return { score: 0 };

    const moves = [];
    for(let i=0; i<avail.length; i++) {
      const idx = avail[i];
      newBoard[idx] = player;
      const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
      moves.push({ index: idx, score: result.score });
      newBoard[idx] = '';
    }

    if(player === 'O') {
      let bestScore = -10000;
      let bestMove = 0;
      for(let i=0; i<moves.length; i++) {
        if(moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
      return moves[bestMove];
    } else {
      let bestScore = 10000;
      let bestMove = 0;
      for(let i=0; i<moves.length; i++) {
        if(moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
      return moves[bestMove];
    }
  }

  init();
</script>
</body>
</html>`
};



/**
 * Creates a valid data:text/html URI from raw HTML code.
 */
export function createDataUri(html) {
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
}
