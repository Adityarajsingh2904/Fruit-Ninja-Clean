// Basic Fruit Ninja style game implementation using HTML5 Canvas
// Handles fruit spawning, slicing detection and score keeping

window.onload = function () {
  const container = document.getElementById("container");
  const scoreEl = document.getElementById("value");
  const startBtn = document.getElementById("start");
  const sliceSound = document.getElementById("slicesound");

  let canvas, ctx;
  let running = false;
  let fruits = [];
  let lastSpawn = 0;
  let score = 0;
  let lastTime = 0;
  const spawnDelay = 1000; // time between spawns in ms
  const gravity = 0.35;

  const fruitImages = [
    "apple.png",
    "banana.png",
    "grapes.png",
    "mango.png",
    "orange.png",
    "peach.png",
  ];

  function initCanvas() {
    canvas = document.createElement("canvas");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      handleMove({ offsetX: t.clientX, offsetY: t.clientY, preventDefault: () => {} });
    });
  }

  let pointer = { x: 0, y: 0, prevX: 0, prevY: 0 };

  function handleMove(e) {
    e.preventDefault();
    pointer.prevX = pointer.x;
    pointer.prevY = pointer.y;
    pointer.x = e.offsetX;
    pointer.y = e.offsetY;
  }

  function spawnFruit() {
    const img = new Image();
    img.src = "images/" + fruitImages[Math.floor(Math.random() * fruitImages.length)];
    const radius = 30;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = canvas.height + radius;
    const vx = (Math.random() - 0.5) * 4;
    const vy = -8 - Math.random() * 4;
    fruits.push({ x, y, vx, vy, r: radius, img, sliced: false });
  }

  function updateFruits(dt) {
    for (const fruit of fruits) {
      fruit.vy += gravity;
      fruit.x += fruit.vx;
      fruit.y += fruit.vy;

      // simple line-circle intersection for slicing
      const dx = fruit.x - pointer.x;
      const dy = fruit.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (!fruit.sliced && dist < fruit.r) {
        fruit.sliced = true;
        score++;
        scoreEl.textContent = score;
        sliceSound.currentTime = 0;
        sliceSound.play();
      }
    }
    // remove fruits out of screen or sliced
    fruits = fruits.filter((f) => !f.sliced && f.y - f.r < canvas.height);
  }

  function drawFruits() {
    for (const fruit of fruits) {
      ctx.drawImage(fruit.img, fruit.x - fruit.r, fruit.y - fruit.r, fruit.r * 2, fruit.r * 2);
    }
  }

  function gameLoop(time) {
    if (!running) return;
    const dt = time - lastTime;
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (time - lastSpawn > spawnDelay) {
      spawnFruit();
      lastSpawn = time;
    }

    updateFruits(dt);
    drawFruits();

    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    if (!canvas) {
      initCanvas();
    }
    container.style.display = "flex";
    score = 0;
    scoreEl.textContent = score;
    fruits = [];
    running = true;
    lastTime = performance.now();
    lastSpawn = lastTime;
    requestAnimationFrame(gameLoop);
  }

  startBtn.addEventListener("click", () => {
    document.getElementById("menubar").style.display = "none";
    startGame();
  });
};
