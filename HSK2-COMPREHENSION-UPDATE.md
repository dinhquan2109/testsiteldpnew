# HSK2 - Thêm Phần Đọc Hiểu (Comprehension) - Câu 21-30

## 📋 Tổng Quan Thay Đổi

Đã thêm **PHẦN 3: ĐỌC HIỂU** với 10 câu hỏi (21-30) vào bài thi HSK2.

### Cấu trúc bài thi HSK2 mới:
- **Câu 1-10**: Listening (True/False) - Nghe audio và chọn đúng/sai
- **Câu 11-20**: Reading (Image Matching) - Kéo thả đáp án A-J vào câu hỏi
- **Câu 21-30**: Comprehension (Multiple Choice A/B/C) - Đọc đoạn văn và chọn đáp án

### Tổng điểm:
- **30 câu × 2 điểm = 60 điểm**
- Mỗi câu: 2 điểm
- Không có câu thưởng

---

## 🎯 Đặc Điểm Phần Đọc Hiểu

### Layout:
```
┌─────────────────────────────────────────┐
│  📖 PHẦN 3: ĐỌC HIỂU                    │
│  Đọc đoạn văn và chọn đáp án đúng       │
├─────────────────────────────────────────┤
│                                         │
│  [Đoạn văn hiển thị ở đây]            │
│  Khoảng 200-300 từ tiếng Trung         │
│  Có border màu đỏ bên trái             │
│                                         │
├─────────────────────────────────────────┤
│  21. [A] [B] [C]                       │
│  22. [A] [B] [C]                       │
│  23. [A] [B] [C]                       │
│  ...                                    │
│  30. [A] [B] [C]                       │
└─────────────────────────────────────────┘
```

### Tính năng:
- ✅ **Đoạn văn chung**: Tất cả 10 câu dùng chung 1 đoạn văn
- ✅ **Layout 1 hàng**: Số thứ tự và 3 nút A/B/C nằm cùng 1 hàng
- ✅ **Không có text câu hỏi**: Chỉ hiển thị số thứ tự và đáp án
- ✅ **Hover effect**: Nút đáp án có hiệu ứng khi rê chuột
- ✅ **Selected state**: Đáp án đã chọn chuyển sang màu đỏ
- ✅ **Progress tracking**: Vòng tròn tiến độ chuyển xanh khi trả lời
- ✅ **Auto-save**: Đáp án tự động lưu vào localStorage
- ✅ **Click to jump**: Click vào vòng tròn để nhảy đến câu hỏi

---

## 📁 Files Đã Thay Đổi

### 1. `assets/js/hsk2-standalone.js`
**Thay đổi:**
- Thêm filter `comprehensionQuestions` trong `displayAllQuestions()`
- Thêm section render cho comprehension (21-30)
- Thêm event listener cho `.comprehension-option` buttons
- Logic tính điểm tự động hỗ trợ 30 câu

**Code mới:**
```javascript
const comprehensionQuestions = hsk2TestQuestions.filter(q => q.section === 'comprehension');

// Render comprehension section
if (comprehensionQuestions.length > 0) {
    const comprehensionStartIdx = listeningQuestions.length + readingQuestions.length;
    const passageText = comprehensionQuestions[0]?.passage_text || 'Đoạn văn...';
    
    html += `
        <div class="section-header">
            <div class="section-title">📖 PHẦN 3: ĐỌC HIỂU</div>
        </div>
        <div class="comprehension-section">
            <div class="passage-text">${passageText}</div>
            <div class="comprehension-questions">
                ${comprehensionQuestions.map((q, idx) => {
                    const globalIdx = comprehensionStartIdx + idx;
                    return `
                        <div class="comprehension-question-item">
                            <span class="question-number-inline">${globalIdx + 1}.</span>
                            <div class="comprehension-options">
                                ${['A', 'B', 'C'].map(letter => `
                                    <button class="comprehension-option" 
                                            data-question="${globalIdx}" 
                                            data-answer="${letter}">
                                        ${letter}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}
```

### 2. `pages/hsk2.html`
**Thay đổi:**
- Thêm CSS cho `.comprehension-section`, `.passage-text`, `.comprehension-question-item`, `.comprehension-option`
- Thêm progress-row thứ 3 với vòng tròn 21-30

**CSS mới:**
```css
.comprehension-section {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.passage-text {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 10px;
    border-left: 4px solid #FF6B6B;
    line-height: 1.8;
    white-space: pre-wrap;
}

.comprehension-question-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.comprehension-option {
    width: 60px;
    height: 50px;
    border: 2px solid #ddd;
    background: white;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
}

.comprehension-option.selected {
    background: #FF6B6B;
    color: white;
}
```

### 3. `hsk2-full-setup.sql`
**Thay đổi:**
- Thêm column `passage_text` vào bảng `hsk2_questions`
- Insert 10 câu mới (21-30) với section='comprehension'
- Mỗi câu có `passage_text` (đoạn văn chung) và `correct_answer` (A/B/C)

**SQL mới:**
```sql
CREATE TABLE hsk2_questions (
    id SERIAL PRIMARY KEY,
    order_number INTEGER NOT NULL,
    section VARCHAR(50),
    question_text TEXT,
    correct_answer TEXT,
    audio_url TEXT,
    image_url TEXT,
    passage_text TEXT,  -- ⬅️ Column mới
    question_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO hsk2_questions (order_number, section, correct_answer, passage_text, question_type) VALUES
(21, 'comprehension', 'A', 'Đoạn văn mẫu...', 'multiple_choice'),
(22, 'comprehension', 'B', 'Đoạn văn mẫu...', 'multiple_choice'),
...
(30, 'comprehension', 'A', 'Đoạn văn mẫu...', 'multiple_choice');
```

### 4. `hsk2-update-comprehension.sql` (File mới)
**Mục đích:** File SQL riêng để update đoạn văn và đáp án cho phần comprehension

**Nội dung:**
- Update `passage_text` cho tất cả câu 21-30
- Update `correct_answer` cho từng câu
- Query verify để kiểm tra

---

## 🚀 Hướng Dẫn Cài Đặt

### Bước 1: Xóa và tạo lại bảng
```sql
-- Mở Supabase SQL Editor
-- Copy toàn bộ nội dung file hsk2-full-setup.sql
-- Paste và Run
```

### Bước 2: Upload media files (nếu chưa có)
- Audio: 10 files (hsk2_q1.mp3 - hsk2_q10.mp3)
- Images Listening: 10 files (hsk2_q1.jpg - hsk2_q10.jpg)
- Images Reading: 10 files (hsk2_reading_A.jpg - hsk2_reading_J.jpg)

### Bước 3: Update URLs
```sql
-- Mở file hsk2-update-answers.sql
-- Thay YOUR_PROJECT_REF bằng project ref thực tế
-- Run để update tất cả URLs
```

### Bước 4: Update đoạn văn và đáp án
```sql
-- Mở file hsk2-update-comprehension.sql
-- Thay đoạn văn mẫu bằng nội dung thật
-- Update đáp án đúng cho từng câu (A/B/C)
-- Run
```

### Bước 5: Test
1. Mở trang HSK2 test
2. Kiểm tra 3 sections hiển thị đúng
3. Kiểm tra progress circles (1-30)
4. Test chọn đáp án cho phần comprehension
5. Test submit và tính điểm

---

## 📊 Database Schema

### Bảng `hsk2_questions` (đã update)
```
┌──────────────────┬────────────┬──────────────────────────────┐
│ Column           │ Type       │ Description                  │
├──────────────────┼────────────┼──────────────────────────────┤
│ id               │ SERIAL     │ Primary key                  │
│ order_number     │ INTEGER    │ Thứ tự câu hỏi (1-30)       │
│ section          │ VARCHAR    │ listening/reading/comprehension │
│ question_text    │ TEXT       │ Text câu hỏi (optional)     │
│ correct_answer   │ TEXT       │ Đáp án đúng                  │
│ audio_url        │ TEXT       │ URL audio (listening only)   │
│ image_url        │ TEXT       │ URL image (listening/reading)│
│ passage_text     │ TEXT       │ Đoạn văn (comprehension)     │ ⬅️ NEW
│ question_type    │ VARCHAR    │ Loại câu hỏi                 │
│ created_at       │ TIMESTAMP  │ Thời gian tạo                │
└──────────────────┴────────────┴──────────────────────────────┘
```

### Dữ liệu mẫu:
```sql
-- Listening (1-10)
section: 'listening'
correct_answer: 'true' or 'false'
audio_url: 'https://...hsk2_q1.mp3'
image_url: 'https://...hsk2_q1.jpg'

-- Reading (11-20)
section: 'reading'
correct_answer: 'A' to 'J'
image_url: 'https://...hsk2_reading_A.jpg'

-- Comprehension (21-30)  ⬅️ NEW
section: 'comprehension'
correct_answer: 'A', 'B', or 'C'
passage_text: 'Đoạn văn 200-300 từ...'
```

---

## ✅ Checklist Hoàn Thành

- [x] Thêm logic render comprehension section
- [x] Thêm event listener cho comprehension options
- [x] Thêm CSS cho layout mới
- [x] Update progress circles (21-30)
- [x] Update SQL schema với column `passage_text`
- [x] Tạo file SQL setup hoàn chỉnh (30 câu)
- [x] Tạo file SQL update riêng cho comprehension
- [x] Logic tính điểm tự động hỗ trợ 30 câu
- [x] Auto-save answers vào localStorage
- [x] Progress tracking cho 30 câu
- [x] Document đầy đủ trong file README

---

## 🔧 Troubleshooting

### Vấn đề 1: Không hiển thị phần comprehension
**Nguyên nhân:** Chưa có data trong database  
**Giải pháp:** Chạy lại file `hsk2-full-setup.sql`

### Vấn đề 2: Đoạn văn hiển thị bị lỗi format
**Nguyên nhân:** Đoạn văn có ký tự đặc biệt  
**Giải pháp:** Dùng `white-space: pre-wrap` trong CSS (đã có sẵn)

### Vấn đề 3: Progress circles không update
**Nguyên nhân:** Event listener chưa được attach  
**Giải pháp:** Check console log, refresh trang

### Vấn đề 4: Tính điểm sai
**Nguyên nhân:** Đáp án trong database không khớp với đáp án user chọn (phân biệt hoa/thường)  
**Giải pháp:** Code đã dùng `.toLowerCase()` để so sánh, đảm bảo đáp án trong DB viết hoa đúng (A/B/C)

---

## 📝 Notes

- Đoạn văn hiện tại là mẫu, cần thay bằng nội dung thật từ đề thi HSK2
- Đáp án đúng cần được set chính xác trong database
- Test kỹ trước khi deploy production
- Backup database trước khi chạy DROP TABLE

---

## 🎉 Kết Quả

✅ Bài thi HSK2 giờ có đầy đủ 30 câu hỏi  
✅ UI/UX đẹp, dễ sử dụng  
✅ Tự động lưu đáp án  
✅ Tính điểm chính xác  
✅ Responsive trên mobile  

**Tổng điểm tối đa: 60 điểm**

