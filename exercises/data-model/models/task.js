const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['todo', 'in_progress', 'review', 'done'],
        default: 'todo'
    },
    createdBy: {
        user_id: String,
        name: String,
        email: String,
        avatar: String
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: Date,
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;