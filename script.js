const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";

// general settings

let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;

let index = 0;
let bestScore = 0;
let currentScore = 0;
let pipes = [];
let flight = 0;
let flyHeight = canvas.height / 2 - size[1] / 2;
let posX = canvas.width / 2 - size[0] / 2;

const pipeWidth = 78;
const pipeGap = 260;
const pipeLoc = () =>
    Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
    pipeWidth;

img.addEventListener("load", () => {
    loop();
    pipes = Array(100)
        .fill()
        .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);

    console.log(pipes);
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
            drawPipesDown(index);
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

function drawPipesDown(index) {
    pipes.map((pipe) => {
        pipe[0] -= speed;

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
    });
}
function startText() {
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.font = "bold 30px courier";
    ctx.fillText(`Appuyer pour jouer`, 48, 545);
    ctx.font = "bold 30px courier";
}
