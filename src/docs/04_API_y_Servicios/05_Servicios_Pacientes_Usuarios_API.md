---
title: "API de Servicios, Pacientes, Usuarios y Catálogos"
order: 5
author: "NexusOdonto Core Team"
date: "2026-09-16"
---

# API de Servicios, Pacientes, Usuarios y Catálogos

Catálogo de recursos maestros y entidades auxiliares del sistema.

---

## 1. Servicios Odontológicos (`/api/Services`)

* `GET /api/Services`: Lista el catálogo de servicios (categoría, código, tarifa, estado activo).
* `POST /api/Services`: Crea un nuevo servicio (requiere rol `ADMINISTRADOR` u `ODONTOLOGO`).
* `PUT /api/Services/{id}`: Modifica tarifas y nombres de procedimientos.
* `DELETE /api/Services/{id}`: Desactiva un servicio del catálogo.

---

## 2. Pacientes y Usuarios

* `GET /api/Patients`: Búsqueda paginada de pacientes con filtros por documento o nombre.
* `POST /api/Patients`: Registro de nuevo paciente con validación de documento único.
* `GET /api/Users`: Listado de cuentas con roles asignados y último acceso.
* `PUT /api/Users/{id}/status`: Activa o desactiva un usuario (protegido por `SeedAdminGuard`).

---

## 3. Catálogos Base (`/api/Catalogs`)

* `GET /api/Catalogs/document-types`: Tipos de documento (CC, TI, CE, Pasaporte, Registro Civil).
* `GET /api/Catalogs/roles`: Roles del sistema disponibles.
* `GET /api/Catalogs/specialties`: Especialidades odontológicas (Ortodoncia, Endodoncia, Periodoncia, Cirugía Maxilofacial, Odontopediatría).
