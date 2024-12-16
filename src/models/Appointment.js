const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
date: { type: Date, required: true },
time: { type: String, required: true },
status: { type: String, enum: ['Pendiente', 'Pagada', 'Confirmada', 'Cancelada'], default: 'Pendiente' },
paymentDetails: {
  paymentIntentId: String, // ID del intento de pago en Stripe
  amount: Number, // Monto pagado
  currency: String, // Moneda utilizada
},
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
