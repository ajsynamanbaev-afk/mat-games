function switchGame(game) {
    document.getElementById('math-game').classList.add('hidden');
    document.getElementById('english-game').classList.add('hidden');
    document.getElementById('cube-game').classList.add('hidden');

    if (game === 'math') {
        document.getElementById('math-game').classList.remove('hidden');
    } else if (game === 'english') {
        document.getElementById('english-game').classList.remove('hidden');
    } else {
        document.getElementById('cube-game').classList.remove('hidden');
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
        document.getElementById('p1-question').innerText = `${num1} ${sign} ${num2} = ?`;
    } else {
        p2MathAnswer = answer;
        document.getElementById('p2-question').innerText = `${num1} ${sign} ${num2} = ?`;
    }
}

function checkMathAnswer(player) {
    if (player === 1) {
        let input = document.getElementById('p1-input');
        if (parseInt(input.value) === p1MathAnswer) {
            mathRopePosition -= 6;
            input.value = '';
            generateMathQuestion(1);
        }
    } else {
        let input = document.getElementById('p2-input');
        if (parseInt(input.value) === p2MathAnswer) {
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
    document.getElementById('math-rope-marker').style.left = mathRopePosition + '%';
}

document.getElementById('p1-input').addEventListener('input', function() { checkMathAnswer(1); });
document.getElementById('p2-input').addEventListener('input', function() { checkMathAnswer(2); });

// ==========================================
// LOGIKA 2: ANGLIYSKIY ARQAN TARTIS
// ==========================================
let engRopePosition = 50;
let p1EngCurrentPair = {};
let p2EngCurrentPair = {};

// Baza slov: qaraqalpaqsha -> english
const wordDictionary = [
    { kaa: "Mektep", eng: "school" },
    { kaa: "Kitap", eng: "book" },
    { kaa: "Alma", eng: "apple" },
    { kaa: "Pişik", eng: "cat" },
    { kaa: "Futbol", eng: "football" },
    { kaa: "Suw", eng: "water" },
    { kaa: "Dos", eng: "friend" },
    { kaa: "Úy", eng: "house" },
    { kaa: "Qalam", eng: "pen" },
    { kaa: "Kún", eng: "day" }
];

function generateEngQuestion(player) {
    let randomIndex = Math.floor(Math.random() * wordDictionary.length);
    let wordPair = wordDictionary[randomIndex];

    if (player === 1) {
        p1EngCurrentPair = wordPair;
        document.getElementById('p1-eng-word').innerText = wordPair.kaa;
    } else {
        p2EngCurrentPair = wordPair;
        document.getElementById('p2-eng-word').innerText = wordPair.kaa;
    }
}

function checkEngAnswer(player) {
    if (player === 1) {
        let input = document.getElementById('p1-eng-input');
        // Переводим в нижний регистр, чтобы "School" и "school" одинаково подходили
        if (input.value.toLowerCase().trim() === p1EngCurrentPair.eng) {
            engRopePosition -= 6; // Тянет влево
            input.value = '';
            generateEngQuestion(1);
        }
    } else {
        let input = document.getElementById('p2-eng-input');
        if (input.value.toLowerCase().trim() === p2EngCurrentPair.eng) {
            engRopePosition += 6; // Тянет вправо
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
    document.getElementById('eng-rope-marker').style.left = engRopePosition + '%';
}

document.getElementById('p1-eng-input').addEventListener('input', function() { checkEngAnswer(1); });
document.getElementById('p2-eng-input').addEventListener('input', function() { checkEngAnswer(2); });

// Старт всех игр
generateMathQuestion(1);
generateMathQuestion(2);
generateEngQuestion(1);
generateEngQuestion(2);
