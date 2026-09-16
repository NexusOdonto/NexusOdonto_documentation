---
title: "API de Citas y Agenda Médica"
order: 2
author: "NexusOdonto Backend Team"
date: "2026-09-16"
---

# API de Citas y Agenda Médica

Endpoints para la consulta, programación, confirmación y cancelación de citas odontológicas.

---

## 1. Endpoints Principales

### `GET /api/Appointments`
Obtiene la lista de citas filtradas por parámetros de consulta.

* **Query Parameters:**
  * `startDate` (opcional, formato ISO): Fecha inicial de búsqueda.
  * `endDate` (opcional, formato ISO): Fecha final de búsqueda.
  * `patientId` (opcional): Filtrar por ID de paciente (forzado para rol PACIENTE).
  * `dentistId` (opcional): Filtrar por odontólogo asignado.
  * `status` (opcional): `PROGRAMADA`, `CONFIRMADA`, `COMPLETADA`, `CANCELADA`.

---

### `POST /api/Appointments`
Crea una nueva cita odontológica.

* **Body Request:**
```json
{
  "patientId": "1b000000-0000-0000-0000-000000000013",
  "professionalId": "1a000000-0000-0000-0000-000000000001",
  "serviceId": "10000000-0000-0000-0000-000000000001",
  "appointmentDateTime": "2026-09-20T09:00:00-05:00",
  "notes": "Valoración inicial de ortodoncia."
}
```
> **Lógica de Asignación Automática:** Si `professionalId` es enviado nulo o vacío por una solicitud de paciente o chatbot, el backend evalúa los profesionales con turno disponible en esa franja horaria y asigna automáticamente al odontólogo libre con menor carga.

---

### `PUT /api/Appointments/{id}/status`
Modifica el estado de una cita.

* **Body Request:**
```json
{
  "status": "CONFIRMADA",
  "cancellationReason": null
}
```
