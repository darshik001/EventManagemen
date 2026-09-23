const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AdminStore } = require('../models/Admin');
const { UserStore } = require('../models/User');
const { SubscriptionPlanStore } = require('../models/SubscriptionPlan');
const { FeedbackStore } = require('../models/Feedback');
const { EventPostStore } = require('../models/EventPost');
const { NoteEventStore } = require('../models/NoteEvent');

const generateAdminToken = (id) => {
  return jwt.sign(
    { id, role: 'admin' },
    process.env.JWT_SECRET || 'super_secret_book_app_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Admin Login
// @route   POST /api/admin/auth/login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password are required' });
    }

    const admin = await AdminStore.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = generateAdminToken(admin._id || admin.id);

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        id: admin._id || admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Admin login error', error: error.message });
  }
};

// @desc    Get Dashboard Statistics
// @route   GET /api/admin/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await UserStore.countDocuments();
    const totalPlans = await SubscriptionPlanStore.countDocuments();
    const totalPosts = await EventPostStore.countDocuments();
    const totalNotes = await NoteEventStore.countDocuments();
    const totalFeedbacks = await FeedbackStore.countDocuments();
    const pendingFeedbacks = await FeedbackStore.countDocuments({ status: 'pending' });

    // Active subscription breakdown
    const allUsers = await UserStore.find();
    const planCounts = {};
    allUsers.forEach(u => {
      const pTitle = u.subscription?.planTitle || 'Free Plan';
      planCounts[pTitle] = (planCounts[pTitle] || 0) + 1;
    });

    const recentUsers = allUsers.slice(-5).reverse().map(u => ({
      id: u._id || u.id,
      fullName: u.fullName,
      email: u.email,
      mobile: u.mobile,
      planTitle: u.subscription?.planTitle || 'Free Plan',
      createdAt: u.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPlans,
        totalPosts,
        totalNotes,
        totalFeedbacks,
        pendingFeedbacks,
        planDistribution: planCounts,
        recentSignups: recentUsers
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Dashboard stats error', error: error.message });
  }
};

// @desc    Get all users with search & plan details
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserStore.find();
    const sanitized = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    return res.status(200).json({ success: true, data: sanitized });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get users error', error: error.message });
  }
};

// @desc    Assign subscription plan or update status for a user
// @route   PUT /api/admin/users/:userId/plan
const updateUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { planId } = req.body;

    const plan = await SubscriptionPlanStore.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    const subscriptionData = {
      planId: plan._id || plan.id,
      planTitle: plan.title,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: plan.duration === 'Yearly' 
        ? new Date(Date.now() + 365*24*60*60*1000).toISOString()
        : new Date(Date.now() + 30*24*60*60*1000).toISOString()
    };

    const updatedUser = await UserStore.findByIdAndUpdate(userId, { subscription: subscriptionData }, { new: true });
    const { password, ...userData } = updatedUser;

    return res.status(200).json({
      success: true,
      message: `User assigned to plan ${plan.title} successfully`,
      data: userData
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update user plan error', error: error.message });
  }
};

// @desc    Delete user account (Admin action)
// @route   DELETE /api/admin/users/:userId
const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    await UserStore.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete user error', error: error.message });
  }
};

// ==================== SUBSCRIPTION PLANS CRUD (ADMIN) ====================

// @desc    Get all subscription plans
// @route   GET /api/admin/plans
const getAdminSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlanStore.find();
    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get plans error', error: error.message });
  }
};

// @desc    Create subscription plan with feature permissions
// @route   POST /api/admin/plans
const createSubscriptionPlan = async (req, res) => {
  try {
    const { title, price, duration, description, features, permissions, isPopular, status } = req.body;
    if (!title || price === undefined || !duration) {
      return res.status(400).json({ success: false, message: 'title, price, and duration are required' });
    }

    const plan = await SubscriptionPlanStore.create({
      title,
      price: Number(price),
      duration,
      description: description || '',
      features: Array.isArray(features) ? features : [],
      permissions: permissions || {
        maxPosts: 10,
        maxNotes: 20,
        canAccessAudio: true,
        canAccessDrawing: false,
        canAccessAppointments: true,
        canAccessChecklist: true,
        canAccessLocation: true
      },
      isPopular: !!isPopular,
      status: status || 'active'
    });

    return res.status(201).json({ success: true, message: 'Subscription plan created successfully', data: plan });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Create plan error', error: error.message });
  }
};

// @desc    Update subscription plan & permissions
// @route   PUT /api/admin/plans/:id
const updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlanStore.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    const updated = await SubscriptionPlanStore.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ success: true, message: 'Subscription plan updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update plan error', error: error.message });
  }
};

// @desc    Delete subscription plan
// @route   DELETE /api/admin/plans/:id
const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlanStore.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    await SubscriptionPlanStore.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Subscription plan deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete plan error', error: error.message });
  }
};

// ==================== FEEDBACK MANAGEMENT (ADMIN) ====================

// @desc    Get all feedback submitted by users
// @route   GET /api/admin/feedback
const getAdminFeedbacks = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const feedbacks = await FeedbackStore.find(filter);
    return res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get admin feedbacks error', error: error.message });
  }
};

// @desc    Update feedback status (pending -> reviewed -> resolved)
// @route   PUT /api/admin/feedback/:id/status
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status required: pending, reviewed, or resolved' });
    }

    const updated = await FeedbackStore.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(200).json({ success: true, message: `Feedback marked as ${status}`, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update feedback error', error: error.message });
  }
};

module.exports = {
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
};
