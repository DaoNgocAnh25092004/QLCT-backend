const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Subschema cho Friends
const FriendsSchema = new Schema({
    friendId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    friendSince: {
        type: Date,
    },
    status: {
        type: String,
    },
});

// Subschema cho GameLibrary
const GameLibrarySchema = new Schema({
    gameId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
    },
    lastPlayed: {
        type: Date,
    },
    score: {
        type: Number,
    },
    achievements: {
        type: [String],
    },
});

// Schema cho Player
const PlayerSchema = new Schema(
    {
        fullName: {
            type: String,
        }
        ,
        avatar: {
            type: String,
        },
        dob: {
            type: String,
        },
        address: {
            type: String,
        },
        gender: {
            type: String,
        },
        friends: [FriendsSchema], // danh sách bạn bè
        gameLibrary: [GameLibrarySchema], // danh sách game trong thư viện của player
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Player', PlayerSchema, 'Players');
