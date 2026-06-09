# Hệ Thống Chấm Công Nhân Viên

## 📋 Giới Thiệu
Hệ thống chấm công toàn diện cho nhân viên với các tính năng:
- ✅ Chấm công vào/ra
- 📊 Báo cáo chi tiết
- 💾 Lưu trữ dữ liệu an toàn
- 🌐 Giao diện web & di động
- 👥 Quản lý nhân viên
- 📱 Responsive design

## 🚀 Công Nghệ Sử Dụng
- **Backend**: Node.js + Express
- **Frontend**: React + Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Mobile**: React Native / PWA

## 📂 Cấu Trúc Thư Mục
```
attendance-system/
├── backend/              # API Server
├── frontend/             # Web Application
├── mobile/               # Mobile App
├── docker-compose.yml    # Docker configuration
├── README.md
└── SETUP.md             # Hướng dẫn cài đặt
```

## 🛠️ Cài Đặt Nhanh

### Yêu Cầu
- Node.js v16+
- PostgreSQL v12+
- npm hoặc yarn

### Bước 1: Clone Repository
```bash
git clone https://github.com/nhadivang2007-cmyk/attendance-system.git
cd attendance-system
```

### Bước 2: Cài Đặt Backend
```bash
cd backend
npm install
cp .env.example .env
# Cấu hình DATABASE_URL trong .env
npm run migrate
npm start
```

### Bước 3: Cài Đặt Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### Bước 4: Truy Cập Ứng Dụng
- Web: http://localhost:3000
- API: http://localhost:5000

## 📖 Xem Chi Tiết
Xem file `SETUP.md` để hướng dẫn cài đặt chi tiết hơn.

## 📄 License
MIT
