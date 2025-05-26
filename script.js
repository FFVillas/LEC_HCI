document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    const body = document.querySelector('body');
    const toggle = body.querySelector('.sidebar-toggle');
    const sidebar = body.querySelector('.sidebar');
    const purpleButton = body.querySelector('.purple-button');
    const logo = document.getElementById('logo-image');
    const content = body.querySelector('.content');
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
    if (aichatToggle && aichatSection) {
        aichatToggle.addEventListener('click', () => {
            aichatSection.classList.toggle('ai-close');
        });
    }

    // Card flip
    const card = document.querySelector('.card');
    const showAnswerBtn = document.getElementById('show-all-btn');
    if (card && showAnswerBtn) {
        card.addEventListener('click', function() {
            card.classList.toggle('flipped');
            if (card.classList.contains('flipped')) {
                showAnswerBtn.textContent = 'Show Question';
            } else {
                showAnswerBtn.textContent = 'Show Answer';
            }
        });
    }

    // Show all cards
    const allCards = document.getElementById('all-cards');
    if (showAnswerBtn && allCards) {
        showAnswerBtn.addEventListener('click', function(){
            allCards.style.display = 'block';
            showAnswerBtn.style.display = 'none';
        });
    }

    const createQuizBtn = document.querySelector('.btn.create-quiz');
    if (createQuizBtn) {
        createQuizBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'quiz.html';
        });
    }

     // ——— Circular Progress Logic —————————————————————
  // 1) Wait a moment then trigger the animation class
  setTimeout(() => {
    document.querySelector('.circular-progress').classList.add('animate');
  }, 500);

  // 2) Update function
  function updateProgress(percentage) {
    const circle         = document.querySelector('.progress-bar');
    const percentageText = document.querySelector('.percentage');
    // circumference for 3/4 circle (2πr * 0.75). If r=90, 2π*90≈565.5 × .75 ≈424
    const circumference = 636; // Update this value
    const offset         = circumference - (percentage / 100) * circumference;

    circle.style.strokeDashoffset = offset;
    percentageText.textContent    = percentage + '%';
  }

  // 3) Initialize your desired value here:
  updateProgress(45);
});



