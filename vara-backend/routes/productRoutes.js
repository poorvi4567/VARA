const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
} = require('../controllers/productController');

// Public routes (no auth needed)
router.get('/', getAllProducts);         // GET /api/products
router.get('/:id', getProductById);     // GET /api/products/101

const { protect } = require('../middleware/authMiddleware');
// Protected route (auth middleware added in Phase 3)
router.post('/', protect, createProduct);      // POST /api/products

module.exports = router;