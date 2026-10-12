const { AppointmentStore } = require('../models/Appointment');
const { parseDateTime } = require('../utils/dateHelper');

// @desc    Get user appointments
// @route   GET /api/user/appointments
const getAppointments = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const appointments = await AppointmentStore.find({ userId });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get appointments error', error: error.message });
  }
};

// @desc    Create Appointment
// @route   POST /api/user/appointments
const createAppointment = async (req, res) => {
  try {
    const { appointmentTitle, description, startDateTime, endDateTime, notify, type } = req.body;
    if (!appointmentTitle || !startDateTime || !endDateTime) {
      return res.status(400).json({ success: false, message: 'appointmentTitle, startDateTime, and endDateTime are required' });
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
    const appointment = await AppointmentStore.create({
      userId,
      type: type || 'appointment',
      appointmentTitle,
      description: description || '',
      startDateTime: parsedStart,
      endDateTime: parsedEnd,
      notify: notify !== undefined ? notify : true
    });

    return res.status(201).json({ success: true, message: 'Appointment created successfully', data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Create appointment error', error: error.message });
  }
};

// @desc    Update Appointment
// @route   PUT /api/user/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const appointment = await AppointmentStore.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
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

    const finalStart = data.startDateTime || appointment.startDateTime;
    const finalEnd = data.endDateTime || appointment.endDateTime;
    if (finalStart && finalEnd && new Date(finalEnd) < new Date(finalStart)) {
      return res.status(400).json({ success: false, message: 'endDateTime cannot be before startDateTime' });
    }

    const updated = await AppointmentStore.findByIdAndUpdate(id, data, { new: true });
    return res.status(200).json({ success: true, message: 'Appointment updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update appointment error', error: error.message });
  }
};

// @desc    Delete Appointment
// @route   DELETE /api/user/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const appointment = await AppointmentStore.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await AppointmentStore.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete appointment error', error: error.message });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
