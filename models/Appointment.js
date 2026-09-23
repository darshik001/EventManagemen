const mongoose = require('mongoose');
const ModelStore = require('./store');

const AppointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: {type:String,enum:["post","quick","appointment"],default:"appointment"},
  appointmentTitle: { type: String, required: true },
  description: { type: String, default: '' },
  startDateTime: { type: String, required: true },
  endDateTime: { type: String, required: true },
  notify: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const MongooseAppointment = mongoose.model('Appointment', AppointmentSchema);
const AppointmentStore = new ModelStore('appointments', MongooseAppointment);

module.exports = { AppointmentStore, MongooseAppointment };
