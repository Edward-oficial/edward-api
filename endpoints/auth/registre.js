const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const { readUsers, writeUsers, findUser } = require('../../utils/users');
const verifyCaptcha = require('../../utils/verifyCaptcha');

router.post('/', async (req, res) => {
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

    users.push({
        username,
        password: hash,
        createdAt: new Date().toISOString()
    });

    writeUsers(users);

    res.json({
        status: true,
        creator: 'Edward',
        message: 'Usuario registrado correctamente'
    });
});

module.exports = router;
