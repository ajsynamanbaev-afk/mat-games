function switchGame(game) {
    const mathGame = document.getElementById('math-game');
    const englishGame = document.getElementById('english-game');
    const cubeGame = document.getElementById('cube-game');
    const spaceGame = document.getElementById('space-game');

    if (mathGame) mathGame.classList.add('hidden');
    if (englishGame) englishGame.classList.add('hidden');
    if (cubeGame) cubeGame.classList.add('hidden');
    if (spaceGame) spaceGame.classList.add('hidden');

    if (game === 'math' && mathGame) mathGame.classList.remove('hidden');
    else if (game === 'english' && englishGame) englishGame.classList.remove('hidden');
    else if (game === 'cube' && cubeGame) cubeGame.classList.remove('hidden');
    else if (game === 'space' && spaceGame) {
        spaceGame.classList.remove('hidden');
        setTimeout(initSpaceEngine, 50); // Небольшая задержка, чтобы браузер успел отобразить canvas
    }
}

// ==========================================
// LOGIKA 1: MATEMATIKALIQ ARQAN TARTIS
// ==========================================
let mathRopePosition = 50;
let p1MathAnswer = 0;
let p2MathAnswer = 0;

function generateMathQuestion(player) {
    let num1 = Math.floor(Math.random() * 12) + 2;
    let num2 = Math.floor(Math.random() * 12) + 2;
    let isPlus = Math.random() > 0.5;
    let answer = isPlus ? num1 + num2 : num1 - num2;
    let sign = isPlus ? '+' : '-';

    if (player === 1) {
        p1MathAnswer = answer;
        const q1 = document.getElementById('p1-question');
        if (q1) q1.innerText = `${num1} ${sign} ${num2} = ?`;
    } else {
        p2MathAnswer = answer;
        const q2 = document.getElementById('p2-question');
        if (q2) q2.innerText = `${num1} ${sign} ${num2} = ?`;
    }
}

function checkMathAnswer(player) {
    if (player === 1) {
        let input = document.getElementById('p1-input');
        if (input && input.value !== '' && parseInt(input.value) === p1MathAnswer) {
            mathRopePosition -= 6;
            input.value = '';
            generateMathQuestion(1);
        }
    } else {
        let input = document.getElementById('p2-input');
        if (input && input.value !== '' && parseInt(input.value) === p2MathAnswer) {
            mathRopePosition += 6;
            input.value = '';
            generateMathQuestion(2);
        }
    }

    if (mathRopePosition < 10) { alert("1-Oyınshı jeńdi! 🎉"); mathRopePosition = 50; }
    else if (mathRopePosition > 90) { alert("2-Oyınshı jeńdi! 🎉"); mathRopePosition = 50; }
    const marker = document.getElementById('math-rope-marker');
    if (marker) marker.style.left = mathRopePosition + '%';
}

function pressNum(player, char) {
    let input = document.getElementById(player === 1 ? 'p1-input' : 'p2-input');
    if (input) {
        if (char === 'C') input.value = '';
        else input.value += char;
        checkMathAnswer(player);
    }
}

// ==========================================
// LOGIKA 2: ANGLIYSKIY ARQAN TARTIS
// ==========================================
let engRopePosition = 50;
let p1EngCurrentPair = {};
let p2EngCurrentPair = {};

const wordDictionary = [
    { kaa: "Mektep", eng: "school" }, { kaa: "Kitap", eng: "book" },
    { kaa: "Alma", eng: "apple" }, { kaa: "Pishiq", eng: "cat" },
    { kaa: "Futbol", eng: "football" }, { kaa: "Suw", eng: "water" },
    { kaa: "Dos", eng: "friend" }, { kaa: "Úy", eng: "house" },
    { kaa: "Qálem", eng: "pen" }, { kaa: "Kún", eng: "day" },
    { kaa: "tún", eng: "night" }, { kaa: "bay", eng: "rich" },
    { kaa: "qum", eng: "sand" }, { kaa: "aydaw", eng: "drive" }
];

function generateEngQuestion(player) {
    let wordPair = wordDictionary[Math.floor(Math.random() * wordDictionary.length)];
    if (player === 1) {
        p1EngCurrentPair = wordPair;
        if (document.getElementById('p1-eng-word')) document.getElementById('p1-eng-word').innerText = wordPair.kaa;
    } else {
        p2EngCurrentPair = wordPair;
        if (document.getElementById('p2-eng-word')) document.getElementById('p2-eng-word').innerText = wordPair.kaa;
    }
}

function checkEngAnswer(player) {
    if (player === 1) {
        let input = document.getElementById('p1-eng-input');
        if (input && input.value.toLowerCase().trim() === p1EngCurrentPair.eng) {
            engRopePosition -= 6; input.value = ''; generateEngQuestion(1);
        }
    } else {
        let input = document.getElementById('p2-eng-input');
        if (input && input.value.toLowerCase().trim() === p2EngCurrentPair.eng) {
            engRopePosition += 6; input.value = ''; generateEngQuestion(2);
        }
    }
    if (engRopePosition < 10) { alert("1-Oyınshı jeńdi! 🎉"); engRopePosition = 50; }
    else if (engRopePosition > 90) { alert("2-Oyınshı jeńdi! 🎉"); engRopePosition = 50; }
    if (document.getElementById('eng-rope-marker')) document.getElementById('eng-rope-marker').style.left = engRopePosition + '%';
}

function pressLetter(player, char) {
    let input = document.getElementById(player === 1 ? 'p1-eng-input' : 'p2-eng-input');
    if (input) {
        if (char === 'C') input.value = '';
        else input.value += char.toLowerCase();
        checkEngAnswer(player);
    }
}

// ==========================================
// LOGIKA 3: KOSMOSLIQ ATIS OYINI (2D GAME)
// ==========================================
let canvas, ctx;
let gameRunning = false;
let score = 0;
let lives = 3;
let wave = 1;

let playerShip = { x: 285, y: 330, w: 30, h: 30, speed: 5 };
let keys = {};
let playerBullets = [];
let enemyBullets = [];
let enemies = [];
let decorAsteroids = [];

function initSpaceEngine() {
    canvas = document.getElementById('spaceCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Настройка управления ПК
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Настройка управления Сенсором
    canvas.ontouchmove = function(e) {
        if (!gameRunning) return;
        let rect = canvas.getBoundingClientRect();
        let touch = e.touches[0];
        playerShip.x = (touch.clientX - rect.left) * (canvas.width / rect.width) - playerShip.w / 2;
        playerShip.y = (touch.clientY - rect.top) * (canvas.height / rect.height) - playerShip.h / 2;
        
        if (playerShip.x < 0) playerShip.x = 0;
        if (playerShip.x > canvas.width - playerShip.w) playerShip.x = canvas.width - playerShip.w;
        if (playerShip.y < 0) playerShip.y = 0;
        if (playerShip.y > canvas.height - playerShip.h) playerShip.y = canvas.height - playerShip.h;
    };

    if (decorAsteroids.length === 0) {
        for(let i=0; i<8; i++) {
            decorAsteroids.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*20+10, speed: Math.random()*0.5+0.2 });
        }
    }
    drawBackgroundMenu();
}

function handleKeyDown(e) {
    keys[e.code] = true; 
    if(e.code === 'Space' && gameRunning) {
        e.preventDefault();
        firePlayerBullet();
    }
}
function handleKeyUp(e) { keys[e.code] = false; }

function startSpaceGame() {
    score = 0;
    lives = 3;
    wave = 1;
    playerShip.x = 285;
    playerShip.y = 330;
    playerBullets = [];
    enemyBullets = [];
    gameRunning = true;
    spawnEnemyWave();
    gameLoop();
}

function spawnEnemyWave() {
    enemies = [];
    let count = wave + 2;
    for(let i = 0; i < count; i++) {
        enemies.push({
            x: 50 + (i * (canvas.width / (count + 1))),
            y: 50,
            w: 25,
            h: 25,
            dir: 1,
            speed: 1 + wave * 0.2,
            lastShot: Date.now() + Math.random() * 2000
        });
    }
}

function firePlayerBullet() {
    playerBullets.push({ x: playerShip.x + playerShip.w/2 - 2, y: playerShip.y, w: 4, h: 10, speed: 7 });
}

function gameLoop() {
    if (!gameRunning) return;
    updateSpaceGame();
    renderSpaceGame();
    requestAnimationFrame(gameLoop);
}

function updateSpaceGame() {
    if (keys['KeyW'] || keys['ArrowUp']) playerShip.y -= playerShip.speed;
    if (keys['KeyS'] || keys['ArrowDown']) playerShip.y += playerShip.speed;
    if (keys['KeyA'] || keys['ArrowLeft']) playerShip.x -= playerShip.speed;
    if (keys['KeyD'] || keys['ArrowRight']) playerShip.x += playerShip.speed;

    if (playerShip.x < 0) playerShip.x = 0;
    if (playerShip.x > canvas.width - playerShip.w) playerShip.x = canvas.width - playerShip.w;
    if (playerShip.y < 0) playerShip.y = 0;
    if (playerShip.y > canvas.height - playerShip.h) playerShip.y = canvas.height - playerShip.h;

    // Автострельба для сенсора
    if (Date.now() % 400 < 20 && ('ontouchstart' in window)) {
        firePlayerBullet();
    }

    decorAsteroids.forEach(ast => {
        ast.y += ast.speed;
        if(ast.y > canvas.height) { ast.y = -20; ast.x = Math.random()*canvas.width; }
    });

    playerBullets.forEach((b, index) => {
        b.y -= b.speed;
        if(b.y < 0) playerBullets.splice(index, 1);
    });

    enemies.forEach((enemy, eIdx) => {
        enemy.x += enemy.speed * enemy.dir;
        if (enemy.x > canvas.width - enemy.w || enemy.x < 0) {
            enemy.dir *= -1;
            enemy.y += 12;
        }

        if (Date.now() - enemy.lastShot > 3000) {
            enemyBullets.push({ x: enemy.x + enemy.w/2 - 2, y: enemy.y + enemy.h, w: 4, h: 8, speed: 2.5 });
            enemy.lastShot = Date.now();
        }

        playerBullets.forEach((pb, pbIdx) => {
            if (pb.x < enemy.x + enemy.w && pb.x + pb.w > enemy.x && pb.y < enemy.y + enemy.h && pb.y + pb.h > enemy.y) {
                enemies.splice(eIdx, 1);
                playerBullets.splice(pbIdx, 1);
                score += 100;
            }
        });
    });

    if (enemies.length === 0) {
        wave++;
        spawnEnemyWave();
    }

    enemyBullets.forEach((eb, ebIdx) => {
        eb.y += eb.speed;
        if(eb.y > canvas.height) enemyBullets.splice(ebIdx, 1);

        if (eb.x < playerShip.x + playerShip.w && eb.x + eb.w > playerShip.x && eb.y < playerShip.y + playerShip.h && eb.y + eb.h > playerShip.y) {
            enemyBullets.splice(ebIdx, 1);
            lives--;
            if(lives <= 0) {
                gameRunning = false;
                alert("Game Over! Toplaǵan ballıńız: " + score);
                drawBackgroundMenu();
            }
        }
    });
}

function renderSpaceGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#574b44";
    decorAsteroids.forEach(ast => {
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "#00d2d3";
    ctx.beginPath();
    ctx.moveTo(playerShip.x + playerShip.w / 2, playerShip.y);
    ctx.lineTo(playerShip.x, playerShip.y + playerShip.h);
    ctx.lineTo(playerShip.x + playerShip.w, playerShip.y + playerShip.h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ff6b6b";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    });

    ctx.fillStyle = "#1dd1a1";
    playerBullets.forEach(b => { ctx.fillRect(b.x, b.y, b.w, b.h); });

    ctx.fillStyle = "#feca57";
    enemyBullets.forEach(eb => { ctx.fillRect(eb.x, eb.y, eb.w, eb.h); });

    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.fillText("SCORE: " + score, 15, 25);
    ctx.fillText("WAVE: " + wave, canvas.width / 2 - 30, 25);
    ctx.fillText("LIVES: " + "❤️".repeat(lives), canvas.width - 100, 25);
}

function drawBackgroundMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(11, 11, 22, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff9f43";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Alǵa, qáhárman! Baslaw ushın tuymeni basıń", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "left";
}

window.onload = function() {
    generateMathQuestion(1); generateMathQuestion(2);
    generateEngQuestion(1); generateEngQuestion(2);
};
