function setAppHeight() {
  const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${h}px`);
}

setAppHeight();
window.addEventListener("resize", setAppHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", setAppHeight);
}

const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const titleImage = document.getElementById("titleImage");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const homeBtn = document.getElementById("backTitleBtn");
const arcadeBtn = document.getElementById("arcadeBtn");
const shareBtn = document.getElementById("shareBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const dropBtn = document.getElementById("dropBtn");

const countText = document.getElementById("countText");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const resultCanvas = document.getElementById("resultCanvas");
const resultCtx = resultCanvas.getContext("2d");

const resultTitle = document.getElementById("resultTitle");
const resultScore = document.getElementById("resultScore");
const resultComment = document.getElementById("resultComment");

const bgm = document.getElementById("bgm");
const fallSe = document.getElementById("fallSe");

const COLS = 24;
const ROWS = 36;
const CELL = 10;
const PIECE_SCALE = 2;
const MAX_PIECES = 20;

const GAME_URL = "https://afoolhippo.github.io/game12/";
const HOME_URL = "https://afoolhippo.github.io/home/?skipTitle=1";

const MATERIALS = {
  coffee: { color: "#7a3f22" },
  milk: { color: "#f1e6c8" },
  water: { color: "#78a8c8" },
  gravel: { color: "#77776d" }
};

const MATERIAL_LIST = ["coffee", "coffee", "milk", "milk", "water", "gravel"];

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]]
];

let grid;
let piece;
let piecesDropped = 0;
let gameLoop = null;
let dropCounter = 0;
let sandCounter = 0;
let running = false;
let lastScore = 0;
let lastTitle = "結果";

function playBgm() {
  bgm.volume = 0.55;
  bgm.currentTime = 0;
  bgm.play().catch(() => {});
}

function stopBgm() {
  bgm.pause();
  bgm.currentTime = 0;
}

function playFall() {
  fallSe.currentTime = 0;
  fallSe.volume = 0.85;
  fallSe.play().catch(() => {});
}

function showScreen(screen) {
  [titleScreen, gameScreen, resultScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function emptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createPiece() {
  const shape = rand(SHAPES).map(row => [...row]);
  const width = shape[0].length * PIECE_SCALE;

  return {
    shape,
    material: rand(MATERIAL_LIST),
    x: Math.floor((COLS - width) / 2),
    y: 0
  };
}

function startGame() {
  grid = emptyGrid();
  piecesDropped = 0;
  dropCounter = 0;
  sandCounter = 0;
  running = true;
  countText.textContent = "0";
  piece = createPiece();

  showScreen(gameScreen);
  playBgm();

  cancelAnimationFrame(gameLoop);
  loop();
}

function loop() {
  if (!running) return;

  dropCounter++;
  sandCounter++;

  if (dropCounter >= 12) {
    softDrop();
    dropCounter = 0;
  }

  if (sandCounter >= 2) {
    updateSand();
    sandCounter = 0;
  }

  if (Math.random() < 0.12) {
    loosenRandomBlock();
  }

  draw();
  gameLoop = requestAnimationFrame(loop);
}

function getPieceCells(targetPiece = piece) {
  const cells = [];
  if (!targetPiece) return cells;

  for (let y = 0; y < targetPiece.shape.length; y++) {
    for (let x = 0; x < targetPiece.shape[y].length; x++) {
      if (!targetPiece.shape[y][x]) continue;

      for (let sy = 0; sy < PIECE_SCALE; sy++) {
        for (let sx = 0; sx < PIECE_SCALE; sx++) {
          cells.push({
            x: targetPiece.x + x * PIECE_SCALE + sx,
            y: targetPiece.y + y * PIECE_SCALE + sy
          });
        }
      }
    }
  }

  return cells;
}

function canMove(dx, dy, targetPiece = piece) {
  if (!targetPiece) return false;

  for (const c of getPieceCells(targetPiece)) {
    const nx = c.x + dx;
    const ny = c.y + dy;

    if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
    if (ny >= 0 && grid[ny][nx]) return false;
  }

  return true;
}

function movePiece(dx) {
  if (!running || !piece) return;

  if (canMove(dx, 0)) {
    piece.x += dx;
    draw();
  }
}

function softDrop() {
  if (!running || !piece) return;

  if (canMove(0, 1)) {
    piece.y++;
  } else {
    lockPiece();
  }
}

function hardDropPiece() {
  if (!running || !piece) return;

  while (canMove(0, 1)) {
    piece.y++;
  }

  lockPiece();
  draw();
}

function lockPiece() {
  if (!piece) return;

  const lockedPiece = piece;

  for (const c of getPieceCells(lockedPiece)) {
    if (c.y >= 0 && c.y < ROWS && c.x >= 0 && c.x < COLS) {
      grid[c.y][c.x] = {
        type: lockedPiece.material,
        color: MATERIALS[lockedPiece.material].color
      };
    }
  }

  piece = null;
  piecesDropped++;
  countText.textContent = String(piecesDropped);

  for (let i = 0; i < 20; i++) updateSand();

  if (piecesDropped >= MAX_PIECES) {
    finishGame();
    return;
  }

  piece = createPiece();

  if (!canMove(0, 0, piece)) {
    finishGame();
  }
}

function loosenRandomBlock() {
  const candidates = [];

  for (let y = 0; y < ROWS - 1; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] && !grid[y + 1][x]) {
        candidates.push({ x, y });
      }
    }
  }

  if (!candidates.length) return;

  const p = rand(candidates);
  grid[p.y + 1][p.x] = grid[p.y][p.x];
  grid[p.y][p.x] = null;
}

function updateSand() {
  for (let y = ROWS - 2; y >= 0; y--) {
    const startLeft = Math.random() < 0.5;

    for (let i = 0; i < COLS; i++) {
      const x = startLeft ? i : COLS - 1 - i;
      const cell = grid[y][x];

      if (!cell) continue;
      if (Math.random() > getMoveChance(cell.type)) continue;

      if (!grid[y + 1][x]) {
        grid[y + 1][x] = cell;
        grid[y][x] = null;
      } else {
        const dir = Math.random() < 0.5 ? -1 : 1;
        const nx1 = x + dir;
        const nx2 = x - dir;

        if (canSandMove(nx1, y + 1)) {
          grid[y + 1][nx1] = cell;
          grid[y][x] = null;
        } else if (canSandMove(nx2, y + 1)) {
          grid[y + 1][nx2] = cell;
          grid[y][x] = null;
        }
      }
    }
  }
}

function canSandMove(x, y) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS && !grid[y][x];
}

function getMoveChance(type) {
  if (type === "water") return 0.85;
  if (type === "milk") return 0.48;
  if (type === "coffee") return 0.45;
  if (type === "gravel") return 0.18;
  return 0.35;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f8efd9";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (!cell) continue;
      drawBlock(ctx, x * CELL, y * CELL, CELL, cell.color);
    }
  }

  if (piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (!piece.shape[y][x]) continue;

        drawBlock(
          ctx,
          (piece.x + x * PIECE_SCALE) * CELL,
          (piece.y + y * PIECE_SCALE) * CELL,
          CELL * PIECE_SCALE,
          MATERIALS[piece.material].color
        );
      }
    }
  }

  ctx.strokeStyle = "#2d1b14";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
}

function drawBlock(targetCtx, x, y, size, color) {
  targetCtx.fillStyle = color;
  targetCtx.fillRect(x, y, size, size);

  targetCtx.fillStyle = "rgba(255,255,255,0.18)";
  targetCtx.fillRect(x + 1, y + 1, size - 2, Math.max(2, size * 0.16));

  targetCtx.strokeStyle = "rgba(45,27,20,0.35)";
  targetCtx.lineWidth = 1;
  targetCtx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
}

function finishGame() {
  if (!running) return;

  running = false;
  cancelAnimationFrame(gameLoop);

  for (let i = 0; i < 80; i++) updateSand();

  stopBgm();

  const score = evaluate();
  lastScore = score.point;
  lastTitle = score.title;

  drawResultPreview();
  showResult(score);
  showScreen(resultScreen);
}

function evaluate() {
  let coffee = 0;
  let milk = 0;
  let water = 0;
  let gravel = 0;
  let total = 0;
  let coffeeMilkTouch = 0;

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (!cell) continue;

      total++;

      if (cell.type === "coffee") coffee++;
      if (cell.type === "milk") milk++;
      if (cell.type === "water") water++;
      if (cell.type === "gravel") gravel++;

      if (cell.type === "coffee") {
        const neighbors = [
          grid[y]?.[x + 1],
          grid[y + 1]?.[x],
          grid[y]?.[x - 1],
          grid[y - 1]?.[x]
        ];

        neighbors.forEach(n => {
          if (n && n.type === "milk") coffeeMilkTouch++;
        });
      }
    }
  }

  if (!total) {
    return { point: 0, title: "空のコップ", comment: "何も入っていない。" };
  }

  const coffeeRate = coffee / total;
  const milkRate = milk / total;
  const waterRate = water / total;
  const gravelRate = gravel / total;

  let point = 100;
  point -= Math.abs(coffeeRate - 0.42) * 85;
  point -= Math.abs(milkRate - 0.38) * 85;
  point -= Math.abs(waterRate - 0.14) * 70;
  point -= gravelRate * 150;

  const idealTouch = 95;
  const mixPoint = Math.max(0, 24 - Math.abs(coffeeMilkTouch - idealTouch) * 0.18);
  point += mixPoint;

  point = Math.max(0, Math.min(100, Math.round(point)));

  if (point >= 85) {
    return { point, title: "駅前喫茶店", comment: "かなりカフェオレ。混ざりも上品。" };
  }

  if (point >= 65) {
    return { point, title: "ぬるめの一杯", comment: "飲めなくはない。むしろ少し好き。" };
  }

  if (point >= 40) {
    return { point, title: "砂場ラテ", comment: "カフェオレの気配だけはある。" };
  }

  if (point >= 20) {
    return { point, title: "深夜の泥水", comment: "別の意味で眠気覚まし。" };
  }

  return { point, title: "排水口ブレンド", comment: "これは飲み物ではない。" };
}


function drawResultPreview() {
  resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
  resultCtx.fillStyle = "#f8efd9";
  resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

  const scale = 7;
  const offsetX = Math.floor((resultCanvas.width - COLS * scale) / 2);
  const startY = ROWS - 24;

  for (let y = startY; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (!cell) continue;

      resultCtx.fillStyle = cell.color;
      resultCtx.fillRect(offsetX + x * scale, 8 + (y - startY) * scale, scale, scale);
    }
  }

  resultCtx.strokeStyle = "#2d1b14";
  resultCtx.lineWidth = 3;
  resultCtx.strokeRect(1.5, 1.5, resultCanvas.width - 3, resultCanvas.height - 3);
}

function showResult(score) {
  resultTitle.textContent = score.title;
  resultScore.textContent = `カフェオレっぽさ ${score.point}%`;
  resultComment.textContent = score.comment;
}

function pressButton(btn) {
  btn.style.transform = "translateY(3px)";
  setTimeout(() => {
    btn.style.transform = "";
  }, 90);
}

function goTitle() {
  running = false;
  cancelAnimationFrame(gameLoop);
  stopBgm();
  showScreen(titleScreen);
}

function shareX() {
  const text =
`テトリスコーヒーでカフェオレを作った☕🧱
称号：${lastTitle}
カフェオレっぽさ ${lastScore}%

無料ブラウザゲーム「テトリスコーヒー」
${GAME_URL}
#テトリスコーヒー #カバゲーセン`;

  const shareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  window.location.href = shareUrl;
}

startBtn.addEventListener("click", startGame);
titleImage.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);
homeBtn.addEventListener("click", goTitle);
shareBtn.addEventListener("click", shareX);

arcadeBtn.addEventListener("click", () => {
  location.href = HOME_URL;
});

leftBtn.addEventListener("click", () => {
  pressButton(leftBtn);
  movePiece(-2);
});

rightBtn.addEventListener("click", () => {
  pressButton(rightBtn);
  movePiece(2);
});

dropBtn.addEventListener("click", () => {
  pressButton(dropBtn);
  playFall();
  hardDropPiece();
});

window.addEventListener("keydown", e => {
  if (!running) return;

  if (e.key === "ArrowLeft") movePiece(-2);
  if (e.key === "ArrowRight") movePiece(2);

  if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
    playFall();
    hardDropPiece();
  }
});