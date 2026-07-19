const express = require('express');
const axios = require('axios');
const router = express.Router();

// Nota: este es el endpoint interno que usa pinterest.com para su propio buscador.
// No requiere API key, pero Pinterest puede cambiar su estructura en cualquier momento
// y esto podría dejar de funcionar sin previo aviso.

router.get('/', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            status: false,
            creator: 'Edward',
            error: 'Falta el parámetro q'
        });
    }

    try {
        const sourceUrl = `/search/pins/?q=${encodeURIComponent(query)}`;

        const data = JSON.stringify({
            options: {
                query: query,
                scope: 'pins'
            },
            context: {}
        });

        const { data: response } = await axios.get(
            'https://www.pinterest.com/resource/BaseSearchResource/get/',
            {
                params: {
                    source_url: sourceUrl,
                    data
                },
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'X-Pinterest-PWS-Handler': 'www/search/[scope].js',
                    Accept: 'application/json'
                }
            }
        );

        const results = response?.resource_response?.data?.results || [];

        const pins = results
            .filter(item => item.images)
            .slice(0, 20)
            .map(item => {
                const images = item.images;
                const best =
                    images.orig || images['736x'] || images['564x'] || Object.values(images)[0];

                return {
                    id: item.id,
                    title: item.title || item.grid_title || null,
                    description: item.description || null,
                    image: best?.url || null,
                    width: best?.width || null,
                    height: best?.height || null,
                    link: item.link || `https://www.pinterest.com/pin/${item.id}/`
                };
            });

        if (!pins.length) {
            return res.status(404).json({
                status: false,
                creator: 'Edward',
                error: 'No se encontraron resultados'
            });
        }

        res.json({
            status: true,
            creator: 'Edward',
            query,
            results: pins
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            creator: 'Edward',
            error: err.message
        });
    }
});

module.exports = router;
