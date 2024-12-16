const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const { isAuthenticated, isRole } = require('../middlewares/auth');

// Crear cita (Paciente)
router.post('/create', isAuthenticated, isRole('Paciente'), AppointmentController.create);

// Pagar cita (Paciente)
router.post('/pay/:id', isAuthenticated, isRole('Paciente'), AppointmentController.pay);

// Confirmar cita (Médico)
router.post('/confirm/:id', isAuthenticated, isRole('Médico'), AppointmentController.confirm);

// Listar citas del día (Médico)
router.get('/list', isAuthenticated, isRole('Médico'), AppointmentController.list);

// Ver historial de citas (Paciente)
router.get('/history', isAuthenticated, isRole('Paciente'), AppointmentController.history);

// Cancelar cita (Paciente o Médico)
router.delete('/cancel/:id', isAuthenticated, AppointmentController.cancel);

// Historial de citas (con filtros)
router.get('/history', isAuthenticated, isRole('Paciente'), AppointmentController.history);

module.exports = router;
