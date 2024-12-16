const mongoose = require('mongoose');
require('dotenv').config();

// Habilitar el modo de depuración de Mongoose
mongoose.set('debug', true);

(async () => {
  const uri = process.env.TEST_DB_URI;

  try {
    console.log('Intentando conectar a:', uri);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Tiempo máximo para conectar
    });
    console.log('Conexión exitosa a MongoDB');
    await mongoose.connection.close();
    console.log('Conexión cerrada correctamente');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    console.error(error); // Detalles completos del error
  }
})();
