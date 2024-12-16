# API Restful para Gestión de Citas Médicas

## Descripción

Esta API permite gestionar citas médicas entre pacientes y médicos, proporcionando funcionalidades como:

- Registro e inicio de sesión para pacientes y médicos.
- Creación, pago, confirmación y cancelación de citas.
- Listado de citas del día para médicos.
- Historial de citas con filtros para pacientes.
- Protección mediante autenticación y validación de roles.

---

## Características

### Seguridad:
- Autenticación mediante JWT.
- Validación de permisos basada en roles (Paciente y Médico).

### Validaciones:
- Control de fechas futuras y horarios permitidos.
- Manejo de horarios ocupados.
- Restricciones para acciones específicas según el estado de la cita.

### Documentación interactiva:
- Disponible en `http://localhost:3000/api-docs` mediante Swagger.

### Pruebas unitarias:
- Cobertura completa para casos principales (éxito y errores).

---

## Requisitos

### Tecnológicos:
- **Node.js**: Versión >= 14.x
- **MongoDB**: Servicio local o remoto.

### Dependencias principales:
- **express**: Para la creación del servidor.
- **mongoose**: Para la conexión y manejo de la base de datos MongoDB.
- **jsonwebtoken**: Para la autenticación con JWT.
- **swagger-ui-express**: Para la generación de documentación interactiva.
- **jest** y **supertest**: Para pruebas unitarias y de integración.

---

## Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Instalar las dependencias**:
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:  
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   DB_URI=mongodb://localhost:27017/medical_appointments
   TEST_DB_URI=mongodb://localhost:27017/medical_appointments_test
   JWT_SECRET=your_secret_key
   ```

4. **Iniciar el servidor**:
   ```bash
   npm run dev
   ```

5. **Acceso a la documentación**:  
   Una vez el servidor esté en funcionamiento, puedes acceder a la documentación Swagger en:  
   [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Uso

### Endpoints principales

#### **Autenticación**:
- **Registro**: `POST /auth/register`
- **Inicio de sesión**: `POST /auth/login`

#### **Citas**:
- **Crear cita**: `POST /appointments/create`
- **Pagar cita**: `POST /appointments/pay/:id`
- **Confirmar cita**: `POST /appointments/confirm/:id`
- **Listar citas del día (Médico)**: `GET /appointments/list`
- **Historial de citas (Paciente)**: `GET /appointments/history`
- **Cancelar cita**: `DELETE /appointments/cancel/:id`

Consulta la documentación Swagger para más detalles sobre cada endpoint.

---

## Pruebas

Ejecuta las pruebas unitarias:
```bash
npm test
```

Las pruebas cubren:
- Casos exitosos y errores en los endpoints principales.
- Validaciones de seguridad y datos.
- Protección de rutas mediante JWT y roles.

---

## Estructura del Proyecto

```
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
```

---

## Contribuciones

Si deseas contribuir:

1. Haz un fork del repositorio.
2. Crea una rama para tu feature:
   ```bash
   git checkout -b feature/nombre-feature
   ```
3. Realiza tus cambios y envía un pull request.

---

## Licencia

Este proyecto está bajo la licencia **MIT**.
