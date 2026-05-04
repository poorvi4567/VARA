const Product = require('../models/Product');

// GET /api/products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        // req.params.id is the :id from the URL
        // We match against product_id (your custom field), not MongoDB's _id
        const product = await Product.findOne({ product_id: Number(req.params.id) });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/products  (Admin only — protected in Phase 3)
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAllProducts, getProductById, createProduct };