const howToPlayModal = document.getElementById("how-to-play");
const creditsModal = document.getElementById("credits");

// Get the button that opens the modal
const howToPlayBtn = document.getElementById("how-to-play-btn");
const creditsBtn = document.getElementById("credits-btn");

// When the user clicks the button, open the modal
howToPlayBtn.onclick = function() {
  howToPlayModal.style.display = "block";
}

creditsBtn.onclick = function() {
  creditsModal.style.display = "block";
}

window.onclick = function(event) {
  if (event.target == howToPlayModal) {
    howToPlayModal.style.display = "none";
  }
  if (event.target == creditsModal) {
    creditsModal.style.display = "none";
  }
}

// Get the close button of all modals and add event listener
const modalCloseBtns = document.getElementsByClassName("close");

function closeModal(event) {
  let closeBtn = event.currentTarget;
  let parentModal = closeBtn.parentElement.parentElement;
  parentModal.style.display = "none";
}

for (let i = 0; i < modalCloseBtns.length; i++) {
  modalCloseBtns[i].addEventListener("click", closeModal);
}