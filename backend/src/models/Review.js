const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    reply: { type: String },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
