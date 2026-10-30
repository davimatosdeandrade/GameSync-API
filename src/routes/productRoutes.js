const router = require('express').Router();
const productController = require('../controllers/productController');

router.get('/catalog', productController.getCatalog);  
router.get('/highlights', productController.getHighlights);
router.get('/product/:id', productController.getProductByPk);
router.get('/product/:id/similar', productController.getSimilarProducts);

module.exports = router;