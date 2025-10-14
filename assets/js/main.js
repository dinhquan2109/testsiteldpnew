// ===== MAIN APPLICATION LOGIC =====
import { supabase, saveUserInfo, getQuestionsByLevel, saveTestResults } from './supabase.js';
import { validatePhone, validateEmail, validateForm } from './validation.js';

// ===== GLOBAL VARIABLES =====
let userRowId = null;
let testQuestions = [];
let userAnswers = {};
let currentQuestionIndex = 0;
let timerInterval = null;

// Test structure - 3 sections
let currentSection = 1; // 1=Listening, 2=Reading, 3=Writing
let audioPlayCount = 0;
const MAX_AUDIO_PLAYS = 2;
let audioEndedFlag = false; // Prevent double trigger

// Level selection
let selectedLevel = null;
let selectedRange = null;
let selectedHSK = null; // numeric: 1..5
let selectedTable = null; // per-level table name

// Section data
let listeningQuestions = [];
let readingQuestions = [];
let writingQuestions = [];

// ===== FORM SUBMIT =====
function setupFormSubmit() {
    const form = document.getElementById('placementForm');
    if (!form) {
        console.error('Form not found: placementForm');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted - preventDefault called');

        console.log('Starting form validation...');
        if (!validateForm()) {
            console.log('Form validation failed - stopping submission');
            return;
        }
        console.log('Form validation passed');

        const fullname = document.getElementById('fullname').value.trim();
        const ageValue = document.getElementById('age').value.trim();
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        console.log('Form data collected:', { fullname, ageValue, phone, email });

        const modalPhone = document.getElementById('modalPhone');
        const modalOverlay = document.getElementById('modalOverlay');
        
        console.log('Modal elements found:', { modalPhone: !!modalPhone, modalOverlay: !!modalOverlay });
        
        if (modalPhone) {
            modalPhone.textContent = phone;
            console.log('Modal phone updated to:', phone);
        }
        if (modalOverlay) {
            modalOverlay.classList.add('show');
            console.log('Modal overlay shown');
        }
    });
}

// ===== MODAL HANDLERS =====
function setupModalHandlers() {
    const modalClose = document.getElementById('modalClose');
    const btnChangePhone = document.getElementById('btnChangePhone');
    const btnConfirm = document.getElementById('btnConfirm');
    
    if (!modalClose || !btnChangePhone || !btnConfirm) {
        console.error('Modal elements not found');
        return;
    }
    
    modalClose.addEventListener('click', function() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('show');
    });

    btnChangePhone.addEventListener('click', function() {
        const modalOverlay = document.getElementById('modalOverlay');
        const phoneInput = document.getElementById('phone');
        if (modalOverlay) modalOverlay.classList.remove('show');
        if (phoneInput) phoneInput.focus();
    });

    // Submit to Supabase
    btnConfirm.addEventListener('click', async function() {
        console.log('Confirm button clicked - starting save process');
        
        const btnConfirm = this;
        const btnChangePhone = document.getElementById('btnChangePhone');

        btnConfirm.disabled = true;
        if (btnChangePhone) btnChangePhone.disabled = true;
        btnConfirm.innerHTML = '<span class="loading-spinner"></span> Đang lưu...';

        const fullname = document.getElementById('fullname').value.trim();
        const ageValue = document.getElementById('age').value.trim();
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        
        console.log('Saving user data:', { fullname, ageValue, phone, email });
        
        // Save to localStorage for result page
        localStorage.setItem('fullname', fullname);
        console.log('Data saved to localStorage');

        try {
            const userData = { fullname, age: ageValue ? parseInt(ageValue) : null, phone, email };
            console.log('Attempting to save to Supabase:', userData);
            const data = await saveUserInfo(userData);
            userRowId = data?.id || Date.now();
            console.log('User data saved successfully, ID:', userRowId);
        } catch (error) {
            console.error('Error saving user data:', error);
            alert('Không thể lưu dữ liệu: ' + error.message);
            btnConfirm.disabled = false;
            if (btnChangePhone) btnChangePhone.disabled = false;
            btnConfirm.textContent = 'Xác nhận';
            return;
        }

        const modalOverlay = document.getElementById('modalOverlay');
        const mainPage = document.getElementById('mainPage');
        const instructionsPage = document.getElementById('instructionsPage');
        
        console.log('Page elements found:', { modalOverlay: !!modalOverlay, mainPage: !!mainPage, instructionsPage: !!instructionsPage });
        
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
            console.log('Modal overlay hidden');
        }
        
        setTimeout(() => {
            console.log('Switching to level selection...');
            if (mainPage) {
                mainPage.classList.add('hide');
                console.log('Main page hidden');
            }
            if (instructionsPage) {
                instructionsPage.classList.add('show');
                console.log('Level selection page shown');
            }
        }, 100);
    });
}

// ===== LEVEL SELECTION =====
function setupLevelSelection() {
    const levelOptions = document.querySelectorAll('.level-option');
    if (levelOptions.length === 0) {
        console.log('No level options found - this might be a dedicated HSK page');
        return;
    }
    
    levelOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log('Level option clicked:', this.dataset.level);
            
            // Remove selected from all
            document.querySelectorAll('.level-option').forEach(opt => opt.classList.remove('selected'));
            
            // Add selected to this
            this.classList.add('selected');
            
            // Save selected level
            selectedLevel = this.dataset.level;
            selectedRange = this.dataset.range;
            selectedHSK = this.dataset.hsk; // numeric string
            selectedTable = this.dataset.table || 'questions';
            
            console.log('Selected:', {level: selectedLevel, range: selectedRange, hsk: selectedHSK});
            
            // Enable start button
            const startBtn = document.getElementById('startTestBtn');
            if (startBtn) startBtn.disabled = false;
        });
    });
}

// ===== START TEST =====
function setupStartTest() {
    const startBtn = document.getElementById('startTestBtn');
    if (!startBtn) {
        console.error('Start test button not found');
        return;
    }
    
    startBtn.addEventListener('click', async function() {
        console.log('Start test button clicked');
        
        if (!userRowId) {
            alert('Lỗi: Không tìm thấy thông tin người dùng!');
            return;
        }

        // Check if this is HSK1 page (no level selection needed)
        const isHSK1Page = this.hasAttribute('data-hsk');
        if (isHSK1Page) {
            selectedLevel = this.dataset.level;
            selectedRange = this.dataset.range;
            selectedHSK = this.dataset.hsk;
            selectedTable = this.dataset.table;
            console.log('HSK page detected:', { selectedLevel, selectedRange, selectedHSK, selectedTable });
        } else {
            if (!selectedLevel) {
                alert('Vui lòng chọn trình độ muốn test!');
                return;
            }
        }

        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Đang tải câu hỏi...';

        try {
            console.log('Loading questions for:', { selectedTable, selectedRange });
            const questions = await getQuestionsByLevel(selectedTable, selectedRange);

            if (!questions || questions.length === 0) {
                alert(`Đề thi ${selectedHSK} đang được cập nhật.`);
                btn.disabled = false;
                btn.textContent = 'BẮT ĐẦU';
                return;
            }

            console.log('Questions loaded:', questions.length);

            // Separate by section field if available, else fallback split
            if (questions[0] && 'section' in questions[0]) {
                listeningQuestions = questions.filter(q => q.section === 'listening');
                readingQuestions = questions.filter(q => q.section === 'reading');
                writingQuestions = questions.filter(q => q.section === 'writing');
            } else {
                // For HSK1, we need to handle the data structure differently
                if (selectedHSK === '1') {
                    // HSK1 has 5 listening, 5 reading, 1 writing
                    listeningQuestions = questions.slice(0, 5);
                    readingQuestions = questions.slice(5, 10);
                    writingQuestions = questions.slice(10, 11);
                } else {
                    // Other levels
                    listeningQuestions = questions.slice(0, 5);
                    readingQuestions = questions.slice(5, 10);
                    writingQuestions = questions.slice(10, 11);
                }
            }
            
            console.log('Questions separated:', { 
                listening: listeningQuestions.length, 
                reading: readingQuestions.length, 
                writing: writingQuestions.length 
            });
            
            testQuestions = questions;
            userAnswers = {};
            currentSection = 1;
            audioPlayCount = 0;

            // Redirect to appropriate HSK page
            const hskPage = `pages/hsk${selectedHSK}.html`;
            console.log('Redirecting to:', hskPage);
            window.location.href = hskPage;
        } catch (err) {
            console.error('Error loading questions:', err);
            alert('Lỗi khi tải câu hỏi: ' + err.message);
            btn.disabled = false;
            btn.textContent = 'BẮT ĐẦU';
        }
    });
}

// ===== RESULT LOGIC REMOVED =====
// Result logic has been moved to result.html and result.js

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
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
    
    try {
        setupLevelSelection();
        console.log('Level selection setup complete');
    } catch (error) {
        console.error('Error setting up level selection:', error);
    }
    
    try {
        setupStartTest();
        console.log('Start test setup complete');
    } catch (error) {
        console.error('Error setting up start test:', error);
    }
    
    console.log('App initialization complete');
});

// Debug: Check if form exists
setTimeout(() => {
    const form = document.getElementById('placementForm');
    console.log('Form element found:', !!form);
    if (form) {
        console.log('Form has submit event listener:', form.onsubmit !== null);
    }
}, 1000);

// Export for use in other modules
export { 
    supabase, 
    userRowId, 
    testQuestions, 
    userAnswers, 
    currentSection, 
    selectedLevel, 
    selectedHSK, 
    selectedTable,
    listeningQuestions,
    readingQuestions,
    writingQuestions
};