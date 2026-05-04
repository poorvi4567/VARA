const express = require('express');
const router = express.Router();
const {
    createOrder,
    createRazorpayOrder,
    verifyPayment,
    getMyOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes require login
router.post('/', protect, createOrder);                              // POST /api/orders
router.get('/my', protect, getMyOrders);                            // GET /api/orders/my
router.post('/create-razorpay-order', protect, createRazorpayOrder); // POST /api/orders/create-razorpay-order
router.post('/verify-payment', protect, verifyPayment);             // POST /api/orders/verify-payment

module.exports = router;