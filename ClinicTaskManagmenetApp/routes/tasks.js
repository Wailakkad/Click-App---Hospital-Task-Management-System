const experss = require('express');
const router = experss.Router();
const tasksController = require('../controllers/tasksControllers');
const GetUserTask = require('../controllers/tasksControllers');


// Middleware to check authentication
const authMiddleware = require('../middleware/authMiddleware');
// Route to create a task
router.post('/create', authMiddleware, tasksController.createTask);
// Route to get tasks assigned to the logged-in user
router.get('/my-tasks/:userId', GetUserTask.getTasksByUser);
// Route to get completed tasks
router.get('/completed-tasks', authMiddleware , tasksController.GetCompletedTasks);

module.exports = router;