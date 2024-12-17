const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true }, // Monto obligatorio
  status: { type: String, enum: ['Pendiente', 'Pagada', 'Confirmada', 'Rechazada', 'Cancelada'], default: 'Pendiente' },
  paymentDetails: {
    paymentIntentId: { type: String },
    amount: { type: Number },
    currency: { type: String },
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
