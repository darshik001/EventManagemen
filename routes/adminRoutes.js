const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminMiddleware');

const {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  updateUserPlan,
  deleteUserByAdmin,
  getAdminSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getAdminFeedbacks,
  updateFeedbackStatus
} = require('../controllers/adminController');

// Admin Auth
router.post('/auth/login', adminLogin);

// Dashboard
router.get('/dashboard/stats', protectAdmin, getDashboardStats);

// User Management
router.get('/users', protectAdmin, getAllUsers);
router.put('/users/:userId/plan', protectAdmin, updateUserPlan);
router.delete('/users/:userId', protectAdmin, deleteUserByAdmin);

// Subscription Plan Management
router.get('/plans', protectAdmin, getAdminSubscriptionPlans);
router.post('/plans', protectAdmin, createSubscriptionPlan);
router.put('/plans/:id', protectAdmin, updateSubscriptionPlan);
router.delete('/plans/:id', protectAdmin, deleteSubscriptionPlan);

// Feedback Management
router.get('/feedback', protectAdmin, getAdminFeedbacks);
router.put('/feedback/:id/status', protectAdmin, updateFeedbackStatus);

module.exports = router;
