const fs = require('fs');
const path = require('path');

const apiKeyAuth = require('../middleware/apiKeyAuth');

// Estas categorías NO piden API key (login/registro no pueden pedirla,
// y el panel admin ya se protege solo con JWT)
const EXCLUDED_FROM_APIKEY = ['auth', 'admin'];

/**
 * Recorre recursivamente /endpoints y monta cada archivo .js como router.
 * El path de montaje se arma con la ruta de carpetas + nombre de archivo.
 *
 * Ejemplo:
 *   endpoints/download/ytaudio.js  ->  GET /download/ytaudio
 *   endpoints/search/ytsearch.js   ->  GET /search/ytsearch
 *
 * Cada archivo debe exportar un express.Router (router.get('/', ...) + module.exports = router).
 * Cualquier categoría que no esté en EXCLUDED_FROM_APIKEY exige ?apikey=TU_API_KEY.
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

        const category = mountPath.split('/').filter(Boolean)[0];
        const needsApiKey = !EXCLUDED_FROM_APIKEY.includes(category);

        try {
            const router = require(fullPath);

            if (needsApiKey) {
                app.use(mountPath, apiKeyAuth, router);
            } else {
                app.use(mountPath, router);
            }

            console.log(`[route] ${mountPath}${needsApiKey ? ' (requiere apikey)' : ''}`);
        } catch (err) {
            console.error(`[route error] ${fullPath}:`, err.message);
        }
    }
}

module.exports = loadRoutes;
