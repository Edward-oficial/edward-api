function notFound(req, res) {
    res.status(404).json({
        status: false,
        creator: 'Edward',
        error: 'Endpoint no encontrado'
    });
}

function errorHandler(err, req, res, next) {
    console.error('[unhandled error]', err.message);
    res.status(500).json({
        status: false,
        creator: 'Edward',
        error: 'Error interno del servidor'
    });
}

module.exports = { notFound, errorHandler };