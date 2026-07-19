require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const loadRoutes = require('./utils/loadRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: true,
        creator: 'Edward',
        message: 'API activa'
    });
});

// Monta automáticamente todo lo que haya en /endpoints
loadRoutes(app, path.join(__dirname, 'endpoints'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});