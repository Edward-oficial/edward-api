const express = require('express');
const axios = require('axios');
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
        const { data } = await axios.get('https://www.tikwm.com/api/', {
            params: {
                url,
                hd: 1
            }
        });

        if (!data || data.code !== 0 || !data.data) {
            return res.status(500).json({
                status: false,
                creator: 'Edward',
                error: 'No se pudo procesar ese link'
            });
        }

        const v = data.data;

        res.json({
            status: true,
            creator: 'Edward',
            title: v.title,
            author: v.author?.nickname,
            duration: v.duration,
            plays: v.play_count,
            likes: v.digg_count,
            comments: v.comment_count,
            cover: v.cover,
            noWatermark: v.play,
            noWatermarkHD: v.hdplay,
            music: v.music
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
