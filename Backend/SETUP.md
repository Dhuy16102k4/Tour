# Hướng dẫn Setup dự án Tour Booking Microservices

## Yêu cầu hệ thống

- Node.js >= 18.0.0
- MongoDB >= 5.0
- Redis >= 6.0
- Docker & Docker Compose (optional)
- npm hoặc yarn

## Cài đặt thủ công (không dùng Docker)

### 1. Clone repository

```bash
git clone <your-repo-url>
cd tour-booking-microservices
```

### 2. Cài đặt MongoDB

Download và cài đặt MongoDB từ: https://www.mongodb.com/try/download/community

Chạy MongoDB:
```bash
mongod
```

### 3. Cài đặt Redis

**Windows:**
Download từ: https://github.com/microsoftarchive/redis/releases

**Mac:**
```bash
brew install redis
```

**Linux:**
```bash
sudo apt-get install redis-server
```

Chạy Redis:
```bash
redis-server
```

### 4. Cài đặt dependencies

Cài đặt tất cả dependencies cho root và các services:

```bash
npm install
```

Sau đó cài đặt cho từng service:

```bash
# Shared library
cd shared
npm install
cd ..

# API Gateway
cd services/api-gateway
npm install
cd ../..

# User Service
cd services/user-service
npm install
cd ../..

# Tour Service
cd services/tour-service
npm install
cd ../..

# Booking Service
cd services/booking-service
npm install
cd ../..

# Payment Service
cd services/payment-service
npm install
cd ../..

# Notification Service
cd services/notification-service
npm install
cd ../..
```

### 5. Cấu hình Environment Variables

Tạo file `.env` cho mỗi service dựa trên `.env.example`:

**API Gateway** (`services/api-gateway/.env`):
```env
NODE_ENV=development
PORT=3000
USER_SERVICE_URL=http://localhost:3001
TOUR_SERVICE_URL=http://localhost:3002
BOOKING_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
NOTIFICATION_SERVICE_URL=http://localhost:3005
JWT_SECRET=your-super-secret-jwt-key
```

**User Service** (`services/user-service/.env`):
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/tour_booking_users
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

**Tour Service** (`services/tour-service/.env`):
```env
NODE_ENV=development
PORT=3002
MONGODB_URI=mongodb://localhost:27017/tour_booking_tours
```

**Booking Service** (`services/booking-service/.env`):
```env
NODE_ENV=development
PORT=3003
MONGODB_URI=mongodb://localhost:27017/tour_booking_bookings
TOUR_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3004
NOTIFICATION_SERVICE_URL=http://localhost:3005
```

**Payment Service** (`services/payment-service/.env`):
```env
NODE_ENV=development
PORT=3004
MONGODB_URI=mongodb://localhost:27017/tour_booking_payments
STRIPE_SECRET_KEY=your_stripe_secret_key
BOOKING_SERVICE_URL=http://localhost:3003
NOTIFICATION_SERVICE_URL=http://localhost:3005
```

**Notification Service** (`services/notification-service/.env`):
```env
NODE_ENV=development
PORT=3005
MONGODB_URI=mongodb://localhost:27017/tour_booking_notifications
USER_SERVICE_URL=http://localhost:3001
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
SMTP_FROM=noreply@tourbooking.com
```

### 6. Chạy các services

Mở 6 terminal windows và chạy từng service:

**Terminal 1 - API Gateway:**
```bash
cd services/api-gateway
npm run dev
```

**Terminal 2 - User Service:**
```bash
cd services/user-service
npm run dev
```

**Terminal 3 - Tour Service:**
```bash
cd services/tour-service
npm run dev
```

**Terminal 4 - Booking Service:**
```bash
cd services/booking-service
npm run dev
```

**Terminal 5 - Payment Service:**
```bash
cd services/payment-service
npm run dev
```

**Terminal 6 - Notification Service:**
```bash
cd services/notification-service
npm run dev
```

Hoặc sử dụng npm script từ root (cần install concurrently):
```bash
npm run dev:all
```

## Cài đặt với Docker

### 1. Build và chạy tất cả services

```bash
docker-compose up --build
```

### 2. Chạy ở chế độ background

```bash
docker-compose up -d
```

### 3. Xem logs

```bash
# Tất cả logs
docker-compose logs -f

# Logs của một service cụ thể
docker-compose logs -f api-gateway
docker-compose logs -f user-service
```

### 4. Dừng services

```bash
docker-compose down
```

### 5. Xóa volumes (xóa data)

```bash
docker-compose down -v
```

## Testing API

### Health Checks

```bash
# API Gateway
curl http://localhost:3000/health

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

### Test Register & Login

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Tour Operations

```bash
# Get all tours
curl http://localhost:3000/api/tours

# Get tour by ID
curl http://localhost:3000/api/tours/:tourId
```

## Troubleshooting

### MongoDB Connection Error

```bash
# Kiểm tra MongoDB đang chạy
mongosh
```

### Redis Connection Error

```bash
# Kiểm tra Redis đang chạy
redis-cli ping
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose up --build --force-recreate

# Clear cache
docker-compose down -v
docker system prune -a
```

## Development Tips

1. Sử dụng Postman hoặc Insomnia để test API
2. Kiểm tra logs của từng service để debug
3. Sử dụng MongoDB Compass để xem database
4. Sử dụng Redis Commander cho Redis
5. Enable hot-reload với nodemon

## Next Steps

1. Setup authentication middleware
2. Implement JWT validation
3. Add request validation với Joi
4. Setup unit tests với Jest
5. Implement integration tests
6. Setup CI/CD pipeline
7. Add API documentation với Swagger
8. Setup monitoring và logging
9. Implement caching strategy
10. Add rate limiting

## Support

Nếu gặp vấn đề, kiểm tra:
- Environment variables đã được cấu hình đúng chưa
- MongoDB và Redis đang chạy chưa
- Ports không bị conflict
- Dependencies đã được cài đặt đầy đủ
- Logs của từng service để tìm lỗi

