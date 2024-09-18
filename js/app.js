/*-------------- Constants -------------*/
const rules = {
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
/*----- Cached Element References  -----*/
const timerTotal = document.querySelector("#timer-total");
const gridContainer = document.querySelector(".grid-container");
const movesTotal = document.querySelector("#moves-total");
const modal = document.querySelector("#myModal");
const gameLostModal = document.querySelector("#gameLostModal");
const openModal = document.querySelector("#openModal");
const closeButton = document.querySelector(".close");
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
}

function isGameLost() {
    const currentTime = new Date().getTime();
    const time = currentTime - startTime;
    if ((time / 1000) >= rules.time || moves >= rules.move) {
        gameLost = true;
        gameLostModal.style.display = "block";
    }
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
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
    resetBoard();
    shuffleCards();
    moves = 0;
    movesTotal.innerHTML = moves;
    gridContainer.innerHTML = "";
    generateCards();
}
/*----------- Event Listeners ----------*/

openModal.onclick = function() {
    showModal();
}

const showModal = function() {
    modal.style.display = "block";
}

closeButton.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

movesTotal.innerHTML = moves;

showModal();