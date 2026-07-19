const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { findUser } = require('../../utils/users');
const verifyCaptcha = require('../../utils/verifyCaptcha');
const generateApiKey = require('../../utils/apiKey');

const REQUESTS_LIMIT = 1000;
const RESET_DAYS = 30;

router.post('/', async (req, res) => {

    try {

        const { username, password, captchaToken } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: false,
                creator: 'Edward',
                error: 'Faltan username o password'
            });
        }

        const captchaOk = await verifyCaptcha(captchaToken);

        if (!captchaOk) {
            return res.status(400).json({
                status: false,
                creator: 'Edward',
                error: 'Captcha inválido'
            });
        }

        const user = await findUser(username);

        if (!user) {
            return res.status(401).json({
                status: false,
                creator: 'Edward',
                error: 'Usuario o contraseña incorrectos'
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                status: false,
                creator: 'Edward',
                error: 'Usuario o contraseña incorrectos'
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                status: false,
                creator: 'Edward',
                error: 'Falta JWT_SECRET en el .env del servidor'
            });
        }

        // Auto-migración: si esta cuenta se creó antes de tener API keys, se la asignamos ahora
        if (!user.apiKey) {
            user.apiKey = generateApiKey();
            user.requestsUsed = user.requestsUsed || 0;
            user.requestsLimit = user.requestsLimit || REQUESTS_LIMIT;
            user.resetAt =
                user.resetAt || new Date(Date.now() + RESET_DAYS * 24 * 60 * 60 * 1000);

            await user.save();
        }

        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            status: true,
            creator: 'Edward',
            token,
            apiKey: user.apiKey,
            requestsUsed: user.requestsUsed || 0,
            requestsLimit: user.unlimited ? null : (user.requestsLimit || REQUESTS_LIMIT),
            unlimited: !!user.unlimited
        });

    } catch (err) {

        res.status(500).json({
            status: false,
            creator: 'Edward',
            error: err.message
        });

    }

});

module.exports = router;
