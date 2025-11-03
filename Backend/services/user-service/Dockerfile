FROM node:18-alpine

# Đặt thư mục làm việc GỐC của monorepo trong image
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

COPY services/api-gateway/package.json ./services/api-gateway/
COPY services/user-service/package.json ./services/user-service/
COPY services/tour-service/package.json ./services/tour-service/
COPY services/booking-service/package.json ./services/booking-service/
COPY services/payment-service/package.json ./services/payment-service/
COPY services/notification-service/package.json ./services/notification-service/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

WORKDIR /app/services/user-service

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "src/server.js"]

