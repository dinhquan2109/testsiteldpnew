// ===== TEST SCORING =====
import { getSectionQuestions, getSelectedLevel } from './supabase-config.js';
import { getAIWritingScore, getAIWritingComment } from './api-functions.js';

// ===== CALCULATE SCORE =====
export async function calculateScore() {
    const { listeningQuestions, readingQuestions, writingQuestions } = getSectionQuestions();
    const { selectedHSK } = getSelectedLevel() || {};
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    let score = 0;
    const pointsPerQuestion = (selectedHSK === '1') ? 2 : 1; // HSK1: 2 điểm/câu
    let writingAIScore = 0; // 0-10
    let writingAIComment = '';
    
    // Score listening questions (index 0-4) - Multiple choice
    listeningQuestions.forEach((q, i) => {
        if (userAnswers[i] === q.correct_answer) {
            score += pointsPerQuestion;
        }
    });
    
    // Score reading questions (index 5-9)
    const readingStartIdx = listeningQuestions.length;
    readingQuestions.forEach((q, i) => {
        const globalIdx = readingStartIdx + i;
        const userAnswer = userAnswers[globalIdx];
        const correctAnswer = q.correct_answer;
        // If this section is image Yes/No: expect 'Y' or 'N'
        if (userAnswer && correctAnswer) {
            if ((userAnswer === 'Y' || userAnswer === 'N') && (correctAnswer === 'Y' || correctAnswer === 'N')) {
                if (userAnswer === correctAnswer) score += pointsPerQuestion;
            } else if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
                if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) score += pointsPerQuestion;
            }
        }
    });
    
    console.log('HSK1 Scoring - Listening:', listeningQuestions.length, 'Reading:', readingQuestions.length);
    console.log('Current score before writing:', score);
    
    // For HSK1: Max score is 30 (10 questions x 2 points + 10 writing points)
    if (selectedHSK === '1') {
        console.log('HSK1 Max possible score: 30 (10 questions x 2 points + 10 writing points)');
    }

    // AI score for writing (0-10) + AI comment
    try {
        const writingIndex = listeningQuestions.length + readingQuestions.length;
        const writingAnswer = userAnswers[writingIndex];
        if (writingAnswer && writingAnswer.trim().length > 0) {
            const ai = await getAIWritingScore(writingAnswer, selectedHSK);
            if (ai && typeof ai.total !== 'undefined') {
                let totalNum = Number(ai.total);
                if (Number.isNaN(totalNum) && typeof ai.total === 'string') {
                    const m = ai.total.match(/\d+(?:\.\d+)?/);
                    if (m) totalNum = Number(m[0]);
                }
                // Luôn làm tròn xuống để khớp với hiển thị 9/10 -> 9
                writingAIScore = Math.floor(Math.max(0, Math.min(10, totalNum)));
                score += writingAIScore;
            }
            // get friendly comment for storage
            const aiComment = await getAIWritingComment(writingAnswer, selectedHSK);
            if (typeof aiComment === 'string') {
                writingAIComment = aiComment.trim().slice(0, 4000);
                // Override score using total parsed from comment if present (ensure consistency)
                let parsed = null;
                // pattern like "8/10" or "8.5/10"
                let m = writingAIComment.match(/(\d+(?:[\.,]\d+)?)\s*\/\s*10/);
                if (m) {
                    parsed = Number(m[1].replace(',', '.'));
                } else {
                    // fallback: first number 0..10 near keywords 'tổng điểm' or 'điểm'
                    m = writingAIComment.match(/tổng\s*điểm[^\d]*(\d+(?:[\.,]\d+)?)/i) || writingAIComment.match(/\b(\d+(?:[\.,]\d+)?)\b/);
                    if (m) parsed = Number(m[1].replace(',', '.'));
                }
                if (typeof parsed === 'number' && !Number.isNaN(parsed)) {
                    const normalized = Math.floor(Math.max(0, Math.min(10, parsed)));
                    // adjust total score to reflect overridden writing score
                    score -= writingAIScore;
                    writingAIScore = normalized;
                    score += writingAIScore;
                }
            }
        }
    } catch (e) {
        console.warn('AI writing score failed:', e.message);
    }

    // For HSK1, ensure max score is 30
    if (selectedHSK === '1') {
        const maxScore = 30; // 10 questions x 2 points + 10 writing points
        if (score > maxScore) {
            score = maxScore;
        }
        console.log('HSK1 Final score:', score, '/ 30');
    }
    
    return {
        score,
        writingAIScore,
        writingAIComment,
        listeningCorrect: calculateListeningCorrect(),
        readingCorrect: calculateReadingCorrect()
    };
}

// ===== CALCULATE LISTENING CORRECT =====
function calculateListeningCorrect() {
    const { listeningQuestions } = getSectionQuestions();
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    let correct = 0;
    listeningQuestions.forEach((q, i) => {
        if (userAnswers[i] === q.correct_answer) {
            correct++;
        }
    });
    return correct;
}

// ===== CALCULATE READING CORRECT =====
function calculateReadingCorrect() {
    const { listeningQuestions, readingQuestions } = getSectionQuestions();
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
    
    let correct = 0;
    const readingStartIdx = listeningQuestions.length;
    readingQuestions.forEach((q, i) => {
        const globalIdx = readingStartIdx + i;
        const userAnswer = userAnswers[globalIdx];
        const correctAnswer = q.correct_answer;
        if (userAnswer && correctAnswer) {
            if ((userAnswer === 'Y' || userAnswer === 'N') && (correctAnswer === 'Y' || correctAnswer === 'N')) {
                if (userAnswer === correctAnswer) correct++;
            } else if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
                if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) correct++;
            }
        }
    });
    return correct;
}

// ===== GET LEVEL BADGE =====
export function getLevelBadge(score, totalQuestions, selectedHSK) {
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
export function getResultMessage(percentage) {
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
