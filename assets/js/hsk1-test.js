// ===== HSK1 TEST LOGIC =====
// Note: This file is used as a module, so imports are handled by the module system

// ===== AUTO SET HSK1 LEVEL =====
function autoSetHSK1Level() {
    // Automatically set HSK1 level
    setSelectedLevel('hsk1', '1-22', '1', 'questions');
    console.log('HSK1 level auto-set');
}

// ===== LOAD HSK1 QUESTIONS =====
async function loadHSK1Questions() {
    try {
        // Clear previous test data
        localStorage.removeItem('userAnswers');
        localStorage.removeItem('currentSection');
        localStorage.removeItem('testQuestions');
        localStorage.removeItem('listeningQuestions');
        localStorage.removeItem('readingQuestions');
        localStorage.removeItem('writingQuestions');
        
        const result = await getQuestionsByLevel('questions', '1-22');
        
        if (!result.success) {
            alert(`Đề thi HSK1 đang được cập nhật.`);
            return;
        }

        // Reset audio count
        resetAudio();
        
        // Set initial section
        localStorage.setItem('currentSection', '1');

        startTimer(60);
        displaySection(1);
    } catch (err) {
        alert('Lỗi khi tải câu hỏi HSK1: ' + err.message);
    }
}

// ===== SUBMIT TEST FOR HSK1 =====
async function submitHSK1Test() {
    try {
        // Show grading message
        const testPage = document.getElementById('testPage');
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
            selectedHSK: '1'
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
function setupHSK1SubmitButton() {
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

            await submitHSK1Test();
        });
    }
}

// ===== SETUP FINISH BUTTON =====
function setupHSK1FinishButton() {
    const btnFinish = document.getElementById('btnFinish');
    if (btnFinish) {
        btnFinish.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
}

// ===== SETUP NAVIGATION BUTTONS =====
function setupHSK1NavigationButtons() {
    // Next section button
    const btnNextSection = document.getElementById('btnNextSection');
    if (btnNextSection) {
        btnNextSection.addEventListener('click', function() {
            const currentSection = getCurrentSection();
            console.log('Current section:', currentSection);
            
            if (currentSection < 3) {
                const nextSection = currentSection + 1;
                console.log('Moving to section:', nextSection);
                
                // Update current section in localStorage
                localStorage.setItem('currentSection', nextSection.toString());
                
                // Display next section
                displaySection(nextSection);
                
                // Scroll to top
                const questionsContainer = document.getElementById('questionsContainer');
                if (questionsContainer) {
                    questionsContainer.scrollTop = 0;
                }
            }
        });
    }
}

// ===== CHECK IF SECTION IS COMPLETE =====
function isSectionComplete() {
    const currentSection = getCurrentSection();
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    console.log('Checking section complete for section:', currentSection);
    console.log('User answers:', userAnswers);
    
    // For HSK1, we have 5 listening + 5 reading + 1 writing = 11 questions
    let startIdx, endIdx;
    
    if (currentSection === 1) {
        startIdx = 0;
        endIdx = 5; // 5 listening questions
    } else if (currentSection === 2) {
        startIdx = 5;
        endIdx = 10; // 5 reading questions
    } else if (currentSection === 3) {
        startIdx = 10;
        endIdx = 11; // 1 writing question
    }
    
    for (let i = startIdx; i < endIdx; i++) {
        if (!userAnswers.hasOwnProperty(i)) {
            console.log('Section incomplete, missing answer for question:', i);
            return false;
        }
    }
    
    console.log('Section complete!');
    return true;
}

// ===== GET CURRENT SECTION =====
function getCurrentSection() {
    return parseInt(localStorage.getItem('currentSection') || '1');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('HSK1 test page loaded, initializing...');
    
    // Auto set HSK1 level
    autoSetHSK1Level();
    
    // Load questions and start test immediately
    loadHSK1Questions();
    
    // Setup navigation buttons
    setupHSK1NavigationButtons();
    
    // Setup submit button
    setupHSK1SubmitButton();
    
    // Setup finish button
    setupHSK1FinishButton();
    
    console.log('HSK1 test initialization complete');
});
