const jwt = require('jsonwebtoken');

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjuntar los datos del usuario al objeto req
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar el rol del usuario
const isRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: `Acceso denegado para el rol: ${req.user.role}` });
  }
  next();
};

module.exports = { isAuthenticated, isRole };
