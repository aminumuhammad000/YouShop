const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { profilePictureUpload } = require('../middleware/uploadMiddleware');
const {
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
} = require('../controllers/driverController');

const router = express.Router();

// All driver routes require authentication
router.get('/dashboard', protect, getDriverDashboard);
router.get('/deliveries', protect, getDriverDeliveries);
router.put('/deliveries/:id/accept', protect, acceptDelivery);
router.put('/deliveries/:id/status', protect, updateDeliveryStatus);
router.post('/deliveries/:id/verify-otp', protect, verifyDeliveryOtp);
router.get('/profile', protect, getDriverProfile);
router.post('/profile/picture', protect, profilePictureUpload.single('profilePicture'), uploadDriverProfilePicture);
router.put('/profile', protect, updateDriverProfile);
router.get('/payouts', protect, getDriverPayouts);
router.post('/payouts', protect, requestDriverPayout);
router.get('/notifications', protect, getDriverNotifications);
router.put('/toggle-online', protect, toggleDriverOnline);

module.exports = router;
