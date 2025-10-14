// ===== HSK QUESTIONS LOGIC =====
// This file contains the logic for handling different HSK level question structures

// ===== HSK1 LOGIC =====
export function getHSK1QuestionStructure() {
    return {
        sections: [
            {
                name: 'listening',
                title: 'Phần 1: Nghe',
                description: 'Nghe file audio và trả lời 5 câu hỏi',
                questionCount: 5,
                type: 'multiple_choice'
            },
            {
                name: 'reading',
                title: 'Phần 2: Điền đáp án',
                description: 'Đọc đoạn văn và điền đáp án đúng',
                questionCount: 5,
                type: 'fill_in_blank'
            },
            {
                name: 'writing',
                title: 'Phần 3: Viết',
                description: 'Viết bài tự luận theo yêu cầu',
                questionCount: 1,
                type: 'essay'
            }
        ],
        totalQuestions: 11,
        timeLimit: 20 * 60, // 20 minutes
        scoring: {
            listening: 2, // 2 points per question
            reading: 2,  // 2 points per question
            writing: 10  // 10 points for essay
        }
    };
}

// ===== HSK2 LOGIC =====
export function getHSK2QuestionStructure() {
    return {
        sections: [
            {
                name: 'listening',
                title: 'Phần 1: Nghe',
                description: 'Nghe file audio và trả lời 5 câu hỏi',
                questionCount: 5,
                type: 'multiple_choice'
            },
            {
                name: 'listening_image',
                title: 'Phần 2: Nghe + Nhận diện hình ảnh',
                description: 'Nghe Audio, với mỗi hình bên dưới hãy chọn Tick (Có) hoặc X (Không)',
                questionCount: 5,
                type: 'image_yes_no'
            },
            {
                name: 'writing',
                title: 'Phần 3: Viết',
                description: 'Viết bài tự luận theo yêu cầu',
                questionCount: 1,
                type: 'essay'
            }
        ],
        totalQuestions: 11,
        timeLimit: 20 * 60, // 20 minutes
        scoring: {
            listening: 1, // 1 point per question
            listening_image: 1, // 1 point per question
            writing: 10  // 10 points for essay
        }
    };
}

// ===== HSK3+ LOGIC =====
export function getHSK3PlusQuestionStructure(level) {
    return {
        sections: [
            {
                name: 'listening',
                title: 'Phần 1: Nghe',
                description: 'Nghe file audio và trả lời 5 câu hỏi',
                questionCount: 5,
                type: 'multiple_choice'
            },
            {
                name: 'listening_image',
                title: 'Phần 2: Nghe + Nhận diện hình ảnh',
                description: 'Nghe Audio, với mỗi hình bên dưới hãy chọn Tick (Có) hoặc X (Không)',
                questionCount: 5,
                type: 'image_yes_no'
            },
            {
                name: 'writing',
                title: 'Phần 3: Viết',
                description: 'Viết bài tự luận theo yêu cầu',
                questionCount: 1,
                type: 'essay'
            }
        ],
        totalQuestions: 11,
        timeLimit: 20 * 60, // 20 minutes
        scoring: {
            listening: 1, // 1 point per question
            listening_image: 1, // 1 point per question
            writing: 10  // 10 points for essay
        }
    };
}

// ===== GET QUESTION STRUCTURE BY LEVEL =====
export function getQuestionStructureByLevel(hskLevel) {
    switch (hskLevel) {
        case '1':
            return getHSK1QuestionStructure();
        case '2':
            return getHSK2QuestionStructure();
        case '3':
        case '4':
        case '5':
            return getHSK3PlusQuestionStructure(hskLevel);
        default:
            return getHSK1QuestionStructure();
    }
}

// ===== RENDER SECTION HEADER =====
export function renderSectionHeader(section, audioPlayCount = 0, maxAudioPlays = 2) {
    let html = `
        <div class="section-header">
            <div class="section-title">${section.title}</div>
            <div class="section-description">${section.description}</div>
        </div>
    `;
    
    // Add audio controls for listening sections
    if (section.name === 'listening' || section.name === 'listening_image') {
        html += `
            <div class="audio-section">
                <div class="audio-info">⚠️ Chú ý phần nghe Audio chỉ nghe tối đa ${maxAudioPlays} lượt</div>
                ${audioPlayCount >= maxAudioPlays ? '<div style="color: #f44336; margin-top: 10px; font-weight: bold; font-size: 16px;">Đã hết lượt nghe</div>' : `
                <audio id="mainAudio" controlsList="nodownload noplaybackrate" style="display: none;">
                    <source src="" type="audio/mpeg">
                </audio>
                <div id="audioControls" style="margin-top: 15px;">
                    <button id="playBtn" class="audio-play-btn" onclick="window.handleAudioPlay()">▶️ Phát Audio</button>
                    <div id="audioProgress" style="margin: 15px 0;">
                        <div id="audioProgressBar"></div>
                    </div>
                    <div id="audioTime">00:00 / 00:00</div>
                </div>
                `}
            </div>
        `;
    }
    
    // Add reading passage for HSK1 reading section
    if (section.name === 'reading' && section.type === 'fill_in_blank') {
        html += `
            <div class="reading-passage">
                <div class="passage-title">📖 Đọc văn:</div>
                <div class="passage-text">Đoạn văn sẽ được hiển thị ở đây...</div>
            </div>
        `;
    }
    
    return html;
}

// ===== RENDER QUESTION BY TYPE =====
export function renderQuestionByType(question, questionIndex, globalIndex, userAnswer = '') {
    let html = '';
    
    switch (question.type || 'multiple_choice') {
        case 'multiple_choice':
            html = renderMultipleChoiceQuestion(question, globalIndex, userAnswer);
            break;
        case 'fill_in_blank':
            html = renderFillInBlankQuestion(question, globalIndex, userAnswer);
            break;
        case 'image_yes_no':
            html = renderImageYesNoQuestion(question, globalIndex, userAnswer);
            break;
        case 'essay':
            html = renderEssayQuestion(question, globalIndex, userAnswer);
            break;
        default:
            html = renderMultipleChoiceQuestion(question, globalIndex, userAnswer);
    }
    
    return html;
}

// ===== RENDER MULTIPLE CHOICE QUESTION =====
function renderMultipleChoiceQuestion(question, globalIndex, userAnswer) {
    return `
        <div class="question-header">${globalIndex + 1}. ${question.question_text}</div>
        <div class="options-list" style="display: flex; margin-top: 15px;">
            <div class="option-item ${userAnswer === 'A' ? 'selected' : ''}" data-question="${globalIndex}" data-option="A">
                <div class="option-label">A</div>
                <div class="option-text">${question.option_a}</div>
            </div>
            <div class="option-item ${userAnswer === 'B' ? 'selected' : ''}" data-question="${globalIndex}" data-option="B">
                <div class="option-label">B</div>
                <div class="option-text">${question.option_b}</div>
            </div>
            <div class="option-item ${userAnswer === 'C' ? 'selected' : ''}" data-question="${globalIndex}" data-option="C">
                <div class="option-label">C</div>
                <div class="option-text">${question.option_c}</div>
            </div>
        </div>
    `;
}

// ===== RENDER FILL IN BLANK QUESTION =====
function renderFillInBlankQuestion(question, globalIndex, userAnswer) {
    return `
        <div class="question-header">${globalIndex + 1}. ${question.question_text}</div>
        <div class="text-input-container" style="display: block !important;">
            <input type="text" 
                   class="text-input" 
                   data-question="${globalIndex}" 
                   value="${userAnswer}" 
                   placeholder="Nhập đáp án của bạn...">
        </div>
    `;
}

// ===== RENDER IMAGE YES/NO QUESTION =====
function renderImageYesNoQuestion(question, globalIndex, userAnswer) {
    const yesSelected = userAnswer === 'Y';
    const noSelected = userAnswer === 'N';
    const imageUrl = question.image_url || question.image || '';
    
    return `
        <div class="question-header">${globalIndex + 1}. ${question.question_text}</div>
        <div class="image-choice-item">
            <img class="image-thumb" src="${imageUrl}" alt="item ${globalIndex + 1}" />
            <div class="image-caption">Hình trên có xuất hiện trong đoạn nghe?</div>
            <div class="image-choice-actions">
                <div class="image-toggle yes ${yesSelected ? 'selected' : ''}" data-question="${globalIndex}" data-choice="Y">✓ Có</div>
                <div class="image-toggle no ${noSelected ? 'selected' : ''}" data-question="${globalIndex}" data-choice="N">✕ Không</div>
            </div>
        </div>
    `;
}

// ===== RENDER ESSAY QUESTION =====
function renderEssayQuestion(question, globalIndex, userAnswer) {
    const wordCount = (userAnswer || '').split(/\s+/).filter(w => w.length > 0).length;
    
    return `
        <div class="question-header">${globalIndex + 1}. ${question.question_text}</div>
        <div class="writing-section">
            <div class="writing-instruction">
                <strong>Đề bài:</strong>
                <div style="margin-top: 10px;">${question.question_text}</div>
            </div>
            <textarea class="essay-input" data-question="${globalIndex}" placeholder="Nhập bài viết của bạn..." style="min-height: 300px;">${userAnswer || ''}</textarea>
            <div class="word-count">Số từ: <strong>${wordCount}</strong></div>
        </div>
    `;
}

// ===== GET SECTION TITLE BY LEVEL =====
export function getSectionTitleByLevel(hskLevel, sectionIndex) {
    const structure = getQuestionStructureByLevel(hskLevel);
    const section = structure.sections[sectionIndex - 1];
    return section ? section.title : `Phần ${sectionIndex}`;
}

// ===== GET SECTION DESCRIPTION BY LEVEL =====
export function getSectionDescriptionByLevel(hskLevel, sectionIndex) {
    const structure = getQuestionStructureByLevel(hskLevel);
    const section = structure.sections[sectionIndex - 1];
    return section ? section.description : '';
}
