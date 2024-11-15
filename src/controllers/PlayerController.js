const Player = require('../models/Player');
const Account = require('../models/Account');

class PlayerController {
    // [GET] /api/player/get-all
    async getAllInfo(req, res, next) {
        try {
            const accounts = await Account.find({});

            res.json(accounts);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /api/player//get-details/:id
    async getDetailsInfo(req, res, next) {
        try {
            const userId = req.params.id;
            const player = await Player.findOne({ _id: userId });
            if (!player) {
                return res.status(404).json({ error: 'Player not found' });
            }

            res.status(200).json(player);
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /api/player/update/:id
    async updatePlayer(req, res, next) {
        try {
            const userId = req.params.id;
            const { fullName ,username, email, phone, address, avatar, gender, dayOfBirth } = req.body;

            const checkAccount = await User.findOne({ userId: userId });

            if (!checkAccount) {
                return res.status(404).json({ error: 'Account not found' });
            }

            checkAccount.username = username || checkAccount.username;
            checkAccount.email = email || checkAccount.email;
            checkAccount.phone = phone || checkAccount.phone;

            const player = await Player.findOne({ playerId: userId });
            if (!player) {
                return res.status(404).json({ error: 'Player not found' });
            }

            player.address = address || player.address;
            player.avatar = avatar || player.avatar;
            player.gender = gender || player.gender;
            player.dob = dayOfBirth || player.dob;
            player.fullName = fullName || player.fullName

            if (req.file && req.file.path) {
                player.avatar = req.file.path;
            }

            await checkAccount.save();
            await player.save();

            res.status(200).json({ message: 'Account and player updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PlayerController();
