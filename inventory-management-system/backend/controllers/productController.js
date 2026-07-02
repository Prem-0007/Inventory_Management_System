const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');

const getProducts = async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter).populate('supplier', 'name email').sort({ createdAt: -1 });
  res.json(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('supplier', 'name email phone');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

const createProduct = async (req, res) => {
  const { name, sku, category, price, quantity, lowStockThreshold, supplier } = req.body;

  if (!name || !sku || !category || price == null || !supplier) {
    return res.status(400).json({ message: 'Missing required product fields' });
  }

  const existingSku = await Product.findOne({ sku });
  if (existingSku) {
    return res.status(400).json({ message: 'SKU already exists' });
  }

  const product = await Product.create({
    name,
    sku,
    category,
    price,
    quantity: quantity || 0,
    lowStockThreshold: lowStockThreshold || 10,
    supplier
  });

  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const { quantity, ...rest } = req.body;
  Object.assign(product, rest);
  await product.save();
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

const adjustStock = async (req, res) => {
  const { changeType, amount } = req.body;

  if (!['increase', 'decrease'].includes(changeType) || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Provide valid changeType and amount' });
  }

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const previousQuantity = product.quantity;

  if (changeType === 'decrease' && amount > previousQuantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  product.quantity = changeType === 'increase' ? previousQuantity + amount : previousQuantity - amount;
  await product.save();

  await InventoryLog.create({
    product: product._id,
    productName: product.name,
    changeType,
    previousQuantity,
    newQuantity: product.quantity,
    updatedBy: req.user._id,
    updatedByName: req.user.name
  });

  res.json(product);
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, adjustStock };
