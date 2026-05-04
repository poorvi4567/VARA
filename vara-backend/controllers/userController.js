const User = require('../models/User');

// GET /api/users/profile
const getProfile = async (req, res) => {
    try {
        // req.user is already attached by authMiddleware
        // select('-password') excludes the hashed password from response
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PATCH /api/users/profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Only update fields that were actually sent
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        const updated = await user.save();

        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            address: updated.address,
            role: updated.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, updateProfile };