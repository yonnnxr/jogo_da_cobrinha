const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.querySelector('.score');
const startButton = document.createElement('button'); // Cria o botão start

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
startButton.style.zIndex = '10'; // Garante que o botão fique acima do canvas
document.body.appendChild(startButton);

// Event listeners
document.addEventListener('keydown', handleKeyPress);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
startButton.addEventListener('click', startGame); // Inicia o jogo ao clicar no botão

// Previne o scroll na tela (mobile)
document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });

function handleKeyPress(event) {
    if (isGameRunning) { // Só aceita comandos se o jogo estiver rodando
        switch (event.key) {
            case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
        }
    }
}

function handleTouchStart(event) {
    if (isGameRunning) { // Só aceita comandos se o jogo estiver rodando
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }
}

function handleTouchMove(event) {
    if (isGameRunning && touchStartX && touchStartY) { // Só aceita comandos se o jogo estiver rodando
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
    if (!isGameRunning) return; // Não atualiza se o jogo não estiver rodando

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
        isGameRunning = false; // Para o loop do jogo
        clearInterval(gameLoop); // Para o intervalo
        startButton.style.display = 'block'; // Mostra o botão novamente
        alert('Game Over! Pontuação: ' + score);
        return;
    }

    snake.unshift(head);
    draw();
}

function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) { // Começa a verificação a partir do segundo segmento
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Função para iniciar o jogo
function startGame() {
    if (!isGameRunning) {
        // Reinicia o jogo se ele tiver acabado
        if (gameOver) {
            resetGame();
        }

        isGameRunning = true;
        startButton.style.display = 'none'; // Oculta o botão
        gameLoop = setInterval(update, 150); // Inicia o loop do jogo
    }
}

// Função para reiniciar o jogo
function resetGame() {
    gameOver = false;
    score = 0;
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    nextDirection = direction;
    generateFood();
    scoreElement.textContent = 'Pontuação: ' + score;
    draw(); // Desenha o estado inicial
}

// Configuração inicial
generateFood();
draw(); // Desenha o estado inicial do jogo