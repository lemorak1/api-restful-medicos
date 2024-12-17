# API Restful para Gestión de Citas Médicas

## **Descripción**
Esta API permite gestionar citas médicas entre pacientes y médicos, proporcionando funcionalidades como:

- Registro e inicio de sesión para pacientes y médicos.
- Creación, pago, confirmación, rechazo y cancelación de citas.
- Listado de citas del día para médicos.
- Historial de citas con filtros para pacientes.
- Protección mediante autenticación y validación de roles.

---

## **Características**

### **Seguridad**
- Autenticación mediante JWT.
- Validación de permisos basada en roles (Paciente y Médico).

### **Validaciones**
- Fechas futuras y horarios permitidos.
- Verificación de horarios ocupados.
- Restricciones para acciones específicas según el estado de la cita.
- Validación de acceso según rol del usuario.

### **Documentación Interactiva**
- Disponible con Swagger en `http://localhost:3000/api-docs`.

### **Pruebas Unitarias**
- Cobertura de casos principales (éxito y errores).
- Pruebas de creación, pago, cancelación, confirmación, rechazo y listado de citas.

---

## **Requisitos**

### **Herramientas Necesarias**
- Node.js: >= 14.x
- MongoDB: Servicio local o remoto.
- Stripe: Configuración para pagos en modo de prueba.

### **Dependencias Clave**
```json
{
  "express": "^4.x",
  "mongoose": "^6.x",
  "jsonwebtoken": "^9.x",
  "stripe": "^10.x",
  "jest": "^29.x",
  "supertest": "^6.x"
}
```

---

## **Configuración Inicial**

1. **Clona el repositorio:**
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno en un archivo `.env`:**
   ```env
   DB_URI=mongodb://localhost:27017/medical_appointments
   TEST_DB_URI=mongodb://localhost:27017/medical_appointments_test
   JWT_SECRET=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_key
   PORT=3000
   ```

4. **Inicializa la base de datos:**
   ```bash
   node src/scripts/initializeDatabase.js
   ```

5. **Inicia el servidor:**
   ```bash
   npm start
   ```

6. **Ejecución de pruebas:**
   ```bash
   npm test
   ```

---

## **Uso**

### **Endpoints Principales**

Todos los endpoints están documentados en Swagger (`http://localhost:3000/api-docs`). A continuación, se describen los principales con sus restricciones:

### **1. Registro de Usuarios**

- **Paciente:**
  - **Endpoint:** `POST /auth/register`
  - **Body:**
    ```json
    {
      "name": "Paciente Test",
      "email": "paciente@test.com",
      "password": "password123",
      "role": "Paciente"
    }
    ```

- **Médico:**
  - **Endpoint:** `POST /auth/register`
  - **Body:**
    ```json
    {
      "name": "Médico Test",
      "email": "medico@test.com",
      "password": "password123",
      "role": "Médico"
    }
    ```

---

### **2. Creación de Citas (Paciente)**
- **Endpoint:** `POST /appointments/create`
- **Restricciones:** Solo usuarios con rol `Paciente`.
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
    "date": "2024-12-20",
    "time": "09:00",
    "price": 5000
  }
  ```

---

### **3. Pago de Citas (Paciente)**
- **Endpoint:** `POST /appointments/pay/:id`
- **Restricciones:** Solo usuarios con rol `Paciente`.
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

---

### **4. Confirmación de Citas (Médico)**
- **Endpoint:** `POST /appointments/confirm/:id`
- **Restricciones:** Solo usuarios con rol `Médico`.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_medico>"
  }
  ```

---

### **5. Rechazo de Citas (Médico)**
- **Endpoint:** `POST /appointments/reject/:id`
- **Restricciones:** Solo usuarios con rol `Médico`.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_medico>"
  }
  ```

---

### **6. Cancelación de Citas (Paciente o Médico)**
- **Endpoint:** `DELETE /appointments/cancel/:id`
- **Restricciones:** Solo usuarios con rol `Paciente` o `Médico`.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token>"
  }
  ```

---

### **7. Listado de Citas del Día (Médico)**
- **Endpoint:** `GET /appointments/list`
- **Restricciones:** Solo usuarios con rol `Médico`.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <jwt_token_medico>"
  }
  ```

---

## **Pruebas**

Ejecuta las pruebas con:
```bash
npm test
```

### **Cobertura de pruebas:**

1. **Creación de citas:** Verifica la creación exitosa y errores como horarios ocupados o inválidos.
2. **Pago de citas:** Procesa pagos exitosos mediante Stripe y valida errores de pago.
3. **Confirmación de citas:** Asegura que solo un médico puede confirmar citas pagadas.
4. **Rechazo de citas:** Permite que los médicos rechacen citas no confirmadas.
5. **Cancelación de citas:** Valida que pacientes y médicos puedan cancelar citas pendientes.
6. **Listado de citas del día:** Verifica que el médico pueda ver las citas programadas para el día actual.

---

## **Licencia**

Este proyecto está bajo la licencia MIT.
