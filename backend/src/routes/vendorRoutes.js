const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { profilePictureUpload } = require('../middleware/uploadMiddleware');
const {
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
} = require('../controllers/vendorController');

const router = express.Router();

// All vendor routes require authentication
router.get('/dashboard', protect, getVendorDashboard);
router.get('/notifications', protect, getVendorNotifications);
router.put('/notifications/read', protect, markVendorNotificationsRead);
router.get('/drivers', protect, getOnlineDrivers);
router.get('/profile', protect, getVendorProfile);
router.post('/profile/picture', protect, profilePictureUpload.single('profilePicture'), uploadVendorProfilePicture);
router.put('/profile', protect, updateVendorProfile);
router.post('/approve', protect, approveVendor);
router.get('/withdrawals', protect, getVendorWithdrawals);
router.post('/withdrawals', protect, requestVendorWithdrawal);
router.get('/reviews', protect, getVendorReviews);
router.post('/reviews/:id/reply', protect, replyToReview);

module.exports = router;
