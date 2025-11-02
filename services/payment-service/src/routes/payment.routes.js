const express = require('express') 
const router = express.Router() 
const paymentController = require('../controllers/payment.controller') 

router.get('/', paymentController.getAllPayments) 
router.get('/:id', paymentController.getPaymentById) 
router.post('/', paymentController.createPayment) 
router.post('/:id/process', paymentController.processPayment) 
router.post('/:id/refund', paymentController.refundPayment) 
router.get('/booking/:bookingId', paymentController.getPaymentByBooking) 

module.exports = router 

