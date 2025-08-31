const experss = require('express');
const router = experss.Router();
const authController = require('../controllers/authControler');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const upload = multer({ dest: 'uploads/' }); // or configure storage as needed


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/reset-password/:token', authController.restePassword);
router.post("/add-staff", authMiddleware,upload.single('profileImage') ,authController.addStaff); // Add this line

module.exports = router;