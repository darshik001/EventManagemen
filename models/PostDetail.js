const mongoose = require('mongoose');
const ModelStore = require('./store');

const PostDetailSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  postDetailsTitle: { type: String, required: true },
  postType: { 
    type: String, 
    enum: ['Text', 'Location', 'Images', 'Audio', 'Documents', 'CheckList', 'Appointment', 'Contact', 'Drawing'],
    required: true 
  },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const MongoosePostDetail = mongoose.model('PostDetail', PostDetailSchema);
const PostDetailStore = new ModelStore('postDetails', MongoosePostDetail);

module.exports = { PostDetailStore, MongoosePostDetail };
