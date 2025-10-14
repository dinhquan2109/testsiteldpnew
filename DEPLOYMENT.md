# Hướng dẫn Triển khai HSK Placement Test

## 🚀 Tổng quan

Ứng dụng HSK Placement Test là một ứng dụng web tĩnh (static website) có thể được triển khai trên nhiều nền tảng khác nhau.

## 📋 Yêu cầu Triển khai

### Yêu cầu Hệ thống
- **Web Server**: Apache, Nginx, hoặc bất kỳ web server nào
- **HTTPS**: Bắt buộc cho Supabase và Gemini AI API
- **Domain**: Tên miền hợp lệ (không bắt buộc cho local testing)

### Yêu cầu Dịch vụ
- **Supabase**: Database và authentication
- **Gemini AI**: API key cho AI scoring
- **Audio Hosting**: CDN hoặc cloud storage cho audio files

## 🔧 Cấu hình Trước khi Triển khai

### 1. Cấu hình Supabase

Cập nhật thông tin trong `assets/js/supabase.js`:

```javascript
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_KEY = "your-anon-key";
```

### 2. Cấu hình Gemini AI

Cập nhật API key trong `assets/js/ai-feedback.js`:

```javascript
const GEMINI_API_KEY = "your-gemini-api-key";
```

### 3. Cấu hình Audio Files

Đảm bảo các file audio được host trên HTTPS:
- Cập nhật `audio_url` trong database
- Sử dụng CDN hoặc cloud storage
- Kiểm tra CORS policy

## 🌐 Các Phương thức Triển khai

### 1. GitHub Pages

#### Cách 1: GitHub Actions (Khuyến nghị)

1. **Tạo file `.github/workflows/deploy.yml`**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

2. **Cấu hình GitHub Pages**:
   - Vào Settings > Pages
   - Source: GitHub Actions
   - Branch: gh-pages

#### Cách 2: Direct Deploy

1. Vào Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)

### 2. Netlify

#### Cách 1: Drag & Drop

1. Truy cập [netlify.com](https://netlify.com)
2. Kéo thả folder project vào Netlify
3. Cấu hình domain (tùy chọn)

#### Cách 2: Git Integration

1. Kết nối GitHub repository
2. Build settings:
   - Build command: `echo "No build needed"`
   - Publish directory: `.`
3. Deploy

#### Cách 3: Netlify CLI

```bash
# Cài đặt Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir .
```

### 3. Vercel

#### Cách 1: Vercel Dashboard

1. Truy cập [vercel.com](https://vercel.com)
2. Import project từ GitHub
3. Framework preset: Other
4. Build command: `echo "No build needed"`
5. Deploy

#### Cách 2: Vercel CLI

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 4. Firebase Hosting

```bash
# Cài đặt Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init project
firebase init hosting

# Deploy
firebase deploy
```

### 5. AWS S3 + CloudFront

1. **Tạo S3 bucket**:
   - Enable static website hosting
   - Set index.html as index document

2. **Upload files**:
```bash
aws s3 sync . s3://your-bucket-name --delete
```

3. **Cấu hình CloudFront**:
   - Origin: S3 bucket
   - Default root object: index.html
   - Custom error pages: 404 → index.html

### 6. Apache/Nginx

#### Apache
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/hsk-placement-test
    
    # Enable HTTPS redirect
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/hsk-placement-test
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
</VirtualHost>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    root /var/www/hsk-placement-test;
    index index.html;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Bảo mật

### 1. HTTPS
- **Bắt buộc** cho Supabase và Gemini AI
- Sử dụng Let's Encrypt cho SSL certificate
- Cấu hình HSTS headers

### 2. CORS
- Cấu hình CORS cho Supabase
- Whitelist domain trong Supabase dashboard

### 3. API Keys
- Không commit API keys vào Git
- Sử dụng environment variables
- Rotate keys định kỳ

## 📊 Monitoring

### 1. Analytics
- Google Analytics
- Supabase Analytics
- Custom tracking

### 2. Error Tracking
- Sentry
- LogRocket
- Custom error handling

### 3. Performance
- Lighthouse CI
- WebPageTest
- GTmetrix

## 🧪 Testing

### 1. Local Testing
```bash
# Chạy local server
python -m http.server 8000

# Test các trang
curl http://localhost:8000
curl http://localhost:8000/pages/hsk1.html
```

### 2. Production Testing
- Test form submission
- Test audio playback
- Test AI scoring
- Test responsive design
- Test cross-browser compatibility

## 🚨 Troubleshooting

### Lỗi thường gặp

1. **CORS Error**
   - Kiểm tra Supabase CORS settings
   - Đảm bảo domain được whitelist

2. **Audio không phát**
   - Kiểm tra HTTPS
   - Kiểm tra audio file URLs
   - Kiểm tra browser permissions

3. **AI không hoạt động**
   - Kiểm tra API key
   - Kiểm tra network connection
   - Kiểm tra rate limits

4. **Database lỗi**
   - Kiểm tra Supabase connection
   - Kiểm tra RLS policies
   - Kiểm tra API limits

## 📈 Performance Optimization

### 1. CDN
- Sử dụng CloudFlare
- Cache static assets
- Enable compression

### 2. Images
- Optimize images
- Use WebP format
- Lazy loading

### 3. JavaScript
- Minify JS files
- Use browser caching
- Code splitting

## 🔄 CI/CD

### GitHub Actions Example
```yaml
name: Deploy HSK Test

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to production
        run: |
          # Your deployment commands here
```

## 📞 Hỗ trợ

- **Hotline**: 02486857468
- **Zalo OA**: Aloha School
- **Email**: support@aloha-school.com
- **GitHub Issues**: [Create Issue](https://github.com/aloha-school/hsk-placement-test/issues)

## 📚 Tài liệu Tham khảo

- [Supabase Documentation](https://supabase.com/docs)
- [Gemini AI Documentation](https://ai.google.dev/docs)
- [GitHub Pages](https://pages.github.com)
- [Netlify Documentation](https://docs.netlify.com)
- [Vercel Documentation](https://vercel.com/docs)
