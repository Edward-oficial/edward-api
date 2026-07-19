require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const loadRoutes = require('./utils/loadRoutes');
const connectDB = require('./utils/db');
const { seedAdmin } = require('./utils/seedAdmin');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (página de inicio, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// Páginas de categorías (una página distinta por categoría)
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/descargas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'descargas.html'));
});

app.get('/anime', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'anime.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Monta automáticamente todo lo que haya en /endpoints
loadRoutes(app, path.join(__dirname, 'endpoints'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {

    await connectDB();

    await seedAdmin().catch(err => console.error('Error al crear cuenta admin:', err));

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

}

start().catch(err => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
});