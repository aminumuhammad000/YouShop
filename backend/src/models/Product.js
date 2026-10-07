const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, default: 0 },
  sku: { type: String },
  category: { type: String },
  imageUrl: { type: String },
  images: [{ type: String }],
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
