const User = require('../models/User.model')
const { successResponse, errorResponse } = require('../../../shared/utils/response')
const redisClient = require('../../../shared/database/redisClient') // <-- Import Redis

class UserController {

  async getUserById(req, res, next) {
    try {
      const { id } = req.params
      const user = await User.findById(id)
      if (!user) return errorResponse(res, 404, 'User not found')
      
      user.password = undefined
      return successResponse(res, 200, { user }, 'User retrieved successfully')
    } catch (error) {
      console.error('Get user error:', error)
      return errorResponse(res, 500, 'Error retrieving user')
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const userId = req.user.userId
      const user = await User.findById(userId)
      if (!user) return errorResponse(res, 404, 'User not found')
      
      user.password = undefined
      return successResponse(res, 200, { user }, 'User retrieved successfully')
    } catch (error) {
      console.error('Get current user error:', error)
      return errorResponse(res, 500, 'Error retrieving user')
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId
      // Lọc các trường không cho phép update (ví dụ: role, password)
      const { name, avatar, address, phone } = req.body 
      const updates = { name, avatar, address, phone }

      Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key])

      if (Object.keys(updates).length === 0) {
        return errorResponse(res, 400, 'No valid fields provided for update')
      }
      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true
      })

      if (!user) return errorResponse(res, 404, 'User not found')

      user.password = undefined
      return successResponse(res, 200, { user }, 'Profile updated successfully')
    } catch (error) {
      console.error('Update profile error:', error)
      return errorResponse(res, 500, 'Error updating profile')
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.userId

      // 1. Xóa user khỏi DB
      await User.findByIdAndDelete(userId)

      // 2. Xóa refresh token khỏi Redis
      await redisClient.del(userId.toString())

      // 3. Xóa cookie ở client
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })

      return successResponse(res, 200, null, 'Account deleted successfully')
    } catch (error) {
      console.error('Delete account error:', error)
      return errorResponse(res, 500, 'Error deleting account')
    }
  }
  async getUserHistory(req, res, next) {
    try {
      const userId = req.user.userId
      const bookings = await axios.get(`${BOOKING_SERVICE_URL}/api/bookings/user/${userId}`)
      return successResponse(res, 200, { bookings }, 'User history retrieved successfully')
    } catch (error) {
      console.error('Get user history error:', error)
      return errorResponse(res, 500, 'Error retrieving user history')
    }
    
  }
}

module.exports = new UserController()