// ===== TEST ENGINE LOGIC =====
import { supabase, userRowId, userAnswers, currentSection, selectedHSK, listeningQuestions, readingQuestions, writingQuestions } from './main.js';
import { saveTestResults } from './supabase.js';
import { displayResult } from './ai-feedback.js';
import { getQuestionStructureByLevel, renderSectionHeader, renderQuestionByType } from './hsk-questions.js';

// ===== TIMER FUNCTIONS =====
let timerInterval = null;

function startTimer(seconds) {
    let remaining = seconds;
    updateTimerDisplay(remaining);

    timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);

        if (remaining <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ===== DISPLAY SECTION =====
function displaySection(sectionNum) {
    currentSection = sectionNum;
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    // Get question structure for current HSK level
    let structure, section;
    try {
        structure = getQuestionStructureByLevel(selectedHSK);
        section = structure.sections[sectionNum - 1];
        
        if (!section) {
            console.error('Section not found:', sectionNum);
            return;
        }
    } catch (error) {
        console.error('Error getting question structure:', error);
        // Fallback to basic structure
        section = {
            title: `Phần ${sectionNum}`,
            description: `Mô tả phần ${sectionNum}`,
            name: sectionNum === 1 ? 'listening' : sectionNum === 2 ? 'reading' : 'writing'
        };
    }
    
    let html = '';
    let sectionQuestions = [];
    let startIdx = 0;
    
    // Get questions for current section
    if (sectionNum === 1) {
        sectionQuestions = listeningQuestions;
        startIdx = 0;
    } else if (sectionNum === 2) {
        sectionQuestions = readingQuestions;
        startIdx = listeningQuestions.length;
    } else if (sectionNum === 3) {
        sectionQuestions = writingQuestions;
        startIdx = listeningQuestions.length + readingQuestions.length;
    }
    
    // Render section header
    try {
        html += renderSectionHeader(section, audioPlayCount, MAX_AUDIO_PLAYS);
    } catch (error) {
        console.error('Error rendering section header:', error);
        // Fallback to basic header
        html += `
            <div class="section-header">
                <div class="section-title">${section.title}</div>
                <div class="section-description">${section.description}</div>
            </div>
        `;
    }
    
    // Update page info
    document.getElementById('questionCounter').textContent = `${section.title} (${sectionQuestions.length} câu)`;
    document.getElementById('pageInfo').textContent = `${sectionNum}/3 - ${section.title}`;
    
    container.innerHTML = html;
    
    container.innerHTML = html;
    if (!sectionQuestions || sectionQuestions.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'question-item';
        empty.innerHTML = '<div style="text-align:center;color:#777;font-weight:700;">Chưa có câu hỏi cho phần này</div>';
        container.appendChild(empty);
    }
    
    // Render questions based on type
    sectionQuestions.forEach((question, idx) => {
        const globalIdx = startIdx + idx;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        const savedAnswer = userAnswers[globalIdx] || '';
        let questionHtml;
        
        try {
            questionHtml = renderQuestionByType(question, idx, globalIdx, savedAnswer);
        } catch (error) {
            console.error('Error rendering question:', error);
            // Fallback to basic question display
            questionHtml = `
                <div class="question-header">${globalIdx + 1}. ${question.question_text || 'Câu hỏi'}</div>
                <div class="question-content">
                    <p>Nội dung câu hỏi sẽ được hiển thị ở đây</p>
                </div>
            `;
        }
        
        questionDiv.innerHTML = questionHtml;
        container.appendChild(questionDiv);
    });
    
    
    // Attach event listeners
    attachAnswerEventListeners();
    updateProgressCircles();
    updateNavButtons();
    
    // Audio setup - CHỈ LOAD, KHÔNG addEventListener
    if ((sectionNum === 1 || sectionNum === 2) && audioPlayCount < MAX_AUDIO_PLAYS) {
        console.log('📻 Audio section ready, count:', audioPlayCount);
        const audio = document.getElementById('mainAudio');
        if (audio) {
            audio.load();
            console.log('✅ Audio loaded');
        }
    }
}

// ===== ATTACH EVENT LISTENERS TO ANSWERS =====
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
            userAnswers[questionIdx] = option;
            updateProgressCircles();
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
            userAnswers[questionIdx] = choice;
            updateProgressCircles();
            updateNavButtons();
        });
    });

    // Text inputs (fill-in) for HSK1 Section 2
    document.querySelectorAll('.text-input').forEach(input => {
        input.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            const value = this.value.trim();
            if (value) {
                userAnswers[questionIdx] = value;
            } else {
                delete userAnswers[questionIdx];
            }
            updateProgressCircles();
            updateNavButtons();
        });
    });
    
    // Essay textareas
    document.querySelectorAll('.essay-input').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            const value = this.value.trim();
            if (value) {
                userAnswers[questionIdx] = value;
            } else {
                delete userAnswers[questionIdx];
            }
            
            // Update word count for writing section
            if (currentSection === 3) {
                const wordCount = value.split(/\s+/).filter(w => w.length > 0).length;
                const wordCountEl = document.querySelector('.word-count strong');
                if (wordCountEl) {
                    wordCountEl.textContent = wordCount;
                }
            }
            
            updateProgressCircles();
            updateNavButtons();
        });
    });
}

// ===== CHECK IF CURRENT SECTION IS COMPLETE =====
function isSectionComplete() {
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
    
    for (let i = startIdx; i < endIdx; i++) {
        if (!userAnswers.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

// ===== UPDATE PROGRESS CIRCLES =====
function updateProgressCircles() {
    const progressRow = document.querySelector('.progress-row');
    if (!progressRow) return;
    
    // Clear existing circles
    progressRow.innerHTML = '';
    
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
    
    if (currentSection === 3) {
        // Last section - show submit
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'block';
    } else {
        // Show next section button
        btnNext.style.display = 'block';
        btnNext.disabled = !isSectionComplete();
        btnSubmit.style.display = 'none';
    }
}

// ===== NAVIGATION BUTTONS =====
function setupNavigationButtons() {
    // Next section button
    document.getElementById('btnNextSection').addEventListener('click', function() {
        if (!isSectionComplete()) {
            let sectionName = currentSection === 1 ? 'Nghe' : 'Đọc';
            alert(`Vui lòng hoàn thành tất cả câu hỏi trong phần ${sectionName} trước khi chuyển sang phần tiếp theo!`);
            return;
        }
        
        if (currentSection < 3) {
            displaySection(currentSection + 1);
            // Scroll to top
            document.getElementById('questionsContainer').scrollTop = 0;
        }
    });

    document.getElementById('btnSubmit').addEventListener('click', function() {
        const answeredCount = Object.keys(userAnswers).length;
        const totalQuestions = testQuestions.length; // Should be 11
        const totalScorableQuestions = listeningQuestions.length + readingQuestions.length; // số câu chấm điểm

        if (answeredCount < totalQuestions) {
            if (!confirm(`Bạn mới trả lời ${answeredCount}/${totalQuestions} câu.\nBạn có chắc chắn muốn nộp bài?`)) {
                return;
            }
        }

        submitTest();
    });
}

// ===== SUBMIT TEST =====
async function submitTest() {
    clearInterval(timerInterval);

    const submitBtn = document.getElementById('btnSubmit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Đang chấm bài...';

    let score = 0;
    const pointsPerQuestion = (selectedHSK === '1') ? 2 : 1; // HSK1: 2 điểm/câu
    let writingAIScore = 0; // 0-10
    let writingAIComment = '';
    
    // Score listening questions (index 0-4) - Multiple choice
    listeningQuestions.forEach((q, i) => {
        if (userAnswers[i] === q.correct_answer) {
            score += pointsPerQuestion;
        }
    });
    
    // Score reading questions (index 5-9)
    const readingStartIdx = listeningQuestions.length;
    readingQuestions.forEach((q, i) => {
        const globalIdx = readingStartIdx + i;
        const userAnswer = userAnswers[globalIdx];
        const correctAnswer = q.correct_answer;
        // If this section is image Yes/No: expect 'Y' or 'N'
        if (userAnswer && correctAnswer) {
            if ((userAnswer === 'Y' || userAnswer === 'N') && (correctAnswer === 'Y' || correctAnswer === 'N')) {
                if (userAnswer === correctAnswer) score += pointsPerQuestion;
            } else if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
                if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) score += pointsPerQuestion;
            }
        }
    });

    // AI score for writing (0-10) + AI comment
    try {
        const writingIndex = listeningQuestions.length + readingQuestions.length;
        const writingAnswer = userAnswers[writingIndex];
        if (writingAnswer && writingAnswer.trim().length > 0) {
            const ai = await getAIWritingScore(writingAnswer, selectedHSK);
            if (ai && typeof ai.total !== 'undefined') {
                let totalNum = Number(ai.total);
                if (Number.isNaN(totalNum) && typeof ai.total === 'string') {
                    const m = ai.total.match(/\d+(?:\.\d+)?/);
                    if (m) totalNum = Number(m[0]);
                }
                // Luôn làm tròn xuống để khớp với hiển thị 9/10 -> 9
                writingAIScore = Math.floor(Math.max(0, Math.min(10, totalNum)));
                score += writingAIScore;
            }
            // get friendly comment for storage
            const aiComment = await getAIWritingComment(writingAnswer, selectedHSK);
            if (typeof aiComment === 'string') {
                writingAIComment = aiComment.trim().slice(0, 4000);
                // Override score using total parsed from comment if present (ensure consistency)
                let parsed = null;
                // pattern like "8/10" or "8.5/10"
                let m = writingAIComment.match(/(\d+(?:[\.,]\d+)?)\s*\/\s*10/);
                if (m) {
                    parsed = Number(m[1].replace(',', '.'));
                } else {
                    // fallback: first number 0..10 near keywords 'tổng điểm' or 'điểm'
                    m = writingAIComment.match(/tổng\s*điểm[^\d]*(\d+(?:[\.,]\d+)?)/i) || writingAIComment.match(/\b(\d+(?:[\.,]\d+)?)\b/);
                    if (m) parsed = Number(m[1].replace(',', '.'));
                }
                if (typeof parsed === 'number' && !Number.isNaN(parsed)) {
                    const normalized = Math.floor(Math.max(0, Math.min(10, parsed)));
                    // adjust total score to reflect overridden writing score
                    score -= writingAIScore;
                    writingAIScore = normalized;
                    score += writingAIScore;
                }
            }
        }
    } catch (e) {
        console.warn('AI writing score failed:', e.message);
    }

        try {
            const resultData = {
                placement_id: userRowId,
                answers: userAnswers,
                score: score,
                writing_ai_score: writingAIScore,
                writing_ai_comment: writingAIComment,
                selected_level: selectedHSK, // Lưu "1-2", "3-4", hoặc "5-6"
                completed_at: new Date().toISOString()
            };
            
            await saveTestResults(resultData);

        // Hide any open overlays/popups to avoid visual overlap
        try {
            const modalOverlay = document.getElementById('modalOverlay');
            if (modalOverlay) modalOverlay.classList.remove('show');
            const supportPopup = document.getElementById('supportPopup');
            if (supportPopup) supportPopup.classList.remove('show');
        } catch (_) {
            // no-op
        }

        // Store result data in localStorage
        const testResultData = {
            score: score,
            totalQuestions: listeningQuestions.length + readingQuestions.length,
            level: selectedHSK,
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('testResult', JSON.stringify(testResultData));
        console.log('Result stored:', testResultData);
        
        // Redirect to result page
        window.location.href = '../result.html';
    } catch (err) {
        alert('Lỗi khi lưu kết quả: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'NỘP BÀI';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    setupNavigationButtons();
});

// Export functions for use in other modules
export { 
    startTimer, 
    displaySection, 
    attachAnswerEventListeners, 
    updateProgressCircles, 
    updateNavButtons, 
    submitTest 
};
