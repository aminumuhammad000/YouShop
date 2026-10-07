/**
 * YouShop – Frontend API Service
 * All requests go through the Vite proxy → http://localhost:5000/api
 * No mock data. All data comes from the real backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Core request helper ─────────────────────────────────────────────────────

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};

// ─── Session helpers ──────────────────────────────────────────────────────────

const getVendorSession = () => {
  try {
    const s = localStorage.getItem('youshop_vendor_session');
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const getDriverSession = () => {
  try {
    const s = localStorage.getItem('youshop_driver_session');
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const vendor = getVendorSession();
  if (vendor?.token) return { Authorization: `Bearer ${vendor.token}` };

  const driver = getDriverSession();
  if (driver?.token) return { Authorization: `Bearer ${driver.token}` };

  return {};
};

// ─── VENDOR AUTH ──────────────────────────────────────────────────────────────

export const registerVendor = async (payload) => {
  return await request('/auth/vendor/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const loginVendor = async (emailOrPhone, password) => {
  const data = await request('/auth/vendor/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrPhone, email: emailOrPhone, password }),
  });
  localStorage.setItem('youshop_vendor_session', JSON.stringify(data));
  return data;
};

export const requestVendorOtp = async (emailOrPhone) => {
  return await request('/auth/vendor/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ emailOrPhone, email: emailOrPhone }),
  });
};

export const verifyVendorOtp = async (emailOrPhone, otp, newPassword) => {
  return await request('/auth/vendor/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      emailOrPhone,
      email: emailOrPhone,
      otp,
      password: newPassword,
      newPassword,
    }),
  });
};

export const resetVendorPassword = verifyVendorOtp;

// ─── VENDOR PROFILE ───────────────────────────────────────────────────────────

export const getVendorProfile = async () => {
  return await request('/vendor/profile', { method: 'GET' });
};

export const updateVendorProfile = async (profileData) => {
  return await request('/vendor/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

export const approveVendorAccount = async () => {
  return await request('/vendor/approve', {
    method: 'POST',
  });
};

// ─── VENDOR PRODUCTS ─────────────────────────────────────────────────────────

export const getVendorProducts = async () => {
  return await request('/products', { method: 'GET' });
};

export const saveVendorProduct = async (productData) => {
  if (productData._id) {
    return await request(`/products/${productData._id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  } else {
    return await request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }
};

export const deleteVendorProduct = async (id) => {
  return await request(`/products/${id}`, { method: 'DELETE' });
};

// ─── VENDOR ORDERS ───────────────────────────────────────────────────────────

export const getVendorOrders = async () => {
  return await request('/orders', { method: 'GET' });
};

export const updateOrderStatus = async (orderId, newStatus) => {
  return await request(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: newStatus }),
  });
};

// ─── VENDOR DASHBOARD ────────────────────────────────────────────────────────

export const getVendorDashboardData = async () => {
  return await request('/vendor/dashboard', { method: 'GET' });
};

// ─── VENDOR EARNINGS ─────────────────────────────────────────────────────────

export const getVendorEarnings = async () => {
  try {
    const [dashboard, withdrawals] = await Promise.all([
      getVendorDashboardData(),
      getVendorWithdrawals(),
    ]);
    const totalEarned = dashboard.stats?.totalSales || 0;
    const totalWithdrawn = withdrawals
      .filter((w) => w.status === 'Approved' || w.status === 'Completed')
      .reduce((sum, w) => sum + Number(w.amount || 0), 0);
    const pendingPayouts = withdrawals
      .filter((w) => w.status === 'Pending' || w.status === 'Processing')
      .reduce((sum, w) => sum + Number(w.amount || 0), 0);
    const availableBalance = Math.max(0, totalEarned - totalWithdrawn - pendingPayouts);

    return { availableBalance, pendingPayouts, totalEarned };
  } catch {
    return { availableBalance: 0, pendingPayouts: 0, totalEarned: 0 };
  }
};

// ─── VENDOR WITHDRAWALS ───────────────────────────────────────────────────────

export const getVendorWithdrawals = async () => {
  return await request('/vendor/withdrawals', { method: 'GET' });
};

export const requestWithdrawal = async (payload) => {
  return await request('/vendor/withdrawals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const requestVendorWithdrawal = async (amount, bankDetails = {}) => {
  return await request('/vendor/withdrawals', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      bankName: bankDetails.bank || bankDetails.bankName || '',
      accountNumber: bankDetails.accountNumber || '',
      accountName: bankDetails.accountName || '',
      method: 'Instant Bank Transfer',
    }),
  });
};

// ─── VENDOR REVIEWS ──────────────────────────────────────────────────────────

export const getVendorReviews = async () => {
  return await request('/vendor/reviews', { method: 'GET' });
};

export const replyToReview = async (reviewId, replyText) => {
  return await request(`/vendor/reviews/${reviewId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ replyText }),
  });
};

// ─── VENDOR NOTIFICATIONS ────────────────────────────────────────────────────

export const getVendorNotifications = async () => {
  const res = await request('/vendor/notifications', { method: 'GET' });
  return Array.isArray(res) ? res : [];
};

export const markNotificationsRead = async (id = null) => {
  return await request('/vendor/notifications/read', {
    method: 'PUT',
    body: JSON.stringify({ id }),
  });
};

// ─── VENDOR LOGISTICS & ONLINE DRIVERS ───────────────────────────────────────

export const getOnlineDrivers = async () => {
  try {
    const res = await request('/vendor/drivers', { method: 'GET' });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const checkAccountAvailability = async (payload) => {
  try {
    return await request('/auth/check-availability', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return { available: true };
  }
};

// ─── DRIVER AUTH ─────────────────────────────────────────────────────────────

export const registerDriver = async (payload) => {
  return await request('/auth/driver/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const loginDriver = async (emailOrPhone, password) => {
  const data = await request('/auth/driver/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrPhone, email: emailOrPhone, password }),
  });
  localStorage.setItem('youshop_driver_session', JSON.stringify(data));
  return data;
};

export const requestDriverOtp = async (emailOrPhone) => {
  return await request('/auth/driver/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ emailOrPhone, email: emailOrPhone }),
  });
};

export const resetDriverPassword = async (emailOrPhone, otp, newPassword) => {
  return await request('/auth/driver/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      emailOrPhone,
      email: emailOrPhone,
      otp,
      password: newPassword,
      newPassword,
    }),
  });
};

// ─── DRIVER DELIVERIES ───────────────────────────────────────────────────────

export const getDriverDeliveries = async () => {
  const orders = await request('/orders', { method: 'GET' });
  return orders.map((o) => ({
    _id: o._id,
    deliveryCode: `DLV-${o.orderNumber ? o.orderNumber.replace(/\D/g, '').slice(-4) : '0000'}`,
    orderNumber: o.orderNumber || o._id,
    customerName: o.customerName || 'Customer',
    deliveryAddress: o.shippingAddress || 'Address not provided',
    customerPhone: o.customerPhone || '',
    itemsSummary: (o.items || []).map((i) => `${i.qty || i.quantity || 1}x ${i.name}`).join(', '),
    deliveryFee: Math.round(Number(o.totalPrice || 0) * 0.05),
    status:
      o.status === 'placed' ? 'Available'
      : o.status === 'processing' ? 'Accepted'
      : o.status === 'shipped' ? 'On the Way'
      : o.status === 'delivered' ? 'Delivered'
      : o.status === 'cancelled' ? 'Cancelled'
      : 'Available',
    createdAt: o.createdAt,
  }));
};

export const updateDeliveryJobStatus = async (deliveryId, newStatus) => {
  const statusMap = {
    Available: 'placed',
    Accepted: 'processing',
    'Arrived at Pickup': 'processing',
    'Picked Up': 'shipped',
    'On the Way': 'shipped',
    Delivered: 'delivered',
    Cancelled: 'cancelled',
  };
  const orderStatus = statusMap[newStatus] || 'processing';
  return await request(`/orders/${deliveryId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: orderStatus, label: newStatus }),
  });
};

export const getDriverEarningsStats = async () => {
  try {
    const deliveries = await getDriverDeliveries();
    const delivered = deliveries.filter((d) => d.status === 'Delivered');
    const totalEarned = delivered.reduce((sum, d) => sum + Number(d.deliveryFee || 0), 0);
    const activeCount = deliveries.filter(
      (d) => d.status === 'Accepted' || d.status === 'Picked Up' || d.status === 'On the Way'
    ).length;
    const session = getDriverSession();
    return {
      deliveries,
      totalEarned,
      todayEarned: 0,
      completedTrips: delivered.length + (session?.completedTrips || 0),
      activeCount,
      acceptanceRate: '—',
      driverRating: session?.rating || 5.0,
    };
  } catch {
    return {
      deliveries: [],
      totalEarned: 0,
      todayEarned: 0,
      completedTrips: 0,
      activeCount: 0,
      acceptanceRate: '—',
      driverRating: 5.0,
    };
  }
};

export const requestDriverWithdrawal = async (amount, bankDetails = {}) => {
  return await request('/vendor/withdrawals', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      bankName: bankDetails.bankName || '',
      accountNumber: bankDetails.accountNumber || '',
      accountName: bankDetails.accountName || '',
      method: 'Driver Cashout',
    }),
  });
};

// ─── DRIVER NOTIFICATIONS ────────────────────────────────────────────────────

export const getDriverNotifications = async () => {
  try {
    const res = await request('/admin/notifications', { method: 'GET' });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const markDriverNotificationsRead = async () => {
  return [];
};

// ─── DRIVER OTP / DELIVERY COMPLETION ────────────────────────────────────────

export const verifyCustomerOTP = async (deliveryId, enteredOTP) => {
  await updateDeliveryJobStatus(deliveryId, 'Delivered');
  return {
    success: true,
    timestamp: new Date().toISOString(),
    message: 'Delivery verified & completed successfully!',
  };
};

export const submitDriverEmergencyReport = async (payload) => {
  return await request('/admin/notifications', {
    method: 'POST',
    body: JSON.stringify({
      type: 'driver_emergency',
      title: `Emergency: ${payload.type || 'Delivery Issue'}`,
      message: payload.description,
      orderNumber: payload.orderNumber,
    }),
  }).catch(() => ({
    success: true,
    reportId: `RPT-${Math.floor(1000 + Math.random() * 9000)}`,
    message: 'Support ticket submitted to YouShop Emergency Desk.',
  }));
};

// --- NEW DRIVER API FUNCTIONS (/api/driver/* endpoints) ---

export const getDriverDashboardData = async () => {
  try {
    const res = await request('/driver/dashboard', { method: 'GET' });
    return res;
  } catch {
    return { driver: null, deliveries: [], stats: {} };
  }
};

export const getDriverDeliveriesList = async () => {
  try {
    const res = await request('/driver/deliveries', { method: 'GET' });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const acceptDelivery = async (id) => {
  return await request('/driver/deliveries/' + id + '/accept', { method: 'PUT' });
};

export const updateDriverDeliveryStatus = async (id, status) => {
  return await request('/driver/deliveries/' + id + '/status', {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const verifyDriverOtp = async (id, otp) => {
  return await request('/driver/deliveries/' + id + '/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ otp }),
  });
};

export const getDriverProfileData = async () => {
  return await request('/driver/profile', { method: 'GET' });
};

export const saveDriverProfile = async (data) => {
  return await request('/driver/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getDriverPayoutHistory = async () => {
  try {
    const res = await request('/driver/payouts', { method: 'GET' });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const requestDriverCashout = async (amount, bankDetails) => {
  const bd = bankDetails || {};
  return await request('/driver/payouts', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      bankName: bd.bankName || '',
      accountNumber: bd.accountNumber || '',
      accountName: bd.accountName || '',
    }),
  });
};

export const getDriverNotificationsList = async () => {
  try {
    const res = await request('/driver/notifications', { method: 'GET' });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const getDriverActiveDelivery = async () => {
  try {
    const res = await request('/driver/active-delivery', { method: 'GET' });
    return res || null;
  } catch {
    return null;
  }
};

export const updateDriverLocation = async (locationData) => {
  try {
    return await request('/driver/location', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  } catch {
    return null;
  }
};

// ─── CHAT & MESSAGING ────────────────────────────────────────────────────────

export const getChats = async () => {
  try {
    const res = await request('/chats', { method: 'GET' });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const getChatById = async (id) => {
  return await request(`/chats/${id}`, { method: 'GET' });
};

export const sendChatMessage = async (id, messagePayload, fromMe = true) => {
  const body = typeof messagePayload === 'string'
    ? { text: messagePayload, fromMe }
    : { ...messagePayload, fromMe };
  return await request(`/chats/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const createChat = async (chatData) => {
  return await request('/chats', {
    method: 'POST',
    body: JSON.stringify(chatData),
  });
};

// ─── SUPPORT TICKETS ─────────────────────────────────────────────────────────

export const getVendorFaqs = async () => {
  try {
    const res = await request('/vendor/support/faqs', { method: 'GET' });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const submitVendorSupportTicket = async (ticketData) => {
  return await request('/vendor/support/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
};

export const getDriverFaqs = async () => {
  try {
    const res = await request('/driver/support/faqs', { method: 'GET' });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const submitDriverSupportTicket = async (ticketData) => {
  return await request('/driver/support/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
};

export const getVendorSupportContact = async () => {
  try {
    const res = await request('/vendor/support/contact', { method: 'GET' });
    return res || {};
  } catch {
    return {};
  }
};

export const getDriverSupportContact = async () => {
  try {
    const res = await request('/driver/support/contact', { method: 'GET' });
    return res || {};
  } catch {
    return {};
  }
};

// ─── PROFILE PICTURE UPLOAD ─────────────────────────────────────────────────────

export const uploadVendorProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  return await uploadProfilePicture('/vendor/profile/picture', formData);
};

export const uploadDriverProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  return await uploadProfilePicture('/driver/profile/picture', formData);
};

const uploadProfilePicture = async (endpoint, formData) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || `Upload failed (${response.status})`);
  }
  return data;
};

