const jwt = require('jsonwebtoken');

// check if all required fields are provided
const validateUpdatePlayer = (req, res, next) => {
    const { fullName, username, email, phone, address, avatar, gender, dayOfBirth } = req.body;
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!fullName && !username && !email && !phone && !address && !avatar && !gender && !dayOfBirth) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const phoneRegex = /^\d{10,11}$/;
    if (phone && !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone format' });
    }

    const dayOfBirthRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dayOfBirth && !dayOfBirthRegex.test(dayOfBirth)) {
        return res.status(400).json({ error: 'Invalid date of birth format' });
    }

    next();
};

// Middleware xác thực token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Authentication token missing' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.account = { id: decoded.id, role: decoded.role, playerId: decoded.userId };

        next();
    });
};

// Middleware yêu cầu người dùng có vai trò admin
const requireAdmin = (req, res, next) => {
    if (req.account.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: admin only' });
    }
    next();
};

// Middleware cho phép admin hoặc chính người dùng truy cập
const requireSelfOrAdmin = (req, res, next) => {
    if (req.account.role !== 'admin' && req.params.id !== req.account.playerId.toString()) {
        return res.status(403).json({ error: 'Access denied: you can only view your own account' });
    }
    next();
};

module.exports = {
    validateUpdatePlayer,
    verifyToken,
    requireAdmin,
    requireSelfOrAdmin,
};
