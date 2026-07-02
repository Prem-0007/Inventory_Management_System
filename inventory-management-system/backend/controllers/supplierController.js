const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

const getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  res.json(suppliers);
};

const getSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
  res.json(supplier);
};

const createSupplier = async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name || !email || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const supplier = await Supplier.create({ name, email, phone, address });
  res.status(201).json(supplier);
};

const updateSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

  Object.assign(supplier, req.body);
  await supplier.save();
  res.json(supplier);
};

const deleteSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

  const linkedProducts = await Product.countDocuments({ supplier: supplier._id });
  if (linkedProducts > 0) {
    return res.status(400).json({ message: 'Cannot delete supplier with linked products' });
  }

  await supplier.deleteOne();
  res.json({ message: 'Supplier removed' });
};

module.exports = { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
