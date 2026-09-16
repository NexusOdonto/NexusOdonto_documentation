---
title: "Agenda y Gestión de Citas"
order: 3
author: "NexusOdonto Frontend Team"
date: "2026-09-16"
---

# Agenda y Gestión de Citas

El módulo de citas combina una vista tabular de alta densidad (`CitasTable.tsx`) y una agenda visual interactiva por horas y profesionales (`AgendaView.tsx`).

---

## 1. Características Principales

* **Sincronización Horaria en Tiempo de Colombia (`America/Bogota`):**
  * Todas las conversiones de fecha y hora se realizan con respecto a UTC-5 para prevenir desplazamientos de horario en navegadores con distintas zonas horarias.
* **Auto-asignación de Odontólogo Disponible:**
  * Cuando un paciente solicita una cita a través de la web o del chatbot sin especificar doctor, el sistema consulta los turnos libres y asigna automáticamente al odontólogo con menor carga horaria disponible.
* **Estados de Citas y Flujo de Vida:**
  * `PROGRAMADA` -> `CONFIRMADA` -> `EN_ATENCION` -> `COMPLETADA` / `CANCELADA` / `NO_ASISTIO`.

---

## 2. Refactor Tabular de `CitasTable.tsx`

Para optimizar la legibilidad en pantallas clínicas de recepción y consultorio, la tabla de citas fue refactorizada a un diseño estructurado con:
* Paginación dinámica y búsqueda en tiempo real por nombre de paciente o documento.
* Filtros rápidos por estado de cita (`Todas`, `Hoy`, `Pendientes`, `Completadas`).
* Acciones contextuales por fila (Confirmar, Reagendar, Cancelar, Atender).
