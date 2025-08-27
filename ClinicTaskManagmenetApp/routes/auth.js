const experss = require('express');
const router = experss.Router();
const authController = require('../controllers/authControler');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/reset-password/:token', authController.restePassword);

module.exports = router;