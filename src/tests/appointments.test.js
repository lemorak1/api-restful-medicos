require('dotenv').config();
const request = require('supertest');
const app = require('../app'); // Importa tu app de Express
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Carga las variables de entorno

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Appointments API', () => {
  let patient, doctor, patientToken, doctorToken, appointmentId;

  beforeEach(async () => {
    // Limpiar la base de datos
    await User.deleteMany({});
    await Appointment.deleteMany({});

    // Crear usuarios de prueba
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

    // Generar tokens
    patientToken = jwt.sign({ id: patient._id, role: 'Paciente' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    doctorToken = jwt.sign({ id: doctor._id, role: 'Médico' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(async () => {
    await Appointment.deleteMany({});
    await User.deleteMany({});
  });

  it('Debe permitir a un paciente crear una cita', async () => {
    const response = await request(app)
      .post('/appointments/create')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctor: doctor._id,
        date: '2024-12-20',
        time: '11:00',
       
      });
      
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Cita creada exitosamente');
    appointmentId = response.body.appointment._id;
  });

  it('Debe permitir al paciente pagar una cita', async () => {
    // Crear la cita primero
    const createResponse = await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      date: '2024-12-20',
      time: '09:00',
      price: 5000,
    });

    const response = await request(app)
      .post(`/appointments/pay/${createResponse._id}`)
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        amount: 5000,
        paymentMethodId: 'pm_card_visa',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Pago exitoso');
    expect(response.body.appointment.status).toBe('Pagada');
  });

  it('Debe permitir al médico confirmar una cita pagada', async () => {
    const appointment = await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      date: '2024-12-20T09:00:00Z',
      time: '09:00',
      price: 5000, // Asegúrate de incluir el precio
      status: 'Pagada',
    });

    const response = await request(app)
      .post(`/appointments/confirm/${appointment._id}`)
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Cita confirmada exitosamente');
    expect(response.body.appointment.status).toBe('Confirmada');
  });

  it('Debe permitir al médico rechazar una cita no confirmada', async () => {
    const appointment = await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      date: '2024-12-20',
      time: '09:00',
      price: 5000, // Incluye el precio
      status: 'Pendiente',
    });

    const response = await request(app)
      .post(`/appointments/reject/${appointment._id}`)
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Cita rechazada exitosamente');
    expect(response.body.appointment.status).toBe('Rechazada');
  });

  it('Debe permitir al paciente cancelar una cita', async () => {
    const appointment = await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      date: '2024-12-20',
      time: '09:00',
      price: 5000, // Incluye el precio
      status: 'Pendiente',
    });

    const response = await request(app)
      .delete(`/appointments/cancel/${appointment._id}`)
      .set('Authorization', `Bearer ${patientToken}`);
      // console.log("esto tiene el primer response=",response.body)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Cita cancelada exitosamente');
    expect(response.body.appointment.status).toBe('Cancelada');
  });

  it('Debe permitir al médico listar las citas del día', async () => {
    await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      date: new Date().toISOString().split('T')[0], // Fecha de hoy
      time: '12:00',
      price: 5000, // Incluye el precio
    });

    const response = await request(app)
      .get('/appointments/list')
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
