const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/login', userController.loginUser);
router.get('/profile', auth, userController.getProfile);
router.get('/', auth, userController.getAllUsers);
router.post('/register', userController.registerUser);

module.exports = router;
