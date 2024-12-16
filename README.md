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

### **Endpoints principales**

Todos los endpoints de la API están documentados en detalle en Swagger. Puedes acceder a la documentación interactiva en:
`http://localhost:3000/api-docs`. Aquí se encuentran las descripciones completas de los parámetros requeridos y las respuestas esperadas.

A continuación, se listan los endpoints principales con ejemplos de uso. Algunos endpoints requieren autenticación mediante un token JWT, el cual debe configurarse como un **Bearer Token** en el encabezado de la solicitud.

---

#### **Autenticación**

1. **Registro:** `POST /auth/register`
   - Permite registrar nuevos usuarios como pacientes o médicos.
   - **Cuerpo de la solicitud:**
     ```json
     {
       "username": "test_user",
       "password": "password123",
       "role": "patient" // o "doctor"
     }
     ```
   - **Respuesta esperada:**
     ```json
     {
       "message": "Usuario registrado exitosamente"
     }
     ```

2. **Inicio de sesión:** `POST /auth/login`
   - Permite a un usuario obtener un token JWT.
   - **Cuerpo de la solicitud:**
     ```json
     {
       "username": "test_user",
       "password": "password123"
     }
     ```
   - **Respuesta esperada:**
     ```json
     {
       "token": "<jwt_token>"
     }
     ```
   - **Notas:** Este token deberá incluirse en las solicitudes a los endpoints protegidos como un **Bearer Token** en los encabezados:
     ```
     Authorization: Bearer <jwt_token>
     ```

---

#### **Citas**

1. **Crear cita:** `POST /appointments/create`
   - Permite a un paciente crear una cita médica.
   - **Requiere token JWT**.
   - **Cuerpo de la solicitud:**
     ```json
     {
       "date": "2024-12-20T10:00:00",
       "doctorId": "doctor123",
       "patientId": "patient456"
     }
     ```
   - **Respuesta esperada:**
     ```json
     {
       "message": "Cita creada exitosamente",
       "appointment": {
         "id": "appointment123",
         "date": "2024-12-20T10:00:00",
         "status": "pending"
       }
     }
     ```

2. **Pagar cita:** `POST /appointments/pay/:id`
   - Permite a un paciente pagar una cita y confirmar su asistencia.
   - **Requiere token JWT**.
   - **Parámetros de ruta:**
     - `id`: ID de la cita a pagar.
   - **Respuesta esperada:**
     ```json
     {
       "message": "Cita pagada exitosamente",
       "appointment": {
         "id": "appointment123",
         "status": "paid"
       }
     }
     ```

3. **Confirmar cita:** `POST /appointments/confirm/:id`
   - Permite a un médico confirmar una cita que ya fue pagada.
   - **Requiere token JWT**.
   - **Parámetros de ruta:**
     - `id`: ID de la cita a confirmar.
   - **Respuesta esperada:**
     ```json
     {
       "message": "Cita confirmada exitosamente",
       "appointment": {
         "id": "appointment123",
         "status": "confirmed"
       }
     }
     ```

4. **Listar citas del día:** `GET /appointments/list`
   - Permite a un médico listar todas las citas programadas para el día actual.
   - **Requiere token JWT**.
   - **Respuesta esperada:**
     ```json
     {
       "appointments": [
         {
           "id": "appointment123",
           "date": "2024-12-20T10:00:00",
           "status": "confirmed",
           "patientId": "patient456"
         }
       ]
     }
     ```

5. **Historial de citas:** `GET /appointments/history`
   - Permite a un paciente consultar su historial de citas.
   - **Requiere token JWT**.
   - **Respuesta esperada:**
     ```json
     {
       "appointments": [
         {
           "id": "appointment123",
           "date": "2024-12-20T10:00:00",
           "status": "confirmed",
           "doctorId": "doctor123"
         }
       ]
     }
     ```

6. **Cancelar cita:** `DELETE /appointments/cancel/:id`
   - Permite a un usuario cancelar una cita programada.
   - **Requiere token JWT**.
   - **Parámetros de ruta:**
     - `id`: ID de la cita a cancelar.
   - **Respuesta esperada:**
     ```json
     {
       "message": "Cita cancelada exitosamente",
       "appointment": {
         "id": "appointment123",
         "status": "cancelled"
       }
     }
     

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
