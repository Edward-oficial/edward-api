const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    apiKey: {
        type: String,
        unique: true,
        sparse: true
    },

    requestsUsed: {
        type: Number,
        default: 0
    },

    requestsLimit: {
        type: Number,
        default: 1000
    },

    resetAt: {
        type: Date
    },

    unlimited: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        default: 'user'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('User', userSchema);
          
