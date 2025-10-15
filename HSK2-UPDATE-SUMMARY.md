# HSK2 Update Summary

## ✅ Những gì đã hoàn thành

### 1. **File SQL cấu hình Supabase** (`hsk2-questions-setup.sql`)
- ✅ Script SQL để insert 16 câu hỏi HSK2 vào Supabase
- ✅ Questions 1-10: Listening (true/false với audio + image)
- ✅ Questions 11-15: Reading (chọn A-F matching với images)
- ✅ Question 16: Writing (essay - không tính điểm)
- ✅ Hướng dẫn upload audio và images vào Supabase Storage

**Cách sử dụng:**
```sql
-- 1. Mở Supabase SQL Editor
-- 2. Copy toàn bộ nội dung file hsk2-questions-setup.sql
-- 3. Paste và Run
-- 4. Upload audio/images vào Storage
-- 5. Update URL trong database
```

---

### 2. **File JavaScript mới** (`assets/js/hsk2-standalone.js`)

#### ✅ **Tính năng đã thêm:**

**a) Load questions từ Supabase**
```javascript
const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('level', 'HSK2')
    .order('order_number');
```

**b) Audio player với Supabase URL**
- Phát audio từ `audio_url` trong database
- Giới hạn 2 lần nghe
- Progress bar và time display
- Play/Pause controls

**c) Progress circles clickable**
- ✅ Click vào số 1-20 để nhảy đến câu đó
- ✅ Smooth scroll với highlight effect
- ✅ Màu xanh khi đã trả lời
- ✅ Hover effect

**d) Hiển thị tất cả 20 câu trên 1 page**
- Section 1: Listening (câu 1-10) - True/False buttons
- Section 2: Reading (câu 11-15) - Text input (A-F)
- Auto-update progress circles khi trả lời

**e) Chấm điểm và lưu Supabase**
```javascript
// Mỗi câu đúng = 2 điểm
// Listening: 10 câu × 2 = 20 điểm
// Reading: 5 câu × 2 = 10 điểm
// Tổng: 30 điểm
```

**f) Result page giống HSK1**
- Logo ALOHA
- Icon tích với gradient cam/đỏ
- Không hiển thị điểm số
- Chỉ thông báo: "Chúc mừng" + "Sẽ liên hệ kết quả"
- Màu sắc ấm áp (#FF6B6B, #FF8E53)

---

### 3. **File HTML cập nhật** (`pages/hsk2.html`)

#### ✅ **Thay đổi:**

**a) CSS mới**
```css
.circle {
    cursor: pointer;
    transition: all 0.3s ease;
}

.circle:hover {
    transform: scale(1.1);
}

.circle.answered {
    background: #4CAF50;
    color: white;
}

.tf-option {
    /* True/False buttons styling */
}
```

**b) Result page template mới**
- Logo ở đầu
- Success icon gradient cam
- Thông báo card với gradient nền cam nhạt
- Button gradient cam
- Animation fade-in

**c) Load hsk2-standalone.js**
```html
<script src="../assets/js/hsk2-standalone.js"></script>
```

---

## 📋 Cấu trúc HSK2 Test

### **Questions Layout:**
```
┌─────────────────────────────────────────┐
│  🎧 PHẦN 1: NGHE (Questions 1-10)     │
│                                         │
│  Audio Player (max 2 plays)            │
│  ┌───────────────────────────────┐     │
│  │ Q1: [Image]                   │     │
│  │     [✓ Đúng]  [✗ Sai]        │     │
│  └───────────────────────────────┘     │
│  ... (Q2-Q10 tương tự)                 │
├─────────────────────────────────────────┤
│  📖 PHẦN 2: ĐỌC (Questions 11-15)     │
│                                         │
│  [6 Images: A B C D E F]               │
│  ┌───────────────────────────────┐     │
│  │ Q11: Chọn hình [____]         │     │
│  │ Q12: Chọn hình [____]         │     │
│  │ ... (Q13-Q15)                 │     │
│  └───────────────────────────────┘     │
└─────────────────────────────────────────┘

Progress Circles (top):
[1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
[11][12][13][14][15][16][17][18][19][20]
^ Green when answered
^ Clickable to jump to question
```

---

## 🗄️ Supabase Schema

### **Table: questions**
```sql
- id: SERIAL PRIMARY KEY
- order_number: INTEGER (1-16 for HSK2)
- level: VARCHAR(10) ('HSK2')
- section: VARCHAR(50) ('listening', 'reading', 'writing')
- question_text: TEXT
- correct_answer: TEXT ('true'/'false' or 'A'/'B'/'C'/'D'/'E'/'F')
- audio_url: TEXT (for listening questions)
- image_url: TEXT (for listening questions)
- question_type: VARCHAR(50) ('true_false', 'image_matching', 'essay')
```

### **Table: test_results**
```sql
- id: SERIAL PRIMARY KEY
- placement_id: INTEGER (FK to placement table)
- answers: JSONB (user answers)
- score: INTEGER (0-30)
- selected_level: VARCHAR(10) ('2')
- completed_at: TIMESTAMP
```

---

## 🎯 Scoring Logic

### **HSK2 Scoring:**
- **Listening (Q1-10):** 10 câu × 2 điểm = 20 điểm
- **Reading (Q11-15):** 5 câu × 2 điểm = 10 điểm
- **Writing (Q16):** Không tính điểm (chỉ lưu vào database)
- **Tổng:** 30 điểm

### **Compare Logic:**
```javascript
// True/False (listening)
if (userAnswer === q.correct_answer) {
    score += 2;
}

// A-F (reading)
if (userAnswer.toUpperCase() === q.correct_answer.toUpperCase()) {
    score += 2;
}
```

---

## 📝 TODO - Những việc cần làm tiếp

### **1. Upload Media Files**
- [ ] Upload 10 audio files: `hsk2_q1.mp3` → `hsk2_q10.mp3`
- [ ] Upload 10 listening images: `hsk2_q1.jpg` → `hsk2_q10.jpg`
- [ ] Upload 6 reading images: `hsk2_reading_A.jpg` → `hsk2_reading_F.jpg`
- [ ] Create Supabase Storage buckets: `audio`, `images`
- [ ] Set buckets to public access

### **2. Update SQL với URL thực**
```sql
-- Thay thế:
'https://your-storage-url.com/audio/hsk2_q1.mp3'
-- Bằng:
'https://[project-ref].supabase.co/storage/v1/object/public/audio/hsk2_q1.mp3'
```

### **3. Test End-to-End**
- [ ] Test load questions từ Supabase
- [ ] Test audio playback (2 lần)
- [ ] Test click progress circles để jump
- [ ] Test update circles màu xanh khi trả lời
- [ ] Test submit và lưu vào Supabase
- [ ] Test result page display

### **4. Áp dụng cho HSK3/4/5**
- [ ] Copy template này cho HSK3
- [ ] Copy template này cho HSK4  
- [ ] Copy template này cho HSK5
- Chỉ cần thay đổi:
  - Level name: 'HSK3', 'HSK4', 'HSK5'
  - Số câu hỏi tương ứng
  - Range trong SQL và JS

---

## 🚀 Quick Start Guide

### **1. Setup Supabase**
```bash
# 1. Chạy SQL script
# Copy nội dung hsk2-questions-setup.sql vào Supabase SQL Editor

# 2. Upload files vào Storage
# - Tạo bucket 'audio' (public)
# - Tạo bucket 'images' (public)
# - Upload files

# 3. Copy URL và update database
```

### **2. Test Local**
```bash
# 1. Mở pages/hsk2.html trong browser
# 2. Check console logs
# 3. Test từng tính năng:
#    - Load questions
#    - Audio player
#    - Progress circles
#    - Answer saving
#    - Submit test
```

### **3. Deploy**
```bash
# Deploy lên Vercel/Netlify như bình thường
# Đảm bảo Supabase URL và KEY đã correct
```

---

## ⚠️ Known Issues & Solutions

### **Issue 1: Audio không phát**
**Solution:** 
- Check audio_url trong database có đúng không
- Check CORS settings của Supabase Storage
- Set bucket to public

### **Issue 2: Progress circles không update màu**
**Solution:**
- Check class `answered` có được add vào DOM không
- Check CSS `.circle.answered { background: #4CAF50; }`

### **Issue 3: Click circle không jump đến câu**
**Solution:**
- Check `id="question-0"` có đúng format không
- Check `scrollIntoView` có hoạt động không

---

## 📚 References

- **HSK1 Implementation:** `pages/hsk1.html`, `assets/js/hsk1-standalone.js`
- **Supabase Docs:** https://supabase.com/docs
- **Original HSK2 Logic:** `assets/js/hsk2-test-new.js` (tham khảo)

