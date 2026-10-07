const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },
    shippingAddress: { type: String },
    paymentMethod: { type: String },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        qty: { type: Number, default: 1 },
        quantity: { type: Number, default: 1 },
        image: String,
        imageUrl: String,
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      default: 'placed',
      enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled', 'processed', 'on_the_way'],
    },
    orderNumber: { type: String },
    driverId: { type: String },
    deliveryOtp: { type: String },
    timeline: [
      {
        status: String,
        label: String,
        description: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
