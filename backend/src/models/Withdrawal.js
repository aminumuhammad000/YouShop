const mongoose = require('mongoose');

const withdrawalSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userType: { type: String, enum: ['vendor', 'driver'], default: 'vendor' },
    amount: { type: Number, required: true },
    method: { type: String, default: 'Bank Transfer' },
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    reference: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
