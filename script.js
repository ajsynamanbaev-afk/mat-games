function switchGame(game) {
    if (game === 'math') {
        document.getElementById('math-game').classList.remove('hidden');
        document.getElementById('cube-game').classList.add('hidden');
    } else {
        document.getElementById('cube-game').classList.remove('hidden');
        document.getElementById('math-game').classList.add('hidden');
    }
}

// LOGIKA MATEMATIKALIQ ARQAN TARTIS (2 OYINSHI)
let ropePosition = 50; // 50% - centr
let p1Answer = 0;
let p2Answer = 0;

// Generator misallari
function generateQuestion(player) {
    let num1 = Math.floor(Math.random() * 12) + 2;
    let num2 = Math.floor(Math.random() * 12) + 2;
    let isPlus = Math.random() > 0.5;
    let answer = isPlus ? num1 + num2 : num1 - num2;
    let sign = isPlus ? '+' : '-';

    if (player === 1) {
        p1Answer = answer;
        document.getElementById('p1-question').innerText = `${num1} ${sign} ${num2} = ?`;
    } else {
        p2Answer = answer;
        document.getElementById('p2-question').innerText = `${num1} ${sign} ${num2} = ?`;
    }
}

// Proverka otveta
function checkPlayerAnswer(player) {
    if (player === 1) {
        let input = document.getElementById('p1-input');
        if (parseInt(input.value) === p1Answer) {
            ropePosition -= 6; // Tyaneм vlevo
            input.value = '';
            generateQuestion(1);
        }
    } else {
        let input = document.getElementById('p2-input');
        if (parseInt(input.value) === p2Answer) {
            ropePosition += 6; // Tyaneм vpravo
            input.value = '';
            generateQuestion(2);
        }
    }

    // Proverka pobedi
    if (ropePosition < 10) {
        alert("1-Oyınshı jeńdi! 🎉 (Shep jaq)");
        ropePosition = 50;
        document.getElementById('p1-input').value = '';
        document.getElementById('p2-input').value = '';
        generateQuestion(1);
        generateQuestion(2);
    } else if (ropePosition > 90) {
        alert("2-Oyınshı jeńdi! 🎉 (Oń jaq)");
        ropePosition = 50;
        document.getElementById('p1-input').value = '';
        document.getElementById('p2-input').value = '';
        generateQuestion(1);
        generateQuestion(2);
    }

    document.getElementById('rope-marker').style.left = ropePosition + '%';
}

// AVTOMATICHESKAYA PROVERKA PRI VVODE (Dlya sensornix ekranov i bistroy igri)
document.getElementById('p1-input').addEventListener('input', function() {
    checkPlayerAnswer(1);
});

document.getElementById('p2-input').addEventListener('input', function() {
    checkPlayerAnswer(2);
});

// Upravlenie s klaviaturi (na sluchay, esli igrayut knopkami na PK)
window.addEventListener('keydown', function(event) {
    if (event.key === 'a' || event.key === 'A' || event.key === 'ф' || event.key === 'Ф') {
        let input = document.getElementById('p1-input');
        if (parseInt(input.value) === p1Answer) {
            checkPlayerAnswer(1);
        }
    }
    if (event.key === 'l' || event.key === 'L' || event.key === 'д' || event.key === 'Д') {
        let input = document.getElementById('p2-input');
        if (parseInt(input.value) === p2Answer) {
            checkPlayerAnswer(2);
        }
    }
});

// Start igri
generateQuestion(1);
generateQuestion(2);