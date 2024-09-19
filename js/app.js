/*-------------- Constants -------------*/
const rules = {
    cardPairs: 18,
    moves: 50,
    time: 150
};
/*---------- Variables (state) ---------*/
let startTime = new Date().getTime();
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let gameLost = false;
let gameWon = false;
let matchTotal = 0;
/*----- Cached Element References  -----*/
const timerTotal = document.querySelector("#timer-total");
const gridContainer = document.querySelector(".grid-container");
// gridCards can't be set at start as cards are generated later
let gridCards = [];
const movesTotal = document.querySelector("#moves-total");
const modal = document.querySelector("#myModal");
const playButton = document.querySelector("#play");
const resetButton = document.querySelector("#reset");
const backButton = document.querySelector("#back");
const gameLostModal = document.querySelector("#game-lost-modal");
const gameLostModalClose = document.querySelector("#game-lost-modal-close");
const gameWonModal = document.querySelector("#game-won-modal");
const gameWonModalClose = document.querySelector("#game-won-modal-close");
const scoreboardBoardList = document.querySelector(".scoreboard-board-list");
/*-------------- Functions -------------*/
setInterval(() => {
    const currentTime = new Date().getTime();
    const difference = currentTime - startTime;
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    timerTotal.innerHTML = `${minutes} min : ${seconds} secs` ;
}, 500)

fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });

function shuffleCards() {
    let currentIndex = cards.length;
    let randomIndex;    
    let temporaryValue;
    while (currentIndex !== 0) {   
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                    </div>
                    <div class="flip-card-back">
                        <img class="flip-card-front-image" src=${card.image} />
                    </div>
                </div>
            </div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
        gridCards = document.querySelectorAll(".card");
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("rotate");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesTotal.innerHTML = moves;
    lockBoard = true;

    isGameLost();
    checkForMatch();
    isGameWon();
}

function isGameLost() {
    const currentTime = new Date().getTime();
    const time = currentTime - startTime;
    if ((time / 1000) >= rules.time || moves >= rules.moves) {
        gameLost = true;
        gameLostModal.style.display = "block";
        addScoreToScoreboard();
    }
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function checkMatchTotal() {
    let matches = 0;
    gridCards.forEach((card) => {
        const match = card.getAttribute("data-match");
        if (match) {
            matches += 1;
        }
    });
    matchTotal = matches;
}

function isGameWon() {
    checkMatchTotal();
    if (matchTotal === (rules.cardPairs * 2)) {
        gameWon = true;
        gameWonModal.style.display = "block";
        addScoreToScoreboard();
    }
}

function addScoreToScoreboard() {
    const currentTime = new Date().getTime();
    const difference = currentTime - startTime;
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const scoreBoardRow = document.createElement("div");
    scoreBoardRow.classList.add("table-row");
    const gameResultClass = gameWon ? 'won' : 'lost';
    console.log("GAME WON: ", gameWon);
    scoreBoardRow.innerHTML = `
        <div class="table-row-cell table-result-time ${gameResultClass}">
            ${minutes}:${seconds} 
        </div>
        <div class="table-row-cell table-result-moves ${gameResultClass}"">
            ${moves}
        </div>
    `
    scoreboardBoardList.appendChild(scoreBoardRow);
}

function disableCards() {
    firstCard.setAttribute("data-match", true);
    secondCard.setAttribute("data-match", true);
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("rotate");
        secondCard.classList.remove("rotate");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    startTime = new Date().getTime();
    resetBoard();
    moves = 0;
    gameLost = false;
    gameWon = false;
    matchTotal = 0;
    resetBoard();
    shuffleCards();
    movesTotal.innerHTML = moves;
    gridContainer.innerHTML = "";
    generateCards();
}
/*----------- Event Listeners ----------*/
playButton.onclick = function() {
    restart();
    modal.style.display = "none";
}

resetButton.onclick = function() {
    restart();
}

backButton.onclick = function() {
    showModal();
}

const showModal = function() {
    modal.style.display = "block";
}

gameLostModalClose.onclick = function() {
    gameLostModal.style.display = "none";
}

gameWonModalClose.onclick = function() {
    gameWonModal.style.display = "none";
}

movesTotal.innerHTML = moves;

showModal();



const soundOnButton = document.querySelector('#sound')
const totoroTheme = new Audio('../assets/sound/Path of the wind - Joe Hisaishi.m4a')
soundOnButton.addEventListener("click", (evt) => {
    if (!totoroTheme.paused) {
        totoroTheme.pause();
    } else {
        totoroTheme.volume = .05
        totoroTheme.play();
        totoroTheme.loop = true;
    }
})
