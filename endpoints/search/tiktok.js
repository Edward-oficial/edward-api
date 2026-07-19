const express = require('express');
const axios = require('axios');
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
        const { data } = await axios.get('https://www.tikwm.com/api/feed/search', {
            params: {
                keywords: query,
                count: 10,
                cursor: 0
            }
        });

        if (!data || data.code !== 0 || !data.data || !data.data.videos) {
            return res.status(500).json({
                status: false,
                creator: 'Edward',
                error: 'No se encontraron resultados'
            });
        }

        const videos = data.data.videos.map(v => ({
            title: v.title,
            videoId: v.video_id,
            url: `https://www.tiktok.com/@${v.author?.unique_id}/video/${v.video_id}`,
            duration: v.duration,
            plays: v.play_count,
            likes: v.digg_count,
            comments: v.comment_count,
            author: v.author?.nickname,
            cover: v.cover,
            playUrl: v.play
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
