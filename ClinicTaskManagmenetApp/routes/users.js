const experss = require('express');
const router = experss.Router();
const adminActionsController = require('../controllers/AdminActions');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all users, accessible only by admin
router.get('/AllUsers', authMiddleware, adminActionsController.getAllUsers);

module.exports = router;