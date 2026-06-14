function switchGame(game) {
    const mathGame = document.getElementById('math-game');
    const englishGame = document.getElementById('english-game');
    const cubeGame = document.getElementById('cube-game');

    if (mathGame) mathGame.classList.add('hidden');
    if (englishGame) englishGame.classList.add('hidden');
    if (cubeGame) cubeGame.classList.add('hidden');

    if (game === 'math' && mathGame) {
        mathGame.classList.remove('hidden');
    } else if (game === 'english' && englishGame) {
        englishGame.classList.remove('hidden');
    } else if (game === 'cube' && cubeGame) {
        cubeGame.classList.remove('hidden');
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

    if (mathRopePosition < 10) {
        alert("1-Oyınshı jeńdi! 🎉 (Shep jaq)");
        mathRopePosition = 50;
    } else if (mathRopePosition > 90) {
        alert("2-Oyınshı jeńdi! 🎉 (Oń jaq)");
        mathRopePosition = 50;
    }
    const marker = document.getElementById('math-rope-marker');
    if (marker) marker.style.left = mathRopePosition + '%';
}

function pressNum(player, char) {
    let inputId = player === 1 ? 'p1-input' : 'p2-input';
    let input = document.getElementById(inputId);
    if (input) {
        if (char === 'C') { input.value = ''; } 
        else { input.value += char; }
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
    { kaa: "Mektep", eng: "school" },
    { kaa: "Kitap", eng: "book" },
    { kaa: "Alma", eng: "apple" },
    { kaa: "Pishiq", eng: "cat" },
    { kaa: "Futbol", eng: "football" },
    { kaa: "Suw", eng: "water" },
    { kaa: "Dos", eng: "friend" },
    { kaa: "Úy", eng: "house" },
    { kaa: "Qálem", eng: "pen" },
    { kaa: "Kún", eng: "day" },
    { kaa: "tún", eng: "night" },
    { kaa: "bay", eng: "rich" },
    { kaa: "qum", eng: "sand" },
    { kaa: "aydaw", eng: "drive" }
];

function generateEngQuestion(player) {
    let randomIndex = Math.floor(Math.random() * wordDictionary.length);
    let wordPair = wordDictionary[randomIndex];

    if (player === 1) {
        p1EngCurrentPair = wordPair;
        const w1 = document.getElementById('p1-eng-word');
        if (w1) w1.innerText = wordPair.kaa;
    } else {
        p2EngCurrentPair = wordPair;
        const w2 = document.getElementById('p2-eng-word');
        if (w2) w2.innerText = wordPair.kaa;
    }
}

function checkEngAnswer(player) {
    if (player === 1) {
        let input = document.getElementById('p1-eng-input');
        if (input && input.value.toLowerCase().trim() === p1EngCurrentPair.eng) {
            engRopePosition -= 6;
            input.value = '';
            generateEngQuestion(1);
        }
    } else {
        let input = document.getElementById('p2-eng-input');
        if (input && input.value.toLowerCase().trim() === p2EngCurrentPair.eng) {
            engRopePosition += 6;
            input.value = '';
            generateEngQuestion(2);
        }
    }

    if (engRopePosition < 10) {
        alert("1-Oyınshı jeńdi! 🎉 (Shep jaq)");
        engRopePosition = 50;
    } else if (engRopePosition > 90) {
        alert("2-Oyınshı jeńdi! 🎉 (Oń jaq)");
        engRopePosition = 50;
    }
    const engMarker = document.getElementById('eng-rope-marker');
    if (engMarker) engMarker.style.left = engRopePosition + '%';
}

function pressLetter(player, char) {
    let inputId = player === 1 ? 'p1-eng-input' : 'p2-eng-input';
    let input = document.getElementById(inputId);
    if (input) {
        if (char === 'C') { input.value = ''; } 
        else { input.value += char.toLowerCase(); }
        checkEngAnswer(player);
    }
}

// Создание буквенных кнопок для сенсора
function buildEngKeyboards() {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    const kb1 = document.getElementById('eng-keyboard-p1');
    const kb2 = document.querySelector('.player-card.p2-color .eng-keyboard'); // Точный выбор для P2

    if (kb1) {
        kb1.innerHTML = '';
        letters.forEach(l => {
            kb1.innerHTML += `<button onclick="pressLetter(1, '${l}')">${l}</button>`;
        });
    }
    if (kb2) {
        kb2.innerHTML = '';
        letters.forEach(l => {
            kb2.innerHTML += `<button onclick="pressLetter(2, '${l}')">${l}</button>`;
        });
    }
}

window.onload = function() {
    buildEngKeyboards();
    generateMathQuestion(1);
    generateMathQuestion(2);
    generateEngQuestion(1);
    generateEngQuestion(2);
};
