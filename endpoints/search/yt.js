const express = require('express');
const yts = require('yt-search');
const router = express.Router();

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
        const result = await yts(query);

        const videos = result.videos.slice(0, 10).map(v => ({
            title: v.title,
            videoId: v.videoId,
            url: v.url,
            duration: v.timestamp,
            views: v.views,
            author: v.author.name,
            thumbnail: v.thumbnail
        }));

        res.json({
            status: true,
            creator: 'Edward',
            query,
            results: videos
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