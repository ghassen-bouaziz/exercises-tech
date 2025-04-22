const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    text: String,
    user_id: String,
    user_name: String,
    user_avatar: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);