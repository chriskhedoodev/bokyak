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
    }
});

module.exports = mongoose.model('posts', postSchema);