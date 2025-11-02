# Sử dụng base image
FROM node:18-alpine

# Đặt thư mục làm việc GỐC của monorepo trong image
WORKDIR /app

# 1. Sao chép file package.json và package-lock.json GỐC
COPY package.json package-lock.json ./

# 2. Sao chép TẤT CẢ các file package.json của từng workspace
COPY package.json package-lock.json ./
COPY services/api-gateway/package.json ./services/api-gateway/
COPY services/user-service/package.json ./services/user-service/
COPY services/tour-service/package.json ./services/tour-service/
COPY services/booking-service/package.json ./services/booking-service/
COPY services/payment-service/package.json ./services/payment-service/
COPY services/notification-service/package.json ./services/notification-service/
COPY shared/package.json ./shared/

# 3. Cài đặt TẤT CẢ dependencies từ file lock gốc
RUN npm ci --omit=dev

# 4. Sao chép TOÀN BỘ mã nguồn của dự án vào image
COPY . .


# 5. Đặt thư mục làm việc cuối cùng là thư mục của service này
WORKDIR /app/services/api-gateway

# 6. Expose port và chạy ứng dụng
EXPOSE 3000
CMD ["node", "src/server.js"]