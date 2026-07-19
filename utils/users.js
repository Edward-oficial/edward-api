const User = require('../models/User');

async function readUsers() {
    return User.find({});
}

async function findUser(username) {
    return User.findOne({
        username: new RegExp(`^${username}$`, 'i')
    });
}

async function findByApiKey(apiKey) {
    return User.findOne({ apiKey });
}

async function createUser(data) {
    return User.create(data);
}

module.exports = { readUsers, findUser, findByApiKey, createUser, User };
