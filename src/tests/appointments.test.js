// const request = require('supertest');
// const app = require('../app'); // Importa tu app de Express
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Appointment = require('../models/Appointment');

// // Carga las variables de entorno
// require('dotenv').config();

// beforeAll(async () => {
//   await mongoose.connect(process.env.TEST_DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// });

// afterAll(async () => {
//   await User.deleteMany({});
//   await Appointment.deleteMany({});
//   await mongoose.connection.close();
// });

// describe('Appointments API', () => {
//   let patient, doctor, token;

//   beforeEach(async () => {
//     // Crear usuarios de prueba
//     patient = await User.create({
//       name: 'Paciente Test',
//       email: 'paciente@test.com',
//       password: 'password123',
//       role: 'Paciente',
//     });

//     doctor = await User.create({
//       name: 'Médico Test',
//       email: 'medico@test.com',
//       password: 'password123',
//       role: 'Médico',
//     });

//     // Generar un token para el paciente
//     token = jwt.sign({ id: patient._id, role: 'Paciente' }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });
//   });

//   afterEach(async () => {
//     await Appointment.deleteMany({});
//     await User.deleteMany({});
//   });

//   it('Debe crear una nueva cita', async () => {
//     const response = await request(app)
//       .post('/appointments/create')
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         doctor: doctor._id,
//         date: '2024-12-20',
//         time: '09:00',
//       });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.message).toBe('Cita creada exitosamente');
//     expect(response.body.appointment).toHaveProperty('_id');
//     expect(response.body.appointment).toHaveProperty('doctor', doctor._id.toString());
//     expect(response.body.appointment).toHaveProperty('patient', patient._id.toString());
//   });

//   it('Debe fallar al crear una cita en horario no permitido', async () => {
//     const response = await request(app)
//       .post('/appointments/create')
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         doctor: doctor._id,
//         date: '2024-12-20',
//         time: '06:00', // Horario no permitido
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body.message).toBe('Horario no permitido');
//   });

//   it('Debe fallar al crear una cita en horario ya ocupado', async () => {
//     // Crear una cita inicialmente
//     await Appointment.create({
//       patient: patient._id,
//       doctor: doctor._id,
//       date: '2024-12-20',
//       time: '09:00',
//     });

//     // Intentar crear una cita en el mismo horario
//     const response = await request(app)
//       .post('/appointments/create')
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         doctor: doctor._id,
//         date: '2024-12-20',
//         time: '09:00', // Mismo horario
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body.message).toBe('El horario ya está ocupado');
//   });

//   it('Debe fallar al crear una cita sin token', async () => {
//     const response = await request(app)
//       .post('/appointments/create')
//       .send({
//         doctor: doctor._id,
//         date: '2024-12-20',
//         time: '09:00',
//       });

//     expect(response.statusCode).toBe(401);
//     expect(response.body.message).toBe('Token no proporcionado');
//   });

//   it('Debe fallar al crear una cita con un rol incorrecto', async () => {
//     // Generar un token para el médico (no paciente)
//     const invalidToken = jwt.sign({ id: doctor._id, role: 'Médico' }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     const response = await request(app)
//       .post('/appointments/create')
//       .set('Authorization', `Bearer ${invalidToken}`)
//       .send({
//         doctor: doctor._id,
//         date: '2024-12-20',
//         time: '09:00',
//       });

//     expect(response.statusCode).toBe(403);
//     expect(response.body.message).toBe('Acceso denegado para el rol: Médico');
//   });
// });
const request = require('supertest');
const app = require('../app'); // Importa tu app de Express
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Configuración global de Jest
jest.setTimeout(30000); // 20 segundos

// Carga las variables de entorno
require('dotenv').config();

beforeAll(async () => {
  console.log('Cadena de conexión:', process.env.TEST_DB_URI); // Verifica la URI
  try {
    mongoose.connect(process.env.TEST_DB_URI);
    console.log('Conexión exitosa con MongoDB');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    throw error;
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log('Conexión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar conexión con MongoDB:', error);
    }
  }
});

describe('Appointments API', () => {
  let patient, doctor, token, appointment;

  beforeEach(async () => {
    patient = await User.create({
      name: 'Paciente Test',
      email: 'paciente@test.com',
      password: 'password123',
      role: 'Paciente',
    });

    doctor = await User.create({
      name: 'Médico Test',
      email: 'medico@test.com',
      password: 'password123',
      role: 'Médico',
    });

    token = jwt.sign({ id: patient._id, role: 'Paciente' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      date: '2024-12-20',
      time: '09:00',
      status: 'Pendiente',
    });
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      try {
        await Promise.all([Appointment.deleteMany({}), User.deleteMany({})]);
      } catch (error) {
        console.error('Error al limpiar datos después de la prueba:', error);
      }
    }
  });

  it('Debe crear una nueva cita', async () => {
    const response = await request(app)
      .post('/appointments/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctor: doctor._id, date: '2024-12-20', time: '10:00' });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Cita creada exitosamente');
    expect(response.body.appointment).toHaveProperty('_id');
    expect(response.body.appointment).toHaveProperty('doctor', doctor._id.toString());
    expect(response.body.appointment).toHaveProperty('patient', patient._id.toString());
  });

  // Resto de los tests
});
