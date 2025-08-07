const Task = require('../models/Task');
const User = require('../models/user').User;




exports.createTask = async (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can create tasks' });
    }
    const { title, description, assignedTo } = req.body;

    if (!title || !description || !assignedTo) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newTask = new Task({
            title,
            description,
            assignedTo,
            createdBy: req.user.id,
            status: 'pending'
        });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });

    }catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
}