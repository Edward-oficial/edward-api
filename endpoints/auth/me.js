const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { findUser } = require('../../utils/users');

router.get('/', async (req, res) => {

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({
            status: false,
            creator: 'Edward',
            error: 'Falta el token de autorización'
        });
    }

    try {

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await findUser(payload.username);

        if (!user) {
            return res.status(404).json({
                status: false,
                creator: 'Edward',
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            status: true,
            creator: 'Edward',
            username: user.username,
            apiKey: user.apiKey || null,
            requestsUsed: user.requestsUsed || 0,
            requestsLimit: user.unlimited ? null : (user.requestsLimit || 1000),
            unlimited: !!user.unlimited,
            resetAt: user.resetAt || null
        });

    } catch (err) {

        res.status(401).json({
            status: false,
            creator: 'Edward',
            error: 'Token inválido o expirado'
        });

    }

});

module.exports = router;
