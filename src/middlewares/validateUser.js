const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('./jwtAuth');

const validateSignUp = async (req, res, next) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!/^\d{10,11}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ name }, { email }],
        });

        if (existingUser) {
            if (existingUser.name === name) {
                return res.status(400).json({ error: 'name already in use' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;

        next();
    } catch (error) {
        next(error);
    }
};

const validateLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken({
            id: user._id,
            role: user.role,
            userId: user.userId,
        });
        const refreshToken = generateRefreshToken({
            id: user._id,
            role: user.role,
            userId: user.userId,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
        });

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            accessToken,
        };

        next();
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred, please try again later',
        });
    }
};

const validateUpdateUser = async (req, res, next) => {
    const { name, email, password, phone, role } = req.body;
    const userId = req.params.id;

    // Kiểm tra xem userId có tồn tại hay không
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const checkUser = await User.findById(userId);
        if (!checkUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Nếu không có trường nào được cung cấp, trả về lỗi
        if (!name && !email && !phone && !password && !role) {
            return res.status(400).json({ error: 'At least one field is required to update' });
        }

        // Nếu role không phải là admin hoặc user, trả về lỗi
        if (role && role !== 'admin' && role !== 'user') {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Nếu email được cung cấp, kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Nếu phone được cung cấp, kiểm tra định dạng phone
        if (phone && !/^[0-9]{10,11}$/.test(phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        // Nếu password được cung cấp, hash password trước khi lưu vào cơ sở dữ liệu
        if (password) {
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(password, saltRounds);
        }

        // Kiểm tra xem name hoặc email có bị trùng lặp với người dùng khác không
        const existingUser = await User.findOne({
            $or: [{ name }, { email }],
            _id: { $ne: userId },
        });

        if (existingUser) {
            if (existingUser.name === name) {
                return res.status(400).json({ error: 'name already in use' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred, please try again later',
        });
    }
};

const validateDeleteUser = async (req, res, next) => {
    const userId = req.params.id;

    // Check userId is required
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const checkUser = await User.findById({ _id: userId });
    if (!checkUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    verifyAccessToken(req, res, next);
};

// Cấp lại access token khi access token hết hạn bằng cách sử dụng refresh token
const refreshAccessToken = async (req, res) => {
    const refreshToken = req.headers.authorization || req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token missing' });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    try {
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newAccessToken = generateAccessToken({
            id: user._id,
            role: user.role,
        });

        user.access_token = newAccessToken;
        await user.save();

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred, please try again later',
        });
    }
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
        req.user = { id: decoded.id, role: decoded.role };

        next();
    });
};

// Middleware yêu cầu người dùng có vai trò admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: admin only' });
    }
    next();
};

// Middleware cho phép admin hoặc chính người dùng truy cập
const requireSelfOrAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.params.id !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Access denied: you can only view your own account' });
    }
    next();
};

module.exports = {
    validateSignUp,
    validateLogin,
    validateUpdateUser,
    validateDeleteUser,
    refreshAccessToken,
    verifyToken,
    requireAdmin,
    requireSelfOrAdmin,
};
