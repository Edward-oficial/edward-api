const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { readUsers } = require('../../utils/users');
const { ADMIN_EMAIL } = require('../../utils/seedAdmin');

router.get('/', (req, res) => {

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

        if (payload.username !== ADMIN_EMAIL) {
            return res.status(403).json({
                status: false,
                creator: 'Edward',
                error: 'No tienes permisos de administrador'
            });
        }

        const users = readUsers().map(u => ({
            username: u.username,
            role: u.role || 'user',
            createdAt: u.createdAt
        }));

        res.json({
            status: true,
            creator: 'Edward',
            users
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
