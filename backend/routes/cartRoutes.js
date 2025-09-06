const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const{ getOrCreateCart } = require('../controller/cartController');

const router = express.Router();

router.get('/', authenticateToken, getOrCreateCart);

module.exports = router;