const { SubscriptionPlanStore } = require('../models/SubscriptionPlan');
const { EventPostStore } = require('../models/EventPost');
const { NoteEventStore } = require('../models/NoteEvent');

const checkPlanFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'User context missing' });
      }

      const planId = user.subscription?.planId || 'free_plan';
      let plan = await SubscriptionPlanStore.findById(planId);

      // Default fallback permissions if plan record not found
      const permissions = plan?.permissions || {
        maxPosts: 5,
        maxNotes: 10,
        canAccessAudio: false,
        canAccessDrawing: false,
        canAccessAppointments: false,
        canAccessChecklist: true,
        canAccessLocation: true
      };

      if (permissions[featureName] === false) {
        return res.status(403).json({
          success: false,
          error: 'PLAN_RESTRICTION',
          message: `Your current subscription plan (${user.subscription?.planTitle || 'Free'}) does not support "${featureName}". Please upgrade your plan to access this feature.`,
          requiredFeature: featureName
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Plan authorization check failed', error: error.message });
    }
  };
};

const checkPostCreationLimit = async (req, res, next) => {
  try {
    const user = req.user;
    const planId = user.subscription?.planId || 'free_plan';
    let plan = await SubscriptionPlanStore.findById(planId);
    const maxPosts = plan?.permissions?.maxPosts ?? 5;

    if (maxPosts !== -1) {
      const userPostCount = await EventPostStore.countDocuments({ userId: user._id || user.id });
      if (userPostCount >= maxPosts) {
        return res.status(403).json({
          success: false,
          error: 'LIMIT_EXCEEDED',
          message: `Post creation limit reached (${userPostCount}/${maxPosts} posts). Please upgrade your subscription plan to create more posts.`
        });
      }
    }
    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Limit check error', error: error.message });
  }
};

const checkNoteCreationLimit = async (req, res, next) => {
  try {
    const user = req.user;
    const planId = user.subscription?.planId || 'free_plan';
    let plan = await SubscriptionPlanStore.findById(planId);
    const maxNotes = plan?.permissions?.maxNotes ?? 10;

    if (maxNotes !== -1) {
      const userNoteCount = await NoteEventStore.countDocuments({ userId: user._id || user.id });
      if (userNoteCount >= maxNotes) {
        return res.status(403).json({
          success: false,
          error: 'LIMIT_EXCEEDED',
          message: `Note creation limit reached (${userNoteCount}/${maxNotes} notes). Please upgrade your subscription plan to create more notes.`
        });
      }
    }
    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Limit check error', error: error.message });
  }
};

module.exports = {
  checkPlanFeature,
  checkPostCreationLimit,
  checkNoteCreationLimit
};
