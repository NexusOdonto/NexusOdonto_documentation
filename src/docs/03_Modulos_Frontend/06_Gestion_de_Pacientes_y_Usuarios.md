---
title: "Gestión de Pacientes y Administración de Usuarios"
order: 6
author: "NexusOdonto Core Team"
date: "2026-09-16"
---

# Gestión de Pacientes y Administración de Usuarios

Módulos administrativos para el registro de pacientes, control de fichas y administración de cuentas de usuario con avatares geométricos dinámicos.

---

## 1. Módulo de Pacientes (`PacientesView.tsx`)

* **Búsqueda Avanzada:** Filtrado instantáneo por número de documento, nombres, apellidos o correo.
* **Exportación CSV Enriquecida:** Exporta la base de pacientes con todos los campos clave (Tipo Documento, Número, Nombre Completo, Teléfono, Correo, Fecha de Nacimiento, Sexo, Estado Activo/Inactivo).
* **Ficha Rápida:** Acceso con un clic a la historia clínica, citas pendientes y odontograma del paciente.

---

## 2. Módulo de Usuarios (`UsuariosView.tsx` / `UsuariosTable.tsx`)

* **Control de Estado:** Activación y desactivación de usuarios con confirmación visual.
* **Protección Admin Semilla:** El usuario `AD001` tiene deshabilitados los botones de desactivación y eliminación para evitar bloqueos del sistema.
* **Avatares Blobatar:** Integración de avatares geométricos vectoriales animados generados algorítmicamente a partir del identificador o correo del usuario.
