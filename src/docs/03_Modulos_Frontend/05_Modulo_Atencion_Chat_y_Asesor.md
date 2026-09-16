---
title: "Módulo de Atención Chat y Asesor Humano"
order: 5
author: "NexusOdonto Support Team"
date: "2026-09-16"
---

# Módulo de Atención Chat y Asesor Humano en Vivo

Cuando un paciente interactúa con el Asistente IA y requiere asistencia especializada o solicita hablar con un humano, el sistema escala la conversación a la vista `AtencionAsesorView.tsx`.

---

## 1. Flujo de Escalamiento y Tickets

```
  [ Paciente en Chatbot ] ──> Solicita soporte humano ──> [ Ticket Creado en DB ]
                                                                 │
                                                                 ▼
  [ Recepcionista / Asesor ] <── Notificación en vivo <── [ Cola de Tickets ]
           │
           ├── Responde en tiempo real por el panel web
           ├── Envía mensaje directo a WhatsApp del paciente ("send-whatsapp")
           └── Resuelve el ticket ("ResolveTicket" con o sin retorno al Bot)
```

---

## 2. Optimizaciones de UX / UI en la Vista de Chat

* **Identificación por Número Telefónico:** La lista de conversaciones activas muestra el número de teléfono formateado y nombre del paciente en lugar de etiquetas genéricas.
* **Preservación del Scroll y Navegación Móvil:** Al volver atrás en dispositivos móviles, se mantiene la lista sin reinicializaciones molestas de estado.
* **Resolución Flexible de Tickets:** Posibilidad de cerrar el ticket dejando la conversación archivada o reactivando el bot automático para futuras consultas.
