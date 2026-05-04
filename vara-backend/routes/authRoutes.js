const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth } = require('../controllers/authController');

router.post('/register', registerUser);   // POST /api/auth/register
router.post('/login', loginUser);         // POST /api/auth/login
router.post('/google', googleAuth);       // POST /api/auth/google

module.exports = router;