const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
