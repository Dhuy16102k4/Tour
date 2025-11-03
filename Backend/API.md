# API Documentation - Tour Booking Microservices

Base URL: `http://localhost:3000`

All endpoints go through the API Gateway.

## Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string" // optional: customer | admin | tour-guide
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    },
    "token": "string"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    },
    "token": "string"
  }
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## Users

### Get User by ID
```http
GET /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "createdAt": "date"
    }
  }
}
```

## Tours

### Get All Tours
```http
GET /api/tours?page=1&limit=10&category=beach&minPrice=100&maxPrice=1000&search=bali
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search in name and description

**Response:**
```json
{
  "success": true,
  "message": "Tours retrieved successfully",
  "data": {
    "tours": [...],
    "totalPages": 5,
    "currentPage": 1,
    "total": 50
  }
}
```

### Get Tour by ID
```http
GET /api/tours/:id
```

### Create Tour (Admin)
```http
POST /api/tours
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "category": "ObjectId",
  "price": 1000,
  "duration": 7,
  "maxCapacity": 20,
  "images": ["url1", "url2"],
  "itinerary": [
    {
      "day": 1,
      "title": "string",
      "description": "string",
      "activities": ["activity1", "activity2"]
    }
  ],
  "included": ["item1", "item2"],
  "excluded": ["item1", "item2"],
  "location": {
    "city": "string",
    "country": "string",
    "coordinates": {
      "latitude": 0,
      "longitude": 0
    }
  },
  "startDate": "2024-01-01",
  "endDate": "2024-01-07"
}
```

### Update Tour
```http
PUT /api/tours/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  // fields to update
}
```

### Delete Tour
```http
DELETE /api/tours/:id
Authorization: Bearer <token>
```

## Categories

### Get All Categories
```http
GET /api/categories
```

### Get Category by ID
```http
GET /api/categories/:id
```

### Create Category
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Beach Tours",
  "description": "Relaxing beach destinations",
  "icon": "icon-url"
}
```

## Bookings

### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "tourId": "ObjectId",
  "userId": "ObjectId",
  "numberOfGuests": 2,
  "startDate": "2024-06-01",
  "totalAmount": 2000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "string",
      "tourId": "ObjectId",
      "userId": "ObjectId",
      "numberOfGuests": 2,
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "date"
    }
  }
}
```

### Get All Bookings
```http
GET /api/bookings?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

### Get Booking by ID
```http
GET /api/bookings/:id
Authorization: Bearer <token>
```

### Get User Bookings
```http
GET /api/bookings/user/:userId
Authorization: Bearer <token>
```

### Cancel Booking
```http
DELETE /api/bookings/:id
Authorization: Bearer <token>
```

## Payments

### Create Payment
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "ObjectId",
  "userId": "ObjectId",
  "amount": 2000,
  "paymentMethod": "credit_card"
}
```

### Process Payment
```http
POST /api/payments/:id/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "stripe_payment_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "payment": {
      "_id": "string",
      "status": "completed",
      "transactionId": "stripe_charge_id"
    }
  }
}
```

### Refund Payment
```http
POST /api/payments/:id/refund
Authorization: Bearer <token>
```

### Get Payment by Booking
```http
GET /api/payments/booking/:bookingId
Authorization: Bearer <token>
```

## Notifications

### Get User Notifications
```http
GET /api/notifications/user/:userId?page=1&limit=10&unread=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "_id": "string",
        "type": "booking_confirmation",
        "message": "Your booking has been created",
        "isRead": false,
        "createdAt": "date"
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "total": 5
  }
}
```

### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": "optional additional error details"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API Gateway enforces rate limiting:
- 100 requests per 15 minutes per IP
- Additional headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

Tokens expire after 7 days (configurable).

## Pagination

All list endpoints support pagination:
- `page` - Page number (starts at 1)
- `limit` - Items per page

Response includes:
- `data` - Array of items
- `totalPages` - Total number of pages
- `currentPage` - Current page number
- `total` - Total number of items

## Testing

Use Postman collection or test with curl:

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

