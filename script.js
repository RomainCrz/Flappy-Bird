const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";
const bestScoreContainer = document.querySelector("#bestScore");
const currentScoreContainer = document.querySelector(".currentScore");

// general settings

let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;

let index = 0;
let bestScore = 0;
if (localStorage.getItem("bestscore")) {
  bestScore = localStorage.getItem("bestscore");
}

let currentScore = 0;
let pipes = [];
let flight = 0;
let flyHeight;
let posX;
let currentPipe = 0;

function setup() {
  flyHeight = canvas.height / 2 - size[1] / 2;
  posX = canvas.width / 2 - size[0] / 2;
  pipes = Array(1000)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
}

const pipeWidth = 78;
const pipeGap = 260;
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth;

img.addEventListener("load", () => {
  setup();
  loop();
});

function loop() {
  let startAnimation = setTimeout(() => {
    index++;
    drawBackground(index);
    if (!gamePlaying) {
      startText();
      birdMove(index);
    } else {
      birdMoveInGame(index);
      drawPipes(index);
      Score();
      bestScoreContainer.textContent = "Meilleur : " + bestScore;
      currentScoreContainer.textContent = "Actuel : " + currentScore;
      console.log(currentScore);
    }

    window.requestAnimationFrame(loop);
  }, 1000 / 60);
}

window.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);

function birdMove(index) {
  if (index % 9 <= 3) {
    ctx.drawImage(img, 432, 0, ...size, posX, flyHeight, ...size);
  } else if (index % 9 <= 6) {
    ctx.drawImage(img, 432, 36, ...size, posX, flyHeight, ...size);
  } else if (index % 9 <= 9) {
    ctx.drawImage(img, 432, 72, ...size, posX, flyHeight, ...size);
  }
}

function birdMoveInGame(index) {
  posX = cTenth;
  flight += gravity;
  if (flyHeight < canvas.height / 2) {
    flyHeight = Math.max(flyHeight + flight, 0);
  } else {
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  }
  birdMove(index);
}

function drawBackground(index) {
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(((index * speed) / 2) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(((index * speed) / 2) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );
}

function drawPipes(index) {
  pipes.map((pipe) => {
    pipe[0] -= speed;
    let pipePoint = false;

    ctx.drawImage(
      img,
      432,
      588 - pipe[1],
      pipeWidth,
      pipe[1],
      pipe[0],
      0,
      pipeWidth,
      pipe[1]
    );

    ctx.drawImage(
      img,
      432 + pipeWidth,
      108,
      pipeWidth,
      canvas.height - pipe[1] + pipeGap,
      pipe[0],
      pipe[1] + pipeGap,
      pipeWidth,
      canvas.height - pipe[1] + pipeGap
    );

    if (checkCollision(pipe[0], pipe[1])) {
      gamePlaying = false;

      if (currentScore > bestScore) {
        bestScore = currentScore;
        localStorage.setItem("bestscore", bestScore);
      }
      currentScore = 0;
      currentPipe = 0;
      setup();
    }
  });
}

function Score() {
  if (pipes[currentPipe][0] <= cTenth) {
    currentScore++;
    currentPipe++;
  }
}

function checkCollision(pipe0, pipe1) {
  if (
    posX >= pipe0 &&
    posX <= pipe0 + pipeWidth &&
    (flyHeight <= pipe1 || flyHeight >= pipe1 + pipeGap)
  ) {
    return true;
  } else {
    return false;
  }
}
function startText() {
  ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
  ctx.font = "bold 30px courier";
  ctx.fillText(`Appuyer pour jouer`, 48, 545);
  ctx.font = "bold 30px courier";
}
