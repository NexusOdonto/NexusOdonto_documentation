---
title: "Documentación Oficial del Backend (PDF)"
order: 0
author: "Equipo de Desarrollo Backend NexusOdonto"
date: "2026-10-02"
pdf: "/Documentacion_Principal_Backend_NexusOdonto.pdf"
summary: "Visualizador y documento formal en PDF del Backend de NexusOdonto: Arquitectura Limpia en Capas (.NET 10), Persistencia Relacional Oracle Database, Control de Acceso RBAC y Guía de Sustentación."
---

# ⚙️ Documentación Técnica del Backend — NexusOdonto (Octubre 2026)

**Sistema Integral de Gestión Odontológica y Clínica**  
*Arquitectura Limpia en Capas (.NET 10), Persistencia Relacional Oracle Database, Control de Acceso RBAC, Protocolos Clínicos y Guía para Sustentación*

---

## 🚀 Acceso Rápido al Documento Formal en PDF

Puedes consultar el documento original de **16 páginas** en el visor interactivo de alta definición ubicado en la parte superior de esta página, o descargarlo directamente:

* **📥 Descargar PDF Oficial:** [/Documentacion_Principal_Backend_NexusOdonto.pdf](/Documentacion_Principal_Backend_NexusOdonto.pdf)
* **Stack Principal:** .NET 10 (C# 14) · ASP.NET Core Web API · Oracle Database 21c/23ai · Entity Framework Core 10 · Clean Architecture (4 Capas) · Microsoft SignalR Core · JWT Bearer + Google OAuth 2.0 · FluentValidation 12 · Polly HTTP Resilience · BCrypt.Net Security · RFC 7807 ProblemDetails

---

## 📑 Índice de Contenidos del Documento (16 Páginas)

1. **Alcance y Guía de Lectura:** Núcleo transaccional del sistema, API RESTful y Hub WebSocket (SignalR) bajo Clean Architecture y persistencia en Oracle.
2. **Propósito y Organización Funcional por Dominios:** 10 dominios funcionales desacoplados (Identidad, Personas, Agenda, Expediente Clínico, Odontograma, Catálogos, Tiempo Real, WhatsApp, Soporte, Auditoría).
3. **Catálogo Completo de Bibliotecas NuGet (.csproj):** Oracle.EntityFrameworkCore, FluentValidation, BCrypt.Net, Mapster, Polly Resilience, Serilog, Swashbuckle OpenAPI.
4. **Arquitectura de Software en 4 Capas (Clean Architecture):** `Api` ➔ `Application` ➔ `Domain` ➔ `Infrastructure` con Principio de Inversión de Dependencias (DIP).
5. **Pipeline HTTP, Middlewares y Manejo de Errores (RFC 7807):** GlobalExceptionMiddleware, serialización ProblemDetails, filtros de validación, CORS adaptativo y serializadores TimeOnlyJsonConverter.
6. **Modelo de Identidad y Autenticación:** Separación estricta de 4 conceptos de identidad: `UserId` (acceso), `PersonId` (legal), `PatientId` (clínica) y `ProfessionalId` (médica).
7. **Cuentas y Credenciales Oficiales de Prueba (Seeded Accounts):** Cuentas demo (`Admin123!`, `Dentist123!`, `Reception123!`, `Patient123!`), ciclo de vida JWT (60 min) y revocación inmediata en logout.
8. **Control de Acceso Basado en Roles (RBAC) y Permisos:** Matriz de permisos granular con filtro `[RequirePermission(Module, Action)]` y verificación en tiempo de ejecución.
9. **Catálogo Completo de Endpoints REST (56 Controladores):** Mapeo exhaustivo de endpoints para autenticación, agenda, odontograma, expediente clínico, catálogos y auditoría.
10. **Reglas de Negocio Asistenciales y Lógica de Agenda:** Política de integridad *"Los cambios de horario rigen a partir de mañana"*, asignación automática de odontólogo alternativo y zona horaria oficial `America/Bogota` (UTC-5).
11. **Odontograma Anatómico FDI y Expediente Clínico:** Modelo vectorial de 5 superficies (V, L/P, M, D, O/I), persistencia atómica en transacción única, diagnósticos codificados CIE-10 y prescripciones médicas.
12. **Comunicación en Tiempo Real (SignalR) y Presencia:** Hub `/hubs/notifications`, rastreador singleton `PresenceTracker` en memoria, soporte multi-pestaña y difusión de eventos.
13. **Persistencia Oracle Database, Transacciones y Seeders:** Convención snake_case citada, claves Guid determinísticas y patrón Unit of Work con `SaveChangesAsync()`.
14. **Value Objects y Diseño Guiado por el Dominio (DDD):** Tipos inmutables (`Price`, `PhoneNumber`, `CatalogCode`, `TimeOfDay`, `RagConfidence`, `ProfessionalLicense`).
15. **Validaciones Declarativas y Resiliencia HTTP con Polly:** Circuit breaker y reintentos exponenciales con backoff para pasarelas externas (WhatsApp / Evolution API).
16. **Seguridad, Confidencialidad y Enmascaramiento de Datos:** Protocolo estricto de secretos y límites de confianza cliente-servidor.
17. **Guía Técnica para Sustentación ante Jurados:** 4 preguntas de alta complejidad sobre Clean Architecture vs 3 capas, concurrencia en citas, aislamiento de SignalR y compatibilidad con Oracle Database.
18. **Referencias Cruzadas y Mapeo de Código Fuente:** Directorio archivo por archivo del repositorio `NexusOdontoBackend_Api` para verificación directa del jurado evaluador.
