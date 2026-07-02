const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const InventoryLog = require('../models/InventoryLog');

const getSummary = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalSuppliers = await Supplier.countDocuments();

  const stockAgg = await Product.aggregate([
    { $group: { _id: null, totalStock: { $sum: '$quantity' } } }
  ]);
  const totalStock = stockAgg.length ? stockAgg[0].totalStock : 0;

  const lowStockProducts = await Product.find({
    $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
  }).populate('supplier', 'name');

  const recentLogs = await InventoryLog.find().sort({ createdAt: -1 }).limit(10);

  res.json({
    totalProducts,
    totalSuppliers,
    totalStock,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentLogs
  });
};

module.exports = { getSummary };
