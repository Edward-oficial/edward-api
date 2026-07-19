const bcrypt = require('bcryptjs');
const { readUsers, writeUsers } = require('./users');
const generateApiKey = require('./apiKey');

// Cuenta de administrador que se crea sola si no existe.
// La contraseña es el mismo correo (tal como se pidió).
const ADMIN_EMAIL = 'cololacalempira5@gmail.com';
const ADMIN_PASSWORD = 'cololacalempira5@gmail.com';

async function seedAdmin() {

    const users = readUsers();

    let admin = users.find(
        u => u.username.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );

    let changed = false;

    if (!admin) {
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

        admin = {
            username: ADMIN_EMAIL,
            password: hash,
            createdAt: new Date().toISOString()
        };

        users.push(admin);
        changed = true;

        console.log('Cuenta admin creada automáticamente:', ADMIN_EMAIL);
    }

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

    if (admin.requestsUsed === undefined) {
        admin.requestsUsed = 0;
        changed = true;
    }

    if (changed) {
        writeUsers(users);
        console.log('Cuenta admin actualizada. API key:', admin.apiKey);
    }
}

module.exports = { seedAdmin, ADMIN_EMAIL };
