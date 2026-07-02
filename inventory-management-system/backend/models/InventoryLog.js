const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    changeType: { type: String, enum: ['increase', 'decrease'], required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedByName: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
