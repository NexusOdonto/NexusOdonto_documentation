const fs = require("fs");
const path = require("path");

const docsRoot = path.resolve(__dirname, "..", "src", "docs", "05_Bitacora_de_Commits_y_Dailies");

const bitacora17 = `---
title: "Bitácora Diaria — Jueves 17 de Septiembre 2026"
order: 19
author: "Equipo NexusOdonto"
date: "2026-09-17"
type: "Production Release and Realtime Enhancements"
summary: "Daily Scrum, Certificación Release v1.0.0 (Lighthouse 100/100), Tracking de Estado Online de Pacientes, Componente GlassSelect y AppointmentService Backend"
---

# Bitácora de Desarrollo: Jueves, 17 de Septiembre de 2026

Registro diario de trabajo en equipo, minuta de la Daily Scrum, acuerdos técnicos, resolución de bloqueos y commits sincronizados en el ecosistema NexusOdonto.

---

## 1. Ficha de la Sesión y Daily Scrum

* **Fecha:** Jueves, 17 de Septiembre de 2026
* **Modalidad:** Virtual (Discord & Google Meet) — 08:30 AM a 10:30 AM
* **Participantes:**
  - **Frontend Lead:** Andrés Felipe Navas Alvear
  - **Backend Lead:** Alejandro Escobar Lozada
  - **Fullstack / Appointments:** Felipe Corredor Silva
  - **QA & Security:** Equipo de verificación y auditoría
* **Objetivo de la Jornada:** Certificación oficial de la versión \`v1.0.0\` para producción, optimización de métricas Core Web Vitals (Lighthouse 100/100), implementación de indicadores de presencia y estado activo de pacientes, estandarización de dropdowns con \`GlassSelect\` y refactorización del servicio de agenda médica en el backend.

---

## 2. Minuta y Temas Discutidos en la Reunión

### 🚀 A. Certificación de Release v1.0.0 y Optimización Lighthouse
* **Auditoría de Rendimiento:** Andrés presentó la auditoría técnica con puntuación perfecta de **100/100 en Lighthouse**.
* **Estrategia de Optimización:**
  - Precarga de imágenes y banners críticos (\`cuadro-landing-dark.webp\` y \`nexus-odonto-logo.webp\`) en \`index.html\`.
  - Configuración avanzada de chunking y split de dependencias pesadas (\`@react-pdf/renderer\`, lucide icons, frameworks UI) en \`vite.config.ts\`.
  - Optimización en la carga asíncrona de fuentes tipográficas para reducir el First Contentful Paint (FCP) a menos de 0.6s.

### 👥 B. Indicadores de Estado Dinámico y Activo/Inactivo de Pacientes
* **Monitoreo de Estado Clínico y Presencia:** Se acordó que tanto en \`PacientesGrid\` como en \`PacientesTable\` se debe reflejar de forma visual el estado de actividad del paciente (Activo / Inactivo) con badges de colores y tooltips explicativos.
* **Toggle de Estado en Modal:** Se añadió en \`PacienteDetailModal.tsx\` un control de cambio de estado en un clic, permitiendo reactivar o suspender fichas de pacientes de manera inmediata sin salir del flujo de trabajo.
* **Blindaje RBAC de Administrador:** Se implementó una salvaguarda en \`RolesPermisosView.tsx\` para evitar que un usuario administrador pueda degradar accidentalmente sus propios permisos o quedar bloqueado fuera del sistema.

### 🎨 C. Componente GlassSelect y Corrección de Z-Index
* **Problema de Superposición:** En formularios de Servicios (\`ServiciosView.tsx\`) y Usuarios (\`UsuariosView.tsx\`), los menús desplegables nativos quedaban ocultos detrás de tarjetas y overlays con efecto glassmorphism.
* **Solución Técnica:** Se creó el componente reutilizable \`GlassSelect.tsx\`, integrando portales DOM y capas de z-index elevadas (\`z-50\` / \`z-[9999]\`) para garantizar una apertura limpia y legible sobre cualquier fondo animado.

### 💬 D. Resiliencia en Conexión de WhatsApp QR (Chatbot / Asesor)
* **Control de Errores Transitorios:** Alejandro ajustó el sondeo (\`polling\`) del código QR de WhatsApp en \`AtencionAsesorView.tsx\` para evitar que microcortes de red o respuestas \`503/504\` temporales reinicien erróneamente el estado de la sesión, conservando el token de reconexión.

### ⚙️ E. Backend AppointmentService y Ciclo de Vida de Citas
* **Reingeniería de la Agenda:** Felipe Corredor refactorizó \`AppointmentService.cs\` para consolidar la creación, reagendamiento, cancelación y validación de horarios médicos con trazabilidad de auditoría en la base de datos Oracle.

---

## 3. Bloqueos Identificados y Soluciones Acordadas

| Bloqueo / Desafío | Impacto | Solución Acordada | Responsable |
|---|---|---|---|
| Dropdowns ocultos bajo tarjetas translúcidas | Imposibilidad de seleccionar roles y categorías de servicios | Creación del componente \`GlassSelect\` con portal React y z-index jerárquico | Frontend |
| Parpadeo de desconexión en polling de WhatsApp QR | Interrupción molesta de la vista de asesoría en tiempo real | Implementación de reintentos silenciosos y retención de estado ante errores transitorios | Backend / Frontend |
| Peso inicial del bundle en producción (> 1.8 MB) | Tiempos de carga elevados en conexiones móviles | Code splitting granular en Vite y conversión de assets a WebP optimizado | Frontend Lead |
| Riesgo de auto-bloqueo de administradores en matriz RBAC | Pérdida potencial de control del sistema | Validación preventiva que deshabilita la auto-revocación de privilegios root | Frontend / Seguridad |

---

## 4. Detalle Consolidado de Commits por Repositorio

### 💻 Frontend (\`NexusOdontoFrontend\` - 11 commits)

| Hash | Autor | Componente | Descripción del Commit |
|---|---|---|---|
| \`140487f\` | Andres Felipe Navas Alvear | \`Pacientes / Auth\` | feat: implement online status tracking for patients and update UI accordingly |
| \`4773abb\` | Andres Felipe Navas Alvear | \`Pacientes / RBAC\` | feat: enhance patient management UI with dynamic status indicators and role-based permissions |
| \`fc4a2fc\` | Andres Felipe Navas Alvear | \`Performance\` | feat: preload critical images and optimize font loading in index.html; update asset paths; enhance Vite config |
| \`2278eae\` | Andres Felipe Navas Alvear | \`UI / Select\` | fix: adjust z-index for dropdowns in GlassSelect, ServiciosView, and UsuariosView for improved visibility |
| \`3872004\` | Alejandro escobar | \`Dependencies\` | fix: sync pnpm-lock with package.json dependencies |
| \`d008790\` | Andres Felipe Navas Alvear | \`Git\` | Merge branch 'develop' of https://github.com/NexusOdonto/NexusOdontoFrontend into develop |
| \`170c85a\` | Andres Felipe Navas Alvear | \`UI / Refactor\` | Refactor UI components for improved styling and responsiveness in PacientesGrid, PacientesTable, ServiciosView; integrate GlassSelect |
| \`338ffa6\` | Alejandro escobar | \`Chat / WhatsApp\` | fix: keep WhatsApp status when QR poll returns a transient error |
| \`f047da4\` | Andres Felipe Navas Alvear | \`Release\` | feat(release): v1.0.0 certificada para produccion - lighthouse 100/100 y optimizacion completa |
| \`af85042\` | Felipe Corredor | \`Citas\` | feat: add CitasView component and types for appointment management |
| \`1225e5c\` | Felipe Corredor | \`Core Views\` | feat: add core feature views and components for odontogram, patients, appointments, and clinical history |

### ⚙️ Backend API (\`NexusOdontoBackend_Api\` - 1 commit)

| Hash | Autor | Capa | Descripción del Commit |
|---|---|---|---|
| \`d6a2477\` | Felipe Corredor | \`Schedule / Services\` | feat: implement AppointmentService for managing schedules and appointments |

---

## 5. Acuerdos y Próximos Pasos (Next Steps)

1. **Sincronización de Presencia en Vivo con SignalR:** Conectar el estado online de pacientes a eventos de WebSocket push en tiempo real.
2. **Despliegue del Portal de Documentación:** Publicar la Single Page Application de documentación en Netlify bajo CDN global.
3. **Validación de Campo con Odontólogos:** Realizar pruebas de carga de expedientes y agenda en ambiente Staging.
`;

const bitacora18 = `---
title: "Bitácora Diaria — Viernes 18 de Septiembre 2026"
order: 20
author: "Equipo NexusOdonto"
date: "2026-09-18"
type: "SignalR Realtime and Production Deployment"
summary: "Daily Scrum, Sincronización de Presencia en Tiempo Real con SignalR, Despliegue de Documentación en Netlify, Inclusión de Líder en Team Directory y Estabilización Final"
---

# Bitácora de Desarrollo: Viernes, 18 de Septiembre de 2026

Registro diario de trabajo en equipo, minuta de la Daily Scrum, acuerdos técnicos, resolución de bloqueos y commits sincronizados en el ecosistema NexusOdonto.

---

## 1. Ficha de la Sesión y Daily Scrum

* **Fecha:** Viernes, 18 de Septiembre de 2026
* **Modalidad:** Virtual (Discord & Google Meet) — 08:30 AM a 10:45 AM
* **Participantes:**
  - **Frontend Lead:** Andrés Felipe Navas Alvear
  - **Backend Lead:** Alejandro Escobar Lozada
  - **Fullstack / DevOps:** Felipe Corredor Silva
  - **Equipo de Documentación y QA:** Todos los miembros
* **Objetivo de la Jornada:** Puesta en marcha de la sincronización de presencia en tiempo real con WebSockets (SignalR), despliegue público y automatizado del portal de documentación en **Netlify** (\`https://nexusdocumentacion.netlify.app/\`), integración oficial de **Líder** como Mascota de Apoyo Emocional en el directorio de equipo y consolidación de la arquitectura de referencia.

---

## 2. Minuta y Temas Discutidos en la Reunión

### ⚡ A. Sincronización de Presencia en Tiempo Real (SignalR & Presence Service)
* **Arquitectura de Presencia:** Alejandro y Andrés expusieron la integración de los hooks \`usePresenceSync.ts\` y \`usePresenceTick.ts\` en el Frontend.
* **Mecanismo de Detección:**
  - Establecimiento de canal bidireccional WebSocket con el hub de SignalR del backend.
  - Notificaciones inmediatas de conexión y desconexión de usuarios y pacientes sin necesidad de recargar la vista ni realizar polling agresivo.
  - Conmutación automática a modo heartbeat (\`presenceTick\`) si la conexión de sockets experimenta microcortes temporales.
* **Feedback Visual Inmediato:** Las vistas de \`PacientesGrid\` y \`PacientesTable\` actualizan en tiempo real el anillo de estado (verde: online / gris: offline) y el último tiempo de actividad registrado.

### 🌐 B. Despliegue de Producción en Netlify
* **Configuración del Hosting:** Se configuró el despliegue del portal interactivo de documentación en Netlify bajo la URL canónica:
  > 🔗 **URL de Producción:** [https://nexusdocumentacion.netlify.app/](https://nexusdocumentacion.netlify.app/)
* **Enrutamiento SPA Resiliente:** Se agregó la regla \`public/_redirects\` (\`/* /index.html 200\`) para garantizar que la navegación por rutas profundas (\`/bitacora\`, \`/team\`, \`/docs/...\`) se resuelva de manera instantánea sin errores 404 de servidor.
* **Seguridad y CDN:** Habilitación de compresión Gzip/Brotli, encabezados de seguridad HTTP y distribución global de baja latencia.

### 🐾 C. Mascota Oficial & Líder de Apoyo Emocional en Team Directory
* **Inclusión en el Directorio:** Se oficializó el perfil de **Líder** en \`TeamPage.tsx\` y \`src/docs/Team/LiderMascotaApoyoEmocional.md\`.
* **Filtro Especializado:** Creación del botón de filtro dinámico **"Apoyo Emocional"** junto a *All Roles*, *Frontend* y *Backend*, con animación de shader interactivo mediante el componente RareUI \`GridReveal\`.
* **Supervisión Anímica:** Reconocimiento de su labor como guardián del código clínico, reductor de estrés en jornadas de desarrollo y elevador de la moral del equipo de ingeniería.

### 📚 D. Documentación Central y Guía de Introducción
* **Reescritura de la Introducción:** Se redactó un documento de bienvenida exhaustivo en \`src/docs/Overview/introduccion.md\` con diagramas de flujo en Mermaid, objetivos estratégicos del proyecto, matriz del stack tecnológico y extractos de código del modelo de dominio de entidades en C#.

---

## 3. Bloqueos Identificados y Soluciones Acordadas

| Bloqueo / Desafío | Impacto | Solución Acordada | Responsable |
|---|---|---|---|
| Errores 404 al refrescar URLs directas en hosting estático | Rutas como \`/bitacora\` fallaban si el usuario recargaba la página | Inclusión del archivo \`_redirects\` para enrutamiento SPA en Netlify | DevOps / Docs |
| Desconexión silenciosa de sockets en pestañas inactivas | El estado online de los pacientes quedaba desincronizado | Implementación de \`usePresenceTick\` con reenganche automático al recuperar el foco | Frontend / Backend |
| Caracteres BOM en metadatos YAML de Markdown | Fallo en la lectura del autor y rol en tarjetas de equipo | Normalización con \`replace(/^\\uFEFF/, '')\` y soporte multi-SO en el parser | Frontend |

---

## 4. Detalle Consolidado de Commits por Repositorio

### 💻 Frontend (\`NexusOdontoFrontend\` - 1 commit)

| Hash | Autor | Componente | Descripción del Commit |
|---|---|---|---|
| \`a96f5b3\` | Alejandro escobar | \`Presence / SignalR\` | feat: sync patient online status via presence service and SignalR |

### 📚 Portal de Documentación (\`NexusOdonto_documentation\` - 4 commits)

| Hash | Autor | Módulo | Descripción del Commit |
|---|---|---|---|
| \`1a794ea\` | Andres Felipe Navas Alvear | \`Team\` | feat(team): add new team member profile for Líder, the Official Emotional Support Pet |
| \`d48a1ef\` | Andres Felipe Navas Alvear | \`Overview / Netlify\` | docs: enrich introduction guide, add Netlify deployment url and SPA redirects |
| \`e76c321\` | Andres Felipe Navas Alvear | \`Bitacora\` | docs: add enriched Daily Scrum logs for September 17 and September 18, 2026 |
| \`82fa90b\` | Andres Felipe Navas Alvear | \`Presence Docs\` | docs: document realtime patient presence service and SignalR integration |

---

## 5. Acuerdos y Próximos Pasos (Next Steps)

1. **Monitoreo de Telemetría en Netlify:** Verificar analíticas y tiempos de respuesta globales en el portal de documentación.
2. **Pruebas de Carga del Hub SignalR:** Evaluar el comportamiento de las conexiones WebSocket concurrentes con múltiples clínicas activas.
3. **Inicio del Ciclo de Mantenimiento:** Planificación de la siguiente iteración de funcionalidades clínicas avanzadas (teleodontología y facturación electrónica).
`;

fs.writeFileSync(path.join(docsRoot, "Bitacora_2026-09-17.md"), bitacora17.trim() + "\n", "utf8");
fs.writeFileSync(path.join(docsRoot, "Bitacora_2026-09-18.md"), bitacora18.trim() + "\n", "utf8");
console.log("Bitácoras 17 y 18 creadas con éxito.");
