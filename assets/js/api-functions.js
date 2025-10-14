// ===== API FUNCTIONS =====
import { supabase, setUserRowId, setTestQuestions, setSectionQuestions, setSelectedLevel } from './supabase-config.js';

// ===== SAVE USER INFO =====
export async function saveUserInfo(userData) {
    try {
        const { data, error } = await supabase
            .from('placement')
            .insert([{
                fullname: userData.fullname,
                age: userData.age ? parseInt(userData.age) : null,
                phone: userData.phone,
                email: userData.email
            }])
            .select();

        if (error) throw error;

        const userId = data[0]?.id || Date.now();
        setUserRowId(userId);
        
        // Save to localStorage for result page
        localStorage.setItem('fullname', userData.fullname);
        
        return { success: true, userId };
    } catch (error) {
        console.error('Error saving user info:', error);
        return { success: false, error: error.message };
    }
}

// ===== GET QUESTIONS BY LEVEL =====
export async function getQuestionsByLevel(selectedTable, selectedRange) {
    try {
        let questions;
        let error;
        
        if (selectedTable === 'questions' && selectedRange) {
            // Backward compatibility for HSK1 using main table + range
            const [startNum, endNum] = selectedRange.split('-').map(Number);
            ({ data: questions, error } = await supabase
                .from('questions')
                .select('*')
                .gte('order_number', startNum)
                .lte('order_number', endNum)
                .order('order_number'));
        } else {
            // Per-level tables: expect explicit section field
            ({ data: questions, error } = await supabase
                .from(selectedTable)
                .select('*')
                .order('section', { ascending: true })
                .order('order_number', { ascending: true }));
        }

        if (error) throw error;

        if (!questions || questions.length === 0) {
            throw new Error('Không có câu hỏi cho trình độ này');
        }

        // Separate by section field if available, else fallback split
        let listeningQuestions = [];
        let readingQuestions = [];
        let writingQuestions = [];

        if (questions[0] && 'section' in questions[0]) {
            listeningQuestions = questions.filter(q => q.section === 'listening');
            readingQuestions = questions.filter(q => q.section === 'reading');
            writingQuestions = questions.filter(q => q.section === 'writing');
        } else {
            listeningQuestions = questions.slice(0, 5);
            readingQuestions = questions.slice(5, 10);
            writingQuestions = questions.slice(10, 11);
        }

        setTestQuestions(questions);
        setSectionQuestions(listeningQuestions, readingQuestions, writingQuestions);

        return {
            success: true,
            questions,
            listeningQuestions,
            readingQuestions,
            writingQuestions
        };
    } catch (error) {
        console.error('Error getting questions:', error);
        return { success: false, error: error.message };
    }
}

// ===== SAVE TEST RESULTS =====
export async function saveTestResults(resultData) {
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

// ===== AI WRITING SCORE =====
export async function getAIWritingScore(essay, hskLevel) {
    try {
        // Rule: 5 tiêu chí, mỗi tiêu chí 0-2 điểm, tổng 10
        const rubric = `Bạn là giáo viên tiếng Trung. Hãy chấm điểm bài viết theo 5 tiêu chí, mỗi tiêu chí 0-2 điểm (tổng 10).
1) Nội dung (内容): có đủ thông tin: tên, tuổi, nghề/học vấn, sở thích, nhận xét; đủ 20-30 từ.
2) Từ vựng (词汇): dùng đúng và phù hợp cấp độ HSK${hskLevel || '2'}.
3) Ngữ pháp (语法): cấu trúc đúng, câu hoàn chỉnh.
4) Tính liên kết (连贯性): mạch lạc, tự nhiên.
5) Biểu đạt & cảm xúc (表达): có cảm xúc, tự nhiên, tích cực.
Trả về JSON thuần theo schema: {"content":0-2,"vocab":0-2,"grammar":0-2,"coherence":0-2,"expression":0-2,"total":0-10,"notes":"ngắn gọn"}. Không kèm văn bản nào ngoài JSON.`;

        const GEMINI_API_KEY = 'AIzaSyA0KtdYeuXgVA33SgZHpfYZLrsJN1uouSQ';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const requestBody = {
            contents: [{ parts: [{ text: `${rubric}\n\nBài viết:\n${essay}` }]}]
        };
        
        const response = await fetch(apiUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(requestBody) 
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
export async function getAIWritingComment(essay, hskLevel) {
    try {
        const prompt = `Bạn là giáo viên tiếng Trung. Hãy viết nhận xét ngắn gọn, thân thiện (120-200 chữ), chỉ ra điểm mạnh và điểm cần cải thiện theo 5 tiêu chí: nội dung, từ vựng (HSK${hskLevel||'2'}), ngữ pháp, liên kết, biểu đạt & cảm xúc. Kết thúc bằng lời động viên. Nhận xét bằng tiếng việt nhé, phần đầu sẽ là Chào em và nói thêm 1, 2 câu gì đó khích lệ, các phần Nội dung:, Từ vựng: không thêm các chi tiết thừa như ***.`;
        
        const GEMINI_API_KEY = 'AIzaSyA0KtdYeuXgVA33SgZHpfYZLrsJN1uouSQ';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const requestBody = { 
            contents: [{ parts: [{ text: prompt + "\n\nBài viết:\n" + essay }]}] 
        };
        
        const response = await fetch(apiUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(requestBody) 
        });
        
        if (!response.ok) throw new Error('AI comment API error');
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
        console.error('Error getting AI writing comment:', error);
        return '';
    }
}

// ===== AI FEEDBACK =====
export async function getAIFeedback(essay, prompt) {
    try {
        const GEMINI_API_KEY = 'AIzaSyA0KtdYeuXgVA33SgZHpfYZLrsJN1uouSQ';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const requestBody = {
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
        };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không nhận được phản hồi từ AI.';
        
        return aiText;
    } catch (error) {
        console.error('Error getting AI feedback:', error);
        return `Lỗi: ${error.message}`;
    }
}
