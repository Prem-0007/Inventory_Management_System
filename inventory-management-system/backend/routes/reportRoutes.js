const express = require('express');
const router = express.Router();
const { lowStockReport, productSummary, supplierSummary } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/low-stock', lowStockReport);
router.get('/product-summary', productSummary);
router.get('/supplier-summary', supplierSummary);

module.exports = router;
