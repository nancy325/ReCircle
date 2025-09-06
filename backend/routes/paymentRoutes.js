const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

// Create Razorpay order
router.post('/create-order', paymentController.createOrder);

// Verify payment
router.post('/verify-payment', paymentController.verifyPayment);

// Get payment details
router.get('/payment/:paymentId', paymentController.getPaymentDetails);

module.exports = router;
