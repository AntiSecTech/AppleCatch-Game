const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverElem = document.getElementById('gameOver');

canvas.width = 800;
canvas.height = 600;

const player = {
    x: 400,
    y: 550,
    width: 150,
    height: 20,
    color: 'green',
    speed: 10
};

const game = {
    fallingObjects: [],
    score: 0,
    lives: 5,
    isOver: false,
    level: 1,
    spawnRate: 0.01,
    maxSpeed: 1.5,
    bonusActive: false,
    bonusTimer: 0,
    slowMotion: false,
    slowMotionTimer: 0
};

const objectTypes = {
    good: { emoji: '🍎', points: 1, probability: 0.6 },
    bad: { emoji: '💣', points: -1, probability: 0.25 },
    bonus: { emoji: '⭐', points: 5, probability: 0.1 },
    slowMotion: { emoji: '⏱️', points: 2, probability: 0.05 }
};

function spawnObject() {
    if (Math.random() < game.spawnRate) {
        const rand = Math.random();
        let type;
        if (rand < objectTypes.good.probability) {
            type = 'good';
        } else if (rand < objectTypes.good.probability + objectTypes.bad.probability) {
            type = 'bad';
        } else {
            type = 'bonus';
        }

        game.fallingObjects.push({
            x: Math.random() * (canvas.width - 40),
            y: 0,
            width: 40,
            height: 40,
            type: type,
            speed: Math.random() * game.maxSpeed + 1
        });
    }
}

function drawObject(object) {
    ctx.font = '30px Arial';
    ctx.fillText(objectTypes[object.type].emoji, object.x, object.y);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function updatePlayer() {
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
}

function updateDifficulty() {
    const newLevel = Math.floor(game.score / 30) + 1;
    if (newLevel > game.level) {
        game.level = newLevel;
        game.spawnRate = Math.min(0.03, game.spawnRate + 0.002);
        game.maxSpeed = Math.min(3, game.maxSpeed + 0.2);
    }
}

const gameState = {
    isStarted: false,
    mode: null
};

function gameLoop() {
    if (!gameState.isStarted || game.isOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    spawnObject();
    updateDifficulty();

    if (game.bonusActive) {
        game.bonusTimer--;
        if (game.bonusTimer <= 0) {
            game.bonusActive = false;
            player.width = 150;
        }
    }

    if (game.slowMotion) {
        game.slowMotionTimer--;
        if (game.slowMotionTimer <= 0) {
            game.slowMotion = false;
        }
    }

    for (let i = game.fallingObjects.length - 1; i >= 0; i--) {
        const object = game.fallingObjects[i];
        object.y += game.slowMotion ? object.speed / 2 : object.speed;

        if (checkCollision(object, player)) {
            const objectInfo = objectTypes[object.type];
            game.score += objectInfo.points;
            if (object.type === 'bonus') {
                game.bonusActive = true;
                game.bonusTimer = 300; // 5 seconds (60 fps * 5)
                player.width = 200; // Increase player width for bonus duration
            } else if (object.type === 'slowMotion') {
                game.slowMotion = true;
                game.slowMotionTimer = 300; // 5 seconds of slow motion
            }
            game.fallingObjects.splice(i, 1);
        } else if (object.y > canvas.height) {
            if (object.type === 'good') {
                game.lives--;
                if (game.lives <= 0) {
                    gameOver();
                    return;
                }
            }
            game.fallingObjects.splice(i, 1);
        } else {
            drawObject(object);
        }
    }

    ctx.fillStyle = game.bonusActive ? 'gold' : (game.slowMotion ? 'blue' : 'green');
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${game.score}`, 10, 30);
    ctx.fillText(`Lives: ${game.lives}`, canvas.width - 100, 30);
    ctx.fillText(`Level: ${game.level}`, canvas.width / 2 - 40, 30);

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    game.isOver = true;
    gameState.isStarted = false;
    gameOverElem.innerHTML = `
        <h1>Game Over</h1>
        <p>Final Score: ${game.score}</p>
        <p>Level Reached: ${game.level}</p>
        <button onclick="restartGame()">Back to Menu</button>
    `;
    gameOverElem.style.display = 'block';
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('startMenu').style.display = 'block';
    gameState.isStarted = false;
}

function startGame(mode) {
    gameState.isStarted = true;
    gameState.mode = mode;
    
    game.fallingObjects = [];
    game.score = 0;
    game.lives = 5;
    game.isOver = false;
    game.level = 1;
    game.spawnRate = 0.01;
    game.maxSpeed = 1.5;
    game.bonusActive = false;
    game.bonusTimer = 0;
    game.slowMotion = false;
    game.slowMotionTimer = 0;
    
    player.x = 400;
    player.width = 150;
    
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    
    gameLoop();
}

function render() {
    if (!gameState.isStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(render);
}

render();
