const mongoose = require('mongoose');
const ModelStore = require('./store');

const SubscriptionPlanSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g. "Monthly", "Yearly", "Lifetime"
  description: { type: String, default: '' },
  features: [{ type: String }],
  permissions: {
    maxPosts: { type: Number, default: 5 }, // -1 for unlimited
    maxNotes: { type: Number, default: 10 },
    canAccessAudio: { type: Boolean, default: false },
    canAccessDrawing: { type: Boolean, default: false },
    canAccessAppointments: { type: Boolean, default: false },
    canAccessChecklist: { type: Boolean, default: true },
    canAccessLocation: { type: Boolean, default: true }
  },
  isPopular: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseSubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
const SubscriptionPlanStore = new ModelStore('subscriptionPlans', MongooseSubscriptionPlan);

module.exports = { SubscriptionPlanStore, MongooseSubscriptionPlan };
