require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const loadRoutes = require('./utils/loadRoutes');
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

// Monta automáticamente todo lo que haya en /endpoints
loadRoutes(app, path.join(__dirname, 'endpoints'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});