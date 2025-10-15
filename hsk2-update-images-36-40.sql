-- ===== CẬP NHẬT IMAGE URLs CHO PHẦN 5 (Câu 36-40) =====
-- Chạy file này SAU KHI đã upload 6 images (A-F) lên Supabase Storage

-- Thay 'YOUR_PROJECT_REF' bằng project reference thực tế của bạn
-- Format: https://[PROJECT_REF].supabase.co/storage/v1/object/public/images/[FILE]

-- ===== CẬP NHẬT 6 IMAGES CHO TẤT CẢ CÂU 36-40 =====
-- Tất cả 5 câu dùng chung 6 hình ảnh này

UPDATE hsk2_questions 
SET 
    image_a_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_img_A.jpg',
    image_b_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_img_B.jpg',
    image_c_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_img_C.jpg',
    image_d_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_img_D.jpg',
    image_e_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_img_E.jpg',
    image_f_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/images/hsk2_img_F.jpg'
WHERE order_number BETWEEN 36 AND 40;

-- ===== VERIFY =====
SELECT order_number, section, correct_answer, 
       image_a_url, image_b_url, image_c_url, 
       image_d_url, image_e_url, image_f_url
FROM hsk2_questions 
WHERE order_number BETWEEN 36 AND 40
ORDER BY order_number;

-- ===== HƯỚNG DẪN UPLOAD IMAGES =====
/*
📌 CẦN UPLOAD 6 IMAGES VÀO SUPABASE STORAGE:

1. Đi tới Supabase Dashboard → Storage → images bucket
2. Upload 6 files:
   - hsk2_img_A.jpg (Ảnh A - tương ứng với câu có đáp án A)
   - hsk2_img_B.jpg (Ảnh B - nằm trên giường đọc sách)
   - hsk2_img_C.jpg (Ảnh C - nhà hàng, phục vụ)
   - hsk2_img_D.jpg (Ảnh D - chơi bóng rổ)
   - hsk2_img_E.jpg (Ảnh E - hai người nói chuyện văn phòng)
   - hsk2_img_F.jpg (Ảnh F - nhảy múa)

3. Sau khi upload xong, copy URL của mỗi image
4. Thay 'YOUR_PROJECT_REF' ở trên bằng project reference thực tế
5. Chạy câu lệnh UPDATE ở trên

📌 MAPPING CÂU HỎI - ĐÁP ÁN:
- Câu 36: "打篮球" → D (Basketball)
- Câu 37: "看书对眼睛不好" → B (Reading in bed)
- Câu 38: "服务员" → C (Restaurant/Waiter)
- Câu 39: "爱跳舞" → F (Dancing)
- Câu 40: "学校见" → E (Meeting at school)
*/

