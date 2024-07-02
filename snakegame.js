const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake = [];

snake[0] = {
    x: (Math.floor(Math.random() * columns)) * scale,
    y: (Math.floor(Math.random() * rows)) * scale
};

let food = {
    x: (Math.floor(Math.random() * columns)) * scale,
    y: (Math.floor(Math.random() * rows)) * scale
};

let d = "right";
let result = 0;
let gameOver = false;
let restartDelay = 2000; // 2000 milliseconds = 2 seconds

document.onkeydown = direction;

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "right") {
        d = "left";
    } else if (key == 38 && d != "down") {
        d = "up";
    } else if (key == 39 && d != "left") {
        d = "right";
    } else if (key == 40 && d != "up") {
        d = "down";
    }
}

let playGame;

function startGame() {
    snake = [{
        x: (Math.floor(Math.random() * columns)) * scale,
        y: (Math.floor(Math.random() * rows)) * scale
    }];
    food = {
        x: (Math.floor(Math.random() * columns)) * scale,
        y: (Math.floor(Math.random() * rows)) * scale
    };
    d = "right";
    result = 0;
    gameOver = false;
    playGame = setInterval(draw, 100);
    document.getElementById('restartButton').classList.add('hide');
}

startGame();

canvas.addEventListener('click', function () {
    if (gameOver) {
        startGame();
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "red";
        ctx.fillRect(snake[i].x, snake[i].y, scale, scale);
        ctx.strokeRect(snake[i].x, snake[i].y, scale, scale);
    }

    ctx.fillStyle = "#ff0";
    ctx.strokeStyle = "green";
    ctx.fillRect(food.x, food.y, scale, scale);
    ctx.strokeRect(food.x, food.y, scale, scale);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "left") snakeX -= scale;
    if (d == "up") snakeY -= scale;
    if (d == "right") snakeX += scale;
    if (d == "down") snakeY += scale;

    if (snakeX >= canvas.width) {
        snakeX = 0;
    }
    if (snakeY >= canvas.height) {
        snakeY = 0;
    }
    if (snakeX < 0) {
        snakeX = canvas.width - scale;
    }
    if (snakeY < 0) {
        snakeY = canvas.height - scale;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        result++;
        food = {
            x: (Math.floor(Math.random() * columns)) * scale,
            y: (Math.floor(Math.random() * rows)) * scale
        };
    } else {
        snake.pop();
    }

    // Check if snake eats itself
    if (eatSelf(newHead, snake)) {
        clearInterval(playGame);
        gameOver = true;
        setTimeout(() => {
            document.getElementById('restartButton').classList.remove('hide');
            positionRestartButton();
        }, restartDelay);
        displayGameOver();
    }

    snake.unshift(newHead);

    // Display result
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + result, 10, 30);
}

function eatSelf(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function displayGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over! Score: ' + result, canvas.width / 2 - 120, canvas.height / 2);
}

function positionRestartButton() {
    const restartButton = document.getElementById('restartButton');
    restartButton.style.position = 'absolute';
    restartButton.style.left = (canvas.offsetLeft + (canvas.width - restartButton.offsetWidth) / 2) + 'px';
    restartButton.style.top = (canvas.offsetTop + (canvas.height / 2) + 20) + 'px';
}

// Event listener for restart button
document.getElementById('restartButton').addEventListener('click', function() {
    startGame();
});
