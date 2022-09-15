const router = require('express').Router();
const Post = require('../models/post');
const middleware = require('../middleware/middleware');

router.get('/', middleware.requireLogin, async (req, res) => {
    return res.render('feed');
});

module.exports = router;