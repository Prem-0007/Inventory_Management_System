const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

const lowStockReport = async (req, res) => {
  const products = await Product.find({
    $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
  }).populate('supplier', 'name email');
  res.json(products);
};

const productSummary = async (req, res) => {
  const byCategory = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
      }
    },
    { $sort: { totalValue: -1 } }
  ]);
  res.json(byCategory);
};

const supplierSummary = async (req, res) => {
  const suppliers = await Supplier.find();
  const result = await Promise.all(
    suppliers.map(async (supplier) => {
      const products = await Product.find({ supplier: supplier._id });
      const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
      const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
      return {
        supplierId: supplier._id,
        name: supplier.name,
        totalProducts: products.length,
        totalQuantity,
        totalValue
      };
    })
  );
  res.json(result);
};

module.exports = { lowStockReport, productSummary, supplierSummary };
