const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const authorize = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/user/:userId', productController.getUserProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/search', productController.searchProducts);

// Protected routes (require JWT)
router.post('/', authorize, productController.createProduct);
router.put('/:id', authorize, productController.updateProduct);
router.delete('/:id', authorize, productController.deleteProduct);

module.exports = router;