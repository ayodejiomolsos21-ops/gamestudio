/**
 * Standalone, robust HTML5 games that run self-contained inside iframes.
 * They have zero external dependencies and use pure HTML, CSS, and JS with Canvas and Web Audio API.
 */

export function createDataUri(html) {
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
}

// Universal Web Audio sound synthesizer helper snippet to inject into games
const audioSynthScript = `
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const t = audioCtx.currentTime;
    
    if (type === 'jump') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.15);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    } else if (type === 'hit' || type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.12);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === 'coin' || type === 'score') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(880, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    } else if (type === 'explode') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    } else if (type === 'beat') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.06);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }
`;

export const standaloneGameHtml = {
  // 1. A Dance of Fire and Ice (Rhythm Orbiting Spheres)
  'a-dance-of-fire-and-ice': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>A Dance of Fire and Ice</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', system-ui, sans-serif; user-select:none; }
  body { background:#070913; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  #canvas-container { position:relative; width:650px; max-width:96vw; height:450px; background:radial-gradient(circle at center, #111827 0%, #030712 100%); border-radius:16px; border:2px solid #06b6d4; box-shadow:0 0 35px rgba(6,182,212,0.25); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; }
  .hud { position:absolute; top:16px; left:20px; right:20px; display:flex; justify-content:space-between; align-items:center; pointer-events:none; }
  .title-badge { font-size:18px; font-weight:800; letter-spacing:1.5px; color:#38bdf8; text-shadow:0 0 10px rgba(56,189,248,0.5); }
  .stats { display:flex; gap:16px; font-weight:bold; font-size:15px; }
  .combo-badge { color:#f43f5e; font-size:16px; }
  .center-prompt { position:absolute; bottom:24px; left:50%; transform:translateX(-50%); font-size:14px; color:#94a3b8; letter-spacing:1px; background:rgba(15,23,42,0.75); padding:6px 18px; border-radius:20px; border:1px solid #1e293b; pointer-events:none; }
  .feedback { position:absolute; font-size:24px; font-weight:900; pointer-events:none; transition:transform 0.3s, opacity 0.3s; opacity:0; }
</style>
</head>
<body>
<div id="canvas-container">
  <canvas id="c" width="650" height="450"></canvas>
  <div class="hud">
    <div class="title-badge">🔥 A DANCE OF FIRE & ICE ❄️</div>
    <div class="stats">
      <div>SCORE: <span id="score" style="color:#22c55e">0</span></div>
      <div class="combo-badge">COMBO: <span id="combo">0x</span></div>
    </div>
  </div>
  <div class="center-prompt">Press <b style="color:#38bdf8">SPACEBAR</b> or <b style="color:#f43f5e">CLICK</b> exactly as planets align with path!</div>
  <div id="feedback" class="feedback">PERFECT!</div>
</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const comboEl = document.getElementById('combo');
  const fbEl = document.getElementById('feedback');

  // Track nodes (Grid of steps)
  let path = [];
  let currentStep = 0;
  let angle = 0;
  let speed = 0.055;
  let pivotPlanet = 0; // 0 = Fire is stationary/pivot, Ice rotates; 1 = Ice is pivot, Fire rotates
  let score = 0, combo = 0, maxCombo = 0;
  let gameOver = false;
  let particles = [];

  function generatePath() {
    path = [];
    let x = 120, y = 225;
    path.push({ x, y, dir: 'R' });
    const dirs = ['R', 'R', 'D', 'R', 'U', 'R', 'R', 'D', 'D', 'R', 'U', 'U', 'R', 'R', 'R', 'D', 'R'];
    for (let i = 0; i < 40; i++) {
      const d = dirs[i % dirs.length];
      if (d === 'R') x += 55;
      else if (d === 'D') y += 55;
      else if (d === 'U') y -= 55;
      path.push({ x, y, dir: d });
    }
  }

  function reset() {
    generatePath();
    currentStep = 0;
    angle = 0;
    pivotPlanet = 0;
    score = 0;
    combo = 0;
    gameOver = false;
    particles = [];
    scoreEl.innerText = '0';
    comboEl.innerText = '0x';
  }

  function showFeedback(txt, color) {
    fbEl.innerText = txt;
    fbEl.style.color = color;
    fbEl.style.left = '50%';
    fbEl.style.top = '40%';
    fbEl.style.transform = 'translate(-50%, -50%) scale(1.3)';
    fbEl.style.opacity = '1';
    setTimeout(() => {
      fbEl.style.transform = 'translate(-50%, -70%) scale(1)';
      fbEl.style.opacity = '0';
    }, 250);
  }

  function triggerHit() {
    if (gameOver) { reset(); return; }
    const nextNode = path[currentStep + 1];
    if (!nextNode) {
      showFeedback('LEVEL CLEARED! 🌟', '#22c55e');
      playSound('coin');
      setTimeout(reset, 1500);
      return;
    }

    const pivotNode = path[currentStep];
    // Calculate expected angle to next node
    const targetAngle = Math.atan2(nextNode.y - pivotNode.y, nextNode.x - pivotNode.x);
    // Normalize angles
    let diff = Math.abs((angle % (Math.PI * 2)) - (targetAngle % (Math.PI * 2)));
    if (diff > Math.PI) diff = Math.PI * 2 - diff;

    if (diff < 0.45) {
      // Perfect timing!
      combo++;
      score += 100 * combo;
      playSound('beat');
      showFeedback(diff < 0.2 ? 'PERFECT! 🎯' : 'GREAT! 👍', '#38bdf8');
      
      // Spawn particles
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: nextNode.x,
          y: nextNode.y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 25,
          color: pivotPlanet === 0 ? '#38bdf8' : '#f43f5e'
        });
      }

      currentStep++;
      pivotPlanet = pivotPlanet === 0 ? 1 : 0;
      angle = targetAngle;
    } else {
      // Miss
      combo = 0;
      playSound('hit');
      showFeedback('MISS! ❌', '#ef4444');
    }

    scoreEl.innerText = score;
    comboEl.innerText = combo + 'x';
  }

  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'KeyZ' || e.code === 'KeyX') {
      e.preventDefault();
      triggerHit();
    }
  });
  canvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    triggerHit();
  });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    angle += speed;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function draw() {
    ctx.fillStyle = '#070913';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cameraOffsetX = Math.max(0, path[currentStep].x - 200);

    ctx.save();
    ctx.translate(-cameraOffsetX, 0);

    // Draw path tiles
    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      const isPast = i <= currentStep;
      ctx.fillStyle = isPast ? '#1e293b' : '#334155';
      ctx.strokeStyle = isPast ? '#06b6d4' : '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(node.x - 20, node.y - 20, 40, 40, 8);
      ctx.fill();
      ctx.stroke();

      if (i === currentStep + 1) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }

    // Active pivot and rotating planet
    const pivot = path[currentStep];
    const orbDist = 55;
    const orbitingX = pivot.x + Math.cos(angle) * orbDist;
    const orbitingY = pivot.y + Math.sin(angle) * orbDist;

    // Draw Orbit Ring
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(pivot.x, pivot.y, orbDist, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Line connecting planets
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pivot.x, pivot.y);
    ctx.lineTo(orbitingX, orbitingY);
    ctx.stroke();

    // Planet 1: Fire (Red)
    const fireX = pivotPlanet === 0 ? pivot.x : orbitingX;
    const fireY = pivotPlanet === 0 ? pivot.y : orbitingY;
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(fireX, fireY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Planet 2: Ice (Cyan)
    const iceX = pivotPlanet === 1 ? pivot.x : orbitingX;
    const iceY = pivotPlanet === 1 ? pivot.y : orbitingY;
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(iceX, iceY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Particles
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.life / 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  reset();
  loop();
</script>
</body>
</html>`,

  // 2. Dadish (Retro Radish Platformer)
  'dadish': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dadish</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New', monospace; }
  body { background:#080c18; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .screen-wrap { position:relative; width:640px; max-width:96vw; height:420px; background:#1b2838; border-radius:12px; border:3px solid #f97316; box-shadow:0 0 30px rgba(249,115,22,0.3); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; background:#2d3748; }
  .hud { position:absolute; top:12px; left:16px; right:16px; display:flex; justify-content:space-between; font-weight:bold; font-size:14px; text-shadow:2px 2px #000; }
  .controls-bar { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="screen-wrap">
  <canvas id="c" width="640" height="420"></canvas>
  <div class="hud">
    <span style="color:#fbbf24">RADISH CHILDREN RESCUED: <span id="rescued">0 / 3</span></span>
    <span style="color:#38bdf8">LEVEL <span id="lvl">1</span></span>
  </div>
</div>
<div class="controls-bar">Use Arrow Keys / WASD to move & double jump! Rescue your radish kids!</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const rescuedEl = document.getElementById('rescued');
  const lvlEl = document.getElementById('lvl');

  let player = { x: 50, y: 300, vx: 0, vy: 0, w: 28, h: 32, jumps: 2, grounded: false, facing: 1 };
  let platforms = [
    { x: 0, y: 370, w: 640, h: 50 },
    { x: 120, y: 290, w: 100, h: 20 },
    { x: 280, y: 230, w: 110, h: 20 },
    { x: 440, y: 170, w: 120, h: 20 },
    { x: 220, y: 120, w: 120, h: 20 },
    { x: 50, y: 80, w: 90, h: 20 }
  ];
  let spikes = [
    { x: 230, y: 355, w: 40, h: 15 },
    { x: 400, y: 355, w: 50, h: 15 }
  ];
  let stars = [{ x: 160, y: 250, collected: false }, { x: 320, y: 190, collected: false }, { x: 490, y: 130, collected: false }];
  let babyRadish = { x: 80, y: 50, w: 20, h: 24, rescued: false };
  let rescuedCount = 0;
  let level = 1;
  let dialog = "Dadish: Hold on kids, daddy is coming!";
  let dialogTimer = 180;

  let keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && player.jumps > 0) {
      player.vy = -9.2;
      player.jumps--;
      playSound('jump');
    }
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function resetLevel() {
    player.x = 50; player.y = 300; player.vx = 0; player.vy = 0;
    babyRadish.rescued = false;
    stars.forEach(s => s.collected = false);
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if (keys['ArrowLeft'] || keys['KeyA']) { player.vx = -4.2; player.facing = -1; }
    else if (keys['ArrowRight'] || keys['KeyD']) { player.vx = 4.2; player.facing = 1; }
    else { player.vx *= 0.8; }

    player.vy += 0.48; // Gravity
    player.x += player.vx;
    player.y += player.vy;

    // Platform collisions
    player.grounded = false;
    for (const p of platforms) {
      if (player.x + player.w > p.x && player.x < p.x + p.w &&
          player.y + player.h >= p.y && player.y + player.h <= p.y + p.h + player.vy && player.vy >= 0) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.grounded = true;
        player.jumps = 2;
      }
    }

    // Spikes collision
    for (const s of spikes) {
      if (player.x + player.w > s.x && player.x < s.x + s.w && player.y + player.h > s.y && player.y < s.y + s.h) {
        playSound('hit');
        dialog = "Ouch! Watch out for sharp spikes!";
        dialogTimer = 120;
        resetLevel();
      }
    }

    // Collect stars
    for (const st of stars) {
      if (!st.collected && Math.hypot(player.x - st.x, player.y - st.y) < 25) {
        st.collected = true;
        playSound('coin');
      }
    }

    // Rescue baby radish
    if (!babyRadish.rescued && Math.hypot(player.x - babyRadish.x, player.y - babyRadish.y) < 30) {
      babyRadish.rescued = true;
      rescuedCount++;
      rescuedEl.innerText = rescuedCount + ' / 3';
      playSound('coin');
      dialog = "Baby Radish: Daddy! You found me!";
      dialogTimer = 180;
      setTimeout(() => {
        level++;
        lvlEl.innerText = level;
        resetLevel();
      }, 1500);
    }

    if (dialogTimer > 0) dialogTimer--;
    if (player.y > 450) resetLevel();
  }

  function draw() {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Platforms
    ctx.fillStyle = '#10b981';
    for (const p of platforms) {
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#059669';
      ctx.fillRect(p.x, p.y, p.w, 4);
      ctx.fillStyle = '#10b981';
    }

    // Spikes
    ctx.fillStyle = '#ef4444';
    for (const s of spikes) {
      for (let sx = s.x; sx < s.x + s.w; sx += 12) {
        ctx.beginPath();
        ctx.moveTo(sx, s.y + s.h);
        ctx.lineTo(sx + 6, s.y);
        ctx.lineTo(sx + 12, s.y + s.h);
        ctx.fill();
      }
    }

    // Stars
    for (const st of stars) {
      if (!st.collected) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(st.x, st.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Baby Radish
    if (!babyRadish.rescued) {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(babyRadish.x + 10, babyRadish.y + 14, 8, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e'; // Green leaf
      ctx.fillRect(babyRadish.x + 8, babyRadish.y + 2, 4, 6);
    }

    // Dadish Character
    ctx.save();
    ctx.translate(player.x + player.w/2, player.y + player.h/2);
    ctx.scale(player.facing, 1);
    // Radish body
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.ellipse(0, 2, 13, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Leaves
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-3, -16, 6, 8);
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(2, -2, 4, 4);
    ctx.fillStyle = '#000';
    ctx.fillRect(4, -2, 2, 2);
    // Mustache
    ctx.fillStyle = '#78350f';
    ctx.fillRect(1, 4, 8, 3);
    ctx.restore();

    // Dialog Box
    if (dialogTimer > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(40, 360, 560, 45);
      ctx.strokeStyle = '#f97316';
      ctx.strokeRect(40, 360, 560, 45);
      ctx.fillStyle = '#fff';
      ctx.font = '13px Courier New';
      ctx.fillText(dialog, 55, 388);
    }
  }

  loop();
</script>
</body>
</html>`,

  // 3. Among Us (Crewmate Spaceship Mini-Game)
  'among-us': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Among Us</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', sans-serif; user-select:none; }
  body { background:#030712; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .space-box { position:relative; width:650px; max-width:96vw; height:440px; background:#0b0f19; border-radius:14px; border:2px solid #ef4444; box-shadow:0 0 35px rgba(239,68,68,0.25); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; }
  .hud { position:absolute; top:12px; left:16px; right:16px; display:flex; justify-content:space-between; font-weight:bold; font-size:13px; pointer-events:none; }
  .task-bar { width:180px; height:14px; background:#1e293b; border-radius:7px; border:1px solid #475569; overflow:hidden; display:inline-block; vertical-align:middle; margin-left:6px; }
  .task-fill { width:0%; height:100%; background:#22c55e; transition:width 0.3s; }
  .controls { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="space-box">
  <canvas id="c" width="650" height="440"></canvas>
  <div class="hud">
    <div>TOTAL TASKS COMPLETED: <div class="task-bar"><div class="task-fill" id="task-progress"></div></div></div>
    <span style="color:#ef4444">IMPOSTORS NEARBY: <span id="impostor-warn">1</span></span>
  </div>
</div>
<div class="controls">WASD / Arrow Keys to walk. Press E or Space near yellow glowing Task Terminals to fix!</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const taskProgress = document.getElementById('task-progress');

  let crewmate = { x: 300, y: 220, vx: 0, vy: 0, speed: 3.8, color: '#06b6d4', facing: 1 };
  let impostor = { x: 100, y: 100, vx: 1.5, vy: 1.2, speed: 2.2, color: '#ef4444' };
  let tasks = [
    { x: 120, y: 120, label: 'Wiring Panel', done: false },
    { x: 520, y: 100, label: 'Shields Diverter', done: false },
    { x: 150, y: 340, label: 'Fuel Engine', done: false },
    { x: 500, y: 350, label: 'Download Data', done: false }
  ];
  let completed = 0;
  let gameAlert = "Welcome to The Skeld. Complete all 4 tasks!";
  let alertTimer = 180;

  let keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyE' || e.code === 'Space') {
      doNearbyTask();
    }
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function doNearbyTask() {
    for (const t of tasks) {
      if (!t.done && Math.hypot(crewmate.x - t.x, crewmate.y - t.y) < 45) {
        t.done = true;
        completed++;
        playSound('coin');
        taskProgress.style.width = (completed / tasks.length * 100) + '%';
        gameAlert = "Task Completed: " + t.label + "!";
        alertTimer = 120;
        if (completed === tasks.length) {
          gameAlert = "VICTORY! All Crewmate tasks completed!";
          alertTimer = 300;
        }
      }
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    crewmate.vx = 0; crewmate.vy = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) { crewmate.vx = -crewmate.speed; crewmate.facing = -1; }
    if (keys['ArrowRight'] || keys['KeyD']) { crewmate.vx = crewmate.speed; crewmate.facing = 1; }
    if (keys['ArrowUp'] || keys['KeyW']) crewmate.vy = -crewmate.speed;
    if (keys['ArrowDown'] || keys['KeyS']) crewmate.vy = crewmate.speed;

    crewmate.x = Math.max(30, Math.min(canvas.width - 30, crewmate.x + crewmate.vx));
    crewmate.y = Math.max(30, Math.min(canvas.height - 30, crewmate.y + crewmate.vy));

    // Impostor patrol AI
    const dx = crewmate.x - impostor.x;
    const dy = crewmate.y - impostor.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 200) {
      impostor.x += (dx / dist) * impostor.speed;
      impostor.y += (dy / dist) * impostor.speed;
    } else {
      impostor.x += impostor.vx;
      impostor.y += impostor.vy;
      if (impostor.x < 60 || impostor.x > canvas.width - 60) impostor.vx *= -1;
      if (impostor.y < 60 || impostor.y > canvas.height - 60) impostor.vy *= -1;
    }

    if (dist < 24) {
      playSound('explode');
      gameAlert = "DEAD BODY REPORTED! Impostor eliminated you!";
      alertTimer = 180;
      crewmate.x = 320;
      crewmate.y = 220;
    }

    if (alertTimer > 0) alertTimer--;
  }

  function drawCrewmate(x, y, color, facing) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    // Backpack
    ctx.fillStyle = color;
    ctx.fillRect(-16, -10, 8, 18);
    // Body
    ctx.beginPath();
    ctx.roundRect(-10, -18, 20, 32, 10);
    ctx.fill();
    // Legs
    ctx.fillRect(-10, 10, 8, 8);
    ctx.fillRect(2, 10, 8, 8);
    // Visor
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.roundRect(2, -12, 12, 10, 5);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Floor Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Task Terminals
    for (const t of tasks) {
      ctx.fillStyle = t.done ? '#10b981' : '#facc15';
      ctx.shadowBlur = t.done ? 5 : 15;
      ctx.shadowColor = t.done ? '#10b981' : '#facc15';
      ctx.fillRect(t.x - 12, t.y - 12, 24, 24);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.label, t.x, t.y + 24);
    }

    // Impostor
    drawCrewmate(impostor.x, impostor.y, impostor.color, impostor.vx >= 0 ? 1 : -1);

    // Player Crewmate
    drawCrewmate(crewmate.x, crewmate.y, crewmate.color, crewmate.facing);

    // Alert Banner
    if (alertTimer > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(50, canvas.height - 50, canvas.width - 100, 36);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(50, canvas.height - 50, canvas.width - 100, 36);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(gameAlert, canvas.width / 2, canvas.height - 27);
    }
  }

  loop();
</script>
</body>
</html>`,

  // 4. Angry Birds (Physics Slingshot Destruction)
  'angry-birds': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Angry Birds</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; user-select:none; }
  body { background:#070913; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .game-wrap { position:relative; width:680px; max-width:96vw; height:420px; background:linear-gradient(to bottom, #38bdf8 0%, #bae6fd 65%, #22c55e 65%, #15803d 100%); border-radius:14px; border:3px solid #ef4444; box-shadow:0 0 35px rgba(239,68,68,0.3); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; }
  .hud { position:absolute; top:12px; left:16px; right:16px; display:flex; justify-content:space-between; font-weight:bold; font-size:15px; color:#0f172a; text-shadow:1px 1px #fff; pointer-events:none; }
  .controls { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="game-wrap">
  <canvas id="c" width="680" height="420"></canvas>
  <div class="hud">
    <span>🎯 SCORE: <span id="score" style="color:#b91c1c">0</span></span>
    <span>PIGS REMAINING: <span id="pigs" style="color:#15803d">3</span></span>
  </div>
</div>
<div class="controls">Click & Drag backward on Red Bird in the Slingshot to aim, release to launch!</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const pigsEl = document.getElementById('pigs');

  const sling = { x: 120, y: 280 };
  let bird = { x: sling.x, y: sling.y, vx: 0, vy: 0, r: 16, launched: false, dragging: false };
  let blocks = [
    { x: 460, y: 230, w: 20, h: 80, hp: 100, color: '#b45309' },
    { x: 530, y: 230, w: 20, h: 80, hp: 100, color: '#b45309' },
    { x: 450, y: 210, w: 110, h: 20, hp: 80, color: '#b45309' },
    { x: 470, y: 150, w: 20, h: 60, hp: 80, color: '#78716c' },
    { x: 520, y: 150, w: 20, h: 60, hp: 80, color: '#78716c' },
    { x: 460, y: 130, w: 90, h: 20, hp: 60, color: '#78716c' }
  ];
  let pigs = [
    { x: 495, y: 290, r: 16, alive: true },
    { x: 495, y: 190, r: 14, alive: true },
    { x: 580, y: 290, r: 15, alive: true }
  ];
  let particles = [];
  let score = 0;

  function resetBird() {
    bird.x = sling.x;
    bird.y = sling.y;
    bird.vx = 0;
    bird.vy = 0;
    bird.launched = false;
    bird.dragging = false;
  }

  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (!bird.launched && Math.hypot(mx - bird.x, my - bird.y) < 35) {
      bird.dragging = true;
    }
  });

  window.addEventListener('mousemove', e => {
    if (bird.dragging) {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      const dx = mx - sling.x;
      const dy = my - sling.y;
      const dist = Math.min(80, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      bird.x = sling.x + Math.cos(angle) * dist;
      bird.y = sling.y + Math.sin(angle) * dist;
    }
  });

  window.addEventListener('mouseup', () => {
    if (bird.dragging) {
      bird.dragging = false;
      bird.launched = true;
      bird.vx = (sling.x - bird.x) * 0.24;
      bird.vy = (sling.y - bird.y) * 0.24;
      playSound('jump');
    }
  });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if (bird.launched) {
      bird.vy += 0.35; // Gravity
      bird.x += bird.vx;
      bird.y += bird.vy;

      // Check ground collision
      if (bird.y + bird.r >= 310) {
        bird.y = 310 - bird.r;
        bird.vx *= 0.6;
        bird.vy = -bird.vy * 0.4;
        if (Math.abs(bird.vx) < 0.2) setTimeout(resetBird, 1000);
      }

      // Check block collisions
      for (const b of blocks) {
        if (b.hp > 0 && bird.x + bird.r > b.x && bird.x - bird.r < b.x + b.w &&
            bird.y + bird.r > b.y && bird.y - bird.r < b.y + b.h) {
          b.hp -= 40;
          playSound('hit');
          score += 150;
          bird.vx *= 0.7;
        }
      }

      // Check pig collisions
      for (const p of pigs) {
        if (p.alive && Math.hypot(bird.x - p.x, bird.y - p.y) < bird.r + p.r) {
          p.alive = false;
          playSound('explode');
          score += 1000;
          for (let i = 0; i < 15; i++) {
            particles.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 30, color: '#22c55e' });
          }
        }
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }

    scoreEl.innerText = score;
    const remainingPigs = pigs.filter(p => p.alive).length;
    pigsEl.innerText = remainingPigs;

    if (remainingPigs === 0 && score > 0) {
      setTimeout(() => {
        pigs.forEach(p => p.alive = true);
        blocks.forEach(b => b.hp = 100);
        resetBird();
      }, 2000);
    }
  }

  function draw() {
    // Slingshot Back Rubber
    if (bird.dragging) {
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sling.x - 10, sling.y - 15);
      ctx.lineTo(bird.x, bird.y);
      ctx.stroke();
    }

    // Slingshot Frame
    ctx.fillStyle = '#78350f';
    ctx.fillRect(sling.x - 6, sling.y - 10, 12, 45);
    ctx.beginPath();
    ctx.arc(sling.x - 10, sling.y - 20, 6, 0, Math.PI * 2);
    ctx.arc(sling.x + 10, sling.y - 20, 6, 0, Math.PI * 2);
    ctx.fill();

    // Trajectory guide
    if (bird.dragging) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      let simX = bird.x, simY = bird.y;
      let simVx = (sling.x - bird.x) * 0.24, simVy = (sling.y - bird.y) * 0.24;
      for (let i = 0; i < 15; i++) {
        simVy += 0.35;
        simX += simVx;
        simY += simVy;
        ctx.beginPath();
        ctx.arc(simX, simY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Blocks
    for (const b of blocks) {
      if (b.hp > 0) {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      }
    }

    // Pigs
    for (const p of pigs) {
      if (p.alive) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // Snout
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 2, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x - 5, p.y - 4, 3, 0, Math.PI * 2);
        ctx.arc(p.x + 5, p.y - 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Red Bird
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(bird.x + 8, bird.y - 2);
    ctx.lineTo(bird.x + 18, bird.y + 2);
    ctx.lineTo(bird.x + 8, bird.y + 6);
    ctx.fill();
    // Eyes & Eyebrows
    ctx.fillStyle = '#000';
    ctx.fillRect(bird.x + 2, bird.y - 8, 8, 3);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(bird.x + 4, bird.y - 3, 3, 0, Math.PI * 2); ctx.fill();

    // Particles
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.life / 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  resetBird();
  loop();
</script>
</body>
</html>`,

  // 5. Doge Miner (Idle Dogecoin Mining Sim)
  'doge-miner': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Doge Miner</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Comic Sans MS', 'Chalkboard SE', sans-serif; user-select:none; }
  body { background:#0f172a; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .miner-box { position:relative; width:650px; max-width:96vw; height:440px; background:radial-gradient(circle, #78350f 0%, #1e1b4b 100%); border-radius:14px; border:3px solid #eab308; box-shadow:0 0 35px rgba(234,179,8,0.3); display:flex; overflow:hidden; }
  .mine-area { flex:1.2; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px; border-right:2px solid rgba(234,179,8,0.3); }
  .upgrades-area { flex:1; background:rgba(15,23,42,0.85); padding:14px; overflow-y:auto; }
  .doge-rock { width:150px; height:150px; background:#a855f7; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:70px; cursor:pointer; box-shadow:0 0 25px rgba(234,179,8,0.4); border:4px solid #facc15; transition:transform 0.08s; }
  .doge-rock:active { transform:scale(0.92); }
  .stats-header { text-align:center; margin-bottom:16px; }
  .doge-count { font-size:26px; font-weight:bold; color:#facc15; text-shadow:0 0 10px rgba(250,204,21,0.5); }
  .dps { font-size:13px; color:#38bdf8; font-weight:bold; }
  .upgrade-btn { width:100%; background:#1e293b; border:1px solid #eab308; border-radius:8px; padding:10px; margin-bottom:8px; color:#fff; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:background 0.2s; }
  .upgrade-btn:hover { background:#334155; }
  .float-text { position:absolute; font-weight:bold; font-size:18px; color:#facc15; pointer-events:none; animation:floatUp 0.8s forwards; text-shadow:0 0 6px #000; }
  @keyframes floatUp { 0% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(-50px); } }
</style>
</head>
<body>
<div class="miner-box" id="miner-container">
  <div class="mine-area">
    <div class="stats-header">
      <div class="doge-count">💰 <span id="dogecoins">0</span> DOGE</div>
      <div class="dps">+<span id="dps-val">0</span> Doge / Sec</div>
    </div>
    <div class="doge-rock" id="rock">🐕</div>
    <div style="font-size:12px;color:#94a3b8;margin-top:14px;">Click the Doge to Mine! Such Gold!</div>
  </div>
  <div class="upgrades-area">
    <h3 style="color:#facc15;font-size:15px;margin-bottom:10px;text-align:center;">🚀 MINING GEAR & HELPERS</h3>
    <div class="upgrade-btn" onclick="buyUpgrade('shiba')">
      <div><b>🐶 Shiba Helper</b><br><small style="color:#94a3b8">+1 Doge/s</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cost-shiba">15</span> D</div>
    </div>
    <div class="upgrade-btn" onclick="buyUpgrade('pickaxe')">
      <div><b>⛏️ Golden Pickaxe</b><br><small style="color:#94a3b8">+5 Doge/s</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cost-pickaxe">100</span> D</div>
    </div>
    <div class="upgrade-btn" onclick="buyUpgrade('miner_rig')">
      <div><b>⚡ ASIC Cyber Rig</b><br><small style="color:#94a3b8">+25 Doge/s</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cost-rig">500</span> D</div>
    </div>
    <div class="upgrade-btn" onclick="buyUpgrade('moon_rocket')">
      <div><b>🌕 Moon Rocket Base</b><br><small style="color:#94a3b8">+120 Doge/s</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cost-rocket">2500</span> D</div>
    </div>
  </div>
</div>
<script>
  ${audioSynthScript}
  let dogecoins = 0;
  let dps = 0;
  const costs = { shiba: 15, pickaxe: 100, rig: 500, rocket: 2500 };
  const dpsBoosts = { shiba: 1, pickaxe: 5, rig: 25, rocket: 120 };

  const coinEl = document.getElementById('dogecoins');
  const dpsEl = document.getElementById('dps-val');
  const rockEl = document.getElementById('rock');
  const container = document.getElementById('miner-container');

  const memeWords = ['WOW', 'MUCH DOGE', 'VERY COIN', 'SO RICH', 'TO THE MOON', 'AMAZE'];

  function clickRock(e) {
    dogecoins += 1;
    coinEl.innerText = Math.floor(dogecoins);
    playSound('coin');

    // Spawn floating meme text
    const span = document.createElement('span');
    span.className = 'float-text';
    span.innerText = '+' + 1 + ' ' + memeWords[Math.floor(Math.random() * memeWords.length)];
    span.style.left = (e ? e.clientX - container.getBoundingClientRect().left : 150) + 'px';
    span.style.top = (e ? e.clientY - container.getBoundingClientRect().top : 200) + 'px';
    container.appendChild(span);
    setTimeout(() => span.remove(), 800);
  }

  rockEl.addEventListener('pointerdown', clickRock);

  function buyUpgrade(type) {
    if (dogecoins >= costs[type]) {
      dogecoins -= costs[type];
      dps += dpsBoosts[type];
      costs[type] = Math.floor(costs[type] * 1.25);
      playSound('score');
      updateUi();
    }
  }

  function updateUi() {
    coinEl.innerText = Math.floor(dogecoins);
    dpsEl.innerText = dps;
    document.getElementById('cost-shiba').innerText = costs.shiba;
    document.getElementById('cost-pickaxe').innerText = costs.pickaxe;
    document.getElementById('cost-rig').innerText = costs.rig;
    document.getElementById('cost-rocket').innerText = costs.rocket;
  }

  setInterval(() => {
    dogecoins += dps / 10;
    coinEl.innerText = Math.floor(dogecoins);
  }, 100);
</script>
</body>
</html>`,

  // 6. A Dark Room (Minimalist Survival RPG)
  'a-dark-room': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>A Dark Room</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New', monospace; }
  body { background:#0a0a0c; color:#d4d4d8; display:flex; justify-content:center; align-items:center; min-height:100vh; padding:16px; }
  .room-wrap { width:640px; max-width:96vw; height:440px; background:#121216; border:2px solid #3f3f46; border-radius:12px; padding:20px; display:flex; gap:20px; box-shadow:0 0 30px rgba(0,0,0,0.8); }
  .left-pane { flex:1.2; display:flex; flex-direction:column; justify-content:space-between; }
  .log-pane { flex:1; background:#0a0a0c; border:1px solid #27272a; border-radius:8px; padding:12px; overflow-y:auto; font-size:12px; line-height:1.6; color:#a1a1aa; }
  .btn { background:#27272a; color:#f4f4f5; border:1px solid #52525b; padding:10px 16px; border-radius:6px; font-size:13px; font-weight:bold; cursor:pointer; transition:0.2s; margin-bottom:8px; }
  .btn:hover { background:#3f3f46; border-color:#a1a1aa; }
  .btn:disabled { opacity:0.35; cursor:not-allowed; }
  .status-text { font-size:14px; color:#e4e4e7; margin-bottom:12px; }
</style>
</head>
<body>
<div class="room-wrap">
  <div class="left-pane">
    <div>
      <h2 style="color:#fafafa;font-size:16px;margin-bottom:8px;">A DARK ROOM</h2>
      <div class="status-text" id="fire-status">the fire is dead. the room is freezing.</div>
      <div style="font-size:13px;color:#71717a;margin-bottom:14px;">
        wood: <span id="wood-val" style="color:#e4e4e7">0</span> | traps: <span id="traps-val" style="color:#e4e4e7">0</span> | fur: <span id="fur-val" style="color:#e4e4e7">0</span>
      </div>
    </div>
    <div>
      <button class="btn" id="light-btn" onclick="stokeFire()">stoke fire</button><br>
      <button class="btn" id="gather-btn" onclick="gatherWood()">gather wood</button><br>
      <button class="btn" id="trap-btn" onclick="buildTrap()" style="display:none;">build trap (10 wood)</button>
    </div>
  </div>
  <div class="log-pane" id="log">
    <div>a cold wind howls outside the door.</div>
  </div>
</div>
<script>
  ${audioSynthScript}
  let fire = 0; // 0 = dead, 1 = flickering, 2 = burning, 3 = roaring
  let wood = 4;
  let traps = 0;
  let fur = 0;
  const fireStates = ['the fire is dead.', 'the fire is flickering.', 'the fire is burning steadily.', 'the fire is roaring warmly.'];

  const fireEl = document.getElementById('fire-status');
  const woodEl = document.getElementById('wood-val');
  const trapsEl = document.getElementById('traps-val');
  const furEl = document.getElementById('fur-val');
  const trapBtn = document.getElementById('trap-btn');
  const logEl = document.getElementById('log');

  function addLog(txt) {
    const div = document.createElement('div');
    div.innerText = txt;
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function stokeFire() {
    if (wood > 0) {
      wood--;
      fire = Math.min(3, fire + 1);
      playSound('beat');
      addLog('the fire roars to life. sparks drift into the ceiling.');
      updateUI();
    } else {
      addLog('not enough wood to keep the fire going.');
    }
  }

  function gatherWood() {
    wood += Math.floor(Math.random() * 3) + 2;
    playSound('coin');
    addLog('you brave the barren forest and collect dry branches.');
    if (wood >= 10) trapBtn.style.display = 'inline-block';
    updateUI();
  }

  function buildTrap() {
    if (wood >= 10) {
      wood -= 10;
      traps++;
      playSound('score');
      addLog('a wooden snare trap is set in the outer brush.');
      updateUI();
    }
  }

  function updateUI() {
    fireEl.innerText = fireStates[fire];
    woodEl.innerText = wood;
    trapsEl.innerText = traps;
    furEl.innerText = fur;
  }

  setInterval(() => {
    if (fire > 0 && Math.random() < 0.3) {
      fire--;
      updateUI();
    }
    if (traps > 0 && Math.random() < 0.25) {
      fur += traps;
      addLog('the traps snap shut. you collect ' + traps + ' animal furs.');
      playSound('hit');
      updateUI();
    }
  }, 4000);

  updateUI();
</script>
</body>
</html>`,

  // 7. Drive Mad / Drift Hunters (Fast Physics Stunt Car)
  'drive-mad': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Drive Mad</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:sans-serif; user-select:none; }
  body { background:#070a14; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .drive-wrap { position:relative; width:680px; max-width:96vw; height:420px; background:#0f172a; border-radius:14px; border:3px solid #38bdf8; box-shadow:0 0 35px rgba(56,189,248,0.3); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; background:linear-gradient(to bottom, #0284c7 0%, #38bdf8 60%, #475569 60%, #1e293b 100%); }
  .hud { position:absolute; top:12px; left:16px; right:16px; display:flex; justify-content:space-between; font-weight:bold; font-size:14px; text-shadow:0 0 8px #000; }
  .controls { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="drive-wrap">
  <canvas id="c" width="680" height="420"></canvas>
  <div class="hud">
    <span style="color:#facc15">SPEED: <span id="spd">0</span> KM/H</span>
    <span style="color:#38bdf8">DISTANCE: <span id="dist">0</span> M</span>
  </div>
</div>
<div class="controls">Press W / Up Arrow to Throttle, S / Down Arrow to Brake/Reverse, A/D to Tilt in air!</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const spdEl = document.getElementById('spd');
  const distEl = document.getElementById('dist');

  let car = { x: 80, y: 220, vx: 0, vy: 0, angle: 0, va: 0, w: 44, h: 22, grounded: false };
  let cameraX = 0;
  let obstacles = [
    { x: 300, y: 230, w: 60, h: 40, type: 'ramp' },
    { x: 600, y: 220, w: 40, h: 50, type: 'block' },
    { x: 900, y: 230, w: 80, h: 40, type: 'ramp' },
    { x: 1300, y: 200, w: 100, h: 20, type: 'finish' }
  ];

  let keys = {};
  window.addEventListener('keydown', e => { keys[e.code] = true; });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function reset() {
    car.x = 80; car.y = 220; car.vx = 0; car.vy = 0; car.angle = 0; car.va = 0;
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    // Throttle & Brake
    if (keys['ArrowUp'] || keys['KeyW']) car.vx += 0.32;
    if (keys['ArrowDown'] || keys['KeyS']) car.vx -= 0.22;
    if (keys['ArrowLeft'] || keys['KeyA']) car.angle -= 0.05;
    if (keys['ArrowRight'] || keys['KeyD']) car.angle += 0.05;

    car.vy += 0.42; // Gravity
    car.x += car.vx;
    car.y += car.vy;
    car.vx *= 0.985; // Friction

    // Ground check
    if (car.y >= 240) {
      car.y = 240;
      car.vy = 0;
      car.grounded = true;
      car.angle *= 0.85; // Align to ground
    } else {
      car.grounded = false;
    }

    // Crashed check (upside down on ground)
    if (car.y >= 238 && Math.abs(car.angle) > 1.6) {
      playSound('explode');
      reset();
    }

    cameraX = car.x - 150;
    spdEl.innerText = Math.abs(Math.floor(car.vx * 15));
    distEl.innerText = Math.floor(car.x / 10);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Ground
    ctx.fillStyle = '#334155';
    ctx.fillRect(cameraX - 100, 260, canvas.width + 200, 160);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(cameraX - 100, 260, canvas.width + 200, 10);

    // Obstacles & Ramps
    for (const o of obstacles) {
      if (o.type === 'ramp') {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(o.x, 260);
        ctx.lineTo(o.x + o.w, 260 - o.h);
        ctx.lineTo(o.x + o.w, 260);
        ctx.fill();
      } else if (o.type === 'finish') {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(o.x, 180, 20, 80);
        ctx.fillStyle = '#fff';
        ctx.fillText('FINISH', o.x, 170);
      }
    }

    // Car Body
    ctx.save();
    ctx.translate(car.x, car.y + 10);
    ctx.rotate(car.angle);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-car.w/2, -car.h, car.w, car.h);
    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-14, 2, 7, 0, Math.PI * 2);
    ctx.arc(14, 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  loop();
</script>
</body>
</html>`,

  // 8. Cookie Clicker (Idle Incremental Cyber Bakery)
  'cookie-clicker': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Cookie Clicker</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', sans-serif; user-select:none; }
  body { background:#0f172a; color:#fff; display:flex; justify-content:center; align-items:center; min-height:100vh; overflow:hidden; }
  .cookie-wrap { width:680px; max-width:96vw; height:450px; background:radial-gradient(circle, #1e293b 0%, #090d16 100%); border-radius:16px; border:2px solid #eab308; box-shadow:0 0 35px rgba(234,179,8,0.25); display:flex; overflow:hidden; position:relative; }
  .cookie-col { flex:1.2; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px; border-right:1px solid #334155; position:relative; }
  .shop-col { flex:1; background:#0b0f19; padding:16px; overflow-y:auto; }
  .cookie-btn { width:150px; height:150px; border-radius:50%; background:radial-gradient(circle, #d97706 0%, #92400e 100%); border:4px solid #facc15; font-size:75px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 0 25px rgba(234,179,8,0.4); transition:transform 0.08s; }
  .cookie-btn:active { transform:scale(0.92); }
  .shop-item { background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:0.2s; }
  .shop-item:hover { background:#334155; border-color:#eab308; }
  .float-cookie { position:absolute; font-weight:bold; color:#facc15; font-size:18px; pointer-events:none; animation:floatCookie 0.8s forwards; text-shadow:0 0 4px #000; }
  @keyframes floatCookie { 0% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(-50px); } }
</style>
</head>
<body>
<div class="cookie-wrap" id="cookie-container">
  <div class="cookie-col">
    <div style="text-align:center;margin-bottom:16px;">
      <h2 style="font-size:26px;font-weight:900;color:#facc15;">🍪 <span id="cookies-num">0</span> COOKIES</h2>
      <p style="font-size:13px;color:#38bdf8;font-weight:bold;">per second: <span id="cps-num">0</span></p>
    </div>
    <div class="cookie-btn" id="big-cookie">🍪</div>
    <p style="font-size:11px;color:#94a3b8;margin-top:16px;">Click the Giant Cookie to bake fresh cookies!</p>
  </div>
  <div class="shop-col">
    <h3 style="font-size:14px;color:#facc15;margin-bottom:12px;text-align:center;font-weight:bold;">🏪 CYBER BAKERY UPGRADES</h3>
    <div class="shop-item" onclick="buy('cursor')">
      <div><b>👆 Auto-Cursor</b><br><small style="color:#94a3b8">+0.5 CPS (Count: <span id="cnt-cursor">0</span>)</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cst-cursor">15</span> 🍪</div>
    </div>
    <div class="shop-item" onclick="buy('grandma')">
      <div><b>👵 Cyber Grandma</b><br><small style="color:#94a3b8">+4 CPS (Count: <span id="cnt-grandma">0</span>)</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cst-grandma">100</span> 🍪</div>
    </div>
    <div class="shop-item" onclick="buy('farm')">
      <div><b>🌾 Cookie Farm</b><br><small style="color:#94a3b8">+16 CPS (Count: <span id="cnt-farm">0</span>)</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cst-farm">500</span> 🍪</div>
    </div>
    <div class="shop-item" onclick="buy('mine')">
      <div><b>⛏️ Chocolate Mine</b><br><small style="color:#94a3b8">+60 CPS (Count: <span id="cnt-mine">0</span>)</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cst-mine">2000</span> 🍪</div>
    </div>
    <div class="shop-item" onclick="buy('factory')">
      <div><b>🏭 Quantum Factory</b><br><small style="color:#94a3b8">+250 CPS (Count: <span id="cnt-factory">0</span>)</small></div>
      <div style="color:#facc15;font-weight:bold;"><span id="cst-factory">8500</span> 🍪</div>
    </div>
  </div>
</div>
<script>
  ${audioSynthScript}
  let cookies = 0, cps = 0;
  const items = {
    cursor: { count: 0, cost: 15, cps: 0.5 },
    grandma: { count: 0, cost: 100, cps: 4 },
    farm: { count: 0, cost: 500, cps: 16 },
    mine: { count: 0, cost: 2000, cps: 60 },
    factory: { count: 0, cost: 8500, cps: 250 }
  };
  const numEl = document.getElementById('cookies-num');
  const cpsEl = document.getElementById('cps-num');
  const btn = document.getElementById('big-cookie');
  const wrap = document.getElementById('cookie-container');

  btn.addEventListener('pointerdown', (e) => {
    cookies += 1;
    playSound('coin');
    updateUi();
    const span = document.createElement('span');
    span.className = 'float-cookie';
    span.innerText = '+1';
    span.style.left = (e.clientX - wrap.getBoundingClientRect().left) + 'px';
    span.style.top = (e.clientY - wrap.getBoundingClientRect().top) + 'px';
    wrap.appendChild(span);
    setTimeout(() => span.remove(), 800);
  });

  function buy(key) {
    const it = items[key];
    if (cookies >= it.cost) {
      cookies -= it.cost;
      it.count++;
      it.cost = Math.floor(it.cost * 1.15);
      recalcCps();
      playSound('score');
      updateUi();
    }
  }

  function recalcCps() {
    cps = Object.values(items).reduce((acc, it) => acc + (it.count * it.cps), 0);
  }

  function updateUi() {
    numEl.innerText = Math.floor(cookies);
    cpsEl.innerText = cps.toFixed(1);
    for (const k in items) {
      document.getElementById('cnt-' + k).innerText = items[k].count;
      document.getElementById('cst-' + k).innerText = items[k].cost;
    }
  }

  setInterval(() => {
    cookies += cps / 10;
    numEl.innerText = Math.floor(cookies);
  }, 100);
</script>
</body>
</html>`,

  // 9. Fireboy & Watergirl (Multiplayer 2-Player Co-op)
  'fireboy-and-watergirl': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fireboy and Watergirl</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', sans-serif; user-select:none; }
  body { background:#030712; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .temple-wrap { position:relative; width:680px; max-width:96vw; height:440px; background:#111827; border-radius:14px; border:3px solid #06b6d4; box-shadow:0 0 35px rgba(6,182,212,0.25); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; }
  .hud { position:absolute; top:12px; left:16px; right:16px; display:flex; justify-content:space-between; font-weight:bold; font-size:13px; pointer-events:none; }
  .controls-bar { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="temple-wrap">
  <canvas id="c" width="680" height="440"></canvas>
  <div class="hud">
    <span style="color:#ef4444">🔥 FIREBOY: ARROW KEYS</span>
    <span style="color:#38bdf8">💧 WATERGIRL: [A][W][D]</span>
  </div>
</div>
<div class="controls-bar">Cooperate to collect elemental gems and reach the exit doors! Fireboy swims in lava, Watergirl swims in water!</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  let p1 = { x: 50, y: 360, vx: 0, vy: 0, w: 22, h: 30, color: '#ef4444', grounded: true, isFire: true };
  let p2 = { x: 100, y: 360, vx: 0, vy: 0, w: 22, h: 30, color: '#38bdf8', grounded: true, isFire: false };

  let platforms = [
    { x: 0, y: 400, w: 680, h: 40 },
    { x: 160, y: 320, w: 140, h: 18 },
    { x: 380, y: 320, w: 140, h: 18 },
    { x: 40, y: 240, w: 140, h: 18 },
    { x: 500, y: 240, w: 140, h: 18 },
    { x: 200, y: 160, w: 280, h: 18 },
    { x: 80, y: 80, w: 520, h: 18 }
  ];

  let pools = [
    { x: 260, y: 390, w: 70, h: 12, type: 'lava', color: '#ef4444' },
    { x: 350, y: 390, w: 70, h: 12, type: 'water', color: '#06b6d4' }
  ];

  let gems = [
    { x: 230, y: 290, type: 'fire', collected: false },
    { x: 450, y: 290, type: 'water', collected: false },
    { x: 340, y: 130, type: 'fire', collected: false },
    { x: 340, y: 50, type: 'water', collected: false }
  ];

  let doorFire = { x: 520, y: 40, w: 30, h: 40, reached: false };
  let doorWater = { x: 565, y: 40, w: 30, h: 40, reached: false };

  let keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'ArrowUp' && p1.grounded) { p1.vy = -9; p1.grounded = false; playSound('jump'); }
    if (e.code === 'KeyW' && p2.grounded) { p2.vy = -9; p2.grounded = false; playSound('jump'); }
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function reset() {
    p1.x = 50; p1.y = 360; p1.vx = 0; p1.vy = 0;
    p2.x = 100; p2.y = 360; p2.vx = 0; p2.vy = 0;
    gems.forEach(g => g.collected = false);
  }

  function updatePlayer(p, isP1) {
    if (isP1) {
      if (keys['ArrowLeft']) p.vx = -3.8;
      else if (keys['ArrowRight']) p.vx = 3.8;
      else p.vx *= 0.75;
    } else {
      if (keys['KeyA']) p.vx = -3.8;
      else if (keys['KeyD']) p.vx = 3.8;
      else p.vx *= 0.75;
    }

    p.vy += 0.45; // Gravity
    p.x += p.vx;
    p.y += p.vy;

    p.grounded = false;
    for (const plat of platforms) {
      if (p.x + p.w > plat.x && p.x < plat.x + plat.w &&
          p.y + p.h >= plat.y && p.y + p.h <= plat.y + plat.h + p.vy && p.vy >= 0) {
        p.y = plat.y - p.h;
        p.vy = 0;
        p.grounded = true;
      }
    }

    // Hazard checks
    for (const pool of pools) {
      if (p.x + p.w > pool.x && p.x < pool.x + pool.w && p.y + p.h > pool.y) {
        if (p.isFire && pool.type === 'water') { playSound('hit'); reset(); }
        if (!p.isFire && pool.type === 'lava') { playSound('hit'); reset(); }
      }
    }

    // Gems
    for (const g of gems) {
      if (!g.collected && Math.hypot(p.x - g.x, p.y - g.y) < 25) {
        if ((p.isFire && g.type === 'fire') || (!p.isFire && g.type === 'water')) {
          g.collected = true;
          playSound('coin');
        }
      }
    }
  }

  function loop() {
    updatePlayer(p1, true);
    updatePlayer(p2, false);

    // Win check
    if (Math.hypot(p1.x - doorFire.x, p1.y - doorFire.y) < 25 &&
        Math.hypot(p2.x - doorWater.x, p2.y - doorWater.y) < 25) {
      playSound('score');
      reset();
    }

    draw();
    requestAnimationFrame(loop);
  }

  function draw() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Platforms
    ctx.fillStyle = '#334155';
    for (const pl of platforms) {
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(pl.x, pl.y, pl.w, 3);
      ctx.fillStyle = '#334155';
    }

    // Pools
    for (const pool of pools) {
      ctx.fillStyle = pool.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = pool.color;
      ctx.fillRect(pool.x, pool.y, pool.w, pool.h);
      ctx.shadowBlur = 0;
    }

    // Exit Doors
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(doorFire.x, doorFire.y, doorFire.w, doorFire.h);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(doorWater.x, doorWater.y, doorWater.w, doorWater.h);

    // Gems
    for (const g of gems) {
      if (!g.collected) {
        ctx.fillStyle = g.type === 'fire' ? '#ef4444' : '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.moveTo(g.x, g.y - 8);
        ctx.lineTo(g.x + 7, g.y);
        ctx.lineTo(g.x, g.y + 8);
        ctx.lineTo(g.x - 7, g.y);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Players
    ctx.fillStyle = p1.color;
    ctx.fillRect(p1.x, p1.y, p1.w, p1.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(p1.x + 4, p1.y + 6, 4, 4); ctx.fillRect(p1.x + 14, p1.y + 6, 4, 4);

    ctx.fillStyle = p2.color;
    ctx.fillRect(p2.x, p2.y, p2.w, p2.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(p2.x + 4, p2.y + 6, 4, 4); ctx.fillRect(p2.x + 14, p2.y + 6, 4, 4);
  }

  loop();
</script>
</body>
</html>`,

  // 10. Rooftop Duel (Multiplayer 2-Player Physics Shootout)
  'rooftop-snipers': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rooftop Duel</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', sans-serif; user-select:none; }
  body { background:#030712; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .roof-wrap { position:relative; width:680px; max-width:96vw; height:430px; background:linear-gradient(to bottom, #090d16 0%, #1e1b4b 60%, #030712 100%); border-radius:14px; border:3px solid #8b5cf6; box-shadow:0 0 35px rgba(139,92,246,0.3); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; }
  .hud { position:absolute; top:12px; left:16px; right:16px; display:flex; justify-content:space-between; font-weight:bold; font-size:16px; text-shadow:0 0 10px #000; }
  .controls-bar { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="roof-wrap">
  <canvas id="c" width="680" height="430"></canvas>
  <div class="hud">
    <span style="color:#06b6d4">P1 (BLUE): <span id="s1">0</span></span>
    <span style="color:#f43f5e">P2 (RED): <span id="s2">0</span></span>
  </div>
</div>
<div class="controls-bar">P1: [W] Jump/Flip, [E] Shoot | P2: [I] Jump/Flip, [O] Shoot! Knock opponent off the skyscraper!</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const s1El = document.getElementById('s1');
  const s2El = document.getElementById('s2');

  let s1 = 0, s2 = 0;
  let bullets = [];

  let p1 = { x: 220, y: 240, vx: 0, vy: 0, angle: 0, va: 0, w: 24, h: 36, color: '#06b6d4', gunAngle: 0, grounded: true };
  let p2 = { x: 440, y: 240, vx: 0, vy: 0, angle: 0, va: 0, w: 24, h: 36, color: '#f43f5e', gunAngle: Math.PI, grounded: true };

  const roof = { x: 160, y: 280, w: 360, h: 150 };

  window.addEventListener('keydown', e => {
    if (e.code === 'KeyW' && p1.grounded) { p1.vy = -10; p1.va = 0.12; p1.grounded = false; playSound('jump'); }
    if (e.code === 'KeyE') {
      bullets.push({ x: p1.x + 12, y: p1.y + 12, vx: 12, vy: (Math.random()-0.5)*2, owner: 1 });
      playSound('laser');
    }
    if (e.code === 'KeyI' && p2.grounded) { p2.vy = -10; p2.va = -0.12; p2.grounded = false; playSound('jump'); }
    if (e.code === 'KeyO') {
      bullets.push({ x: p2.x + 12, y: p2.y + 12, vx: -12, vy: (Math.random()-0.5)*2, owner: 2 });
      playSound('laser');
    }
  });

  function resetRound() {
    p1.x = 220; p1.y = 240; p1.vx = 0; p1.vy = 0; p1.angle = 0; p1.va = 0;
    p2.x = 440; p2.y = 240; p2.vx = 0; p2.vy = 0; p2.angle = 0; p2.va = 0;
    bullets = [];
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function updatePlayer(p) {
    p.vy += 0.45;
    p.x += p.vx;
    p.y += p.vy;
    p.angle += p.va;

    if (p.x + p.w > roof.x && p.x < roof.x + roof.w && p.y + p.h >= roof.y && p.y + p.h <= roof.y + 15 && p.vy >= 0) {
      p.y = roof.y - p.h;
      p.vy = 0;
      p.vx *= 0.8;
      p.grounded = true;
      p.angle *= 0.8;
      p.va = 0;
    } else {
      p.grounded = false;
    }

    if (p.y > 450) {
      playSound('explode');
      if (p === p1) s2++; else s1++;
      s1El.innerText = s1;
      s2El.innerText = s2;
      resetRound();
    }
  }

  function update() {
    updatePlayer(p1);
    updatePlayer(p2);

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.owner === 1 && Math.hypot(b.x - p2.x, b.y - p2.y) < 25) {
        p2.vx += 9;
        p2.vy -= 4;
        playSound('hit');
        bullets.splice(i, 1);
      } else if (b.owner === 2 && Math.hypot(b.x - p1.x, b.y - p1.y) < 25) {
        p1.vx -= 9;
        p1.vy -= 4;
        playSound('hit');
        bullets.splice(i, 1);
      } else if (b.x < 0 || b.x > canvas.width) {
        bullets.splice(i, 1);
      }
    }
  }

  function draw() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // City Skyline
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(40, 160, 80, 270);
    ctx.fillRect(550, 140, 90, 290);
    ctx.fillRect(20, 220, 60, 210);

    // Skyscraper Roof
    ctx.fillStyle = '#334155';
    ctx.fillRect(roof.x, roof.y, roof.w, roof.h);
    ctx.fillStyle = '#475569';
    ctx.fillRect(roof.x, roof.y, roof.w, 6);

    // Bullets
    ctx.fillStyle = '#facc15';
    for (const b of bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Players
    [p1, p2].forEach(p => {
      ctx.save();
      ctx.translate(p.x + p.w/2, p.y + p.h/2);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.fillStyle = '#fff';
      ctx.fillRect(p === p1 ? 2 : -6, -10, 4, 4);
      // Gun
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(p === p1 ? 6 : -14, -2, 10, 5);
      ctx.restore();
    });
  }

  loop();
</script>
</body>
</html>`,

  // 11. 3D Flight Simulator (Simulation)
  'flight-simulator-3d': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>3D Flight Simulator</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New', monospace; user-select:none; }
  body { background:#030712; color:#38bdf8; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .sim-wrap { position:relative; width:680px; max-width:96vw; height:440px; background:#000; border-radius:14px; border:2px solid #06b6d4; box-shadow:0 0 35px rgba(6,182,212,0.3); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; }
  .hud { position:absolute; top:12px; left:16px; right:16px; display:flex; justify-content:space-between; font-weight:bold; font-size:13px; pointer-events:none; }
  .controls-bar { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="sim-wrap">
  <canvas id="c" width="680" height="440"></canvas>
  <div class="hud">
    <span>ALTITUDE: <b id="alt" style="color:#22c55e">2400</b> FT</span>
    <span>AIRSPEED: <b id="spd" style="color:#facc15">320</b> KTS</span>
    <span>PITCH/ROLL: <b id="att" style="color:#38bdf8">0° / 0°</b></span>
  </div>
</div>
<div class="controls-bar">Arrow Keys / WASD: Pitch & Roll | [Space]: Boost Afterburner | Fly through Neon Rings!</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const altEl = document.getElementById('alt');
  const spdEl = document.getElementById('spd');
  const attEl = document.getElementById('att');

  let pitch = 0, roll = 0, speed = 320, alt = 2400;
  let rings = [];
  for (let i = 0; i < 8; i++) {
    rings.push({ x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 200, z: 400 + i * 250, r: 60 });
  }

  let keys = {};
  window.addEventListener('keydown', e => { keys[e.code] = true; });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function loop() {
    // Flight physics controls
    if (keys['ArrowUp'] || keys['KeyW']) pitch -= 0.03;
    if (keys['ArrowDown'] || keys['KeyS']) pitch += 0.03;
    if (keys['ArrowLeft'] || keys['KeyA']) roll -= 0.04;
    if (keys['ArrowRight'] || keys['KeyD']) roll += 0.04;

    pitch *= 0.94;
    roll *= 0.94;

    alt += pitch * 40;
    alt = Math.max(200, Math.min(8000, alt));

    altEl.innerText = Math.floor(alt);
    spdEl.innerText = Math.floor(speed);
    attEl.innerText = Math.floor(pitch * 57.3) + '° / ' + Math.floor(roll * 57.3) + '°';

    // Update rings in 3D perspective
    for (const rg of rings) {
      rg.z -= speed * 0.04;
      if (rg.z < 10) {
        playSound('coin');
        rg.z = 2000;
        rg.x = (Math.random() - 0.5) * 500;
        rg.y = (Math.random() - 0.5) * 300;
      }
    }

    draw();
    requestAnimationFrame(loop);
  }

  function draw() {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(roll);

    // Horizon Line
    const horizonY = -pitch * 300;
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-400, horizonY);
    ctx.lineTo(400, horizonY);
    ctx.stroke();

    // 3D Terrain grid lines
    ctx.strokeStyle = 'rgba(6,182,212,0.2)';
    for (let x = -300; x <= 300; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, horizonY);
      ctx.lineTo(x * 2.5, 300);
      ctx.stroke();
    }

    // 3D Target Rings
    for (const rg of rings) {
      if (rg.z > 0) {
        const scale = 250 / rg.z;
        const rx = rg.x * scale;
        const ry = (rg.y * scale) + horizonY;
        const rad = rg.r * scale;

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = Math.max(1, 4 * scale);
        ctx.beginPath();
        ctx.arc(rx, ry, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Cockpit HUD Crosshair
    ctx.restore();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 20, 0, Math.PI * 2);
    ctx.moveTo(canvas.width/2 - 40, canvas.height/2); ctx.lineTo(canvas.width/2 - 20, canvas.height/2);
    ctx.moveTo(canvas.width/2 + 20, canvas.height/2); ctx.lineTo(canvas.width/2 + 40, canvas.height/2);
    ctx.stroke();
  }

  loop();
</script>
</body>
</html>`,

  // 12. Night Watch (Horror Survival FNAF Style)
  'midnight-surveillance-fnaf': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Night Watch</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New', monospace; user-select:none; }
  body { background:#000; color:#ef4444; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .fnaf-wrap { position:relative; width:680px; max-width:96vw; height:440px; background:#050505; border:3px solid #ef4444; box-shadow:0 0 35px rgba(239,68,68,0.3); border-radius:14px; overflow:hidden; display:flex; }
  .office-view { flex:1; position:relative; background:#0a0a0f; display:flex; flex-direction:column; justify-content:space-between; padding:16px; }
  .cam-system { width:220px; background:#111; border-left:2px solid #ef4444; padding:12px; display:flex; flex-direction:column; gap:8px; }
  .cam-btn { background:#1e1e24; color:#fff; border:1px solid #ef4444; padding:8px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:11px; }
  .cam-btn.active { background:#ef4444; color:#000; }
  .toggle-btn { background:#1e1e24; color:#fff; border:1px solid #38bdf8; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; margin-top:6px; }
  .static-noise { position:absolute; inset:0; background:repeating-radial-gradient(#000 0 0.0001%,#fff 0 0.0002%); opacity:0.08; pointer-events:none; }
</style>
</head>
<body>
<div class="fnaf-wrap">
  <div class="office-view">
    <div class="static-noise"></div>
    <div style="display:flex;justify-content:space-between;font-weight:bold;color:#facc15;">
      <span>TIME: <b id="clock-txt">12 AM</b> (NIGHT 1)</span>
      <span>POWER: <b id="pwr-txt" style="color:#22c55e">98%</b></span>
    </div>
    <div id="cam-monitor" style="flex:1;margin:12px 0;background:#000;border:1px solid #333;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
      <div id="cam-feed" style="font-size:16px;font-weight:bold;color:#38bdf8;text-align:center;">
        [CAM 1: MAIN STAGE - ALL CLEAR]
      </div>
      <div id="jumpscare" style="display:none;position:absolute;inset:0;background:#991b1b;color:#fff;font-size:40px;font-weight:900;align-items:center;justify-content:center;z-index:99;">
        👻 JUMPSCARE!
      </div>
    </div>
    <div style="display:flex;gap:10px;">
      <button class="toggle-btn" id="door-left" onclick="toggleDoor('left')">LEFT DOOR: OPEN</button>
      <button class="toggle-btn" id="door-right" onclick="toggleDoor('right')">RIGHT DOOR: OPEN</button>
    </div>
  </div>
  <div class="cam-system">
    <h3 style="font-size:12px;color:#ef4444;text-align:center;font-weight:bold;">SECURITY CAMERAS</h3>
    <button class="cam-btn active" onclick="setCam(1)">CAM 1: Stage</button>
    <button class="cam-btn" onclick="setCam(2)">CAM 2: Left Hall</button>
    <button class="cam-btn" onclick="setCam(3)">CAM 3: Right Hall</button>
    <button class="cam-btn" onclick="setCam(4)">CAM 4: Kitchen</button>
    <button class="cam-btn" onclick="setCam(5)">CAM 5: Closet</button>
  </div>
</div>
<script>
  ${audioSynthScript}
  let power = 98;
  let hour = 12;
  let activeCam = 1;
  let leftDoor = false, rightDoor = false;
  let monsterPos = 1; // 1 to 5

  const pwrEl = document.getElementById('pwr-txt');
  const clkEl = document.getElementById('clock-txt');
  const feedEl = document.getElementById('cam-feed');
  const scareEl = document.getElementById('jumpscare');

  function toggleDoor(side) {
    playSound('beat');
    if (side === 'left') {
      leftDoor = !leftDoor;
      document.getElementById('door-left').innerText = 'LEFT DOOR: ' + (leftDoor ? 'CLOSED' : 'OPEN');
      document.getElementById('door-left').style.borderColor = leftDoor ? '#ef4444' : '#38bdf8';
    } else {
      rightDoor = !rightDoor;
      document.getElementById('door-right').innerText = 'RIGHT DOOR: ' + (rightDoor ? 'CLOSED' : 'OPEN');
      document.getElementById('door-right').style.borderColor = rightDoor ? '#ef4444' : '#38bdf8';
    }
  }

  function setCam(n) {
    activeCam = n;
    playSound('beat');
    document.querySelectorAll('.cam-btn').forEach((b, i) => {
      b.classList.toggle('active', i + 1 === n);
    });
    updateFeed();
  }

  function updateFeed() {
    const names = ['STAGE', 'LEFT HALL', 'RIGHT HALL', 'KITCHEN', 'CLOSET'];
    if (monsterPos === activeCam) {
      feedEl.innerText = '[CAM ' + activeCam + ': ' + names[activeCam-1] + ' - ⚠️ ENTITY SPOTTED!]';
      feedEl.style.color = '#ef4444';
    } else {
      feedEl.innerText = '[CAM ' + activeCam + ': ' + names[activeCam-1] + ' - ALL CLEAR]';
      feedEl.style.color = '#38bdf8';
    }
  }

  // AI monster movement
  setInterval(() => {
    if (Math.random() < 0.4) {
      monsterPos = (monsterPos % 5) + 1;
      playSound('hit');
      updateFeed();

      // Check attack on office
      if (monsterPos === 2 && !leftDoor) {
        triggerJumpscare();
      } else if (monsterPos === 3 && !rightDoor) {
        triggerJumpscare();
      }
    }
  }, 4000);

  function triggerJumpscare() {
    scareEl.style.display = 'flex';
    playSound('explode');
    setTimeout(() => {
      scareEl.style.display = 'none';
      monsterPos = 1;
      updateFeed();
    }, 2000);
  }

  setInterval(() => {
    let drain = 0.15;
    if (leftDoor) drain += 0.3;
    if (rightDoor) drain += 0.3;
    power = Math.max(0, power - drain);
    pwrEl.innerText = Math.floor(power) + '%';
  }, 1000);
</script>
</body>
</html>`
};

/**
 * Universal interactive Canvas Game Engine for any arbitrary game title.
 * Generates an authentic playable mini-game matching the category and controls!
 */
export function generatePlayableGameHtml(game) {
  const title = game.title || 'Arcade Game';
  const category = (game.category || 'Arcade').toUpperCase();
  const controls = game.controls || 'Arrow Keys / WASD or Mouse Click';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>${title}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; user-select:none; }
  body { background:#060813; color:#f8fafc; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .screen-frame { position:relative; width:680px; max-width:96vw; height:450px; background:#090d1a; border-radius:14px; border:2px solid #06b6d4; box-shadow:0 0 35px rgba(6,182,212,0.25); overflow:hidden; }
  canvas { display:block; width:100%; height:100%; background:#030712; }
  .hud { position:absolute; top:12px; left:16px; right:16px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:13px; text-shadow:0 0 8px #000; pointer-events:none; }
  .badge { background:rgba(6,182,212,0.2); border:1px solid #06b6d4; color:#38bdf8; padding:3px 8px; border-radius:4px; font-size:11px; }
  .controls-bar { margin-top:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div class="screen-frame">
  <canvas id="c" width="680" height="450"></canvas>
  <div class="hud">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="color:#fff;font-size:15px;">${title}</span>
      <span class="badge">${category}</span>
    </div>
    <div>
      <span style="color:#facc15">SCORE: <span id="score">0</span></span>
      <span style="color:#ef4444;margin-left:12px;">LIVES: <span id="lives">❤️❤️❤️</span></span>
    </div>
  </div>
</div>
<div class="controls-bar">${controls} • Press Space or Click to Jump / Fire!</div>
<script>
  ${audioSynthScript}
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');

  let player = { x: 100, y: 340, vx: 0, vy: 0, w: 32, h: 32, grounded: true, jumpPower: -9.8 };
  let obstacles = [];
  let stars = [];
  let lasers = [];
  let score = 0, lives = 3, isGameOver = false;
  let spawnTimer = 0;

  function reset() {
    player.x = 100; player.y = 340; player.vx = 0; player.vy = 0;
    obstacles = [];
    stars = [];
    lasers = [];
    score = 0;
    lives = 3;
    isGameOver = false;
    scoreEl.innerText = '0';
    livesEl.innerText = '❤️❤️❤️';
  }

  function jump() {
    if (isGameOver) { reset(); return; }
    if (player.grounded) {
      player.vy = player.jumpPower;
      player.grounded = false;
      playSound('jump');
    }
  }

  function shoot() {
    if (!isGameOver) {
      lasers.push({ x: player.x + player.w, y: player.y + player.h/2, vx: 9, r: 4 });
      playSound('laser');
    }
  }

  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      jump();
    } else if (e.code === 'KeyJ' || e.code === 'KeyX' || e.code === 'KeyF') {
      shoot();
    }
  });

  canvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    jump();
    shoot();
  });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if (isGameOver) return;

    // Player physics
    player.vy += 0.48; // Gravity
    player.y += player.vy;

    if (player.y >= 340) {
      player.y = 340;
      player.vy = 0;
      player.grounded = true;
    }

    // Spawn obstacles & stars
    spawnTimer++;
    if (spawnTimer % 80 === 0) {
      obstacles.push({ x: canvas.width, y: 340, w: 24, h: 32, color: '#ef4444' });
      stars.push({ x: canvas.width + 40, y: 260 + Math.random() * 60, r: 8, collected: false });
    }

    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= 4.5;
      // Hit player
      if (player.x + player.w > o.x && player.x < o.x + o.w &&
          player.y + player.h > o.y && player.y < o.y + o.h) {
        lives--;
        playSound('hit');
        livesEl.innerText = '❤️'.repeat(Math.max(0, lives));
        obstacles.splice(i, 1);
        if (lives <= 0) isGameOver = true;
      }
      if (o.x < -40) {
        obstacles.splice(i, 1);
        score += 50;
        scoreEl.innerText = score;
      }
    }

    // Move lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      l.x += l.vx;
      for (let oi = obstacles.length - 1; oi >= 0; oi--) {
        const o = obstacles[oi];
        if (l.x > o.x && l.x < o.x + o.w && l.y > o.y && l.y < o.y + o.h) {
          obstacles.splice(oi, 1);
          lasers.splice(i, 1);
          score += 100;
          scoreEl.innerText = score;
          playSound('hit');
          break;
        }
      }
      if (l.x > canvas.width + 20) lasers.splice(i, 1);
    }

    // Move stars
    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      s.x -= 4.5;
      if (!s.collected && Math.hypot(player.x - s.x, player.y - s.y) < 28) {
        s.collected = true;
        score += 200;
        scoreEl.innerText = score;
        playSound('coin');
      }
      if (s.x < -30) stars.splice(i, 1);
    }
  }

  function draw() {
    ctx.fillStyle = '#070b19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid Floor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 372, canvas.width, 80);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 372);
    ctx.lineTo(canvas.width, 372);
    ctx.stroke();

    // Stars
    for (const s of stars) {
      if (!s.collected) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Lasers
    ctx.fillStyle = '#38bdf8';
    for (const l of lasers) {
      ctx.fillRect(l.x - 6, l.y - 2, 12, 4);
    }

    // Obstacles
    for (const o of obstacles) {
      ctx.fillStyle = o.color;
      ctx.fillRect(o.x, o.y, o.w, o.h);
    }

    // Player Hero
    ctx.fillStyle = '#06b6d4';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#06b6d4';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x + 18, player.y + 6, 6, 6);

    if (isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 150, canvas.width, 140);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SIMULATION ENDED', canvas.width / 2, 205);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '15px sans-serif';
      ctx.fillText('Final Score: ' + score + ' • Click or Tap to Restart', canvas.width / 2, 245);
    }
  }

  loop();
</script>
</body>
</html>`;
}
