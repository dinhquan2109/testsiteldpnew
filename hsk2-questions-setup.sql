-- ===== HSK2 QUESTIONS SETUP =====
-- File SQL để cấu hình câu hỏi và đáp án HSK2 trong Supabase

-- ===== CREATE TABLE (Nếu chưa có) =====
CREATE TABLE IF NOT EXISTS hsk2_questions (
    id SERIAL PRIMARY KEY,
    order_number INTEGER NOT NULL,
    section VARCHAR(50),
    question_text TEXT,
    correct_answer TEXT,
    audio_url TEXT,
    image_url TEXT,
    question_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===== ENABLE RLS (Row Level Security) =====
ALTER TABLE hsk2_questions ENABLE ROW LEVEL SECURITY;

-- ===== CREATE POLICY (Cho phép public read) =====
DROP POLICY IF EXISTS "Allow public read access" ON hsk2_questions;
CREATE POLICY "Allow public read access" ON hsk2_questions
    FOR SELECT
    USING (true);

-- ===== XÓA DỮ LIỆU CŨ (NẾU CÓ) =====
TRUNCATE hsk2_questions RESTART IDENTITY CASCADE;

-- ===== PHẦN 1: NGHE (Questions 1-10) =====
-- Questions 1-10: Audio + True/False
-- Đáp án: 'true' hoặc 'false'

INSERT INTO hsk2_questions (order_number, section, question_text, correct_answer, audio_url, image_url, question_type) VALUES
(1, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'true', 'https://your-storage-url.com/audio/hsk2_q1.mp3', 'https://your-storage-url.com/images/hsk2_q1.jpg', 'true_false'),
(2, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'false', 'https://your-storage-url.com/audio/hsk2_q2.mp3', 'https://your-storage-url.com/images/hsk2_q2.jpg', 'true_false'),
(3, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'true', 'https://your-storage-url.com/audio/hsk2_q3.mp3', 'https://your-storage-url.com/images/hsk2_q3.jpg', 'true_false'),
(4, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'false', 'https://your-storage-url.com/audio/hsk2_q4.mp3', 'https://your-storage-url.com/images/hsk2_q4.jpg', 'true_false'),
(5, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'true', 'https://your-storage-url.com/audio/hsk2_q5.mp3', 'https://your-storage-url.com/images/hsk2_q5.jpg', 'true_false'),
(6, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'false', 'https://your-storage-url.com/audio/hsk2_q6.mp3', 'https://your-storage-url.com/images/hsk2_q6.jpg', 'true_false'),
(7, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'true', 'https://your-storage-url.com/audio/hsk2_q7.mp3', 'https://your-storage-url.com/images/hsk2_q7.jpg', 'true_false'),
(8, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'false', 'https://your-storage-url.com/audio/hsk2_q8.mp3', 'https://your-storage-url.com/images/hsk2_q8.jpg', 'true_false'),
(9, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'true', 'https://your-storage-url.com/audio/hsk2_q9.mp3', 'https://your-storage-url.com/images/hsk2_q9.jpg', 'true_false'),
(10, 'listening', 'Nghe và chọn đúng (✓) hoặc sai (✗)', 'false', 'https://your-storage-url.com/audio/hsk2_q10.mp3', 'https://your-storage-url.com/images/hsk2_q10.jpg', 'true_false');

-- ===== PHẦN 2: ĐỌC (Questions 11-20) =====
-- 10 images (A-J) + 10 questions
-- Mỗi ảnh chỉ được dùng 1 lần
-- Đáp án: 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', hoặc 'J'

-- Question 11-20: Reading comprehension with image matching (drag & drop)
INSERT INTO hsk2_questions (order_number, section, question_text, correct_answer, question_type) VALUES
(11, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'A', 'image_matching'),
(12, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'B', 'image_matching'),
(13, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'C', 'image_matching'),
(14, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'D', 'image_matching'),
(15, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'E', 'image_matching'),
(16, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'F', 'image_matching'),
(17, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'G', 'image_matching'),
(18, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'H', 'image_matching'),
(19, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'I', 'image_matching'),
(20, 'reading', 'Chọn hình ảnh phù hợp với câu văn', 'J', 'image_matching');

-- ===== PHẦN 3: VIẾT (Question 21) - OPTIONAL =====
-- Writing essay (không tính điểm, chỉ để AI feedback)
-- INSERT INTO hsk2_questions (order_number, section, question_text, correct_answer, question_type) VALUES
-- (21, 'writing', 'Viết đoạn văn ngắn 50-80 từ về chủ đề "Một ngày của tôi"', '', 'essay');

-- ===== LƯU Ý QUAN TRỌNG =====
-- 1. Thay thế URL audio và image bằng URL thực tế từ Supabase Storage hoặc CDN của bạn
-- 2. Format audio_url: https://[project-ref].supabase.co/storage/v1/object/public/audio/hsk2_q1.mp3
-- 3. Format image_url: https://[project-ref].supabase.co/storage/v1/object/public/images/hsk2_q1.jpg
-- 4. Đảm bảo đã upload file audio và images vào Supabase Storage trước

-- ===== CÁCH UPLOAD FILE VÀO SUPABASE STORAGE =====
-- 1. Vào Supabase Dashboard > Storage
-- 2. Tạo 2 buckets: 'audio' và 'images' (set public access)
-- 3. Upload files:
--    - Audio: hsk2_q1.mp3, hsk2_q2.mp3, ..., hsk2_q10.mp3
--    - Images: hsk2_q1.jpg, hsk2_q2.jpg, ..., hsk2_q10.jpg (cho listening)
--    - Images: hsk2_reading_A.jpg, B.jpg, ..., J.jpg (10 ảnh cho reading)
-- 4. Copy public URL của mỗi file và paste vào SQL ở trên

-- ===== VERIFY DỮ LIỆU =====
-- Chạy query này để kiểm tra:
SELECT * FROM hsk2_questions ORDER BY order_number;

-- ===== KẾT QUẢ MONG ĐỢI =====
-- Tổng: 20 câu hỏi (hoặc 21 nếu có writing)
-- - Questions 1-10: Listening (true/false với audio + image)
-- - Questions 11-20: Reading (drag & drop A-J, mỗi ảnh dùng 1 lần)
-- - Question 21: Writing (essay không tính điểm - optional)

