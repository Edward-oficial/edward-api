const express = require('express');
const savetube = require('../../utils/savetube');
const router = express.Router();

router.get('/', async (req, res) => {
    const url = req.query.url;
    const quality = req.query.quality || '720';

    if (!url) {
        return res.status(400).json({
            status: false,
            creator: 'Edward',
            error: 'Falta el parámetro url'
        });
    }

    try {
        const result = await savetube.download(url, quality);

        res.json({
            status: true,
            creator: 'Edward',
            ...result
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
