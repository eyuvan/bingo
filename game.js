// Telegram WebApp Initialization
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    document.getElementById('prof-id').innerText = tg.initDataUnsafe?.user?.id || "12345678";
}

let selectedCards = [];
let currentGameId = 1;

// 1. Generate 1-600 Cards for Selection
const grid = document.getElementById('main-cards-grid');
for (let i = 1; i <= 600; i++) {
    let card = document.createElement('div');
    card.className = 'card-item';
    card.innerText = i;
    card.onclick = () => selectCard(i, card);
    grid.appendChild(card);
}

function selectCard(num, element) {
    if (selectedCards.includes(num)) {
        selectedCards = selectedCards.filter(c => c !== num);
        element.classList.remove('selected');
    } else {
        if (selectedCards.length >= 3) {
            alert("ቢበዛ መምረጥ የሚችሉት 3 ካርቴላ ብቻ ነው!");
            return;
        }
        selectedCards.push(num);
        element.classList.add('selected');
    }
    document.getElementById('selected-count').innerText = selectedCards.length;
}

// 2. Navigation Control
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById('bingo-live-screen').classList.add('hidden');
    document.getElementById('top-dashboard').classList.remove('hidden');
    
    if(pageId === 'game-screen') {
        document.getElementById('game-screen').classList.remove('hidden');
    } else {
        document.getElementById(pageId).classList.remove('hidden');
    }
}

// 3. Countdown Timer (49 seconds)
let timeLeft = 49;
const timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('countdown').innerText = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        startLiveBingo();
    }
}, 1000);

// 4. Start Live Bingo Phase (Screen Completely Changes)
function startLiveBingo() {
    if(selectedCards.length === 0) {
        // አስገዳጅ ቢያንስ 1 ካርቴላ እንዲመርጡ ካልመረጡ በራሱ 1ኛውን ይመርጣል
        selectedCards.push(1);
    }
    
    // ሙሉ በሙሉ ፔጁን ቀይር
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById('top-dashboard').classList.add('hidden'); // dashboard ደብቅ
    document.getElementById('bingo-live-screen').classList.remove('hidden');
    
    document.getElementById('game-id').innerText = String(currentGameId).padStart(4, '0');
    
    setupBingoBoard();
    startCallingNumbers();
}

// 5. Setup B-I-N-G-O Columns Structure
function setupBingoBoard() {
    const cols = {
        B: { min: 1, max: 15, el: document.getElementById('col-B') },
        I: { min: 16, max: 30, el: document.getElementById('col-I') },
        N: { min: 31, max: 45, el: document.getElementById('col-N') },
        G: { min: 46, max: 60, el: document.getElementById('col-G') },
        O: { min: 61, max: 75, el: document.getElementById('col-O') }
    };
    
    for (let letter in cols) {
        cols[letter].el.innerHTML = '';
        for (let n = cols[letter].min; n <= cols[letter].max; n++) {
            let span = document.createElement('span');
            span.id = board-num-${n};
            span.innerText = n;
            cols[letter].el.appendChild(span);
        }
    }
}

// 6. Simulate Bingo Number Caller
function startCallingNumbers() {
    let allNumbers = Array.from({length: 75}, (_, i) => i + 1);
    // Shuffle numbers
    allNumbers.sort(() => Math.random() - 0.5);
    
    let callIdx = 0;
    const callInterval = setInterval(() => {
        if (callIdx >= allNumbers.length) {
            clearInterval(callInterval);
            return;
        }
        
        let num = allNumbers[callIdx];
        let letter = '';
        if (num <= 15) letter = 'B';
        else if (num <= 30) letter = 'I';
        else if (num <= 45) letter = 'N';
		else if (num <= 60) letter = 'G';
        else letter = 'O';
        
        // Update Small Screen Display
        document.getElementById('caller-screen').innerText = ${letter} - ${num};
        
        // Highlight on the board
        let boardNumEl = document.getElementById(board-num-${num});
        if(boardNumEl) boardNumEl.classList.add('hit');
        
        callIdx++;
    }, 3000); // በየ 3 ሰከንዱ ቁጥር ይጠራል
}

function checkBingo() {
    alert("ቢንጎ ተፈትሿል! እንኳን ደስ አለዎት!");
}