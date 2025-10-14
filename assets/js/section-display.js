// ===== SECTION DISPLAY =====
import { getCurrentSection, setCurrentSection, getSectionQuestions, getSelectedLevel } from './supabase-config.js';
import { setupAudio } from './audio-handler.js';

// ===== DISPLAY SECTION =====
export function displaySection(sectionNum) {
    console.log('Displaying section:', sectionNum);
    setCurrentSection(sectionNum);
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    let html = '';
    let sectionQuestions = [];
    let startIdx = 0;
    
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    const { selectedHSK } = getSelectedLevel() || {};
    
    console.log('Section questions:', { listeningQuestions, readingQuestions, writingQuestions });
    
    if (sectionNum === 1) {
        // LISTENING SECTION
        sectionQuestions = listeningQuestions;
        startIdx = 0;
        
        html += `
            <div class="section-header">
                <div class="section-title">🎧 PHẦN 1: NGHE (Listening)</div>
                <div class="section-description">Nghe file audio và trả lời ${sectionQuestions.length} câu hỏi</div>
            </div>
            <div class="audio-section">
                <div class="audio-info">⚠️ Chú ý phần nghe Audio chỉ nghe tối đa 2 lượt</div>
                <audio id="mainAudio" controlsList="nodownload noplaybackrate" style="display: none;">
                    <source src="${listeningQuestions[0]?.audio_url || ''}" type="audio/mpeg">
                </audio>
                <div id="audioControls" style="margin-top: 15px;">
                    <button id="playBtn" class="audio-play-btn" onclick="window.handleAudioPlay()">▶️ Phát Audio</button>
                    <div id="audioProgress" style="margin: 15px 0;">
                        <div id="audioProgressBar"></div>
                    </div>
                    <div id="audioTime">00:00 / 00:00</div>
                </div>
            </div>
        `;
        
        document.getElementById('questionCounter').textContent = `Phần 1: Nghe (${sectionQuestions.length} câu)`;
        document.getElementById('pageInfo').textContent = 'Phần 1/3 - Nghe';
        
        // Update progress circles for listening section
        updateSectionProgressCircles(sectionQuestions.length, 1);
        
    } else if (sectionNum === 2) {
        // SECTION 2: HSK1 = Đọc/Điền; HSK2+ = Nghe + Hình ảnh
        sectionQuestions = readingQuestions;
        startIdx = listeningQuestions.length;

        if (selectedHSK === '1') {
            const passage = readingQuestions[0]?.reading_passage || 'Đoạn văn sẽ được hiển thị ở đây...';
            html += `
                <div class="section-header">
                    <div class="section-title">📖 PHẦN 2: ĐIỀN ĐÁP ÁN</div>
                    <div class="section-description">Đọc đoạn văn và điền đáp án đúng (${sectionQuestions.length} câu)</div>
                </div>
                <div class="reading-passage">
                    <div class="passage-title">📖  Đọc văn:</div>
                    <div class="passage-text">${passage}</div>
                </div>
            `;
            document.getElementById('questionCounter').textContent = `Phần 2: Đọc (${sectionQuestions.length} câu)`;
            document.getElementById('pageInfo').textContent = 'Phần 2/3 - Đọc';
            
            // Update progress circles for reading section
            updateSectionProgressCircles(sectionQuestions.length, 2);
        } else {
            html += `
                <div class="section-header">
                    <div class="section-title">🎧 PHẦN 2: NGHE + NHẬN DIỆN HÌNH ẢNH</div>
                    <div class="section-description">Nghe Audio, với mỗi hình bên dưới hãy chọn Tick (Có) hoặc X (Không) (${sectionQuestions.length} câu)</div>
                </div>
                <div class="audio-section">
                    <div class="audio-info">⚠️ Audio tối đa 2 lượt</div>
                    <audio id="mainAudio" controlsList="nodownload noplaybackrate" style="display: none;">
                        <source src="${sectionQuestions[0]?.audio_url || ''}" type="audio/mpeg">
                    </audio>
                    <div id="audioControls" style="margin-top: 15px;">
                        <button id="playBtn" class="audio-play-btn" onclick="window.handleAudioPlay()">▶️ Phát Audio</button>
                        <div id="audioProgress" style="margin: 15px 0;">
                            <div id="audioProgressBar"></div>
                        </div>
                        <div id="audioTime">00:00 / 00:00</div>
                    </div>
                </div>
            `;
            document.getElementById('questionCounter').textContent = `Phần 2: Nghe + Hình ảnh (${sectionQuestions.length} câu)`;
            document.getElementById('pageInfo').textContent = 'Phần 2/3 - Nghe + Hình ảnh';
            
            // Update progress circles for listening+images section
            updateSectionProgressCircles(sectionQuestions.length, 2);
        }
        
    } else if (sectionNum === 3) {
        // WRITING SECTION
        sectionQuestions = writingQuestions;
        startIdx = listeningQuestions.length + readingQuestions.length;
        
        const writingQ = writingQuestions[0];
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
        const wordCount = (userAnswers[startIdx] || '').split(/\s+/).filter(w => w.length > 0).length;
        
        html += `
            <div class="section-header">
                <div class="section-title">✍️ PHẦN 3: VIẾT (Writing)</div>
                <div class="section-description">Viết bài tự luận theo yêu cầu (không tính điểm) (${sectionQuestions.length} câu)</div>
            </div>
            <div class="writing-section">
                <div class="writing-instruction">
                    <strong>Đề bài:</strong>
                    <div style="margin-top: 10px;">${writingQ?.question_text || ''}</div>
                </div>
                <textarea class="essay-input" data-question="${startIdx}" placeholder="Nhập bài viết của bạn..." style="min-height: 300px;">${userAnswers[startIdx] || ''}</textarea>
                <div class="word-count">Số từ: <strong>${wordCount}</strong></div>
            </div>
        `;
        
        document.getElementById('questionCounter').textContent = `Phần 3: Viết`;
        document.getElementById('pageInfo').textContent = 'Phần 3/3 - Viết';
        
        // Update progress circles for writing section
        updateSectionProgressCircles(sectionQuestions.length, 3);
    }
    
    container.innerHTML = html;
    
    if (!sectionQuestions || sectionQuestions.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'question-item';
        empty.innerHTML = '<div style="text-align:center;color:#777;font-weight:700;">Chưa có câu hỏi cho phần này</div>';
        container.appendChild(empty);
    }
    
    // Render questions for listening section (multiple choice)
    if (sectionNum === 1) {
        renderListeningQuestions(sectionQuestions, startIdx);
    }
    
    // Render questions for reading section
    if (sectionNum === 2) {
        if (selectedHSK === '1') {
            renderReadingQuestionsHSK1(sectionQuestions, startIdx);
        } else {
            renderReadingQuestionsHSK2Plus(sectionQuestions, startIdx);
        }
    }
    
    // Attach event listeners
    attachAnswerEventListeners();
    updateSectionProgressCircles();
    updateNavButtons();
    
    // Audio setup
    setupAudio(sectionNum);
}

// ===== RENDER LISTENING QUESTIONS =====
function renderListeningQuestions(sectionQuestions, startIdx) {
    const container = document.getElementById('questionsContainer');
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    sectionQuestions.forEach((question, idx) => {
        const globalIdx = startIdx + idx;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        let qHtml = `
            <div class="question-header">${globalIdx + 1}. ${question.question_text}</div>
        `;
        
        // Multiple choice options
        const savedAnswer = userAnswers[globalIdx];
        qHtml += `
            <div class="options-list" style="display: flex; margin-top: 15px;">
                <div class="option-item ${savedAnswer === 'A' ? 'selected' : ''}" data-question="${globalIdx}" data-option="A">
                    <div class="option-label">A</div>
                    <div class="option-text">${question.option_a}</div>
                </div>
                <div class="option-item ${savedAnswer === 'B' ? 'selected' : ''}" data-question="${globalIdx}" data-option="B">
                    <div class="option-label">B</div>
                    <div class="option-text">${question.option_b}</div>
                </div>
                <div class="option-item ${savedAnswer === 'C' ? 'selected' : ''}" data-question="${globalIdx}" data-option="C">
                    <div class="option-label">C</div>
                    <div class="option-text">${question.option_c}</div>
                </div>
            </div>
        `;
        
        questionDiv.innerHTML = qHtml;
        container.appendChild(questionDiv);
    });
}

// ===== RENDER READING QUESTIONS HSK1 =====
function renderReadingQuestionsHSK1(sectionQuestions, startIdx) {
    const container = document.getElementById('questionsContainer');
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    sectionQuestions.forEach((question, idx) => {
        const globalIdx = startIdx + idx;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        const savedAnswer = userAnswers[globalIdx] || '';
        let qHtml = `
            <div class="question-header">${globalIdx + 1}. ${question.question_text}</div>
            <div class="text-input-container" style="display: block !important;">
                <input type="text" 
                       class="text-input" 
                       data-question="${globalIdx}" 
                       value="${savedAnswer}" 
                       placeholder="Nhập đáp án của bạn...">
            </div>
        `;
        questionDiv.innerHTML = qHtml;
        container.appendChild(questionDiv);
    });
}

// ===== RENDER READING QUESTIONS HSK2+ =====
function renderReadingQuestionsHSK2Plus(sectionQuestions, startIdx) {
    const container = document.getElementById('questionsContainer');
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    sectionQuestions.forEach((question, idx) => {
        const globalIdx = startIdx + idx;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        const savedAnswer = userAnswers[globalIdx] || '';
        const yesSelected = savedAnswer === 'Y';
        const noSelected = savedAnswer === 'N';
        const imageUrl = question.image_url || question.image || '';
        const caption = question.question_text || '';
        let qHtml = `
            <div class="question-header">${globalIdx + 1}. ${caption}</div>
            <div class="image-choice-item">
                <img class="image-thumb" src="${imageUrl}" alt="item ${globalIdx + 1}" />
                <div class="image-caption">Hình trên có xuất hiện trong đoạn nghe?</div>
                <div class="image-choice-actions">
                    <div class="image-toggle yes ${yesSelected ? 'selected' : ''}" data-question="${globalIdx}" data-choice="Y">✓ Có</div>
                    <div class="image-toggle no ${noSelected ? 'selected' : ''}" data-question="${globalIdx}" data-choice="N">✕ Không</div>
                </div>
            </div>
        `;
        questionDiv.innerHTML = qHtml;
        container.appendChild(questionDiv);
    });
}

// ===== ATTACH EVENT LISTENERS =====
function attachAnswerEventListeners() {
    // Multiple choice options
    document.querySelectorAll('.option-item').forEach(item => {
        item.addEventListener('click', function() {
            const questionIdx = parseInt(this.dataset.question);
            const option = this.dataset.option;
            
            // Remove selected from siblings
            const parent = this.parentElement;
            parent.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
            
            // Add selected to this
            this.classList.add('selected');
            
            // Save answer
            saveUserAnswer(questionIdx, option);
            updateSectionProgressCircles();
            updateNavButtons();
        });
    });
    
    // Image Yes/No toggles (section 2)
    document.querySelectorAll('.image-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const questionIdx = parseInt(this.dataset.question);
            const choice = this.dataset.choice; // 'Y' or 'N'
            const parent = this.parentElement;
            parent.querySelectorAll('.image-toggle').forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            saveUserAnswer(questionIdx, choice);
            updateSectionProgressCircles();
            updateNavButtons();
        });
    });

    // Text inputs (fill-in) for HSK1 Section 2
    document.querySelectorAll('.text-input').forEach(input => {
        input.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            const value = this.value.trim();
            if (value) {
                saveUserAnswer(questionIdx, value);
            } else {
                removeUserAnswer(questionIdx);
            }
            updateSectionProgressCircles();
            updateNavButtons();
        });
    });
    
    // Essay textareas
    document.querySelectorAll('.essay-input').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            const value = this.value.trim();
            if (value) {
                saveUserAnswer(questionIdx, value);
            } else {
                removeUserAnswer(questionIdx);
            }
            
            // Update word count for writing section
            if (getCurrentSection() === 3) {
                const wordCount = value.split(/\s+/).filter(w => w.length > 0).length;
                const wordCountEl = document.querySelector('.word-count strong');
                if (wordCountEl) {
                    wordCountEl.textContent = wordCount;
                }
            }
            
            updateSectionProgressCircles();
            updateNavButtons();
        });
    });
}

// ===== SAVE USER ANSWER =====
function saveUserAnswer(questionIdx, answer) {
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    userAnswers[questionIdx] = answer;
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
}

// ===== REMOVE USER ANSWER =====
function removeUserAnswer(questionIdx) {
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    delete userAnswers[questionIdx];
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
}

// ===== UPDATE PROGRESS CIRCLES =====
function updateSectionProgressCircles() {
    const progressRow = document.querySelector('.progress-row');
    if (!progressRow) return;
    
    // Clear existing circles
    progressRow.innerHTML = '';
    
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    const currentSection = getCurrentSection();
    
    let startIdx, count;
    
    if (currentSection === 1) {
        startIdx = 0;
        count = listeningQuestions.length; // 5
    } else if (currentSection === 2) {
        startIdx = listeningQuestions.length; // 5
        count = readingQuestions.length; // 5
    } else {
        startIdx = listeningQuestions.length + readingQuestions.length; // 10
        count = writingQuestions.length; // 1
    }
    
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    // Create circles for current section
    for (let i = 0; i < count; i++) {
        const questionIdx = startIdx + i;
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.textContent = questionIdx + 1;
        circle.dataset.questionIndex = questionIdx;
        
        if (userAnswers[questionIdx]) {
            circle.classList.add('answered');
        }
        
        // Add click event to scroll to question
        circle.addEventListener('click', function() {
            scrollToQuestion(questionIdx);
        });
        
        progressRow.appendChild(circle);
    }
}

// ===== SCROLL TO QUESTION =====
function scrollToQuestion(questionIdx) {
    const questionItems = document.querySelectorAll('.question-item');
    
    const { listeningQuestions, readingQuestions } = getSectionQuestions();
    const currentSection = getCurrentSection();
    
    // Find the question item index in current section
    let startIdx;
    if (currentSection === 1) {
        startIdx = 0;
    } else if (currentSection === 2) {
        startIdx = listeningQuestions.length;
    } else {
        startIdx = listeningQuestions.length + readingQuestions.length;
    }
    
    const relativeIdx = questionIdx - startIdx;
    
    if (questionItems[relativeIdx]) {
        questionItems[relativeIdx].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // Add highlight effect
        questionItems[relativeIdx].style.background = '#fff9c4';
        setTimeout(() => {
            questionItems[relativeIdx].style.background = '';
        }, 1000);
    }
}

// ===== UPDATE NAV BUTTONS =====
function updateNavButtons() {
    const btnNext = document.getElementById('btnNextSection');
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (getCurrentSection() === 3) {
        // Last section - show submit
        if (btnNext) btnNext.style.display = 'none';
        if (btnSubmit) btnSubmit.style.display = 'block';
    } else {
        // Show next section button
        if (btnNext) btnNext.style.display = 'block';
        if (btnNext) btnNext.disabled = !isSectionComplete();
        if (btnSubmit) btnSubmit.style.display = 'none';
    }
    
    console.log('Nav buttons updated. Current section:', getCurrentSection());
    console.log('Next button disabled:', btnNext?.disabled);
}

// ===== CHECK IF SECTION IS COMPLETE =====
function isSectionComplete() {
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    const currentSection = getCurrentSection();
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    console.log('Checking section complete for section:', currentSection);
    console.log('User answers:', userAnswers);
    
    let startIdx, endIdx;
    
    if (currentSection === 1) {
        startIdx = 0;
        endIdx = listeningQuestions.length;
    } else if (currentSection === 2) {
        startIdx = listeningQuestions.length;
        endIdx = startIdx + readingQuestions.length;
    } else if (currentSection === 3) {
        startIdx = listeningQuestions.length + readingQuestions.length;
        endIdx = startIdx + writingQuestions.length;
    }
    
    console.log('Checking questions from', startIdx, 'to', endIdx);
    
    for (let i = startIdx; i < endIdx; i++) {
        if (!userAnswers.hasOwnProperty(i)) {
            console.log('Section incomplete, missing answer for question:', i);
            return false;
        }
    }
    
    console.log('Section complete!');
    return true;
}

// ===== UPDATE PROGRESS CIRCLES =====
function updateSectionProgressCircles(totalQuestions, sectionNum) {
    const progressCircles = document.querySelector('.progress-circles');
    if (!progressCircles) return;
    
    let html = '';
    const questionsPerRow = 5;
    const rows = Math.ceil(totalQuestions / questionsPerRow);
    
    for (let row = 0; row < rows; row++) {
        html += '<div class="progress-row">';
        const startQuestion = row * questionsPerRow + 1;
        const endQuestion = Math.min(startQuestion + questionsPerRow - 1, totalQuestions);
        
        for (let i = startQuestion; i <= endQuestion; i++) {
            html += `<div class="circle" data-question="${i}">${i}</div>`;
        }
        html += '</div>';
    }
    
    progressCircles.innerHTML = html;
    console.log(`Updated progress circles: ${totalQuestions} questions for section ${sectionNum}`);
}
