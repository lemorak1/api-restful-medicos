const Appointment = require('../models/Appointment');
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');

exports.create = async (req, res) => {
  try {
    const { doctor, date, time } = req.body;

    // Validar horario permitido
    const allowedTimes = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    if (!allowedTimes.includes(time)) {
      return res.status(400).json({ message: 'Horario no permitido' });
    }

    // Validar que no exista una cita en el mismo horario
    const existingAppointment = await Appointment.findOne({ doctor, date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: 'El horario ya está ocupado' });
    }

    // Crear la cita
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      date,
      time,
      price: 5000,
    });

    res.status(201).json({ message: 'Cita creada exitosamente', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cita', error });
  }
};

exports.pay = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para pagar esta cita' });
    }

    appointment.status = 'Pagada';
    appointment.paymentDetails = paymentDetails;
    await appointment.save();

    res.status(200).json({ message: 'Cita pagada exitosamente', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error al pagar la cita', error });
  }
};

exports.confirm = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para confirmar esta cita' });
    }

    if (appointment.status !== 'Pagada') {
      return res.status(400).json({ message: 'No se puede confirmar una cita no pagada' });
    }

    appointment.status = 'Confirmada';
    await appointment.save();

    res.status(200).json({ message: 'Cita confirmada exitosamente', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar la cita', error });
  }
};


exports.list = async (req, res) => {
    try {
      // Obtenemos el ID del médico desde el token
      const doctorId = req.user.id;
  
      // Obtenemos la fecha actual en formato YYYY-MM-DD
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  


      // Buscar citas del médico para el día actual
      const appointments = await Appointment.find({
        doctor: doctorId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }).populate('patient', 'name email');

      // Responder con la lista de citas
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error al listar las citas', error });
    }
  };
exports.history = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de citas', error });
  }
};
exports.cancel = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Buscar la cita por ID
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
  
      // Validar que el usuario tenga permiso para cancelar la cita
      if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'No tienes permiso para cancelar esta cita' });
      }
  
      // Validar que la cita no esté confirmada
      if (appointment.status === 'Confirmada') {
        return res.status(400).json({ message: 'No se puede cancelar una cita confirmada' });
      }
  // Validar que la fecha no sea pasada
if (new Date(date) < new Date()) {
    return res.status(400).json({ message: 'No se puede agendar una cita en el pasado' });
  }
      // Actualizar el estado a "Cancelada"
      appointment.status = 'Cancelada';
      await appointment.save();
  
      res.status(200).json({ message: 'Cita cancelada exitosamente', appointment });
    } catch (error) {
      res.status(500).json({ message: 'Error al cancelar la cita', error });
    }
  };

  exports.history = async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;
  
      // Construir el filtro dinámico
      const filter = { patient: req.user.id };
      if (status) {
        filter.status = status; // Filtrar por estado (Pendiente, Pagada, etc.)
      }
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }
  
      // Buscar las citas con los filtros
      const appointments = await Appointment.find(filter).populate('doctor', 'name email');
  
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el historial de citas', error });
    }
  };

exports.processPayment = async (req, res) => {
  const { id } = req.params;
  const { amount, paymentMethodId } = req.body;

  try {
    // Validar el monto
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'El monto (amount) es obligatorio y debe ser un número positivo' });
    }

    // Verificar que la cita existe
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar que la cita pertenece al paciente autenticado
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para pagar esta cita' });
    }

    // Crear un intento de pago en Stripe con redirecciones deshabilitadas
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Monto en centavos
      currency: 'usd', // Moneda predeterminada
      payment_method: paymentMethodId, // ID del método de pago recibido desde el cliente
      confirm: true, // Confirma automáticamente el pago
      automatic_payment_methods: {
        enabled: true, // Activa métodos automáticos
        allow_redirects: 'never', // Deshabilita métodos con redirección
      },
    });

    // Actualizar los detalles de pago en la cita
    appointment.status = 'Pagada';
    appointment.paymentDetails = {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
    await appointment.save();

    res.status(200).json({ message: 'Pago exitoso', appointment });
  } catch (error) {
    res.status(400).json({ message: 'Error en el pago', error: error.message });
  }
};


exports.rejectAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar la cita por ID
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar que la cita pertenece al médico autenticado
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para rechazar esta cita' });
    }

    // Verificar el estado de la cita
    if (appointment.status === 'Confirmada') {
      return res.status(400).json({ message: 'No se puede rechazar una cita ya confirmada' });
    }

    // Actualizar el estado a "Rechazada"
    appointment.status = 'Rechazada';
    await appointment.save();

    res.status(200).json({ message: 'Cita rechazada exitosamente', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error al rechazar la cita', error: error.message });
  }
};