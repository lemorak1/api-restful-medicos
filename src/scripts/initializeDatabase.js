const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Esquema de Usuario
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El email es obligatorio"],
    match: [/.+\@.+\..+/, "Por favor ingrese un correo electrónico válido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  role: {
    type: String,
    enum: ["Paciente", "Médico"],
    required: [true, "El rol es obligatorio"],
  },
});

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);

// Esquema de Cita
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

const Appointment = mongoose.model("Appointment", AppointmentSchema);

// Datos iniciales
const initializeDatabase = async () => {
  try {
    // Conexión a MongoDB
    console.log("Conectando a la base de datos...");
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ Conexión exitosa a MongoDB");

    // Limpia las colecciones existentes
    await User.deleteMany({});
    await Appointment.deleteMany({});
    console.log("ℹ️ Colecciones limpiadas");

    // Inserta usuarios iniciales con contraseñas encriptadas
    const hashedPassword1 = await bcrypt.hash("password123", 10);
    const hashedPassword2 = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "medico1",
        email: "medico1@example.com",
        password: hashedPassword1,
        role: "Médico",
      },
      {
        name: "paciente1",
        email: "paciente1@example.com",
        password: hashedPassword2,
        role: "Paciente",
      },
    ]);
    console.log("✅ Usuarios iniciales creados");

    // Inserta citas iniciales
    const doctor = users.find((user) => user.role === "Médico");
    const patient = users.find((user) => user.role === "Paciente");

    if (doctor && patient) {
      const appointments = [
        {
          date: new Date("2024-12-20"), // Fecha futura válida
          doctor: doctor._id,
          patient: patient._id,
          status: "Pendiente",
          time: "07:00", // Validado formato HH:mm
          price: 100,
        },
      ];
      await Appointment.insertMany(appointments);
      console.log("✅ Citas iniciales creadas");
    } else {
      console.log("⚠️ No se encontraron usuarios Médicos y/o Pacientes.");
    }

    // Cierra la conexión
    await mongoose.connection.close();
    console.log("✅ Inicialización de la base de datos completada.");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    await mongoose.connection.close();
  }
};

initializeDatabase();
