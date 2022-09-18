const router = require('express').Router();
const middleware = require('../middleware/middleware');
const Post = require('../models/post');

router.get('/', middleware.requireLogin, async (req, res) => {
    let userId = req.session.user._id;
    let posts = await Post.find();
    posts.sort((a, b) => b.createdDate - a.createdDate);

    let postViewModels = [];
    for (let post of posts) {
        postViewModels.push({
            content: post.content,
            timeSince: timeSince(post.createdDate)
        });
    }
    return res.render('feed', { posts: postViewModels, userId: userId })
});

router.post('/', middleware.requireLogin, async (req, res) => {
    let { content, userId } = req.body;
    if (!isNullOrWhitespace(content)) {
        await Post.create({
            content: content,
            authorUserId: userId,
            createdDate: new Date()
        });
    }

    return res.redirect('/');
});

function isNullOrWhitespace(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function timeSince(date) {
    var seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return "just now";
}

module.exports = router;