function setAppHeight() {
  const h = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;

  document.documentElement.style.setProperty(
    "--app-height",
    `${h}px`
  );
}

setAppHeight();

window.addEventListener("resize", setAppHeight);

if (window.visualViewport) {
  window.visualViewport.addEventListener(
    "resize",
    setAppHeight
  );
}

const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const homeBtn = document.getElementById("homeBtn");

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

const piSe = document.getElementById("piSe");

const COLS = 24;
const ROWS = 36;

const CELL = 10;
const PIECE_SCALE = 2;

const MAX_PIECES = 20;

const MATERIALS = {
  coffee: {
    color: "#7a3f22"
  },

  milk: {
    color: "#f1e6c8"
  },

  water: {
    color: "#78a8c8"
  },

  gravel: {
    color: "#77776d"
  }
};

const MATERIAL_LIST = [
  "coffee",
  "coffee",
  "milk",
  "milk",
  "water",
  "gravel"
];

const SHAPES = [
  [[1,1,1,1]],

  [[1,1],[1,1]],

  [[0,1,0],[1,1,1]],

  [[1,0,0],[1,1,1]],

  [[0,0,1],[1,1,1]]
];

let grid;
let piece;

let piecesDropped;

let gameLoop;

let dropCounter;
let sandCounter;

let running;

let inputLocked = false;

function playPi() {
  piSe.currentTime = 0;
  piSe.play();
}

function showScreen(screen) {
  [
    titleScreen,
    gameScreen,
    resultScreen
  ].forEach(s => s.classList.remove("active"));

  screen.classList.add("active");
}

function emptyGrid() {
  return Array.from(
    { length: ROWS },
    () => Array(COLS).fill(null)
  );
}

function rand(arr) {
  return arr[
    Math.floor(Math.random() * arr.length)
  ];
}

function createPiece() {
  return {
    shape: rand(SHAPES),
    material: rand(MATERIAL_LIST),

    x: Math.floor(COLS / 2) - 4,
    y: 0
  };
}

function startGame() {

  grid = emptyGrid();

  piece = createPiece();

  piecesDropped = 0;

  dropCounter = 0;
  sandCounter = 0;

  running = true;

  countText.textContent = 0;

  showScreen(gameScreen);

  cancelAnimationFrame(gameLoop);

  loop();
}

function loop() {

  if (!running) return;

  dropCounter++;
  sandCounter++;

  if (dropCounter >= 14) {
    dropPiece();
    dropCounter = 0;
  }

  if (sandCounter >= 3) {
    updateSand();
    sandCounter = 0;
  }

  if (Math.random() < 0.1) {
    loosenRandomBlock();
  }

  draw();

  gameLoop = requestAnimationFrame(loop);
}

function forEachPieceCell(callback) {

  for (let y = 0; y < piece.shape.length; y++) {

    for (let x = 0; x < piece.shape[y].length; x++) {

      if (!piece.shape[y][x]) continue;

      for (let sy = 0; sy < PIECE_SCALE; sy++) {

        for (let sx = 0; sx < PIECE_SCALE; sx++) {

          callback(
            piece.x + x * PIECE_SCALE + sx,
            piece.y + y * PIECE_SCALE + sy
          );
        }
      }
    }
  }
}

function canMove(dx, dy) {

  let ok = true;

  forEachPieceCell((gx, gy) => {

    const nx = gx + dx;
    const ny = gy + dy;

    if (
      nx < 0 ||
      nx >= COLS ||
      ny >= ROWS
    ) {
      ok = false;
    }

    if (
      ny >= 0 &&
      grid[ny][nx]
    ) {
      ok = false;
    }

  });

  return ok;
}

function movePiece(dx) {

  if (
    !running ||
    inputLocked ||
    !piece
  ) return;

  if (canMove(dx, 0)) {

    piece.x += dx;

    draw();
  }
}

function dropPiece() {

  if (
    !running ||
    inputLocked ||
    !piece
  ) return;

  if (canMove(0, 1)) {

    piece.y++;

  } else {

    lockPiece();
  }
}

function hardDropPiece() {

  if (
    !running ||
    inputLocked ||
    !piece
  ) return;

  inputLocked = true;

  while (canMove(0,1)) {
    piece.y++;
  }

  lockPiece();

  inputLocked = false;

  draw();
}

function lockPiece() {

  const lockedPiece = piece;

  for (let y = 0; y < lockedPiece.shape.length; y++) {

    for (let x = 0; x < lockedPiece.shape[y].length; x++) {

      if (!lockedPiece.shape[y][x]) continue;

      for (let sy = 0; sy < PIECE_SCALE; sy++) {

        for (let sx = 0; sx < PIECE_SCALE; sx++) {

          const gx =
            lockedPiece.x +
            x * PIECE_SCALE +
            sx;

          const gy =
            lockedPiece.y +
            y * PIECE_SCALE +
            sy;

          if (
            gy >= 0 &&
            gy < ROWS &&
            gx >= 0 &&
            gx < COLS
          ) {

            grid[gy][gx] = {
              type: lockedPiece.material,
              color: MATERIALS[
                lockedPiece.material
              ].color
            };
          }
        }
      }
    }
  }

  piece = null;

  piecesDropped++;

  countText.textContent = piecesDropped;

  for (let i = 0; i < 18; i++) {
    updateSand();
  }

  if (piecesDropped >= MAX_PIECES) {

    finishGame();

    return;
  }

  piece = createPiece();

  if (!canMove(0,0)) {
    finishGame();
  }
}

function loosenRandomBlock() {

  const candidates = [];

  for (let y = 0; y < ROWS - 1; y++) {

    for (let x = 0; x < COLS; x++) {

      if (!grid[y][x]) continue;

      if (!grid[y+1][x]) {
        candidates.push({x,y});
      }
    }
  }

  if (!candidates.length) return;

  const p = rand(candidates);

  const cell = grid[p.y][p.x];

  grid[p.y][p.x] = null;
  grid[p.y+1][p.x] = cell;
}

function updateSand() {

  for (let y = ROWS - 2; y >= 0; y--) {

    for (let x = 0; x < COLS; x++) {

      const cell = grid[y][x];

      if (!cell) continue;

      if (!grid[y+1][x]) {

        grid[y+1][x] = cell;
        grid[y][x] = null;

      } else {

        const dir =
          Math.random() < 0.5 ? -1 : 1;

        const nx = x + dir;

        if (
          nx >= 0 &&
          nx < COLS &&
          !grid[y+1][nx]
        ) {

          grid[y+1][nx] = cell;
          grid[y][x] = null;
        }
      }
    }
  }
}

function draw() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle = "#f8efd9";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  for (let y = 0; y < ROWS; y++) {

    for (let x = 0; x < COLS; x++) {

      const cell = grid[y][x];

      if (!cell) continue;

      drawBlock(
        x * CELL,
        y * CELL,
        CELL,
        cell.color
      );
    }
  }

  if (piece) {

    for (let y = 0; y < piece.shape.length; y++) {

      for (let x = 0; x < piece.shape[y].length; x++) {

        if (!piece.shape[y][x]) continue;

        drawBlock(
          (piece.x + x * PIECE_SCALE) * CELL,
          (piece.y + y * PIECE_SCALE) * CELL,
          CELL * PIECE_SCALE,
          MATERIALS[piece.material].color
        );
      }
    }
  }
}

function drawBlock(x,y,size,color) {

  ctx.fillStyle = color;

  ctx.fillRect(x,y,size,size);

  ctx.fillStyle =
    "rgba(255,255,255,0.18)";

  ctx.fillRect(
    x+1,
    y+1,
    size-2,
    Math.max(2,size*0.18)
  );

  ctx.strokeStyle =
    "rgba(38,53,31,0.35)";

  ctx.strokeRect(
    x+0.5,
    y+0.5,
    size-1,
    size-1
  );
}

function finishGame() {

  running = false;

  cancelAnimationFrame(gameLoop);

  const score = evaluate();

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

  for (let y = 0; y < ROWS; y++) {

    for (let x = 0; x < COLS; x++) {

      const cell = grid[y][x];

      if (!cell) continue;

      total++;

      if (cell.type === "coffee") coffee++;
      if (cell.type === "milk") milk++;
      if (cell.type === "water") water++;
      if (cell.type === "gravel") gravel++;
    }
  }

  if (!total) {

    return {
      point: 0,
      title: "空のコップ",
      comment: "何も入っていない。"
    };
  }

  const coffeeRate = coffee / total;
  const milkRate = milk / total;
  const waterRate = water / total;
  const gravelRate = gravel / total;

  let point = 100;

  point -=
    Math.abs(coffeeRate - 0.42) * 95;

  point -=
    Math.abs(milkRate - 0.38) * 95;

  point -=
    Math.abs(waterRate - 0.14) * 80;

  point -=
    gravelRate * 160;

  point = Math.max(
    0,
    Math.min(100, Math.round(point))
  );

  let title;
  let comment;

  if (point >= 85) {

    title = "駅前喫茶店";
    comment =
      "かなりカフェオレ。";

  } else if (point >= 65) {

    title = "ぬるめの一杯";
    comment =
      "飲めなくはない。";

  } else if (point >= 40) {

    title = "砂場ラテ";
    comment =
      "気配だけはある。";

  } else {

    title = "深夜の泥水";
    comment =
      "別の意味で眠気覚まし。";
  }

  return {
    point,
    title,
    comment
  };
}

function drawResultPreview() {

  resultCtx.clearRect(
    0,
    0,
    resultCanvas.width,
    resultCanvas.height
  );

  resultCtx.fillStyle = "#f8efd9";

  resultCtx.fillRect(
    0,
    0,
    resultCanvas.width,
    resultCanvas.height
  );

  const scale = 7;

  const offsetX =
    Math.floor(
      (resultCanvas.width - COLS * scale) / 2
    );

  for (let y = ROWS - 24; y < ROWS; y++) {

    for (let x = 0; x < COLS; x++) {

      const cell = grid[y][x];

      if (!cell) continue;

      resultCtx.fillStyle = cell.color;

      resultCtx.fillRect(
        offsetX + x * scale,
        (y - (ROWS - 24)) * scale + 8,
        scale,
        scale
      );
    }
  }
}

function showResult(score) {

  resultTitle.textContent =
    score.title;

  resultScore.textContent =
    `カフェオレっぽさ ${score.point}%`;

  resultComment.textContent =
    score.comment;
}

function pressButton(btn) {

  btn.style.transform =
    "translateY(3px)";

  setTimeout(() => {

    btn.style.transform = "";

  }, 90);
}

startBtn.addEventListener(
  "click",
  startGame
);

retryBtn.addEventListener(
  "click",
  startGame
);

homeBtn.addEventListener(
  "click",
  () => {

    running = false;

    cancelAnimationFrame(gameLoop);

    showScreen(titleScreen);
  }
);

leftBtn.addEventListener(
  "click",
  () => {

    pressButton(leftBtn);

    movePiece(-2);

    playPi();
  }
);

rightBtn.addEventListener(
  "click",
  () => {

    pressButton(rightBtn);

    movePiece(2);

    playPi();
  }
);

dropBtn.addEventListener(
  "click",
  () => {

    pressButton(dropBtn);

    hardDropPiece();
  }
);

window.addEventListener(
  "keydown",
  e => {

    if (!running) return;

    if (e.key === "ArrowLeft") {

      movePiece(-2);

      playPi();
    }

    if (e.key === "ArrowRight") {

      movePiece(2);

      playPi();
    }

    if (
      e.key === " " ||
      e.key === "Enter" ||
      e.key === "ArrowDown"
    ) {

      hardDropPiece();
    }
  }
);