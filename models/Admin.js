const mongoose = require('mongoose');
const ModelStore = require('./store');

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseAdmin = mongoose.model('Admin', AdminSchema);
const AdminStore = new ModelStore('admins', MongooseAdmin);

module.exports = { AdminStore, MongooseAdmin };
