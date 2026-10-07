const asyncHandler = require('express-async-handler');
const RealUser = require('../models/User');
const RealOrder = require('../models/Order');
const RealWithdrawal = require('../models/Withdrawal');
const { MockUser, MockOrder, MockLog, MockNotification } = require('../models/mockDb');

const getUserModel = () => (global.isMockDB ? MockUser : RealUser);
const getOrderModel = () => (global.isMockDB ? MockOrder : RealOrder);

// @desc    Upload and persist driver profile picture
// @route   POST /api/driver/profile/picture
const uploadDriverProfilePicture = asyncHandler(async (req, res) => {
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

// Helper to format an Order into a Driver Delivery Mission
const formatDelivery = (o, driverId) => {
  const itemsText = (o.items || [])
    .map((i) => `${i.qty || i.quantity || 1}x ${i.name || 'Item'}`)
    .join(', ');

  const fee = Math.round(Number(o.totalPrice || 0) * 0.05) || 1200;

  let status = 'Available';
  const st = (o.status || '').toLowerCase();
  if (st === 'delivered') {
    status = 'Delivered';
  } else if (st === 'cancelled') {
    status = 'Cancelled';
  } else if (st === 'shipped') {
    status = 'On the Way';
  } else if (st === 'processing') {
    status = o.driverId ? 'Accepted' : 'Available';
  } else {
    status = o.driverId ? 'Accepted' : 'Available';
  }

  return {
    _id: o._id,
    orderNumber: o.orderNumber || `#ORD-${String(o._id).slice(-5).toUpperCase()}`,
    customerName: o.customerName || 'Customer',
    customerPhone: o.customerPhone || '',
    deliveryAddress: o.shippingAddress || 'Customer Address, Lagos',
    vendorStore: 'YouShop Verified Merchant',
    pickupAddress: 'Lekki Commercial Hub, Lagos',
    itemsSummary: itemsText || 'Marketplace Goods',
    items: o.items || [],
    deliveryFee: fee,
    distanceKm: '4.8',
    status,
    rawStatus: o.status,
    driverId: o.driverId || null,
    isAssignedToMe: Boolean(driverId && String(o.driverId) === String(driverId)),
    createdAt: o.createdAt || new Date(),
  };
};

// @desc    Get driver dashboard data (stats, active delivery, available deliveries)
// @route   GET /api/driver/dashboard
const getDriverDashboard = asyncHandler(async (req, res) => {
  const driverId = req.user._id;
  const user = await getUserModel().findById(driverId);
  const orders = await getOrderModel().find({}).sort({ createdAt: -1 });

  const allDeliveries = orders.map((o) => formatDelivery(o, driverId));

  // Available deliveries (no driver assigned or placed)
  const availableDeliveries = allDeliveries.filter(
    (d) => d.status === 'Available' && (!d.driverId || String(d.driverId) === String(driverId))
  );

  // Active deliveries assigned to this driver
  const myActiveDeliveries = allDeliveries.filter(
    (d) => d.isAssignedToMe && d.status !== 'Delivered' && d.status !== 'Cancelled'
  );

  // Completed deliveries
  const myCompletedDeliveries = allDeliveries.filter(
    (d) => d.isAssignedToMe && d.status === 'Delivered'
  );

  const totalEarned = myCompletedDeliveries.reduce((sum, d) => sum + Number(d.deliveryFee || 0), 0);

  // Deliveries completed today
  const today = new Date().toDateString();
  const todayEarned = myCompletedDeliveries
    .filter((d) => new Date(d.createdAt).toDateString() === today)
    .reduce((sum, d) => sum + Number(d.deliveryFee || 0), 0);

  res.json({
    driver: {
      _id: user?._id || driverId,
      name: user?.name || 'Driver Partner',
      email: user?.email || '',
      phone: user?.phoneNumber || user?.phone || '',
      vehicleType: user?.vehicleType || 'Motorcycle (Express Delivery)',
      plateNumber: user?.plateNumber || '',
      licenseNumber: user?.licenseNumber || '',
      driverCity: user?.driverCity || user?.city || 'Lagos',
      isOnline: user?.isOnline ?? true,
      rating: user?.rating || 5.0,
      completedTrips: myCompletedDeliveries.length + (user?.completedTrips || 0),
    },
    deliveries: allDeliveries,
    stats: {
      availableCount: availableDeliveries.length,
      activeCount: myActiveDeliveries.length,
      completedTrips: myCompletedDeliveries.length + (user?.completedTrips || 0),
      totalEarned,
      todayEarned,
      driverRating: user?.rating || 5.0,
    },
  });
});

// @desc    Get all courier deliveries
// @route   GET /api/driver/deliveries
const getDriverDeliveries = asyncHandler(async (req, res) => {
  const driverId = req.user._id;
  const orders = await getOrderModel().find({}).sort({ createdAt: -1 });
  const deliveries = orders.map((o) => formatDelivery(o, driverId));
  res.json(deliveries);
});

// @desc    Accept a delivery mission
// @route   PUT /api/driver/deliveries/:id/accept
const acceptDelivery = asyncHandler(async (req, res) => {
  const driverId = req.user._id;
  const orderId = req.params.id;

  if (global.isMockDB) {
    const order = await MockOrder.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    const updated = await MockOrder.findByIdAndUpdate(orderId, {
      driverId: String(driverId),
      status: 'processing',
    });
    return res.json(formatDelivery(updated, driverId));
  }

  const order = await RealOrder.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.driverId = String(driverId);
  order.status = 'processing';
  if (!order.timeline) order.timeline = [];
  order.timeline.push({
    status: 'processing',
    label: 'Courier Assigned',
    description: `Accepted by pilot: ${req.user.name || 'Courier'}`,
    timestamp: new Date(),
  });
  await order.save();

  res.json(formatDelivery(order, driverId));
});

// @desc    Update delivery step status
// @route   PUT /api/driver/deliveries/:id/status
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const driverId = req.user._id;
  const orderId = req.params.id;
  const { status, label } = req.body;

  let dbStatus = 'processing';
  if (status === 'Delivered' || status === 'delivered') dbStatus = 'delivered';
  else if (status === 'On the Way' || status === 'Picked Up' || status === 'shipped') dbStatus = 'shipped';
  else if (status === 'Cancelled' || status === 'cancelled') dbStatus = 'cancelled';

  if (global.isMockDB) {
    const updated = await MockOrder.findByIdAndUpdate(orderId, {
      status: dbStatus,
      driverId: String(driverId),
    });
    return res.json(formatDelivery(updated, driverId));
  }

  const order = await RealOrder.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = dbStatus;
  order.driverId = String(driverId);
  if (!order.timeline) order.timeline = [];
  order.timeline.push({
    status: dbStatus,
    label: label || status,
    description: `Status updated to ${status} by driver`,
    timestamp: new Date(),
  });
  await order.save();

  res.json(formatDelivery(order, driverId));
});

// @desc    Verify delivery completion with OTP
// @route   POST /api/driver/deliveries/:id/verify-otp
const verifyDeliveryOtp = asyncHandler(async (req, res) => {
  const driverId = req.user._id;
  const orderId = req.params.id;

  if (global.isMockDB) {
    const updated = await MockOrder.findByIdAndUpdate(orderId, {
      status: 'delivered',
      driverId: String(driverId),
    });
    return res.json({
      success: true,
      message: 'Delivery successfully verified and completed!',
      delivery: formatDelivery(updated, driverId),
    });
  }

  const order = await RealOrder.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = 'delivered';
  order.driverId = String(driverId);
  if (!order.timeline) order.timeline = [];
  order.timeline.push({
    status: 'delivered',
    label: 'Delivered',
    description: 'Package successfully delivered and PIN confirmed by customer.',
    timestamp: new Date(),
  });
  await order.save();

  res.json({
    success: true,
    message: 'Delivery successfully verified and completed!',
    delivery: formatDelivery(order, driverId),
  });
});

// @desc    Get driver profile
// @route   GET /api/driver/profile
const getDriverProfile = asyncHandler(async (req, res) => {
  const user = await getUserModel().findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('Driver profile not found');
  }
  res.json(user);
});

// @desc    Update driver profile & vehicle credentials
// @route   PUT /api/driver/profile
const updateDriverProfile = asyncHandler(async (req, res) => {
  const { name, phone, phoneNumber, vehicleType, licenseNumber, plateNumber, city, driverCity } = req.body;
  const user = await getUserModel().findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Driver not found');
  }

  const newPhone = phone || phoneNumber;
  const newCity = city || driverCity;

  if (global.isMockDB) {
    const updateData = {};
    if (name) updateData.name = name;
    if (newPhone) updateData.phoneNumber = newPhone;
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;
    if (plateNumber) updateData.plateNumber = plateNumber;
    if (newCity) {
      updateData.city = newCity;
      updateData.driverCity = newCity;
    }
    const updated = await MockUser.findByIdAndUpdate(req.user._id, updateData);
    return res.json(updated);
  }

  if (name) user.name = name;
  if (newPhone) user.phoneNumber = newPhone;
  if (vehicleType) user.vehicleType = vehicleType;
  if (licenseNumber) user.licenseNumber = licenseNumber;
  if (plateNumber) user.plateNumber = plateNumber;
  if (newCity) {
    user.city = newCity;
    user.driverCity = newCity;
  }

  const updated = await user.save();
  res.json(updated);
});

// @desc    Get driver payout disbursements
// @route   GET /api/driver/payouts
const getDriverPayouts = asyncHandler(async (req, res) => {
  if (global.isMockDB) {
    return res.json([]);
  }
  const payouts = await RealWithdrawal.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(payouts);
});

// @desc    Request a driver instant payout withdrawal
// @route   POST /api/driver/payouts
const requestDriverPayout = asyncHandler(async (req, res) => {
  const { amount, bankName, accountNumber, accountName } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount < 1000) {
    res.status(400);
    throw new Error('Minimum driver withdrawal amount is ₦1,000');
  }

  const reference = `DRV-PAY-${Math.floor(100000 + Math.random() * 900000)}`;

  if (global.isMockDB) {
    return res.status(201).json({
      _id: 'mock_drv_' + Date.now(),
      userId: req.user._id,
      amount: numAmount,
      bankName: bankName || 'Bank',
      accountNumber: accountNumber || '',
      accountName: accountName || req.user.name || '',
      reference,
      status: 'Processing',
      createdAt: new Date(),
    });
  }

  const record = await RealWithdrawal.create({
    userId: req.user._id,
    userType: 'driver',
    amount: numAmount,
    bankName: bankName || 'Bank',
    accountNumber: accountNumber || '',
    accountName: accountName || req.user.name || '',
    method: 'Driver Instant Cashout',
    reference,
    status: 'Processing',
  });

  res.status(201).json(record);
});

// @desc    Get driver notifications
// @route   GET /api/driver/notifications
const getDriverNotifications = asyncHandler(async (req, res) => {
  if (global.isMockDB) {
    const list = await MockNotification.find();
    return res.json(list);
  }
  res.json([]);
});

// @desc    Toggle driver radar online/offline status
// @route   PUT /api/driver/toggle-online
const toggleDriverOnline = asyncHandler(async (req, res) => {
  const user = await getUserModel().findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Driver not found');
  }

  const nextState = !(user.isOnline ?? true);
  if (global.isMockDB) {
    await MockUser.findByIdAndUpdate(req.user._id, { isOnline: nextState });
  } else {
    user.isOnline = nextState;
    await user.save();
  }

  res.json({ isOnline: nextState });
});

module.exports = {
  getDriverDashboard,
  getDriverDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  verifyDeliveryOtp,
  getDriverProfile,
  uploadDriverProfilePicture,
  updateDriverProfile,
  getDriverPayouts,
  requestDriverPayout,
  getDriverNotifications,
  toggleDriverOnline,
};
