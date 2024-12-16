const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    enum: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  status: {
    type: String,
    enum: ['Pendiente', 'Pagada', 'Confirmada', 'Cancelada'],
    default: 'Pendiente',
  },
  paymentDetails: {
    type: Object, // Aquí puedes almacenar detalles de la pasarela de pago simulada.
    default: null,
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
