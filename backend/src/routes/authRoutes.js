const express = require('express');
const {
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
} = require('../controllers/authController');

const router = express.Router();

// Public availability check
router.post('/check-availability', checkAvailability);

// User auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Vendor auth
router.post('/vendor/register', registerVendor);
router.post('/vendor/login', loginVendor);
router.post('/vendor/forgot-password', requestVendorOtp);
router.post('/vendor/verify-otp', verifyVendorOtp);

// Driver auth
router.post('/driver/register', registerDriver);
router.post('/driver/login', loginDriver);
router.post('/driver/forgot-password', requestDriverOtp);
router.post('/driver/verify-otp', verifyDriverOtp);

module.exports = router;
