const router = require('express').Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getCatalog);  

module.exports = router;