const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { findUser } = require('../../utils/users');
const verifyCaptcha = require('../../utils/verifyCaptcha');

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

        const user = findUser(username);

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

        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            status: true,
            creator: 'Edward',
            token
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
