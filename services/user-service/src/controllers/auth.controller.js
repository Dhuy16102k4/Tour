const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { successResponse, errorResponse } = require('../../../../shared/utils/response')
const redisClient = require('../../../../shared/database/redis') 

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key'
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key'
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60 
const REFRESH_TOKEN_EXPIRES_IN_JWT = '7d' 

class AuthController {
  
  // Tạo Access Token
  generateAccessToken(user) {
    return jwt.sign(
      { userId: user._id, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    ) 
  }

  // Tạo Refresh Token (dài hạn)
  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user._id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN_JWT }
    )
  }

  // Gửi token cho client
  async sendTokens(res, user, statusCode) {
    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)

    // 1. Lưu refresh token vào Redis với key là userId
    //    Thời hạn lưu phải khớp với thời hạn của token
    await redisClient.set(
      user._id.toString(), //key
      refreshToken, //value
      REFRESH_TOKEN_EXPIRES_IN_SECONDS 
    )

    // 2. Gửi refresh token qua HttpOnly cookie 
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS ở production
      maxAge: REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000
    })

    // 3. Gửi access token và thông tin user qua JSON
    user.password = undefined 
    const message = statusCode === 201 ? 'User registered successfully' : 'Login successful'
    return successResponse(res, statusCode, { user, accessToken }, message)
  }

  // --- Các hàm xử lý route ---

  async register(req, res, next) {
    try {
      // FIX BẢO MẬT: Chỉ lấy name, email, password từ body
      const { name, email, password, phone, address, role} = req.body

      if (!name || !email || !password) {
        return errorResponse(res, 400, 'Please provide name, email, and password')
      }
      //check roles
      
      // Check user
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return errorResponse(res, 400, 'User with this email already exists')
      }

      // Check password length
      if (password.length < 6) {
        return errorResponse(res, 400, 'Password must be at least 6 characters long')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        phone, 
        address
      })

      // Gửi token
      return this.sendTokens(res, user, 201)

    } catch (error) {
      console.error('Register error:', error)
      return errorResponse(res, 500, 'Error registering user')
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return errorResponse(res, 400, 'Please provide email and password')
      }

      // Check user
      const user = await User.findOne({ email }).select('+password')
      if (!user) {
        return errorResponse(res, 401, 'Invalid email or password')
      }

      // Check password
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        return errorResponse(res, 401, 'Invalid email or password')
      }

      // Gửi token
      return this.sendTokens(res, user, 200)

    } catch (error) {
      console.error('Login error:', error)
      return errorResponse(res, 500, 'Error logging in')
    }
  }

  async logout(req, res, next) {
    try {
      // Lấy userId từ middleware 'verifyToken'
      const userId = req.user.userId

      // 1. Xóa token trong Redis
      await redisClient.del(userId.toString())

      // 2. Xóa cookie ở client
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })

      return successResponse(res, 200, null, 'Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
      return errorResponse(res, 500, 'Error logging out')
    }
  }

  async refreshToken(req, res, next) {
    try {
      // 1. Lấy refresh token từ cookie
      const oldRefreshToken = req.cookies.refreshToken

      if (!oldRefreshToken) {
        return errorResponse(res, 401, 'No refresh token provided')
      }

      let decoded
      try {
        // 2. Verify token
        decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET)
      } catch (error) {
        return errorResponse(res, 401, 'Invalid or expired refresh token')
      }
      
      const userId = decoded.userId

      // 3. Kiểm tra token có trong Redis không
      const storedToken = await redisClient.get(userId.toString())

      if (!storedToken || storedToken !== oldRefreshToken) {
        return errorResponse(res, 401, 'Invalid refresh token. Please log in again.')
      }

      // 4. Token hợp lệ, lấy thông tin user
      const user = await User.findById(userId)
      if (!user) {
        return errorResponse(res, 404, 'User associated with this token no longer exists')
      }

      // 5. Cấp Access Token MỚI (Refresh token cũ vẫn dùng được)
      const newAccessToken = this.generateAccessToken(user)
      
      // Ghi chú: Một số hệ thống sẽ xoay vòng (rotate) cả refresh token
      // ở bước này, nhưng để đơn giản, ta chỉ cấp lại access token.
      
      return successResponse(res, 200, { accessToken: newAccessToken }, 'Token refreshed successfully')

    } catch (error) {
      console.error('Refresh token error:', error)
      return errorResponse(res, 500, 'Error refreshing token')
    }
  }
}

module.exports = new AuthController()