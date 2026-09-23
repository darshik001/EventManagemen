const { LabelStore } = require('../models/Label');

// @desc    Get user labels
// @route   GET /api/user/labels
const getLabels = async (req, res) => {
  try {
    const labels = await LabelStore.find({ userId: req.user._id || req.user.id });
    return res.status(200).json({ success: true, data: labels });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get labels error', error: error.message });
  }
};

// @desc    Create label
// @route   POST /api/user/labels
const createLabel = async (req, res) => {
  try {
    const { title, color } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Label title is required' });
    }

    const label = await LabelStore.create({
      userId: req.user._id || req.user.id,
      title,
      color: color || '#3B82F6'
    });

    return res.status(201).json({ success: true, message: 'Label created successfully', data: label });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Create label error', error: error.message });
  }
};

// @desc    Update label
// @route   PUT /api/user/labels/:id
const updateLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, color } = req.body;

    const label = await LabelStore.findById(id);
    console.log(id)
    console.log(label)
    if (!label) {
      return res.status(404).json({ success: false, message: 'Label not found' });
    }

    const updated = await LabelStore.findByIdAndUpdate(id, { title, color }, { new: true });
    return res.status(200).json({ success: true, message: 'Label updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update label error', error: error.message });
  }
};

// @desc    Delete label
// @route   DELETE /api/user/labels/:id
const deleteLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const label = await LabelStore.findById(id);
    if (!label) {
      return res.status(404).json({ success: false, message: 'Label not found' });
    }

    await LabelStore.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Label deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete label error', error: error.message });
  }
};

module.exports = {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel
};
