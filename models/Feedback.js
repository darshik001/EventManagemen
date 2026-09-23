const mongoose = require('mongoose');
const ModelStore = require('./store');

const FeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  feedbackTitle: { type: String, required: true },
  description: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseFeedback = mongoose.model('Feedback', FeedbackSchema);
const FeedbackStore = new ModelStore('feedbacks', MongooseFeedback);

module.exports = { FeedbackStore, MongooseFeedback };
