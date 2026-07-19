const fs = require('fs');
const path = require('path');

/**
 * Recorre recursivamente /endpoints y monta cada archivo .js como router.
 * El path de montaje se arma con la ruta de carpetas + nombre de archivo.
 *
 * Ejemplo:
 *   endpoints/download/ytaudio.js  ->  GET /download/ytaudio
 *   endpoints/search/ytsearch.js   ->  GET /search/ytsearch
 *
 * Cada archivo debe exportar un express.Router (router.get('/', ...) + module.exports = router).
 */
function loadRoutes(app, dir, basePath = '/') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            loadRoutes(app, fullPath, path.posix.join(basePath, entry.name));
            continue;
        }

        if (!entry.name.endsWith('.js')) continue;

        const routeName = entry.name.replace(/\.js$/, '');
        const mountPath = path.posix.join(basePath, routeName);

        try {
            const router = require(fullPath);
            app.use(mountPath, router);
            console.log(`[route] ${mountPath}`);
        } catch (err) {
            console.error(`[route error] ${fullPath}:`, err.message);
        }
    }
}

module.exports = loadRoutes;