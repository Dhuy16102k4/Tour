const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

const { verifyToken, restrictTo } = require('../../../../shared/middleware/auth')

router.use(verifyToken)

// Các route cho người dùng tự quản lý profile
router.get('/me', userController.getCurrentUser)
router.put('/me/update', userController.updateProfile)
router.delete('/me/delete', userController.deleteAccount)

// --- Admin Routes ---
router.get(
  '/:id', 
  restrictTo('admin', 'tour-guide'),
  userController.getUserById
)

module.exports = router