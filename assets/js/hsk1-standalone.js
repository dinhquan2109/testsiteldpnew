// ===== HSK1 STANDALONE TEST - NO MODULES =====
console.log('🚀 HSK1 Standalone JS loaded');

// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://axllpuaybdzubfmsfkws.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bGxwdWF5YmR6dWJmbXNma3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDMzODgsImV4cCI6MjA3NTMxOTM4OH0.KrjW79ZpnPxu_Lp9mETgKZU-kOLu3oMmWkABqOcDbco";

// ===== GLOBAL VARIABLES =====
let hsk1TestQuestions = [];
let hsk1UserAnswers = {};
let hsk1CurrentSection = 1;
let hsk1TimerInterval = null;
let hsk1AudioPlayCount = 0;
const HSK1_MAX_AUDIO_PLAYS = 2;
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

// ===== LOAD HSK1 QUESTIONS =====
async function loadHSK1Questions() {
    try {
        console.log('📡 Fetching HSK1 questions...');
        
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data: questions, error } = await supabase
            .from('questions')
            .select('*')
            .gte('order_number', 1)
            .lte('order_number', 11)
            .order('order_number');

        if (error) throw error;

        if (!questions || questions.length === 0) {
            console.log('⚠️ No questions from Supabase, using fallback');
            hsk1TestQuestions = generateFallbackQuestions();
        } else {
            hsk1TestQuestions = questions;
        }
        
        console.log('✅ Questions loaded:', hsk1TestQuestions.length);
        startTimer(60);
        displaySection(1);

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

// ===== FALLBACK QUESTIONS =====
function generateFallbackQuestions() {
    return [
        { id: 1, order_number: 1, question_text: "Nghe và chọn đáp án đúng", option_a: "A. 你好", option_b: "B. 再见", option_c: "C. 谢谢", correct_answer: "A", audio_url: "" },
        { id: 2, order_number: 2, question_text: "Nghe và chọn đáp án đúng", option_a: "A. 苹果", option_b: "B. 香蕉", option_c: "C. 橙子", correct_answer: "A", audio_url: "" },
        { id: 3, order_number: 3, question_text: "Nghe và chọn đáp án đúng", option_a: "A. 红色", option_b: "B. 蓝色", option_c: "C. 绿色", correct_answer: "A", audio_url: "" },
        { id: 4, order_number: 4, question_text: "Nghe và chọn đáp án đúng", option_a: "A. 一", option_b: "B. 二", option_c: "C. 三", correct_answer: "A", audio_url: "" },
        { id: 5, order_number: 5, question_text: "Nghe và chọn đáp án đúng", option_a: "A. 大", option_b: "B. 小", option_c: "C. 高", correct_answer: "A", audio_url: "" },
        { id: 6, order_number: 6, question_text: "Chọn từ đúng", option_a: "A. 书", option_b: "B. 笔", option_c: "C. 纸", correct_answer: "书", reading_passage: "这是一本书。" },
        { id: 7, order_number: 7, question_text: "Chọn từ đúng", option_a: "A. 猫", option_b: "B. 狗", option_c: "C. 鸟", correct_answer: "猫", reading_passage: "这是一只猫。" },
        { id: 8, order_number: 8, question_text: "Chọn từ đúng", option_a: "A. 水", option_b: "B. 火", option_c: "C. 土", correct_answer: "水", reading_passage: "这是水。" },
        { id: 9, order_number: 9, question_text: "Chọn từ đúng", option_a: "A. 天", option_b: "B. 地", option_c: "C. 人", correct_answer: "天", reading_passage: "这是天。" },
        { id: 10, order_number: 10, question_text: "Chọn từ đúng", option_a: "A. 山", option_b: "B. 海", option_c: "C. 河", correct_answer: "山", reading_passage: "这是山。" },
        { id: 11, order_number: 11, question_text: "Viết một đoạn văn ngắn về gia đình bạn (không tính điểm)", correct_answer: "", writing_prompt: "请写一段关于你家庭的短文。" }
    ];
}

// ===== GET SECTION QUESTIONS =====
function getSectionQuestions() {
    return {
        listeningQuestions: hsk1TestQuestions.slice(0, 5),
        readingQuestions: hsk1TestQuestions.slice(5, 10),
        writingQuestions: hsk1TestQuestions.slice(10, 11)
    };
}

// ===== DISPLAY SECTION =====
function displaySection(sectionNum) {
    console.log('📄 Displaying section:', sectionNum);
    hsk1CurrentSection = sectionNum;
    
    const container = document.getElementById('questionsContainer');
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    
    let sectionQuestions = [];
    let startIdx = 0;
    let html = '';

    if (sectionNum === 1) {
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
                    <source src="${sectionQuestions[0]?.audio_url || ''}" type="audio/mpeg">
                </audio>
                <div id="audioControls" style="margin-top: 15px;">
                    <button id="playBtn" class="audio-play-btn">▶️ Phát Audio</button>
                    <div id="audioProgress" style="margin: 15px 0;">
                        <div id="audioProgressBar"></div>
                    </div>
                    <div id="audioTime">00:00 / 00:00</div>
                </div>
            </div>
        `;
        
        document.getElementById('questionCounter').textContent = `Phần 1: Nghe (${sectionQuestions.length} câu)`;
        document.getElementById('pageInfo').textContent = 'Phần 1/3 - Nghe';
        
    } else if (sectionNum === 2) {
        sectionQuestions = readingQuestions;
        startIdx = listeningQuestions.length;
        
        const passage = sectionQuestions[0]?.reading_passage || 'Đoạn văn sẽ được hiển thị ở đây...';
        html += `
            <div class="section-header">
                <div class="section-title">📖 PHẦN 2: ĐIỀN ĐÁP ÁN</div>
                <div class="section-description">Đọc đoạn văn và điền đáp án đúng (${sectionQuestions.length} câu)</div>
            </div>
            <div class="reading-passage">
                <div class="passage-title">📖 Đọc văn:</div>
                <div class="passage-text">${passage}</div>
            </div>
        `;
        
        document.getElementById('questionCounter').textContent = `Phần 2: Đọc (${sectionQuestions.length} câu)`;
        document.getElementById('pageInfo').textContent = 'Phần 2/3 - Đọc';
        
    } else if (sectionNum === 3) {
        sectionQuestions = writingQuestions;
        startIdx = listeningQuestions.length + readingQuestions.length;
        
        const writingQ = sectionQuestions[0];
        const savedAnswer = hsk1UserAnswers[startIdx] || '';
        const wordCount = savedAnswer.split(/\s+/).filter(w => w.length > 0).length;
        
        html += `
            <div class="section-header">
                <div class="section-title">✍️ PHẦN 3: VIẾT (Writing)</div>
                <div class="section-description">Viết bài tự luận theo yêu cầu (${sectionQuestions.length} câu)</div>
            </div>
            <div class="writing-section">
                <div class="writing-instruction">
                    <strong>Đề bài:</strong>
                    <div style="margin-top: 10px;">${writingQ?.question_text || ''}</div>
                </div>
                <textarea class="essay-input" data-question="${startIdx}" placeholder="Nhập bài viết của bạn..." style="min-height: 300px;">${savedAnswer}</textarea>
                <div class="word-count">Số từ: <strong>${wordCount}</strong></div>
            </div>
        `;
        
        document.getElementById('questionCounter').textContent = `Phần 3: Viết`;
        document.getElementById('pageInfo').textContent = 'Phần 3/3 - Viết';
    }

    if (sectionNum === 1) {
        html += renderListeningQuestions(sectionQuestions, startIdx);
    } else if (sectionNum === 2) {
        html += renderReadingQuestions(sectionQuestions, startIdx);
    }

    container.innerHTML = html;
    attachEventListeners();
    updateProgressCircles();
    updateNavButtons();
    
    if (sectionNum === 1) {
        setupAudio();
    }
}

// ===== RENDER LISTENING QUESTIONS =====
function renderListeningQuestions(sectionQuestions, startIdx) {
    let html = '';
    
    sectionQuestions.forEach((question, idx) => {
        const globalIdx = startIdx + idx;
        const savedAnswer = hsk1UserAnswers[globalIdx] || '';
        
        html += `
            <div class="question-item">
                <div class="question-header">${globalIdx + 1}. ${question.question_text}</div>
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
            </div>
        `;
    });
    
    return html;
}

// ===== RENDER READING QUESTIONS =====
function renderReadingQuestions(sectionQuestions, startIdx) {
    let html = '';
    
    sectionQuestions.forEach((question, idx) => {
        const globalIdx = startIdx + idx;
        const savedAnswer = hsk1UserAnswers[globalIdx] || '';
        
        html += `
            <div class="question-item">
                <div class="question-header">${globalIdx + 1}. ${question.question_text}</div>
                <div class="text-input-container" style="display: block !important;">
                    <input type="text" class="text-input" data-question="${globalIdx}" value="${savedAnswer}" placeholder="Nhập đáp án của bạn...">
                </div>
            </div>
        `;
    });
    
    return html;
}

// ===== ATTACH EVENT LISTENERS =====
function attachEventListeners() {
    document.querySelectorAll('.option-item').forEach(item => {
        item.addEventListener('click', function() {
            const questionIdx = parseInt(this.dataset.question);
            const option = this.dataset.option;
            
            this.parentElement.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            saveUserAnswer(questionIdx, option);
            updateProgressCircles();
            updateNavButtons();
        });
    });

    document.querySelectorAll('.text-input').forEach(input => {
        input.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            const value = this.value.trim();
            if (value) {
                saveUserAnswer(questionIdx, value);
            } else {
                removeUserAnswer(questionIdx);
            }
            updateProgressCircles();
            updateNavButtons();
        });
    });
    
    document.querySelectorAll('.essay-input').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            const value = this.value.trim();
            if (value) {
                saveUserAnswer(questionIdx, value);
            } else {
                removeUserAnswer(questionIdx);
            }
            
            if (hsk1CurrentSection === 3) {
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

// ===== SAVE/REMOVE USER ANSWER =====
function saveUserAnswer(questionIdx, answer) {
    hsk1UserAnswers[questionIdx] = answer;
    localStorage.setItem('hsk1UserAnswers', JSON.stringify(hsk1UserAnswers));
}

function removeUserAnswer(questionIdx) {
    delete hsk1UserAnswers[questionIdx];
    localStorage.setItem('hsk1UserAnswers', JSON.stringify(hsk1UserAnswers));
}

// ===== UPDATE PROGRESS CIRCLES =====
function updateProgressCircles() {
    const progressRow = document.querySelector('.progress-row');
    if (!progressRow) return;
    
    progressRow.innerHTML = '';
    
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    let startIdx, count;
    
    if (hsk1CurrentSection === 1) {
        startIdx = 0;
        count = listeningQuestions.length;
    } else if (hsk1CurrentSection === 2) {
        startIdx = listeningQuestions.length;
        count = readingQuestions.length;
    } else {
        startIdx = listeningQuestions.length + readingQuestions.length;
        count = writingQuestions.length;
    }
    
    for (let i = 0; i < count; i++) {
        const questionIdx = startIdx + i;
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.textContent = questionIdx + 1;
        
        if (hsk1UserAnswers[questionIdx]) {
            circle.classList.add('answered');
        }
        
        progressRow.appendChild(circle);
    }
}

// ===== UPDATE NAV BUTTONS =====
function updateNavButtons() {
    const btnNext = document.getElementById('btnNextSection');
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (hsk1CurrentSection === 3) {
        if (btnNext) btnNext.style.display = 'none';
        if (btnSubmit) btnSubmit.style.display = 'block';
    } else {
        if (btnNext) btnNext.style.display = 'block';
        if (btnNext) btnNext.disabled = !isSectionComplete();
        if (btnSubmit) btnSubmit.style.display = 'none';
    }
}

// ===== CHECK SECTION COMPLETE =====
function isSectionComplete() {
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    let startIdx, endIdx;
    
    if (hsk1CurrentSection === 1) {
        startIdx = 0;
        endIdx = listeningQuestions.length;
    } else if (hsk1CurrentSection === 2) {
        startIdx = listeningQuestions.length;
        endIdx = startIdx + readingQuestions.length;
    } else if (hsk1CurrentSection === 3) {
        startIdx = listeningQuestions.length + readingQuestions.length;
        endIdx = startIdx + writingQuestions.length;
    }
    
    for (let i = startIdx; i < endIdx; i++) {
        if (!hsk1UserAnswers.hasOwnProperty(i)) {
            return false;
        }
    }
    
    return true;
}

// ===== TIMER =====
function startTimer(minutes) {
    let remaining = minutes * 60;
    updateTimerDisplay(remaining);

    hsk1TimerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);

        if (remaining <= 0) {
            clearInterval(hsk1TimerInterval);
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
        if (hsk1AudioPlayCount >= HSK1_MAX_AUDIO_PLAYS) {
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
    
    audio.addEventListener('ended', function() {
        hsk1AudioPlayCount++;
        if (hsk1AudioPlayCount >= HSK1_MAX_AUDIO_PLAYS) {
            playBtn.disabled = true;
            playBtn.textContent = 'Đã hết lượt nghe';
        } else {
            playBtn.textContent = '▶️ Phát Audio';
        }
    });
}

// ===== AI WRITING SCORE =====
async function getAIWritingScore(essay, hskLevel) {
    try {
        const rubric = `Bạn là giáo viên tiếng Trung. Hãy chấm điểm bài viết theo 5 tiêu chí, mỗi tiêu chí 0-2 điểm (tổng 10).
1) Nội dung (内容): có đủ thông tin: tên, tuổi, nghề/học vấn, sở thích, nhận xét; đủ 20-30 từ.
2) Từ vựng (词汇): dùng đúng và phù hợp cấp độ HSK${hskLevel || '1'}.
3) Ngữ pháp (语法): cấu trúc đúng, câu hoàn chỉnh.
4) Tính liên kết (连贯性): mạch lạc, tự nhiên.
5) Biểu đạt & cảm xúc (表达): có cảm xúc, tự nhiên, tích cực.
Trả về JSON thuần theo schema: {"content":0-2,"vocab":0-2,"grammar":0-2,"coherence":0-2,"expression":0-2,"total":0-10,"notes":"ngắn gọn"}. Không kèm văn bản nào ngoài JSON.`;

        const GEMINI_API_KEY = 'AIzaSyA0KtdYeuXgVA33SgZHpfYZLrsJN1uouSQ';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${rubric}\n\nBài viết:\n${essay}` }]}]
            })
        });
        
        if (!response.ok) throw new Error('AI scoring API error');
        
        const data = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        try {
            const jsonStart = raw.indexOf('{');
            const jsonEnd = raw.lastIndexOf('}');
            const jsonText = raw.substring(jsonStart, jsonEnd + 1);
            return JSON.parse(jsonText);
        } catch {
            return null;
        }
    } catch (error) {
        console.error('Error getting AI writing score:', error);
        return null;
    }
}

// ===== AI WRITING COMMENT =====
async function getAIWritingComment(essay, hskLevel) {
    try {
        const prompt = `Bạn là giáo viên tiếng Trung. Hãy viết nhận xét ngắn gọn, thân thiện (120-200 chữ), chỉ ra điểm mạnh và điểm cần cải thiện theo 5 tiêu chí: nội dung, từ vựng (HSK${hskLevel||'1'}), ngữ pháp, liên kết, biểu đạt & cảm xúc. Kết thúc bằng lời động viên. Nhận xét bằng tiếng việt nhé, phần đầu sẽ là Chào em và nói thêm 1, 2 câu gì đó khích lệ.`;
        
        const GEMINI_API_KEY = 'AIzaSyA0KtdYeuXgVA33SgZHpfYZLrsJN1uouSQ';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt + "\n\nBài viết:\n" + essay }]}]
            })
        });
        
        if (!response.ok) throw new Error('AI comment API error');
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
        console.error('Error getting AI writing comment:', error);
        return '';
    }
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
                writing_ai_score: resultData.writingAIScore || 0,
                writing_ai_comment: resultData.writingAIComment || '',
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
async function calculateScore() {
    let score = 0;
    const pointsPerQuestion = 2;
    let writingAIScore = 0;
    let writingAIComment = '';
    let listeningCorrect = 0;
    let readingCorrect = 0;
    
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    
    listeningQuestions.forEach((q, i) => {
        if (hsk1UserAnswers[i] === q.correct_answer) {
            score += pointsPerQuestion;
            listeningCorrect++;
        }
    });
    
    const readingStartIdx = listeningQuestions.length;
    readingQuestions.forEach((q, i) => {
        const globalIdx = readingStartIdx + i;
        const userAnswer = hsk1UserAnswers[globalIdx];
        const correctAnswer = q.correct_answer;
        
        if (userAnswer && correctAnswer) {
            if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
                score += pointsPerQuestion;
                readingCorrect++;
            }
        }
    });
    
    console.log('Listening correct:', listeningCorrect, '/', listeningQuestions.length);
    console.log('Reading correct:', readingCorrect, '/', readingQuestions.length);
    console.log('Score before writing:', score, '/ 20');
    
    try {
        const writingIndex = listeningQuestions.length + readingQuestions.length;
        const writingAnswer = hsk1UserAnswers[writingIndex];
        
        if (writingAnswer && writingAnswer.trim().length > 0) {
            console.log('Getting AI score for writing...');
            const aiScoreResult = await getAIWritingScore(writingAnswer, '1');
            
            if (aiScoreResult && typeof aiScoreResult.total !== 'undefined') {
                writingAIScore = Math.floor(Math.max(0, Math.min(10, Number(aiScoreResult.total))));
                score += writingAIScore;
                console.log('AI writing score:', writingAIScore, '/ 10');
            }
            
            writingAIComment = await getAIWritingComment(writingAnswer, '1');
            console.log('AI comment received');
        }
    } catch (e) {
        console.warn('AI writing score failed:', e.message);
    }
    
    const maxScore = 30;
    if (score > maxScore) score = maxScore;
    
    console.log('Final score:', score, '/ 30');
    
    return {
        score,
        writingAIScore,
        writingAIComment,
        listeningCorrect,
        readingCorrect,
        totalQuestions: listeningQuestions.length + readingQuestions.length,
        maxScore
    };
}

// ===== SUBMIT TEST =====
async function submitTest() {
    try {
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = `
            <div style="text-align: center; padding: 50px; background: #f8f9fa; border-radius: 10px; margin: 20px;">
                <div style="font-size: 24px; margin-bottom: 20px;">📝</div>
                <h2 style="color: #2c3e50; margin-bottom: 15px;">Đang chấm bài...</h2>
                <p style="color: #7f8c8d; font-size: 16px;">Vui lòng chờ trong giây lát (có thể mất 5-10 giây)</p>
                <div style="margin-top: 20px;">
                    <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
            </div>
        `;

        console.log('🔢 Calculating score...');
        const scoreData = await calculateScore();
        console.log('✅ Score calculated:', scoreData);
        
        const userId = localStorage.getItem('userRowId') || Date.now();
        const resultData = {
            userId: userId,
            answers: hsk1UserAnswers,
            score: scoreData.score,
            writingAIScore: scoreData.writingAIScore,
            writingAIComment: scoreData.writingAIComment,
            selectedHSK: '1'
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
        
        await displayResult(scoreData);
        
    } catch (error) {
        console.error('Error submitting test:', error);
        alert('Lỗi khi nộp bài: ' + error.message);
    }
}

// ===== DISPLAY RESULT =====
async function displayResult(scoreData) {
    const fullname = localStorage.getItem('fullname') || 'Thí sinh';
    
    // Only display name, no scores or AI feedback
    document.getElementById('resultName').textContent = fullname;
    
    console.log('✅ Test completed with score:', scoreData.score, '/', scoreData.maxScore);
}

// ===== AI FEEDBACK DISPLAY =====
async function getAIFeedbackDisplay(essay) {
    const feedbackSection = document.querySelector('.ai-feedback-section');
    if (!feedbackSection) return;
    
    feedbackSection.style.display = 'block';
    feedbackSection.innerHTML = `
        <div class="ai-feedback-header">
            <h3>🤖 Nhận xét AI cho phần viết</h3>
        </div>
        <div class="ai-feedback-content">
            <div style="text-align: center; padding: 20px;">
                <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <div style="margin-top: 10px;">正在分析您的作文... Đang phân tích bài viết...</div>
            </div>
        </div>
    `;
    
    try {
        const GEMINI_API_KEY = 'AIzaSyA0KtdYeuXgVA33SgZHpfYZLrsJN1uouSQ';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Bạn là giáo viên tiếng Trung chuyên nghiệp. Vui lòng đánh giá bài luận của học sinh.

chủ đề: Viết đoạn văn 20–30 từ theo chủ đề "Người bạn của tôi – 我的朋友"

Bài luận của sinh viên:
${essay}

Cần có các thông tin cơ bản:
Tên
Tuổi
Nghề nghiệp / Học vấn
Sở thích
Nhận xét, đánh giá ngắn

Xin hãy trả lời bằng giọng điệu thân thiện và khích lệ。`
                    }]
                }]
            })
        });
        
        if (!response.ok) throw new Error('AI API error');
        
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không nhận được phản hồi từ AI.';
        
        const paragraphs = aiText.split('\n\n').filter(p => p.trim());
        let formattedHTML = '';
        paragraphs.forEach(para => {
            formattedHTML += `<p>${para.trim().replace(/\n/g, '<br>')}</p>`;
        });
        
        feedbackSection.innerHTML = `
            <div class="ai-feedback-header">
                <h3>🤖 Nhận xét AI cho phần viết</h3>
            </div>
            <div class="ai-feedback-content">
                ${formattedHTML || `<p>${aiText.replace(/\n/g, '<br>')}</p>`}
            </div>
        `;
    } catch (error) {
        feedbackSection.innerHTML = `
            <div class="ai-feedback-header">
                <h3>🤖 Nhận xét AI cho phần viết</h3>
            </div>
            <div class="ai-feedback-content">
                <p style="color: #f56565;">
                    <strong>⚠️ Không thể lấy nhận xét AI</strong><br><br>
                    Vui lòng liên hệ giáo viên để được đánh giá chi tiết.
                </p>
            </div>
        `;
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎉 HSK1 Test Page Loaded');
    
    try {
        await loadSupabase();
        console.log('✅ Supabase loaded');
        
        await loadHSK1Questions();
        console.log('✅ HSK1 test ready');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        alert('Lỗi khởi tạo: ' + error.message);
    }
});

// ===== EVENT LISTENERS =====
document.addEventListener('click', function(e) {
    if (e.target.id === 'btnNextSection') {
        if (hsk1CurrentSection < 3) {
            displaySection(hsk1CurrentSection + 1);
        }
    }
    
    if (e.target.id === 'btnSubmit') {
        submitTest();
    }
    
    if (e.target.id === 'btnFinish') {
        window.location.href = '../index.html';
    }
});

