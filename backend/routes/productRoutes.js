const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/user/:userId', productController.getUserProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/search', productController.searchProducts);

module.exports = router;