const fs = require('fs');
const path = require('path');

const docsRoot = path.resolve(__dirname, '..', 'src', 'docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('[SEC 04] Successfully wrote:', relPath);
}

writeDoc('04_API_y_Servicios/01_Autenticacion_y_Perfil_API.md', `---
title: "API de Autenticación, Perfil y OAuth"
order: 1
author: "NexusOdonto Backend Team"
date: "2026-09-16"
---

# API de Autenticación, Perfil y Google OAuth

Catálogo de endpoints para inicio de sesión, registro, renovación de tokens, vinculación de proveedores OAuth y actualización del perfil del usuario.

---

## 1. Endpoints de Autenticación

### \`POST /api/Auth/login\`
Inicia sesión mediante credenciales locales (correo o documento y contraseña).

* **Headers:** \`Content-Type: application/json\`
* **Body Request:**
\`\`\`json
{
  "email": "admin@nexusodonto.com",
  "password": "Admin123!"
}
\`\`\`
* **Response (200 OK):**
\`\`\`json
{
  "isSuccess": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "refreshToken": "d8e3b4f0-9a1b-4c2d-8e5f-1a2b3c4d5e6f",
    "expiresAt": "2026-09-16T18:00:00Z",
    "user": {
      "id": "12000000-0000-0000-0000-000000000001",
      "email": "admin@nexusodonto.com",
      "firstName": "Carlos",
      "lastName": "Administrator",
      "roles": ["ADMINISTRADOR"],
      "permissions": ["USERS:VIEW", "PATIENTS:VIEW", "APPOINTMENTS:VIEW"]
    }
  },
  "message": "Inicio de sesión exitoso."
}
\`\`\`

---

### \`POST /api/Auth/refresh-token\`
Renueva un \`accessToken\` expirado utilizando el \`refreshToken\` vigente.

* **Body Request:**
\`\`\`json
{
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "d8e3b4f0-9a1b-4c2d-8e5f-1a2b3c4d5e6f"
}
\`\`\`
* **Response (200 OK):** Devuelve nuevo par de \`accessToken\` y \`refreshToken\`.

---

### \`POST /api/Auth/google\`
Inicia sesión o registra a un paciente mediante Google OAuth 2.0.

* **Body Request:**
\`\`\`json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
\`\`\`

---

### \`POST /api/Auth/google/link\` y \`POST /api/Auth/google/unlink\`
* **Link:** Asocia el Google ID del token a la cuenta autenticada actual.
* **Unlink:** Desvincula la cuenta de Google (requiere que el usuario tenga contraseña local configurada).

---

## 2. Endpoints de Perfil (\`/api/Auth/me\`)

### \`GET /api/Auth/me\`
Obtiene los datos completos del usuario autenticado. Requiere \`Authorization: Bearer <token>\`.

### \`PUT /api/Auth/me\`
Actualiza los datos personales (nombres, apellidos, teléfono, dirección) del usuario actual.

* **Body Request:**
\`\`\`json
{
  "firstName": "Carlos",
  "lastName": "Administrator",
  "phone": "+57 300 123 4567",
  "address": "Calle 100 # 15-20, Bogotá",
  "avatarUrl": "blobatar-geometric-01"
}
\`\`\`
`);

writeDoc('04_API_y_Servicios/02_Citas_y_Agenda_API.md', `---
title: "API de Citas y Agenda Médica"
order: 2
author: "NexusOdonto Backend Team"
date: "2026-09-16"
---

# API de Citas y Agenda Médica

Endpoints para la consulta, programación, confirmación y cancelación de citas odontológicas.

---

## 1. Endpoints Principales

### \`GET /api/Appointments\`
Obtiene la lista de citas filtradas por parámetros de consulta.

* **Query Parameters:**
  * \`startDate\` (opcional, formato ISO): Fecha inicial de búsqueda.
  * \`endDate\` (opcional, formato ISO): Fecha final de búsqueda.
  * \`patientId\` (opcional): Filtrar por ID de paciente (forzado para rol PACIENTE).
  * \`dentistId\` (opcional): Filtrar por odontólogo asignado.
  * \`status\` (opcional): \`PROGRAMADA\`, \`CONFIRMADA\`, \`COMPLETADA\`, \`CANCELADA\`.

---

### \`POST /api/Appointments\`
Crea una nueva cita odontológica.

* **Body Request:**
\`\`\`json
{
  "patientId": "1b000000-0000-0000-0000-000000000013",
  "professionalId": "1a000000-0000-0000-0000-000000000001",
  "serviceId": "10000000-0000-0000-0000-000000000001",
  "appointmentDateTime": "2026-09-20T09:00:00-05:00",
  "notes": "Valoración inicial de ortodoncia."
}
\`\`\`
> **Lógica de Asignación Automática:** Si \`professionalId\` es enviado nulo o vacío por una solicitud de paciente o chatbot, el backend evalúa los profesionales con turno disponible en esa franja horaria y asigna automáticamente al odontólogo libre con menor carga.

---

### \`PUT /api/Appointments/{id}/status\`
Modifica el estado de una cita.

* **Body Request:**
\`\`\`json
{
  "status": "CONFIRMADA",
  "cancellationReason": null
}
\`\`\`
`);

writeDoc('04_API_y_Servicios/03_Odontograma_y_Clinica_API.md', `---
title: "API de Odontograma e Historia Clínica"
order: 3
author: "NexusOdonto Clinical Engineering"
date: "2026-09-16"
---

# API de Odontograma e Historia Clínica

Endpoints especializados para la persistencia y recuperación del estado dental bajo estándar FDI y notas de evolución clínica.

---

## 1. Endpoints de Odontograma

### \`GET /api/Odontograms/patient/{patientId}/latest\`
Recupera el odontograma más reciente registrado para el paciente especificado.

* **Response (200 OK):**
\`\`\`json
{
  "id": "2a000000-0000-0000-0000-000000000001",
  "patientId": "1b000000-0000-0000-0000-000000000013",
  "professionalId": "1a000000-0000-0000-0000-000000000001",
  "recordDate": "2026-09-15T10:30:00Z",
  "notes": "Odontograma inicial de control.",
  "items": [
    {
      "toothNumber": 16,
      "surfaceCode": "O",
      "statusCode": "CARIES",
      "note": "Caries oclusal profunda"
    },
    {
      "toothNumber": 21,
      "surfaceCode": "V",
      "statusCode": "RESTAURADO",
      "note": "Resina vestibular previa"
    }
  ]
}
\`\`\`

---

### \`POST /api/Odontograms\`
Registra una nueva evaluación de odontograma para un paciente.

* **Body Request:**
\`\`\`json
{
  "patientId": "1b000000-0000-0000-0000-000000000013",
  "notes": "Odontograma tras exodoncia pieza 18.",
  "items": [
    {
      "toothNumber": 18,
      "surfaceCode": "O",
      "statusCode": "AUSENTE",
      "note": "Exodoncia indicada y ejecutada"
    }
  ]
}
\`\`\`

---

## 2. Endpoints de Historia Clínica (\`/api/ClinicalRecords\`)

* \`GET /api/ClinicalRecords/patient/{patientId}\`: Historial cronológico de evoluciones médicas.
* \`POST /api/ClinicalRecords\`: Registro de nueva evolución médica (diagnóstico CIE-10, procedimiento realizado, indicaciones al paciente).
`);

writeDoc('04_API_y_Servicios/04_Chatbot_Tickets_y_Asesor_API.md', `---
title: "API de Chatbot, Conversaciones y Tickets de Soporte"
order: 4
author: "NexusOdonto AI & Support Team"
date: "2026-09-16"
---

# API de Chatbot, Conversaciones y Tickets de Soporte

Endpoints que intercomunican el Agente de Inteligencia Artificial en Python con el Backend Central en .NET y la mesa de ayuda de recepcionistas/asesores.

---

## 1. Autenticación Interna de Servicios

Todas las peticiones originadas desde el contenedor del Chatbot deben incluir el encabezado:
\`\`\`http
X-Internal-Secret: nexus-internal-bot-secret-2026
\`\`\`

---

## 2. Endpoints de Tickets y Conversaciones

### \`GET /api/Chatbot/tickets\`
Lista los tickets de soporte abiertos o en atención por asesores humanos.

* **Query Parameters:** \`status\` (\`OPEN\`, \`IN_PROGRESS\`, \`RESOLVED\`).

---

### \`PUT /api/Chatbot/tickets/{id}/resolve\`
Cierra el ticket de soporte tras la intervención del asesor.

* **Body Request:**
\`\`\`json
{
  "resolutionNote": "Paciente atendido y cita agendada para el viernes a las 10:00 AM.",
  "returnToBot": true
}
\`\`\`
* **Comportamiento:** Si \`returnToBot\` es \`true\`, el estado de la conversación se reactiva para que el chatbot retome el diálogo automatizado con el paciente.
`);

writeDoc('04_API_y_Servicios/05_Servicios_Pacientes_Usuarios_API.md', `---
title: "API de Servicios, Pacientes, Usuarios y Catálogos"
order: 5
author: "NexusOdonto Core Team"
date: "2026-09-16"
---

# API de Servicios, Pacientes, Usuarios y Catálogos

Catálogo de recursos maestros y entidades auxiliares del sistema.

---

## 1. Servicios Odontológicos (\`/api/Services\`)

* \`GET /api/Services\`: Lista el catálogo de servicios (categoría, código, tarifa, estado activo).
* \`POST /api/Services\`: Crea un nuevo servicio (requiere rol \`ADMINISTRADOR\` u \`ODONTOLOGO\`).
* \`PUT /api/Services/{id}\`: Modifica tarifas y nombres de procedimientos.
* \`DELETE /api/Services/{id}\`: Desactiva un servicio del catálogo.

---

## 2. Pacientes y Usuarios

* \`GET /api/Patients\`: Búsqueda paginada de pacientes con filtros por documento o nombre.
* \`POST /api/Patients\`: Registro de nuevo paciente con validación de documento único.
* \`GET /api/Users\`: Listado de cuentas con roles asignados y último acceso.
* \`PUT /api/Users/{id}/status\`: Activa o desactiva un usuario (protegido por \`SeedAdminGuard\`).

---

## 3. Catálogos Base (\`/api/Catalogs\`)

* \`GET /api/Catalogs/document-types\`: Tipos de documento (CC, TI, CE, Pasaporte, Registro Civil).
* \`GET /api/Catalogs/roles\`: Roles del sistema disponibles.
* \`GET /api/Catalogs/specialties\`: Especialidades odontológicas (Ortodoncia, Endodoncia, Periodoncia, Cirugía Maxilofacial, Odontopediatría).
`);
