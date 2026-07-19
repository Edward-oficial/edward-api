const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const { readUsers, writeUsers, findUser } = require('../../utils/users');
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

        if (findUser(username)) {
            return res.status(409).json({
                status: false,
                creator: 'Edward',
                error: 'Ese usuario ya existe'
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const users = readUsers();

        const newUser = {
            username,
            password: hash,
            apiKey: generateApiKey(),
            requestsUsed: 0,
            requestsLimit: REQUESTS_LIMIT,
            resetAt: new Date(Date.now() + RESET_DAYS * 24 * 60 * 60 * 1000).toISOString(),
            unlimited: false,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        writeUsers(users);

        res.json({
            status: true,
            creator: 'Edward',
            message: 'Usuario registrado correctamente',
            apiKey: newUser.apiKey,
            requestsLimit: newUser.requestsLimit
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
