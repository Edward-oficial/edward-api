const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw || '[]');
    } catch (err) {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function findUser(username) {
    return readUsers().find(
        u => u.username.toLowerCase() === String(username).toLowerCase()
    );
}

module.exports = { readUsers, writeUsers, findUser };