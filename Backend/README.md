# Tour Booking Microservices

Hệ thống đặt tour được xây dựng với kiến trúc microservices sử dụng Node.js Express.

## Kiến trúc

### Services

1. **API Gateway** - Cổng vào chính, xử lý routing và authentication
2. **User Service** - Quản lý người dùng, authentication, authorization
3. **Tour Service** - Quản lý thông tin tour, danh mục tour
4. **Booking Service** - Quản lý đặt chỗ, lịch sử booking
5. **Payment Service** - Xử lý thanh toán
6. **Notification Service** - Gửi thông báo (email, SMS, push)

### Công nghệ sử dụng

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (primary), MySQL (nếu cần)
- **Message Queue**: Redis, RabbitMQ
- **API Gateway**: Express + HTTP proxy
- **Authentication**: JWT
- **Validation**: Joi, express-validator
- **Testing**: Jest, Supertest
- **Container**: Docker

## Cài đặt

### Yêu cầu

- Node.js >= 18.0.0
- MongoDB
- Redis
- Docker (optional)

### Cài đặt tất cả services

```bash
npm run install:all
```

### Chạy từng service

```bash
# API Gateway
npm run dev:gateway

# User Service
npm run dev:user

# Tour Service
npm run dev:tour

# Booking Service
npm run dev:booking

# Payment Service
npm run dev:payment

# Notification Service
npm run dev:notification
```

### Chạy tất cả services

```bash
npm run dev:all
```

## Port mapping

- API Gateway: 3000
- User Service: 3001
- Tour Service: 3002
- Booking Service: 3003
- Payment Service: 3004
- Notification Service: 3005

## Cấu trúc thư mục

```
.
├── services/              # Các microservices
│   ├── api-gateway/      # API Gateway
│   ├── user-service/     # User Service
│   ├── tour-service/     # Tour Service
│   ├── booking-service/  # Booking Service
│   ├── payment-service/  # Payment Service
│   └── notification-service/ # Notification Service
├── shared/               # Thư viện dùng chung
│   ├── database/         # Database utilities
│   ├── errors/           # Error handling
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utilities
│   └── validation/       # Validation schemas
├── docker-compose.yml    # Docker configuration
├── .gitignore
└── README.md
```

## Environment Variables

Mỗi service có file `.env` riêng để cấu hình. Tham khảo file `.env.example` trong mỗi service.

## API Documentation

API documentation sẽ được cung cấp qua Swagger tại `/api-docs` khi chạy API Gateway.

## Testing

```bash
# Chạy test cho tất cả services
npm test
```

## Docker

```bash
# Build và chạy tất cả services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop tất cả services
docker-compose down
```

## License

ISC
