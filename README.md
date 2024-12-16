# API Restful para Gestión de Citas Médicas

Descripción

Esta API permite gestionar citas médicas entre pacientes y médicos, incluyendo funcionalidades como:

Registro e inicio de sesión para pacientes y médicos.

Creación, pago, confirmación y cancelación de citas.

Listado de citas del día para médicos.

Historial de citas con filtros para pacientes.

Protección mediante autenticación y validación de roles.

Características

Seguridad:

Autenticación mediante JWT.

Validación de permisos basada en roles (Paciente y Médico).

Validaciones:

Fechas futuras y horarios permitidos.

Horarios ocupados.

Restricciones para acciones específicas según estado de la cita.

Documentación interactiva:

Disponible con Swagger en http://localhost:3000/api-docs.

Pruebas unitarias:

Cubren todos los casos principales (éxito y errores).

Requisitos

Node.js: >= 14.x

MongoDB: Servicio local o remoto.

Dependencias:

Express

Mongoose

jsonwebtoken

Swagger (para la documentación interactiva)

Jest y Supertest (para pruebas).

Configuración

Clona el repositorio:

git clone <repo-url>
cd <repo-folder>

Instala las dependencias:

npm install

Configura las variables de entorno en un archivo .env:

DB_URI=mongodb://localhost:27017/medical_appointments
TEST_DB_URI=mongodb://localhost:27017/medical_appointments_test
JWT_SECRET=your_secret_key

Inicia el servidor:

npm run dev

Accede a la documentación interactiva:

URL: http://localhost:3000/api-docs

Uso

Endpoints principales

Autenticación:

Registro: POST /auth/register

Inicio de sesión: POST /auth/login

Citas:

Crear cita: POST /appointments/create

Pagar cita: POST /appointments/pay/:id

Confirmar cita: POST /appointments/confirm/:id

Listar citas del día (Médico): GET /appointments/list

Historial de citas (Paciente): GET /appointments/history

Cancelar cita: DELETE /appointments/cancel/:id

Consulta la documentación Swagger para más detalles.

Pruebas

Ejecuta las pruebas:

npm test

Cobertura de pruebas:

Casos exitosos y errores de los endpoints principales.

Validaciones de seguridad y datos.

Protección de rutas mediante JWT y roles.

Estructura del Proyecto

src/
├── app.js             # Configuración principal de la app
├── models/            # Modelos Mongoose
│   ├── User.js        # Modelo de Usuario
│   ├── Appointment.js # Modelo de Cita
├── routes/            # Rutas de la API
│   ├── auth.js        # Rutas de autenticación
│   ├── appointments.js # Rutas de citas
├── controllers/       # Controladores
│   ├── AuthController.js # Lógica de autenticación
│   ├── AppointmentController.js # Lógica de citas
├── middlewares/       # Middlewares personalizados
│   ├── auth.js        # Middleware para JWT y roles
├── tests/             # Pruebas unitarias
│   ├── appointments.test.js # Pruebas para las citas
├── swagger.json       # Definición de la API para Swagger

Contribuciones

Si deseas contribuir:

Haz un fork del repositorio.

Crea una rama para tu feature:

git checkout -b feature/nombre-feature

Haz un pull request.

Licencia

Este proyecto está bajo la licencia MIT.