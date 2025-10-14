// ===== RESULT DISPLAY =====
import { getSectionQuestions, getSelectedLevel } from './supabase-config.js';
import { getAIFeedback } from './api-functions.js';

// ===== DISPLAY RESULT =====
export async function displayResult(score) {
    console.log('=== DISPLAYING RESULT ===');
    
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    const { selectedHSK } = getSelectedLevel() || {};
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    // Get user info
    const fullname = localStorage.getItem('fullname') || 'Học viên';
    const elapsedTime = 20 * 60 - getRemainingTime();
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
    const level = getLevelBadge(score, maxTotalPoints, selectedHSK);
    const message = getResultMessage(percentage);
    
    // Update UI
    console.log('Updating UI with:', {fullname, level, score, scorableQuestions});
    
    const resultName = document.getElementById('resultName');
    const resultLevel = document.getElementById('resultLevel');
    const completionTime = document.getElementById('completionTime');
    const finalScore = document.getElementById('finalScore');
    const totalQuestions = document.getElementById('totalQuestions');
    const levelBadge = document.getElementById('levelBadge');
    const resultMessage = document.getElementById('resultMessage');
    
    if (resultName) resultName.textContent = fullname;
    if (resultLevel) resultLevel.textContent = `HSK ${selectedHSK}`;
    if (completionTime) completionTime.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    
    // For HSK1, don't display score on web
    if (selectedHSK === '1') {
        // Hide score elements for HSK1
        const scoreElements = document.querySelectorAll('#finalScore, #totalQuestions, #levelBadge');
        scoreElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
    } else {
        // Show score for other levels
        if (finalScore) finalScore.textContent = score;
        if (totalQuestions) totalQuestions.textContent = scorableQuestions;
        if (levelBadge) levelBadge.textContent = level;
    }
    
    if (resultMessage) resultMessage.textContent = message;
    
    console.log('✅ UI updated');
    
    // Render answers grid only for non-HSK1 levels
    if (selectedHSK !== '1') {
        renderAnswersGrid(score, scorableQuestions);
    }
    
    // Get AI feedback for writing (if exists)
    const writingIdxForFeedback = listeningQuestions.length + readingQuestions.length;
    const writingAnswer = userAnswers[writingIdxForFeedback];
    
    if (writingAnswer && writingAnswer.trim().length > 0) {
        console.log('Getting AI feedback for writing...');
        await getAIFeedback(writingAnswer, writingQuestions[0]?.question_text || '');
    }
}

// ===== GET LEVEL BADGE =====
function getLevelBadge(score, totalQuestions, selectedHSK) {
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage >= 90) {
        return `HSK ${selectedHSK} - Xuất sắc`;
    } else if (percentage >= 75) {
        return `HSK ${selectedHSK} - Rất tốt`;
    } else if (percentage >= 60) {
        return `HSK ${selectedHSK} - Khá`;
    } else if (percentage >= 40) {
        return `HSK ${selectedHSK} - Trung bình`;
    } else {
        return `HSK ${selectedHSK} - Cần cải thiện`;
    }
}

// ===== GET RESULT MESSAGE =====
function getResultMessage(percentage) {
    if (percentage >= 90) {
        return 'Xuất sắc! Bạn có trình độ tiếng Trung rất cao, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    } else if (percentage >= 75) {
        return 'Rất tốt! Bạn có nền tảng tiếng Trung vững chắc, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    } else if (percentage >= 60) {
        return 'Khá tốt! Bạn đang trên đà phát triển, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    } else if (percentage >= 40) {
        return 'Tốt! Bạn đã có kiến thức cơ bản, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    } else {
        return 'Bạn đang bắt đầu hành trình học tiếng Trung, phía trung tâm sẽ liên hệ với bạn trong thời gian ngắn nhất!';
    }
}

// ===== RENDER ANSWERS GRID =====
function renderAnswersGrid(score, total) {
    console.log('🎯 === RENDERING ANSWERS GRID ===');
    console.log('Score:', score, 'Total:', total);
    
    const { listeningQuestions, readingQuestions } = getSectionQuestions();
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
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
    
    // Update scores
    const listeningScore = document.getElementById('listeningScore');
    const readingScore = document.getElementById('readingScore');
    if (listeningScore) listeningScore.textContent = listeningCorrect;
    if (readingScore) readingScore.textContent = readingCorrect;
}

// ===== GET REMAINING TIME =====
function getRemainingTime() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        const timeText = timerDisplay.textContent;
        const [minutes, seconds] = timeText.split(':').map(Number);
        return minutes * 60 + seconds;
    }
    return 0;
}
