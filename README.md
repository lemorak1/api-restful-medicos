# API Restful para Gestión de Citas Médicas

## Descripción

Esta API permite gestionar citas médicas entre pacientes y médicos, proporcionando funcionalidades como:

- Registro e inicio de sesión para pacientes y médicos.
- Creación, pago, confirmación y cancelación de citas.
- Listado de citas del día para médicos.
- Historial de citas para pacientes.
- Protección mediante autenticación y validación de roles.

---

## Características

### Seguridad:
- Autenticación basada en tokens JWT.
- Validación de permisos según roles (Paciente y Médico).

### Validaciones:
- Restricción de horarios permitidos (7:00-12:00 y 14:00-18:00).
- Verificación de disponibilidad de horarios.
- Impedimento de confirmación de citas no pagadas.

### Documentación interactiva:
- Disponible con Swagger en `http://localhost:3000/api-docs`.

### Pruebas unitarias:
- Cobertura de casos principales de éxito y error.

---

## Requisitos

### Tecnológicos:
- **Node.js**: Versión >= 14.x
- **MongoDB**: Servicio local o remoto.

### Dependencias principales:
- **express**: Para la creación del servidor.
- **mongoose**: Para la conexión con MongoDB.
- **jsonwebtoken**: Para la autenticación JWT.
- **swagger-ui-express**: Para la documentación interactiva.
- **jest** y **supertest**: Para las pruebas.

---

## Configuración del Entorno

Antes de ejecutar la aplicación, asegúrate de configurar las variables de entorno. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medical_appointments
TEST_DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medical_appointments_test
JWT_SECRET=your_secret_key
PORT=3000
```

Reemplaza `<username>` y `<password>` con tus credenciales de MongoDB.

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/lemorak1/api-restful-medicos.git
   cd api-restful-medicos
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicializa la base de datos:
   - Ejecuta el script de inicialización de la base de datos:
     ```bash
     node scripts/initializeDatabase.js
     ```

---

## Uso

### Endpoints principales

#### **Autenticación:**
- **Registro**: `POST /auth/register`
  ```json
  {
    "username": "test_user",
    "password": "password123",
    "role": "patient"
  }
  ```

- **Inicio de sesión**: `POST /auth/login`
  ```json
  {
    "username": "test_user",
    "password": "password123"
  }
  ```

#### **Citas:**
- **Crear cita**: `POST /appointments/create`
  ```json
  {
    "date": "2024-12-20T10:00:00",
    "doctorId": "doctor123",
    "patientId": "patient456"
  }
  ```

- **Pagar cita**: `POST /appointments/pay/:id`

- **Confirmar cita**: `POST /appointments/confirm/:id`

- **Listar citas del día (Médico)**: `GET /appointments/list`

- **Historial de citas (Paciente)**: `GET /appointments/history`

- **Cancelar cita**: `DELETE /appointments/cancel/:id`

---

## Pruebas

Ejecuta las pruebas unitarias:
```bash
npm test
```

Las pruebas incluyen:
- Casos exitosos y fallidos en los endpoints principales.
- Validaciones de datos.
- Protección de rutas con JWT y roles.

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
├── scripts/           # Scripts de inicialización
│   ├── initializeDatabase.js # Script para crear la base de datos
├── tests/             # Pruebas unitarias
│   ├── appointments.test.js # Pruebas para las citas
├── swagger.json       # Definición de la API para Swagger
```

---

## Script de Inicialización de la Base de Datos

El script `initializeDatabase.js` configura la base de datos y añade datos iniciales para facilitar las pruebas.

1. Define los esquemas y modelos de MongoDB.
2. Limpia las colecciones existentes para evitar duplicados.
3. Inserta datos iniciales:
   - Usuarios (`doctor` y `patient`).
   - Citas con horarios predefinidos.

Ejecuta el script:
```bash
node scripts/initializeDatabase.js
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
