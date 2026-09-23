const { TaskStore } = require('../models/Task');

// @desc    Get user tasks
// @route   GET /api/user/tasks
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const tasks = await TaskStore.find({ userId });
    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get tasks error', error: error.message });
  }
};

// @desc    Create Task
// @route   POST /api/user/tasks
const createTask = async (req, res) => {
  try {
    const { taskTitle, startDateTime, endDateTime, notify } = req.body;
    if (!taskTitle || !startDateTime || !endDateTime) {
      return res.status(400).json({ success: false, message: 'taskTitle, startDateTime, and endDateTime are required' });
    }

    const userId = req.user._id || req.user.id;
    const task = await TaskStore.create({
      userId,
      taskTitle,
      startDateTime,
      endDateTime,
      notify: notify !== undefined ? notify : true,
      isCompleted: false
    });

    return res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Create task error', error: error.message });
  }
};

// @desc    Update Task / Toggle Completion
// @route   PUT /api/user/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const task = await TaskStore.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const updated = await TaskStore.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ success: true, message: 'Task updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update task error', error: error.message });
  }
};

// @desc    Delete Task
// @route   DELETE /api/user/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const task = await TaskStore.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await TaskStore.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete task error', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
