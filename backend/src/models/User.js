const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, default: 'user', enum: ['user', 'vendor', 'driver', 'admin'] },

    // User-specific
    likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isBanned: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    // Vendor-specific
    vendorStatus: { type: String, default: null, enum: [null, 'pending', 'approved', 'rejected', 'suspended'] },
    storeName: { type: String },
    businessCategory: { type: String },
    businessDescription: { type: String },
    businessAddress: { type: String },
    state: { type: String },
    city: { type: String },
    storeLogo: { type: String },
    storeCover: { type: String },
    verificationDocument: { type: String },
    profilePicture: { type: String },

    // Driver-specific
    driverStatus: { type: String, default: null, enum: [null, 'pending', 'approved', 'rejected', 'suspended'] },
    vehicleType: { type: String },
    licenseNumber: { type: String },
    plateNumber: { type: String },
    isOnline: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    completedTrips: { type: Number, default: 0 },
    driverCity: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
