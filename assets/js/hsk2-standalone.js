// ===== HSK2 STANDALONE TEST - NO MODULES =====
console.log('🚀 HSK2 Standalone JS loaded');

// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://axllpuaybdzubfmsfkws.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bGxwdWF5YmR6dWJmbXNma3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDMzODgsImV4cCI6MjA3NTMxOTM4OH0.KrjW79ZpnPxu_Lp9mETgKZU-kOLu3oMmWkABqOcDbco";

// ===== GLOBAL VARIABLES =====
let hsk2TestQuestions = [];
let hsk2UserAnswers = {};
let hsk2CurrentQuestion = 1;
let hsk2TimerInterval = null;
let hsk2AudioPlayCount = 0;
const HSK2_MAX_AUDIO_PLAYS = 2;
let supabase = null;

// ===== LOAD SUPABASE =====
function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Supabase'));
        document.head.appendChild(script);
    });
}

// ===== LOAD HSK2 QUESTIONS =====
async function loadHSK2Questions() {
    try {
        console.log('📡 Fetching HSK2 questions...');
        
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data: questions, error } = await supabase
            .from('hsk2_questions')
            .select('*')
            .order('order_number');

        if (error) throw error;

        if (!questions || questions.length === 0) {
            throw new Error('No HSK2 questions found in database');
        }
        
        hsk2TestQuestions = questions;
        console.log('✅ Questions loaded:', hsk2TestQuestions.length);
        
        startTimer(60);
        displayAllQuestions();

    } catch (error) {
        console.error('❌ Error loading questions:', error);
        document.getElementById('questionsContainer').innerHTML = `
            <div style="text-align: center; padding: 50px; color: #e74c3c;">
                <h2>Lỗi tải đề thi</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Thử lại</button>
            </div>
        `;
    }
}

// ===== DISPLAY ALL QUESTIONS (1-20 on one page) =====
function displayAllQuestions() {
    const container = document.getElementById('questionsContainer');
    let html = '';
    
    const listeningQuestions = hsk2TestQuestions.filter(q => q.section === 'listening');
    const readingQuestions = hsk2TestQuestions.filter(q => q.section === 'reading');
    
    // LISTENING SECTION (1-10)
    html += `
        <div class="section-header">
            <div class="section-title">🎧 PHẦN 1: NGHE (Listening)</div>
            <div class="section-description">Nghe file audio và chọn đúng (✓) hoặc sai (✗)</div>
        </div>
        <div class="audio-section">
            <div class="audio-info">⚠️ Chú ý phần nghe Audio chỉ nghe tối đa 2 lượt</div>
            <audio id="mainAudio" controlsList="nodownload noplaybackrate">
                <source src="${listeningQuestions[0]?.audio_url || ''}" type="audio/mpeg">
            </audio>
            <div id="audioControls" style="margin-top: 15px;">
                <button id="playBtn" class="audio-play-btn">▶️ Phát Audio</button>
                <div id="audioProgress" style="margin: 15px 0; height: 6px; background: #e0e0e0; border-radius: 3px;">
                    <div id="audioProgressBar" style="height: 100%; width: 0%; background: #FF6B6B; border-radius: 3px; transition: width 0.1s;"></div>
                </div>
                <div id="audioTime">00:00 / 00:00</div>
            </div>
        </div>
    `;
    
    // Render listening questions (1-10)
    listeningQuestions.forEach((q, idx) => {
        const savedAnswer = hsk2UserAnswers[idx];
        html += `
            <div class="question-item" id="question-${idx}">
                <div class="question-header">${idx + 1}. ${q.question_text}</div>
                ${q.image_url ? `<div class="question-image"><img src="${q.image_url}" alt="Question ${idx + 1}" style="max-width: 100%; border-radius: 8px;"></div>` : ''}
                <div class="true-false-options">
                    <button class="tf-option ${savedAnswer === 'true' ? 'selected' : ''}" data-question="${idx}" data-answer="true">
                        ✓ Đúng
                    </button>
                    <button class="tf-option ${savedAnswer === 'false' ? 'selected' : ''}" data-question="${idx}" data-answer="false">
                        ✗ Sai
                    </button>
                </div>
            </div>
        `;
    });
    
    // READING SECTION (11-15)
    const readingStartIdx = listeningQuestions.length;
    html += `
        <div class="section-header" style="margin-top: 40px;">
            <div class="section-title">📖 PHẦN 2: ĐỌC (Reading)</div>
            <div class="section-description">Chọn hình ảnh (A-F) phù hợp với mỗi câu</div>
        </div>
        <div class="reading-images" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
            <div class="reading-img-box"><strong>A</strong><br><img src="https://via.placeholder.com/150?text=A" style="width: 100%; border-radius: 8px;"></div>
            <div class="reading-img-box"><strong>B</strong><br><img src="https://via.placeholder.com/150?text=B" style="width: 100%; border-radius: 8px;"></div>
            <div class="reading-img-box"><strong>C</strong><br><img src="https://via.placeholder.com/150?text=C" style="width: 100%; border-radius: 8px;"></div>
            <div class="reading-img-box"><strong>D</strong><br><img src="https://via.placeholder.com/150?text=D" style="width: 100%; border-radius: 8px;"></div>
            <div class="reading-img-box"><strong>E</strong><br><img src="https://via.placeholder.com/150?text=E" style="width: 100%; border-radius: 8px;"></div>
            <div class="reading-img-box"><strong>F</strong><br><img src="https://via.placeholder.com/150?text=F" style="width: 100%; border-radius: 8px;"></div>
        </div>
    `;
    
    // Render reading questions (11-15)
    readingQuestions.forEach((q, idx) => {
        const globalIdx = readingStartIdx + idx;
        const savedAnswer = hsk2UserAnswers[globalIdx];
        html += `
            <div class="question-item" id="question-${globalIdx}">
                <div class="question-header">${globalIdx + 1}. ${q.question_text}</div>
                <div class="text-input-container">
                    <input type="text" 
                           class="text-input" 
                           data-question="${globalIdx}" 
                           value="${savedAnswer || ''}" 
                           placeholder="Nhập A, B, C, D, E hoặc F"
                           maxlength="1"
                           style="text-transform: uppercase;">
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    attachEventListeners();
    updateProgressCircles();
    setupAudio();
    updateNavButtons();
}

// ===== ATTACH EVENT LISTENERS =====
function attachEventListeners() {
    // True/False buttons
    document.querySelectorAll('.tf-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionIdx = parseInt(this.dataset.question);
            const answer = this.dataset.answer;
            
            this.parentElement.querySelectorAll('.tf-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            saveUserAnswer(questionIdx, answer);
            updateProgressCircles();
            updateNavButtons();
        });
    });
    
    // Text inputs (reading)
    document.querySelectorAll('.text-input').forEach(input => {
        input.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            const value = this.value.trim().toUpperCase();
            if (/^[A-F]$/.test(value)) {
                saveUserAnswer(questionIdx, value);
            } else if (value === '') {
                removeUserAnswer(questionIdx);
            }
            updateProgressCircles();
            updateNavButtons();
        });
    });
    
    // Progress circles click to jump
    document.querySelectorAll('.circle').forEach((circle, idx) => {
        circle.addEventListener('click', function() {
            scrollToQuestion(idx);
        });
    });
}

// ===== SCROLL TO QUESTION =====
function scrollToQuestion(questionIdx) {
    const questionEl = document.getElementById(`question-${questionIdx}`);
    if (questionEl) {
        questionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        questionEl.style.backgroundColor = '#FFF5F5';
        setTimeout(() => {
            questionEl.style.backgroundColor = '';
        }, 1000);
    }
}

// ===== SAVE/REMOVE USER ANSWER =====
function saveUserAnswer(questionIdx, answer) {
    hsk2UserAnswers[questionIdx] = answer;
    localStorage.setItem('hsk2UserAnswers', JSON.stringify(hsk2UserAnswers));
}

function removeUserAnswer(questionIdx) {
    delete hsk2UserAnswers[questionIdx];
    localStorage.setItem('hsk2UserAnswers', JSON.stringify(hsk2UserAnswers));
}

// ===== UPDATE PROGRESS CIRCLES =====
function updateProgressCircles() {
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, idx) => {
        if (hsk2UserAnswers[idx]) {
            circle.classList.add('answered');
        } else {
            circle.classList.remove('answered');
        }
    });
}

// ===== UPDATE NAV BUTTONS =====
function updateNavButtons() {
    const btnSubmit = document.getElementById('btnSubmit');
    const btnNext = document.getElementById('btnNextSection');
    
    const totalQuestions = hsk2TestQuestions.filter(q => q.section !== 'writing').length;
    const answeredCount = Object.keys(hsk2UserAnswers).length;
    
    if (answeredCount >= totalQuestions) {
        if (btnSubmit) btnSubmit.style.display = 'block';
        if (btnNext) btnNext.style.display = 'none';
    } else {
        if (btnSubmit) btnSubmit.style.display = 'none';
        if (btnNext) btnNext.style.display = 'none';
    }
}

// ===== TIMER =====
function startTimer(minutes) {
    let remaining = minutes * 60;
    updateTimerDisplay(remaining);

    hsk2TimerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);

        if (remaining <= 0) {
            clearInterval(hsk2TimerInterval);
            submitTest();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}

// ===== AUDIO =====
function setupAudio() {
    const playBtn = document.getElementById('playBtn');
    const audio = document.getElementById('mainAudio');
    
    if (!playBtn || !audio) return;
    
    playBtn.addEventListener('click', function() {
        if (hsk2AudioPlayCount >= HSK2_MAX_AUDIO_PLAYS) {
            alert('Bạn đã hết lượt nghe audio!');
            return;
        }
        
        if (audio.paused) {
            audio.play();
            this.textContent = '⏸️ Tạm dừng';
        } else {
            audio.pause();
            this.textContent = '▶️ Phát Audio';
        }
    });
    
    audio.addEventListener('timeupdate', function() {
        const progress = (audio.currentTime / audio.duration) * 100;
        document.getElementById('audioProgressBar').style.width = progress + '%';
        
        const current = formatTime(audio.currentTime);
        const total = formatTime(audio.duration);
        document.getElementById('audioTime').textContent = `${current} / ${total}`;
    });
    
    audio.addEventListener('ended', function() {
        hsk2AudioPlayCount++;
        playBtn.textContent = '▶️ Phát Audio';
        if (hsk2AudioPlayCount >= HSK2_MAX_AUDIO_PLAYS) {
            playBtn.disabled = true;
            playBtn.textContent = 'Đã hết lượt nghe';
        }
    });
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ===== SAVE TEST RESULTS =====
async function saveTestResults(resultData) {
    try {
        const { error } = await supabase
            .from('test_results')
            .insert([{
                placement_id: resultData.userId,
                answers: resultData.answers,
                score: resultData.score,
                selected_level: resultData.selectedHSK,
                completed_at: new Date().toISOString()
            }]);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error saving test results:', error);
        return { success: false, error: error.message };
    }
}

// ===== CALCULATE SCORE =====
function calculateScore() {
    let score = 0;
    let correct = 0;
    
    hsk2TestQuestions.forEach((q, idx) => {
        if (q.section === 'writing') return; // Skip writing
        
        const userAnswer = hsk2UserAnswers[idx];
        if (userAnswer && userAnswer.toLowerCase() === q.correct_answer.toLowerCase()) {
            score += 2; // 2 points per question
            correct++;
        }
    });
    
    const totalQuestions = hsk2TestQuestions.filter(q => q.section !== 'writing').length;
    
    console.log('Score:', score, '/', totalQuestions * 2);
    console.log('Correct:', correct, '/', totalQuestions);
    
    return { score, correct, total: totalQuestions, maxScore: totalQuestions * 2 };
}

// ===== SUBMIT TEST =====
async function submitTest() {
    try {
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = `
            <div style="text-align: center; padding: 50px; background: #f8f9fa; border-radius: 10px; margin: 20px;">
                <div style="font-size: 24px; margin-bottom: 20px;">📝</div>
                <h2 style="color: #2c3e50; margin-bottom: 15px;">Đang chấm bài...</h2>
                <p style="color: #7f8c8d; font-size: 16px;">Vui lòng chờ trong giây lát</p>
                <div style="margin-top: 20px;">
                    <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #FF6B6B; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        console.log('🔢 Calculating score...');
        const scoreData = calculateScore();
        console.log('✅ Score calculated:', scoreData);
        
        const userId = localStorage.getItem('userRowId') || Date.now();
        const resultData = {
            userId: userId,
            answers: hsk2UserAnswers,
            score: scoreData.score,
            selectedHSK: '2'
        };
        
        console.log('💾 Saving to Supabase...');
        const saveResult = await saveTestResults(resultData);
        if (saveResult.success) {
            console.log('✅ Results saved to Supabase');
        } else {
            console.warn('⚠️ Failed to save to Supabase:', saveResult.error);
        }
        
        document.getElementById('testPage').classList.remove('show');
        document.getElementById('resultPage').classList.add('show');
        
        displayResult(scoreData);
        
    } catch (error) {
        console.error('Error submitting test:', error);
        alert('Lỗi khi nộp bài: ' + error.message);
    }
}

// ===== DISPLAY RESULT =====
function displayResult(scoreData) {
    const fullname = localStorage.getItem('fullname') || 'Thí sinh';
    document.getElementById('resultName').textContent = fullname;
    console.log('✅ Test completed with score:', scoreData.score, '/', scoreData.maxScore);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎉 HSK2 Test Page Loaded');
    
    try {
        await loadSupabase();
        console.log('✅ Supabase loaded');
        
        await loadHSK2Questions();
        console.log('✅ HSK2 test ready');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        alert('Lỗi khởi tạo: ' + error.message);
    }
});

// ===== EVENT LISTENERS =====
document.addEventListener('click', function(e) {
    if (e.target.id === 'btnSubmit') {
        const totalQuestions = hsk2TestQuestions.filter(q => q.section !== 'writing').length;
        const answeredCount = Object.keys(hsk2UserAnswers).length;
        
        if (answeredCount < totalQuestions) {
            if (!confirm(`Bạn mới trả lời ${answeredCount}/${totalQuestions} câu.\nBạn có chắc chắn muốn nộp bài?`)) {
                return;
            }
        }
        
        submitTest();
    }
    
    if (e.target.id === 'btnFinish') {
        window.location.href = '../index.html';
    }
});

