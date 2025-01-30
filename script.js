const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.querySelector('.score');
const startButton = document.createElement('button');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let nextDirection = direction;
let score = 0;
let gameOver = false;
let isGameRunning = false;
let touchStartX = 0;
let touchStartY = 0;
let gameLoop;

// Estiliza o botão "Start"
startButton.textContent = 'Start';
startButton.style.position = 'absolute';
startButton.style.top = '50%';
startButton.style.left = '50%';
startButton.style.transform = 'translate(-50%, -50%)';
startButton.style.padding = '10px 20px';
startButton.style.fontSize = '20px';
startButton.style.zIndex = '10';
document.body.appendChild(startButton);

// Configura o canvas para ocupar a tela toda
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Event listeners
document.addEventListener('keydown', handleKeyPress);
startButton.addEventListener('click', startGame);

// Previne o scroll na tela (mobile)
document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });

// Adapta o canvas ao tamanho da tela
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Você pode precisar redesenhar o jogo aqui se o tamanho mudar
}

window.addEventListener('resize', resizeCanvas);

function handleKeyPress(event) {
    if (isGameRunning) {
        switch (event.key) {
            case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
        }
    }
}

// Touch events
canvas.addEventListener('touchstart', function(event) {
    if (!isGameRunning) {
        startGame(); // Inicia o jogo se ainda não estiver rodando
    } else {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }
    event.preventDefault(); // Previne comportamento padrão de toque
}, false);

canvas.addEventListener('touchmove', function(event) {
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

    touchStartX = 0; // Reseta a posição inicial X do toque
    touchStartY = 0; // Reseta a posição inicial Y do toque
    event.preventDefault(); // Previne comportamento padrão de toque
}, false);

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
    if (!isGameRunning) return;

    direction = nextDirection;
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
        isGameRunning = false;
        clearInterval(gameLoop);
        startButton.style.display = 'block';
        alert('By yonxr_ \nGame Over! \nPontuação: ' + score);
        return;
    }

    snake.unshift(head);
    draw();
}

function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function startGame() {
    if (!isGameRunning) {
        if (gameOver) {
            resetGame();
        }

        isGameRunning = true;
        startButton.style.display = 'none';
        gameLoop = setInterval(update, 150);
    }
}

function resetGame() {
    gameOver = false;
    score = 0;
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    nextDirection = direction;
    generateFood();
    scoreElement.textContent = 'Pontuação: ' + score;
    draw();
}

// Configuração inicial
generateFood();
draw();