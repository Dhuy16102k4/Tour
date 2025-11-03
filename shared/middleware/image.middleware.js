const multer = require('multer')
const cloudinary = require('cloudinary').v2
const AppError = require('../errors/AppError') 

// 1. Cấu hình Cloudinary (nó sẽ tự đọc .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// 2. Cấu hình Multer (lưu file tạm vào RAM)
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new AppError('Chỉ chấp nhận file hình ảnh!', 400), false)
  }
}

// 3. Export middleware Multer cơ bản
const upload = multer({ storage: storage, fileFilter: fileFilter })

// 4. Export hàm helper tải file chung chung
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

module.exports = {
  upload,
  uploadToCloudinary
}