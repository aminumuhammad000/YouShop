const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');

router.get('/stats', getStats);
router.route('/users')
  .get(getUsers);
router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.route('/categories')
  .get(getCategories)
  .post(createCategory);
router.route('/categories/:id')
  .delete(deleteCategory);

router.route('/coupons')
  .get(getCoupons)
  .post(createCoupon);
router.route('/coupons/:id')
  .put(updateCoupon)
  .delete(deleteCoupon);

router.route('/notifications')
  .get(getNotifications)
  .post(createNotification);

router.get('/logs', getLogs);

module.exports = router;
