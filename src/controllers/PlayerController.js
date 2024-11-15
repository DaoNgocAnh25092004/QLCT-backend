const Player = require('../models/Player');
const User = require('../models/Account');

class PlayerController {
    // [GET] /api/player/get-all
    async getAllInfo(req, res, next) {
        try {
            const users = await User.find({});

            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /api/player//get-details/:id
    async getDetailsInfo(req, res, next) {
        try {
            const userId = req.params.id;
            const player = await Player.findOne({ playerId: userId });
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
            const { name, email, phone, address, avatar, gender, dayOfBirth } = req.body;

            const checkUser = await User.findOne({ userId: userId });

            if (!checkUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            checkUser.name = name || checkUser.name;
            checkUser.email = email || checkUser.email;
            checkUser.phone = phone || checkUser.phone;

            const player = await Player.findOne({ playerId: userId });
            if (!player) {
                return res.status(404).json({ error: 'Player not found' });
            }

            player.address = address || player.address;
            player.avatar = avatar || player.avatar;
            player.gender = gender || player.gender;
            player.dob = dayOfBirth || player.dob;

            if (req.file && req.file.path) {
                player.avatar = req.file.path;
            }

            await checkUser.save();
            await player.save();

            res.status(200).json({ message: 'User and player updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PlayerController();
