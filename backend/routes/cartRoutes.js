const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const{ getCart } = require('../controller/cartController');

const router = express.Router();

router.get('/', authenticateToken, getCart);

module.exports = router;