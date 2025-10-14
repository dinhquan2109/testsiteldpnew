# Hướng dẫn chạy local server

## Vấn đề CORS
Khi mở file HTML trực tiếp từ file system (double-click), browser sẽ block các file JavaScript do CORS policy. Để giải quyết, bạn cần chạy qua local web server.

## Cách 1: Sử dụng Python (Khuyến nghị)

### Bước 1: Mở Command Prompt hoặc PowerShell
- Nhấn `Win + R`, gõ `cmd` hoặc `powershell`
- Hoặc mở PowerShell từ thư mục project

### Bước 2: Chạy server
```bash
# Di chuyển đến thư mục project
cd "C:\Users\tdqua\OneDrive\Máy tính\demotestsite-main"

# Chạy Python server
python -m http.server 8000
```

### Bước 3: Mở browser
- Mở browser và truy cập: `http://localhost:8000`
- Hoặc sử dụng file `start-server.bat` (double-click)

## Cách 2: Sử dụng Node.js (Nếu có)

```bash
# Cài đặt serve globally
npm install -g serve

# Chạy server
serve -s . -l 8000
```

## Cách 3: Sử dụng Live Server (VS Code)

1. Cài đặt extension "Live Server" trong VS Code
2. Right-click vào `index.html`
3. Chọn "Open with Live Server"

## Cách 4: Sử dụng file batch

1. Double-click vào file `start-server.bat`
2. Mở browser và truy cập `http://localhost:8000`

## Kiểm tra server đang chạy

- Server sẽ hiển thị: "Serving HTTP on 0.0.0.0 port 8000"
- Truy cập: `http://localhost:8000`
- Để dừng server: Nhấn `Ctrl + C`

## Troubleshooting

### Lỗi "python is not recognized"
- Cài đặt Python từ https://python.org
- Hoặc sử dụng Node.js với `npx serve .`

### Lỗi "Port 8000 is already in use"
- Thay đổi port: `python -m http.server 8001`
- Hoặc tìm và kill process đang sử dụng port 8000

### Vẫn gặp lỗi CORS
- Đảm bảo đang truy cập qua `http://localhost:8000` chứ không phải `file://`
- Kiểm tra console để xem lỗi cụ thể
- Thử refresh browser (Ctrl + F5)
