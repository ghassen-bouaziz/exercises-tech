const express = require('express');
const router = express.Router();
const TaskModel = require('../models/task');
const UserModel = require('../models/user');
const AssignementModel = require('../models/assignement');
const CommentModel = require('../models/comment');
const { ERROR_CODES } = require('../utils');


// Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, status, user_id, priority, dueDate } = req.body;

        const user = await UserModel.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: ERROR_CODES.USER_NOT_FOUND });
        }

        const task = new TaskModel({
            title,
            description,
            status,
            priority,
            dueDate,
            createdBy: {
                user_id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

        await task.save();
        res.status(201).json({ ok: true, data: task });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message || ERROR_CODES.FAILED_TO_CREATE_TASK });
    }
});

// Assign task to user
router.post('/assign', async (req, res) => {
    try {
        const { task_id, user_id } = req.body;
        const task = await TaskModel.findById(task_id);
        if (!task) return res.status(404).json({ ok: false, error: ERROR_CODES.TASK_NOT_FOUND });

        const user = await UserModel.findById(user_id);
        if (!user) return res.status(404).json({ ok: false, error: ERROR_CODES.USER_NOT_FOUND });

        const assignement = new AssignementModel({
            task: task_id,
            user: user_id
        })

        await assignement.save();
        res.status(200).json({ ok: true, data: assignement });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message || ERROR_CODES.FAILED_TO_ASSIGN_TASK });
    }
});

// Add a comment to a task
router.post('/comments', async (req, res) => {
    try {
        const { text, user_id, task_id } = req.body;

        const task = await TaskModel.findById(task_id);
        if (!task) return res.status(404).json({ ok: false, error: ERROR_CODES.TASK_NOT_FOUND });

        const user = await UserModel.findById(user_id);
        if (!user) return res.status(404).json({ ok: false, error: ERROR_CODES.USER_NOT_FOUND });

        const comment = new CommentModel({
            task: task_id,
            text,
            user_id: user._id,
            user_name: user.name,
            user_avatar: user.avatar
        });

        await comment.save();
        res.status(201).json({ ok: true, data: comment });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message || ERROR_CODES.FAILED_TO_ADD_COMMENT });
    }
});

module.exports = router;