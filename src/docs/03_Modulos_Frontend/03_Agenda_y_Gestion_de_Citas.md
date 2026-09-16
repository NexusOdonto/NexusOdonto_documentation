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

## 2. Vista Semanal de 7 Días y Agrupación Horaria

* **Calendario de 7 Días sin Recortes:** La vista semanal muestra los 7 días completos (Lunes a Domingo) adaptándose fluidamente al ancho disponible de la pantalla.
* **Agrupación Inteligente por Franja Horaria:** Las citas concurrentes se consolidan en un contador numérico con indicador visual de estado (*badge*), evitando saturación visual por nombres extensos.
* **Modal Dossier Interactivo:** Al hacer clic en cualquier celda con citas, se despliega un modal animado tipo *dossier folder* que lista los pacientes agendados, doctor tratante, motivo de consulta y acciones inmediatas de gestión.

---

## 3. Reglas de Validación de Concurrencia y Capacidad

* **Prevención de Citas Duplicadas por Paciente:** Un mismo paciente no puede agendar ni tener dos citas registradas para la misma fecha y hora.
* **Control de Capacidad por Profesional:** La agenda valida en tiempo real la disponibilidad y número máximo de pacientes simultáneos por odontólogo y consultorio.

---

## 4. Refactor Tabular de `CitasTable.tsx` y Paginación

Para optimizar la legibilidad en pantallas clínicas de recepción y consultorio, la tabla de citas fue refactorizada a un diseño estructurado con:
* Paginación dinámica estandarizada a **8 elementos por página** con truncamiento inteligente de texto.
* Búsqueda en tiempo real por nombre de paciente, documento o doctor.
* Filtros rápidos por estado de cita (`Todas`, `Hoy`, `Pendientes`, `Completadas`).
* Acciones contextuales por fila (Confirmar, Reagendar, Cancelar, Atender).
