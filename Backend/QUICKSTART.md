# Quick Start Guide - Tour Booking Microservices

## ⚡ Bắt đầu nhanh trong 5 phút

### Yêu cầu tối thiểu
- Docker & Docker Compose
- Git

## 🚀 Khởi động với Docker (Khuyên dùng)

### Bước 1: Clone repository
```bash
git clone <your-repo-url>
cd tour-booking-microservices
```

### Bước 2: Khởi động tất cả services
```bash
docker-compose up --build
```

### Bước 3: Kiểm tra services đang chạy
Mở trình duyệt hoặc terminal:

```bash
# API Gateway
curl http://localhost:3000/health

# Expected response:
# {"status":"OK","service":"API Gateway","timestamp":"..."}

# User Service
curl http://localhost:3001/health

# Tour Service
curl http://localhost:3002/health

# Booking Service
curl http://localhost:3003/health

# Payment Service
curl http://localhost:3004/health

# Notification Service
curl http://localhost:3005/health
```

### Bước 4: Test API

**Đăng ký user mới:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Đăng nhập:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Xem danh sách tours:**
```bash
curl http://localhost:3000/api/tours
```

## 📋 Các lệnh hữu ích

### Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs của một service
docker-compose logs -f api-gateway

# Restart một service
docker-compose restart user-service

# Rebuild containers
docker-compose up --build --force-recreate

# Stop và xóa volumes (reset database)
docker-compose down -v
```

### Health Checks

Tất cả services có endpoint `/health`:
- http://localhost:3000/health - API Gateway
- http://localhost:3001/health - User Service
- http://localhost:3002/health - Tour Service
- http://localhost:3003/health - Booking Service
- http://localhost:3004/health - Payment Service
- http://localhost:3005/health - Notification Service

## 🎯 Test Workflow Hoàn chỉnh

### 1. Tạo User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "securepass123"
  }'
```

**Lưu lại `token` từ response**

### 2. Tạo Category
```bash
# Lưu USER_TOKEN từ bước 1
export USER_TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "name": "Beach Tours",
    "description": "Amazing beach destinations"
  }'
```

### 3. Tạo Tour
```bash
# Lưu CATEGORY_ID từ bước 2
export CATEGORY_ID="category_id_here"

curl -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "name": "Beautiful Bali Beach Tour",
    "description": "7 days in paradise",
    "category": "'"$CATEGORY_ID"'",
    "price": 1500,
    "duration": 7,
    "maxCapacity": 20,
    "location": {
      "city": "Bali",
      "country": "Indonesia"
    }
  }'
```

### 4. Tạo Booking
```bash
# Lưu TOUR_ID và USER_ID
export TOUR_ID="tour_id_here"
export USER_ID="user_id_here"

curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "tourId": "'"$TOUR_ID"'",
    "userId": "'"$USER_ID"'",
    "numberOfGuests": 2,
    "startDate": "2024-06-01",
    "totalAmount": 3000
  }'
```

### 5. Xem Booking History
```bash
curl http://localhost:3000/api/bookings/user/$USER_ID \
  -H "Authorization: Bearer $USER_TOKEN"
```

## 🔍 Truy cập Database

### MongoDB (từ Docker container)
```bash
# Kết nối MongoDB
docker exec -it tour_booking_mongodb mongosh

# Hoặc từ host machine
mongosh mongodb://localhost:27017
```

### Redis (từ Docker container)
```bash
docker exec -it tour_booking_redis redis-cli
```

## 📊 Quản lý Services

### Xem trạng thái
```bash
docker-compose ps
```

### Restart service
```bash
docker-compose restart <service-name>
```

### View logs
```bash
# Tất cả
docker-compose logs -f

# Một service
docker-compose logs -f user-service
```

### Exec vào container
```bash
docker exec -it tour_booking_gateway sh
```

## 🛑 Troubleshooting

### Port đã được sử dụng
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Services không start
```bash
# Xem logs
docker-compose logs

# Rebuild
docker-compose down
docker-compose up --build
```

### Database connection errors
```bash
# Kiểm tra MongoDB
docker-compose logs mongodb

# Restart database
docker-compose restart mongodb
```

### Clear everything
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 📝 Next Steps

Sau khi khởi động thành công:

1. ✅ Đọc [README.md](README.md) để hiểu tổng quan
2. ✅ Xem [ARCHITECTURE.md](ARCHITECTURE.md) để hiểu kiến trúc
3. ✅ Tham khảo [API.md](API.md) để biết endpoints
4. ✅ Đọc [SETUP.md](SETUP.md) cho development setup
5. 🚀 Bắt đầu coding!

## 🎉 Chúc mừng!

Bạn đã khởi động thành công Tour Booking Microservices platform!

**Need Help?**
- Check logs: `docker-compose logs -f`
- Health checks: `http://localhost:3000/health`
- Read docs: [SETUP.md](SETUP.md)

Happy Coding! 🚀

