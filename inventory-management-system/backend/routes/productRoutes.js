const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);
router.post('/:id/stock', adjustStock);

module.exports = router;
