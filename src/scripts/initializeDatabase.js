const mongoose = require('mongoose');
require('dotenv').config();

// Esquemas de datos
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String, // 'patient' o 'doctor'
});

const AppointmentSchema = new mongoose.Schema({
  date: Date,
  doctorId: mongoose.Schema.Types.ObjectId,
  patientId: mongoose.Schema.Types.ObjectId,
  status: { type: String, enum: ['pending', 'paid', 'confirmed', 'cancelled'], default: 'pending' },
});

// Modelos
const User = mongoose.model('User', UserSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

// Datos iniciales
const initialUsers = [
  { username: 'doctor1', password: 'hashed_password_1', role: 'doctor' },
  { username: 'patient1', password: 'hashed_password_2', role: 'patient' },
];

const initializeDatabase = async () => {
  try {
    // Conexión a MongoDB
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión exitosa a MongoDB');

    // Limpia las colecciones existentes
    await User.deleteMany({});
    await Appointment.deleteMany({});
    console.log('ℹ️ Colecciones limpiadas');

    // Inserta usuarios iniciales
    const users = await User.insertMany(initialUsers);
    console.log('✅ Usuarios iniciales creados:', users);

    // Inserta citas iniciales (si es necesario)
    if (users.length > 1) {
      const appointments = [
        {
          date: new Date('2024-12-20T10:00:00'),
          doctorId: users.find(user => user.role === 'doctor')._id,
          patientId: users.find(user => user.role === 'patient')._id,
          status: 'pending',
        },
      ];
      await Appointment.insertMany(appointments);
      console.log('✅ Citas iniciales creadas');
    }

    mongoose.connection.close();
    console.log('✅ Inicialización de la base de datos completada.');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    mongoose.connection.close();
  }
};

initializeDatabase();
