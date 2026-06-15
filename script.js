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

let playerShip = { x: 285, y: 330, w: 32, h: 36, speed: 5 };
let keys = {};
let playerBullets = [];
let enemyBullets = [];
let enemies = [];
let decorAsteroids = [];
let stars = [];

function initSpaceEngine() {
    canvas = document.getElementById('spaceCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

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

    // Генерируем звёздное небо на фоне
    if (stars.length === 0) {
        for(let i=0; i<40; i++) {
            stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*2, speed: Math.random()*1 + 0.5 });
        }
    }

    // Декоративные рельефные астероиды (как на картинке, без урона)
    if (decorAsteroids.length === 0) {
        for(let i=0; i<8; i++) {
            decorAsteroids.push({ 
                x: Math.random()*canvas.width, 
                y: Math.random()*canvas.height, 
                size: Math.random()*25+15, 
                speed: Math.random()*0.4+0.2,
                seed: Math.random() * 100 // Чтобы кратеры рисовались всегда одинаково
            });
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
    let count = Math.min(wave + 2, 8); 
    for(let i = 0; i < count; i++) {
        enemies.push({
            x: 50 + (i * (canvas.width / (count + 1))),
            y: 50,
            w: 32,
            h: 24,
            dir: 1,
            speed: 1 + wave * 0.15, 
            lastShot: Date.now() + Math.random() * 1000
        });
    }
}

function firePlayerBullet() {
    playerBullets.push({ x: playerShip.x + playerShip.w/2 - 2, y: playerShip.y, w: 4, h: 14, speed: 8 });
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

    // Движение звезд
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
    });

    // Движение астероидов фоновых
    decorAsteroids.forEach(ast => {
        ast.y += ast.speed;
        if(ast.y > canvas.height) { ast.y = -30; ast.x = Math.random()*canvas.width; }
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

        // Выстрелы каждые 1.5 секунды
        if (Date.now() - enemy.lastShot > 1500) {
            enemyBullets.push({ x: enemy.x + enemy.w/2 - 2, y: enemy.y + enemy.h, w: 4, h: 10, speed: 2.5 + wave * 0.05 });
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
    // Чистим космос глубоким темно-синим цветом
    ctx.fillStyle = "#0c0c1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Текстура звездного неба
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // 2. Текстура фоновых астероидов (с рельефом и кратерами)
    decorAsteroids.forEach(ast => {
        ctx.fillStyle = "#6d594f"; // Основной цвет камня
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Рисуем кратеры для реалистичности текстуры
        ctx.fillStyle = "#4a3b34"; // Тень кратера
        let offset = ast.size / 4;
        ctx.beginPath();
        ctx.arc(ast.x - offset/2, ast.y - offset/2, offset/2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ast.x + offset, ast.y + offset/2, offset/3, 0, Math.PI * 2);
        ctx.fill();
    });

    // 3. Текстура Игрока (Красивый синий неоновый космолет с крыльями и соплом)
    let px = playerShip.x;
    let py = playerShip.y;
    let pw = playerShip.w;
    let ph = playerShip.h;

    // Двигатели (огонь сзади)
    ctx.fillStyle = Math.random() > 0.5 ? "#ff9f43" : "#ff3838";
    ctx.fillRect(px + pw/2 - 4, py + ph, 8, 6);

    // Крылья
    ctx.fillStyle = "#00a8ff"; 
    ctx.beginPath();
    ctx.moveTo(px, py + ph);
    ctx.lineTo(px + pw/2, py + ph/3);
    ctx.lineTo(px + pw, py + ph);
    ctx.fill();

    // Корпус
    ctx.fillStyle = "#00d2d3";
    ctx.beginPath();
    ctx.moveTo(px + pw/2, py);
    ctx.lineTo(px + pw/2 - 7, py + ph - 4);
    ctx.lineTo(px + pw/2 + 7, py + ph - 4);
    ctx.closePath();
    ctx.fill();

    // Кабина пилота
    ctx.fillStyle = "#eccc68";
    ctx.beginPath();
    ctx.arc(px + pw/2, py + ph/2, 3, 0, Math.PI*2);
    ctx.fill();

    // 4. Текстура Врагов (Инопланетные красные тарелки UFO)
    enemies.forEach(enemy => {
        let ex = enemy.x;
        let ey = enemy.y;
        let ew = enemy.w;
        let eh = enemy.h;

        // Нижняя тарелка
        ctx.fillStyle = "#ff4d4d";
        ctx.beginPath();
        ctx.ellipse(ex + ew/2, ey + eh/2 + 2, ew/2, eh/3, 0, 0, Math.PI*2);
        ctx.fill();

        // Верхний купол кабины пришельца
        ctx.fillStyle = "#ffaf40";
        ctx.beginPath();
        ctx.arc(ex + ew/2, ey + eh/2 - 1, ew/4, Math.PI, 0);
        ctx.fill();

        // Светящиеся зеленые огоньки на тарелке
        ctx.fillStyle = "#32ff7e";
        ctx.fillRect(ex + ew/4, ey + eh/2 + 1, 3, 3);
        ctx.fillRect(ex + ew/2 - 1, ey + eh/2 + 2, 3, 3);
        ctx.fillRect(ex + ew*0.75 - 3, ey + eh/2 + 1, 3, 3);
    });

    // 5. Текстура лазеров игрока (Зеленые светящиеся пули)
    ctx.fillStyle = "#2ed573";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#2ed573"; // Эффект свечения
    playerBullets.forEach(b => { ctx.fillRect(b.x, b.y, b.w, b.h); });
    ctx.shadowBlur = 0; // Сбрасываем свечение, чтобы не тормозило

    // 6. Текстура лазеров врагов (Желтые заряды плазмы)
    ctx.fillStyle = "#ffa502";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ffa502";
    enemyBullets.forEach(eb => { ctx.fillRect(eb.x, eb.y, eb.w, eb.h); });
    ctx.shadowBlur = 0;

    // 7. Интерфейс сверху
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("SCORE: " + String(score).padStart(5, '0'), 15, 25);
    ctx.fillText("WAVE: " + String(wave).padStart(2, '0'), canvas.width / 2 - 35, 25);
    ctx.fillText("LIVES: " + "❤️".repeat(lives), canvas.width - 110, 25);
}

function drawBackgroundMenu() {
    ctx.fillStyle = "#0c0c1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем немного звезд в меню
    ctx.fillStyle = "#fff";
    for(let i=0; i<15; i++) ctx.fillRect(Math.sin(i)*canvas.width/2 + canvas.width/2, Math.cos(i)*canvas.height/2 + canvas.height/2, 2, 2);

    ctx.fillStyle = "#ff9f43";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Alǵa, qáhárman! Baslaw ushın tuymeni basıń", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "left";
}

window.onload = function() {
    generateMathQuestion(1); generateMathQuestion(2);
    generateEngQuestion(1); generateEngQuestion(2);
};
