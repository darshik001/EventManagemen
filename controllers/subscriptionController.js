const { SubscriptionPlanStore } = require('../models/SubscriptionPlan');
const { UserStore } = require('../models/User');

// @desc    Get all active subscription plans
// @route   GET /api/user/subscription/plans
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlanStore.find({ status: 'active' });
    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get subscription plans error', error: error.message });
  }
};

// @desc    Subscribe / Upgrade to a plan
// @route   POST /api/user/subscription/subscribe
const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' });
    }

    const plan = await SubscriptionPlanStore.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    const userId = req.user._id || req.user.id;
    const subscriptionData = {
      planId: plan._id || plan.id,
      planTitle: plan.title,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: plan.duration === 'Yearly' 
        ? new Date(Date.now() + 365*24*60*60*1000).toISOString()
        : new Date(Date.now() + 30*24*60*60*1000).toISOString()
    };

    const updatedUser = await UserStore.findByIdAndUpdate(
      userId,
      { subscription: subscriptionData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Successfully subscribed to ${plan.title}`,
      data: {
        subscription: updatedUser.subscription,
        permissions: plan.permissions
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Subscribe error', error: error.message });
  }
};

// @desc    Get user's current subscription details
// @route   GET /api/user/subscription/my-plan
const getMySubscription = async (req, res) => {
  try {
    const user = await UserStore.findById(req.user._id || req.user.id);
    const planId = user.subscription?.planId || 'free_plan';
    const plan = await SubscriptionPlanStore.findById(planId);

    return res.status(200).json({
      success: true,
      data: {
        subscription: user.subscription,
        planDetails: plan || null
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get subscription error', error: error.message });
  }
};

module.exports = {
  getSubscriptionPlans,
  subscribeToPlan,
  getMySubscription
};
