const express = require('express');
const { register, login, getProfile,updateUserProfile } = require('../controller/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegistration,register);
router.post('/login', login);

router.get('/getProfile', authenticateToken,getProfile);
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;
