---
title: "Visión General y Stack Tecnológico"
order: 1
author: "NexusOdonto Tech Lead"
date: "2026-09-16"
---

# Visión General y Arquitectura del Sistema NexusOdonto

**NexusOdonto** es una plataforma odontológica integral de grado empresarial diseñada para la digitalización de la atención clínica, odontogramas interactivos bajo norma FDI, agendamiento inteligente con balanceo de carga de profesionales y triaje conversacional asistido por Inteligencia Artificial multimodal.

```
                     +----------------------------------------------+
                     |            CLIENTE / USUARIOS SPA            |
                     |  (Pacientes, Odontólogos, Recepción, Admin)  |
                     +----------------------+-----------------------+
                                            | HTTPS / WSS
                                            v
                     +----------------------------------------------+
                     |      FRONTEND WEB (React 18 + Vite + TS)     |
                     |  - Odontograma Interactivo FDI (5 caras)     |
                     |  - Agenda y Turnos en Horario Colombia       |
                     |  - Motor de PDF (Historia, Fórmula, Registro)|
                     |  - Panel Atención Chat y Asesor Humano       |
                     +----------------------+-----------------------+
                                            | REST API (JWT Bearer)
                                            v
                     +----------------------------------------------+
                     |      BACKEND WEB API (.NET 8 C# Clean)       |
                     |  - Domain-Driven Design + EF Core            |
                     |  - RBAC Canónico & SeedAdminGuard            |
                     |  - Google OAuth Link / Unlink & JWT Refresh  |
                     |  - Auto-asignación de odontólogos libres     |
                     +----------------------+---------------+-------+
                                            |               | X-Internal-Secret
                                            |               v
                                            |     +-----------------------------------+
                                            |     |    AGENTE IA (Python FastAPI)     |
                                            |     |  - Gemini 1.5 Flash / Pro LLM     |
                                            |     |  - PostgreSQL + Pgvector Cache    |
                                            |     |  - Citas & Triaje sin login       |
                                            |     +-----------------------------------+
                                            v
                     +----------------------------------------------+
                     |        MOTOR DE BASE DE DATOS ORACLE         |
                     |  - Oracle 19c / 23ai Relational DB           |
                     |  - Tablas transaccionales y de auditoría     |
                     |  - Límite de notas 2000 chars (Anti-ORA)     |
                     +----------------------------------------------+
```

---

## 1. Stack Tecnológico Central

| Capa / Módulo | Tecnología | Versión / Especificación | Responsabilidad Principal |
|---|---|---|---|
| **Frontend Web** | React + TypeScript + Vite | React 18.3, TS 5.4, Vite 5.2 | Interfaz SPA reactiva, Odontograma FDI interactivo, renderizado de PDF, gestión de sesiones y control de accesos RBAC. |
| **Estilos & UI** | CSS Modules / Custom Tokens | Design System Nexus Tokens, Lucide Icons, Blobatar | Consistencia visual clínica, diseño responsive (mobile first para chat y citas) y avatares geométricos. |
| **Backend API** | ASP.NET Core (.NET 8) | C# 12, .NET 8 LTS | Clean Architecture, controladores REST, Entity Framework Core, validaciones FluentValidation, BCrypt y JWT. |
| **Motor de Base de Datos** | Oracle Database | 19c / 23ai Free Container | Almacenamiento relacional transaccional ACID, tablas de usuarios, historias clínicas, citas, odontogramas y servicios. |
| **Agente Inteligente (AI)** | Python + FastAPI | Python 3.11, FastAPI, Google GenAI SDK | Asistente conversacional de triaje, agendamiento de citas guiado y derivación a asesores humanos. |
| **Caché Semántica** | PostgreSQL + Pgvector | PostgreSQL 16 con extensión vector | Reducción de costos de inferencia en LLMs y almacenamiento de embeddings de preguntas frecuentes. |
| **Orquestación & CI/CD** | Docker & Docker Compose | Compose v2 Multi-service | Entorno de desarrollo y staging unificado con contenedores para API, Oracle, Chatbot y Semantic DB. |

---

## 2. Principios de Diseño y Arquitectura

1. **Aislamiento Estricto de Datos del Paciente:**
   * El paciente únicamente tiene visibilidad sobre sus propias citas, odontogramas e historias clínicas (`patient_id` vinculado a su identidad autenticada).
   * Se previene cualquier fuga de métricas administrativas, ingresos financieros o listas globales de pacientes hacia perfiles no autorizados.

2. **Gestión Determinista de Horarios (Zona Horaria Colombia):**
   * Toda la lógica de disponibilidad y agendamiento opera en `America/Bogota` (UTC-5), garantizando que las citas creadas por pacientes, recepcionistas o el bot coincidan de manera exacta con los turnos clínicos.

3. **Resiliencia de Seeders y Protección de Cuentas Maestras:**
   * El usuario Administrador semilla (`AD001` / `admin@nexusodonto.com`) cuenta con un guardián de seguridad (`SeedAdminGuard`) en el backend que bloquea su desactivación o eliminación en caliente.

4. **Integración Segura entre Microservicios y Bot:**
   * El chatbot se comunica con la API central mediante el encabezado de seguridad `X-Internal-Secret`, restringiendo operaciones automatizadas y bloqueando inicios de sesión interactivos directos desde la cuenta de servicio del bot (`BOT_SERVICE`).
