const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const userResponse = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    token: generateToken(user._id),
});

// POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const user = await User.create({ name, email, password, authProvider: 'local' });
        res.status(201).json(userResponse(user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.authProvider !== 'local') {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (await user.matchPassword(password)) {
            res.json(userResponse(user));
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Firebase ID token verification using Google's public keys ---
let cachedKeys = null;
let cacheExpiry = 0;

const getGooglePublicKeys = async () => {
    const now = Date.now();
    if (cachedKeys && now < cacheExpiry) return cachedKeys;

    const res = await fetch(
        'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    );
    const keys = await res.json();

    // Cache based on Cache-Control header (default 6 hours)
    const cacheControl = res.headers.get('cache-control') || '';
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) * 1000 : 3600000;
    cachedKeys = keys;
    cacheExpiry = now + maxAge;

    return keys;
};

// POST /api/auth/google
const googleAuth = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
    }
    try {
        // 1. Decode header to get the key ID (kid)
        const decodedHeader = jwt.decode(idToken, { complete: true });
        if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
            return res.status(401).json({ message: 'Invalid token format' });
        }
        const kid = decodedHeader.header.kid;

        // 2. Fetch Google's public keys and find the matching one
        const publicKeys = await getGooglePublicKeys();
        const publicKey = publicKeys[kid];
        if (!publicKey) {
            return res.status(401).json({ message: 'Invalid token signing key' });
        }

        // 3. Verify the token (signature + claims)
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const decoded = jwt.verify(idToken, publicKey, {
            algorithms: ['RS256'],
            issuer: `https://securetoken.google.com/${projectId}`,
            audience: projectId,
        });

        const email = decoded.email;
        const name = decoded.name || decoded.email.split('@')[0];

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, authProvider: 'google' });
        }

        res.json(userResponse(user));
    } catch (error) {
        console.error('Google auth error:', error.message);
        res.status(401).json({ message: 'Google authentication failed: ' + error.message });
    }
};

module.exports = { registerUser, loginUser, googleAuth };