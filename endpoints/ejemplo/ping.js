const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        status: true,
        creator: 'Edward',
        message: 'pong'
    });
});

module.exports = router;