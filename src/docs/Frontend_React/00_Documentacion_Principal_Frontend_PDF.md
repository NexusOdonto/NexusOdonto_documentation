---
title: "Documentación Oficial del Frontend (PDF)"
order: 0
author: "Equipo de Desarrollo Frontend NexusOdonto"
date: "2026-10-02"
pdf: "/Documentacion_Principal_Frontend_NexusOdonto.pdf"
summary: "Visualizador y documento formal en PDF del Frontend de NexusOdonto: Arquitectura Modular Screaming Architecture, Protocolos Clínicos, Seguridad RBAC y Guía de Sustentación."
---

# 📄 Documentación Técnica del Frontend — NexusOdonto (Octubre 2026)

**Sistema Integral de Gestión Odontológica y Clínica**  
*Arquitectura Modular Basada en Características, Protocolos Clínicos y Guía para Sustentación*

---

## 🚀 Acceso Rápido al Documento Formal en PDF

Puedes consultar el documento original de 13 páginas en el visor integrado en la parte superior o descargarlo directamente:

* **📥 Descargar PDF Oficial:** [/Documentacion_Principal_Frontend_NexusOdonto.pdf](/Documentacion_Principal_Frontend_NexusOdonto.pdf)
* **Entorno Evaluado:** `https://nexusodonto.chatcampuslands.com/`
* **Stack Principal:** React 19.2 · TypeScript 6.0 · Vite 8.2 · Tailwind CSS v4 · Feature-Driven Architecture · Microsoft SignalR · Blobatar · React PDF Renderer · Zod

---

## 📑 Índice de Contenidos del Documento (13 Páginas)

1. **Alcance y guía de lectura:** Separación estricta entre cliente React y servicios remotos (.NET 9 y Oracle 21c).
2. **Propósito y organización funcional:** Dominios de Acceso, Operación Diaria, Gestión de Pacientes, Módulo Clínico y Administración.
3. **Catálogo completo de bibliotecas:** React 19.2, TypeScript 6.0, Vite 8.2, Tailwind v4, Blobatar, SignalR, @react-pdf/renderer, React Hook Form, Zod, Motion, date-fns, sharp.
4. **Arquitectura del frontend y flujo de arranque:**
   - *Feature-Driven Architecture ("Screaming Architecture" - Robert C. Martin)*
   - *Component-Driven Architecture (CDA)*
   - *Service Layer Pattern (`src/api/`)*
   - *Context Provider Pattern en cascada*
   - *Jerarquía de Proveedores:* `ThemeProvider` ➔ `BrowserRouter` ➔ `AuthProvider` ➔ `NotificationProvider` ➔ `ErrorBoundary` ➔ `AppRoutes`.
5. **Organización del código y árbol modular:** Estructura de carpetas por responsabilidad de dominio.
6. **Rutas, navegación y guards:** Pipeline de seguridad con `ProtectedRoute` y matriz de permisos por rol (`AD001`, `OD001`, `RC001`, `PA001`).
7. **Autenticación y cuentas de prueba para evaluación:** Credenciales de demostración activas (`Admin123!`, `Doctor123!`, `Recepcion123!`, `Paciente123!`) y ciclo de vida de JWT con auto-logout tras 20 minutos de inactividad.
8. **Integración HTTP y contratos de API:** Interceptores de inyección Bearer y catálogo completo de servicios RESTful.
9. **Módulos funcionales de negocio:**
   - *Agendamiento Centralizado:* `AgendarCitaModal` y algoritmo de cálculo dinámico de huecos `AvailableSlotsPicker`.
   - *Agenda Semanal y Protección de Almuerzo:* Bloqueo explícito de recesos de médicos.
   - *Odontograma Anatómico FDI de 5 Superficies:* Vectorial interactivo para adultos y niños con evento global `nexus_odontograma_updated`.
   - *Historia Clínica Odontológica:* Diagnósticos CIE-10, recetas estructuradas y exportación PDF.
   - *Dashboard y Equipo en Turno Hoy:* Detección dinámica de doctores de turno y asignación de Consultorio.
10. **Agenda, disponibilidad y fechas como contrato:**
    - *Regla de Oro:* "Los cambios de horario rigen a partir de mañana" (protección a pacientes ya citados el día de hoy).
    - Etiquetado asistido con `Requiere reprogramación` (`useRequiresReschedule`).
11. **Comunicación en tiempo real (SignalR):** WebSockets con reconexión escalonada y centro de notificaciones aislado por ID de usuario (`user-scoped`).
12. **Persistencia y sincronización local:** Reglas de memoria React, `localStorage` para sesión/tema/borradores de odontograma, y base de datos Oracle como fuente de verdad.
13. **Componentes, diseño y generación de avatares:** Estilo Glassmorphism con tipografías *Instrument Sans* y *Prata*; avatares procedurales con *Blobatar* en Canvas HTML5.
14. **Auditoría en producción (Lighthouse 100/100):** Accesibilidad WCAG AA (100/100), Rendimiento (97/100), Mejores Prácticas (100/100) y SEO (100/100).
15. **Documentos PDF y exportaciones clínicas:** Carga dinámica diferida (*Dynamic Import*) de `@react-pdf/renderer` para optimizar el bundle.
16. **Validaciones y manejo de errores:** Estrategia concéntrica en 5 niveles (Entradas ➔ Zod ➔ Utilidades ➔ Capa de Servicios ➔ Backend Oracle).
17. **Configuración, compilación y despliegue:** Scripts de build con TypeScript estricto y configuración SPA Nginx/Netlify.
18. **Seguridad, confidencialidad y enmascaramiento:** Protección de datos personales (cédulas y teléfonos enmascarados) y directivas `[Authorize]`.
19. **Guía de sustentación técnica:** Banco de 5 preguntas frecuentes de jurados con respuestas modelo de arquitectura, ética clínica y rendimiento.
20. **Referencias completas del código fuente:** Mapeo archivo por archivo de todos los módulos del repositorio.
