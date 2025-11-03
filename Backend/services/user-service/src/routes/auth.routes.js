const express = require('express') 
const router = express.Router() 
const authController = require('../controllers/auth.controller') 
const { verifyToken, restrictTo } = require('../../../../shared/middleware/auth') 

router.post('/register', authController.register) 
router.post('/login', authController.login) 
router.post('/logout', verifyToken, authController.logout) 
router.post('/refresh-token', authController.refreshToken) 

module.exports = router 

