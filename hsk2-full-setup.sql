-- ===== FILE SQL SETUP HOÀN CHỈNH CHO HSK2 =====
-- Sử dụng file này để tạo bảng hsk2_questions từ đầu

-- ===== BƯỚC 1: XÓA BẢNG CŨ (NẾU CÓ) =====
DROP TABLE IF EXISTS hsk2_questions CASCADE;

-- ===== BƯỚC 2: TẠO BẢNG MỚI =====
CREATE TABLE hsk2_questions (
    id SERIAL PRIMARY KEY,
    order_number INTEGER NOT NULL,
    section VARCHAR(50),
    question_text TEXT,
    correct_answer TEXT,
    audio_url TEXT,
    image_url TEXT,
    passage_text TEXT,
    option_a_text TEXT,
    option_b_text TEXT,
    option_c_text TEXT,
    image_a_url TEXT,
    image_b_url TEXT,
    image_c_url TEXT,
    image_d_url TEXT,
    image_e_url TEXT,
    image_f_url TEXT,
    word_a TEXT,
    word_b TEXT,
    word_c TEXT,
    word_d TEXT,
    word_e TEXT,
    word_f TEXT,
    answer_text TEXT,
    question_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===== BƯỚC 3: BẬT ROW LEVEL SECURITY =====
ALTER TABLE hsk2_questions ENABLE ROW LEVEL SECURITY;

-- ===== BƯỚC 4: TẠO POLICY CHO PUBLIC READ =====
DROP POLICY IF EXISTS "Allow public read access" ON hsk2_questions;
CREATE POLICY "Allow public read access" ON hsk2_questions
    FOR SELECT
    USING (true);

-- ===== BƯỚC 5: INSERT DỮ LIỆU =====

-- PHẦN 1: NGHE (Questions 1-10) - True/False với audio và hình ảnh
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

-- PHẦN 2: ĐỌC (Questions 11-20) - Kéo thả hình ảnh
-- Mỗi câu hỏi tương ứng với 1 chữ cái từ A đến J
-- Lưu ý: image_url ở đây là URL của ảnh A, B, C... để hiển thị trong grid kéo thả
INSERT INTO hsk2_questions (order_number, section, question_text, correct_answer, image_url, question_type) VALUES
(11, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'A', 'https://your-storage-url.com/images/hsk2_reading_A.jpg', 'image_matching'),
(12, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'B', 'https://your-storage-url.com/images/hsk2_reading_B.jpg', 'image_matching'),
(13, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'C', 'https://your-storage-url.com/images/hsk2_reading_C.jpg', 'image_matching'),
(14, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'D', 'https://your-storage-url.com/images/hsk2_reading_D.jpg', 'image_matching'),
(15, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'E', 'https://your-storage-url.com/images/hsk2_reading_E.jpg', 'image_matching'),
(16, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'F', 'https://your-storage-url.com/images/hsk2_reading_F.jpg', 'image_matching'),
(17, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'G', 'https://your-storage-url.com/images/hsk2_reading_G.jpg', 'image_matching'),
(18, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'H', 'https://your-storage-url.com/images/hsk2_reading_H.jpg', 'image_matching'),
(19, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'I', 'https://your-storage-url.com/images/hsk2_reading_I.jpg', 'image_matching'),
(20, 'reading', 'Kéo hình ảnh phù hợp vào ô trống', 'J', 'https://your-storage-url.com/images/hsk2_reading_J.jpg', 'image_matching');

-- PHẦN 3: ĐỌC HIỂU (Questions 21-30) - Đoạn văn + Multiple Choice A/B/C
-- Tất cả 10 câu dùng chung 1 đoạn văn
-- Mỗi câu có text cho 3 đáp án A, B, C
INSERT INTO hsk2_questions (order_number, section, correct_answer, option_a_text, option_b_text, option_c_text, passage_text, question_type) VALUES
(21, 'comprehension', 'A', '大 贵 了', '不 好吃', '已经 好 了', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(22, 'comprehension', 'B', '找 人', '洗 衣服', '看 电视', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(23, 'comprehension', 'C', '阴', '晴', '下 雨', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(24, 'comprehension', 'A', '学生', '妈妈', '男朋友', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(25, 'comprehension', 'B', '做 饭', '买 东西', '去 医院', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(26, 'comprehension', 'C', '很 高', '很 忙', '很 远', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(27, 'comprehension', 'A', '星期六', '明天', '今天', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(28, 'comprehension', 'B', '在 家', '在 学校', '在 公司', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(29, 'comprehension', 'C', '喝 咖啡', '喝 茶', '喝 水', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(30, 'comprehension', 'A', '八 点', '九 点', '十 点', 'Đây là đoạn văn mẫu cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này nên dài khoảng 200-300 từ, phù hợp với trình độ HSK2. Nội dung có thể về cuộc sống hàng ngày, văn hóa Trung Quốc, hoặc các chủ đề quen thuộc.

Sau khi đọc đoạn văn này, học viên sẽ trả lời 10 câu hỏi (21-30) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice');

-- PHẦN 4: ĐỌC HIỂU - PHẦN 2 (Questions 31-35) - Đoạn văn khác + Multiple Choice A/B/C
-- 5 câu dùng chung 1 đoạn văn mới
INSERT INTO hsk2_questions (order_number, section, correct_answer, option_a_text, option_b_text, option_c_text, passage_text, question_type) VALUES
(31, 'comprehension', 'B', '去 公园', '去 商店', '去 学校', 'Đây là đoạn văn thứ 2 cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này cũng nên dài khoảng 150-200 từ, phù hợp với trình độ HSK2. 

Sau khi đọc đoạn văn này, học viên sẽ trả lời 5 câu hỏi (31-35) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(32, 'comprehension', 'C', '昨天', '前天', '上个月', 'Đây là đoạn văn thứ 2 cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này cũng nên dài khoảng 150-200 từ, phù hợp với trình độ HSK2. 

Sau khi đọc đoạn văn này, học viên sẽ trả lời 5 câu hỏi (31-35) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(33, 'comprehension', 'A', '爸爸 妈妈', '老师 同学', '朋友', 'Đây là đoạn văn thứ 2 cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này cũng nên dài khoảng 150-200 từ, phù hợp với trình độ HSK2. 

Sau khi đọc đoạn văn này, học viên sẽ trả lời 5 câu hỏi (31-35) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(34, 'comprehension', 'B', '很 热', '很 冷', '很 舒服', 'Đây là đoạn văn thứ 2 cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này cũng nên dài khoảng 150-200 từ, phù hợp với trình độ HSK2. 

Sau khi đọc đoạn văn này, học viên sẽ trả lời 5 câu hỏi (31-35) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice'),
(35, 'comprehension', 'C', '不 喜欢', '不 知道', '很 喜欢', 'Đây là đoạn văn thứ 2 cho phần đọc hiểu. Bạn cần thay thế đoạn văn này bằng nội dung thật từ đề thi HSK2.

Đoạn văn này cũng nên dài khoảng 150-200 từ, phù hợp với trình độ HSK2. 

Sau khi đọc đoạn văn này, học viên sẽ trả lời 5 câu hỏi (31-35) bằng cách chọn đáp án A, B hoặc C cho mỗi câu.', 'multiple_choice');

-- PHẦN 5: GHÉP HÌNH ẢNH (Questions 36-40) - 6 images + 5 questions
-- Tất cả các câu dùng chung 6 hình ảnh A-F
INSERT INTO hsk2_questions (order_number, section, question_text, correct_answer, image_a_url, image_b_url, image_c_url, image_d_url, image_e_url, image_f_url, question_type) VALUES
(36, 'image_matching', 'Mỗi ge xīngqīliù, wǒ dōu qù dǎ lánqiú.', 'D', 
    'https://your-storage-url.com/images/hsk2_img_A.jpg',
    'https://your-storage-url.com/images/hsk2_img_B.jpg',
    'https://your-storage-url.com/images/hsk2_img_C.jpg',
    'https://your-storage-url.com/images/hsk2_img_D.jpg',
    'https://your-storage-url.com/images/hsk2_img_E.jpg',
    'https://your-storage-url.com/images/hsk2_img_F.jpg',
    'input_matching'),
(37, 'image_matching', 'Zhèyàng kàn shū duì yǎnjīng bù hǎo.', 'B',
    'https://your-storage-url.com/images/hsk2_img_A.jpg',
    'https://your-storage-url.com/images/hsk2_img_B.jpg',
    'https://your-storage-url.com/images/hsk2_img_C.jpg',
    'https://your-storage-url.com/images/hsk2_img_D.jpg',
    'https://your-storage-url.com/images/hsk2_img_E.jpg',
    'https://your-storage-url.com/images/hsk2_img_F.jpg',
    'input_matching'),
(38, 'image_matching', 'Fúwùyuán, nǐmen zhèr yǒu shénme hǎochī de cài?', 'C',
    'https://your-storage-url.com/images/hsk2_img_A.jpg',
    'https://your-storage-url.com/images/hsk2_img_B.jpg',
    'https://your-storage-url.com/images/hsk2_img_C.jpg',
    'https://your-storage-url.com/images/hsk2_img_D.jpg',
    'https://your-storage-url.com/images/hsk2_img_E.jpg',
    'https://your-storage-url.com/images/hsk2_img_F.jpg',
    'input_matching'),
(39, 'image_matching', 'Nǐ yě ài tiàowǔ? Tài hǎo le.', 'F',
    'https://your-storage-url.com/images/hsk2_img_A.jpg',
    'https://your-storage-url.com/images/hsk2_img_B.jpg',
    'https://your-storage-url.com/images/hsk2_img_C.jpg',
    'https://your-storage-url.com/images/hsk2_img_D.jpg',
    'https://your-storage-url.com/images/hsk2_img_E.jpg',
    'https://your-storage-url.com/images/hsk2_img_F.jpg',
    'input_matching'),
(40, 'image_matching', 'Míngtiān shàngwǔ xuéxiào jiàn, zàijiàn.', 'E',
    'https://your-storage-url.com/images/hsk2_img_A.jpg',
    'https://your-storage-url.com/images/hsk2_img_B.jpg',
    'https://your-storage-url.com/images/hsk2_img_C.jpg',
    'https://your-storage-url.com/images/hsk2_img_D.jpg',
    'https://your-storage-url.com/images/hsk2_img_E.jpg',
    'https://your-storage-url.com/images/hsk2_img_F.jpg',
    'input_matching');

-- PHẦN 6: ĐIỀN TỪ VÀO CHỖ TRỐNG (Questions 41-45) - 6 words + 5 fill-in-blank questions
-- Tất cả 5 câu dùng chung 6 từ A-F
INSERT INTO hsk2_questions (order_number, section, question_text, correct_answer, word_a, word_b, word_c, word_d, word_e, word_f, question_type) VALUES
(41, 'word_matching', 'Háizi zuòcuòle shìqing, nǐ yào ràng tā cuò zài nǎr le (___)。', 'B',
    '大家', '知道', '手机', '旁边', '贵', '离',
    'fill_blank'),
(42, 'word_matching', 'Tā jiā (___) gōngsī hěn jìn, měi tiān zhōngwǔ dōu huí jiā chī fàn。', 'F',
    '大家', '知道', '手机', '旁边', '贵', '离',
    'fill_blank'),
(43, 'word_matching', 'Wǒ zhù fángjiān, jiù zài nǐ (___) 345。', 'D',
    '大家', '知道', '手机', '旁边', '贵', '离',
    'fill_blank'),
(44, 'word_matching', 'Tā de huíf hěn yǒu yìsi, (___) dōu xiào le。', 'A',
    '大家', '知道', '手机', '旁边', '贵', '离',
    'fill_blank'),
(45, 'word_matching', 'Nǚ: Zhège (___) hǎi yǒu shénme yánsè de? Nán: Hái yǒu hóngsè hé hēisè de。', 'C',
    '大家', '知道', '手机', '旁边', '贵', '离',
    'fill_blank');

-- PHẦN 7: ĐÁNH GIÁ CÂU TRẢ LỜI (Questions 46-50) - Question + Answer, judge true/false
INSERT INTO hsk2_questions (order_number, section, question_text, answer_text, correct_answer, question_type) VALUES
(46, 'qa_judgment', 
    'Wǒ xiànzài zài chūzūchē shang, hěn kuài jiù dào huǒchēzhàn le. Nǐ zhǎo wǒ shénme shì?',
    'Tā yǐjīng dào huǒchēzhàn le.',
    'false',
    'qa_judgment'),
(47, 'qa_judgment',
    'Yī nián yǒu tiān, měi tiān dōu huì yǒu gāoxìng de shì, měi tiān zhǎo yīdiǎn kuàilè.',
    'Kuàilè jīu zài wǒmen shēnbiān.',
    'true',
    'qa_judgment'),
(48, 'qa_judgment',
    'Wǒ huì tiàowǔ, dàn tiào de bù zěnmeyàng.',
    'Wǒ tiào de hěn hǎo.',
    'false',
    'qa_judgment'),
(49, 'qa_judgment',
    'Tāmen yǐjīng dào le, tāmen zài nǎr le.',
    'Tāmen hái méi dào.',
    'false',
    'qa_judgment'),
(50, 'qa_judgment',
    'Xiànzài shì diǎn fēn, tāmen yǐjīng yóule fēnzhōng le.',
    'Tāmen diǎn fēn kāishǐ yóuyǒng.',
    'true',
    'qa_judgment');

-- ===== BƯỚC 6: VERIFY DỮ LIỆU =====
-- Kiểm tra xem dữ liệu đã được insert đúng chưa
SELECT order_number, section, correct_answer, question_type 
FROM hsk2_questions 
ORDER BY order_number;

-- ===== THÔNG TIN QUAN TRỌNG =====
/*
📌 CẤU TRÚC BẢNG:
- Tổng cộng: 50 câu hỏi
- Câu 1-10: Listening (True/False) - Có audio_url và image_url
- Câu 11-20: Reading (Image Matching) - Kéo thả từ A đến J
- Câu 21-30: Comprehension Part 1 (Multiple Choice A/B/C) - Đoạn văn 1
- Câu 31-35: Comprehension Part 2 (Multiple Choice A/B/C) - Đoạn văn 2
- Câu 36-40: Image Matching (Input A-F) - 6 hình ảnh + điền đáp án
- Câu 41-45: Word Matching (Drag-Drop A-F) - 6 từ + điền vào chỗ trống
- Câu 46-50: Q&A Judgment (True/False) - Câu hỏi + Câu trả lời, đánh giá đúng/sai

📌 ĐÁP ÁN:
- Listening: 'true' hoặc 'false'
- Reading: 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'
- Comprehension: 'A', 'B', hoặc 'C'
- Image Matching: 'A', 'B', 'C', 'D', 'E', hoặc 'F'
- Word Matching: 'A', 'B', 'C', 'D', 'E', hoặc 'F'
- Q&A Judgment: 'true' hoặc 'false'

📌 SCORING:
- Mỗi câu: 2 điểm
- Tổng điểm: 100 điểm (50 câu x 2 điểm)

📌 SAU KHI CHẠY FILE NÀY:
1. Upload audio files vào Supabase Storage bucket 'audio' (10 files)
2. Upload image files listening vào bucket 'images' (10 files: hsk2_q1.jpg - hsk2_q10.jpg)
3. Upload image files reading vào bucket 'images' (10 files: hsk2_reading_A.jpg - hsk2_reading_J.jpg)
4. Upload image files matching vào bucket 'images' (6 files: hsk2_img_A.jpg - hsk2_img_F.jpg)
5. Chạy file 'hsk2-update-answers.sql' để update các URL thực tế
6. Update passage_text cho comprehension section với 2 đoạn văn thật (câu 21-30 và 31-35)
7. Test trên website

📌 6 TỪ VỰNG CHO PHẦN 6 (Câu 41-45):
A = 大家 (dàjiā)
B = 知道 (zhīdào)
C = 手机 (shǒujī)
D = 旁边 (pángbiān)
E = 贵 (guì)
F = 离 (lí)

📌 CẬP NHẬT URL:
Thay 'your-storage-url.com' bằng URL thực tế của Supabase Storage:
Format: https://[PROJECT_REF].supabase.co/storage/v1/object/public/[BUCKET]/[FILE]

Ví dụ:
- Audio: https://abcd1234.supabase.co/storage/v1/object/public/audio/hsk2_q1.mp3
- Image: https://abcd1234.supabase.co/storage/v1/object/public/images/hsk2_q1.jpg
*/

-- ===== KẾT THÚC =====
-- Bảng đã được tạo thành công!
-- Tổng số câu hỏi:
SELECT COUNT(*) as total_questions FROM hsk2_questions;

-- Phân bố theo section:
SELECT section, COUNT(*) as count FROM hsk2_questions GROUP BY section ORDER BY section;
