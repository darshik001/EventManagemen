const { UserStore } = require('../models/User');
const { SubscriptionPlanStore } = require('../models/SubscriptionPlan');

// @desc    Get user profile details
// @route   GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await UserStore.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const planId = user.subscription?.planId || 'free_plan';
    const plan = await SubscriptionPlanStore.findById(planId);

    const { password, ...userData } = user;

    return res.status(200).json({
      success: true,
      data: {
        ...userData,
        activePlanPermissions: plan?.permissions || {
          maxPosts: 5,
          maxNotes: 10,
          canAccessAudio: false,
          canAccessDrawing: false,
          canAccessAppointments: false,
          canAccessChecklist: true,
          canAccessLocation: true
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get profile error', error: error.message });
  }
};

// @desc    Update user profile (Name, Mobile, Profile Image)
// @route   PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, mobile } = req.body;
    const userId = req.user._id || req.user.id;

    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (mobile) updates.mobile = mobile;

    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await UserStore.findByIdAndUpdate(userId, updates, { new: true });
    const { password, ...userData } = updatedUser;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userData
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update profile error', error: error.message });
  }
};

// @desc    Update user theme preference
// @route   PATCH /api/user/profile/theme
const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme || !['light', 'dark'].includes(theme.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid theme value. Choose either "light" or "dark"' });
    }

    const updatedUser = await UserStore.findByIdAndUpdate(
      req.user._id || req.user.id,
      { theme: theme.toLowerCase() },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Theme updated to ${theme.toLowerCase()}`,
      data: { theme: updatedUser.theme }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update theme error', error: error.message });
  }
};

// @desc    Update user language preference
// @route   PATCH /api/user/profile/language
const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const validLangs = ['english', 'hindi', 'gujarati'];
    if (!language || !validLangs.includes(language.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid language value. Choose "english", "hindi", or "gujarati"' });
    }

    const updatedUser = await UserStore.findByIdAndUpdate(
      req.user._id || req.user.id,
      { language: language.toLowerCase() },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Language updated to ${language.toLowerCase()}`,
      data: { language: updatedUser.language }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update language error', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateTheme,
  updateLanguage
};
