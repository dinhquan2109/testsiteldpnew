// ===== HSK3 TEST LOGIC =====
import { setSelectedLevel } from './supabase-config.js';
import { getQuestionsByLevel, saveTestResults } from './api-functions.js';
import { displaySection } from './section-display.js';
import { startTimer, clearTimer } from './timer-functions.js';
import { resetAudio } from './audio-handler.js';
import { calculateScore } from './test-scoring.js';
import { displayResult } from './result-display.js';

// ===== AUTO SET HSK3 LEVEL =====
function autoSetHSK3Level() {
    // Automatically set HSK3 level
    setSelectedLevel('hsk3', null, '3', 'hsk3_questions');
    console.log('HSK3 level auto-set');
}

// ===== LOAD HSK3 QUESTIONS =====
async function loadHSK3Questions() {
    try {
        const result = await getQuestionsByLevel('hsk3_questions');
        
        if (!result.success) {
            alert(`Đề thi HSK3 đang được cập nhật.`);
            return;
        }

        // Reset audio count
        resetAudio();

        startTimer(20 * 60);
        displaySection(1);
    } catch (err) {
        alert('Lỗi khi tải câu hỏi HSK3: ' + err.message);
    }
}

// ===== SUBMIT TEST FOR HSK3 =====
async function submitHSK3Test() {
    try {
        const scoreData = await calculateScore();
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
        const userId = localStorage.getItem('userRowId');

        const resultData = {
            userId: userId,
            answers: userAnswers,
            score: scoreData.score,
            writingAIScore: scoreData.writingAIScore,
            writingAIComment: scoreData.writingAIComment,
            selectedHSK: '3'
        };

        const saveResult = await saveTestResults(resultData);
        if (!saveResult.success) {
            throw new Error(saveResult.error);
        }

        document.getElementById('testPage').classList.remove('show');
        document.getElementById('resultPage').classList.add('show');
        await displayResult(scoreData.score);
    } catch (err) {
        alert('Lỗi khi lưu kết quả: ' + err.message);
    }
}

// ===== SETUP SUBMIT BUTTON =====
function setupHSK3SubmitButton() {
    const btnSubmit = document.getElementById('btnSubmit');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', async function() {
            const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
            const answeredCount = Object.keys(userAnswers).length;
            const totalQuestions = 11; // Should be 11

            if (answeredCount < totalQuestions) {
                if (!confirm(`Bạn mới trả lời ${answeredCount}/${totalQuestions} câu.\nBạn có chắc chắn muốn nộp bài?`)) {
                    return;
                }
            }

            await submitHSK3Test();
        });
    }
}

// ===== SETUP FINISH BUTTON =====
function setupHSK3FinishButton() {
    const btnFinish = document.getElementById('btnFinish');
    if (btnFinish) {
        btnFinish.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
}

// ===== SETUP NAVIGATION BUTTONS =====
function setupHSK3NavigationButtons() {
    // Next section button
    const btnNextSection = document.getElementById('btnNextSection');
    if (btnNextSection) {
        btnNextSection.addEventListener('click', function() {
            const currentSection = getCurrentSection();
            if (currentSection < 3) {
                displaySection(currentSection + 1);
                // Scroll to top
                const questionsContainer = document.getElementById('questionsContainer');
                if (questionsContainer) {
                    questionsContainer.scrollTop = 0;
                }
            }
        });
    }
}

// ===== GET CURRENT SECTION =====
function getCurrentSection() {
    return parseInt(localStorage.getItem('currentSection') || '1');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('HSK3 test page loaded, initializing...');
    
    // Auto set HSK3 level
    autoSetHSK3Level();
    
    // Load questions and start test immediately
    loadHSK3Questions();
    
    // Setup navigation buttons
    setupHSK3NavigationButtons();
    
    // Setup submit button
    setupHSK3SubmitButton();
    
    // Setup finish button
    setupHSK3FinishButton();
    
    console.log('HSK3 test initialization complete');
});
