// ===== AI FEEDBACK LOGIC =====
import { userAnswers, listeningQuestions, readingQuestions, writingQuestions, selectedHSK } from './main.js';

// ===== GET AI WRITING SCORE (0-10) =====
async function getAIWritingScore(essay, hskLevel) {
    // Rule: 5 tiêu chí, mỗi tiêu chí 0-2 điểm, tổng 10
    const rubric = `Bạn là giáo viên tiếng Trung. Hãy chấm điểm bài viết theo 5 tiêu chí, mỗi tiêu chí 0-2 điểm (tổng 10).
1) Nội dung (内容): có đủ thông tin: tên, tuổi, nghề/học vấn, sở thích, nhận xét; đủ 20-30 từ.
2) Từ vựng (词汇): dùng đúng và phù hợp cấp độ HSK${hskLevel || '2'}.
3) Ngữ pháp (语法): cấu trúc đúng, câu hoàn chỉnh.
4) Tính liên kết (连贯性): mạch lạc, tự nhiên.
5) Biểu đạt & cảm xúc (表达): có cảm xúc, tự nhiên, tích cực.
Trả về JSON thuần theo schema: {"content":0-2,"vocab":0-2,"grammar":0-2,"coherence":0-2,"expression":0-2,"total":0-10,"notes":"ngắn gọn"}. Không kèm văn bản nào ngoài JSON.`;

    const GEMINI_API_KEY = 'AIzaSyA7p63DY10aG6q8EFMhevhB3o5T13BZqF8';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const requestBody = {
        contents: [{ parts: [{ text: `${rubric}\n\nBài viết:\n${essay}` }]}]
    };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
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
}

// ===== GET AI WRITING COMMENT (text) =====
async function getAIWritingComment(essay, hskLevel) {
    const prompt = `Bạn là giáo viên tiếng Trung. Hãy viết nhận xét ngắn gọn, thân thiện (120-200 chữ), chỉ ra điểm mạnh và điểm cần cải thiện theo 5 tiêu chí: nội dung, từ vựng (HSK${hskLevel||'2'}), ngữ pháp, liên kết, biểu đạt & cảm xúc. Kết thúc bằng lời động viên. Nhận xét bằng tiếng việt nhé, phần đầu sẽ là Chào em và nói thêm 1, 2 câu gì đó khích lệ, các phần Nội dung:, Từ vựng: không thêm các chi tiết thừa như ***.`;
    const GEMINI_API_KEY = 'AIzaSyA7p63DY10aG6q8EFMhevhB3o5T13BZqF8';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const requestBody = { contents: [{ parts: [{ text: prompt + "\n\nBài viết:\n" + essay }]}] };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
    if (!response.ok) throw new Error('AI comment API error');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ===== GET AI FEEDBACK USING GEMINI =====
async function getAIFeedback(essay, prompt) {
    console.log('🤖 === GET AI FEEDBACK CALLED ===');
    console.log('Essay:', essay.substring(0, 50) + '...');
    console.log('Prompt:', prompt);
    
    const feedbackSection = document.getElementById('aiFeedbackSection');
    const feedbackContent = document.getElementById('aiFeedbackContent');
    
    console.log('Elements found:', {
        section: !!feedbackSection,
        content: !!feedbackContent
    });
    
    if (!feedbackSection || !feedbackContent) {
        console.error('❌ AI feedback elements not found!');
        return;
    }
    
    // Show section with loading
    feedbackSection.style.display = 'block';
    console.log('✅ AI section displayed');
    
    feedbackContent.innerHTML = `
        <div class="ai-loading">
            <div class="ai-loading-spinner"></div>
            <div>正在分析您的作文... Đang phân tích bài viết...</div>
        </div>
    `;
    
    try {
        // Gemini API key
        const GEMINI_API_KEY = 'AIzaSyA7p63DY10aG6q8EFMhevhB3o5T13BZqF8';
        
        console.log('🤖 Starting AI feedback...');
        console.log('Essay length:', essay.length);
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: `Bạn là giáo viên tiếng Trung chuyên nghiệp. Vui lòng đánh giá bài luận của học sinh.。

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
        };
        
        console.log('📡 Calling Gemini API...');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error response:', errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ AI Response received:', data);
        
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không nhận được phản hồi từ AI.';
        console.log('AI Text length:', aiText.length);
        
        // Format AI feedback into paragraphs
        const paragraphs = aiText.split('\n\n').filter(p => p.trim());
        let formattedHTML = '';
        
        if (paragraphs.length > 0) {
            paragraphs.forEach(para => {
                const cleaned = para.trim().replace(/\n/g, '<br>');
                formattedHTML += `<p>${cleaned}</p>`;
            });
        } else {
            formattedHTML = `<p>${aiText.replace(/\n/g, '<br>')}</p>`;
        }
        
        feedbackContent.innerHTML = formattedHTML;
        console.log('✅ AI feedback displayed');
        
    } catch (error) {
        console.error('❌ AI Feedback error:', error);
        console.error('Error stack:', error.stack);
        
        feedbackContent.innerHTML = `
            <p style="color: #f56565;">
                <strong>⚠️ Không thể lấy nhận xét AI</strong><br><br>
                Lỗi: ${error.message}<br><br>
                Vui lòng liên hệ giáo viên để được đánh giá chi tiết.
            </p>
        `;
    }
}

// ===== DISPLAY RESULT =====
async function displayResult(score) {
    console.log('=== DISPLAYING RESULT ===');
    
    // Get user info
    const fullname = localStorage.getItem('fullname') || 'Học viên';
    const elapsedTime = 20 * 60 - (parseInt(document.getElementById('timerDisplay').textContent.split(':')[0]) * 60 + 
                                   parseInt(document.getElementById('timerDisplay').textContent.split(':')[1]));
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    
    // Total scorable = listening + reading (+ writing 10 điểm nếu có)
    const scorableQuestions = listeningQuestions.length + readingQuestions.length;
    const maxPointsPerQuestion = (selectedHSK === '1') ? 2 : 1;
    const writingIdxForPercent = listeningQuestions.length + readingQuestions.length;
    const hasWriting = (userAnswers[writingIdxForPercent] || '').trim().length > 0;
    const maxTotalPoints = scorableQuestions * maxPointsPerQuestion + (hasWriting ? 10 : 0);
    const percentage = maxTotalPoints > 0 ? (score / maxTotalPoints) * 100 : 0;
    
    // Determine level
    let level = '';
    let message = '';
    if (percentage >= 90) {
        level = `HSK ${selectedHSK} - Xuất sắc`;
        message = 'Xuất sắc! Bạn có trình độ tiếng Trung rất cao, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    } else if (percentage >= 75) {
        level = `HSK ${selectedHSK} - Rất tốt`;
        message = 'Rất tốt! Bạn có nền tảng tiếng Trung vững chắc, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    } else if (percentage >= 60) {
        level = `HSK ${selectedHSK} - Khá`;
        message = 'Khá tốt! Bạn đang trên đà phát triển, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    } else if (percentage >= 40) {
        level = `HSK ${selectedHSK} - Trung bình`;
        message = 'Tốt! Bạn đã có kiến thức cơ bản, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    } else {
        level = `HSK ${selectedHSK} - Cần cải thiện`;
        message = 'Bạn đang bắt đầu hành trình học tiếng Trung, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    }
    
    // Update UI
    console.log('Updating UI with:', {fullname, level, score, scorableQuestions});
    
    document.getElementById('resultName').textContent = fullname;
    document.getElementById('resultLevel').textContent = `HSK ${selectedHSK}`;
    document.getElementById('completionTime').textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalQuestions').textContent = scorableQuestions;
    document.getElementById('levelBadge').textContent = level;
    document.getElementById('resultMessage').textContent = message;
    
    console.log('✅ UI updated');
    
    // Render answers grid
    renderAnswersGrid(score, scorableQuestions);
    
    // Get AI feedback for writing (if exists)
    const writingIdxForFeedback = listeningQuestions.length + readingQuestions.length;
    const writingAnswer = userAnswers[writingIdxForFeedback];
    
    if (writingAnswer && writingAnswer.trim().length > 0) {
        console.log('Getting AI feedback for writing...');
        await getAIFeedback(writingAnswer, writingQuestions[0]?.question_text || '');
    }
}

// ===== RENDER ANSWERS GRID - SEPARATE SECTIONS =====
function renderAnswersGrid(score, total) {
    console.log('🎯 === RENDERING ANSWERS GRID ===');
    console.log('Score:', score, 'Total:', total);
    
    const listeningGrid = document.getElementById('listeningGrid');
    const readingGrid = document.getElementById('readingGrid');
    
    console.log('Grids found:', {
        listening: !!listeningGrid,
        reading: !!readingGrid
    });
    
    if (!listeningGrid || !readingGrid) {
        console.error('❌ Grids not found!');
        return;
    }
    
    let listeningCorrect = 0;
    let readingCorrect = 0;
    
    // Clear grids
    listeningGrid.innerHTML = '';
    readingGrid.innerHTML = '';
    console.log('Grids cleared');
    
    // Render Listening (0-4)
    listeningQuestions.forEach((q, i) => {
        const correct = userAnswers[i] === q.correct_answer;
        if (correct) listeningCorrect++;
        
        const item = document.createElement('div');
        item.className = `answer-item ${correct ? 'correct' : 'incorrect'}`;
        
        const questionNum = document.createElement('span');
        questionNum.textContent = i + 1;
        
        const icon = document.createElement('div');
        icon.className = `check-icon ${correct ? 'correct' : 'incorrect'}`;
        icon.textContent = correct ? '✓' : '✕';
        
        item.appendChild(questionNum);
        item.appendChild(icon);
        listeningGrid.appendChild(item);
    });
    
    // Render Reading (5-9)
    const readingStartIdx = listeningQuestions.length;
    readingQuestions.forEach((q, i) => {
        const globalIdx = readingStartIdx + i;
        const userAnswer = userAnswers[globalIdx];
        const correctAnswer = q.correct_answer;
        const correct = userAnswer && correctAnswer && 
            userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        if (correct) readingCorrect++;
        
        const item = document.createElement('div');
        item.className = `answer-item ${correct ? 'correct' : 'incorrect'}`;
        
        const questionNum = document.createElement('span');
        questionNum.textContent = globalIdx + 1;
        
        const icon = document.createElement('div');
        icon.className = `check-icon ${correct ? 'correct' : 'incorrect'}`;
        icon.textContent = correct ? '✓' : '✕';
        
        item.appendChild(questionNum);
        item.appendChild(icon);
        readingGrid.appendChild(item);
    });
    
<<<<<<< HEAD
    // Update scores (elements don't exist in HTML, so we'll skip this)
    // document.getElementById('listeningScore').textContent = listeningCorrect;
    // document.getElementById('readingScore').textContent = readingCorrect;
=======
    // Update scores
    document.getElementById('listeningScore').textContent = listeningCorrect;
    document.getElementById('readingScore').textContent = readingCorrect;
>>>>>>> 7a901c84d3425fbb975e0368650905985c001de7
}

// ===== FINISH BUTTON =====
function setupFinishButton() {
    document.getElementById('btnFinish').addEventListener('click', function() {
        window.location.reload();
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    setupFinishButton();
});

// Export functions for use in other modules
export { 
    getAIWritingScore, 
    getAIWritingComment, 
    getAIFeedback, 
    displayResult, 
    renderAnswersGrid 
};
