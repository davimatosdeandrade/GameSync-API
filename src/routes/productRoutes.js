const router = require('express').Router();
const productController = require('../controllers/productController');

router.get('/catalog', productController.getCatalog);  
router.get('/highlights', productController.getHighlights);
router.get('/product/:id', productController.getProductByPk);

module.exports = router;