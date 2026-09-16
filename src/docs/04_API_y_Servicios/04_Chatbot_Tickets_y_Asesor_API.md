---
title: "API de Chatbot, Conversaciones y Tickets de Soporte"
order: 4
author: "NexusOdonto AI & Support Team"
date: "2026-09-16"
---

# API de Chatbot, Conversaciones y Tickets de Soporte

Endpoints que intercomunican el Agente de Inteligencia Artificial en Python con el Backend Central en .NET y la mesa de ayuda de recepcionistas/asesores.

---

## 1. Autenticación Interna de Servicios

Todas las peticiones originadas desde el contenedor del Chatbot deben incluir el encabezado configurado en las variables de entorno:
```http
X-Internal-Secret: <TU_BOT_INTERNAL_SECRET>
```

---

## 2. Endpoints de Tickets y Conversaciones

### `GET /api/Chatbot/tickets`
Lista los tickets de soporte abiertos o en atención por asesores humanos.

* **Query Parameters:** `status` (`OPEN`, `IN_PROGRESS`, `RESOLVED`).

---

### `PUT /api/Chatbot/tickets/{id}/resolve`
Cierra el ticket de soporte tras la intervención del asesor.

* **Body Request:**
```json
{
  "resolutionNote": "Paciente atendido y cita agendada para el viernes a las 10:00 AM.",
  "returnToBot": true
}
```
* **Comportamiento:** Si `returnToBot` es `true`, el estado de la conversación se reactiva para que el chatbot retome el diálogo automatizado con el paciente.
