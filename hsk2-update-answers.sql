-- ===== FILE SQL CẬP NHẬT ĐÁP ÁN HSK2 =====
-- Sử dụng file này để update đáp án đúng cho các câu hỏi HSK2

-- ===== CÁCH SỬ DỤNG =====
-- 1. Mở Supabase SQL Editor
-- 2. Copy các câu lệnh UPDATE bên dưới
-- 3. Sửa đáp án theo ý muốn
-- 4. Run để cập nhật

-- ===== CẬP NHẬT ĐÁP ÁN PHẦN LISTENING (Questions 1-10) =====
-- Đáp án: 'true' hoặc 'false'

UPDATE hsk2_questions SET correct_answer = 'true' WHERE order_number = 1;
UPDATE hsk2_questions SET correct_answer = 'false' WHERE order_number = 2;
UPDATE hsk2_questions SET correct_answer = 'true' WHERE order_number = 3;
UPDATE hsk2_questions SET correct_answer = 'false' WHERE order_number = 4;
UPDATE hsk2_questions SET correct_answer = 'true' WHERE order_number = 5;
UPDATE hsk2_questions SET correct_answer = 'false' WHERE order_number = 6;
UPDATE hsk2_questions SET correct_answer = 'true' WHERE order_number = 7;
UPDATE hsk2_questions SET correct_answer = 'false' WHERE order_number = 8;
UPDATE hsk2_questions SET correct_answer = 'true' WHERE order_number = 9;
UPDATE hsk2_questions SET correct_answer = 'false' WHERE order_number = 10;

-- ===== CẬP NHẬT ĐÁP ÁN PHẦN READING (Questions 11-20) =====
-- Đáp án: 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', hoặc 'J'
-- Mỗi chữ cái chỉ nên xuất hiện 1 lần (10 câu = 10 chữ cái khác nhau)

UPDATE hsk2_questions SET correct_answer = 'A' WHERE order_number = 11;
UPDATE hsk2_questions SET correct_answer = 'B' WHERE order_number = 12;
UPDATE hsk2_questions SET correct_answer = 'C' WHERE order_number = 13;
UPDATE hsk2_questions SET correct_answer = 'D' WHERE order_number = 14;
UPDATE hsk2_questions SET correct_answer = 'E' WHERE order_number = 15;
UPDATE hsk2_questions SET correct_answer = 'F' WHERE order_number = 16;
UPDATE hsk2_questions SET correct_answer = 'G' WHERE order_number = 17;
UPDATE hsk2_questions SET correct_answer = 'H' WHERE order_number = 18;
UPDATE hsk2_questions SET correct_answer = 'I' WHERE order_number = 19;
UPDATE hsk2_questions SET correct_answer = 'J' WHERE order_number = 20;

-- ===== CẬP NHẬT URL AUDIO (Questions 1-10) =====
-- Thay 'YOUR_PROJECT_REF' bằng project ref thực tế từ Supabase
-- Format: https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q1.mp3

UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q1.mp3' WHERE order_number = 1;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q2.mp3' WHERE order_number = 2;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q3.mp3' WHERE order_number = 3;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q4.mp3' WHERE order_number = 4;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q5.mp3' WHERE order_number = 5;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q6.mp3' WHERE order_number = 6;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q7.mp3' WHERE order_number = 7;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q8.mp3' WHERE order_number = 8;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q9.mp3' WHERE order_number = 9;
UPDATE hsk2_questions SET audio_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/audio/hsk2_q10.mp3' WHERE order_number = 10;

-- ===== CẬP NHẬT URL IMAGES LISTENING (Questions 1-10) =====
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q1.jpg' WHERE order_number = 1;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q2.jpg' WHERE order_number = 2;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q3.jpg' WHERE order_number = 3;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q4.jpg' WHERE order_number = 4;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q5.jpg' WHERE order_number = 5;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q6.jpg' WHERE order_number = 6;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q7.jpg' WHERE order_number = 7;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q8.jpg' WHERE order_number = 8;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q9.jpg' WHERE order_number = 9;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_q10.jpg' WHERE order_number = 10;

-- ===== CẬP NHẬT URL IMAGES READING (Questions 11-20) =====
-- Các ảnh này sẽ hiển thị trong grid kéo thả (A-J)
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_A.jpg' WHERE order_number = 11;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_B.jpg' WHERE order_number = 12;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_C.jpg' WHERE order_number = 13;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_D.jpg' WHERE order_number = 14;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_E.jpg' WHERE order_number = 15;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_F.jpg' WHERE order_number = 16;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_G.jpg' WHERE order_number = 17;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_H.jpg' WHERE order_number = 18;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_I.jpg' WHERE order_number = 19;
UPDATE hsk2_questions SET image_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_reading_J.jpg' WHERE order_number = 20;

-- ===== CẬP NHẬT TEXT CÂU HỎI =====
-- Nếu muốn thay đổi nội dung câu hỏi
UPDATE hsk2_questions SET question_text = 'Nghe và chọn đúng (✓) hoặc sai (✗)' WHERE order_number BETWEEN 1 AND 10;
UPDATE hsk2_questions SET question_text = 'Kéo hình ảnh phù hợp vào ô trống' WHERE order_number BETWEEN 11 AND 20;

-- ===== VERIFY DỮ LIỆU SAU KHI UPDATE =====
-- Chạy query này để kiểm tra:
SELECT order_number, section, correct_answer, audio_url, image_url 
FROM hsk2_questions 
ORDER BY order_number;

-- ===== UPDATE NHIỀU ĐÁNG ÁN CÙNG LÚC =====
-- Nếu muốn update nhanh tất cả listening questions:
/*
UPDATE hsk2_questions 
SET correct_answer = CASE order_number
    WHEN 1 THEN 'true'
    WHEN 2 THEN 'false'
    WHEN 3 THEN 'true'
    WHEN 4 THEN 'false'
    WHEN 5 THEN 'true'
    WHEN 6 THEN 'false'
    WHEN 7 THEN 'true'
    WHEN 8 THEN 'false'
    WHEN 9 THEN 'true'
    WHEN 10 THEN 'false'
END
WHERE order_number BETWEEN 1 AND 10;
*/

-- ===== UPDATE NHIỀU ĐÁNG ÁN READING CÙNG LÚC =====
/*
UPDATE hsk2_questions 
SET correct_answer = CASE order_number
    WHEN 11 THEN 'A'
    WHEN 12 THEN 'B'
    WHEN 13 THEN 'C'
    WHEN 14 THEN 'D'
    WHEN 15 THEN 'E'
    WHEN 16 THEN 'F'
    WHEN 17 THEN 'G'
    WHEN 18 THEN 'H'
    WHEN 19 THEN 'I'
    WHEN 20 THEN 'J'
END
WHERE order_number BETWEEN 11 AND 20;
*/

-- ===== LƯU Ý QUAN TRỌNG =====
-- 1. Listening questions (1-10): Đáp án chỉ là 'true' hoặc 'false'
-- 2. Reading questions (11-20): Đáp án là chữ cái 'A' đến 'J'
-- 3. Mỗi chữ cái A-J nên chỉ xuất hiện 1 lần trong reading (vì mỗi ảnh dùng 1 lần)
-- 4. Nhớ thay 'YOUR_PROJECT_REF' bằng project ref thực tế của bạn
-- 5. Sau khi update, test lại trên website để đảm bảo đáp án đúng

