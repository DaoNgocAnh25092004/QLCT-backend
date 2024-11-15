const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            default: () => new mongoose.Types.ObjectId(),
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        phone: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Account', User, 'Accounts');
