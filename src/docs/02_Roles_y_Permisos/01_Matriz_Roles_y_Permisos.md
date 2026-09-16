---
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
| **Administrador** | `ADMINISTRADOR` | `13000000-0000-0000-0000-000000000001` | Control total del sistema, gestión de usuarios, roles, catálogos, auditoría y reportes globales. |
| **Odontólogo** | `ODONTOLOGO` | `13000000-0000-0000-0000-000000000002` | Gestión clínica, registro y edición de odontogramas FDI, evoluciones, agenda de atención y prescripciones. |
| **Recepcionista** | `RECEPCIONISTA` | `13000000-0000-0000-0000-000000000003` | Agendamiento de citas, registro de pacientes, atención en chat/asesor y consulta de disponibilidad de profesionales. Mutaciones clínicas restringidas. |
| **Asistente Dental**| `ASISTENTE` | `13000000-0000-0000-0000-000000000004` | Apoyo en recepción de pacientes e insumos clínicos. |
| **Paciente** | `PACIENTE` | `13000000-0000-0000-0000-000000000005` | Portal de autoservicio: consulta de citas propias, visualización de odontograma e historia personal. |
| **Servicio Bot** | `BOT_SERVICE` | `13000000-0000-0000-0000-000000000006` | Cuenta de servicio para el Agente IA. Requiere cabecera `X-Internal-Secret` y tiene bloqueado el login interactivo. |

---

## 2. Credenciales de Prueba para Entornos Locales (Seeders de Desarrollo)

> ⚠️ **AVISO DE SEGURIDAD:** Las siguientes credenciales corresponden exclusivamente a semillas de datos para **entornos locales de prueba (Local Development)**. En entornos de producción, todas las contraseñas son provistas por los propios usuarios o generadas de forma aleatoria y protegidas con hash BCrypt.

| Rol / Tipo | Nombre Completo | Documento | Código Empleado | Correo Electrónico | Contraseña Demo |
|---|---|---|---|---|---|
| **ADMIN** | Carlos Administrator | `1234567890` | `AD001` | `admin@nexusodonto.com` | `Admin123!` |
| **ODONTOLOGO** | Dra. Laura Gómez | `1098765432` | `OD001` | `odontologo@nexusodonto.com` | `Doctor123!` |
| **ODONTOLOGO** | Dr. Roberto Martínez | `1098765433` | `OD002` | `roberto.martinez@nexusodonto.com` | `Doctor123!` |
| **ODONTOLOGO** | Dra. Ana Sofía Silva | `1098765434` | `OD003` | `ana.silva@nexusodonto.com` | `Doctor123!` |
| **RECEPCION** | María Rodríguez | `1087654321` | `RC001` | `recepcion@nexusodonto.com` | `Recepcion123!` |
| **PACIENTE 1** | Andrés Pérez | `1076543210` | N/A | `paciente@nexusodonto.com` | `Paciente123!` |
| **PACIENTE 2** | Camila López | `1076543211` | N/A | `camila.lopez@gmail.com` | `Paciente123!` |
| **PACIENTE 3** | Felipe Torres | `1076543212` | N/A | `felipe.torres@hotmail.com` | `Paciente123!` |
| **PACIENTE 4** | Valentina Mendoza | `1076543213` | N/A | `valentina.mendoza@yahoo.com` | `Paciente123!` |
| **BOT SERVICE** | Chatbot Service | `BOT-SERVICE-01`| `BOT001` | `bot_service@nexusodonto.com` | `<PROTEGIDO_POR_SECRET>` (*) |

> **Nota (*):** La cuenta `bot_service@nexusodonto.com` solo es invocable programáticamente mediante el secret configurado en la cabecera `X-Internal-Secret: <TU_BOT_INTERNAL_SECRET>`. Intentar iniciar sesión desde la UI web arrojará error 403 Forbidden.

---

## 3. Catálogo de Permisos Granulares

```
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
```
* (`✓*`): El paciente solo tiene acceso de lectura a sus propios registros clínicos mediante endpoints aislados por `patientId`.
