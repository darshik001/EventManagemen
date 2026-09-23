const mongoose = require('mongoose');
const ModelStore = require('./store');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  language: { type: String, enum: ['english', 'hindi', 'gujarati'], default: 'english' },
  subscription: {
    planId: { type: String, default: 'free_plan' },
    planTitle: { type: String, default: 'Free Plan' },
    status: { type: String, default: 'active' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null }
  },
  createdAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.model('User', UserSchema);
const UserStore = new ModelStore('users', MongooseUser);

module.exports = { UserStore, MongooseUser };
