const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.querySelector('.score');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let nextDirection = direction; // Fila para a próxima direção
let score = 0;
let gameOver = false;
let isGameRunning = false; // Controla se o jogo está rodando
let touchStartX = 0;
let touchStartY = 0;
let gameLoop; // Variável para o intervalo do jogo

document.addEventListener('keydown', handleKeyPress);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

function handleKeyPress(event) {
    if (!isGameRunning) {
        isGameRunning = true;
    }
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
    }
}

function handleTouchStart(event) {
    if (!isGameRunning) {
        isGameRunning = true;
    }
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        nextDirection = (dx > 0 && direction !== 'left') ? 'right' : (dx < 0 && direction !== 'right') ? 'left' : nextDirection;
    } else {
        nextDirection = (dy > 0 && direction !== 'up') ? 'down' : (dy < 0 && direction !== 'down') ? 'up' : nextDirection;
    }

    touchStartX = 0;
    touchStartY = 0;
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = i === 0 ? 'green' : 'lime';
        context.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    context.fillStyle = 'red';
    context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    if (!isGameRunning || gameOver) {
        return;
    }

    direction = nextDirection; // Atualiza a direção no início do ciclo

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = 'Pontuação: ' + score;
        generateFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || checkCollision(head)) {
        gameOver = true;
        alert('Game Over! Pontuação: ' + score);
        clearInterval(gameLoop); // Para o loop do jogo
        return;
    }

    snake.unshift(head);
    draw();
}

function checkCollision(head) {
    for (let i = 4; i < snake.length; i++) { // Começa a verificar a partir do 5º segmento (índice 4)
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

generateFood();
gameLoop = setInterval(update, 150); // Aumentado o intervalo para 150 milissegundos