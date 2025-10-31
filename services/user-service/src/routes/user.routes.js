const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
// const { verifyToken } = require('../../shared/middleware/auth');

// Public routes
router.get('/:id', userController.getUserById);

// Protected routes - uncomment when auth is ready
// router.use(verifyToken);
// router.get('/me', userController.getCurrentUser);
// router.put('/me', userController.updateProfile);
// router.delete('/me', userController.deleteAccount);

module.exports = router;

