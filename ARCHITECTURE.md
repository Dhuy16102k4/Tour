# Architecture Overview

## Hệ thống Microservices - Tour Booking Platform

### Tổng quan

Hệ thống đặt tour được xây dựng theo kiến trúc microservices, chia thành các service độc lập, có thể scale và deploy riêng biệt.

### Services

#### 1. API Gateway (Port 3000)
- **Chức năng**: Entry point duy nhất cho tất cả clients
- **Nhiệm vụ**:
  - Routing requests đến các services phù hợp
  - Authentication & Authorization
  - Rate limiting
  - Load balancing
  - Request aggregation

#### 2. User Service (Port 3001)
- **Chức năng**: Quản lý người dùng
- **Database**: MongoDB (tour_booking_users)
- **Nhiệm vụ**:
  - Đăng ký, đăng nhập
  - Quản lý profile
  - JWT authentication
  - User roles (customer, admin, tour-guide)

#### 3. Tour Service (Port 3002)
- **Chức năng**: Quản lý tour và danh mục
- **Database**: MongoDB (tour_booking_tours)
- **Nhiệm vụ**:
  - CRUD tours
  - Quản lý danh mục tour
  - Tìm kiếm và filter
  - Quản lý availability

#### 4. Booking Service (Port 3003)
- **Chức năng**: Quản lý đặt chỗ
- **Database**: MongoDB (tour_booking_bookings)
- **Dependencies**: Tour Service, Payment Service
- **Nhiệm vụ**:
  - Tạo booking
  - Quản lý trạng thái booking
  - Kiểm tra availability
  - Hủy booking
  - Lịch sử booking

#### 5. Payment Service (Port 3004)
- **Chức năng**: Xử lý thanh toán
- **Database**: MongoDB (tour_booking_payments)
- **Third-party**: Stripe
- **Nhiệm vụ**:
  - Xử lý payments
  - Refunds
  - Payment gateway integration
  - Transaction history

#### 6. Notification Service (Port 3005)
- **Chức năng**: Gửi thông báo
- **Database**: MongoDB (tour_booking_notifications)
- **Channels**: Email, SMS, Push
- **Nhiệm vụ**:
  - Email notifications
  - In-app notifications
  - Notification history

### Database Architecture

#### MongoDB Collections

**User Service:**
- `users` - Thông tin người dùng

**Tour Service:**
- `tours` - Tours
- `categories` - Danh mục tour

**Booking Service:**
- `bookings` - Đặt chỗ

**Payment Service:**
- `payments` - Thanh toán

**Notification Service:**
- `notifications` - Thông báo

### Communication Patterns

#### 1. Synchronous Communication (HTTP/REST)
- API Gateway → Services
- Service-to-Service calls cho thông tin cần real-time

#### 2. Asynchronous Communication (Message Queue)
- Sử dụng Redis/RabbitMQ cho event-driven communication
- Event: booking_created, payment_processed, etc.

### Security

1. **Authentication**: JWT tokens
2. **Authorization**: Role-based access control (RBAC)
3. **API Gateway**: Rate limiting, request validation
4. **HTTPS**: End-to-end encryption
5. **Data Validation**: Joi schemas

### Scalability

- Horizontal scaling cho mỗi service
- Stateless services
- Database sharding
- Load balancing tại API Gateway
- Caching với Redis

### Monitoring & Logging

- Winston logger cho mỗi service
- Health check endpoints
- Error tracking
- Performance metrics

### Deployment

- Docker containers cho mỗi service
- Docker Compose cho local development
- Kubernetes cho production
- CI/CD pipeline

## Data Flow Examples

### Booking Flow

```
Client → API Gateway → Booking Service
                    ↓
              Tour Service (verify tour)
                    ↓
              Payment Service (create payment)
                    ↓
              Notification Service (send email)
                    ↓
              Client receives confirmation
```

### Payment Flow

```
Client → API Gateway → Payment Service
                    ↓
              Stripe API
                    ↓
              Update Booking Service
                    ↓
              Notification Service
```

## API Endpoints

### User Service
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/users/:id` - Lấy thông tin user
- `PUT /api/users/me` - Cập nhật profile

### Tour Service
- `GET /api/tours` - Danh sách tours
- `GET /api/tours/:id` - Chi tiết tour
- `POST /api/tours` - Tạo tour (admin)
- `GET /api/categories` - Danh sách categories

### Booking Service
- `POST /api/bookings` - Tạo booking
- `GET /api/bookings/:id` - Chi tiết booking
- `GET /api/bookings/user/:userId` - Lịch sử booking
- `DELETE /api/bookings/:id` - Hủy booking

### Payment Service
- `POST /api/payments` - Tạo payment
- `POST /api/payments/:id/process` - Xử lý thanh toán
- `POST /api/payments/:id/refund` - Hoàn tiền

### Notification Service
- `GET /api/notifications/user/:userId` - Lịch sử thông báo
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc

## Future Enhancements

1. **Message Queue**: RabbitMQ hoặc Kafka cho async communication
2. **API Gateway**: Kong hoặc AWS API Gateway
3. **Service Mesh**: Istio
4. **Search**: Elasticsearch cho tour search
5. **File Storage**: AWS S3 cho images
6. **Monitoring**: Prometheus + Grafana
7. **Tracing**: Jaeger hoặc Zipkin
8. **Caching**: Redis cluster
9. **Database**: Read replicas cho MongoDB
10. **CI/CD**: GitHub Actions hoặc GitLab CI

