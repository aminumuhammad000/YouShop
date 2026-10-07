const asyncHandler = require('express-async-handler');
const RealUser = require('../models/User');
const RealProduct = require('../models/Product');
const RealOrder = require('../models/Order');
const RealWithdrawal = require('../models/Withdrawal');
const RealReview = require('../models/Review');
const { MockUser, MockProduct, MockOrder, MockNotification, MockLog } = require('../models/mockDb');

const getUserModel = () => (global.isMockDB ? MockUser : RealUser);
const getProductModel = () => (global.isMockDB ? MockProduct : RealProduct);
const getOrderModel = () => (global.isMockDB ? MockOrder : RealOrder);

// @desc    Upload and persist vendor profile picture
// @route   POST /api/vendor/profile/picture
const uploadVendorProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Profile picture is required');
  }

  const pictureUrl = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;
  if (global.isMockDB) {
    await MockUser.findByIdAndUpdate(req.user._id, { profilePicture: pictureUrl });
  } else {
    await RealUser.findByIdAndUpdate(req.user._id, { profilePicture: pictureUrl });
  }

  res.json({ profilePicture: pictureUrl, url: pictureUrl });
});

// @desc    Get complete real-time vendor dashboard analytics
// @route   GET /api/vendor/dashboard
const getVendorDashboard = asyncHandler(async (req, res) => {
  const vendorId = req.user?._id;

  // 1. Fetch vendor products
  let products = [];
  if (!global.isMockDB && vendorId) {
    products = await RealProduct.find({ vendorId }).sort({ createdAt: -1 });
    // If vendor has no custom-scoped products yet, show general products or empty
    if (products.length === 0) {
      products = await RealProduct.find({}).sort({ createdAt: -1 }).limit(10);
    }
  } else {
    products = await getProductModel().find({});
  }

  // 2. Fetch orders
  const orders = await getOrderModel().find({}).sort({ createdAt: -1 });

  // 3. Compute real-time statistics
  const totalSales = orders.reduce((sum, ord) => sum + Number(ord.totalPrice || 0), 0);
  const pendingOrders = orders.filter((ord) => {
    const st = (ord.status || '').toLowerCase();
    return st === 'placed' || st === 'processing';
  }).length;
  const activeProducts = products.filter((p) => Number(p.stock || 0) > 0).length;

  res.json({
    products,
    orders,
    stats: {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders,
      totalSales,
      activeProducts,
      trustScore: 4.95,
    },
  });
});

// @desc    Get notifications visible to the authenticated vendor
// @route   GET /api/vendor/notifications
const getVendorNotifications = asyncHandler(async (req, res) => {
  const notifications = await MockNotification.find();
  res.json(notifications);
});

// @desc    Mark vendor notifications as read
// @route   PUT /api/vendor/notifications/read
const markVendorNotificationsRead = asyncHandler(async (req, res) => {
  const notifications = await MockNotification.markAllRead();
  res.json({ success: true, notifications });
});

// @desc    Get authenticated vendor profile
// @route   GET /api/vendor/profile
const getVendorProfile = asyncHandler(async (req, res) => {
  const user = await getUserModel().findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('Vendor profile not found');
  }
  res.json(user);
});

// @desc    Update authenticated vendor profile & store details
// @route   PUT /api/vendor/profile
const updateVendorProfile = asyncHandler(async (req, res) => {
  const {
    storeName,
    businessCategory,
    businessDescription,
    businessAddress,
    phoneNumber,
    state,
    city,
    storeLogo,
    storeCover,
  } = req.body;

  const user = await getUserModel().findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  if (storeName !== undefined) user.storeName = storeName;
  if (businessCategory !== undefined) user.businessCategory = businessCategory;
  if (businessDescription !== undefined) user.businessDescription = businessDescription;
  if (businessAddress !== undefined) user.businessAddress = businessAddress;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  if (state !== undefined) user.state = state;
  if (city !== undefined) user.city = city;
  if (storeLogo !== undefined) user.storeLogo = storeLogo;
  if (storeCover !== undefined) user.storeCover = storeCover;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    phoneNumber: updated.phoneNumber,
    role: updated.role,
    vendorStatus: updated.vendorStatus,
    storeName: updated.storeName,
    businessCategory: updated.businessCategory,
    businessDescription: updated.businessDescription,
    businessAddress: updated.businessAddress,
    state: updated.state,
    city: updated.city,
    storeLogo: updated.storeLogo,
    storeCover: updated.storeCover,
  });
});

// @desc    Get vendor withdrawal records
// @route   GET /api/vendor/withdrawals
const getVendorWithdrawals = asyncHandler(async (req, res) => {
  if (global.isMockDB) {
    return res.json([]);
  }
  const withdrawals = await RealWithdrawal.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(withdrawals);
});

// @desc    Request a vendor payout withdrawal
// @route   POST /api/vendor/withdrawals
const requestVendorWithdrawal = asyncHandler(async (req, res) => {
  const { amount, bankName, accountNumber, accountName, method } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount < 5000) {
    res.status(400);
    throw new Error('Minimum withdrawal amount is ₦5,000');
  }

  const reference = `WTH-${Math.floor(100000 + Math.random() * 900000)}`;

  if (global.isMockDB) {
    return res.status(201).json({
      _id: 'mock_' + Date.now(),
      userId: req.user._id,
      amount: numAmount,
      bankName: bankName || 'Bank',
      accountNumber: accountNumber || '',
      accountName: accountName || '',
      method: method || 'Instant Bank Transfer',
      reference,
      status: 'Pending',
      createdAt: new Date(),
    });
  }

  const record = await RealWithdrawal.create({
    userId: req.user._id,
    userType: 'vendor',
    amount: numAmount,
    bankName,
    accountNumber,
    accountName,
    method: method || 'Instant Bank Transfer',
    reference,
    status: 'Pending',
  });

  res.status(201).json(record);
});

// @desc    Get vendor customer reviews
// @route   GET /api/vendor/reviews
const getVendorReviews = asyncHandler(async (req, res) => {
  if (global.isMockDB) {
    return res.json([]);
  }
  const reviews = await RealReview.find({ vendorId: req.user._id }).sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Reply to customer review
// @route   POST /api/vendor/reviews/:id/reply
const replyToReview = asyncHandler(async (req, res) => {
  const { replyText } = req.body;
  if (!replyText) {
    res.status(400);
    throw new Error('Reply message is required');
  }

  if (global.isMockDB) {
    return res.json({ _id: req.params.id, reply: replyText, repliedAt: new Date() });
  }

  const review = await RealReview.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.reply = replyText;
  review.repliedAt = new Date();
  await review.save();

  res.json(review);
});

// @desc    Fast-track / approve vendor status
// @route   POST /api/vendor/approve
const approveVendor = asyncHandler(async (req, res) => {
  const user = await getUserModel().findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  user.vendorStatus = 'approved';
  if (!global.isMockDB && user.save) {
    await user.save();
  } else {
    await getUserModel().findByIdAndUpdate(req.user._id, { vendorStatus: 'approved' });
  }

  res.json({
    message: 'Storefront verified and approved successfully!',
    vendorStatus: 'approved',
  });
});

// @desc    Get all online & available drivers for vendor logistics radar
// @route   GET /api/vendor/drivers
const getOnlineDrivers = asyncHandler(async (req, res) => {
  const UserModel = getUserModel();
  let drivers = [];

  if (!global.isMockDB) {
    drivers = await RealUser.find({ role: 'driver', isBanned: { $ne: true } })
      .select('-password')
      .sort({ isOnline: -1, rating: -1 });
  } else {
    const all = await UserModel.find({ role: 'driver' });
    drivers = (all || []).map((d) => {
      const { password, ...rest } = d;
      return rest;
    });
  }

  // Fetch orders to calculate active deliveries per driver
  let orders = [];
  try {
    orders = await getOrderModel().find({});
  } catch {
    orders = [];
  }

  const formatted = drivers.map((d) => {
    const dId = String(d._id || d.id || '');
    const activeJobs = orders.filter((o) => {
      const match = String(o.driverId || '') === dId;
      const activeStatus = ['processing', 'shipped', 'on_the_way'].includes(o.status);
      return match && activeStatus;
    }).length;

    return {
      _id: d._id || d.id,
      name: d.name || 'Courier Partner',
      email: d.email || '',
      phoneNumber: d.phoneNumber || d.phone || '080-000-0000',
      vehicleType: d.vehicleType || 'Motorcycle',
      plateNumber: d.plateNumber || 'LND-882-AG',
      driverCity: d.driverCity || d.city || 'Lagos',
      isOnline: Boolean(d.isOnline),
      rating: d.rating || 5.0,
      completedTrips: d.completedTrips || 0,
      driverStatus: d.driverStatus || 'approved',
      activeJobs,
      statusLabel: d.isOnline ? (activeJobs > 0 ? 'On Delivery' : 'Available') : 'Offline',
    };
  });

  res.json(formatted);
});

module.exports = {
  getVendorDashboard,
  uploadVendorProfilePicture,
  getVendorNotifications,
  markVendorNotificationsRead,
  getVendorProfile,
  updateVendorProfile,
  getVendorWithdrawals,
  requestVendorWithdrawal,
  getVendorReviews,
  replyToReview,
  approveVendor,
  getOnlineDrivers,
};
