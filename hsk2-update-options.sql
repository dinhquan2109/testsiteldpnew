-- ===== FILE SQL CẬP NHẬT TEXT ĐÁP ÁN A/B/C =====
-- Sử dụng file này để update text cho các đáp án A, B, C của comprehension section

-- ===== CẬP NHẬT TEXT ĐÁP ÁN CHO TỪNG CÂU (21-30) =====
-- Mỗi câu có 3 đáp án: option_a_text, option_b_text, option_c_text

-- Câu 21
UPDATE hsk2_questions SET 
    option_a_text = '大 贵 了',
    option_b_text = '不 好吃',
    option_c_text = '已经 好 了'
WHERE order_number = 21;

-- Câu 22
UPDATE hsk2_questions SET 
    option_a_text = '找 人',
    option_b_text = '洗 衣服',
    option_c_text = '看 电视'
WHERE order_number = 22;

-- Câu 23
UPDATE hsk2_questions SET 
    option_a_text = '阴',
    option_b_text = '晴',
    option_c_text = '下 雨'
WHERE order_number = 23;

-- Câu 24
UPDATE hsk2_questions SET 
    option_a_text = '学生',
    option_b_text = '妈妈',
    option_c_text = '男朋友'
WHERE order_number = 24;

-- Câu 25
UPDATE hsk2_questions SET 
    option_a_text = '做 饭',
    option_b_text = '买 东西',
    option_c_text = '去 医院'
WHERE order_number = 25;

-- Câu 26
UPDATE hsk2_questions SET 
    option_a_text = '很 高',
    option_b_text = '很 忙',
    option_c_text = '很 远'
WHERE order_number = 26;

-- Câu 27
UPDATE hsk2_questions SET 
    option_a_text = '星期六',
    option_b_text = '明天',
    option_c_text = '今天'
WHERE order_number = 27;

-- Câu 28
UPDATE hsk2_questions SET 
    option_a_text = '在 家',
    option_b_text = '在 学校',
    option_c_text = '在 公司'
WHERE order_number = 28;

-- Câu 29
UPDATE hsk2_questions SET 
    option_a_text = '喝 咖啡',
    option_b_text = '喝 茶',
    option_c_text = '喝 水'
WHERE order_number = 29;

-- Câu 30
UPDATE hsk2_questions SET 
    option_a_text = '八 点',
    option_b_text = '九 点',
    option_c_text = '十 点'
WHERE order_number = 30;

-- ===== VERIFY DỮ LIỆU SAU KHI UPDATE =====
SELECT 
    order_number, 
    correct_answer,
    option_a_text,
    option_b_text,
    option_c_text
FROM hsk2_questions 
WHERE section = 'comprehension'
ORDER BY order_number;

-- ===== LƯU Ý QUAN TRỌNG =====
-- 1. Text đáp án nên là tiếng Trung (có thể có khoảng trắng giữa các chữ)
-- 2. Có thể thêm pinyin nếu cần (dùng tag HTML trong text)
-- 3. Sau khi update, test lại trên website để đảm bảo hiển thị đúng
-- 4. Text sẽ hiển thị bên cạnh nút A/B/C

-- ===== VÍ DỤ UPDATE NÂNG CAO (với pinyin) =====
/*
UPDATE hsk2_questions SET 
    option_a_text = '<span style="font-size: 12px; color: #999;">tài guì le</span><br>大 贵 了',
    option_b_text = '<span style="font-size: 12px; color: #999;">bù hǎochī</span><br>不 好吃',
    option_c_text = '<span style="font-size: 12px; color: #999;">yǐjing hǎo le</span><br>已经 好 了'
WHERE order_number = 21;
*/

