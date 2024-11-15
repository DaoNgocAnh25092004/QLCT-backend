const User = require('../models/Account');
const Player = require('../models/Player');

class UserController {
    // [GET] /api/user/get-all
    async getAllUser(req, res, next) {
        try {
            const users = await User.find({});

            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /api/user/:id
    async getDetailsUser(req, res, next) {
        try {
            const userId = req.params.id;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    // [POST] /api/user/sign-up
    async create(req, res, next) {
        try {
            const { name, email, password, phone } = req.body;

            const user = new User({ name, email, password, phone });

            await user.save();

            const newPlayer = new Player({
                playerId: user.userId,
                avatar: '',
                dob: '',
                address: '',
                gender: '',
                friends: [],
                gameLibrary: [],
            });

            await newPlayer.save();

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /api/user/login
    async login(req, res, next) {
        try {
            const { accessToken, refreshToken } = req.user;

            res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /api/user/logout
    async logout(req, res, next) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
            });

            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /api/user/update/:id
    async updateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const data = req.body;

            const updatedUser = await User.findByIdAndUpdate(userId, data, {
                new: true,
                runValidators: true,
            });

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /api/user/delete/:id
    async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;

            await User.findByIdAndDelete(userId);

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
