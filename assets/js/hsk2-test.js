// ===== HSK2 TEST LOGIC =====
import { setSelectedLevel } from './supabase-config.js';
import { getQuestionsByLevel, saveTestResults } from './api-functions.js';
import { displaySection } from './section-display.js';
import { startTimer, clearTimer } from './timer-functions.js';
import { resetAudio } from './audio-handler.js';
import { calculateScore } from './test-scoring.js';
import { displayResult } from './result-display.js';

// ===== AUTO SET HSK2 LEVEL =====
function autoSetHSK2Level() {
    // Automatically set HSK2 level
    setSelectedLevel('hsk2', null, '2', 'hsk2_questions');
    console.log('HSK2 level auto-set');
}

// ===== LOAD HSK2 QUESTIONS =====
async function loadHSK2Questions() {
    try {
        const result = await getQuestionsByLevel('hsk2_questions');
        
        if (!result.success) {
            alert(`Đề thi HSK2 đang được cập nhật.`);
            return;
        }

        // Reset audio count
        resetAudio();

        startTimer(20 * 60);
        displaySection(1);
    } catch (err) {
        alert('Lỗi khi tải câu hỏi HSK2: ' + err.message);
    }
}

// ===== SUBMIT TEST FOR HSK2 =====
async function submitHSK2Test() {
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
            selectedHSK: '2'
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
function setupHSK2SubmitButton() {
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

            await submitHSK2Test();
        });
    }
}

// ===== SETUP FINISH BUTTON =====
function setupHSK2FinishButton() {
    const btnFinish = document.getElementById('btnFinish');
    if (btnFinish) {
        btnFinish.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
}

// ===== SETUP NAVIGATION BUTTONS =====
function setupHSK2NavigationButtons() {
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
    console.log('HSK2 test page loaded, initializing...');
    
    // Auto set HSK2 level
    autoSetHSK2Level();
    
    // Load questions and start test immediately
    loadHSK2Questions();
    
    // Setup navigation buttons
    setupHSK2NavigationButtons();
    
    // Setup submit button
    setupHSK2SubmitButton();
    
    // Setup finish button
    setupHSK2FinishButton();
    
    console.log('HSK2 test initialization complete');
});
