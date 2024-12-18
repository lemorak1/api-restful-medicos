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
- Fechas futuras y horarios permitidos.
- Verificación de horarios ocupados.
- Restricciones para acciones específicas según el estado de la cita.
- Validación de acceso según rol del usuario.
- Validación del formato de la hora (`HH:mm`).
- Restricción para fechas y horas pasadas.

## Mejoras y Funcionalidades Adicionales

- Validación del formato de la hora (`HH:mm`).
- Restricción de fechas pasadas para la creación de citas.
- Manejo de respuestas de error detalladas.
- Pruebas unitarias para cada funcionalidad clave.

### Documentación interactiva:
- Disponible con Swagger en `http://localhost:3000/api-docs`.

### Pruebas unitarias:
- Cobertura de casos principales de éxito y error.
- Pruebas de creación, pago, cancelación y rechazo de citas.
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
     node src/scripts/initializeDatabase.js
     ```
4. Inicializa el proyecto:

   - Ejecuta el script de inicialización del proyecto:

     ```bash
     npm start
     ```
      - Tambien peudes ejecutarlo como dev:

     ```bash
     npm run dev
     ```
---

## Uso

### Endpoints principales

Todos los endpoints de la API están documentados en detalle en Swagger. Puedes acceder a la documentación interactiva en:
`http://localhost:3000/api-docs`. Aquí se encuentran las descripciones completas de los parámetros requeridos y las respuestas esperadas.

A continuación, se listan los endpoints principales con ejemplos de uso. Algunos endpoints requieren autenticación mediante un token JWT, el cual debe configurarse como un **Bearer Token** en el encabezado de la solicitud.
## **Uso**

---
### **1. Registro de Usuarios**

- **Paciente:**
  - **Endpoint:** `POST /auth/register`
  - **Body:**
    ```json
    {
      "name": "paciente_prueba",
      "email": "paciente_prueba@example.com",
      "password": "password123",
      "role": "patient"
    }
    ```

- **Médico:**
  - **Endpoint:** `POST /auth/register`
  - **Body:**
    ```json
    {
      "name": "medico_prueba",
      "email": "medico_prueba@example.com",
      "password": "password123",
      "role": "doctor"
    }
    ```

---

### **2. Inicio de Sesión**

- **Endpoint:** `POST /auth/login`
- **Body:**
  ```json
  {
    "email": "<email>",
    "password": "<contraseña>"
  }
  ```
- **Respuesta:**
  ```json
  {
    "token": "<jwt_token>"
  }
  ```

---

### **3. Creación de Citas**

- **Endpoint:** `POST /appointments/create`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_paciente>"
  }
  ```
- **Body:**
  ```json
  {
    "doctor": "<doctor_id>",
    "patient": "<patient_id>",
    "date": "2024-12-20",
    "time": "10:00"
  }
  ```
- **Restricciones:**
  - Solo horarios permitidos: `07:00` a `18:00`.
  - No se permiten fechas pasadas.
  - No se puede crear una cita si el horario está ocupado.

---

### **4. Pago de Citas**

- **Endpoint:** `POST /appointments/pay/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_paciente>"
  }
  ```
- **Body:**
  ```json
  {
    "amount": 5000,
    "paymentMethodId": "pm_card_visa"
  }
  ```
- **Restricciones:**
  - `amount` es obligatorio y debe ser mayor a 0.
  - La cita debe existir y estar asociada al paciente autenticado.

---

### **5. Confirmación de Citas**

- **Endpoint:** `POST /appointments/confirm/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_medico>"
  }
  ```
- **Restricciones:**
  - Solo el médico asociado a la cita puede confirmarla.
  - La cita debe estar en estado `Pagada`.
- **Respuesta:**
  ```json
  {
    "message": "Cita confirmada exitosamente",
    "appointment": {
      "id": "<appointment_id>",
      "status": "Confirmada"
    }
  }
  ```

---

### **6. Listado de Citas del Día**

- **Endpoint:** `GET /appointments/list`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_medico>"
  }
  ```
- **Restricciones:**
  - Solo el médico autenticado puede consultar sus citas.
- **Respuesta:**
  ```json
  [
    {
      "id": "<appointment_id>",
      "date": "2024-12-20",
      "time": "10:00",
      "status": "Confirmada",
      "patient": {
        "id": "<patient_id>",
        "name": "paciente_prueba",
        "email": "paciente_prueba@example.com"
      }
    }
  ]
  ```

---

### **7. Historial de Citas**

#### **Paciente:**
- **Endpoint:** `GET /appointments/history`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_paciente>"
  }
  ```

#### **Médico:**
- **Endpoint:** `GET /appointments/list`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_medico>"
  }
  ```
- **Restricciones:**
  - El paciente solo puede ver citas asociadas a su ID.
  - El médico solo puede ver citas del día actual asociadas a su ID.

---

### **8. Cancelación de Citas**

- **Endpoint:** `DELETE /appointments/cancel/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_paciente_o_medico>"
  }
  ```
- **Restricciones:**
  - No se pueden cancelar citas con estado `Confirmada`.
  - No se pueden cancelar citas con fechas pasadas.
- **Respuesta:**
  ```json
  {
    "message": "Cita cancelada exitosamente",
    "appointment": {
      "id": "<appointment_id>",
      "status": "Cancelada"
    }
  }
  ```
  ### **Rechazar una Cita**

- **Endpoint:** `POST /appointments/reject/:id`
- **Descripción:** Permite que un médico rechace una cita específica.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_medico>"
  }
---

## Pruebas

Ejecuta las pruebas unitarias:

```bash
npm test
```

Las pruebas incluyen:

1. **Creación de citas:** Verifica la creación exitosa y errores como horarios ocupados o inválidos.
2. **Pago de citas:** Procesa pagos exitosos mediante Stripe y valida errores de pago.
3. **Confirmación de citas:** Asegura que solo un médico puede confirmar citas pagadas.
4. **Rechazo de citas:** Permite que los médicos rechacen citas no confirmadas.
5. **Cancelación de citas:** Valida que pacientes y médicos puedan cancelar citas pendientes.
6. **Listado de citas del día:** Verifica que el médico pueda ver las citas programadas para el día actual.


---



