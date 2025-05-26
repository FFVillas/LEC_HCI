const   body = document.querySelector('body'),
        toggle = body.querySelector('.sidebar-toggle'),
        sidebar = body.querySelector('.sidebar'), 
        purpleButton = body.querySelector('.purple-button'),
        logo = document.getElementById('logo-image');
        content = body.querySelector('.content');

// Toggle sidebar visibility
let isClosed = false;
const toggleIcon = document.querySelector('.sidebar-toggle .material-symbols');

sidebar.classList.toggle('close');
toggle.addEventListener('click', () => {
    sidebar.classList.toggle('close');
    isClosed = !isClosed;
    if(isClosed) {
        logo.src = "./assets/images/logo(no text).png";
        content.style.marginLeft = "78px";
        toggleIcon.style.transform= "scaleX(1)";
    }
    else{
        logo.src = "./assets/images/logo.png";
        content.style.marginLeft = "250px";
        toggleIcon.style.transform= "scaleX(-1)";
    }
});

// Toggle Ai Chat section visibility
const aichatSection = document.querySelector('.aichat-section');
const aichatToggle = document.querySelector('.sidebar-toggle.aichat');

aichatToggle.addEventListener('click', () => {
    aichatSection.classList.toggle('ai-close');
});

//card flipped
const card = document.querySelector('.card');
function flipCard() {
    card.classList.toggle('flipped');
    if (card.classList.contains('flipped')) {
        showAnswerBtn.textContent = 'Show Question';
    } else {
        showAnswerBtn.textContent = 'Show Answer';
    }
}
card.addEventListener('click', flipCard);

document.addEventListener('DOMContentLoaded', function() {
    const showAllBtn = document.getElementById('show-all-btn');
    const allCards = document.getElementById('all-cards');

    showAllBtn.addEventListener('click', function(){

        // Show all cards
        allCards.style.display = 'block';
        
        // Hide the button itself
        showAllBtn.style.display = 'none';
    });
});
