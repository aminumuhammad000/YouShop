const asyncHandler = require('express-async-handler');
const RealOrder = require('../models/Order');
const { MockOrder, MockLog } = require('../models/mockDb');

const logAction = async (action, details) => {
  if (global.isMockDB) {
    await MockLog.create({ action, details });
  }
};

const getOrderModel = () => {
  return global.isMockDB ? MockOrder : RealOrder;
};

// Helper: extract user ID from auth header token
const getUserId = (req) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return null;
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'secret123');
    return decoded.id;
  } catch {
    return null;
  }
};

// @desc    Get orders
// @route   GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await getOrderModel().find({});
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderModel().findById(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items in order');
  }
  const userId = getUserId(req) || 'guest';
  const orderNumber = '#YS-' + Math.floor(10000 + Math.random() * 90000);
  const order = await getOrderModel().create({
    userId,
    customerName: customerName || 'Guest',
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentMethod,
    items,
    totalPrice,
    orderNumber,
    status: 'placed',
    timeline: [
      {
        status: 'placed',
        label: 'Order Placed',
        description: 'We have received your order',
        timestamp: new Date(),
      },
    ],
  });
  await logAction('CREATE_ORDER', `Created order: ${orderNumber}`);
  res.status(201).json(order);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, label, description } = req.body;
  const order = await getOrderModel().findById(req.params.id);
  if (order) {
    const updatedTimeline = [...(order.timeline || [])];
    updatedTimeline.push({
      status,
      label: label || `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: description || `Status updated to ${status}`,
      timestamp: new Date(),
    });

    const updatedOrder = await getOrderModel().findByIdAndUpdate(
      req.params.id,
      { status, timeline: updatedTimeline },
      { new: true }
    );
    await logAction('UPDATE_ORDER', `Updated order ${order.orderNumber} status to ${status}`);
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };
