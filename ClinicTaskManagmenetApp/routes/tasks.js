const experss = require('express');
const router = experss.Router();
const tasksController = require('../controllers/tasksControllers');

// Middleware to check authentication
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a task
router.post('/create', authMiddleware, tasksController.createTask);

module.exports = router;