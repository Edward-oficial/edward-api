const crypto = require('crypto');

function generateApiKey() {
    const random = crypto.randomBytes(16).toString('hex');
    return `Edward-${random}`;
}

module.exports = generateApiKey;
