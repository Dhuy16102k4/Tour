const mongoose = require('mongoose') 

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'wallet'],
    default: 'credit_card'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  failureReason: {
    type: String
  },
  processedAt: {
    type: Date
  },
  refundedAt: {
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

paymentSchema.index({ bookingId: 1 }) 
paymentSchema.index({ userId: 1, createdAt: -1 }) 
paymentSchema.index({ status: 1 }) 

module.exports = mongoose.model('Payment', paymentSchema) 

