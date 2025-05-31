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

    if (sidebar && toggle && logo && content && toggleIcon) {
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
    }

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
        const circumference = 636;
        const offset         = circumference - (percentage / 100) * circumference;
        if (circle) circle.style.strokeDashoffset = offset;
        if (percentageText) percentageText.textContent = percentage + '%';
    }

    // Only call if elements exist
    if (document.querySelector('.progress-bar') && document.querySelector('.percentage')) {
        updateProgress(45);
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