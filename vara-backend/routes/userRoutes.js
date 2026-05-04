const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

router.get('/profile', protect, getProfile);       // GET /api/users/profile
router.patch('/profile', protect, updateProfile);  // PATCH /api/users/profile

module.exports = router;