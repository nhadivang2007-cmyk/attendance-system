# 📖 Hướng Dẫn Cài Đặt Chi Tiết

## I. YÊU CẦU HỆ THỐNG

### Phần Mềm Cần Thiết
1. **Node.js** (v16 trở lên)
   - Tải từ: https://nodejs.org/
   - Kiểm tra: `node --version` & `npm --version`

2. **PostgreSQL** (v12 trở lên)
   - Tải từ: https://www.postgresql.org/download/
   - Cài đặt server và pgAdmin (optional)

3. **Git**
   - Tải từ: https://git-scm.com/
   - Kiểm tra: `git --version`

### Phần Cứng Tối Thiểu
- RAM: 2GB
- Ổ cứng: 500MB trống
- CPU: 1.5GHz

---

## II. CÀI ĐẶT BACKEND

### Bước 1: Tạo Cơ Sở Dữ Liệu

```bash
# Mở PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE attendance_system;

# Tạo user
CREATE USER admin WITH PASSWORD 'your_password';

# Cấp quyền
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET default_transaction_deferrable TO on;
ALTER ROLE admin SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE attendance_system TO admin;

# Thoát
\q
```

### Bước 2: Cài Đặt Backend

```bash
# Đi tới thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Copy file cấu hình
cp .env.example .env
```

### Bước 3: Cấu Hình File .env

Mở file `backend/.env` và cập nhật:

```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://admin:your_password@localhost:5432/attendance_system

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRE=7d

# Server
SERVER_URL=http://localhost:5000

# Email (nếu cần)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Bước 4: Chạy Migration

```bash
npm run migrate
```

Côi sẽ thấy output:
```
Database migrated successfully
Seeding database with default data...
Default admin created: admin@attendance.local
```

### Bước 5: Khởi Động Backend

```bash
npm start
```

Không lỗi, bạn sẽ thấy:
```
✓ Server running on http://localhost:5000
✓ Database connected successfully
```

---

## III. CÀI ĐẶT FRONTEND

### Bước 1: Cài Đặt Dependencies

```bash
# Đi tới thư mục frontend
cd frontend

# Cài đặt packages
npm install

# Copy file cấu hình
cp .env.example .env
```

### Bước 2: Cấu Hình .env

Mở file `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Hệ Thống Chấm Công
```

### Bước 3: Khởi Động Frontend

```bash
npm start
```

Browser sẽ tự mở: http://localhost:3000

---

## IV. KIỂM TRA HOẠT ĐỘNG

### 1. Kiểm Tra Backend API

```bash
curl http://localhost:5000/api/health
```

Kết quả mong đợi:
```json
{"status": "ok", "database": "connected"}
```

### 2. Kiểm Tra Đăng Nhập

**Tài Khoản Mặc Định:**
- **Email**: admin@attendance.local
- **Password**: Admin@123456

### 3. Kiểm Tra API với Postman

```bash
# Đăng nhập
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "admin@attendance.local",
  "password": "Admin@123456"
}

# Chấm công vào
POST http://localhost:5000/api/attendance/checkin
Header: Authorization: Bearer {token}
Body:
{
  "employeeId": "1",
  "location": "Văn phòng chính"
}

# Lấy báo cáo
GET http://localhost:5000/api/reports/attendance?startDate=2026-01-01&endDate=2026-12-31
Header: Authorization: Bearer {token}
```

---

## V. CÀI ĐẶT DOCKER (TÙY CHỌN)

### Chạy Toàn Bộ Hệ Thống Với Docker

```bash
# Đi tới thư mục gốc
cd attendance-system

# Build và khởi động containers
docker-compose up -d

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f

# Dừng containers
docker-compose down
```

---

## VI. GIẢI QUYẾT SỰ CỐ

### Lỗi: "Cannot find module 'express'"
```bash
# Giải pháp: Cài đặt lại dependencies
npm install
```

### Lỗi: "ECONNREFUSED" (PostgreSQL)
```bash
# Kiểm tra PostgreSQL có chạy không
# Trên Windows: kiểm tra Services
# Trên Linux: sudo systemctl status postgresql
# Trên Mac: brew services list | grep postgresql
```

### Lỗi: "Port 5000 already in use"
```bash
# Tìm process đang sử dụng port
lsof -i :5000

# Hoặc thay đổi port trong .env
PORT=5001
```

### Lỗi: "CORS errors" (Frontend không kết nối Backend)
```bash
# Kiểm tra REACT_APP_API_URL trong frontend/.env
# Phải giống với BACKEND URL
```

---

## VII. QUẢN LÝ DATABASE

### Sao Lưu Database
```bash
pg_dump -U admin -d attendance_system -f backup.sql
```

### Phục Hồi Database
```bash
psql -U admin -d attendance_system -f backup.sql
```

### Xóa Toàn Bộ Dữ Liệu
```bash
npm run reset:db
```

---

## VIII. HỖ TRỢ & LIÊN HỆ

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker-compose logs`
2. Tham khảo documentation: Xem các file trong `docs/`
3. Tạo issue trên GitHub

---

**🎉 Hoàn thành! Bây giờ bạn có thể sử dụng hệ thống chấm công.**
