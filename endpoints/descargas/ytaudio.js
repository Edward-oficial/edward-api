const express = require('express');
const savetube = require('../../utils/savetube');
const router = express.Router();

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            status: false,
            creator: 'Edward',
            error: 'Falta el parámetro url'
        });
    }

    try {
        const result = await savetube.download(url, 'mp3');

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
