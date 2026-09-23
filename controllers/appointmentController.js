const { AppointmentStore } = require('../models/Appointment');

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
    const { appointmentTitle, description, startDateTime, endDateTime, notify } = req.body;
    if (!appointmentTitle || !startDateTime || !endDateTime) {
      return res.status(400).json({ success: false, message: 'appointmentTitle, startDateTime, and endDateTime are required' });
    }

    const userId = req.user._id || req.user.id;
    const appointment = await AppointmentStore.create({
      userId,
      appointmentTitle,
      description: description || '',
      startDateTime,
      endDateTime,
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

    const updated = await AppointmentStore.findByIdAndUpdate(id, req.body, { new: true });
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
