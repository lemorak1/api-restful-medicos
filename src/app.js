const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
const appointmentRoutes = require('./routes/appointments');
const authRoutes = require('./routes/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// Rutas 
app.use('/appointments', appointmentRoutes);
app.use('/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//
app.get('/', (req, res) => {
  res.send('API Restful Simple');
});

module.exports = app;
