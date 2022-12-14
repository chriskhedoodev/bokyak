const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: new Date()
    },
    authorUserId: {
        type: String,
        required: true
    },
    likedUserIds: {
        type: [String],
        default: []
    },
    dislikedUserIds: {
        type: [String],
        default: []
    },
    commentPostIds: {
        type: [String],
        default: []
    },
    parentPostId: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('posts', postSchema);