# 📧 Notification Service - Giải thích chi tiết

## 🎯 Mục đích

**Notification Service** là service chuyên xử lý **tất cả các thông báo** trong hệ thống đặt tour. Nó đảm bảo người dùng luôn được cập nhật về các sự kiện quan trọng.

## 🔔 Chức năng chính

### 1. **In-App Notifications** (Thông báo trong app)
- Lưu trữ thông báo trong database MongoDB
- Lịch sử thông báo cho từng user
- Đánh dấu đã đọc/chưa đọc
- Hiển thị số lượng thông báo chưa đọc

### 2. **Email Notifications** (Thông báo qua email)
- Gửi email khi có sự kiện quan trọng
- Tích hợp với Gmail/SMTP server
- Format HTML đẹp mắt
- Gửi tự động không cần tương tác

### 3. **Multiple Channels** (Nhiều kênh thông tin)
- Email
- In-app notification (trong app)
- Có thể mở rộng thêm: SMS, Push notifications, Slack, Discord

## 📋 Các loại Notification

Theo model `Notification.model.js`, có 6 loại thông báo:

### 1. `booking_confirmation` - Xác nhận đặt tour
**Khi nào:** Khi người dùng đặt tour thành công
**Ví dụ:**
```
"Your booking has been created successfully"
```

### 2. `booking_cancellation` - Hủy đặt tour
**Khi nào:** Khi người dùng hủy tour
**Ví dụ:**
```
"Your booking has been cancelled"
```

### 3. `payment_confirmation` - Xác nhận thanh toán
**Khi nào:** Khi thanh toán thành công
**Ví dụ:**
```
"Your payment has been processed successfully"
```

### 4. `payment_failure` - Thanh toán thất bại
**Khi nào:** Khi thanh toán lỗi
**Ví dụ:**
```
"Payment processing failed. Please try again."
```

### 5. `tour_update` - Cập nhật tour
**Khi nào:** Khi admin cập nhật thông tin tour
**Ví dụ:**
```
"Your upcoming tour has been updated"
```

### 6. `general` - Thông báo chung
**Khi nào:** Các thông báo khác
**Ví dụ:**
```
"Welcome to Tour Booking!"
```

## 🔄 Luồng hoạt động (Flow)

### Kịch bản 1: Khi tạo Booking

```
User tạo booking
    ↓
Booking Service xử lý
    ↓
Booking Service gọi Notification Service
    ↓
Notification Service:
  1. Lưu thông báo vào database
  2. Gửi email cho user
  3. Trả về thành công
    ↓
User nhận được:
  - Thông báo trong app
  - Email xác nhận
```

### Kịch bản 2: Khi thanh toán

```
User thanh toán
    ↓
Payment Service xử lý với Stripe
    ↓
Thanh toán thành công
    ↓
Payment Service gọi Notification Service
    ↓
Notification Service gửi email "Payment confirmed"
    ↓
User nhận email
```

### Kịch bản 3: Khi hủy booking

```
User hủy booking
    ↓
Booking Service cập nhật status = "cancelled"
    ↓
Booking Service gọi Notification Service
    ↓
Notification Service gửi "Booking cancelled"
    ↓
User nhận thông báo
```

## 🗄️ Database Schema

```javascript
{
  userId: ObjectId,          // User nhận thông báo
  type: String,              // Loại thông báo
  message: String,           // Nội dung
  data: Object,              // Dữ liệu bổ sung
  isRead: Boolean,           // Đã đọc chưa?
  readAt: Date,              // Thời gian đọc
  createdAt: Date,           // Thời gian tạo
  updatedAt: Date            // Cập nhật lần cuối
}
```

## 📡 API Endpoints

### 1. Gửi thông báo (POST)
```http
POST /api/notifications
{
  "userId": "user_id_here",
  "type": "booking_confirmation",
  "message": "Your booking confirmed",
  "data": { /* optional */ }
}
```

### 2. Lấy thông báo của user (GET)
```http
GET /api/notifications/user/:userId?unread=true&page=1&limit=10
```

### 3. Đánh dấu đã đọc (PUT)
```http
PUT /api/notifications/:id/read
```

### 4. Lấy tất cả thông báo (GET - Admin)
```http
GET /api/notifications?page=1&limit=10
```

## 🔌 Cách Services khác sử dụng

### Booking Service gọi Notification Service

```javascript
// services/booking-service/booking.controller.js

// Khi tạo booking thành công
try {
  await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
    userId,
    type: 'booking_confirmation',
    message: 'Your booking has been created successfully'
  });
} catch (error) {
  console.error('Notification sending error:', error);
}
```

### Payment Service gọi Notification Service

```javascript
// services/payment-service/payment.controller.js

// Khi thanh toán thành công
try {
  await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
    userId: payment.userId,
    type: 'payment_confirmation',
    message: 'Your payment has been processed successfully'
  });
} catch (error) {
  console.error('Notification error:', error);
}
```

## 📧 Email Configuration

Notification Service sử dụng **Nodemailer** để gửi email:

```javascript
// services/notification-service/services/email.service.js

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

### Setup Email

Trong file `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@tourbooking.com
```

## 🎨 Ví dụ thực tế

### Example 1: User đặt tour

**Bước 1:** User tạo booking
```json
POST /api/bookings
{
  "tourId": "123",
  "userId": "user_456",
  "numberOfGuests": 2,
  "startDate": "2024-06-01",
  "totalAmount": 3000
}
```

**Bước 2:** Booking Service tự động gọi Notification Service
```json
POST http://localhost:3005/api/notifications
{
  "userId": "user_456",
  "type": "booking_confirmation",
  "message": "Your booking has been created successfully"
}
```

**Kết quả:**
- ✅ Thông báo lưu trong database
- ✅ Email gửi đến user: `user@example.com`
- ✅ User có thể xem trong app

### Example 2: User thanh toán

**Bước 1:** User thanh toán
```json
POST /api/payments/:id/process
{
  "token": "stripe_token_here"
}
```

**Bước 2:** Payment Service xử lý với Stripe
- Thanh toán thành công ✅

**Bước 3:** Tự động gửi email
```json
POST http://localhost:3005/api/notifications
{
  "userId": "user_456",
  "type": "payment_confirmation",
  "message": "Your payment has been processed successfully"
}
```

**Kết quả:**
- ✅ Email xác nhận thanh toán
- ✅ In-app notification

## 🚀 Mở rộng trong tương lai

### 1. SMS Notifications
```javascript
// Có thể thêm Twilio
const twilio = require('twilio');
// Gửi SMS cho những thông báo quan trọng
```

### 2. Push Notifications
```javascript
// Web Push API
// Mobile push với Firebase
// Desktop notifications
```

### 3. Real-time với WebSocket
```javascript
// Socket.io hoặc WebSocket
// Thông báo hiển thị ngay lập tức
```

### 4. Template System
```javascript
// Email templates đẹp hơn với Handlebars
const handlebars = require('handlebars');
// Templates HTML chuyên nghiệp
```

### 5. Notification Preferences
```javascript
// User chọn nhận loại thông báo nào
{
  userId: "...",
  preferences: {
    email: true,
    sms: false,
    push: true,
    types: ['booking', 'payment']
  }
}
```

## 📊 Lợi ích

### ✅ Cho User
- Luôn biết trạng thái booking/thanh toán
- Nhận email xác nhận tin cậy
- Lịch sử thông báo đầy đủ

### ✅ Cho Hệ thống
- Decoupled: tách biệt khỏi business logic
- Reliable: lưu trữ lâu dài trong database
- Scalable: có thể scale độc lập
- Flexible: dễ thêm kênh mới (SMS, Push, etc.)

### ✅ Cho Developers
- Code sạch: mỗi service làm việc riêng
- Dễ test: mock notification service
- Dễ maintain: sửa notification không ảnh hưởng services khác

## 🎯 Tóm tắt

**Notification Service = Trái tim thông tin của hệ thống**

Nó đảm bảo:
- 📬 User luôn được thông báo
- 📧 Email chuyên nghiệp
- 🔔 In-app notifications
- 📱 Sẵn sàng mở rộng (SMS, Push)
- 🎨 Personalized messages
- 📊 Tracking & Analytics

---

**Kết luận:** Notification Service là một phần **QUAN TRỌNG** không thể thiếu trong bất kỳ hệ thống e-commerce/tour booking nào. Nó nâng cao trải nghiệm user và tăng độ tin cậy của hệ thống! 🚀


