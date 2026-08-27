# Documentación de Data Seeders

**Autor:** Sergio Andres Serrano Rivero 

**Proyecto:** NexusOdontoBackend API  
**Fecha:** 27 de agosto de 2026  
**Plataforma:** .NET 10

## 1. Propósito

Los Data Seeders implementados preparan los catálogos iniciales necesarios para agenda, servicios odontológicos, notificaciones, chatbot y soporte humano. Cada seeder utiliza `ModelBuilder.Entity<TEntity>().HasData(...)`, por lo que los datos están diseñados para incorporarse posteriormente a una migración de Entity Framework Core.

En el estado actual los seeders no están conectados a `AppDbContext`, no ejecutan operaciones en runtime y no modifican Oracle.

## 2. Organización

Los seeders se encuentran en `Infrastructure/Data/Seeder`. La implementación utiliza una carpeta y un archivo por entidad:

1. `AppointmentStatus/AppointmentStatusSeeder.cs`
2. `AppointmentOrigin/AppointmentOriginSeeder.cs`
3. `Service/ServiceSeeder.cs`
4. `HubNotificationType/HubNotificationTypeSeeder.cs`
5. `NotificationPriority/NotificationPrioritySeeder.cs`
6. `HubNotificationStatus/HubNotificationStatusSeeder.cs`
7. `WhatsAppNotificationType/WhatsAppNotificationTypeSeeder.cs`
8. `WhatsAppNotificationStatus/WhatsAppNotificationStatusSeeder.cs`
9. `ChatChannel/ChatChannelSeeder.cs`
10. `ChatbotMessageRole/ChatbotMessageRoleSeeder.cs`
11. `ChatbotConversationStatus/ChatbotConversationStatusSeeder.cs`
12. `SupportTicketStatus/SupportTicketStatusSeeder.cs`
13. `SupportTicketReason/SupportTicketReasonSeeder.cs`

Cada clase es estática y expone únicamente:

```csharp
public static void Seed(ModelBuilder modelBuilder)
```

No existe un `DbSeeder.cs` central ni un orquestador que invoque estas clases.

## 3. Reglas comunes

Todos los seeders respetan las siguientes reglas:

- Utilizan exclusivamente `HasData`.
- Contienen GUIDs fijos, únicos y determinísticos.
- No utilizan `Guid.NewGuid()`.
- Usan como fecha fija `2026-01-01 00:00:00 UTC`.
- No utilizan `DateTime.Now` ni `DateTime.UtcNow`.
- Definen `UpdatedAt` como `null`.
- Todos los registros se crean inicialmente con `IsActive = true`.
- `SortOrder` comienza en 1 dentro de cada catálogo.
- No ejecutan `Add`, `AddRange`, `SaveChanges` ni consultas a la base de datos.
- No tienen dependencias de otros registros mediante claves foráneas obligatorias.

Los GUIDs están separados por grupos reconocibles. Cada entidad utiliza un prefijo distinto, desde `10000000` para estados de cita hasta `d0000000` para motivos de tickets.

## 4. AppointmentStatusSeeder

Define los seis estados iniciales del ciclo de una cita odontológica.

| Orden | Código | Nombre | Color | Final |
|---:|---|---|---|:---:|
| 1 | `AGENDADA` | Scheduled | `#3B82F6` | No |
| 2 | `CONFIRMADA` | Confirmed | `#22C55E` | No |
| 3 | `EN_SALA` | In Waiting Room | `#F59E0B` | No |
| 4 | `ATENDIDA` | Completed | `#14B8A6` | Sí |
| 5 | `CANCELADA` | Cancelled | `#EF4444` | Sí |
| 6 | `NO_ASISTIO` | No Show | `#64748B` | Sí |

Los estados finales son `ATENDIDA`, `CANCELADA` y `NO_ASISTIO`. El seeder almacena el catálogo, pero no implementa la máquina de transiciones entre estados.

## 5. AppointmentOriginSeeder

Identifica el canal desde el cual se creó una cita.

| Orden | Código | Uso |
|---:|---|---|
| 1 | `MANUAL` | Creación realizada por personal autorizado. |
| 2 | `AGENTE_BOT` | Creación realizada mediante el asistente automatizado. |
| 3 | `WEB` | Solicitud realizada desde la aplicación web. |
| 4 | `TELEFONO` | Solicitud recibida durante una llamada. |

Este seeder no implementa integración con ninguno de esos canales.

## 6. ServiceSeeder

Define un portafolio odontológico inicial con duraciones y precios de prueba.

| Orden | Código | Servicio | Duración | Precio inicial |
|---:|---|---|---:|---:|
| 1 | `VALORACION_GENERAL` | General Assessment | 30 minutos | 60.000 |
| 2 | `PROFILAXIS` | Dental Prophylaxis | 45 minutos | 120.000 |
| 3 | `CALZA_RESINA` | Composite Resin Filling | 60 minutos | 180.000 |
| 4 | `BLANQUEAMIENTO` | Teeth Whitening | 90 minutos | 450.000 |

Los precios utilizan `decimal` y respetan la precisión configurada de `12,2`. Ninguna duración o precio es negativo y no se realizan cálculos dinámicos.

## 7. HubNotificationTypeSeeder

Define los tipos de eventos que pueden presentarse en el centro de notificaciones interno.

| Orden | Código | Icono almacenado |
|---:|---|---|
| 1 | `TICKET_CREADO` | `ticket` |
| 2 | `CITA_CREADA` | `calendar-plus` |
| 3 | `CITA_CANCELADA` | `calendar-x` |
| 4 | `PACIENTE_REGISTRADO` | `user-plus` |

Los iconos son identificadores de texto. No se agregó una librería gráfica ni una dependencia externa.

## 8. NotificationPrioritySeeder

Define la jerarquía de prioridades utilizada por las notificaciones.

| Orden | Código | Nivel | Color |
|---:|---|---:|---|
| 1 | `BAJA` | 1 | `#22C55E` |
| 2 | `NORMAL` | 2 | `#3B82F6` |
| 3 | `ALTA` | 3 | `#F59E0B` |
| 4 | `URGENTE` | 4 | `#EF4444` |

La relación de niveles queda definida como `BAJA < NORMAL < ALTA < URGENTE`.

## 9. HubNotificationStatusSeeder

Define el estado de entrega y lectura de una notificación interna.

| Orden | Código | Significado |
|---:|---|---|
| 1 | `PENDIENTE` | Espera ser entregada. |
| 2 | `ENTREGADA` | Fue entregada al destinatario. |
| 3 | `LEIDA` | Fue leída por el destinatario. |
| 4 | `CANCELADA` | Fue cancelada antes de completarse. |

## 10. WhatsAppNotificationTypeSeeder

Define los tipos iniciales de mensajes de WhatsApp y el identificador estable de su plantilla.

| Orden | Código | Plantilla predeterminada |
|---:|---|---|
| 1 | `RECORDATORIO_CITA` | `appointment_reminder` |
| 2 | `CONFIRMACION_CITA` | `appointment_confirmation` |
| 3 | `TRANSFERENCIA_A_ASESOR` | `advisor_transfer` |
| 4 | `BIENVENIDA` | `welcome` |

El seeder no contiene credenciales, tokens, peticiones HTTP ni integración con la API de Meta.

## 11. WhatsAppNotificationStatusSeeder

Define los estados posibles durante el envío de un mensaje de WhatsApp.

| Orden | Código | Significado |
|---:|---|---|
| 1 | `PENDIENTE` | Espera ser enviado. |
| 2 | `ENVIADA` | Fue enviado al proveedor. |
| 3 | `ENTREGADA` | Llegó al dispositivo del destinatario. |
| 4 | `LEIDA` | Fue leído por el destinatario. |
| 5 | `FALLIDA` | No pudo entregarse debido a un error. |

## 12. ChatChannelSeeder

Define los canales que pueden originar una conversación.

| Orden | Código | Canal |
|---:|---|---|
| 1 | `WHATSAPP` | WhatsApp |
| 2 | `TELEGRAM` | Telegram |
| 3 | `WEBCHAT` | Chat web |

Los tres canales están activos, pero el seeder no implementa la integración técnica con ellos.

## 13. ChatbotMessageRoleSeeder

Identifica al actor responsable de un mensaje dentro de una conversación.

| Orden | Código | Actor |
|---:|---|---|
| 1 | `USUARIO` | Usuario que inició la conversación. |
| 2 | `CHATBOT` | Asistente conversacional. |
| 3 | `AGENTE_HUMANO` | Agente de soporte humano. |
| 4 | `SISTEMA` | Plataforma o proceso interno. |

Este catálogo no contiene lógica conversacional ni comportamiento de inteligencia artificial.

## 14. ChatbotConversationStatusSeeder

Define el estado operativo de una conversación con el chatbot.

| Orden | Código | Final |
|---:|---|:---:|
| 1 | `ACTIVA` | No |
| 2 | `ESCALADA` | No |
| 3 | `ATENDIDA_HUMANO` | No |
| 4 | `CERRADA` | Sí |

`CERRADA` es el único estado final. El seeder no implementa las transiciones entre los estados.

## 15. SupportTicketStatusSeeder

Define el ciclo inicial de un ticket generado para soporte humano.

| Orden | Código | Permite asignación | Final |
|---:|---|:---:|:---:|
| 1 | `ABIERTO` | Sí | No |
| 2 | `ASIGNADO` | No | No |
| 3 | `EN_ATENCION` | No | No |
| 4 | `RESUELTO` | No | Sí |
| 5 | `CERRADO` | No | Sí |

Solo un ticket `ABIERTO` permite asignación según los datos iniciales. `RESUELTO` y `CERRADO` están definidos como estados finales.

## 16. SupportTicketReasonSeeder

Define los motivos por los que una conversación o solicitud puede necesitar intervención humana.

| Orden | Código | Motivo |
|---:|---|---|
| 1 | `SOLICITUD_USUARIO` | El usuario pidió atención humana expresamente. |
| 2 | `BAJA_CONFIANZA_RAG` | El sistema de recuperación no produjo una respuesta suficientemente confiable. |
| 3 | `ERROR_AGENDAMIENTO` | El asistente no pudo completar una operación de agenda. |
| 4 | `RECLAMO_SERVICIO` | Se presentó un reclamo relacionado con un servicio odontológico. |
| 5 | `CONSULTA_COMPLEJA` | La consulta requiere criterio profesional o excede el alcance del chatbot. |

## 17. Resumen cuantitativo

| Seeder | Registros |
|---|---:|
| AppointmentStatus | 6 |
| AppointmentOrigin | 4 |
| Service | 4 |
| HubNotificationType | 4 |
| NotificationPriority | 4 |
| HubNotificationStatus | 4 |
| WhatsAppNotificationType | 4 |
| WhatsAppNotificationStatus | 5 |
| ChatChannel | 3 |
| ChatbotMessageRole | 4 |
| ChatbotConversationStatus | 4 |
| SupportTicketStatus | 5 |
| SupportTicketReason | 5 |
| **Total** | **56** |

## 18. Estado de integración y validación

Los 13 seeders están creados y compilan correctamente, pero aún no son invocados desde `OnModelCreating`. En consecuencia, no forman parte de ninguna migración y todavía no insertan registros en Oracle.

La validación realizada confirmó:

- 13 carpetas y 13 archivos.
- Una llamada a `HasData` por seeder.
- 56 registros y 56 GUIDs diferentes.
- Ausencia de GUIDs y fechas dinámicas.
- Ausencia de operaciones de seeding en runtime.
- Compilación con 0 errores y 0 advertencias.

Las configuraciones EF de estas entidades no asignan explícitamente nombres de columna para las propiedades heredadas `CreatedAt` y `UpdatedAt`; EF Core las incorpora por convención. Esta diferencia no fue corregida porque la responsabilidad de los seeders se limita a proporcionar datos iniciales compatibles con el modelo actual.
