const asyncHandler = require('express-async-handler');
const RealUser = require('../models/User');
const { MockProduct, MockUser, MockOrder, MockCategory, MockCoupon, MockNotification, MockLog } = require('../models/mockDb');

const getUserModel = () => {
  return global.isMockDB ? MockUser : RealUser;
};

// Helper for Mock Logging
const logAction = async (action, details) => {
  await MockLog.create({ action, details });
};

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Public/Admin
const getStats = asyncHandler(async (req, res) => {
  const users = await getUserModel().find();
  const products = await MockProduct.find();
  const orders = await MockOrder.find();

  const usersCount = users.length;
  const productsCount = products.length;
  const ordersCount = orders.length;

  const totalRevenue = orders.reduce((acc, order) => {
    return acc + (Number(order.totalPrice) || 0);
  }, 0);

  res.json({
    usersCount,
    productsCount,
    ordersCount,
    totalRevenue,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Public/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await getUserModel().find();
  res.json(users);
});

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Public/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, phone, isBanned, isVerified } = req.body;
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email.trim().toLowerCase();
  if (phoneNumber !== undefined || phone !== undefined) {
    updateData.phoneNumber = phoneNumber || phone;
    updateData.phone = phone || phoneNumber;
  }
  if (isBanned !== undefined) updateData.isBanned = Boolean(isBanned);
  if (isVerified !== undefined) updateData.isVerified = Boolean(isVerified);

  const user = await getUserModel().findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (user) {
    await logAction('UPDATE_USER', `Updated user: ${user.email || req.params.id}`);
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Public/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const deleted = await getUserModel().findByIdAndDelete(req.params.id);
  if (deleted) {
    await logAction('DELETE_USER', `Deleted user: ${deleted.email || req.params.id}`);
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Public/Admin
const getCategories = asyncHandler(async (req, res) => {
  const categories = await MockCategory.find();
  res.json(categories);
});

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Public/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await MockCategory.create({ name, description });
  await logAction('CREATE_CATEGORY', `Created category: ${name}`);
  res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Public/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const deleted = await MockCategory.findByIdAndDelete(req.params.id);
  if (deleted) {
    await logAction('DELETE_CATEGORY', `Deleted category: ${deleted.name}`);
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Public/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await MockCoupon.find();
  res.json(coupons);
});

// @desc    Create a coupon
// @route   POST /api/admin/coupons
// @access  Public/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, isActive } = req.body;
  const coupon = await MockCoupon.create({ code, discount, isActive });
  await logAction('CREATE_COUPON', `Created coupon: ${code}`);
  res.status(201).json(coupon);
});

// @desc    Update a coupon
// @route   PUT /api/admin/coupons/:id
// @access  Public/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discount, isActive } = req.body;
  const coupon = await MockCoupon.findByIdAndUpdate(req.params.id, { code, discount, isActive });
  if (coupon) {
    await logAction('UPDATE_COUPON', `Updated coupon: ${coupon.code}`);
    res.json(coupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Delete a coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Public/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const deleted = await MockCoupon.findByIdAndDelete(req.params.id);
  if (deleted) {
    await logAction('DELETE_COUPON', `Deleted coupon: ${deleted.code}`);
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Get all notifications
// @route   GET /api/admin/notifications
// @access  Public/Admin
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await MockNotification.find();
  res.json(notifications);
});

// @desc    Create a notification
// @route   POST /api/admin/notifications
// @access  Public/Admin
const createNotification = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  const notification = await MockNotification.create({ title, message });
  await logAction('SEND_NOTIFICATION', `Sent notification: ${title}`);
  res.status(201).json(notification);
});

// @desc    Get all logs
// @route   GET /api/admin/logs
// @access  Public/Admin
const getLogs = asyncHandler(async (req, res) => {
  const logs = await MockLog.find();
  res.json(logs);
});

module.exports = {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getCategories,
  createCategory,
  deleteCategory,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getNotifications,
  createNotification,
  getLogs,
};
