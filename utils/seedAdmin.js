const bcrypt = require('bcryptjs');
const { readUsers, writeUsers, findUser } = require('./users');

// Cuenta de administrador que se crea sola si no existe.
// La contraseña es el mismo correo (tal como se pidió).
const ADMIN_EMAIL = 'cololacalempira5@gmail.com';
const ADMIN_PASSWORD = 'cololacalempira5@gmail.com';

async function seedAdmin() {

    if (findUser(ADMIN_EMAIL)) return;

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const users = readUsers();

    users.push({
        username: ADMIN_EMAIL,
        password: hash,
        role: 'admin',
        createdAt: new Date().toISOString()
    });

    writeUsers(users);

    console.log('Cuenta admin creada automáticamente:', ADMIN_EMAIL);
}

module.exports = { seedAdmin, ADMIN_EMAIL };
