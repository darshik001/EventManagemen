const { QuickNoteStore } = require('../models/QuickNote');

// @desc    Get quick notes
// @route   GET /api/user/quick-notes
const getQuickNotes = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const notes = await QuickNoteStore.find({ userId });
    return res.status(200).json({ success: true, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get quick notes error', error: error.message });
  }
};

// @desc    Create quick note
// @route   POST /api/user/quick-notes
const createQuickNote = async (req, res) => {
  try {
    const { title, noteTag, noteColor } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const userId = req.user._id || req.user.id;
    const note = await QuickNoteStore.create({
      userId,
      title,
      noteTag: noteTag || 'Quick',
      noteColor: noteColor || '#F59E0B'
    });

    return res.status(201).json({ success: true, message: 'Quick note created successfully', data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Create quick note error', error: error.message });
  }
};

// @desc    Update quick note
// @route   PUT /api/user/quick-notes/:id
const updateQuickNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const note = await QuickNoteStore.findById(id);
    if (!note || note.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Quick note not found' });
    }

    const updated = await QuickNoteStore.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ success: true, message: 'Quick note updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update quick note error', error: error.message });
  }
};

// @desc    Delete quick note
// @route   DELETE /api/user/quick-notes/:id
const deleteQuickNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const note = await QuickNoteStore.findById(id);
    if (!note || note.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Quick note not found' });
    }

    await QuickNoteStore.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Quick note deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete quick note error', error: error.message });
  }
};

module.exports = {
  getQuickNotes,
  createQuickNote,
  updateQuickNote,
  deleteQuickNote
};
