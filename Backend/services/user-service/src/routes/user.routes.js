const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

const { verifyToken, restrictTo } = require('../../../../shared/middleware/auth')

const { upload, uploadToCloudinary } = require('../../../../shared/middleware/image.middleware')


const processAvatar = async (req, res, next) => {
  try {
    if (!req.file) return next() 

    const result = await uploadToCloudinary(req.file.buffer)
    req.body.avatar = result.secure_url 
    next()
  } catch (error) {
    next(error)
  }
}

//
router.use(verifyToken)

// Các route cho người dùng tự quản lý profile
router.get('/me', userController.getCurrentUser)
router.put('/me/update', userController.updateProfile)
router.delete('/me/delete', userController.deleteAccount)

//upload avatar 
router.put(
  '/me/avatar',
  upload.single('avatar'),  
  processAvatar,            
  userController.updateAvatar 
)

// --- Admin Routes ---
router.get(
  '/:id', 
  restrictTo('admin', 'tour-guide'),
  userController.getUserById
)

module.exports = router