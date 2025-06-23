'use strict';

// Fruit Ninja style mini game implemented with HTML5 Canvas.
// Handles fruit creation, slicing interaction and scoring.

window.addEventListener('load', function () {
  const container = document.getElementById('container');
  const scoreEl = document.getElementById('value');
  const startBtn = document.getElementById('start');
  const restartBtn = document.getElementById('restartGame');
  const backBtn = document.getElementById('restart');
  const endScreen = document.getElementById('endgame');
  const finalScoreEl = document.getElementById('fsc');
  const sliceSound = document.getElementById('slicesound');

  let canvas;
  let ctx;
  let running = false;
  let fruits = [];
  let lastSpawn = 0;
  let lastTime = 0;
  let score = 0;

  const spawnInterval = 1000; // ms between fruit spawns
  const gravity = 0.35;

  const fruitImages = [
    'apple.png',
    'banana.png',
    'grapes.png',
    'mango.png',
    'orange.png',
    'peach.png',
    'pear.png',
    'pineapple.png',
    'tomato.png',
    'watermelon.png',
  ];

  function setupCanvas() {
    if (!canvas) {
      canvas = document.createElement('canvas');
      container.appendChild(canvas);
      ctx = canvas.getContext('2d');
      canvas.addEventListener('mousemove', handlePointer);
      canvas.addEventListener('touchmove', handleTouch, { passive: false });
    }
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  const pointer = { x: 0, y: 0, prevX: 0, prevY: 0 };

  function handlePointer(e) {
    pointer.prevX = pointer.x;
    pointer.prevY = pointer.y;
    pointer.x = e.offsetX;
    pointer.y = e.offsetY;
  }

  function handleTouch(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    handlePointer({
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    });
  }

  function spawnFruit() {
    const img = new Image();
    img.src = 'images/' +
      fruitImages[Math.floor(Math.random() * fruitImages.length)];
    const radius = 30;
    const x = radius + Math.random() * (canvas.width - radius * 2);
    const y = canvas.height + radius;
    const vx = (Math.random() - 0.5) * 4;
    const vy = -9 - Math.random() * 4;
    fruits.push({ x, y, vx, vy, r: radius, img, sliced: false });
  }

  function update(dt) {
    for (const f of fruits) {
      f.vy += gravity;
      f.x += f.vx;
      f.y += f.vy;

      const dx = f.x - pointer.x;
      const dy = f.y - pointer.y;
      if (!f.sliced && Math.hypot(dx, dy) <= f.r) {
        f.sliced = true;
        score += 1;
        scoreEl.textContent = score;
        sliceSound.currentTime = 0;
        sliceSound.play();
      }
    }
    fruits = fruits.filter((f) => !f.sliced && f.y - f.r < canvas.height);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const f of fruits) {
      ctx.drawImage(f.img, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
    }
  }

  function loop(time) {
    if (!running) return;
    const dt = time - lastTime;
    lastTime = time;

    if (time - lastSpawn > spawnInterval) {
      spawnFruit();
      lastSpawn = time;
    }

    update(dt);
    draw();

    requestAnimationFrame(loop);
  }

  function startGame() {
    container.style.display = 'flex';
    endScreen.style.display = 'none';
    setupCanvas();
    score = 0;
    scoreEl.textContent = score;
    fruits = [];
    running = true;
    lastTime = performance.now();
    lastSpawn = lastTime;
    requestAnimationFrame(loop);
  }

  function endGame() {
    running = false;
    finalScoreEl.textContent = score;
    endScreen.style.display = 'block';
  }

  startBtn.addEventListener('click', () => {
    document.getElementById('menubar').style.display = 'none';
    startGame();
  });

  restartBtn.addEventListener('click', startGame);
  backBtn.addEventListener('click', () => window.location.reload());

  // For now we never automatically end the game. In a real game you could
  // decrease lives when fruits fall off screen and call endGame when lives
  // reach zero.
});
