-- ===== FILE SQL CẬP NHẬT PHẦN ĐỌC HIỂU (Comprehension) =====
-- Sử dụng file này để update đoạn văn và đáp án cho câu 21-30

-- ===== CẬP NHẬT ĐOẠN VĂN (PASSAGE TEXT) =====
-- Thay thế đoạn văn mẫu bằng nội dung thật từ đề thi HSK2
-- Lưu ý: Tất cả 10 câu (21-30) dùng chung 1 đoạn văn

UPDATE hsk2_questions 
SET passage_text = '
Thay đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn nên:
- Dài khoảng 200-300 từ
- Phù hợp với trình độ HSK2
- Nội dung về cuộc sống hàng ngày, văn hóa, hoặc chủ đề quen thuộc
- Có đủ thông tin để trả lời 10 câu hỏi

Ví dụ:
小明是一个学生。他每天早上七点起床，七点半吃早饭。
他很喜欢学习汉语。他的汉语老师很好，他们都很喜欢她。
小明有一个妹妹，她叫小红。小红今年八岁，在小学上学。
他们的爸爸是医生，妈妈是老师。
星期六和星期天，他们一家人常常一起去公园玩儿...
'
WHERE section = 'comprehension';

-- ===== CẬP NHẬT ĐÁP ÁN CHO TỪNG CÂU (21-30) =====
-- Đáp án chỉ là: 'A', 'B', hoặc 'C'

UPDATE hsk2_questions SET correct_answer = 'A' WHERE order_number = 21;
UPDATE hsk2_questions SET correct_answer = 'B' WHERE order_number = 22;
UPDATE hsk2_questions SET correct_answer = 'C' WHERE order_number = 23;
UPDATE hsk2_questions SET correct_answer = 'A' WHERE order_number = 24;
UPDATE hsk2_questions SET correct_answer = 'B' WHERE order_number = 25;
UPDATE hsk2_questions SET correct_answer = 'C' WHERE order_number = 26;
UPDATE hsk2_questions SET correct_answer = 'A' WHERE order_number = 27;
UPDATE hsk2_questions SET correct_answer = 'B' WHERE order_number = 28;
UPDATE hsk2_questions SET correct_answer = 'C' WHERE order_number = 29;
UPDATE hsk2_questions SET correct_answer = 'A' WHERE order_number = 30;

-- ===== CẬP NHẬT TEXT ĐÁP ÁN A/B/C =====
-- Text sẽ hiển thị bên cạnh nút A/B/C

UPDATE hsk2_questions SET option_a_text = '大 贵 了', option_b_text = '不 好吃', option_c_text = '已经 好 了' WHERE order_number = 21;
UPDATE hsk2_questions SET option_a_text = '找 人', option_b_text = '洗 衣服', option_c_text = '看 电视' WHERE order_number = 22;
UPDATE hsk2_questions SET option_a_text = '阴', option_b_text = '晴', option_c_text = '下 雨' WHERE order_number = 23;
UPDATE hsk2_questions SET option_a_text = '学生', option_b_text = '妈妈', option_c_text = '男朋友' WHERE order_number = 24;
UPDATE hsk2_questions SET option_a_text = '做 饭', option_b_text = '买 东西', option_c_text = '去 医院' WHERE order_number = 25;
UPDATE hsk2_questions SET option_a_text = '很 高', option_b_text = '很 忙', option_c_text = '很 远' WHERE order_number = 26;
UPDATE hsk2_questions SET option_a_text = '星期六', option_b_text = '明天', option_c_text = '今天' WHERE order_number = 27;
UPDATE hsk2_questions SET option_a_text = '在 家', option_b_text = '在 学校', option_c_text = '在 公司' WHERE order_number = 28;
UPDATE hsk2_questions SET option_a_text = '喝 咖啡', option_b_text = '喝 茶', option_c_text = '喝 水' WHERE order_number = 29;
UPDATE hsk2_questions SET option_a_text = '八 点', option_b_text = '九 点', option_c_text = '十 点' WHERE order_number = 30;

-- ===== VERIFY DỮ LIỆU SAU KHI UPDATE =====
SELECT 
    order_number, 
    correct_answer,
    option_a_text,
    option_b_text,
    option_c_text,
    LEFT(passage_text, 50) as passage_preview
FROM hsk2_questions 
WHERE section = 'comprehension'
ORDER BY order_number;

-- ===== UPDATE NHIỀU ĐÁP ÁN CÙNG LÚC =====
-- Nếu muốn update nhanh tất cả comprehension questions:
/*
UPDATE hsk2_questions 
SET correct_answer = CASE order_number
    WHEN 21 THEN 'A'
    WHEN 22 THEN 'B'
    WHEN 23 THEN 'C'
    WHEN 24 THEN 'A'
    WHEN 25 THEN 'B'
    WHEN 26 THEN 'C'
    WHEN 27 THEN 'A'
    WHEN 28 THEN 'B'
    WHEN 29 THEN 'C'
    WHEN 30 THEN 'A'
END
WHERE order_number BETWEEN 21 AND 30;
*/

-- ===== LƯU Ý QUAN TRỌNG =====
-- 1. Comprehension questions (21-30): Đáp án chỉ là 'A', 'B', hoặc 'C'
-- 2. Tất cả 10 câu dùng chung 1 đoạn văn (passage_text)
-- 3. Đảm bảo đoạn văn có đủ thông tin để trả lời 10 câu hỏi
-- 4. Sau khi update, test lại trên website để đảm bảo hiển thị đúng
-- 5. Website sẽ tự động hiển thị đoạn văn ở trên và 10 câu hỏi ở dưới
-- 6. Mỗi câu hỏi sẽ có số thứ tự (21-30) và 3 nút A, B, C nằm cùng hàng

-- ===== HƯỚNG DẪN SỬ DỤNG =====
-- 1. Mở Supabase SQL Editor
-- 2. Copy câu lệnh UPDATE passage_text ở trên
-- 3. Thay thế nội dung đoạn văn bằng nội dung thật
-- 4. Run để update
-- 5. Copy và chạy các câu UPDATE correct_answer để set đáp án đúng
-- 6. Chạy query VERIFY để kiểm tra

