const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// Game objects
let player = {
    x: PLAYER_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#4caf50"
};

let ai = {
    x: AI_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#f44336"
};

let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speedX: 6 * (Math.random() < 0.5 ? 1 : -1),
    speedY: 5 * (Math.random() < 0.5 ? 1 : -1),
    color: "#fff"
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
}

function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.speedX = 6 * (Math.random() < 0.5 ? 1 : -1);
    ball.speedY = 5 * (Math.random() < 0.5 ? 1 : -1);
}

function update() {
    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top and bottom wall collision
    if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Left wall (player loses)
    if (ball.x <= 0) {
        resetBall();
    }

    // Right wall (AI loses)
    if (ball.x + BALL_SIZE >= canvas.width) {
        resetBall();
    }

    // Player paddle collision
    if (
        ball.x <= player.x + player.width &&
        ball.y + BALL_SIZE >= player.y &&
        ball.y <= player.y + player.height &&
        ball.x >= player.x
    ) {
        ball.speedX = Math.abs(ball.speedX);
        // Add some spin based on where it hit the paddle
        let collidePoint = (ball.y + BALL_SIZE / 2) - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        ball.speedY = 5 * collidePoint;
    }

    // AI paddle collision
    if (
        ball.x + BALL_SIZE >= ai.x &&
        ball.y + BALL_SIZE >= ai.y &&
        ball.y <= ai.y + ai.height &&
        ball.x <= ai.x + ai.width
    ) {
        ball.speedX = -Math.abs(ball.speedX);
        let collidePoint = (ball.y + BALL_SIZE / 2) - (ai.y + ai.height / 2);
        collidePoint = collidePoint / (ai.height / 2);
        ball.speedY = 5 * collidePoint;
    }

    // AI movement (basic)
    if (ball.y + BALL_SIZE / 2 > ai.y + ai.height / 2) {
        ai.y += AI_SPEED;
    } else if (ball.y + BALL_SIZE / 2 < ai.y + ai.height / 2) {
        ai.y -= AI_SPEED;
    }
    // Prevent AI from moving out of canvas
    ai.y = Math.max(Math.min(ai.y, canvas.height - ai.height), 0);
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function (evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp within bounds
    player.y = Math.max(Math.min(player.y, canvas.height - player.height), 0);
});

// Game loop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawBall(ball.x, ball.y, ball.size, ball.color);

    update();

    requestAnimationFrame(loop);
}

loop();