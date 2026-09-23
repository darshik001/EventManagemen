const mongoose = require('mongoose');
const ModelStore = require('./store');

const EventPostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postTitle: { type: String, required: true },
  postImage: { type: String, default: '' },
  favPost: { type: Boolean, default: false },
  postTag: { type: String, default: 'General' },
  content: { type: String, default: '' },
  noteId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongooseEventPost = mongoose.model('EventPost', EventPostSchema);
const EventPostStore = new ModelStore('eventPosts', MongooseEventPost);

module.exports = { EventPostStore, MongooseEventPost };
