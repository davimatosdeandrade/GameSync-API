const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getCatalog);
router.get('/products/:id', productController.getProductDetails);
router.post('/products', productController.create);

module.exports = router;