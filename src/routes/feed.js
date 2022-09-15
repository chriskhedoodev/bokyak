const router = require('express').Router();
const middleware = require('../middleware/middleware');

router.get('/', middleware.requireLogin, (req, res) => {
    let userId = req.session.user._id;
    return res.render('feed', { userId: userId })
});

module.exports = router;