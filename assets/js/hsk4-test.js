// ===== HSK4 TEST LOGIC =====
import { setSelectedLevel } from './supabase-config.js';
import { getQuestionsByLevel, saveTestResults } from './api-functions.js';
import { displaySection } from './section-display.js';
import { startTimer, clearTimer } from './timer-functions.js';
import { resetAudio } from './audio-handler.js';
import { calculateScore } from './test-scoring.js';
import { displayResult } from './result-display.js';

// ===== AUTO SET HSK4 LEVEL =====
function autoSetHSK4Level() {
    // Automatically set HSK4 level
    setSelectedLevel('hsk4', null, '4', 'hsk4_questions');
    console.log('HSK4 level auto-set');
}

// ===== LOAD HSK4 QUESTIONS =====
async function loadHSK4Questions() {
    try {
        const result = await getQuestionsByLevel('hsk4_questions');
        
        if (!result.success) {
            alert(`Đề thi HSK4 đang được cập nhật.`);
            return;
        }

        // Reset audio count
        resetAudio();

        startTimer(60);
        displaySection(1);
    } catch (err) {
        alert('Lỗi khi tải câu hỏi HSK4: ' + err.message);
    }
}

// ===== SUBMIT TEST FOR HSK4 =====
async function submitHSK4Test() {
    try {
        // Show grading message
        const questionsContainer = document.getElementById('questionsContainer');
        
        if (questionsContainer) {
            questionsContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; background: #f8f9fa; border-radius: 10px; margin: 20px;">
                    <div style="font-size: 24px; margin-bottom: 20px;">📝</div>
                    <h2 style="color: #2c3e50; margin-bottom: 15px;">Đang chấm bài...</h2>
                    <p style="color: #7f8c8d; font-size: 16px;">Vui lòng chờ trong giây lát</p>
                    <div style="margin-top: 20px;">
                        <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
        }

        const scoreData = await calculateScore();
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
        const userId = localStorage.getItem('userRowId');

        const resultData = {
            userId: userId,
            answers: userAnswers,
            score: scoreData.score,
            writingAIScore: scoreData.writingAIScore,
            writingAIComment: scoreData.writingAIComment,
            selectedHSK: '4'
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
function setupHSK4SubmitButton() {
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

            await submitHSK4Test();
        });
    }
}

// ===== SETUP FINISH BUTTON =====
function setupHSK4FinishButton() {
    const btnFinish = document.getElementById('btnFinish');
    if (btnFinish) {
        btnFinish.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
}

// ===== SETUP NAVIGATION BUTTONS =====
function setupHSK4NavigationButtons() {
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
    console.log('HSK4 test page loaded, initializing...');
    
    // Auto set HSK4 level
    autoSetHSK4Level();
    
    // Load questions and start test immediately
    loadHSK4Questions();
    
    // Setup navigation buttons
    setupHSK4NavigationButtons();
    
    // Setup submit button
    setupHSK4SubmitButton();
    
    // Setup finish button
    setupHSK4FinishButton();
    
    console.log('HSK4 test initialization complete');
});
