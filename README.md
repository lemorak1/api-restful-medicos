# API Restful para Gestión de Citas Médicas

## Descripción

Esta API permite gestionar citas médicas entre pacientes y médicos, proporcionando funcionalidades como:

- Registro e inicio de sesión para pacientes y médicos.
- Creación, pago, confirmación y cancelación de citas.
- Listado de citas del día para médicos.
- Historial de citas para pacientes.
- Protección mediante autenticación y validación de roles.
- Procesamiento de pagos utilizando Stripe.

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
- **Stripe**: Cuenta activa para procesamiento de pagos.

### Dependencias principales:
- **express**: Para la creación del servidor.
- **mongoose**: Para la conexión con MongoDB.
- **jsonwebtoken**: Para la autenticación JWT.
- **stripe**: Para el procesamiento de pagos.
- **swagger-ui-express**: Para la documentación interactiva.
- **jest** y **supertest**: Para las pruebas.

---

## Configuración del Entorno

Antes de ejecutar la aplicación, asegúrate de configurar las variables de entorno. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medical_appointments
TEST_DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medical_appointments_test
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
PORT=3000
```

Reemplaza `<username>`, `<password>`, `your_stripe_secret_key` y `your_stripe_public_key`  con tus credenciales de MongoDB y Stripe.

Para propositos de prueba en un ambiente de base de datos local y una pasarela de pagos con ambiente sandbox, se ha usado el siguiente .env

```env
DB_URI=mongodb://localhost:27017/medical_appointments
TEST_DB_URI=mongodb://localhost:27017/medical_appointments_test
JWT_SECRET=mysecretkey
STRIPE_SECRET_KEY=sk_test_51QWfCSK2EIZcmE0KDDH3bhPLErxvRQ4lRjWZstaJoaZZ6klhiG9GaM2XrzwV0F0Gl78PFNgaQxq4eeG5KtTYiDO600lvY2F7hW
STRIPE_PUBLIC_KEY=pk_test_51QWfCSK2EIZcmE0KNv6BiaU8CbwDcqWethBOqizdSU3r17xjjj8MQiMF2heKi9Qcwq3JRzdiMe2gGXzzdNFvny1t00RZk2kihH
PORT=3000
```
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

Todos los endpoints de la API están documentados en detalle en Swagger. Puedes acceder a la documentación interactiva en:
`http://localhost:3000/api-docs`. Aquí se encuentran las descripciones completas de los parámetros requeridos y las respuestas esperadas.

A continuación, se listan los endpoints principales con ejemplos de uso. Algunos endpoints requieren autenticación mediante un token JWT, el cual debe configurarse como un **Bearer Token** en el encabezado de la solicitud.

#### **Autenticación**

1. **Registro:** `POST /auth/register`
   - Permite registrar nuevos usuarios como pacientes o médicos.
   - **Cuerpo de la solicitud:**
     ```json
     {
       "name": "test_user",
       "email":"test_user@test.com",
       "password": "password123",
       "role": "Paciente" // o "Médico"
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
       "email": "test_user@test.com",
       "password": "password123"
     }
     ```
   - **Respuesta esperada:**
     ```json
     {
       "token": "<jwt_token>"
     }
     ```
   - **Notas:** Este token deberá incluirse (medioco o paciente) en las solicitudes a los endpoints protegidos como un **Bearer Token** en los encabezados:
     ```
     Authorization: Bearer <jwt_token>
     ```

#### **Citas**

1. **Crear cita:** `POST /appointments/create`
   - Permite a un paciente crear una cita médica.
   - **Requiere token JWT**.
   - **Cuerpo de la solicitud:**
     ```json
     {
      "patient":"67607a9bd5d303fd4d8af2df",
      "doctor":"67607e9dd5d303fd4d8af2e5" ,
      "date": "2024-12-16T10:00:00",
      "time":"07:00" 
     }
     ```
   - **Respuesta esperada:**
     ```json
     {
       "message": "Cita creada exitosamente",
        "appointment": 
          {
          "patient": <paciente_id>,
          "doctor": <doctor_id>,
          "date": "2024-12-16T10:00:00.000Z",
          "time": "07:00",
          "status": "Pendiente",
          "_id": <id_appointment>, //id_cita generado
          }
     }
     ```

2. **Pagar cita:** `POST /appointments/pay/:id`
   - Permite a un paciente pagar una cita utilizando Stripe.
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

