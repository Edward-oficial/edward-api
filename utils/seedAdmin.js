const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateApiKey = require('./apiKey');

// Cuenta de administrador que se crea sola si no existe.
// La contraseña es el mismo correo (tal como se pidió).
const ADMIN_EMAIL = 'cololacalempira5@gmail.com';
const ADMIN_PASSWORD = 'cololacalempira5@gmail.com';

async function seedAdmin() {

    let admin = await User.findOne({
        username: new RegExp(`^${ADMIN_EMAIL}$`, 'i')
    });

    if (!admin) {

        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

        admin = await User.create({
            username: ADMIN_EMAIL,
            password: hash,
            role: 'admin',
            unlimited: true,
            apiKey: generateApiKey(),
            requestsUsed: 0
        });

        console.log('Cuenta admin creada automáticamente:', ADMIN_EMAIL);
        return;
    }

    let changed = false;

    if (admin.role !== 'admin') {
        admin.role = 'admin';
        changed = true;
    }

    if (!admin.unlimited) {
        admin.unlimited = true;
        changed = true;
    }

    if (!admin.apiKey) {
        admin.apiKey = generateApiKey();
        changed = true;
    }

    if (admin.requestsUsed === undefined || admin.requestsUsed === null) {
        admin.requestsUsed = 0;
        changed = true;
    }

    if (changed) {
        await admin.save();
        console.log('Cuenta admin actualizada. API key:', admin.apiKey);
    }
}

module.exports = { seedAdmin, ADMIN_EMAIL };
