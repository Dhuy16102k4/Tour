const Payment = require('../models/Payment.model') 
const { successResponse, errorResponse } = require('../../../../shared/utils/response') 
const axios = require('axios') 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY) 

const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:3003' 
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005' 

exports.getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query 
    const query = status ? { status } : {} 

    const payments = await Payment.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit) 

    const total = await Payment.countDocuments(query) 

    return successResponse(res, 200, {
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'Payments retrieved successfully') 
  } catch (error) {
    console.error('Get payments error:', error) 
    return errorResponse(res, 500, 'Error retrieving payments') 
  }
} 

exports.getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params 
    const payment = await Payment.findById(id) 
    
    if (!payment) {
      return errorResponse(res, 404, 'Payment not found') 
    }

    return successResponse(res, 200, { payment }, 'Payment retrieved successfully') 
  } catch (error) {
    console.error('Get payment error:', error) 
    return errorResponse(res, 500, 'Error retrieving payment') 
  }
} 

exports.createPayment = async (req, res, next) => {
  try {
    const { bookingId, userId, amount, paymentMethod } = req.body 

    const payment = await Payment.create({
      bookingId,
      userId,
      amount,
      paymentMethod: paymentMethod || 'credit_card',
      status: 'pending'
    }) 

    return successResponse(res, 201, { payment }, 'Payment created successfully') 
  } catch (error) {
    console.error('Create payment error:', error) 
    return errorResponse(res, 500, 'Error creating payment') 
  }
} 

exports.processPayment = async (req, res, next) => {
  try {
    const { id } = req.params 
    const { token } = req.body 

    const payment = await Payment.findById(id) 
    if (!payment) {
      return errorResponse(res, 404, 'Payment not found') 
    }

    if (payment.status !== 'pending') {
      return errorResponse(res, 400, 'Payment already processed') 
    }

    // Process payment with Stripe
    try {
      const charge = await stripe.charges.create({
        amount: Math.round(payment.amount * 100), // Convert to cents
        currency: 'usd',
        source: token,
        description: `Tour booking payment - ${payment.bookingId}`
      }) 

      // Update payment status
      payment.status = 'completed' 
      payment.transactionId = charge.id 
      payment.processedAt = new Date() 
      await payment.save() 

      // Update booking status
      try {
        await axios.put(`${BOOKING_SERVICE_URL}/api/bookings/${payment.bookingId}`, {
          status: 'confirmed',
          paymentStatus: 'paid'
        }) 
      } catch (error) {
        console.error('Booking update error:', error) 
      }

      // Send notification
      try {
        await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
          userId: payment.userId,
          type: 'payment_confirmation',
          message: 'Your payment has been processed successfully'
        }) 
      } catch (error) {
        console.error('Notification error:', error) 
      }

      return successResponse(res, 200, { payment }, 'Payment processed successfully') 
    } catch (stripeError) {
      payment.status = 'failed' 
      payment.failureReason = stripeError.message 
      await payment.save() 

      return errorResponse(res, 400, 'Payment processing failed') 
    }
  } catch (error) {
    console.error('Process payment error:', error) 
    return errorResponse(res, 500, 'Error processing payment') 
  }
} 

exports.refundPayment = async (req, res, next) => {
  try {
    const { id } = req.params 

    const payment = await Payment.findById(id) 
    if (!payment) {
      return errorResponse(res, 404, 'Payment not found') 
    }

    if (payment.status !== 'completed') {
      return errorResponse(res, 400, 'Payment not completed') 
    }

    if (!payment.transactionId) {
      return errorResponse(res, 400, 'No transaction ID found') 
    }

    // Process refund with Stripe
    try {
      const refund = await stripe.refunds.create({
        charge: payment.transactionId
      }) 

      payment.status = 'refunded' 
      payment.refundedAt = new Date() 
      await payment.save() 

      return successResponse(res, 200, { payment, refund }, 'Payment refunded successfully') 
    } catch (stripeError) {
      return errorResponse(res, 400, 'Refund processing failed') 
    }
  } catch (error) {
    console.error('Refund payment error:', error) 
    return errorResponse(res, 500, 'Error refunding payment') 
  }
} 

exports.getPaymentByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params 
    const payment = await Payment.findOne({ bookingId }) 

    if (!payment) {
      return errorResponse(res, 404, 'Payment not found') 
    }

    return successResponse(res, 200, { payment }, 'Payment retrieved successfully') 
  } catch (error) {
    console.error('Get payment by booking error:', error) 
    return errorResponse(res, 500, 'Error retrieving payment') 
  }
} 

