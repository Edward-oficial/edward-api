const path = require('path');

function notFound(req, res) {

    if (req.accepts('html')) {
        return res
            .status(404)
            .sendFile(path.join(__dirname, '../public/404.html'));
    }

    return res.status(404).json({
        status: false,
        creator: 'Edward',
        error: 'Endpoint no encontrado'
    });

}

function errorHandler(err, req, res, next) {
    console.error(err);

    if (req.accepts('html')) {
        return res.status(500).send(`
            <h1 style="font-family:sans-serif;text-align:center;margin-top:80px">
                500 - Error interno del servidor
            </h1>
        `);
    }

    return res.status(500).json({
        status: false,
        creator: 'Edward',
        error: 'Error interno del servidor'
    });
}

module.exports = { notFound, errorHandler };