# 🔧 HSK2 - Sửa Lỗi Database Score Column

## ❌ Lỗi ban đầu

### Lỗi khi nộp bài:
```
Cảnh báo: Không thể lưu kết quả vào database. 
Lỗi: invalid input syntax for type integer: "44.57"
```

### Nguyên nhân:
- **Database column `score`**: Kiểu `INTEGER` (chỉ chấp nhận số nguyên: 0, 1, 2, 100, 200...)
- **Code HSK2**: Tính điểm thập phân (44.57, 185.71, 142.86...)
  - Phần 1 (1-35): 100 điểm / 35 câu = **2.857 điểm/câu**
  - Phần 2 (36-60): 100 điểm / 25 câu = **4 điểm/câu**

### Ví dụ:
- Làm đúng 15 câu phần 1: 15 × 2.857 = **42.855 điểm** ❌ Không lưu được vào INTEGER
- Làm đúng 60 câu: 100 + 100 = **200 điểm** ✅ OK

---

## ✅ Giải pháp đã áp dụng

### Option 1: Code fix (ĐÃ ÁP DỤNG) ✅
**Làm tròn điểm thành số nguyên trước khi lưu database**

#### Thay đổi trong `assets/js/hsk2-standalone.js`:

```javascript
// TRƯỚC (Lỗi):
function calculateScore() {
    // ... tính điểm ...
    score = Math.round(score * 100) / 100; // 185.71
    return { score }; // ❌ Lưu 185.71 vào INTEGER
}
```

```javascript
// SAU (Đã sửa):
function calculateScore() {
    // ... tính điểm ...
    const scoreDecimal = Math.round(score * 100) / 100; // 185.71 (hiển thị)
    const scoreInteger = Math.round(score);              // 186 (lưu DB)
    
    console.log('💯 Điểm thập phân:', scoreDecimal, '/200 điểm');
    console.log('💯 Điểm làm tròn (lưu DB):', scoreInteger, '/200 điểm');
    
    return { 
        score: scoreInteger,        // ✅ 186 -> Lưu vào database
        scoreDecimal: scoreDecimal, // 185.71 -> Hiển thị UI
        correct, 
        total, 
        maxScore: 200 
    };
}
```

#### Hiển thị trong Result Page:
```javascript
function displayResult(scoreData) {
    scoreDisplay.innerHTML = `
        <p><strong>Điểm số:</strong> ${scoreData.scoreDecimal}/200</p>
        <p>Số câu đúng: ${scoreData.correct}/60</p>
        <p><em>(Điểm lưu vào database: ${scoreData.score}/200)</em></p>
    `;
}
```

### Option 2: Database schema update (OPTIONAL) 🔄
**Thay đổi column type từ INTEGER sang NUMERIC**

#### File: `test_results-update-score-column.sql`
```sql
-- Thay đổi column score từ INTEGER sang NUMERIC(5,2)
ALTER TABLE test_results 
ALTER COLUMN score TYPE NUMERIC(5,2);

-- NUMERIC(5,2):
--   5 = tổng số chữ số
--   2 = số chữ số thập phân
-- Ví dụ: 199.99 (max), 185.71, 44.57
```

**Khi nào nên chạy SQL này?**
- Nếu muốn lưu điểm chính xác tuyệt đối (185.71 thay vì 186)
- Nếu cần phân tích dữ liệu chính xác hơn
- Hiện tại code đã hoạt động bình thường với INTEGER, nên **KHÔNG BẮT BUỘC**

---

## 🧪 Testing

### 1. Test case: Điểm thập phân
```javascript
// Làm đúng 15 câu phần 1 (1-35):
// 15 × 2.857 = 42.855 điểm
// Làm đúng 10 câu phần 2 (36-60):
// 10 × 4 = 40 điểm
// Tổng: 82.855 điểm

// Console output:
💯 Điểm thập phân: 82.86 /200 điểm
💯 Điểm làm tròn (lưu DB): 83 /200 điểm
✅ Successfully saved to Supabase: [...]
```

### 2. Test case: Điểm tròn
```javascript
// Làm đúng 35 câu phần 1:
// 35 × 2.857 = 100 điểm
// Làm đúng 25 câu phần 2:
// 25 × 4 = 100 điểm
// Tổng: 200 điểm

// Console output:
💯 Điểm thập phân: 200 /200 điểm
💯 Điểm làm tròn (lưu DB): 200 /200 điểm
✅ Successfully saved to Supabase: [...]
```

### 3. Kiểm tra Supabase Dashboard
1. Mở Supabase Dashboard
2. Vào Table Editor → `test_results`
3. Kiểm tra row mới nhất:
   - `placement_id`: ✅ Có giá trị
   - `answers`: ✅ JSON object với 60 câu
   - `score`: ✅ Số nguyên (83, 186, 200...)
   - `selected_level`: ✅ "2"
   - `completed_at`: ✅ Timestamp

---

## 📊 So sánh trước/sau

| Trường hợp | Điểm tính toán | Trước (Lỗi) | Sau (Đã sửa) |
|------------|----------------|-------------|---------------|
| 15/35 đúng P1 + 10/25 đúng P2 | 42.86 + 40 = 82.86 | ❌ Error | ✅ Lưu: 83 |
| 35/35 đúng P1 + 20/25 đúng P2 | 100 + 80 = 180 | ❌ Error | ✅ Lưu: 180 |
| 35/35 đúng P1 + 25/25 đúng P2 | 100 + 100 = 200 | ✅ Lưu: 200 | ✅ Lưu: 200 |
| 0 đúng | 0 | ✅ Lưu: 0 | ✅ Lưu: 0 |

---

## 📝 Files đã thay đổi

1. **assets/js/hsk2-standalone.js**
   - Line 1138-1160: `calculateScore()` - Thêm logic làm tròn điểm
   - Line 1243-1251: `displayResult()` - Hiển thị cả điểm thập phân và làm tròn

2. **test_results-update-score-column.sql** (NEW)
   - SQL migration để update database schema (optional)

3. **HSK2-DATABASE-FIX.md** (NEW)
   - Documentation về lỗi và cách fix

---

## 🎯 Kết quả

✅ **Đã sửa xong!**
- Không còn lỗi "invalid input syntax for type integer"
- Điểm số được lưu thành công vào Supabase
- Console logs chi tiết để debug
- Result page hiển thị đầy đủ thông tin

### Console logs mới:
```
📊 PHẦN 1 (1-35): 15 /35 câu đúng, 42.86 /100 điểm
📊 PHẦN 2 (36-60): 10 /25 câu đúng, 40 /100 điểm
🎯 TỔNG: 25 / 60 câu đúng
💯 Điểm thập phân: 82.86 /200 điểm
💯 Điểm làm tròn (lưu DB): 83 /200 điểm
✅ Successfully saved to Supabase: [...]
```

### Result page hiển thị:
```
Điểm số: 82.86/200
Số câu đúng: 25/60
(Điểm lưu vào database: 83/200)
```

