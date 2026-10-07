const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RealUser = require('../models/User');
const { MockUser, MockLog } = require('../models/mockDb');

const otpStore = {};

const logAction = async (action, details) => {
  if (global.isMockDB) {
    await MockLog.create({ action, details });
  }
};

const getUserModel = () => {
  return global.isMockDB ? MockUser : RealUser;
};

const normalizeEmail = (email) => (email ? email.trim().toLowerCase() : '');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });

const findUserByIdentifier = async (identifier, expectedRole) => {
  if (!identifier) return null;
  const cleanEmail = normalizeEmail(identifier);
  const cleanPhone = String(identifier).replace(/\D/g, '');
  const UserModel = getUserModel();

  let user = null;

  if (cleanEmail && (cleanEmail.includes('@') || !cleanPhone)) {
    const query = { email: cleanEmail };
    if (expectedRole) query.role = expectedRole;
    user = await UserModel.findOne(query);
  }

  if (!user && cleanPhone) {
    if (!global.isMockDB) {
      const phoneQueries = [
        { phoneNumber: cleanPhone },
        { phone: cleanPhone },
        { phoneNumber: cleanPhone.startsWith('0') ? cleanPhone.slice(1) : '0' + cleanPhone },
        { phone: cleanPhone.startsWith('0') ? cleanPhone.slice(1) : '0' + cleanPhone },
      ];
      const query = { $or: phoneQueries };
      if (expectedRole) query.role = expectedRole;
      user = await RealUser.findOne(query);
    } else {
      const all = await UserModel.find(expectedRole ? { role: expectedRole } : {});
      user = all.find((u) => {
        const p = String(u.phoneNumber || u.phone || '').replace(/\D/g, '');
        return p && (p === cleanPhone || (p.length >= 10 && cleanPhone.endsWith(p.slice(-10))));
      }) || null;
    }
  }

  if (!user && cleanEmail) {
    const query = { email: cleanEmail };
    if (expectedRole) query.role = expectedRole;
    user = await UserModel.findOne(query);
  }

  return user;
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }
  const cleanEmail = normalizeEmail(email);
  const userExists = await getUserModel().findOne({ email: cleanEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await getUserModel().create({
    name,
    email: cleanEmail,
    password: hashedPassword,
    phoneNumber,
    isVerified: false,
  });
  await logAction('REGISTER_USER', `User registered (Pending Verification): ${email}`);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isVerified: false,
    message: 'Account created! Your account is pending admin verification before you can log in.',
  });
});

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = normalizeEmail(email);
  const user = await getUserModel().findOne({ email: cleanEmail });
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.isBanned) {
      res.status(403);
      throw new Error('Your account has been banned by an administrator.');
    }
    if (user.isVerified === false) {
      res.status(403);
      throw new Error('Your account is pending admin verification. An administrator must verify your account before you can log in.');
    }
    await logAction('LOGIN_USER', `User logged in: ${email}`);
    res.json({ _id: user._id, name: user.name, email: user.email, isVerified: true, token: generateToken(user._id) });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register vendor (Only Name, Email, Password, Phone required; rest skippable)
// @route   POST /api/auth/vendor/register
const registerVendor = asyncHandler(async (req, res) => {
  const {
    name, email, password, phoneNumber,
    storeName, businessCategory, businessDescription,
    businessAddress, state, city,
    storeLogo, storeCover, verificationDocument,
  } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide full name, email and password.');
  }

  const cleanEmail = normalizeEmail(email);
  const existingUser = await getUserModel().findOne({ email: cleanEmail });
  if (existingUser) {
    res.status(400);
    throw new Error('A vendor with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const vendor = await getUserModel().create({
    name,
    email: cleanEmail,
    password: hashedPassword,
    phoneNumber: phoneNumber || '',
    role: 'vendor',
    vendorStatus: 'approved',
    storeName: storeName || `${name}'s Store`,
    businessCategory: businessCategory || 'General',
    businessDescription: businessDescription || '',
    businessAddress: businessAddress || '',
    state: state || 'Lagos',
    city: city || 'Lagos',
    storeLogo: storeLogo || '',
    storeCover: storeCover || '',
    verificationDocument: verificationDocument || '',
    isVerified: true,
  });

  await logAction('REGISTER_VENDOR', `Vendor registered: ${cleanEmail}`);

  res.status(201).json({
    _id: vendor._id,
    name: vendor.name,
    email: vendor.email,
    role: 'vendor',
    vendorStatus: vendor.vendorStatus,
    storeName: vendor.storeName,
    message: 'Vendor account created successfully.',
  });
});

// @desc    Login vendor
// @route   POST /api/auth/vendor/login
const loginVendor = asyncHandler(async (req, res) => {
  const { email, password, emailOrPhone } = req.body;
  const identifier = emailOrPhone || email || '';

  if (!identifier || !password) {
    res.status(400);
    throw new Error('Please enter your email or phone number and password.');
  }

  const user = await findUserByIdentifier(identifier, 'vendor');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid vendor credentials. Please check your email or phone number and password.');
  }

  if (user.role !== 'vendor') {
    res.status(403);
    throw new Error('This account is not registered as a vendor.');
  }

  if (user.vendorStatus === 'rejected') {
    res.status(403);
    throw new Error('Your vendor account has been rejected.');
  }
  if (user.vendorStatus === 'suspended') {
    res.status(403);
    throw new Error('Your vendor account is suspended.');
  }

  await logAction('LOGIN_VENDOR', `Vendor logged in: ${user.email}`);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: 'vendor',
    vendorStatus: user.vendorStatus || 'approved',
    storeName: user.storeName,
    businessCategory: user.businessCategory,
    businessAddress: user.businessAddress,
    state: user.state,
    city: user.city,
    token: generateToken(user._id),
  });
});

// @desc    Request vendor OTP
// @route   POST /api/auth/vendor/forgot-password
const requestVendorOtp = asyncHandler(async (req, res) => {
  const { email, emailOrPhone, identifier } = req.body;
  const rawId = identifier || emailOrPhone || email || '';

  if (!rawId) {
    res.status(400);
    throw new Error('Please provide your registered email address or phone number.');
  }

  const vendor = await findUserByIdentifier(rawId, 'vendor');
  if (!vendor) {
    res.status(404);
    throw new Error('No vendor account found with this email or phone number.');
  }

  const cleanEmail = normalizeEmail(vendor.email);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[cleanEmail] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
  if (vendor.phoneNumber) {
    otpStore[vendor.phoneNumber.replace(/\D/g, '')] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
  }

  await logAction('FORGOT_PASSWORD_VENDOR', `OTP requested for vendor: ${cleanEmail}`);

  res.json({
    message: 'OTP verification code sent successfully.',
    otp,
    email: cleanEmail,
  });
});

// @desc    Verify vendor OTP & reset password
// @route   POST /api/auth/vendor/verify-otp
const verifyVendorOtp = asyncHandler(async (req, res) => {
  const { email, emailOrPhone, identifier, otp, password, newPassword } = req.body;
  const rawId = identifier || emailOrPhone || email || '';
  const passToSet = newPassword || password;

  if (!rawId || !otp) {
    res.status(400);
    throw new Error('Account identifier (email or phone) and OTP are required.');
  }

  const vendor = await findUserByIdentifier(rawId, 'vendor');
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor account not found.');
  }

  const cleanEmail = normalizeEmail(vendor.email);
  const cleanPhone = (vendor.phoneNumber || '').replace(/\D/g, '');
  const saved = otpStore[cleanEmail] || (cleanPhone ? otpStore[cleanPhone] : null);

  if (!saved || saved.expiresAt < Date.now()) {
    res.status(400);
    throw new Error('OTP has expired or is invalid. Please request a new code.');
  }

  if (saved.otp !== String(otp).trim()) {
    res.status(400);
    throw new Error('Invalid OTP code. Please check and try again.');
  }

  if (passToSet) {
    if (passToSet.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters long.');
    }
    const hashedPassword = await bcrypt.hash(passToSet, 10);
    vendor.password = hashedPassword;
    await vendor.save();
  }

  delete otpStore[cleanEmail];
  if (cleanPhone) delete otpStore[cleanPhone];

  await logAction('RESET_PASSWORD_VENDOR', `Password reset successful for vendor: ${cleanEmail}`);
  res.json({ message: 'Password reset successful! You can now log in with your new password.' });
});

// @desc    Request driver OTP
// @route   POST /api/auth/driver/forgot-password
const requestDriverOtp = asyncHandler(async (req, res) => {
  const { email, emailOrPhone, identifier } = req.body;
  const rawId = identifier || emailOrPhone || email || '';

  if (!rawId) {
    res.status(400);
    throw new Error('Please provide your registered email address or phone number.');
  }

  const driver = await findUserByIdentifier(rawId, 'driver');
  if (!driver) {
    res.status(404);
    throw new Error('No driver account found with this email or phone number.');
  }

  const cleanEmail = normalizeEmail(driver.email);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[cleanEmail] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
  if (driver.phoneNumber) {
    otpStore[driver.phoneNumber.replace(/\D/g, '')] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
  }

  await logAction('FORGOT_PASSWORD_DRIVER', `OTP requested for driver: ${cleanEmail}`);

  res.json({
    message: 'OTP verification code sent successfully.',
    otp,
    email: cleanEmail,
  });
});

// @desc    Verify driver OTP & reset password
// @route   POST /api/auth/driver/verify-otp
const verifyDriverOtp = asyncHandler(async (req, res) => {
  const { email, emailOrPhone, identifier, otp, password, newPassword } = req.body;
  const rawId = identifier || emailOrPhone || email || '';
  const passToSet = newPassword || password;

  if (!rawId || !otp) {
    res.status(400);
    throw new Error('Account identifier (email or phone) and OTP are required.');
  }

  const driver = await findUserByIdentifier(rawId, 'driver');
  if (!driver) {
    res.status(404);
    throw new Error('Driver account not found.');
  }

  const cleanEmail = normalizeEmail(driver.email);
  const cleanPhone = (driver.phoneNumber || '').replace(/\D/g, '');
  const saved = otpStore[cleanEmail] || (cleanPhone ? otpStore[cleanPhone] : null);

  if (!saved || saved.expiresAt < Date.now()) {
    res.status(400);
    throw new Error('OTP has expired or is invalid. Please request a new code.');
  }

  if (saved.otp !== String(otp).trim()) {
    res.status(400);
    throw new Error('Invalid OTP code. Please check and try again.');
  }

  if (passToSet) {
    if (passToSet.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters long.');
    }
    const hashedPassword = await bcrypt.hash(passToSet, 10);
    driver.password = hashedPassword;
    await driver.save();
  }

  delete otpStore[cleanEmail];
  if (cleanPhone) delete otpStore[cleanPhone];

  await logAction('RESET_PASSWORD_DRIVER', `Password reset successful for driver: ${cleanEmail}`);
  res.json({ message: 'Password reset successfully! You can now log in with your new password.' });
});

// @desc    Register driver (Only Name, Email, Password, Phone required; rest skippable)
// @route   POST /api/auth/driver/register
const registerDriver = asyncHandler(async (req, res) => {
  const {
    name, email, password, phoneNumber,
    vehicleType, licenseNumber, plateNumber, city,
  } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide full name, email and password.');
  }

  const cleanEmail = normalizeEmail(email);
  const existingUser = await getUserModel().findOne({ email: cleanEmail });
  if (existingUser) {
    res.status(400);
    throw new Error('A driver with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const driver = await getUserModel().create({
    name,
    email: cleanEmail,
    password: hashedPassword,
    phoneNumber: phoneNumber || '',
    role: 'driver',
    driverStatus: 'approved',
    vehicleType: vehicleType || 'Motorcycle',
    licenseNumber: licenseNumber || '',
    plateNumber: plateNumber || '',
    driverCity: city || 'Lagos',
    isVerified: true,
    isOnline: false,
    rating: 5.0,
    completedTrips: 0,
  });

  await logAction('REGISTER_DRIVER', `Driver registered: ${cleanEmail}`);

  res.status(201).json({
    _id: driver._id,
    name: driver.name,
    email: driver.email,
    role: 'driver',
    driverStatus: driver.driverStatus,
    vehicleType: driver.vehicleType,
    message: 'Driver account created successfully.',
  });
});

// @desc    Login driver
// @route   POST /api/auth/driver/login
const loginDriver = asyncHandler(async (req, res) => {
  const { email, password, emailOrPhone } = req.body;
  const identifier = emailOrPhone || email || '';

  if (!identifier || !password) {
    res.status(400);
    throw new Error('Please enter your email or phone number and password.');
  }

  const user = await findUserByIdentifier(identifier, 'driver');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid driver credentials. Please check your email or phone number and password.');
  }

  if (user.role !== 'driver') {
    res.status(403);
    throw new Error('This account is not registered as a driver.');
  }

  if (user.driverStatus === 'rejected') {
    res.status(403);
    throw new Error('Your driver account has been rejected.');
  }
  if (user.driverStatus === 'suspended') {
    res.status(403);
    throw new Error('Your driver account is suspended.');
  }

  await logAction('LOGIN_DRIVER', `Driver logged in: ${user.email}`);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: 'driver',
    driverStatus: user.driverStatus || 'approved',
    vehicleType: user.vehicleType,
    licenseNumber: user.licenseNumber,
    plateNumber: user.plateNumber,
    city: user.driverCity,
    isOnline: user.isOnline,
    rating: user.rating,
    completedTrips: user.completedTrips,
    token: generateToken(user._id),
  });
});

// @desc    Check if email or phone is already registered
// @route   POST /api/auth/check-availability
const checkAvailability = asyncHandler(async (req, res) => {
  const { email, phone, phoneNumber } = req.body;
  const UserModel = getUserModel();

  if (email) {
    const cleanEmail = normalizeEmail(email);
    const userExists = await UserModel.findOne({ email: cleanEmail });
    if (userExists) {
      return res.json({
        available: false,
        field: 'email',
        message: 'This email address is already registered. Please use a different email.',
      });
    }
  }

  const phoneToCheck = (phoneNumber || phone || '').replace(/\D/g, '');
  if (phoneToCheck) {
    let allUsers = [];
    if (!global.isMockDB) {
      allUsers = await RealUser.find({}, 'phoneNumber phone');
    } else {
      allUsers = await UserModel.find({});
    }

    const phoneExists = (allUsers || []).find((u) => {
      const uPhone = (u.phoneNumber || u.phone || '').replace(/\D/g, '');
      return uPhone && (uPhone === phoneToCheck || (uPhone.length >= 10 && phoneToCheck.endsWith(uPhone.slice(-10))));
    });

    if (phoneExists) {
      return res.json({
        available: false,
        field: 'phone',
        message: 'This phone number is already registered. Please use a different phone number.',
      });
    }
  }

  res.json({ available: true });
});

module.exports = {
  registerUser,
  loginUser,
  registerVendor,
  loginVendor,
  requestVendorOtp,
  verifyVendorOtp,
  registerDriver,
  loginDriver,
  requestDriverOtp,
  verifyDriverOtp,
  checkAvailability,
};
