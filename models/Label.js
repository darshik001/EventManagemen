const mongoose = require('mongoose');
const ModelStore = require('./store');

const LabelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  color: { type: String, default: '#3B82F6' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseLabel = mongoose.model('Label', LabelSchema);
const LabelStore = new ModelStore('labels', MongooseLabel);

module.exports = { LabelStore, MongooseLabel };
