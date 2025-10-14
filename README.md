# HSK Placement Test - Aloha School

Ứng dụng kiểm tra trình độ tiếng Trung HSK cho trường Aloha School.

## 🚀 Tính năng

- **Kiểm tra đa cấp độ**: HSK1, HSK2, HSK3, HSK4, HSK5
- **3 kỹ năng**: Nghe, Đọc, Viết
- **AI Scoring**: Sử dụng Gemini AI để chấm điểm phần viết
- **Responsive Design**: Tương thích với mọi thiết bị
- **Real-time Validation**: Kiểm tra dữ liệu đầu vào ngay lập tức

## 📁 Cấu trúc dự án

```
hsk-placement-test/
├── assets/
│   ├── css/
│   │   ├── main.css           # Styles chính
│   │   ├── components.css     # Styles cho components
│   │   ├── responsive.css     # Responsive design
│   │   └── test-pages.css     # Styles cho trang test
│   └── js/
│       ├── main.js            # Logic chính
│       ├── validation.js      # Form validation
│       ├── test-engine.js     # Engine test
│       ├── ai-feedback.js     # AI feedback
│       └── supabase.js        # Supabase config
├── pages/
│   ├── hsk1.html             # Trang HSK1
│   ├── hsk2.html             # Trang HSK2
│   ├── hsk3.html             # Trang HSK3
│   ├── hsk4.html              # Trang HSK4
│   └── hsk5.html              # Trang HSK5
├── index.html                 # Trang chính
├── package.json              # Dependencies
└── README.md                 # Hướng dẫn
```

## 🛠️ Cài đặt

### Yêu cầu hệ thống
- Python 3.x (để chạy local server)
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)

### Cài đặt

1. **Clone repository**
```bash
git clone https://github.com/aloha-school/hsk-placement-test.git
cd hsk-placement-test
```

2. **Cài đặt dependencies (tùy chọn)**
```bash
npm install
```

3. **Chạy local server**
```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng npm
npm start
```

4. **Truy cập ứng dụng**
```
http://localhost:8000
```

## 🔧 Cấu hình

### Supabase
Cập nhật thông tin Supabase trong `assets/js/supabase.js`:
```javascript
const SUPABASE_URL = "your-supabase-url";
const SUPABASE_KEY = "your-supabase-key";
```

### Gemini AI
Cập nhật API key trong `assets/js/ai-feedback.js`:
```javascript
const GEMINI_API_KEY = "your-gemini-api-key";
```

## 📊 Cơ sở dữ liệu

### Bảng `placement`
- `id`: Primary key
- `fullname`: Họ tên
- `age`: Tuổi (optional)
- `phone`: Số điện thoại
- `email`: Email
- `created_at`: Thời gian tạo

### Bảng `test_results`
- `id`: Primary key
- `placement_id`: Foreign key to placement
- `answers`: JSON answers
- `score`: Điểm số
- `writing_ai_score`: Điểm AI cho phần viết
- `writing_ai_comment`: Nhận xét AI
- `selected_level`: Cấp độ đã chọn
- `completed_at`: Thời gian hoàn thành

### Bảng câu hỏi
- `questions`: Câu hỏi HSK1 (với range)
- `hsk2_questions`: Câu hỏi HSK2
- `hsk3_questions`: Câu hỏi HSK3
- `hsk4_questions`: Câu hỏi HSK4
- `hsk5_questions`: Câu hỏi HSK5

## 🚀 Triển khai

### GitHub Pages
1. Push code lên GitHub
2. Vào Settings > Pages
3. Chọn source là GitHub Actions
4. Tạo file `.github/workflows/deploy.yml`

### Netlify
1. Kết nối repository với Netlify
2. Build command: `echo "No build needed"`
3. Publish directory: `.`

### Vercel
1. Kết nối repository với Vercel
2. Framework preset: Other
3. Build command: `echo "No build needed"`

## 🧪 Testing

### Test local
```bash
# Chạy server
python -m http.server 8000

# Test các trang
http://localhost:8000/index.html
http://localhost:8000/pages/hsk1.html
```

### Test production
- Kiểm tra form validation
- Test audio playback
- Test AI scoring
- Test responsive design

## 📱 Responsive Design

- **Desktop**: Full layout với sidebar
- **Tablet**: Responsive grid
- **Mobile**: Stack layout, touch-friendly

## 🔒 Bảo mật

- Validation phía client và server
- Sanitize user input
- Rate limiting cho API calls
- Secure API keys

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Audio không phát**
   - Kiểm tra file audio URL
   - Kiểm tra CORS policy

2. **AI không hoạt động**
   - Kiểm tra API key
   - Kiểm tra network connection

3. **Database lỗi**
   - Kiểm tra Supabase connection
   - Kiểm tra RLS policies

## 📞 Hỗ trợ

- **Hotline**: 02486857468
- **Zalo OA**: Aloha School
- **Email**: support@aloha-school.com

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📈 Roadmap

- [ ] Thêm HSK6
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app
