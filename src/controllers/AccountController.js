const Account = require('../models/Account');
const Player = require('../models/Player');

class AccountController {
    // [GET] /api/account/get-all
    async getAllAccount(req, res, next) {
        try {
            const accounts = await Account.find({});

            res.json(accounts);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /api/account/:id
    async getDetailsAccount(req, res, next) {
        try {
            const userId = req.params.id;

            const account = await Account.findById(userId);

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.status(200).json(account);
        } catch (error) {
            next(error);
        }
    }

    // [POST] /api/account/sign-up
    async create(req, res, next) {
        try {
            const newPlayer = new Player({
                avatar: '',
                fullName: '',
                dob: '',
                address: '',
                gender: '',
                friends: [],
                gameLibrary: [],
            });

            await newPlayer.save();

            const { username, email, password, phone } = req.body;

            const account = new Account({ userId: newPlayer._id, username, email, password, phone });

            await account.save();

            res.status(201).json({ message: 'Account created successfully' });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /api/account/login
    async login(req, res, next) {
        try {
            const { accessToken, refreshToken } = req.account;
            console.log("🚀 ~ AccountController ~ login ~ req.accoun:", req.account)

            res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /api/account/logout
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

    // [PUT] /api/account/update/:id
    async updateAccount(req, res, next) {
        try {
            const userId = req.params.id;
            const data = req.body;

            const updateAccount = await Account.findByIdAndUpdate(userId, data, {
                new: true,
                runValidators: true,
            });

            if (!updateAccount) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.status(200).json(updateAccount);
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /api/account/delete/:id
    async deleteAccount(req, res, next) {
        try {
            const userId = req.params.id;

            await Account.findByIdAndDelete(userId);

            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccountController();
