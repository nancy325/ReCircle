const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart
} = require('../controller/cartController');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, getCart);

// Add item to cart
router.post('/items', authenticateToken, addItemToCart);

// Update cart item quantity
router.put('/items/:itemId', authenticateToken, updateCartItem);

// Remove item from cart
router.delete('/items/:itemId', authenticateToken, removeItemFromCart);

module.exports = router;
