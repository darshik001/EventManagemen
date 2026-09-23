const mongoose = require('mongoose');
const ModelStore = require('./store');

const NoteEventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  tag: { type: String, default: 'General' },
  color: { type: String, default: '#60A5FA' },
  type: { type: String, enum: ['note', 'quicknote'], default: 'note' },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseNoteEvent = mongoose.model('NoteEvent', NoteEventSchema);
const NoteEventStore = new ModelStore('noteEvents', MongooseNoteEvent);

module.exports = { NoteEventStore, MongooseNoteEvent };
