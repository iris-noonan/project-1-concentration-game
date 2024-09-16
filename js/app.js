/*-------------- Constants -------------*/


/*---------- Variables (state) ---------*/
let startTime = new Date().getTime();

/*----- Cached Element References  -----*/
const timerTotal = document.querySelector("#timer-total")

/*-------------- Functions -------------*/
setInterval(() => {
    const currentTime = new Date().getTime();
    const difference = currentTime - startTime;
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    timerTotal.innerHTML = `${minutes} min : ${seconds} secs` ;
}, 500)

/*----------- Event Listeners ----------*/

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    showModal();
}

const showModal = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

showModal();