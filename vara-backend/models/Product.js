const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        product_id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true, // Removes accidental whitespace
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            required: true,
            // Normalize to lowercase so "Toys" and "toys" match consistently
            lowercase: true,
        },
        stock_quantity: {
            type: Number,
            default: 0,
        },
        artisan_id: Number,
        artisan_name: String,
        material_used: String,
        vara_nanya: Number,
        // image_url is now a STRING (a URL), not an imported image file
        image_url: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Auto-adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Product', productSchema);