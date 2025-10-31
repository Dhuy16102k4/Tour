const Notification = require('../models/Notification.model');
const { successResponse, errorResponse } = require('../../../shared/utils/response');
const emailService = require('../services/email.service');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

exports.getAllNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const notifications = await Notification.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments();

    return successResponse(res, 200, {
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'Notifications retrieved successfully');
  } catch (error) {
    console.error('Get notifications error:', error);
    return errorResponse(res, 500, 'Error retrieving notifications');
  }
};

exports.getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, unread } = req.query;

    const query = { userId };
    if (unread === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);

    return successResponse(res, 200, {
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'User notifications retrieved successfully');
  } catch (error) {
    console.error('Get user notifications error:', error);
    return errorResponse(res, 500, 'Error retrieving user notifications');
  }
};

exports.sendNotification = async (req, res, next) => {
  try {
    const { userId, type, message, data } = req.body;

    // Get user details for email notification
    let userEmail = null;
    try {
      const userResponse = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
      userEmail = userResponse.data.data.user.email;
    } catch (error) {
      console.error('Error fetching user:', error);
    }

    // Create notification in database
    const notification = await Notification.create({
      userId,
      type,
      message,
      data
    });

    // Send email notification
    if (userEmail && ['booking_confirmation', 'payment_confirmation', 'booking_cancellation'].includes(type)) {
      try {
        await emailService.sendEmail({
          to: userEmail,
          subject: `Tour Booking: ${message}`,
          text: message,
          html: `<p>${message}</p>`
        });
      } catch (error) {
        console.error('Email sending error:', error);
      }
    }

    return successResponse(res, 201, { notification }, 'Notification sent successfully');
  } catch (error) {
    console.error('Send notification error:', error);
    return errorResponse(res, 500, 'Error sending notification');
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true, readAt: new Date() }, {
      new: true
    });

    if (!notification) {
      return errorResponse(res, 404, 'Notification not found');
    }

    return successResponse(res, 200, { notification }, 'Notification marked as read');
  } catch (error) {
    console.error('Mark as read error:', error);
    return errorResponse(res, 500, 'Error marking notification as read');
  }
};

