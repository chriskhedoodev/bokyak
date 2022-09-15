const router = require('express').Router();
const middleware = require('../middleware/middleware');
const Post = require('../models/post');

router.get('/', middleware.requireLogin, async (req, res) => {
    let userId = req.session.user._id;
    let posts = await Post.find();
    console.log(posts);
    return res.render('feed', { posts: posts, userId: userId })
});

router.post('/', middleware.requireLogin, async (req, res) => {
    let { content, userId } = req.body;
    if (!isNullOrWhitespace(content)) {
        let newPost = await Post.create({
            content: content,
            authorUserId: userId
        });
    }

    return res.redirect('/');
});

function isNullOrWhitespace(str) {
    return str === null || str.match(/^ *$/) !== null;
}

module.exports = router;