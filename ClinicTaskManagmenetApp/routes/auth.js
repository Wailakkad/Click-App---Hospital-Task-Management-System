const experss = require('express');
const router = experss.Router();
const authController = require('../controllers/authControler');


router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;