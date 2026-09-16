---
title: "Informe de Pruebas y Cobertura de Endpoints"
section: "Backend_Net"
order: 9
date: "2026-09-08"
author: "Equipo NexusOdonto"
summary: "Informe de Pruebas y Cobertura de Endpoints — Documentación integral del ecosistema NexusOdonto."
---

# Informe completo de pruebas de endpoints — NexusOdonto Backend

**Fecha de ejecución:** 31 de agosto de 2026  
**Tipo de prueba:** integración manual con datos reales  
**Base de datos:** Oracle `FREEPDB1`, esquema `NEXUSODONTO`  
**API probada:** instancia local en `http://localhost:5170`  
**Contrato inspeccionado:** OpenAPI/Swagger  

## 1. Objetivo

Este documento registra las pruebas realizadas sobre los endpoints disponibles en el backend NexusOdonto. Incluye:

- Inventario de rutas publicado por Swagger.
- Operaciones ejecutadas con registros reales en Oracle.
- Códigos HTTP obtenidos.
- Módulos que funcionaron correctamente.
- Errores reproducibles y sus causas identificadas.
- Funcionalidades faltantes o no expuestas.
- Pruebas de autenticación, autorización y SignalR.
- Estado final de la compilación.
- Tratamiento de los registros temporales utilizados.

No se modificó ningún archivo del backend durante estas pruebas.

## 2. Resumen ejecutivo

Swagger publicó **109 rutas** y **254 operaciones HTTP**. Se recorrieron todas las formas de ruta publicadas y se realizaron pruebas de ciclo completo con registros reales siempre que el endpoint permitió crear el registro requerido.

Resultados generales:

- Los **53 endpoints de listado sin parámetros** fueron ejecutados.
- **52 listados respondieron `200 OK`**.
- `GET /api/v1/Employees` respondió `500 Internal Server Error` cuando existía un empleado real.
- Se comprobaron **51 eliminaciones correctas**, todas con `204 No Content`.
- La eliminación de Empleados respondió `500` por el problema de conversión de fechas del módulo.
- La autenticación administrativa funcionó en login, perfil, refresh y logout.
- SignalR aceptó una negociación autenticada y rechazó correctamente una negociación anónima.
- Un usuario con rol `PACIENTE` recibió `403 Forbidden` al intentar consultar Roles.
- La solución compiló con **0 errores y 3 advertencias**.

## 3. Metodología utilizada

Las pruebas siguieron este orden:

1. Inicio de la API contra el esquema Oracle migrado.
2. Lectura del documento Swagger actual.
3. Inicio de sesión con el usuario administrativo sembrado.
4. Creación de catálogos temporales con códigos únicos.
5. Creación de registros núcleo y de sus dependencias.
6. Consulta individual y consulta de colecciones.
7. Actualización de los registros creados.
8. Prueba de relaciones, autenticación y permisos.
9. Eliminación o desactivación de los registros temporales.
10. Detención de la API y compilación final.

Los identificadores usados fueron `Guid` reales generados durante la ejecución. Las contraseñas y tokens no se incluyen en este documento.

## 4. Convenciones de respuesta esperadas

| Operación | Resultado esperado |
|---|---:|
| Listar o consultar | `200 OK` |
| Crear | `201 Created` |
| Actualizar | `200 OK` |
| Eliminar o desactivar | `204 No Content` |
| Credenciales incorrectas | `401 Unauthorized` |
| Usuario autenticado sin permiso | `403 Forbidden` |
| Recurso inexistente | `404 Not Found` |
| Solicitud inválida | `400 Bad Request` |

Los `500 Internal Server Error` registrados en este informe representan fallos internos reproducibles y no respuestas esperadas para los datos enviados.

## 5. Autenticación y autorización

### 5.1 Endpoints publicados

| Método | Ruta | Resultado real | Observación |
|---|---|---:|---|
| `POST` | `/api/auth/login` | `200` | Generó JWT y refresh token. |
| `POST` | `/api/auth/refresh` | `200` | Renovó correctamente la sesión. |
| `POST` | `/api/auth/logout` | `204` | Revocó el refresh token probado. |
| `GET` | `/api/auth/me` | `200` | Retornó el perfil del usuario autenticado. |

También se comprobó que un login inválido responde `401 Unauthorized`.

### 5.2 Normalización de correos

Se creó un usuario real con una contraseña procesada por el backend.

- Cuando el correo almacenado contenía letras mayúsculas, el login respondió `401` aunque la contraseña era correcta.
- Cuando el correo se creó completamente en minúsculas, el login respondió `200`.

La causa es la diferencia entre la normalización del login y el valor persistido:

- `AuthService` convierte el correo ingresado a minúsculas.
- `UserRepository` también normaliza el valor buscado.
- La creación de Persona conserva el uso de mayúsculas del correo recibido.
- La comparación realizada por Oracle resulta sensible a mayúsculas para estos valores.

Este comportamiento debe unificarse para que la creación y la búsqueda utilicen la misma representación normalizada.

### 5.3 Prueba de autorización por rol

Se ejecutó el escenario requerido para permisos dinámicos:

1. Se creó una Persona temporal.
2. Se creó un Usuario para esa Persona.
3. Se asignó el rol sembrado `PACIENTE`.
4. El usuario inició sesión correctamente.
5. Se solicitó `GET /api/v1/Roles` con su JWT.
6. La API respondió `403 Forbidden`.

Conclusión: el sistema bloquea correctamente a un Paciente intentando acceder a la gestión de Roles.

### 5.4 Registro no expuesto

Se intentó `POST /api/auth/register` y se obtuvo `404 Not Found`.

`AuthService` contiene un método `RegisterAsync`, pero el controlador actual no publica esta ruta y Swagger tampoco la declara. Por tanto, el registro por autenticación existe en la capa de aplicación, pero no está disponible como endpoint HTTP.

## 6. SignalR

Se probó el hub de notificaciones:

| Escenario | Resultado |
|---|---:|
| Negociación con JWT válido | `200 OK` |
| Negociación sin JWT | `401 Unauthorized` |

Ruta utilizada:

```text
POST /hubs/notifications/negotiate?negotiateVersion=1
```

La negociación y la protección por autenticación funcionan correctamente.

## 7. Catálogos

En cada uno de los siguientes catálogos se ejecutó el ciclo completo:

```text
POST colección        -> 201 Created
GET colección         -> 200 OK
GET por id             -> 200 OK
PUT por id             -> 200 OK
DELETE por id          -> 204 No Content
```

| Catálogo | Ruta base | Resultado |
|---|---|---|
| Acciones de permiso | `/api/v1/ActionPermissions` | Correcto |
| Tipos de antecedente | `/api/v1/AntecedentTypes` | Correcto |
| Orígenes de cita | `/api/v1/AppointmentOrigins` | Correcto |
| Estados de cita | `/api/v1/AppointmentStatuses` | Correcto |
| Tipos de evento de auditoría | `/api/v1/AuditEventTypes` | Correcto |
| Estados de conversación chatbot | `/api/v1/ChatbotConversationStatuses` | Correcto |
| Roles de mensaje chatbot | `/api/v1/ChatbotMessageRoles` | Correcto |
| Canales de chat | `/api/v1/ChatChannels` | Correcto |
| Superficies dentales | `/api/v1/DentalSurfaces` | Correcto |
| Tipos de dentición | `/api/v1/DentitionTypes` | Correcto |
| Tipos de documento | `/api/v1/DocumentTypes` | Correcto |
| Estados de hallazgo | `/api/v1/FindingStatuses` | Correcto |
| Tipos de hallazgo | `/api/v1/FindingTypes` | Correcto |
| Estados de notificación Hub | `/api/v1/HubNotificationStatuses` | Correcto |
| Tipos de notificación Hub | `/api/v1/HubNotificationTypes` | Correcto |
| Cargos | `/api/v1/JobTitles` | Correcto |
| Prioridades de notificación | `/api/v1/NotificationPriorities` | Correcto |
| Estados de sesión | `/api/v1/SessionStatuses` | Correcto |
| Sexos | `/api/v1/Sexes` | Correcto |
| Especialidades | `/api/v1/Specialties` | Correcto |
| Motivos de ticket | `/api/v1/SupportTicketReasons` | Correcto |
| Estados de ticket | `/api/v1/SupportTicketStatuses` | Correcto |
| Estados del diente | `/api/v1/ToothStatuses` | Correcto |
| Estados de notificación WhatsApp | `/api/v1/WhatsAppNotificationStatuses` | Correcto |
| Tipos de notificación WhatsApp | `/api/v1/WhatsAppNotificationTypes` | Correcto |

Las eliminaciones de catálogos realizan desactivación lógica cuando así lo define el servicio.

## 8. Seguridad, servicios y asignaciones

| Recurso | Operaciones probadas | Resultado |
|---|---|---|
| Servicios | Listar, crear, consultar, actualizar y eliminar | Correcto |
| Roles | Listar, crear, consultar, actualizar y eliminar | Correcto |
| Permisos | Listar, crear, consultar, actualizar y eliminar | Correcto |
| Roles de usuario | Listar, consultar por usuario, asignar y retirar | Correcto |
| Usuarios | Listar, crear, consultar, actualizar y eliminar | Correcto |

Rutas de asignación de roles probadas:

```text
GET    /api/v1/UserRoles
GET    /api/v1/UserRoles/users/{userId}/roles
POST   /api/v1/UserRoles/users/{userId}/roles/{roleId}
DELETE /api/v1/UserRoles/users/{userId}/roles/{roleId}
```

## 9. Personas, pacientes, empleados y profesionales

### 9.1 Personas

| Operación | Resultado |
|---|---:|
| Listar | `200` |
| Crear con `DateOfBirth = null` | `201` |
| Consultar por id | `200` |
| Actualizar con `DateOfBirth = null` | `200` |
| Eliminar/desactivar | `204` |
| Crear con una fecha válida no nula | `500` |

Enviar una fecha como `1995-05-10` produjo:

```text
ORA-01843: Se ha especificado un mes no válido
```

Por tanto, el endpoint funciona cuando la fecha es nula, pero falla al persistir un `DateOnly` no nulo en Oracle.

### 9.2 Pacientes

| Operación | Resultado |
|---|---:|
| Listar | `200` |
| Crear | `201` |
| Consultar | `200` |
| Actualizar | `200` |
| Eliminar/desactivar | `204` |

La creación de un Paciente generó automáticamente su Historia Clínica. Esta relación se verificó consultando el registro creado.

### 9.3 Empleados

| Operación | Resultado real |
|---|---:|
| Crear con `HireDate` válido | `500` |
| Listar cuando existe un empleado | `500` |
| Consultar por id | `500` |
| Actualizar | `500` |
| Eliminar/desactivar mediante API | `500` |

El error reproducido fue:

```text
ORA-01843: Se ha especificado un mes no válido
```

El problema aparece al guardar `HireDate` y también al materializar un empleado existente. Esto bloquea el ciclo completo del módulo de Empleados.

Para poder probar los endpoints dependientes se insertó un empleado auxiliar directamente en Oracle utilizando un `TIMESTAMP` válido. Al finalizar quedó desactivado. No se modificó código ni configuración del backend.

### 9.4 Profesionales

Con el empleado auxiliar se pudo completar:

| Operación | Resultado |
|---|---:|
| Crear | `201` |
| Listar | `200` |
| Consultar | `200` |
| Actualizar | `200` |
| Eliminar/desactivar | `204` |

La creación incluyó una especialidad real y un registro profesional único.

## 10. Agenda

### 10.1 Disponibilidades

| Operación | Resultado |
|---|---:|
| Listar | `200` |
| Crear | `201` |
| Consultar | `200` |
| Actualizar | `200` |
| Eliminar | `204` |

### 10.2 Citas

La cita se creó utilizando identificadores reales de Paciente, Profesional, Servicio, Estado y Origen.

| Operación | Resultado |
|---|---:|
| Listar | `200` |
| Crear | `201` |
| Consultar | `200` |
| Actualizar | `200` |
| Eliminar | `204` |

## 11. Historia y atención clínica

### 11.1 Historias clínicas

Este recurso no publica un `POST`; la historia se genera al crear el Paciente.

| Operación publicada | Resultado |
|---|---:|
| Listar | `200` |
| Consultar | `200` |
| Actualizar | `200` |
| Eliminar | `204` |

### 11.2 Atenciones clínicas

| Operación | Resultado |
|---|---:|
| Listar | `200` |
| Crear | `201` |
| Consultar | `200` |
| Actualizar | `200` |
| Eliminar | `204` |

### 11.3 Diagnósticos

| Operación publicada | Resultado |
|---|---:|
| Listar | `200` |
| Crear | `201` |
| Consultar | `200` |
| Eliminar | `204` |

No existe una operación `PUT` de Diagnósticos en el contrato actual.

### 11.4 Procedimientos realizados

| Operación publicada | Resultado |
|---|---:|
| Listar | `200` |
| Crear | `201` |
| Consultar | `200` |
| Eliminar | `204` |

No existe una operación `PUT` para Procedimientos realizados en el contrato actual.

### 11.5 Antecedentes del paciente

| Operación | Resultado |
|---|---:|
| Listar | `200` |
| Crear con Paciente y Tipo válidos | `500` |
| Consultar un registro creado | Bloqueado por el fallo del `POST` |
| Actualizar un registro creado | Bloqueado por el fallo del `POST` |
| Eliminar un registro creado | Bloqueado por el fallo del `POST` |

La causa está en `PatientAntecedentService`: al construir la entidad se asigna `Guid.Empty` a `RegisteredByUserId`.

```csharp
var entity = new PatientAntecedentEntity(
    request.PatientId,
    request.AntecedentTypeId,
    request.Description,
    Guid.Empty);
```

La columna `registered_by_user_id` es obligatoria y referencia a Usuarios. El servicio debería utilizar el identificador del usuario autenticado o un usuario válido según la regla de negocio.

## 12. Odontograma

### 12.1 Dientes

Con un código válido de dos caracteres:

| Operación | Resultado |
|---|---:|
| Listar | `200` |
| Crear | `201` |
| Consultar por código | `200` |
| Actualizar | `200` |
| Eliminar | `204` |

También se envió un código de nueve caracteres. Oracle respondió:

```text
ORA-12899: valor demasiado grande para la columna
```

La API transformó este error de validación en `500`. Falta validar la longitud máxima de dos caracteres antes de intentar guardar el registro, para poder responder `400 Bad Request`.

### 12.2 Odontogramas

Listar, crear, consultar, actualizar y eliminar funcionaron con `200`, `201` y `204` según la operación.

### 12.3 Dientes del odontograma

El primer intento falló porque dependía del código de diente inválido. Al utilizar un diente válido, el ciclo completo funcionó:

- Crear: `201`.
- Listar: `200`.
- Consultar: `200`.
- Actualizar: `200`.
- Eliminar: `204`.

### 12.4 Hallazgos dentales

Listar, crear, consultar, actualizar y eliminar funcionaron correctamente.

## 13. Chatbot y soporte

| Recurso | Operaciones publicadas y probadas | Resultado |
|---|---|---|
| Conversaciones chatbot | Listar, crear, consultar y eliminar | Correcto |
| Mensajes chatbot | Listar, crear, consultar y eliminar | Correcto |
| Tickets de soporte | Listar, crear, consultar, actualizar y eliminar | Correcto |

Los registros utilizaron canales, estados, roles de mensaje, motivos y estados de ticket existentes en Oracle.

## 14. Notificaciones

| Recurso | Operaciones publicadas y probadas | Resultado |
|---|---|---|
| Notificaciones Hub | Listar, crear, consultar y eliminar | Correcto |
| Notificaciones WhatsApp | Listar, crear, consultar y eliminar | Correcto |

No se publican operaciones `PUT` para estos dos recursos en el contrato actual.

## 15. Auditoría

| Operación publicada | Resultado |
|---|---:|
| Listar eventos | `200` |
| Crear evento | `201` |
| Consultar evento | `200` |
| Eliminar evento | `204` |

No existe una operación `PUT` para Eventos de auditoría en Swagger.

## 16. Sesiones

Además de las sesiones creadas por autenticación, se probó el controlador CRUD de Sesiones:

| Operación publicada | Resultado |
|---|---:|
| Listar | `200` |
| Crear | `201` |
| Consultar | `200` |
| Eliminar | `204` |

El controlador no publica una operación `PUT` para Sesiones.

## 17. Errores consolidados

| Prioridad | Módulo | Escenario | Resultado | Causa identificada |
|---:|---|---|---:|---|
| Alta | Empleados | Crear, leer, listar, actualizar o eliminar un empleado con fecha | `500` | Conversión `DateOnly`/Oracle produce `ORA-01843`. |
| Alta | Personas | Crear o actualizar con fecha de nacimiento no nula | `500` | Conversión `DateOnly`/Oracle produce `ORA-01843`. |
| Alta | Antecedentes | Crear antecedente con referencias válidas | `500` | El servicio usa `Guid.Empty` como usuario registrador. |
| Media | Autenticación | Login de un correo guardado con mayúsculas | `401` | Normalización inconsistente y comparación sensible a mayúsculas. |
| Media | Autenticación | Solicitar `/api/auth/register` | `404` | El servicio existe, pero no hay ruta publicada. |
| Media | Dientes | Código con más de dos caracteres | `500` | Falta validación previa; Oracle lanza `ORA-12899`. |

## 18. Funcionalidad pendiente o faltante

Según el contrato y las pruebas realizadas, queda pendiente:

1. Corregir la persistencia y lectura de propiedades `DateOnly` en Oracle.
2. Permitir que Personas maneje fechas de nacimiento reales sin producir `500`.
3. Recuperar el funcionamiento completo del controlador de Empleados.
4. Obtener el usuario autenticado al registrar un antecedente de Paciente.
5. Normalizar el correo al crearlo y actualizarlo, no solamente durante el login.
6. Decidir si `POST /api/auth/register` debe publicarse; actualmente existe lógica de aplicación sin endpoint.
7. Validar longitudes y restricciones antes de llegar a Oracle.
8. Convertir errores de datos inválidos en respuestas `400`, evitando respuestas `500` para errores previsibles.
9. Agregar pruebas automatizadas de integración para los escenarios reproducidos en este informe.

## 19. Compilación final

Comando ejecutado:

```powershell
dotnet build --no-restore
```

Resultado:

```text
Compilación correcta.
0 errores
3 advertencias
```

Las tres advertencias `NU1510` corresponden a referencias explícitas que el SDK considera disponibles automáticamente:

- `Microsoft.Extensions.Configuration.Abstractions`
- `Microsoft.Extensions.Configuration.Binder`
- `Microsoft.Extensions.DependencyInjection.Abstractions`

También se mostró el mensaje `NETSDK1057`, porque el entorno está utilizando una versión preliminar del SDK de .NET. Este mensaje no impidió la compilación.

## 20. Registros temporales y limpieza

Durante la prueba se generaron registros temporales con códigos y correos únicos. Al finalizar:

- Las relaciones eliminables se retiraron mediante sus endpoints.
- Los recursos con eliminación lógica quedaron desactivados.
- Los 51 endpoints de eliminación funcionales respondieron `204`.
- El empleado auxiliar creado directamente en Oracle quedó desactivado porque el endpoint de Empleados también falla durante la eliminación.
- Los seeders originales y sus registros base no fueron alterados.
- No se incluyeron contraseñas, hashes, tokens ni cadenas de conexión en este documento.

## 21. Estado final

La mayoría de los endpoints publicados puede completar operaciones reales contra Oracle. Los flujos principales de catálogos, pacientes, profesionales, agenda, clínica, odontograma, chatbot, soporte, notificaciones, auditoría, autenticación y autorización quedaron comprobados.

Los bloqueos principales se concentran en:

- Propiedades `DateOnly` persistidas en Oracle.
- Creación de antecedentes con `RegisteredByUserId = Guid.Empty`.
- Normalización de correos.
- Ausencia del endpoint de registro.
- Validaciones que actualmente se delegan a restricciones de Oracle y terminan como errores `500`.

La API quedó detenida después de las pruebas y el repositorio permaneció sin cambios locales ocasionados por esta revisión.
