const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, userController.loginUser);
router.get('/profile', auth, userController.getProfile);
router.get('/', auth, userController.getAllUsers);
router.post('/register', registerLimiter, userController.registerUser);

module.exports = router;
