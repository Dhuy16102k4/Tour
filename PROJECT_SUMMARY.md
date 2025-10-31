# Tour Booking Microservices - Project Summary

## 📋 Tổng quan dự án

Hệ thống đặt tour được xây dựng với kiến trúc **Microservices** sử dụng Node.js Express, cung cấp giải pháp đặt tour hoàn chỉnh với khả năng scale, bảo mật và hiệu năng cao.

## 🏗️ Kiến trúc

### 6 Microservices chính

1. **API Gateway** (Port 3000)
   - Entry point duy nhất
   - Request routing
   - Authentication
   - Rate limiting

2. **User Service** (Port 3001)
   - Quản lý người dùng
   - Authentication & Authorization
   - JWT tokens

3. **Tour Service** (Port 3002)
   - Quản lý tours
   - Danh mục tour
   - Tìm kiếm & lọc

4. **Booking Service** (Port 3003)
   - Quản lý đặt chỗ
   - Availability checking
   - Booking history

5. **Payment Service** (Port 3004)
   - Xử lý thanh toán
   - Stripe integration
   - Refunds

6. **Notification Service** (Port 3005)
   - Email notifications
   - In-app notifications
   - Multiple channels

## 📁 Cấu trúc thư mục

```
tour-booking-microservices/
├── services/                  # Các microservices
│   ├── api-gateway/          # API Gateway
│   │   ├── src/
│   │   │   └── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── user-service/         # User management
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   └── package.json
│   ├── tour-service/         # Tour management
│   ├── booking-service/      # Booking management
│   ├── payment-service/      # Payment processing
│   └── notification-service/ # Notifications
├── shared/                    # Shared libraries
│   ├── database/             # DB connections
│   ├── errors/               # Error handling
│   ├── middleware/           # Middleware
│   └── utils/                # Utilities
├── docker-compose.yml        # Docker setup
├── README.md                 # Main documentation
├── SETUP.md                  # Setup guide
├── ARCHITECTURE.md           # Architecture details
├── API.md                    # API documentation
└── package.json              # Root package.json
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Cache**: Redis
- **Authentication**: JWT

### Tools & Libraries
- **Validation**: Joi
- **Logger**: Winston
- **Payment**: Stripe
- **Email**: Nodemailer
- **HTTP Client**: Axios

### DevOps
- **Container**: Docker
- **Orchestration**: Docker Compose
- **Development**: Nodemon
- **Process Manager**: PM2 (production)

## 📊 Database Schema

### User Service
- `users` - Thông tin người dùng

### Tour Service  
- `tours` - Tours
- `categories` - Danh mục tour

### Booking Service
- `bookings` - Đặt chỗ

### Payment Service
- `payments` - Thanh toán

### Notification Service
- `notifications` - Thông báo

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Rate limiting
- Helmet.js security headers
- Input validation
- CORS configuration

## 🚀 Cách sử dụng

### Quick Start với Docker

```bash
# Clone repository
git clone <repo-url>
cd tour-booking-microservices

# Start all services
docker-compose up --build

# Access API Gateway
curl http://localhost:3000/health
```

### Development Setup

```bash
# Install dependencies
npm run install:all

# Start MongoDB & Redis locally

# Run all services
npm run dev:all

# Or run individually
npm run dev:gateway
npm run dev:user
npm run dev:tour
npm run dev:booking
npm run dev:payment
npm run dev:notification
```

## 📚 Tài liệu

- **[README.md](README.md)** - Giới thiệu chung
- **[SETUP.md](SETUP.md)** - Hướng dẫn cài đặt chi tiết
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Kiến trúc hệ thống
- **[API.md](API.md)** - API Documentation

## 🔄 Data Flow

### Booking Flow
```
Client → API Gateway → Booking Service
                    ↓
              Tour Service (verify)
                    ↓
              Payment Service (create payment)
                    ↓
              Notification Service (send email)
                    ↓
              Client receives confirmation
```

### Authentication Flow
```
Client → API Gateway → User Service
                    ↓
              JWT Token generated
                    ↓
              Token stored & returned
```

## 📈 Scaling Strategy

### Horizontal Scaling
- Mỗi service có thể scale độc lập
- Load balancing tại API Gateway
- Stateless services

### Vertical Scaling
- Database optimization
- Caching với Redis
- Connection pooling

### Future Enhancements
- Message queue (RabbitMQ/Kafka)
- Service mesh (Istio)
- API Gateway (Kong/AWS)
- Search (Elasticsearch)
- Monitoring (Prometheus/Grafana)

## 🧪 Testing

### Manual Testing
- Health check endpoints
- Postman collection
- curl commands

### Automated Testing
- Unit tests (Jest)
- Integration tests
- E2E tests

## 🔍 Monitoring & Logging

### Health Checks
- All services provide `/health` endpoint
- MongoDB connection status
- Redis connection status

### Logging
- Winston logger
- Log levels (error, warn, info, debug)
- File rotation
- Centralized logging

## 🐳 Docker Containers

- `tour_booking_mongodb` - MongoDB database
- `tour_booking_redis` - Redis cache
- `tour_booking_gateway` - API Gateway
- `tour_booking_user` - User Service
- `tour_booking_tour` - Tour Service
- `tour_booking_booking` - Booking Service
- `tour_booking_payment` - Payment Service
- `tour_booking_notification` - Notification Service

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Tours
- `GET /api/tours` - Danh sách tours
- `GET /api/tours/:id` - Chi tiết tour
- `POST /api/tours` - Tạo tour (admin)
- `PUT /api/tours/:id` - Cập nhật tour
- `DELETE /api/tours/:id` - Xóa tour

### Bookings
- `POST /api/bookings` - Tạo booking
- `GET /api/bookings/:id` - Chi tiết booking
- `GET /api/bookings/user/:userId` - Lịch sử booking
- `DELETE /api/bookings/:id` - Hủy booking

### Payments
- `POST /api/payments` - Tạo payment
- `POST /api/payments/:id/process` - Xử lý thanh toán
- `POST /api/payments/:id/refund` - Hoàn tiền

### Notifications
- `GET /api/notifications/user/:userId` - Lịch sử thông báo
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc

## 🎯 Best Practices

### Code Quality
- Modular code structure
- Error handling
- Input validation
- Logging
- Documentation

### Security
- Environment variables
- Password hashing
- JWT tokens
- Rate limiting
- Input sanitization

### Performance
- Database indexing
- Query optimization
- Caching strategy
- Connection pooling
- Async operations

## 🚧 Roadmap

### Phase 1: Core Features ✅
- [x] User management
- [x] Tour management
- [x] Booking system
- [x] Payment integration
- [x] Notifications

### Phase 2: Enhancements
- [ ] Message queue
- [ ] Advanced search
- [ ] File upload
- [ ] Analytics
- [ ] Admin dashboard

### Phase 3: Production
- [ ] CI/CD pipeline
- [ ] Monitoring & Alerting
- [ ] Load testing
- [ ] Performance optimization
- [ ] Documentation

## 📞 Support

### Issues
- Check logs của từng service
- Verify environment variables
- Test database connections
- Review API documentation

### Common Problems
- Port conflicts
- Database connection errors
- Missing environment variables
- Docker issues

## 📄 License

ISC

## 👥 Contributors

Được phát triển bởi team Tour Booking Microservices.

---

**Happy Coding! 🚀**

