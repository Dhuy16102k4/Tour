# 🚀 BẮT ĐẦU TẠI ĐÂY

## Chào mừng đến với Tour Booking Microservices! 🎉

### ⚡ Bạn đang ở đâu?

Bạn đã có một dự án microservices hoàn chỉnh cho hệ thống đặt tour với Node.js Express.

### 📚 Bạn nên đọc gì trước?

#### 1️⃣ Nếu bạn muốn chạy ngay (5 phút)
👉 Đọc: **[QUICKSTART.md](QUICKSTART.md)**

#### 2️⃣ Nếu bạn muốn hiểu tổng quan
👉 Đọc: **[README.md](README.md)**

#### 3️⃣ Nếu bạn cần cài đặt chi tiết
👉 Đọc: **[SETUP.md](SETUP.md)**

#### 4️⃣ Nếu bạn muốn hiểu kiến trúc
👉 Đọc: **[ARCHITECTURE.md](ARCHITECTURE.md)**

#### 5️⃣ Nếu bạn cần test API
👉 Đọc: **[API.md](API.md)**

#### 6️⃣ Nếu bạn muốn xem tổng hợp
👉 Đọc: **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**

### 🎯 Bắt đầu trong 3 bước

```bash
# 1. Khởi động Docker
docker-compose up --build

# 2. Kiểm tra health
curl http://localhost:3000/health

# 3. Test API
curl http://localhost:3000/api/tours
```

### 📊 Services

| Service | Port | Health Check |
|---------|------|--------------|
| API Gateway | 3000 | ✅ /health |
| User Service | 3001 | ✅ /health |
| Tour Service | 3002 | ✅ /health |
| Booking Service | 3003 | ✅ /health |
| Payment Service | 3004 | ✅ /health |
| Notification Service | 3005 | ✅ /health |

### 🗂️ Cấu trúc dự án

```
be/
├── services/          # 6 microservices
├── shared/           # Libraries dùng chung
├── docker-compose.yml # Docker setup
└── *.md             # Documentation
```

### 🔧 Công nghệ chính

- ✅ Node.js + Express
- ✅ MongoDB
- ✅ Redis
- ✅ Docker
- ✅ JWT Authentication
- ✅ Stripe Payment

### ❓ Bạn cần giúp gì?

#### Q: Làm sao để khởi động dự án?
**A:** Đọc [QUICKSTART.md](QUICKSTART.md) hoặc chạy `docker-compose up`

#### Q: Làm sao để test API?
**A:** Đọc [API.md](API.md) hoặc `curl http://localhost:3000/health`

#### Q: Làm sao để phát triển thêm?
**A:** Đọc [ARCHITECTURE.md](ARCHITECTURE.md) để hiểu cấu trúc

#### Q: Services không chạy được?
**A:** Đọc phần Troubleshooting trong [SETUP.md](SETUP.md)

### 📝 File quan trọng

| File | Mục đích |
|------|----------|
| `QUICKSTART.md` | Bắt đầu nhanh |
| `docker-compose.yml` | Docker setup |
| `README.md` | Tổng quan |
| `API.md` | API docs |
| `ARCHITECTURE.md` | Kiến trúc |

### 🎓 Learning Path

1. ✅ Đọc QUICKSTART.md → Chạy dự án
2. ✅ Đọc README.md → Hiểu tổng quan
3. ✅ Test API với [API.md](API.md)
4. ✅ Đọc ARCHITECTURE.md → Hiểu kiến trúc
5. 🚀 Bắt đầu coding!

### 🎉 Bắt đầu ngay!

```bash
# Chạy dự án
docker-compose up

# Test
curl http://localhost:3000/health
```

---

**Need Help?** Đọc [SETUP.md](SETUP.md) hoặc check logs với `docker-compose logs -f`

**Ready to code?** Happy coding! 🚀

