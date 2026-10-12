const { TaskStore } = require('../models/Task');
const { parseDateTime } = require('../utils/dateHelper');

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

    const parsedStart = parseDateTime(startDateTime);
    const parsedEnd = parseDateTime(endDateTime);

    if (!parsedStart || !parsedEnd) {
      return res.status(400).json({ success: false, message: 'Invalid startDateTime or endDateTime format' });
    }

    if (parsedEnd < parsedStart) {
      return res.status(400).json({ success: false, message: 'endDateTime cannot be before startDateTime' });
    }

    const userId = req.user._id || req.user.id;
    const task = await TaskStore.create({
      userId,
      taskTitle,
      startDateTime: parsedStart,
      endDateTime: parsedEnd,
      notify: notify !== undefined ? notify : true,
      isCompleted: false
    });

    return res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ success: false, message: 'Create task error', error: error.message });
  }
};

// @desc    Update Task / Toggle Completion
// @route   PUT /api/user/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskStore.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const data = { ...req.body };

    if (req.body.startDateTime !== undefined) {
      const parsedStart = parseDateTime(req.body.startDateTime);
      if (!parsedStart) {
        return res.status(400).json({ success: false, message: 'Invalid startDateTime format' });
      }
      data.startDateTime = parsedStart;
      // Re-enable notify if rescheduled to a future time and notify wasn't explicitly provided
      if (req.body.notify === undefined && parsedStart > new Date()) {
        data.notify = true;
      }
    }

    if (req.body.endDateTime !== undefined) {
      const parsedEnd = parseDateTime(req.body.endDateTime);
      if (!parsedEnd) {
        return res.status(400).json({ success: false, message: 'Invalid endDateTime format' });
      }
      data.endDateTime = parsedEnd;
    }

    const finalStart = data.startDateTime || task.startDateTime;
    const finalEnd = data.endDateTime || task.endDateTime;
    if (finalStart && finalEnd && new Date(finalEnd) < new Date(finalStart)) {
      return res.status(400).json({ success: false, message: 'endDateTime cannot be before startDateTime' });
    }

    const updated = await TaskStore.findByIdAndUpdate(id, data, { new: true });
    return res.status(200).json({ success: true, message: 'Task updated successfully', data: updated });
  } catch (error) {
    console.error('Update task error:', error);
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
