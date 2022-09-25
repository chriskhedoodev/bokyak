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
            postId: post._id,
            content: post.content,
            timeSince: timeSince(post.createdDate),
            score: post.likedUserIds.length - post.dislikedUserIds.length,
            currentUserLikesPost: post.likedUserIds.includes(userId),
            currentUserDislikesPost: post.dislikedUserIds.includes(userId),
            commentCount: post.commentPostIds.length
        });
    }
    return res.render('feed', { posts: postViewModels, userId: userId })
});

router.post('/', middleware.requireLogin, async (req, res) => {
    let content = req.body.content;
    let userId = req.session.user._id;
    if (!isNullOrWhitespace(content)) {
        await Post.create({
            content: content,
            authorUserId: userId,
            createdDate: new Date()
        });
    }

    return res.redirect('/feed');
});

router.post('/:postId/like', middleware.requireLogin, async (req, res) => {
    let postId = req.params.postId;
    let userId = req.session.user._id;

    let post = await Post.findById(postId);
    if (post) {
        if (!post.likedUserIds.includes(userId)) {
            post.likedUserIds.push(userId);
        } else {
            post.likedUserIds = post.likedUserIds.filter(uid => uid !== userId);
        }

        if (post.dislikedUserIds.includes(userId)) {
            post.dislikedUserIds = post.dislikedUserIds.filter(uid => uid !== userId);
        }

        await post.save();
    }

    return res.redirect('/feed');
});

router.post('/:postId/dislike', middleware.requireLogin, async (req, res) => {
    let postId = req.params.postId;
    let userId = req.session.user._id;

    let post = await Post.findById(postId);
    if (post) {
        if (!post.dislikedUserIds.includes(userId)) {
            post.dislikedUserIds.push(userId);
        } else {
            post.dislikedUserIds = post.dislikedUserIds.filter(uid => uid !== userId);
        }

        if (post.likedUserIds.includes(userId)) {
            post.likedUserIds = post.likedUserIds.filter(uid => uid !== userId);
        }

        await post.save();
    }

    return res.redirect('/feed');
});

router.post('/:postId/comment', middleware.requireLogin, async (req, res) => {
    let content = req.body.content;
    let postId = req.params.postId;
    let userId = req.session.user._id;

    if (!isNullOrWhitespace(content)) {
        let post = await Post.findById(postId);
        if (post) {
            let newPost = await Post.create({
                content: content,
                authorUserId: userId,
                createdDate: new Date()
            });

            post.commentPostIds.push(newPost._id);
            await post.save();
        }
    }
});

router.get('/:postId', middleware.requireLogin, async (req, res) => {
    let post = await Post.findById(req.params.postId);
    if (post) {
        let postViewModel = {
            content: post.content,
            timeSince: timeSince(post.createdDate)
        };

        return res.render('post', {
            post: postViewModel
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