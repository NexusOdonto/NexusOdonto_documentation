const fs = require('fs');
const path = require('path');

const docsRoot = path.resolve(__dirname, '..', 'src', 'docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('[SEC 05] Successfully wrote:', relPath);
}

writeDoc('05_Bitacora_de_Commits_y_Dailies/2026-08-24_Al_2026-08-26_Fase_Inicial.md', `---
title: "Bitácora 24 al 26 de Agosto de 2026: Fase Inicial y Estructura Base"
order: 1
author: "Equipo NexusOdonto"
date: "2026-08-26"
type: "Feature"
---

# Bitácora de Trabajo: 24 al 26 de Agosto de 2026

Registro de actividades correspondiente al arranque y definición de la arquitectura base del proyecto NexusOdonto.

---

## 1. Resumen de Sesiones y Objetivos

* **Sesión 24/08/2026:**
  * Definición de la Clean Architecture para el Backend en .NET 8.
  * Creación del modelo relacional en Oracle Database para las entidades principales (\`Users\`, \`Roles\`, \`Persons\`).
  * Estructuración inicial del proyecto Frontend en Vite + React + TypeScript.
* **Sesión 25/08/2026:**
  * Implementación de la autenticación base mediante BCrypt y generación de tokens JWT.
  * Creación de layouts primarios (\`Sidebar\`, \`TopBar\`) y temas de diseño visual.
* **Sesión 26/08/2026:**
  * Integración de los primeros endpoints de servicios y roles.
  * Publicación de la primera versión del portal de documentación interna.

---

## 2. Módulos Afectados y Entregables

* **Backend (.NET 8):** Solución multicapa (\`Domain\`, \`Application\`, \`Infrastructure\`, \`Api\`) y configuración de Entity Framework Core con Oracle.
* **Frontend (React):** Sistema de routing inicial con React Router DOM y componentes atómicos UI.
* **Base de Datos:** Primera migración de tablas base y tipos de documento.
`);

writeDoc('05_Bitacora_de_Commits_y_Dailies/2026-08-27_Al_2026-09-03_Seeders_y_Servicios.md', `---
title: "Bitácora 27 de Agosto al 03 de Septiembre de 2026: Seeders, Empleados y Catálogos"
order: 2
author: "Equipo NexusOdonto"
date: "2026-09-03"
type: "Feature"
---

# Bitácora de Trabajo: 27 de Agosto al 03 de Septiembre de 2026

Registro de avances en persistencia, semillas de datos, catálogos clínicos y códigos de empleados.

---

## 1. Commits Clave del Período

* \`7f69dbc\` (01/09) - *feat: enhance role permissions for appointment management*
* \`e9219ed\` (03/09) - *feat: Agregar y ajustar seeder*
* \`3318262\` (03/09) - *feat: enhance service management with new code resolution logic*
* \`ce19ca8\` (03/09) - *feat: add document number retrieval and conflict handling in person services*

---

## 2. Detalle de Tareas Ejecutadas

* **Unicidad de Documentos:** Se configuró un índice único obligatorio en \`PersonEntity.DocumentNumber\` para evitar duplicados en pacientes y empleados.
* **Códigos de Empleados (\`EmployeeCode\`):** Se crearon los códigos formales de identificación (\`AD001\`, \`RC001\`, \`OD001\`, \`OD002\`, \`OD003\`, \`BOT001\`).
* **Catálogo de Servicios:** Se estructuró la resolución automática de códigos y acrónimos de servicios odontológicos.
* **Seeders Resilientes:** Incorporación de \`DatabaseInitializer\` para poblar pacientes (\`1076543210\` a \`1076543213\`) y disponibilidades horarias de especialistas.
`);

writeDoc('05_Bitacora_de_Commits_y_Dailies/2026-09-04_Al_2026-09-10_Chatbot_Gemini_y_OAuth.md', `---
title: "Bitácora 04 al 10 de Septiembre de 2026: Gemini AI, Caché Semántica y Google OAuth"
order: 3
author: "Equipo NexusOdonto"
date: "2026-09-10"
type: "Feature"
---

# Bitácora de Trabajo: 04 al 10 de Septiembre de 2026

Implementación del Asistente Virtual Inteligente con Google Gemini, base de datos vectorial para caché semántica y sistema de login Google OAuth.

---

## 1. Commits Clave del Período

* \`06c2ce2\` (04/09) - *feat: implement authentication system including Google OAuth, patient onboarding, and clinical record management*
* \`c0c17b8\` (04/09) - *feat: enhance JWT configuration with refresh token expiration settings*
* \`062804d\` / \`b8dfee0\` (07/09 - 09/09) - *feat: implement chatbot support ticket management service and API controller*
* \`d780621\` / \`ddfd4dd\` / \`2d2f4f5\` - *feat: Finalización módulo Gemini (Checkpoint 1 v3) y semantic_cache*
* \`6f8f4cd\` (10/09) - *feat: enhance Docker documentation and API configuration for chatbot integration*

---

## 2. Detalle de Tareas Ejecutadas

* **Integración con Google GenAI:** Adopción del modelo Gemini 1.5 Flash para responder dudas odontológicas, triaje básico y agendamiento sin requerir registro previo del paciente.
* **Caché Semántica (PostgreSQL + Pgvector):** Implementación de búsqueda por similitud de coseno para reutilizar respuestas de preguntas frecuentes, optimizando costos de cuota de API.
* **Sistema de Tickets de Chatbot:** Creación del flujo de escalamiento para transferir conversaciones automáticas a recepcionistas humanos.
* **Google OAuth y Refresh Tokens:** Soporte para inicio de sesión con cuenta de Google y rotación segura de tokens JWT.
`);

writeDoc('05_Bitacora_de_Commits_y_Dailies/2026-09-11_Al_2026-09-14_Agenda_Odontograma_y_Seguridad.md', `---
title: "Bitácora 11 al 14 de Septiembre de 2026: Agenda, Odontograma FDI y Blindaje de Seguridad"
order: 4
author: "Equipo NexusOdonto"
date: "2026-09-14"
type: "Feature"
---

# Bitácora de Trabajo: 11 al 14 de Septiembre de 2026

Desarrollo del Odontograma interactivo, integración de la Agenda médica, panel de atención al asesor y endurecimiento de seguridad.

---

## 1. Commits Clave del Período

* \`37f63b7\` / \`01609ec\` (11/09) - *feat: add AtencionAsesorView component for advisor chat and ticket management; show phone number*
* \`e7c6ebb\` / \`20b2115\` (11/09) - *feat: register options/auto-login, Google link page, advisor send-whatsapp*
* \`28a6bcd\` (14/09) - *fix: block BOT_SERVICE interactive login without X-Internal-Secret*
* \`313d9c8\` (14/09) - *fix: protect seed admin from deactivation and reactivate via seeders*
* \`8025e67\` / \`f241a78\` (14/09) - *feat: add odontogram UI and appointment management modules with corresponding API services*
* \`0c479bb\` (14/09) - *fix: lock logged-in odontologist as odontogram responsible dentist*

---

## 2. Decisiones Técnicas y Correcciones

* **Seguridad Activa (\`SeedAdminGuard\`):** Se bloqueó la desactivación o borrado del administrador \`AD001\` desde la API y se configuró su autoreparación en el seeder.
* **Aislamiento de la Cuenta Bot:** Bloqueo de inicio de sesión directo por contraseña para la cuenta del bot; solo operable con la cabecera \`X-Internal-Secret\`.
* **Atención y WhatsApp Directo:** Incorporación de botón para iniciar chat de WhatsApp con el número del paciente en casos de seguimiento urgente.
* **Integridad del Odontólogo Tratante:** Forzar la identidad del odontólogo en sesión como el responsable clínico inmutable del odontograma.
`);

writeDoc('05_Bitacora_de_Commits_y_Dailies/2026-09-15_Consolidacion_Clinica_y_PDF.md', `---
title: "Bitácora 15 de Septiembre de 2026: Consolidación Clínica, PDFs y Zona Horaria Colombia"
order: 5
author: "Equipo NexusOdonto"
date: "2026-09-15"
type: "Feature"
---

# Bitácora de Trabajo: 15 de Septiembre de 2026

Jornada intensiva de estabilización clínica, motor de generación de PDFs, avatares geométricos y calibración horaria.

---

## 1. Commits Clave del Período

* \`b35d919\` (15/09) - *feat(profile): integrate blobatar geometric animated avatars for user profiles*
* \`aac19a5\` / \`64d2873\` (15/09) - *fix: strip ODONTOGRAM_STATE and truncate notes to 2000 to prevent ORA-12899*
* \`f425e44\` (15/09) - *feat: Enhance PacientesView CSV export with additional fields*
* \`876950e\` (15/09) - *fix(historia-clinica): fix text clipping in detail drawer with portal*
* \`3bc05b5\` (15/09) - *feat: add PDF generation components for clinical records, prescriptions, and individual registrations*
* \`d0f0c3c\` / \`a779b39\` (15/09) - *feat: add fallback services, persist Category and IsActive on Services*
* \`f4cc813\` / \`80f67b6\` (15/09) - *fix: validate appointments in Colombia clinic time and persist profile via PUT /auth/me*

---

## 2. Logros Técnicos

* **Prevención de Error Oracle ORA-12899:** Se implementó el truncamiento automático de notas a 2000 caracteres en las capas de persistencia y se eliminó la columna serializada \`ODONTOGRAM_STATE\`.
* **Solución al Desborde Visual (Portal Drawer):** Se migró el cajón de detalle de historias clínicas a un React Portal montado en \`document.body\`, resolviendo problemas de recorte de texto.
* **Motor de Documentos PDF:** Despliegue de plantillas para Historia Clínica, Fórmulas Médicas y Registros Individuales de Atención.
* **Calibración Horaria Colombia:** Normalización estricta de las citas médicas en la zona horaria clínica de Colombia (\`America/Bogota\`, UTC-5).
`);

writeDoc('05_Bitacora_de_Commits_y_Dailies/2026-09-16_Refactor_Final_y_Segregacion.md', `---
title: "Bitácora 16 de Septiembre de 2026: Refactor Final, Aislamiento y Segregación de Roles"
order: 6
author: "Equipo NexusOdonto"
date: "2026-09-16"
type: "Fix"
---

# Bitácora de Trabajo: 16 de Septiembre de 2026

Aislamiento de datos de pacientes en el odontograma, refactor de la tabla de citas, desvinculación de Google OAuth y segregación de recepcionistas.

---

## 1. Commits Clave de la Jornada

* \`28301fb\` (16/09 08:21) - *feat: Enhance odontogram functionality with patient isolation tests and improved data handling*
* \`2bd34f3\` (16/09 10:09) - *feat: Update user status handling and filtering in UsuariosView and UsuariosTable*
* \`4ba48b5\` (16/09 10:17) - *feat: Refactor CitasTable to use a table layout for improved readability and structure*
* \`bd072bc\` (16/09 11:21) - *fix: hide clinical history and service mutations from receptionists*
* \`1414769\` (16/09 11:43) - *fix: allow users to unlink Google from their account*

---

## 2. Detalle de Tareas Ejecutadas y Módulos Afectados

* **Frontend - Aislamiento de Odontograma:** Creación de pruebas de aislamiento para validar que cada paciente solo acceda a su propio mapa dental y que los odontólogos tengan la vista completa del paciente activo sin contaminación cruzada de estados.
* **Frontend - Refactor de CitasTable:** Migración de tarjetas visuales a un diseño en tabla tabular estructurada con paginación, filtros de estado y badges de prioridad clínica.
* **Seguridad - Segregación de Recepcionistas:** Se ocultaron y deshabilitaron las acciones de creación, edición y eliminación de servicios en \`ServiciosView.tsx\` y el acceso a historias clínicas para usuarios con rol \`RECEPCIONISTA\`, dejando habilitada únicamente la consulta de información general de tarifas.
* **Backend - Desvinculación de Google OAuth:** Se añadió el endpoint \`POST /api/Auth/google/unlink\` con validación de contraseña preexistente.
`);
