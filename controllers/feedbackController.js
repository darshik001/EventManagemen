const { FeedbackStore } = require('../models/Feedback');

// @desc    Submit Feedback
// @route   POST /api/user/feedback
const submitFeedback = async (req, res) => {
  try {
    const { feedbackTitle, description, rating } = req.body;
    if (!feedbackTitle) {
      return res.status(400).json({ success: false, message: 'Feedback title is required' });
    }

    const user = req.user;
    const feedback = await FeedbackStore.create({
      userId: user._id || user.id,
      userName: user.fullName || 'Anonymous',
      userEmail: user.email || '',
      feedbackTitle,
      description: description || '',
      rating: rating ? Number(rating) : 5,
      status: 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for helping us improve!',
      data: feedback
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Submit feedback error', error: error.message });
  }
};

// @desc    Get user's past feedback
// @route   GET /api/user/feedback/my
const getMyFeedback = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const list = await FeedbackStore.find({ userId });
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get feedback error', error: error.message });
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback
};
