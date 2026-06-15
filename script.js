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
        setTimeout(initSpaceEngine, 50);
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
// LOGIKA 3: GALAXY ATTACK STYLE (PRO-ШУТЕР)
// ==========================================
let canvas, ctx;
let gameRunning = false;
let score = 0;
let lives = 3;
let wave = 1;

let playerShip = { x: 285, y: 320, w: 36, h: 42, speed: 6 };
let keys = {};
let playerBullets = [];
let enemyBullets = [];
let enemies = [];
let decorAsteroids = [];
let stars = [];
let particles = []; // Система частиц для крутых взрывов

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

    // Создаем бесконечный звездный поток (эффект скорости)
    if (stars.length === 0) {
        for(let i=0; i<50; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 8 + 4, // Длина луча звезды при полете
                speed: Math.random() * 3 + 2   // Высокая скорость для динамики
            });
        }
    }

    // Крутящиеся астероиды с параллаксом
    if (decorAsteroids.length === 0) {
        for(let i=0; i<6; i++) {
            decorAsteroids.push({ 
                x: Math.random()*canvas.width, 
                y: Math.random()*canvas.height, 
                size: Math.random()*22+14, 
                speed: Math.random()*0.6+0.3,
                angle: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.03 // Скорость вращения
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
    playerShip.x = canvas.width / 2 - playerShip.w / 2;
    playerShip.y = 320;
    playerBullets = [];
    enemyBullets = [];
    particles = [];
    gameRunning = true;
    spawnEnemyWave();
    gameLoop();
}

function spawnEnemyWave() {
    enemies = [];
    let count = Math.min(wave + 2, 8); 
    for(let i = 0; i < count; i++) {
        enemies.push({
            x: 40 + (i * (canvas.width / (count + 0.8))),
            y: -40, // Появляются плавно сверху, как в Galaxy Attack
            targetY: 50 + (i % 2 * 20), // Разноуровневые ряды
            w: 34,
            h: 28,
            dir: 1,
            pulse: Math.random() * 10, // Индивидуальная анимация покачивания
            speed: 1.2 + wave * 0.12, 
            lastShot: Date.now() + Math.random() * 1200
        });
    }
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: Math.random() * 3 + 1,
            alpha: 1,
            color: color
        });
    }
}

function firePlayerBullet() {
    // Двойной крутой выстрел (слева и справа от крыльев) как в Space Shooter!
    playerBullets.push({ x: playerShip.x + 4, y: playerShip.y + 10, w: 3, h: 14, speed: 9 });
    playerBullets.push({ x: playerShip.x + playerShip.w - 7, y: playerShip.y + 10, w: 3, h: 14, speed: 9 });
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

    // Автострельба для сенсорных устройств
    if (Date.now() % 350 < 20 && ('ontouchstart' in window)) {
        firePlayerBullet();
    }

    // Движение эффекта скорости звезд
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = -10;
            star.x = Math.random() * canvas.width;
        }
    });

    // Движение и вращение астероидов
    decorAsteroids.forEach(ast => {
        ast.y += ast.speed;
        ast.angle += ast.rotSpeed;
        if(ast.y > canvas.height) { 
            ast.y = -30; 
            ast.x = Math.random()*canvas.width; 
        }
    });

    // Обновление частиц (взрывов)
    particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) particles.splice(idx, 1);
    });

    playerBullets.forEach((b, index) => {
        b.y -= b.speed;
        if(b.y < 0) playerBullets.splice(index, 1);
    });

    enemies.forEach((enemy, eIdx) => {
        // Плавный въезд на экран при старте волны
        if (enemy.y < enemy.targetY) {
            enemy.y += 2;
        } else {
            // Космическое волнообразное покачивание
            enemy.pulse += 0.02;
            enemy.x += enemy.speed * enemy.dir + Math.sin(enemy.pulse) * 0.3;
        }

        if (enemy.x > canvas.width - enemy.w || enemy.x < 0) {
            enemy.dir *= -1;
            enemy.y += 10;
        }

        // Выстрелы врагов — строго каждые 1.5 сек, как заказывали!
        if (Date.now() - enemy.lastShot > 1500) {
            enemyBullets.push({ 
                x: enemy.x + enemy.w/2 - 2, 
                y: enemy.y + enemy.h, 
                w: 4, 
                h: 12, 
                speed: 3 + Math.min(wave * 0.05, 2) 
            });
            enemy.lastShot = Date.now();
        }

        playerBullets.forEach((pb, pbIdx) => {
            if (pb.x < enemy.x + enemy.w && pb.x + pb.w > enemy.x && pb.y < enemy.y + enemy.h && pb.y + pb.h > enemy.y) {
                createExplosion(enemy.x + enemy.w/2, enemy.y + enemy.h/2, "#ff4d4d");
                enemies.splice(eIdx, 1);
                playerBullets.splice(pbIdx, 1);
                score += 100;
            }
        });
    });

    // Переход на новый уровень (Логика зон без умножения 12-14 и 20-24 сохранена)
    if (enemies.length === 0) {
        wave++;
        spawnEnemyWave();
    }

    enemyBullets.forEach((eb, ebIdx) => {
        eb.y += eb.speed;
        if(eb.y > canvas.height) enemyBullets.splice(ebIdx, 1);

        if (eb.x < playerShip.x + playerShip.w && eb.x + eb.w > playerShip.x && eb.y < playerShip.y + playerShip.h && eb.y + eb.h > playerShip.y) {
            createExplosion(playerShip.x + playerShip.w/2, playerShip.y + playerShip.h/2, "#00d2d3");
            enemyBullets.splice(ebIdx, 1);
            lives--;
            if(lives <= 0) {
                gameRunning = false;
                alert("Game Over! Баллы: " + score);
                drawBackgroundMenu();
            }
        }
    });
}

function renderSpaceGame() {
    // Космическая бездна
    ctx.fillStyle = "#070714";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Эффект гиперскорости звезд (Линии вместо точек)
    ctx.strokeStyle = "rgba(100, 200, 255, 0.4)";
    ctx.lineWidth = 1.5;
    stars.forEach(star => {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x, star.y + star.length);
        ctx.stroke();
    });

    // 2. Вращающиеся метеориты с кратерами
    decorAsteroids.forEach(ast => {
        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.angle);
        
        ctx.fillStyle = "#5c4a41";
        ctx.beginPath();
        ctx.arc(0, 0, ast.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Кратеры, которые вращаются вместе с телом
        ctx.fillStyle = "#3d302a";
        ctx.beginPath();
        ctx.arc(-ast.size/5, -ast.size/6, ast.size/6, 0, Math.PI * 2);
        ctx.arc(ast.size/4, ast.size/5, ast.size/8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });

    // 3. Частицы взрывов
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1.0; // Сброс прозрачности

    // 4. Корабль Галактического Истребителя (Galaxy Style)
    let px = playerShip.x, py = playerShip.y, pw = playerShip.w, ph = playerShip.h;

    // Пульсирующий огонь турбин
    let fireH = Math.random() * 8 + 6;
    let engineGrad = ctx.createLinearGradient(px + pw/2, py + ph, px + pw/2, py + ph + fireH);
    engineGrad.addColorStop(0, "#cyan");
    engineGrad.addColorStop(0.3, "#00a8ff");
    engineGrad.addColorStop(1, "transparent");
    ctx.fillStyle = engineGrad;
    ctx.fillRect(px + pw/2 - 5, py + ph - 2, 10, fireH);

    // Боковые закрылки крыльев
    ctx.fillStyle = "#0055ff";
    ctx.fillRect(px, py + ph - 16, 4, 12);
    ctx.fillRect(px + pw - 4, py + ph - 16, 4, 12);

    // Корпус сложной формы
    ctx.fillStyle = "#00d2d3";
    ctx.beginPath();
    ctx.moveTo(px + pw/2, py); // Нос
    ctx.lineTo(px + 4, py + ph - 10); // Левое крыло
    ctx.lineTo(px + pw/2, py + ph - 4); // Хвост центр
    ctx.lineTo(px + pw - 4, py + ph - 10); // Правое крыло
    ctx.closePath();
    ctx.fill();

    // Кабина (Золотой неоновый градиент)
    ctx.fillStyle = "#fff200";
    ctx.beginPath();
    ctx.ellipse(px + pw/2, py + ph/2.2, 4, 8, 0, 0, Math.PI*2);
    ctx.fill();

    // 5. Враги: Инопланетный Угрожающий Флот (Красный неон)
    enemies.forEach(enemy => {
        let ex = enemy.x, ey = enemy.y, ew = enemy.w, eh = enemy.h;

        // Крылья-рога пришельца
        ctx.fillStyle = "#ff3838";
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + ew/2, ey + eh);
        ctx.lineTo(ex + ew, ey);
        ctx.lineTo(ex + ew - 6, ey + eh/2);
        ctx.lineTo(ex + 6, ey + eh/2);
        ctx.closePath();
        ctx.fill();

        // Сердцевина
        ctx.fillStyle = "#ff9f43";
        ctx.beginPath();
        ctx.arc(ex + ew/2, ey + eh/3, ew/4, 0, Math.PI*2);
        ctx.fill();

        // Глаз пришельца (Зловещее зеленое свечение)
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(ex + ew/2 - 4, ey + eh/3 - 1, 3, 2);
        ctx.fillRect(ex + ew/2 + 1, ey + eh/3 - 1, 3, 2);
    });

    // 6. Неоновые Лазеры Игрока (Двойной изумрудный луч с Glow-эффектом)
    ctx.fillStyle = "#2ed573";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#2ed573";
    playerBullets.forEach(b => { ctx.fillRect(b.x, b.y, b.w, b.h); });

    // 7. Плазменные Лазеры Врагов (Фиолетово-оранжевый заряд)
    ctx.fillStyle = "#ff9f43";
    ctx.shadowColor = "#ff4d4d";
    enemyBullets.forEach(eb => { ctx.fillRect(eb.x, eb.y, eb.w, eb.h); });
    ctx.shadowBlur = 0; // Обязательный сброс тени для оптимизации FPS

    // 8. Аркадный HD-Интерфейс
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 13px sans-serif";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    ctx.fillText("SCORE: " + String(score).padStart(5, '0'), 15, 25);
    ctx.fillText("WAVE: " + String(wave).padStart(2, '0'), canvas.width / 2 - 30, 25);
    ctx.fillText("LIVES: " + "❤️".repeat(lives), canvas.width - 110, 25);
    ctx.shadowBlur = 0;
}

function drawBackgroundMenu() {
    ctx.fillStyle = "#070714";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for(let i=0; i<20; i++) ctx.fillRect(Math.sin(i)*canvas.width/2 + canvas.width/2, Math.cos(i)*canvas.height/2 + canvas.height/2, 2, 2);

    ctx.fillStyle = "#ff9f43";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Alǵa, qáhárman! Baslaw ushın tuymeni basıń", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "left";
}

window.onload = function() {
    generateMathQuestion(1); generateMathQuestion(2);
    generateEngQuestion(1); generateEngQuestion(2);
};
