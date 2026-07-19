const { readUsers, writeUsers } = require('../utils/users');

const DEFAULT_LIMIT = 1000;
const RESET_DAYS = 30;

function apiKeyAuth(req, res, next) {

    const apiKey = req.query.apikey || req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            status: false,
            creator: 'Edward',
            error: 'Falta la API key. Agrega ?apikey=TU_API_KEY a la petición'
        });
    }

    const users = readUsers();
    const user = users.find(u => u.apiKey === apiKey);

    if (!user) {
        return res.status(401).json({
            status: false,
            creator: 'Edward',
            error: 'API key inválida'
        });
    }

    // Cuenta con solicitudes ilimitadas (la del admin)
    if (user.unlimited) {
        return next();
    }

    const now = Date.now();
    const resetAt = user.resetAt ? new Date(user.resetAt).getTime() : 0;

    if (now >= resetAt) {
        user.requestsUsed = 0;
        user.resetAt = new Date(now + RESET_DAYS * 24 * 60 * 60 * 1000).toISOString();
    }

    const limit = user.requestsLimit || DEFAULT_LIMIT;

    if (user.requestsUsed >= limit) {
        writeUsers(users);

        return res.status(429).json({
            status: false,
            creator: 'Edward',
            error: 'Alcanzaste el límite de solicitudes de tu API key este mes',
            requestsUsed: user.requestsUsed,
            requestsLimit: limit,
            resetAt: user.resetAt
        });
    }

    user.requestsUsed += 1;
    writeUsers(users);

    req.apiUser = {
        username: user.username,
        requestsUsed: user.requestsUsed,
        requestsLimit: limit
    };

    next();
}

module.exports = apiKeyAuth;
