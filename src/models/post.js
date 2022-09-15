const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    authorUserId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('posts', postSchema);