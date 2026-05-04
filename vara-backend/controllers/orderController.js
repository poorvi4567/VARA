const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders
// Creates order in MongoDB with status "pending"
const createOrder = async (req, res) => {
    const { items, shippingAddress } = req.body;
    // req.user is attached by authMiddleware
    const userId = req.user._id;

    try {
        // Fetch real prices from DB — never trust prices sent from frontend
        const productIds = items.map((item) => item.product_id);
        const products = await Product.find({ product_id: { $in: productIds } });

        // Build order items with real prices
        const orderItems = items.map((item) => {
            const product = products.find((p) => p.product_id === item.product_id);
            if (!product) throw new Error(`Product ${item.product_id} not found`);
            return {
                product: product._id,
                name: product.name,
                price: product.price,       // From DB, not frontend
                quantity: item.quantity,
                image_url: product.image_url,
            };
        });

        // Calculate total from DB prices
        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            totalAmount,
            status: 'pending',
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/payments/create-razorpay-order
// Creates a Razorpay order to initiate payment
const createRazorpayOrder = async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Razorpay amount is in paise (1 rupee = 100 paise)
        const razorpayOrder = await razorpay.orders.create({
            amount: order.totalAmount * 100,
            currency: 'INR',
            receipt: order._id.toString(),
        });

        // Save razorpay order ID to our order
        order.razorpay_order_id = razorpayOrder.id;
        await order.save();

        res.json({
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderId: order._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/payments/verify
// Verifies Razorpay signature and marks order as paid
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    try {
        // Razorpay signature verification — this is the security check
        // It proves the payment response actually came from Razorpay
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Signature matches — mark order as paid
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                status: 'paid',
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            },
            { new: true }  // Return updated document
        );

        res.json({ message: 'Payment verified', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/orders/my
// Get logged-in user's order history
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 }); // Newest first
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, createRazorpayOrder, verifyPayment, getMyOrders };