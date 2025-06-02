document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector('body');

    // --- Sidebar Toggle ---
    const toggle = body.querySelector('.sidebar-toggle');
    const sidebar = body.querySelector('.sidebar');
    const logo = document.getElementById('logo-image');
    const content = body.querySelector('.content');
    const toggleIcon = body.querySelector('.sidebar-toggle .material-symbols');
    let isClosed = false;

    if (sidebar && toggle && logo && content && toggleIcon) {
        isClosed = sidebar.classList.contains('close');
        if (isClosed) {
            logo.src = "./assets/images/logo(no text).png";
            content.style.marginLeft = "78px";
            toggleIcon.style.transform = "scaleX(1)";
        } else {
            logo.src = "./assets/images/logo.png";
            content.style.marginLeft = "250px";
            toggleIcon.style.transform = "scaleX(-1)";
        }
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('close');
            isClosed = !isClosed;
            if (isClosed) {
                logo.src = "./assets/images/logo(no text).png";
                content.style.marginLeft = "78px";
                toggleIcon.style.transform = "scaleX(1)";
            } else {
                logo.src = "./assets/images/logo.png";
                content.style.marginLeft = "250px";
                toggleIcon.style.transform = "scaleX(-1)";
            }
        });
    }

    // --- AI Chat Section Toggle ---
    const aichatSection = document.querySelector('.aichat-section');
    const aichatToggle = document.querySelector('.sidebar-toggle.aichat');
    if (aichatToggle && aichatSection) {
        aichatToggle.addEventListener('click', () => {
            aichatSection.classList.toggle('ai-close');
        });
    }

    // --- Flashcard Page Logic ---
    const card = document.querySelector('.card');
    const showAnswerBtn = document.getElementById('show-all-btn');
    const allCards = document.getElementById('all-cards');

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

    if (showAnswerBtn && allCards) {
        showAnswerBtn.addEventListener('click', function() {
            allCards.style.display = 'block';
            showAnswerBtn.style.display = 'none';
        });
    }

    // --- Create Quiz Button (Quiz Home Page) ---
    const createQuizBtn = document.querySelector('.btn.create-quiz');
    if (createQuizBtn) {
        createQuizBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('quizProgress');
            localStorage.removeItem('resumeQuestionIndex');
            window.location.href = 'quiz.html';
        });
    }

    // --- Quiz Data ---
    const quizQuestions = [
        {
            questionText: "Which of the following is not explicitly mentioned as a phase in the Secure Software Development Life Cycle (SDLC) that integrates security practices?",
            options: [
                { text: "Requirements gathering", isCorrect: false },
                { text: "Design", isCorrect: false },
                { text: "Marketing and Sales", isCorrect: true },
                { text: "Deployment", isCorrect: false }
            ]
        },
        {
            questionText: "What type of security testing involves examining code for security flaws without executing it?",
            options: [
                { text: "Dynamic Analysis", isCorrect: false },
                { text: "Penetration Testing", isCorrect: false },
                { text: "Fuzz Testing", isCorrect: false },
                { text: "Static Analysis", isCorrect: true }
            ]
        },
        {
            questionText: "According to the \"Big Three\" Concepts in Network Security, what concept refers to communicating without others knowing what's been said, typically including protection from replay attacks?",
            options: [
                { text: "Authentication", isCorrect: false },
                { text: "Authorization", isCorrect: false },
                { text: "Confidentiality", isCorrect: true },
                { text: "Integrity", isCorrect: false }
            ]
        },
        {
            questionText: "Which of the following is a common method for protecting web applications from SQL injection attacks?",
            options: [
                { text: "Using client-side validation only", isCorrect: false },
                { text: "Concatenating user input directly into SQL queries", isCorrect: false },
                { text: "Implementing parameterized queries or prepared statements", isCorrect: true },
                { text: "Storing sensitive data in plain text", isCorrect: false }
            ]
        },
        {
            questionText: "What does the principle of 'Least Privilege' in security recommend?",
            options: [
                { text: "Granting users maximum access to all resources", isCorrect: false },
                { text: "Giving users only the minimum permissions necessary to perform their job", isCorrect: true },
                { text: "Allowing all users to install software", isCorrect: false },
                { text: "Using the same password for all accounts", isCorrect: false }
            ]
        }
    ];

    // --- Quiz Page Logic ---
    const quizContent = document.querySelector('.quiz-content');
    if (quizContent) {
        let currentQuestionIndex = 0;
        let userAnswers = Array(quizQuestions.length).fill(undefined);
        let isCorrectArray = Array(quizQuestions.length).fill(false);
        let score = 0;

        // Load saved progress
        const savedProgress = JSON.parse(localStorage.getItem('quizProgress'));
        if (savedProgress && savedProgress.userAnswers && savedProgress.userAnswers.length === quizQuestions.length) {
            userAnswers = savedProgress.userAnswers.map(answer => answer === null ? undefined : answer);
            isCorrectArray = savedProgress.isCorrectArray;
            score = isCorrectArray.filter(isCorrect => isCorrect).length;
            const firstUnansweredIndex = userAnswers.findIndex(answer => answer === undefined);
            currentQuestionIndex = firstUnansweredIndex === -1 ? 0 : firstUnansweredIndex;
        }

        // Resume from specific index if set
        const resumeIndex = localStorage.getItem('resumeQuestionIndex');
        if (resumeIndex !== null) {
            const parsedResumeIndex = parseInt(resumeIndex);
            if (!isNaN(parsedResumeIndex) && parsedResumeIndex >= 0 && parsedResumeIndex < quizQuestions.length) {
                currentQuestionIndex = parsedResumeIndex;
            }
            localStorage.removeItem('resumeQuestionIndex');
        }

        // Get references to quiz elements
        const questionMetaElement = document.querySelector('.question-meta');
        const questionTextElement = document.querySelector('.question-text');
        const optionsContainer = document.querySelector('.options');
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        const prevButton = document.querySelector('.btn.prev');
        const nextButton = document.querySelector('.btn.next');
        const checkButton = document.querySelector('.btn.check');
        const quizNavContainer = document.querySelector('.quiz-nav');

        // Count answered questions
        function countAnsweredQuestions() {
            return userAnswers.filter(answer => answer !== undefined && answer !== null).length;
        }

        // Update progress bar and text
        function updateQuizPageProgress() {
            const answeredCount = countAnsweredQuestions();
            const totalQuestions = quizQuestions.length;
            const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
            if (progressBar) progressBar.style.width = `${progressPercentage}%`;
            if (progressText) progressText.textContent = `${Math.round(progressPercentage)}%`;
        }

        // Generate navigation buttons
        function generateQuizNavButtons() {
            if (!quizNavContainer) return;
            quizNavContainer.innerHTML = '';
            quizQuestions.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('nav-btn');
                button.textContent = index + 1;
                button.dataset.index = index;
                button.addEventListener('click', () => {
                    loadQuestion(index);
                });
                quizNavContainer.appendChild(button);
            });
        }

        generateQuizNavButtons();

        // Load a specific question
        function loadQuestion(index) {
            if (index < 0 || index >= quizQuestions.length) {
                console.error('Attempted to load invalid question index:', index);
                return;
            }
            currentQuestionIndex = index;
            const question = quizQuestions[index];

            // Update question meta and text
            if (questionMetaElement) questionMetaElement.textContent = `Question ${index + 1} of ${quizQuestions.length}`;
            if (questionTextElement) questionTextElement.textContent = question.questionText;

            // Clear previous options and add new ones
            if (optionsContainer) {
                optionsContainer.innerHTML = '';
                question.options.forEach((option, optionIndex) => {
                    const optionElement = document.createElement('div');
                    optionElement.classList.add('option');
                    optionElement.textContent = option.text;
                    optionElement.dataset.index = optionIndex;

                    // Add click listener only if the question hasn't been answered
                    if (userAnswers[index] === undefined || userAnswers[index] === null) {
                        optionElement.addEventListener('click', handleOptionSelect);
                    }

                    optionsContainer.appendChild(optionElement);
                });
            }

            // Update progress
            updateQuizPageProgress();

            // Update navigation buttons (current state and answered status)
            const quizNavButtons = document.querySelectorAll('.quiz-nav .nav-btn');
            quizNavButtons.forEach((btn, btnIndex) => {
                btn.classList.remove('current', 'correct', 'incorrect');
                if (btnIndex === index) {
                    btn.classList.add('current');
                }
                // Add correct/incorrect classes based on userAnswers
                if (userAnswers[btnIndex] !== undefined && userAnswers[btnIndex] !== null) {
                    if (quizQuestions[btnIndex] && quizQuestions[btnIndex].options && userAnswers[btnIndex] !== undefined && userAnswers[btnIndex] !== null && quizQuestions[btnIndex].options[userAnswers[btnIndex]] !== undefined) {
                        const answeredQuestion = quizQuestions[btnIndex];
                        if (answeredQuestion.options[userAnswers[btnIndex]].isCorrect) {
                            btn.classList.add('correct');
                        } else {
                            btn.classList.add('incorrect');
                        }
                    } else {
                        console.warn('Could not determine correctness for answered question index', btnIndex, '. Data might be inconsistent.');
                        btn.classList.add('incorrect');
                    }
                }
            });

            // Update button states
            if (prevButton) prevButton.disabled = index === 0;
            if (nextButton) nextButton.textContent = index === quizQuestions.length - 1 ? 'Finish' : 'Next';

            // Show/hide check button based on answered status
            if (userAnswers[index] === undefined || userAnswers[index] === null) {
                if (checkButton) {
                    checkButton.style.display = 'none';
                }
                if (optionsContainer) optionsContainer.dataset.selectedOptionIndex = undefined;
            } else {
                if (checkButton) checkButton.style.display = 'none';
                if (nextButton) nextButton.disabled = false;

                // If already answered, show the selected and correct/incorrect options
                const selectedOptionIndex = userAnswers[index];
                const options = optionsContainer ? optionsContainer.querySelectorAll('.option') : [];

                options.forEach((option, optIndex) => {
                    if (option) option.removeEventListener('click', handleOptionSelect);
                    if (option) option.classList.remove('selected', 'correct', 'incorrect');

                    if (optIndex === selectedOptionIndex && option) {
                        option.classList.add('selected');
                    }

                    if (question.options && question.options[optIndex] !== undefined) {
                        if (question.options[optIndex].isCorrect && option) {
                            option.classList.add('correct');
                        } else if (optIndex == selectedOptionIndex && option) {
                            option.classList.add('incorrect');
                        }
                    } else {
                        console.warn('Option data missing for question', index, 'option index', optIndex);
                    }
                });
            }

            // Ensure next button is enabled if not the last question
            if (nextButton && index < quizQuestions.length - 1) {
                nextButton.disabled = false;
            }
        }

        // Handle option selection
        function handleOptionSelect(event) {
            const selectedOption = event.target;
            const options = optionsContainer ? optionsContainer.querySelectorAll('.option') : [];

            options.forEach(option => option.classList.remove('selected'));
            selectedOption.classList.add('selected');

            if (optionsContainer) optionsContainer.dataset.selectedOptionIndex = selectedOption.dataset.index;

            // Show the check button when an option is selected
            if (checkButton) {
                checkButton.style.display = 'block';
            }
        }

        // Handle Check button click
        if (checkButton) {
            checkButton.addEventListener('click', () => {
                const selectedOptionIndex = optionsContainer ? optionsContainer.dataset.selectedOptionIndex : undefined;
                if (selectedOptionIndex === undefined) {
                    alert("Please select an answer.");
                    return;
                }

                const question = quizQuestions[currentQuestionIndex];
                const options = optionsContainer ? optionsContainer.querySelectorAll('.option') : [];

                // Add correct/incorrect classes and disable clicks
                options.forEach((option, optIndex) => {
                    if (option) option.removeEventListener('click', handleOptionSelect);
                    if (question.options && question.options[optIndex] !== undefined && option) {
                        if (question.options[optIndex].isCorrect) {
                            option.classList.add('correct');
                        } else if (optIndex == selectedOptionIndex) {
                            option.classList.add('incorrect');
                        }
                    } else {
                        console.warn('Option data missing when checking answer for question', currentQuestionIndex, 'option index', optIndex);
                    }
                });

                // Save the user's answer index
                userAnswers[currentQuestionIndex] = parseInt(selectedOptionIndex);

                // Update isCorrectArray
                if (question.options && question.options[selectedOptionIndex] !== undefined) {
                    if (question.options[selectedOptionIndex].isCorrect) {
                        isCorrectArray[currentQuestionIndex] = true;
                    } else {
                        isCorrectArray[currentQuestionIndex] = false;
                    }
                } else {
                    console.error('Could not determine correctness for selected answer. Option data missing.');
                    isCorrectArray[currentQuestionIndex] = false;
                }

                // Save progress to localStorage
                const progressToSave = {
                    userAnswers: userAnswers,
                    isCorrectArray: isCorrectArray,
                    totalQuestions: quizQuestions.length
                };
                localStorage.setItem('quizProgress', JSON.stringify(progressToSave));

                // Update quiz navigation button color
                const quizNavButtons = document.querySelectorAll('.quiz-nav .nav-btn');
                const currentNavButton = quizNavButtons[currentQuestionIndex];
                if (currentNavButton) {
                    if (isCorrectArray[currentQuestionIndex]) {
                        currentNavButton.classList.add('correct');
                    } else {
                        currentNavButton.classList.add('incorrect');
                    }
                }

                // Update progress
                updateQuizPageProgress();

                // Hide check button and enable next
                checkButton.style.display = 'none';
                if (nextButton) nextButton.disabled = false;
            });
        }

        // Handle Next button click
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentQuestionIndex < quizQuestions.length - 1) {
                    currentQuestionIndex++;
                    loadQuestion(currentQuestionIndex);
                } else {
                    // Navigate to complete page
                    const finalScore = isCorrectArray.filter(isCorrect => isCorrect).length;

                    // Store results for the complete page
                    localStorage.setItem('quizResults', JSON.stringify({
                        totalQuestions: quizQuestions.length,
                        finalScore: finalScore,
                        isCorrectArray: isCorrectArray
                    }));

                    // Clear ongoing quiz progress
                    localStorage.removeItem('quizProgress');
                    localStorage.removeItem('resumeQuestionIndex');

                    window.location.href = 'quiz_complete.html';
                }
            });
        }

        // Handle Prev button click
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    loadQuestion(currentQuestionIndex);
                }
            });
        }

        // Initial load of the first question (or the resumed question)
        loadQuestion(currentQuestionIndex);
    }

    // --- Quiz Home Page Logic ---
    const quizHomeSection = document.querySelector('.quizhome-section');
    if (quizHomeSection) {
        const quizHomeNavContainer = quizHomeSection.querySelector('.quizhome-progress-flex');
        const continueButton = quizHomeSection.querySelector('.btn.continue');
        const resetButton = quizHomeSection.querySelector('.btn.reset');

        const savedProgress = JSON.parse(localStorage.getItem('quizProgress'));

        // Generate quiz home navigation buttons
        function generateQuizHomeNavButtons(progressData) {
            if (!quizHomeNavContainer) return;
            quizHomeNavContainer.innerHTML = '';
            const totalQuestions = quizQuestions.length;

            const loadedUserAnswers = (progressData && progressData.userAnswers) ? progressData.userAnswers.map(answer => answer === null ? undefined : answer) : Array(totalQuestions).fill(undefined);
            const loadedIsCorrectArray = (progressData && progressData.isCorrectArray) ? progressData.isCorrectArray : Array(totalQuestions).fill(false);

            for (let i = 0; i < totalQuestions; i++) {
                const button = document.createElement('button');
                button.classList.add('nav-btn');
                button.textContent = i + 1;

                // Apply correct/incorrect classes ONLY if answered
                if (loadedUserAnswers[i] !== undefined && loadedUserAnswers[i] !== null) {
                    if (loadedIsCorrectArray[i]) {
                        button.classList.add('correct');
                    } else {
                        button.classList.add('incorrect');
                    }
                }

                // Add click listener to navigate to quiz.html and load the specific question
                button.addEventListener('click', () => {
                    localStorage.setItem('resumeQuestionIndex', i);
                    window.location.href = 'quiz.html';
                });
                quizHomeNavContainer.appendChild(button);
            }
        }

        // Generate buttons on load based on saved progress or default
        generateQuizHomeNavButtons(savedProgress);

        if (quizHomeNavContainer && continueButton && resetButton) {
            if (savedProgress) {
                continueButton.disabled = false;
                resetButton.disabled = false;

                // Set continue button listener
                continueButton.addEventListener('click', () => {
                    const firstUnansweredIndex = savedProgress.userAnswers.map(answer => answer === null ? undefined : answer).findIndex(answer => answer === undefined);
                    const resumeIndex = firstUnansweredIndex === -1 ? 0 : firstUnansweredIndex;
                    localStorage.setItem('resumeQuestionIndex', resumeIndex);
                    window.location.href = 'quiz.html';
                });

                // Set reset button listener
                resetButton.addEventListener('click', () => {
                    localStorage.removeItem('quizProgress');
                    localStorage.removeItem('resumeQuestionIndex');

                    generateQuizHomeNavButtons(null);

                    continueButton.disabled = true;
                    resetButton.disabled = true;
                });

            } else {
                continueButton.disabled = true;
                resetButton.disabled = true;
            }
        }
    }

    // --- Quiz Complete Page Logic ---
    const quizCompleteSection = document.querySelector('.quizcomplete-section');
    if (quizCompleteSection) {
        const quizResults = JSON.parse(localStorage.getItem('quizResults'));

        if (quizResults) {
            const {
                totalQuestions,
                finalScore,
                isCorrectArray
            } = quizResults;

            // Update score text
            const correctScoreElement = quizCompleteSection.querySelector('.quizcomplete-correct');
            const totalQuestionsElement = quizCompleteSection.querySelector('.quizcomplete-total');
            if (correctScoreElement) correctScoreElement.textContent = finalScore;
            if (totalQuestionsElement) totalQuestionsElement.textContent = totalQuestions;

            // Calculate and update percentage
            const percentage = totalQuestions > 0 ? (finalScore / totalQuestions) * 100 : 0;
            const percentageTextElement = quizCompleteSection.querySelector('.percentage');
            if (percentageTextElement) percentageTextElement.textContent = `${Math.round(percentage)}%`;

            // Update circular progress bar
            const progressBarCircle = quizCompleteSection.querySelector('.circular-progress .progress-bar');
            if (progressBarCircle) {
                const radius = parseFloat(progressBarCircle.getAttribute('r'));
                if (!isNaN(radius)) {
                    const circumference = 2 * Math.PI * radius;
                    const offset = circumference - (percentage / 100) * circumference;
                    progressBarCircle.style.strokeDasharray = circumference;
                    progressBarCircle.style.strokeDashoffset = offset;
                } else {
                    console.error("Could not parse radius for circular progress bar.");
                }
            }

            // Generate quiz navigation buttons in the complete card
            const quizCompleteNavContainer = quizCompleteSection.querySelector('.quizhome-progress-flex');
            if (quizCompleteNavContainer && isCorrectArray) {
                quizCompleteNavContainer.innerHTML = '';
                isCorrectArray.forEach((isCorrect, index) => {
                    const button = document.createElement('button');
                    button.classList.add('nav-btn');
                    if (isCorrect) {
                        button.classList.add('correct');
                    } else {
                        button.classList.add('incorrect');
                    }
                    button.textContent = index + 1;
                    quizCompleteNavContainer.appendChild(button);
                });
            }

            // Add event listeners for Review, New Quiz, and Retry buttons
            const reviewButton = quizCompleteSection.querySelector('.btn.review');
            const newQuizButton = quizCompleteSection.querySelector('.btn.new-quiz');
            const retryButton = quizCompleteSection.querySelector('.btn.retry');

            if (reviewButton) {
                reviewButton.addEventListener('click', () => {
                    console.log('Review button clicked');
                });
            }

            if (newQuizButton) {
                newQuizButton.addEventListener('click', () => {
                    localStorage.removeItem('quizProgress');
                    localStorage.removeItem('resumeQuestionIndex');
                    window.location.href = 'quiz_home.html';
                });
            }

            if (retryButton) {
                retryButton.addEventListener('click', () => {
                    localStorage.removeItem('quizResults');
                    localStorage.removeItem('quizProgress');
                    localStorage.removeItem('userAnswers');
                    localStorage.removeItem('resumeQuestionIndex');
                    window.location.href = 'quiz.html';
                });
            }
        } else {
            console.error("Quiz results not found in localStorage.");
        }
    }
    // MODAL LOGIC
    const noteBtns = document.querySelectorAll('.note-btn');
    const modal = document.getElementById('upload-modal');
    if (noteBtns.length > 2 && modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const modalIcon = document.getElementById('modal-icon');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        // Modal content for each note type
        const modalConfigs = [
            {
                title: "Audio Upload",
                icon: `<span class="material-symbols-rounded" style="font-size:48px;color:#625AFF;">movie</span>`,
                body: `
                    <label class="modal-dropzone">
                        <input type="file" accept="audio/*" style="display:none;" multiple>
                        <span class="modal-upload-icon">
                            <span class="material-symbols-rounded" style="font-size:32px;">upload</span>
                        </span>
                        <span class="modal-drop-text">Drag audio file here, or click to select</span>
                    </label>
                    <div class="modal-support-text">
                        Supported Format: MP3, WAV, AAC, etc (Max Size: 20MB)
                    </div>
                `
            },
            {
                title: "YouTube Video",
                icon: `<span class="material-symbols-rounded" style="font-size:48px;color:#625AFF;">mic</span>`,
                body: `
                    <form id="youtube-form">
                        <input type="url" placeholder="Paste YouTube Link Here" style="width:100%;padding:12px;border-radius:8px;border:1px solid #bcbcf2;font-size:1rem;margin-bottom:12px;">
                        <button type="submit" class="btn" style="background:#625AFF;color:#fff;padding:10px 24px;border-radius:8px;border:none;">Submit</button>
                    </form>
                    <div class="modal-support-text">
                        Paste a valid YouTube video URL.
                    </div>
                `
            },
            {
                title: "Document Upload",
                icon: `<span class="material-symbols-rounded" style="font-size:48px;color:#625AFF;">description</span>`,
                body: `
                    <label class="modal-dropzone">
                        <input type="file" style="display:none;" multiple>
                        <span class="modal-upload-icon">
                            <span class="material-symbols-rounded" style="font-size:32px;">upload</span>
                        </span>
                        <span class="modal-drop-text">Drag file here, or click to select</span>
                    </label>
                    <div class="modal-support-text">
                        Supported Format: PDF, PPT, DOC, Word, TXT, ODT, ODP, EPUB (Max Size: 20MB)
                    </div>
                `
            }
        ];
        noteBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                modalIcon.innerHTML = modalConfigs[idx].icon;
                modalTitle.textContent = modalConfigs[idx].title;
                modalBody.innerHTML = modalConfigs[idx].body;
                modal.style.display = 'flex';

                // Add file input logic for audio and document
                const dropzone = modalBody.querySelector('.modal-dropzone');
                if (dropzone) {
                    const fileInput = dropzone.querySelector('input[type="file"]');
                    dropzone.addEventListener('click', () => fileInput.click());
                    fileInput.addEventListener('change', (e) => {
                        if (fileInput.files.length > 0) {
                            dropzone.querySelector('.modal-drop-text').textContent = fileInput.files[0].name;
                            // Redirect to notes.html after file is selected
                            setTimeout(() => {
                                window.location.href = 'notes.html';
                            }, 800); // Optional delay for user feedback
                        }
                    });
                }

                // Add YouTube form logic
                const ytForm = modalBody.querySelector('#youtube-form');
                if (ytForm) {
                    ytForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const url = ytForm.querySelector('input[type="url"]').value;
                        alert('YouTube URL submitted: ' + url);
                        modal.style.display = 'none';
                        // Redirect to notes.html after submitting YouTube link
                        setTimeout(() => {
                            window.location.href = 'notes.html';
                        }, 800);
                    });
                }
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
});