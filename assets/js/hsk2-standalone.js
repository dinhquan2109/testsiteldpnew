// ===== HSK2 STANDALONE TEST - NO MODULES =====
console.log('🚀 HSK2 Standalone JS loaded');

// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://axllpuaybdzubfmsfkws.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bGxwdWF5YmR6dWJmbXNma3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDMzODgsImV4cCI6MjA3NTMxOTM4OH0.KrjW79ZpnPxu_Lp9mETgKZU-kOLu3oMmWkABqOcDbco";

// ===== GLOBAL VARIABLES =====
let hsk2TestQuestions = [];
let hsk2UserAnswers = {};
let hsk2CurrentQuestion = 1;
let hsk2CurrentPage = 1; // 1 = questions 1-35, 2 = questions 36-60
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
        displayCurrentPage();

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

// ===== DISPLAY CURRENT PAGE =====
function displayCurrentPage() {
    const container = document.getElementById('questionsContainer');
    let html = '';
    
    const listeningQuestions = hsk2TestQuestions.filter(q => q.section === 'listening');
    const readingQuestions = hsk2TestQuestions.filter(q => q.section === 'reading');
    const comprehensionQuestions = hsk2TestQuestions.filter(q => q.section === 'comprehension');
    const imageMatchingQuestions = hsk2TestQuestions.filter(q => q.section === 'image_matching');
    const wordMatchingQuestions = hsk2TestQuestions.filter(q => q.section === 'word_matching');
    const qaJudgmentQuestions = hsk2TestQuestions.filter(q => q.section === 'qa_judgment');
    const sentenceMatchingQuestions = hsk2TestQuestions.filter(q => q.section === 'sentence_matching');
    
    // PAGE 1: Questions 1-35 (LISTENING COMPREHENSION)
    if (hsk2CurrentPage === 1) {
    
    // 🎧 PHẦN 1 – 听力 (NGHE HIỂU) - Câu 1-35
    // Phần 1 (1-10): Mỗi câu có 1 bức tranh, nghe 1 câu đơn, chọn bức tranh phù hợp
    html += `
        <div class="section-header">
            <div class="section-title">🎧 Phần 1 (1–10): Nghe và chọn tranh</div>
            <div class="section-description">Mỗi câu có 1 bức tranh, nghe 1 câu đơn và chọn bức tranh phù hợp</div>
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
    
    // Render listening questions (1-10) - 2 câu per row
    html += '<div class="questions-two-col">';
    listeningQuestions.forEach((q, idx) => {
        const savedAnswer = hsk2UserAnswers[idx];
        html += `
            <div class="question-item-half" id="question-${idx}">
                <div class="question-header">${idx + 1}. ${q.question_text}</div>
                ${q.image_url ? `<div class="question-image"><img src="${q.image_url}" alt="Question ${idx + 1}" style="max-width: 100%; border-radius: 8px; margin: 10px 0;"></div>` : ''}
                <div class="true-false-options">
                    <button class="tf-option tf-true ${savedAnswer === 'true' ? 'selected' : ''}" data-question="${idx}" data-answer="true">
                        ✓
                    </button>
                    <button class="tf-option tf-false ${savedAnswer === 'false' ? 'selected' : ''}" data-question="${idx}" data-answer="false">
                        ✗
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    // Phần 2 (11-15): Nghe hội thoại ngắn
    const readingStartIdx = listeningQuestions.length;
    
    // Create image map from reading questions (each question has correct_answer A-J and image_url)
    const imageMap = {};
    readingQuestions.forEach(q => {
        if (q.correct_answer && q.image_url) {
            imageMap[q.correct_answer] = q.image_url;
        }
    });
    
    html += `
        <div class="section-header" style="margin-top: 40px;">
            <div class="section-title">🎧 Phần 2 (11–15): Nghe hội thoại ngắn</div>
            <div class="section-description">Nghe 1 đoạn hội thoại ngắn (2 câu), chọn đáp án A–F tương ứng</div>
        </div>
        <div class="reading-section-layout">
            <div class="reading-images-col">
                <h4 style="text-align: center; margin-bottom: 15px;">Hình ảnh (A-J)</h4>
                <div class="reading-images-grid" id="readingImagesGrid">
                    ${['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(letter => {
                        const imageUrl = imageMap[letter] || `https://via.placeholder.com/120?text=${letter}`;
                        return `
                            <div class="reading-image-item" draggable="true" data-answer="${letter}" data-image-url="${imageUrl}" id="image-${letter}">
                                <div class="image-label">${letter}</div>
                                <img src="${imageUrl}" alt="${letter}">
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            <div class="reading-questions-col">
                <h4 style="text-align: center; margin-bottom: 15px;">Câu hỏi (11-20)</h4>
                <div class="reading-questions-list">
                    ${Array.from({length: 10}, (_, i) => {
                        const globalIdx = readingStartIdx + i;
                        const savedAnswer = hsk2UserAnswers[globalIdx] || '';
                        return `
                            <div class="reading-question-box" id="question-${globalIdx}" data-question="${globalIdx}">
                                <div class="question-number">${globalIdx + 1}</div>
                                <div class="drop-zone" data-question="${globalIdx}">
                                    ${savedAnswer ? `
                                        <div class="dropped-answer" data-answer="${savedAnswer}">
                                            <img src="${imageMap[savedAnswer] || `https://via.placeholder.com/60?text=${savedAnswer}`}" alt="${savedAnswer}" class="dropped-answer-image">
                                            <span class="dropped-answer-letter">${savedAnswer}</span>
                                            <button class="remove-answer-btn" data-question="${globalIdx}" data-answer="${savedAnswer}">×</button>
                                        </div>
                                    ` : '<span class="drop-placeholder">Kéo vào đây</span>'}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        `;
    
    // Phần 3 (16-25): Nghe hội thoại + câu hỏi
    if (comprehensionQuestions.length > 0) {
        const comprehensionStartIdx = listeningQuestions.length + readingQuestions.length;
        const comprehensionPart1 = comprehensionQuestions.slice(0, 10); // First 10 questions (21-30)
        const passageText = comprehensionPart1[0]?.passage_text || 'Đoạn văn sẽ hiển thị ở đây...';
        
        html += `
            <div class="section-header" style="margin-top: 40px;">
                <div class="section-title">🎧 Phần 3 (16–25): Nghe hội thoại + câu hỏi</div>
                <div class="section-description">Nghe hội thoại → câu hỏi → chọn A/B/C</div>
            </div>
            <div class="comprehension-section">
                <div class="passage-text">
                    ${passageText}
                </div>
                <div class="comprehension-questions">
                    ${comprehensionPart1.map((q, idx) => {
                        const globalIdx = comprehensionStartIdx + idx;
                        const savedAnswer = hsk2UserAnswers[globalIdx] || '';
                        const optionTexts = {
                            'A': q.option_a_text || 'Đáp án A',
                            'B': q.option_b_text || 'Đáp án B',
                            'C': q.option_c_text || 'Đáp án C'
                        };
                        return `
                            <div class="comprehension-question-item" id="question-${globalIdx}">
                                <span class="question-number-inline">${globalIdx + 1}.</span>
                                <div class="comprehension-options">
                                    ${['A', 'B', 'C'].map(letter => `
                                        <div class="option-wrapper">
                                            <button class="comprehension-option ${savedAnswer === letter ? 'selected' : ''}" 
                                                    data-question="${globalIdx}" 
                                                    data-answer="${letter}">
                                                ${letter}
                                            </button>
                                            <span class="option-text">${optionTexts[letter]}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
        </div>
        `;
    }
    
    // Phần 4 (26-35): Nghe hội thoại dài + câu hỏi
    if (comprehensionQuestions.length > 10) {
        const comprehensionStartIdx = listeningQuestions.length + readingQuestions.length;
        const comprehensionPart2 = comprehensionQuestions.slice(10, 15); // Questions 31-35
        const passageText = comprehensionPart2[0]?.passage_text || 'Đoạn văn sẽ hiển thị ở đây...';
        
        html += `
            <div class="section-header" style="margin-top: 40px;">
                <div class="section-title">🎧 Phần 4 (26–35): Nghe hội thoại dài + câu hỏi</div>
                <div class="section-description">Nghe hội thoại dài hơn → câu hỏi → chọn A/B/C</div>
            </div>
            <div class="comprehension-section">
                <div class="passage-text">
                    ${passageText}
                </div>
                <div class="comprehension-questions">
                    ${comprehensionPart2.map((q, idx) => {
                        const globalIdx = comprehensionStartIdx + 10 + idx; // Start from 30 (index 30 = question 31)
                        const savedAnswer = hsk2UserAnswers[globalIdx] || '';
                        const optionTexts = {
                            'A': q.option_a_text || 'Đáp án A',
                            'B': q.option_b_text || 'Đáp án B',
                            'C': q.option_c_text || 'Đáp án C'
                        };
                        return `
                            <div class="comprehension-question-item" id="question-${globalIdx}">
                                <span class="question-number-inline">${globalIdx + 1}.</span>
                                <div class="comprehension-options">
                                    ${['A', 'B', 'C'].map(letter => `
                                        <div class="option-wrapper">
                                            <button class="comprehension-option ${savedAnswer === letter ? 'selected' : ''}" 
                                                    data-question="${globalIdx}" 
                                                    data-answer="${letter}">
                                                ${letter}
                                            </button>
                                            <span class="option-text">${optionTexts[letter]}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // End of PAGE 1 (Questions 1-35)
    } else if (hsk2CurrentPage === 2) {
    
    // PAGE 2: Questions 36-60 (READING COMPREHENSION)
    // 📖 PHẦN 2 – 阅读 (ĐỌC HIỂU) - Câu 36-60
    
    // Phần 1 (36-40): Ghép 2 câu sao cho nghĩa hợp lý
    if (imageMatchingQuestions.length > 0) {
        const imageMatchingStartIdx = listeningQuestions.length + readingQuestions.length + comprehensionQuestions.length;
        
        html += `
            <div class="section-header">
                <div class="section-title">📖 Phần 1 (36–40): Ghép câu</div>
                <div class="section-description">Ghép 2 câu sao cho nghĩa hợp lý (hỏi–đáp, nguyên nhân–kết quả)</div>
            </div>
            <div class="image-matching-section">
                <div class="images-grid-container">
                    <div class="images-grid-6">
                        ${['A', 'B', 'C', 'D', 'E', 'F'].map(letter => {
                            const imageUrl = imageMatchingQuestions[0]?.[`image_${letter.toLowerCase()}_url`] || `https://via.placeholder.com/200x150?text=${letter}`;
                            return `
                                <div class="image-option-item">
                                    <div class="image-option-label">${letter}</div>
                                    <img src="${imageUrl}" alt="${letter}">
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="image-matching-questions">
                    ${imageMatchingQuestions.map((q, idx) => {
                        const globalIdx = imageMatchingStartIdx + idx;
                        const savedAnswer = hsk2UserAnswers[globalIdx] || '';
                        return `
                            <div class="image-matching-question-item" id="question-${globalIdx}">
                                <span class="question-number-inline">${globalIdx + 1}.</span>
                                <div class="question-text-content">${q.question_text || ''}</div>
                                <input type="text" 
                                       class="image-matching-input" 
                                       data-question="${globalIdx}"
                                       value="${savedAnswer}"
                                       maxlength="1"
                                       placeholder="A-F">
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Phần 2 (41-45): Đọc câu và chọn đáp án
    if (wordMatchingQuestions.length > 0) {
        const wordMatchingStartIdx = listeningQuestions.length + readingQuestions.length + comprehensionQuestions.length + imageMatchingQuestions.length;
        
        // Get 6 words from first question
        const words = {
            'A': wordMatchingQuestions[0]?.word_a || 'A',
            'B': wordMatchingQuestions[0]?.word_b || 'B',
            'C': wordMatchingQuestions[0]?.word_c || 'C',
            'D': wordMatchingQuestions[0]?.word_d || 'D',
            'E': wordMatchingQuestions[0]?.word_e || 'E',
            'F': wordMatchingQuestions[0]?.word_f || 'F'
        };
        
        html += `
            <div class="section-header" style="margin-top: 40px;">
                <div class="section-title">📖 Phần 2 (41–45): Đọc câu và chọn đáp án</div>
                <div class="section-description">Đọc 5 câu → chọn đáp án tương ứng trong danh sách A–F</div>
            </div>
            <div class="word-matching-section">
                <div class="words-container">
                    <h4 style="text-align: center; margin-bottom: 15px;">Từ vựng (A-F)</h4>
                    <div class="words-grid" id="wordsGrid">
                        ${['A', 'B', 'C', 'D', 'E', 'F'].map(letter => {
                            return `
                                <div class="word-item" draggable="true" data-answer="${letter}" id="word-${letter}">
                                    <span class="word-label">${letter}</span>
                                    <span class="word-text">${words[letter]}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="word-questions-container">
                    <h4 style="text-align: center; margin-bottom: 15px;">Câu hỏi (41-45)</h4>
                    <div class="word-questions-list">
                        ${wordMatchingQuestions.map((q, idx) => {
                            const globalIdx = wordMatchingStartIdx + idx;
                            const savedAnswer = hsk2UserAnswers[globalIdx] || '';
                            const questionParts = q.question_text ? q.question_text.split('(___)') : ['', ''];
                            
                            return `
                                <div class="word-question-item" id="question-${globalIdx}">
                                    <span class="question-number-inline">${globalIdx + 1}.</span>
                                    <div class="question-sentence">
                                        <span class="sentence-part">${questionParts[0]}</span>
                                        <div class="word-drop-zone" data-question="${globalIdx}">
                                            ${savedAnswer ? `
                                                <div class="dropped-word" data-answer="${savedAnswer}">
                                                    <span class="dropped-word-label">${savedAnswer}</span>
                                                    <span class="dropped-word-text">${words[savedAnswer]}</span>
                                                    <button class="remove-word-btn" data-question="${globalIdx}" data-answer="${savedAnswer}">×</button>
                                                </div>
                                            ` : '<span class="drop-word-placeholder">(___)</span>'}
                                        </div>
                                        <span class="sentence-part">${questionParts[1] || ''}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Phần 3 (46-50): Đánh giá đúng/sai
    if (qaJudgmentQuestions.length > 0) {
        const qaJudgmentStartIdx = listeningQuestions.length + readingQuestions.length + comprehensionQuestions.length + imageMatchingQuestions.length + wordMatchingQuestions.length;
        
        html += `
            <div class="section-header" style="margin-top: 40px;">
                <div class="section-title">📖 Phần 3 (46–50): Đánh giá đúng/sai</div>
                <div class="section-description">Đọc đoạn mô tả + câu đánh giá → chọn đúng (对) hay sai (错)</div>
            </div>
            <div class="qa-judgment-section">
                ${qaJudgmentQuestions.map((q, idx) => {
                    const globalIdx = qaJudgmentStartIdx + idx;
                    const savedAnswer = hsk2UserAnswers[globalIdx] || '';
                    
                    return `
                        <div class="qa-judgment-item" id="question-${globalIdx}">
                            <div class="qa-number">${globalIdx + 1}</div>
                            <div class="qa-content">
                                <div class="qa-question">
                                    ${q.question_text || ''}
                                </div>
                                <div class="qa-answer-given">
                                    ★ ${q.answer_text || ''}
                                </div>
                                <div class="qa-judgment-buttons">
                                    <button class="qa-judgment-btn qa-correct ${savedAnswer === 'true' ? 'selected' : ''}" 
                                            data-question="${globalIdx}" 
                                            data-answer="true">
                                        ✓ Đúng
                                    </button>
                                    <button class="qa-judgment-btn qa-incorrect ${savedAnswer === 'false' ? 'selected' : ''}" 
                                            data-question="${globalIdx}" 
                                            data-answer="false">
                                        ✗ Sai
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // Phần 4 & 5 (51-60): Ghép câu và điền từ
    if (sentenceMatchingQuestions.length > 0) {
        const sentenceMatchingStartIdx = listeningQuestions.length + readingQuestions.length + comprehensionQuestions.length + imageMatchingQuestions.length + wordMatchingQuestions.length + qaJudgmentQuestions.length;
        
        // Split into two parts: 51-55 (A-F) and 56-60 (A-E)
        const part1Questions = sentenceMatchingQuestions.slice(0, 5); // 51-55
        const part2Questions = sentenceMatchingQuestions.slice(5, 10); // 56-60
        
        // PART 1: Questions 51-55 - Đọc đoạn ngắn + câu hỏi → chọn A/B/C/D/E/F
        if (part1Questions.length > 0) {
            const part1Options = {
                'A': part1Questions[0]?.option_a_sentence || 'A',
                'B': part1Questions[0]?.option_b_sentence || 'B',
                'C': part1Questions[0]?.option_c_sentence || 'C',
                'D': part1Questions[0]?.option_d_sentence || 'D',
                'E': part1Questions[0]?.option_e_sentence || 'E',
                'F': part1Questions[0]?.option_f_sentence || 'F'
            };
            
            html += `
                <div class="section-header" style="margin-top: 40px;">
                    <div class="section-title">📖 Phần 4 (51–55): Đọc đoạn + trả lời câu hỏi</div>
                    <div class="section-description">Đọc đoạn ngắn + câu hỏi → chọn A/B/C/D/E/F</div>
                </div>
                <div class="sentence-matching-part" id="sentence-part1">
                    <div class="sentence-options-grid">
                        ${['A', 'B', 'C', 'D', 'E', 'F'].map(letter => `
                            <div class="sentence-option-box">
                                <span class="option-letter">${letter}</span>
                                <span class="option-sentence">${part1Options[letter]}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="sentence-questions-list">
                        ${part1Questions.map((q, idx) => {
                            const globalIdx = sentenceMatchingStartIdx + idx;
                            const savedAnswer = hsk2UserAnswers[globalIdx] || '';
                            return `
                                <div class="sentence-question-item" id="question-${globalIdx}">
                                    <span class="question-number-box">${globalIdx + 1}.</span>
                                    <span class="question-sentence-text">${q.question_text || ''}</span>
                                    <input type="text" 
                                           class="sentence-answer-input" 
                                           data-question="${globalIdx}"
                                           value="${savedAnswer}"
                                           maxlength="1"
                                           placeholder="">
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        // PART 2: Questions 56-60 - Điền từ vào chỗ trống
        if (part2Questions.length > 0) {
            const part2Options = {
                'A': part2Questions[0]?.option_a_sentence || 'A',
                'B': part2Questions[0]?.option_b_sentence || 'B',
                'C': part2Questions[0]?.option_c_sentence || 'C',
                'D': part2Questions[0]?.option_d_sentence || 'D',
                'E': part2Questions[0]?.option_e_sentence || 'E'
            };
            
            html += `
                <div class="section-header" style="margin-top: 40px;">
                    <div class="section-title">📖 Phần 5 (56–60): Điền từ vào chỗ trống</div>
                    <div class="section-description">Mỗi đoạn có chỗ trống, chọn từ điền vào cho đúng ngữ pháp/ý nghĩa</div>
                </div>
                <div class="sentence-matching-part" id="sentence-part2">
                    <div class="sentence-options-grid">
                        ${['A', 'B', 'C', 'D', 'E'].map(letter => `
                            <div class="sentence-option-box">
                                <span class="option-letter">${letter}</span>
                                <span class="option-sentence">${part2Options[letter]}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="sentence-questions-list">
                        ${part2Questions.map((q, idx) => {
                            const globalIdx = sentenceMatchingStartIdx + 5 + idx;
                            const savedAnswer = hsk2UserAnswers[globalIdx] || '';
                            return `
                                <div class="sentence-question-item" id="question-${globalIdx}">
                                    <span class="question-number-box">${globalIdx + 1}.</span>
                                    <span class="question-sentence-text">${q.question_text || ''}</span>
                                    <input type="text" 
                                           class="sentence-answer-input" 
                                           data-question="${globalIdx}"
                                           value="${savedAnswer}"
                                           maxlength="1"
                                           placeholder="">
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // End of PAGE 2 (Questions 36-60)
    }
    
    container.innerHTML = html;
    attachEventListeners();
    updateProgressCircles();
    if (hsk2CurrentPage === 1) {
        setupAudio();
    }
    updateNavButtons();
    updatePageInfo();
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
    
    // Comprehension options (A, B, C)
    document.querySelectorAll('.comprehension-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionIdx = parseInt(this.dataset.question);
            const answer = this.dataset.answer;
            
            // Remove selected from all options of this question
            const questionItem = this.closest('.comprehension-question-item');
            questionItem.querySelectorAll('.comprehension-option').forEach(b => b.classList.remove('selected'));
            
            // Add selected to clicked option
            this.classList.add('selected');
            
            saveUserAnswer(questionIdx, answer);
            updateProgressCircles();
            updateNavButtons();
        });
    });
    
    // Q&A Judgment buttons
    document.querySelectorAll('.qa-judgment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionIdx = parseInt(this.dataset.question);
            const answer = this.dataset.answer;
            
            // Remove selected from all buttons of this question
            const qaItem = this.closest('.qa-judgment-item');
            qaItem.querySelectorAll('.qa-judgment-btn').forEach(b => b.classList.remove('selected'));
            
            // Add selected to clicked button
            this.classList.add('selected');
            
            saveUserAnswer(questionIdx, answer);
            updateProgressCircles();
            updateNavButtons();
        });
    });
    
    // Image matching inputs
    document.querySelectorAll('.image-matching-input').forEach(input => {
        input.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            let answer = this.value.toUpperCase().trim();
            
            // Only allow A-F
            if (answer && !['A', 'B', 'C', 'D', 'E', 'F'].includes(answer)) {
                answer = '';
                this.value = '';
            } else {
                this.value = answer;
            }
            
            if (answer) {
                saveUserAnswer(questionIdx, answer);
            } else {
                removeUserAnswer(questionIdx);
            }
            updateProgressCircles();
            updateNavButtons();
        });
    });
    
    // Sentence matching inputs
    document.querySelectorAll('.sentence-answer-input').forEach(input => {
        input.addEventListener('input', function() {
            const questionIdx = parseInt(this.dataset.question);
            let answer = this.value.toUpperCase().trim();
            
            // Determine allowed letters based on question number
            const allowedLetters = questionIdx >= 50 && questionIdx < 55 
                ? ['A', 'B', 'C', 'D', 'E', 'F']  // Questions 51-55
                : ['A', 'B', 'C', 'D', 'E'];       // Questions 56-60
            
            // Only allow specified letters
            if (answer && !allowedLetters.includes(answer)) {
                answer = '';
                this.value = '';
            } else {
                this.value = answer;
            }
            
            if (answer) {
                saveUserAnswer(questionIdx, answer);
            } else {
                removeUserAnswer(questionIdx);
            }
            updateProgressCircles();
            updateNavButtons();
            
            // Auto-scroll to Part 2 when Part 1 (51-55) is completed
            if (questionIdx >= 50 && questionIdx < 55) {
                const part1AnsweredCount = Object.keys(hsk2UserAnswers).filter(key => {
                    const qIdx = parseInt(key);
                    return qIdx >= 50 && qIdx < 55 && hsk2UserAnswers[key];
                }).length;
                
                if (part1AnsweredCount === 5) {
                    // Wait a bit before scrolling
                    setTimeout(() => {
                        const part2Section = document.getElementById('sentence-part2');
                        if (part2Section) {
                            part2Section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 500);
                }
            }
        });
    });
    
    // Drag and Drop for reading section
    setupDragAndDrop();
    
    // Drag and Drop for word matching section
    setupWordDragDrop();
    
    // Progress circles click to jump
    document.querySelectorAll('.circle').forEach((circle, idx) => {
        circle.addEventListener('click', function() {
            scrollToQuestion(idx);
        });
    });
}

// ===== SETUP DRAG AND DROP =====
function setupDragAndDrop() {
    let draggedElement = null;
    
    // Update image availability on load
    updateImageAvailability();
    
    // Make image items draggable
    document.querySelectorAll('.reading-image-item').forEach(item => {
        item.addEventListener('dragstart', function(e) {
            // Check if image is already used
            if (this.classList.contains('used')) {
                e.preventDefault();
                return;
            }
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.dataset.answer);
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Setup drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const answer = e.dataTransfer.getData('text/plain');
            const questionIdx = parseInt(this.dataset.question);
            
            // Check if image is already used elsewhere
            const imageElement = document.getElementById(`image-${answer}`);
            if (imageElement && imageElement.classList.contains('used')) {
                return; // Don't allow drop
            }
            
            // Get image URL
            const imageUrl = imageElement ? imageElement.dataset.imageUrl : `https://via.placeholder.com/60?text=${answer}`;
            
            // Remove old answer if exists
            const oldAnswer = this.querySelector('.dropped-answer')?.dataset.answer;
            if (oldAnswer) {
                returnImageToSource(oldAnswer);
            }
            
            // Clear zone
            this.querySelectorAll('.dropped-answer').forEach(el => el.remove());
            this.querySelectorAll('.drop-placeholder').forEach(el => el.remove());
            
            // Add new answer with image
            const answerEl = document.createElement('div');
            answerEl.className = 'dropped-answer';
            answerEl.dataset.answer = answer;
            answerEl.innerHTML = `
                <img src="${imageUrl}" alt="${answer}" class="dropped-answer-image">
                <span class="dropped-answer-letter">${answer}</span>
                <button class="remove-answer-btn" data-question="${questionIdx}" data-answer="${answer}">×</button>
            `;
            
            this.appendChild(answerEl);
            
            // Hide source image
            if (imageElement) {
                imageElement.classList.add('used');
            }
            
            // Setup remove button
            const removeBtn = answerEl.querySelector('.remove-answer-btn');
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ans = this.dataset.answer;
                const qIdx = parseInt(this.dataset.question);
                
                // Return image to source
                returnImageToSource(ans);
                
                // Clear drop zone
                zone.innerHTML = '<span class="drop-placeholder">Kéo vào đây</span>';
                
                removeUserAnswer(qIdx);
                updateProgressCircles();
                updateNavButtons();
            });
            
            saveUserAnswer(questionIdx, answer);
            updateProgressCircles();
            updateNavButtons();
        });
    });
}

// ===== RETURN IMAGE TO SOURCE =====
function returnImageToSource(answer) {
    const imageElement = document.getElementById(`image-${answer}`);
    if (imageElement) {
        imageElement.classList.remove('used');
    }
}

// ===== SETUP WORD DRAG AND DROP =====
function setupWordDragDrop() {
    const wordItems = document.querySelectorAll('.word-item');
    const wordDropZones = document.querySelectorAll('.word-drop-zone');
    
    if (!wordItems.length || !wordDropZones.length) return;
    
    // Make words draggable
    wordItems.forEach(word => {
        word.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.answer);
            this.classList.add('dragging');
        });
        
        word.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Setup drop zones
    wordDropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            if (!this.classList.contains('has-word')) {
                this.classList.add('drag-over');
            }
        });
        
        zone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const answer = e.dataTransfer.getData('text/plain');
            const questionIdx = parseInt(this.dataset.question);
            
            // Check if word is already used elsewhere
            const wordElement = document.getElementById(`word-${answer}`);
            if (wordElement && wordElement.classList.contains('used')) {
                return; // Don't allow drop
            }
            
            // Get word text
            const wordText = wordElement ? wordElement.querySelector('.word-text').textContent : answer;
            
            // Remove old word if exists
            const oldAnswer = this.querySelector('.dropped-word')?.dataset.answer;
            if (oldAnswer) {
                returnWordToSource(oldAnswer);
            }
            
            // Clear zone
            this.querySelectorAll('.dropped-word').forEach(el => el.remove());
            this.querySelectorAll('.drop-word-placeholder').forEach(el => el.remove());
            
            // Add new word
            const wordEl = document.createElement('div');
            wordEl.className = 'dropped-word';
            wordEl.dataset.answer = answer;
            wordEl.innerHTML = `
                <span class="dropped-word-label">${answer}</span>
                <span class="dropped-word-text">${wordText}</span>
                <button class="remove-word-btn" data-question="${questionIdx}" data-answer="${answer}">×</button>
            `;
            
            this.appendChild(wordEl);
            this.classList.add('has-word');
            
            // Hide source word
            if (wordElement) {
                wordElement.classList.add('used');
            }
            
            // Setup remove button
            const removeBtn = wordEl.querySelector('.remove-word-btn');
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ans = this.dataset.answer;
                const qIdx = parseInt(this.dataset.question);
                
                // Return word to source
                returnWordToSource(ans);
                
                // Clear drop zone
                zone.innerHTML = '<span class="drop-word-placeholder">(___)</span>';
                zone.classList.remove('has-word');
                
                // Remove from answers
                removeUserAnswer(qIdx);
                updateProgressCircles();
                updateNavButtons();
            });
            
            // Save answer
            saveUserAnswer(questionIdx, answer);
            updateProgressCircles();
            updateNavButtons();
        });
    });
}

function returnWordToSource(answer) {
    const wordElement = document.getElementById(`word-${answer}`);
    if (wordElement) {
        wordElement.classList.remove('used');
    }
}

// ===== UPDATE IMAGE AVAILABILITY =====
function updateImageAvailability() {
    // Mark images as used based on current answers
    Object.values(hsk2UserAnswers).forEach(answer => {
        const imageElement = document.getElementById(`image-${answer}`);
        if (imageElement) {
            imageElement.classList.add('used');
        }
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
    
    const answeredCount = Object.keys(hsk2UserAnswers).length;
    
    if (hsk2CurrentPage === 1) {
        // Page 1: Show "Tiếp tục" button when questions 1-35 are answered
        const page1Answered = Object.keys(hsk2UserAnswers).filter(idx => parseInt(idx) < 35).length;
        
        if (btnNext) {
            btnNext.style.display = page1Answered >= 35 ? 'block' : 'none';
        }
        if (btnSubmit) btnSubmit.style.display = 'none';
        
    } else if (hsk2CurrentPage === 2) {
        // Page 2: Show "Nộp bài" button when all 60 questions are answered
        if (btnNext) btnNext.style.display = 'none';
        if (btnSubmit) {
            btnSubmit.style.display = answeredCount >= 60 ? 'block' : 'none';
        }
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
    let correctPart1 = 0; // Câu 1-35
    let correctPart2 = 0; // Câu 36-60
    
    // Phần 1: Câu 1-35 (NGHE HIỂU) - 100 điểm
    const pointsPerQuestionPart1 = 100 / 35; // ≈ 2.857 điểm/câu
    
    // Phần 2: Câu 36-60 (ĐỌC HIỂU) - 100 điểm
    const pointsPerQuestionPart2 = 100 / 25; // = 4 điểm/câu
    
    hsk2TestQuestions.forEach((q, idx) => {
        if (q.section === 'writing') return; // Skip writing
        
        const userAnswer = hsk2UserAnswers[idx];
        if (userAnswer && userAnswer.toLowerCase() === q.correct_answer.toLowerCase()) {
            if (idx < 35) {
                // Câu 1-35: NGHE HIỂU
                score += pointsPerQuestionPart1;
                correctPart1++;
            } else {
                // Câu 36-60: ĐỌC HIỂU
                score += pointsPerQuestionPart2;
                correctPart2++;
            }
        }
    });
    
    // Round score to 2 decimal places
    score = Math.round(score * 100) / 100;
    
    const totalQuestions = hsk2TestQuestions.filter(q => q.section !== 'writing').length;
    const correct = correctPart1 + correctPart2;
    
    console.log('📊 PHẦN 1 (1-35):', correctPart1, '/35 câu đúng,', Math.round(correctPart1 * pointsPerQuestionPart1 * 100) / 100, '/100 điểm');
    console.log('📊 PHẦN 2 (36-60):', correctPart2, '/25 câu đúng,', Math.round(correctPart2 * pointsPerQuestionPart2 * 100) / 100, '/100 điểm');
    console.log('🎯 TỔNG:', correct, '/', totalQuestions, 'câu đúng,', score, '/200 điểm');
    
    return { score, correct, total: totalQuestions, maxScore: 200 };
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

// ===== UPDATE PAGE INFO =====
function updatePageInfo() {
    const questionCounter = document.getElementById('questionCounter');
    
    if (hsk2CurrentPage === 1) {
        if (questionCounter) {
            questionCounter.textContent = '🎧 PHẦN 1 – 听力 NGHE HIỂU';
        }
        document.body.classList.remove('show-part2');
    } else if (hsk2CurrentPage === 2) {
        if (questionCounter) {
            questionCounter.textContent = '📖 PHẦN 2 – 阅读 ĐỌC HIỂU';
        }
        document.body.classList.add('show-part2');
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('click', function(e) {
    if (e.target.id === 'btnSubmit') {
        const answeredCount = Object.keys(hsk2UserAnswers).length;
        
        if (answeredCount < 60) {
            if (!confirm(`Bạn mới trả lời ${answeredCount}/60 câu.\nBạn có chắc chắn muốn nộp bài?`)) {
                return;
            }
        }
        
        submitTest();
    }
    
    if (e.target.id === 'btnNextSection') {
        // Go to page 2 (reading section)
        hsk2CurrentPage = 2;
        displayCurrentPage();
        window.scrollTo(0, 0);
    }
    
    if (e.target.id === 'btnFinish') {
        window.location.href = '../index.html';
    }
});

