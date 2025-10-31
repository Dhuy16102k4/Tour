const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.get('/', notificationController.getAllNotifications);
router.get('/user/:userId', notificationController.getUserNotifications);
router.post('/', notificationController.sendNotification);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;

