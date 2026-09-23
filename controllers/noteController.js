const { NoteEventStore } = require('../models/NoteEvent');

// @desc    Get user notes / events
// @route   GET /api/user/notes
const getNotes = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { type, tag } = req.query;

    const filter = { userId };
    if (type) filter.type = type;
    if (tag) filter.tag = tag;

    const notes = await NoteEventStore.find(filter);
    return res.status(200).json({ success: true, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get notes error', error: error.message });
  }
};

// @desc    Create Note or Event
// @route   POST /api/user/notes
const createNote = async (req, res) => {
  try {
    const { title, tag, color, type, content } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Note/Event Title is required' });
    }

    const userId = req.user._id || req.user.id;
    const note = await NoteEventStore.create({
      userId,
      title,
      tag: tag || 'General',
      color: color || '#60A5FA',
      type: type || 'note',
      content: content || ''
    });

    return res.status(201).json({ success: true, message: 'Note/Event created successfully', data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Create note error', error: error.message });
  }
};

// @desc    Update Note or Event
// @route   PUT /api/user/notes/:id
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const note = await NoteEventStore.findById(id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note/Event not found' });
    }

    const updated = await NoteEventStore.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ success: true, message: 'Note/Event updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update note error', error: error.message });
  }
};

// @desc    Delete Note or Event
// @route   DELETE /api/user/notes/:id
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const note = await NoteEventStore.findById(id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note/Event not found' });
    }

    await NoteEventStore.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Note/Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete note error', error: error.message });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote
};
