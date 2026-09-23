const mongoose = require('mongoose');
const ModelStore = require('./store');

const TaskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  taskTitle: { type: String, required: true },
  startDateTime: { type: String, required: true },
  endDateTime: { type: String, required: true },
  notify: { type: Boolean, default: true },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongooseTask = mongoose.model('Task', TaskSchema);
const TaskStore = new ModelStore('tasks', MongooseTask);

module.exports = { TaskStore, MongooseTask };
