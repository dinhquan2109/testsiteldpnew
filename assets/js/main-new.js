// ===== MAIN NEW LOGIC =====
import { supabase, setUserRowId, getSelectedLevel } from './supabase-config.js';
import { saveUserInfo, getQuestionsByLevel, saveTestResults } from './api-functions.js';
import { setupFormValidation, validateForm } from './form-validation.js';
import { setupLevelSelection, getSelectedLevel as getLevel } from './level-selection.js';
import { displaySection } from './section-display.js';
import { startTimer, clearTimer } from './timer-functions.js';
import { calculateScore } from './test-scoring.js';
import { displayResult } from './result-display.js';
import { resetAudio } from './audio-handler.js';

// ===== SUPPORT BUTTON HANDLER =====
function setupSupportButton() {
    const supportBtn = document.getElementById('supportBtn');
    const supportPopup = document.getElementById('supportPopup');
    
    if (supportBtn && supportPopup) {
        supportBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            supportPopup.classList.toggle('active');
        });
        
        // Close popup when clicking outside
        document.addEventListener('click', function(e) {
            if (!supportBtn.contains(e.target)) {
                supportPopup.classList.remove('active');
            }
        });
        
        // Prevent popup from closing when clicking inside it
        supportPopup.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// ===== FORM SUBMIT =====
function setupFormSubmit() {
    const form = document.getElementById('placementForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            alert('Vui lòng kiểm tra lại thông tin đã nhập!');
            return;
        }

        const formData = new FormData(form);
        const userData = {
            fullname: formData.get('fullname').trim(),
            age: formData.get('age').trim(),
            phone: formData.get('phone'),
            email: formData.get('email')
        };

        // Show phone confirmation modal
        document.getElementById('modalPhone').textContent = userData.phone;
        document.getElementById('modalOverlay').classList.add('show');
    });
}

// ===== MODAL HANDLERS =====
function setupModalHandlers() {
    const modalClose = document.getElementById('modalClose');
    const btnChangePhone = document.getElementById('btnChangePhone');
    const btnConfirm = document.getElementById('btnConfirm');

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            document.getElementById('modalOverlay').classList.remove('show');
        });
    }

    if (btnChangePhone) {
        btnChangePhone.addEventListener('click', function() {
            document.getElementById('modalOverlay').classList.remove('show');
            document.getElementById('phone').focus();
        });
    }

    if (btnConfirm) {
        btnConfirm.addEventListener('click', async function() {
            const btnConfirm = this;
            const btnChangePhone = document.getElementById('btnChangePhone');

            btnConfirm.disabled = true;
            btnChangePhone.disabled = true;
            btnConfirm.innerHTML = '<span class="loading-spinner"></span> Đang lưu...';

            const formData = new FormData(document.getElementById('placementForm'));
            const userData = {
                fullname: formData.get('fullname').trim(),
                age: formData.get('age').trim(),
                phone: formData.get('phone'),
                email: formData.get('email')
            };

            const result = await saveUserInfo(userData);

            if (!result.success) {
                alert('Không thể lưu dữ liệu: ' + result.error);
                btnConfirm.disabled = false;
                btnChangePhone.disabled = false;
                btnConfirm.textContent = 'Xác nhận';
                return;
            }

            setUserRowId(result.userId);

            document.getElementById('modalOverlay').classList.remove('show');
            setTimeout(() => {
                document.getElementById('mainPage').classList.add('hide');
                // Skip instructions for HSK specific pages
                if (window.location.pathname.includes('hsk1.html') || 
                    window.location.pathname.includes('hsk2.html') || 
                    window.location.pathname.includes('hsk3.html') || 
                    window.location.pathname.includes('hsk4.html') || 
                    window.location.pathname.includes('hsk5.html')) {
                    // For HSK specific pages, go directly to test
                    document.getElementById('testPage').classList.add('show');
                } else {
                    // For main page, show instructions
                    document.getElementById('instructionsPage').classList.add('show');
                }
            }, 300);
        });
    }
}

// ===== START TEST =====
function setupStartTest() {
    const startBtn = document.getElementById('startTestBtn');
    if (!startBtn) return;

    startBtn.addEventListener('click', async function() {
        const selectedLevel = getLevel();
        if (!selectedLevel) {
            alert('Vui lòng chọn trình độ muốn test!');
            return;
        }

        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Đang tải câu hỏi...';

        try {
            const result = await getQuestionsByLevel(selectedLevel.table, selectedLevel.range);
            
            if (!result.success) {
                alert(`Đề thi ${selectedLevel.hsk} đang được cập nhật.`);
                btn.disabled = false;
                btn.textContent = 'BẮT ĐẦU';
                return;
            }

            // Reset audio count
            resetAudio();

            document.getElementById('instructionsPage').classList.remove('show');
            document.getElementById('testPage').classList.add('show');

            startTimer(20 * 60);
            displaySection(1);
        } catch (err) {
            alert('Lỗi khi tải câu hỏi: ' + err.message);
            btn.disabled = false;
            btn.textContent = 'BẮT ĐẦU';
        }
    });
}

// ===== NAVIGATION BUTTONS =====
function setupNavigationButtons() {
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

    // Submit button
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

            await submitTest();
        });
    }
}

// ===== SUBMIT TEST =====
async function submitTest() {
    clearTimer();

    const submitBtn = document.getElementById('btnSubmit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Đang chấm bài...';
    }

    try {
        const scoreData = await calculateScore();
        const { selectedHSK } = getSelectedLevel() || {};
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
        const userId = localStorage.getItem('userRowId');

        const resultData = {
            userId: userId,
            answers: userAnswers,
            score: scoreData.score,
            writingAIScore: scoreData.writingAIScore,
            writingAIComment: scoreData.writingAIComment,
            selectedHSK: selectedHSK
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
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'NỘP BÀI';
        }
    }
}

// ===== FINISH BUTTON =====
function setupFinishButton() {
    const btnFinish = document.getElementById('btnFinish');
    if (btnFinish) {
        btnFinish.addEventListener('click', function() {
            window.location.reload();
        });
    }
}

// ===== GET CURRENT SECTION =====
function getCurrentSection() {
    // This should be imported from supabase-config.js
    // For now, we'll use a simple approach
    return parseInt(localStorage.getItem('currentSection') || '1');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    try {
        setupSupportButton();
        console.log('Support button setup complete');
    } catch (error) {
        console.error('Error setting up support button:', error);
    }
    
    try {
        setupFormValidation();
        console.log('Form validation setup complete');
    } catch (error) {
        console.error('Error setting up form validation:', error);
    }
    
    try {
        setupFormSubmit();
        console.log('Form submit setup complete');
    } catch (error) {
        console.error('Error setting up form submit:', error);
    }
    
    try {
        setupModalHandlers();
        console.log('Modal handlers setup complete');
    } catch (error) {
        console.error('Error setting up modal handlers:', error);
    }
    
    // Only setup level selection if not on HSK specific pages
    if (!window.location.pathname.includes('hsk1.html') && 
        !window.location.pathname.includes('hsk2.html') && 
        !window.location.pathname.includes('hsk3.html') && 
        !window.location.pathname.includes('hsk4.html') && 
        !window.location.pathname.includes('hsk5.html')) {
        try {
            setupLevelSelection();
            console.log('Level selection setup complete');
        } catch (error) {
            console.error('Error setting up level selection:', error);
        }
    }
    
    try {
        setupStartTest();
        console.log('Start test setup complete');
    } catch (error) {
        console.error('Error setting up start test:', error);
    }
    
    // Only setup navigation buttons if not on HSK specific pages
    if (!window.location.pathname.includes('hsk1.html') && 
        !window.location.pathname.includes('hsk2.html') && 
        !window.location.pathname.includes('hsk3.html') && 
        !window.location.pathname.includes('hsk4.html') && 
        !window.location.pathname.includes('hsk5.html')) {
        try {
            setupNavigationButtons();
            console.log('Navigation buttons setup complete');
        } catch (error) {
            console.error('Error setting up navigation buttons:', error);
        }
    }
    
    try {
        setupFinishButton();
        console.log('Finish button setup complete');
    } catch (error) {
        console.error('Error setting up finish button:', error);
    }
    
    console.log('App initialization complete');
});
