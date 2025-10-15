# HSK2 - Chia Thành 2 Trang (Phần)

## 📋 Tổng Quan Thay Đổi

Bài thi HSK2 giờ được chia thành **2 phần riêng biệt**:

### 🎯 Phần 1 (Page 1): Câu 1-20
- **Listening (1-10)**: True/False với audio và hình ảnh
- **Reading (11-20)**: Kéo thả ảnh A-J vào câu hỏi
- **Nút**: "Tiếp tục →" (xuất hiện khi làm đủ 20 câu)

### 🎯 Phần 2 (Page 2): Câu 21-30
- **Comprehension (21-30)**: Đọc đoạn văn + chọn A/B/C
- **Nút**: "NỘP BÀI" (xuất hiện khi làm đủ 10 câu)

---

## 🔄 Luồng Hoạt Động

```
1. User bắt đầu bài thi
   ↓
2. Hiển thị PHẦN 1 (câu 1-20)
   - Progress circles: Hiển thị vòng tròn 1-20
   - Page info: "Phần 1/2 - Nghe & Đọc (Câu 1-20)"
   ↓
3. User làm đủ 20 câu
   ↓
4. Nút "Tiếp tục →" xuất hiện
   ↓
5. User click "Tiếp tục"
   ↓
6. Chuyển sang PHẦN 2 (câu 21-30)
   - Progress circles: Hiển thị vòng tròn 21-30
   - Page info: "Phần 2/2 - Đọc hiểu (Câu 21-30)"
   ↓
7. User làm đủ 10 câu
   ↓
8. Nút "NỘP BÀI" xuất hiện
   ↓
9. User click "NỘP BÀI"
   ↓
10. Submit và hiển thị kết quả
```

---

## 📝 Thay Đổi Code

### 1. `assets/js/hsk2-standalone.js`

#### Thêm biến global:
```javascript
let hsk2CurrentPage = 1; // Page 1: câu 1-20, Page 2: câu 21-30
```

#### Đổi tên function:
```javascript
// CŨ: displayAllQuestions()
// MỚI: displayCurrentPage()
```

#### Chia logic render theo page:
```javascript
function displayCurrentPage() {
    // PAGE 1: LISTENING + READING (1-20)
    if (hsk2CurrentPage === 1) {
        // Render listening section (1-10)
        // Render reading section (11-20)
    }
    
    // PAGE 2: COMPREHENSION (21-30)
    if (hsk2CurrentPage === 2) {
        // Render comprehension section (21-30)
    }
}
```

#### Cập nhật logic nút:
```javascript
function updateNavButtons() {
    if (hsk2CurrentPage === 1) {
        // Check if answered 20 questions (0-19)
        // Show "Tiếp tục →" button
    } else if (hsk2CurrentPage === 2) {
        // Check if answered 10 questions (20-29)
        // Show "NỘP BÀI" button
    }
}
```

#### Thêm event listener cho nút "Tiếp tục":
```javascript
document.addEventListener('click', function(e) {
    if (e.target.id === 'btnNextSection') {
        hsk2CurrentPage = 2;
        displayCurrentPage();
        updateProgressCircles();
        updateNavButtons();
        updatePageInfo();
        window.scrollTo(0, 0);
    }
    
    if (e.target.id === 'btnSubmit') {
        // Kiểm tra page 2 (10 câu comprehension)
        submitTest();
    }
});
```

#### Thêm function mới:
```javascript
function updatePageInfo() {
    if (hsk2CurrentPage === 1) {
        pageInfo.textContent = 'Phần 1/2 - Nghe & Đọc (Câu 1-20)';
        document.body.classList.remove('page-2');
    } else {
        pageInfo.textContent = 'Phần 2/2 - Đọc hiểu (Câu 21-30)';
        document.body.classList.add('page-2');
    }
}
```

### 2. `pages/hsk2.html`

#### Thêm `data-page` attribute:
```html
<div class="progress-circles" id="progressCircles">
    <div class="progress-row" data-page="1">
        <!-- Circles 1-10 -->
    </div>
    <div class="progress-row" data-page="1">
        <!-- Circles 11-20 -->
    </div>
    <div class="progress-row" data-page="2">
        <!-- Circles 21-30 -->
    </div>
</div>
```

#### Thêm CSS để ẩn/hiện progress rows:
```css
/* Hide progress rows based on current page */
.progress-row[data-page="2"] {
    display: none;
}

body.page-2 .progress-row[data-page="1"] {
    display: none;
}

body.page-2 .progress-row[data-page="2"] {
    display: flex;
}
```

---

## ✅ Tính Năng

### Đã hoàn thành:
- ✅ Chia thành 2 pages riêng biệt
- ✅ Progress circles tự động ẩn/hiện theo page
- ✅ Page info cập nhật theo page hiện tại
- ✅ Nút "Tiếp tục" chỉ xuất hiện khi làm đủ 20 câu page 1
- ✅ Nút "NỘP BÀI" chỉ xuất hiện khi làm đủ 10 câu page 2
- ✅ Chuyển page mượt mà, scroll về đầu trang
- ✅ Lưu đáp án tự động (localStorage)
- ✅ Tính điểm chính xác cho cả 30 câu

### Auto-hide/show:
- Page 1: Hiển thị vòng tròn 1-20, ẩn vòng tròn 21-30
- Page 2: Hiển thị vòng tròn 21-30, ẩn vòng tròn 1-20
- Audio section chỉ hiển thị ở page 1

---

## 🎨 UI/UX

### Page 1:
```
┌────────────────────────────────────────┐
│  Progress: ① ② ③ ... ⑳                │
│  Timer: 60:00                          │
│  Page Info: Phần 1/2 - Nghe & Đọc     │
├────────────────────────────────────────┤
│  🎧 PHẦN 1: NGHE (1-10)               │
│  [Audio Player]                        │
│  [True/False Questions]                │
├────────────────────────────────────────┤
│  🎧 Nghe và chọn đáp án (11-20)       │
│  [Drag & Drop Images A-J]              │
├────────────────────────────────────────┤
│              [Tiếp tục →]              │
└────────────────────────────────────────┘
```

### Page 2:
```
┌────────────────────────────────────────┐
│  Progress: ㉑ ㉒ ㉓ ... ㉚              │
│  Timer: 52:30                          │
│  Page Info: Phần 2/2 - Đọc hiểu       │
├────────────────────────────────────────┤
│  📖 PHẦN 3: ĐỌC HIỂU (21-30)          │
│  [Đoạn văn]                            │
│  21. [A] [B] [C]                       │
│  22. [A] [B] [C]                       │
│  ...                                    │
│  30. [A] [B] [C]                       │
├────────────────────────────────────────┤
│              [NỘP BÀI]                 │
└────────────────────────────────────────┘
```

---

## 🔍 Logic Chi Tiết

### Progress Tracking:
```javascript
// Page 1: Kiểm tra câu 0-19
const page1AnsweredCount = Object.keys(hsk2UserAnswers)
    .filter(key => parseInt(key) < 20).length;

// Page 2: Kiểm tra câu 20-29
const page2AnsweredCount = Object.keys(hsk2UserAnswers)
    .filter(key => parseInt(key) >= 20 && parseInt(key) < 30).length;
```

### Button Display Logic:
```javascript
// Page 1
if (page1AnsweredCount >= 20) {
    btnNext.style.display = 'block';
    btnNext.textContent = 'Tiếp tục →';
}

// Page 2
if (page2AnsweredCount >= 10) {
    btnSubmit.style.display = 'block';
}
```

### Page Transition:
```javascript
// When "Tiếp tục" is clicked:
1. Set hsk2CurrentPage = 2
2. Call displayCurrentPage() - re-render content
3. Call updateProgressCircles() - update circles
4. Call updateNavButtons() - update buttons
5. Call updatePageInfo() - update page info & body class
6. Scroll to top: window.scrollTo(0, 0)
```

---

## 🧪 Test Checklist

### Page 1:
- [ ] Hiển thị đúng 20 vòng tròn (1-20)
- [ ] Audio player hoạt động
- [ ] True/False buttons hoạt động
- [ ] Drag & drop images hoạt động
- [ ] Progress circles chuyển xanh khi trả lời
- [ ] Nút "Tiếp tục" xuất hiện khi làm đủ 20 câu
- [ ] Click vòng tròn jump đến câu hỏi
- [ ] Page info hiển thị "Phần 1/2"

### Page 2:
- [ ] Hiển thị đúng 10 vòng tròn (21-30)
- [ ] Đoạn văn hiển thị đúng
- [ ] 10 câu hỏi A/B/C hiển thị đúng
- [ ] Comprehension buttons hoạt động
- [ ] Progress circles chuyển xanh khi trả lời
- [ ] Nút "NỘP BÀI" xuất hiện khi làm đủ 10 câu
- [ ] Page info hiển thị "Phần 2/2"
- [ ] Body class "page-2" được thêm

### Transition:
- [ ] Click "Tiếp tục" chuyển sang page 2
- [ ] Scroll về đầu trang
- [ ] Đáp án page 1 được lưu
- [ ] Progress circles của page 1 ẩn đi
- [ ] Progress circles của page 2 hiện ra

### Submit:
- [ ] Tính điểm đúng cho cả 30 câu
- [ ] Lưu kết quả vào Supabase
- [ ] Hiển thị trang kết quả

---

## 📊 Scoring

```
Tổng: 30 câu × 2 điểm = 60 điểm

Phần 1 (Page 1):
- Listening (1-10): 10 câu × 2 điểm = 20 điểm
- Reading (11-20): 10 câu × 2 điểm = 20 điểm

Phần 2 (Page 2):
- Comprehension (21-30): 10 câu × 2 điểm = 20 điểm
```

---

## 🚀 Deployment

### Files đã thay đổi:
1. `assets/js/hsk2-standalone.js` - Logic chính
2. `pages/hsk2.html` - HTML structure & CSS

### Không cần thay đổi database:
- Database schema giữ nguyên
- Tất cả 30 câu vẫn được lưu trong `hsk2_questions`
- Chỉ thay đổi cách hiển thị (frontend)

### Deploy steps:
1. Git commit changes
2. Git push to repository
3. Vercel auto-deploy
4. Test trên production

---

## 💡 Notes

- **localStorage** tự động lưu đáp án cả 2 pages
- User có thể refresh trang mà không mất đáp án
- Timer tiếp tục chạy qua cả 2 pages
- Không có nút "Quay lại" từ page 2 về page 1 (theo design)
- Progress circles chỉ hiển thị câu của page hiện tại (clean UI)

---

## 🎉 Kết Quả

✅ Bài thi HSK2 giờ được chia thành 2 phần rõ ràng  
✅ UI sạch sẽ, chỉ hiển thị câu của phần hiện tại  
✅ Logic chuyển trang mượt mà  
✅ Tự động lưu đáp án  
✅ Tính điểm chính xác 30 câu = 60 điểm  

**User experience tốt hơn: Chia nhỏ bài thi thành 2 phần dễ quản lý!** 🚀

