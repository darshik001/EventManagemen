const mongoose = require('mongoose');
const ModelStore = require('./store');

const QuickNoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  noteTag: { type: String, default: 'Quick' },
  noteColor: { type: String, default: '#F59E0B' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseQuickNote = mongoose.model('QuickNote', QuickNoteSchema);
const QuickNoteStore = new ModelStore('quickNotes', MongooseQuickNote);

module.exports = { QuickNoteStore, MongooseQuickNote };
