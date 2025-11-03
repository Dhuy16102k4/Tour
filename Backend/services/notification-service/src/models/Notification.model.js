const mongoose = require('mongoose') 

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['booking_confirmation', 'booking_cancellation', 'payment_confirmation', 'payment_failure', 'tour_update', 'general']
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
}) 

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 }) 

module.exports = mongoose.model('Notification', notificationSchema) 

