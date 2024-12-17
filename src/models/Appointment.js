const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normaliza la fecha actual a medianoche
        return value >= today; // Permite hoy o fechas futuras
      },
      message: "La fecha de la cita debe ser de hoy o futura.",
    },
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Valida formato HH:mm
        if (!/^\d{2}:\d{2}$/.test(value)) return false;

        // Si la fecha es hoy, validar la hora
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Fecha de hoy normalizada
        if (this.date && this.date.getTime() === today.getTime()) {
          const [hours, minutes] = value.split(":").map(Number);
          const currentTime = new Date();
          const inputTime = new Date();
          inputTime.setHours(hours, minutes, 0, 0);

          return inputTime > currentTime; // La hora debe ser futura si es hoy
        }

        return true; // Si la fecha no es hoy, la hora es válida
      },
      message: "La hora debe ser futura si la cita es hoy.",
    },
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pendiente", "Pagada", "Confirmada", "Rechazada", "Cancelada"],
    default: "Pendiente",
  },
  paymentDetails: {
    paymentIntentId: { type: String },
    amount: { type: Number },
    currency: { type: String },
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
