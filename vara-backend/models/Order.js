const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // Which user placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Array of products + quantities + price at time of purchase
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: String,       // Store name at purchase time
                price: Number,      // Store price at purchase time
                quantity: Number,
                image_url: String,
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        // Filled in after payment succeeds
        razorpay_order_id: String,
        razorpay_payment_id: String,
        razorpay_signature: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);