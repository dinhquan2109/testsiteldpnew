-- =====================================================
-- UPDATE test_results TABLE - Change score to NUMERIC
-- =====================================================
-- Mục đích: Thay đổi column 'score' từ INTEGER sang NUMERIC(5,2)
-- để hỗ trợ điểm số thập phân cho HSK2 (ví dụ: 185.71/200)
--
-- Lưu ý: Migration này là OPTIONAL vì code đã được cập nhật
-- để làm tròn điểm thành số nguyên trước khi lưu vào database.
-- =====================================================

-- Kiểm tra column hiện tại
SELECT 
    column_name, 
    data_type, 
    numeric_precision, 
    numeric_scale
FROM information_schema.columns
WHERE table_name = 'test_results' 
AND column_name = 'score';

-- Backup dữ liệu hiện có (nếu có)
-- CREATE TABLE test_results_backup AS 
-- SELECT * FROM test_results;

-- Thay đổi column type từ INTEGER sang NUMERIC(5,2)
-- NUMERIC(5,2) = 5 chữ số tổng cộng, 2 chữ số thập phân
-- Ví dụ: 199.99 (max), 185.71, 44.57
ALTER TABLE test_results 
ALTER COLUMN score TYPE NUMERIC(5,2);

-- Kiểm tra lại sau khi thay đổi
SELECT 
    column_name, 
    data_type, 
    numeric_precision, 
    numeric_scale
FROM information_schema.columns
WHERE table_name = 'test_results' 
AND column_name = 'score';

-- Test insert với decimal values
-- INSERT INTO test_results (placement_id, answers, score, selected_level, completed_at)
-- VALUES (123, '{"1":"A","2":"B"}'::jsonb, 185.71, '2', NOW());

-- Rollback (nếu cần)
-- ALTER TABLE test_results 
-- ALTER COLUMN score TYPE INTEGER USING score::INTEGER;

