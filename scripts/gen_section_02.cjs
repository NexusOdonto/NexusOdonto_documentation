const fs = require('fs');
const path = require('path');

const docsRoot = path.resolve(__dirname, '..', 'src', 'docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('[SEC 02] Successfully wrote:', relPath);
}

writeDoc('02_Roles_y_Permisos/01_Matriz_Roles_y_Permisos.md', `---
title: "Matriz Canónica de Roles, Permisos y Credenciales"
order: 1
author: "NexusOdonto Security Team"
date: "2026-09-16"
---

# Matriz Canónica de Roles, Permisos y Credenciales Oficiales

NexusOdonto implementa un esquema de Control de Acceso Basado en Roles (RBAC) granular con identificadores únicos estandarizados (GUIDs) tanto a nivel de base de datos como en las políticas de seguridad del Frontend y Backend.

---

## 1. Roles Canónicos y GUIDs del Sistema

| Rol | Código Canónico | GUID en Base de Datos | Alcance y Descripción |
|---|---|---|---|
| **Administrador** | \`ADMINISTRADOR\` | \`13000000-0000-0000-0000-000000000001\` | Control total del sistema, gestión de usuarios, roles, catálogos, auditoría y reportes globales. |
| **Odontólogo** | \`ODONTOLOGO\` | \`13000000-0000-0000-0000-000000000002\` | Gestión clínica, registro y edición de odontogramas FDI, evoluciones, agenda de atención y prescripciones. |
| **Recepcionista** | \`RECEPCIONISTA\` | \`13000000-0000-0000-0000-000000000003\` | Agendamiento de citas, registro de pacientes, atención en chat/asesor y consulta de disponibilidad de profesionales. Mutaciones clínicas restringidas. |
| **Asistente Dental**| \`ASISTENTE\` | \`13000000-0000-0000-0000-000000000004\` | Apoyo en recepción de pacientes e insumos clínicos. |
| **Paciente** | \`PACIENTE\` | \`13000000-0000-0000-0000-000000000005\` | Portal de autoservicio: consulta de citas propias, visualización de odontograma e historia personal. |
| **Servicio Bot** | \`BOT_SERVICE\` | \`13000000-0000-0000-0000-000000000006\` | Cuenta de servicio para el Agente IA. Requiere cabecera \`X-Internal-Secret\` y tiene bloqueado el login interactivo. |

---

## 2. Credenciales Oficiales de Prueba (Semilla / Seeders)

Las siguientes cuentas vienen precargadas en el entorno de desarrollo y pruebas mediante \`DatabaseInitializer\`:

| Rol / Tipo | Nombre Completo | Documento | Código Empleado | Correo Electrónico | Contraseña |
|---|---|---|---|---|---|
| **ADMIN** | Carlos Administrator | \`1234567890\` | \`AD001\` | \`admin@nexusodonto.com\` | \`Admin123!\` |
| **ODONTOLOGO** | Dra. Laura Gómez | \`1098765432\` | \`OD001\` | \`odontologo@nexusodonto.com\` | \`Doctor123!\` |
| **ODONTOLOGO** | Dr. Roberto Martínez | \`1098765433\` | \`OD002\` | \`roberto.martinez@nexusodonto.com\` | \`Doctor123!\` |
| **ODONTOLOGO** | Dra. Ana Sofía Silva | \`1098765434\` | \`OD003\` | \`ana.silva@nexusodonto.com\` | \`Doctor123!\` |
| **RECEPCION** | María Rodríguez | \`1087654321\` | \`RC001\` | \`recepcion@nexusodonto.com\` | \`Recepcion123!\` |
| **PACIENTE 1** | Andrés Pérez | \`1076543210\` | N/A | \`paciente@nexusodonto.com\` | \`Paciente123!\` |
| **PACIENTE 2** | Camila López | \`1076543211\` | N/A | \`camila.lopez@gmail.com\` | \`Paciente123!\` |
| **PACIENTE 3** | Felipe Torres | \`1076543212\` | N/A | \`felipe.torres@hotmail.com\` | \`Paciente123!\` |
| **PACIENTE 4** | Valentina Mendoza | \`1076543213\` | N/A | \`valentina.mendoza@yahoo.com\` | \`Paciente123!\` |
| **BOT SERVICE** | Chatbot Service | \`BOT-SERVICE-01\`| \`BOT001\` | \`bot_service@nexusodonto.com\` | \`BotService2026!\` (\*) |

> **Nota (\*):** La cuenta \`bot_service@nexusodonto.com\` solo es invocable programáticamente mediante el secret \`X-Internal-Secret: nexus-internal-bot-secret-2026\`. Intentar iniciar sesión desde la UI web arrojará error 403 Forbidden.

---

## 3. Catálogo de Permisos Granulares

\`\`\`
  Módulo           Código Permiso         GUID de Permiso                        Admin  Odonto  Recep  Pac  Bot
  ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
  Usuarios         USERS:VIEW             14000000-0000-0000-0000-000000000001     ✓       -      -    -    -
  Usuarios         USERS:CREATE           14000000-0000-0000-0000-000000000002     ✓       -      -    -    -
  Usuarios         USERS:EDIT             14000000-0000-0000-0000-000000000003     ✓       -      -    -    -
  Usuarios         USERS:DELETE           14000000-0000-0000-0000-000000000004     ✓       -      -    -    -
  Pacientes        PATIENTS:VIEW          14000000-0000-0000-0001-000000000001     ✓       ✓      ✓    -    ✓
  Pacientes        PATIENTS:CREATE        14000000-0000-0000-0001-000000000002     ✓       ✓      ✓    -    ✓
  Pacientes        PATIENTS:EDIT          14000000-0000-0000-0001-000000000003     ✓       ✓      ✓    -    -
  Citas            APPOINTMENTS:VIEW      14000000-0000-0000-0002-000000000001     ✓       ✓      ✓    ✓    ✓
  Citas            APPOINTMENTS:CREATE    14000000-0000-0000-0002-000000000002     ✓       ✓      ✓    ✓    ✓
  Citas            APPOINTMENTS:EDIT      14000000-0000-0000-0002-000000000003     ✓       ✓      ✓    -    ✓
  Citas            APPOINTMENTS:DELETE    14000000-0000-0000-0002-000000000004     ✓       ✓      ✓    -    ✓
  Clínica          CLINICAL:VIEW          14000000-0000-0000-0004-000000000001     ✓       ✓      -    ✓*   -
  Clínica          CLINICAL:CREATE        14000000-0000-0000-0004-000000000002     ✓       ✓      -    -    -
  Odontograma      ODONTOGRAM:VIEW        14000000-0000-0000-0005-000000000001     ✓       ✓      -    ✓*   -
  Odontograma      ODONTOGRAM:CREATE      14000000-0000-0000-0005-000000000002     ✓       ✓      -    -    -
  Catálogos        CATALOGS:VIEW          14000000-0000-0000-0003-000000000001     ✓       ✓      ✓    ✓    ✓
  Catálogos        CATALOGS:MANAGE        14000000-0000-0000-0003-000000000002     ✓       -      -    -    -
  Chatbot          CHATBOT:VIEW           14000000-0000-0000-0008-000000000001     ✓       -      ✓    -    ✓
  Chatbot          CHATBOT:CREATE         14000000-0000-0000-0008-000000000002     ✓       -      ✓    -    ✓
  Chatbot          CHATBOT:EDIT           14000000-0000-0000-0008-000000000003     ✓       -      ✓    -    ✓
\`\`\`
* (\`✓*\`): El paciente solo tiene acceso de lectura a sus propios registros clínicos mediante endpoints aislados por \`patientId\`.
`);

writeDoc('02_Roles_y_Permisos/02_Seguridad_y_Autenticacion_JWT.md', `---
title: "Seguridad y Autenticación JWT"
order: 2
author: "NexusOdonto Security Team"
date: "2026-09-16"
---

# Seguridad, Autenticación JWT y OAuth 2.0

NexusOdonto utiliza una arquitectura de autenticación hibrida basada en tokens JWT con rotación de Refresh Tokens, integración con Google OAuth y mecanismos de protección activa contra escalamiento de privilegios.

---

## 1. Flujo de Autenticación con JWT

\`\`\`
  [ Cliente Web / App ]                    [ Backend API ]                  [ Oracle DB ]
           │                                      │                               │
           │── 1. POST /api/Auth/login ──────────>│                               │
           │      { email, password }             │── 2. Validar Hash BCrypt ────>│
           │                                      │<─ 3. Usuario & Roles OK ──────│
           │<─ 4. 200 OK (AccessToken + Refresh)─│                               │
           │                                      │                               │
           │── 5. GET /api/Appointments ─────────>│                               │
           │      Header: Bearer <AccessToken>    │── 6. Validar Claims & Rol ───>│
           │<─ 7. 200 OK (Datos) ─────────────────│                               │
\`\`\`

### Estructura de Claims del JWT Access Token:
* \`sub\`: Identificador GUID del usuario (\`UserId\`).
* \`email\`: Correo electrónico verificado.
* \`role\`: Código del rol primario (\`ADMINISTRADOR\`, \`ODONTOLOGO\`, etc.).
* \`roleIds\`: Arreglo de GUIDs de roles asociados.
* \`permissions\`: Lista de códigos de permisos activos (\`APPOINTMENTS:VIEW\`, etc.).
* \`personId\`: Identificador GUID de la entidad \`Person\`.
* \`exp\`: Timestamp Unix de expiración (60 minutos por defecto).

---

## 2. Google OAuth: Inicio de Sesión, Vinculación y Desvinculación

NexusOdonto permite que los usuarios autentiquen o enlacen su cuenta con Google:

* **Inicio de Sesión con Google (\`POST /api/Auth/google\`):** Valida el \`id_token\` de Google contra los servidores de Google OAuth. Si el usuario existe, emite los tokens JWT de NexusOdonto; si no existe, crea el perfil de Paciente automáticamente.
* **Vinculación de Cuenta (\`POST /api/Auth/google/link\`):** Permite a un usuario autenticado asociar su \`GoogleId\` a su perfil existente.
* **Desvinculación de Cuenta (\`POST /api/Auth/google/unlink\`):** Permite retirar la vinculación de Google, siempre y cuando el usuario cuente con una contraseña local válida para evitar bloqueos de acceso.

---

## 3. Mecanismos de Protección Activa

### 1. \`SeedAdminGuard\` (Protección de Cuenta Semilla)
El usuario Administrador \`AD001\` (\`admin@nexusodonto.com\`) está protegido a nivel de código de aplicación:
* Las solicitudes \`DELETE /api/Users/{id}\` o \`PUT /api/Users/{id}/status\` que apunten al \`AdminUserId\` son rechazadas con error \`400 Bad Request\` ("El usuario administrador semilla no puede ser desactivado ni eliminado").
* Al inicializar la base de datos (\`DatabaseInitializer\`), el sistema utiliza \`.IgnoreQueryFilters()\` para restaurar automáticamente el estado activo del administrador en caso de modificaciones externas.

### 2. Restricción de Inicio de Sesión Interactivo a \`BOT_SERVICE\`
* La cuenta \`bot_service@nexusodonto.com\` no puede iniciar sesión mediante el formulario de login ni por Google.
* Cualquier petición de autenticación para este usuario sin la cabecera interna \`X-Internal-Secret\` es interceptada y rechazada inmediatamente.
`);

writeDoc('02_Roles_y_Permisos/03_Reglas_de_Acceso_y_Segregacion.md', `---
title: "Reglas de Acceso y Segregación por Rol"
order: 3
author: "NexusOdonto Security Team"
date: "2026-09-16"
---

# Reglas de Acceso y Segregación por Rol

Para garantizar el cumplimiento de normativas de privacidad médica y evitar fugas de información sensible o métricas de negocio, NexusOdonto aplica reglas estrictas de segregación tanto en el Frontend como en el Backend.

---

## 1. Matriz de Rutas Permitidas en Frontend (\`routePermissions.ts\`)

\`\`\`typescript
export const ROLE_ALLOWED_ROUTES: Record<SystemRole, string[]> = {
  ADMINISTRADOR: [
    "/dashboard",
    "/citas",
    "/agenda",
    "/atencion-chat",
    "/pacientes",
    "/pacientes/nuevo",
    "/profesionales",
    "/servicios",
    "/historia-clinica",
    "/odontograma",
    "/usuarios",
    "/roles-permisos",
    "/configuracion",
    "/perfil",
  ],
  ODONTOLOGO: [
    "/dashboard",
    "/citas",
    "/agenda",
    "/pacientes",
    "/pacientes/nuevo",
    "/profesionales",
    "/servicios",
    "/historia-clinica",
    "/odontograma",
    "/perfil",
  ],
  RECEPCIONISTA: [
    "/dashboard",
    "/citas",
    "/agenda",
    "/atencion-chat",
    "/pacientes",
    "/pacientes/nuevo",
    "/profesionales",
    "/servicios",
    "/perfil",
  ],
  PACIENTE: [
    "/dashboard",
    "/citas",
    "/servicios",
    "/profesionales",
    "/historia-clinica",
    "/odontograma",
    "/perfil",
  ],
};
\`\`\`

---

## 2. Segregación Crítica por Rol

### 1. Rol RECEPCIONISTA (Restricción de Mutaciones Clínicas y Catálogos)
* **Historia Clínica y Odontograma:** La recepcionista no tiene acceso a las vistas de historias clínicas detalladas (\`/historia-clinica\`) ni odontograma (\`/odontograma\`).
* **Servicios y Tarifas (\`ServiciosView.tsx\`):** La recepcionista puede visualizar el catálogo de servicios y precios para informar a los pacientes, pero los botones de acción para **Crear**, **Editar**, **Activar/Desactivar** o **Eliminar** servicios quedan ocultos y deshabilitados (fix \`bd072bc\`).

### 2. Rol PACIENTE (Aislamiento Total de Datos Médicos y Financieros)
* **Aislamiento de Citas:** El paciente solo puede ver y solicitar citas para su propio \`patientId\`.
* **Aislamiento de Odontograma:** El paciente visualiza su odontograma en modo de solo lectura. No tiene selector de pacientes ni puede ver odontogramas de terceros.
* **Métricas y KPIs:** El dashboard del paciente no muestra ingresos monetarios de la clínica, total de pacientes atendidos ni métricas administrativas globales.

### 3. Rol ODONTÓLOGO (Bloqueo de Profesional Responsable)
* Al registrar un odontograma o evolución clínica, el sistema fija automáticamente al odontólogo autenticado como el profesional responsable (\`ProfessionalId\`), impidiendo que un doctor registre procedimientos a nombre de otro colega (fix \`0c479bb\`).
`);
