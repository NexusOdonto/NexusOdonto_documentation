# Documentación del modelo de datos — Sistema Odontológico

## 1. Propósito

Este documento describe el modelo relacional del **Sistema Odontológico** construido para una solución con backend .NET, frontend React, Oracle Database, SignalR, integración de WhatsApp y un chatbot en Python con RAG.

El modelo busca cubrir la operación clínica, administrativa y conversacional de un consultorio odontológico:

- Gestión de personas, pacientes, empleados, profesionales y usuarios.
- Autenticación con JWT y control de sesiones.
- Roles y permisos configurables.
- Servicios, disponibilidad y agenda de citas.
- Historia clínica, diagnósticos, procedimientos y odontograma.
- Notificaciones internas en tiempo real con SignalR.
- Notificaciones externas por WhatsApp.
- Chatbot con transferencia a un asesor humano de recepción.
- Auditoría para reportes administrativos y trazabilidad.

## 2. Principios del diseño

### 2.1 Catálogos configurables

El modelo no utiliza enums para valores de negocio. Estados, tipos, prioridades, orígenes y motivos se almacenan en tablas catálogo.

Esto permite que el administrador agregue, modifique, ordene o desactive opciones sin editar código ni hacer migraciones. Por ejemplo, se puede agregar el estado de cita `EN_SALA`, un nuevo tipo de hallazgo odontológico o una prioridad de ticket sin modificar la estructura de las tablas transaccionales.

Todos los catálogos siguen una idea común:

| Campo | Finalidad |
|---|---|
| `id` | Identificador interno del registro |
| `codigo` | Código técnico único usado por backend e integraciones |
| `nombre` | Nombre visible en el frontend |
| `descripcion` | Explicación opcional |
| `activo` | Permite desactivar sin borrar historial |
| `orden` | Orden de visualización o flujo |

### 2.2 Personas y contextos

`personas` contiene los datos personales comunes. `pacientes`, `empleados` y `usuarios` representan contextos independientes de una misma persona.

Una persona puede ser simultáneamente:

- Paciente de la clínica.
- Empleado.
- Profesional odontológico.
- Usuario con credenciales de acceso.

`pacientes` y `empleados` poseen identificadores propios. Esto permite referenciarlos de manera clara desde citas, historias clínicas y agenda, sin impedir que una persona tenga ambos contextos.

### 2.3 Separación de canales

El sistema diferencia tres responsabilidades:

| Componente | Responsabilidad |
|---|---|
| `notificaciones_hub` | Alertas internas en el panel React, entregadas en tiempo real por SignalR |
| `notificaciones_whatsapp` | Mensajes externos al paciente por WhatsApp |
| `auditoria_eventos` | Bitácora de acciones para reportes del administrador |

Una notificación no es una auditoría. Una alerta informa que alguien debe actuar; la auditoría registra quién realizó una acción y cuándo.

### 2.4 Chatbot y atención humana

El bot y la recepcionista usan la misma conversación y el mismo historial en `mensajes_chatbot`.

Si el bot no puede resolver un caso, crea un ticket en `tickets_soporte`, cambia el estado de la conversación a escalada y genera una alerta SignalR para recepción. La recepcionista toma el ticket, responde al paciente desde su panel y los mensajes se envían por el canal original, por ejemplo WhatsApp.

El ticket no crea una conversación nueva; únicamente controla el proceso de transferencia, asignación, resolución y cierre.

## 3. Arquitectura de datos

```text
React / Panel administrativo
        │
        ├── API .NET ─── Oracle Database
        │       │
        │       └── SignalR: alertas internas en tiempo real
        │
WhatsApp / Telegram
        │
        └── Agente Python + RAG ─── API .NET
                                      │
                                      └── Oracle Database
```

Reglas de acceso:

- React consume la API .NET.
- El agente Python consume la API .NET para citas, disponibilidad, pacientes y tickets.
- Solo la API .NET se conecta directamente a Oracle.
- La base vectorial del RAG guarda conocimiento documental, no datos operativos de la clínica.

## 4. Catálogos generales

### 4.1 `tipos_documento`

**Propósito:** catálogo de documentos de identidad aceptados por el sistema.

**Por qué existe:** evita registrar variaciones libres como `CC`, `C.C.`, `Cedula` o `cédula` en cada persona.

**Ejemplos:** CC, CE, TI, PAS.

**Relación:** `personas.tipo_documento_id → tipos_documento.id`.

### 4.2 `sexos`

**Propósito:** catálogo de sexo asociado a una persona.

**Por qué existe:** evita inconsistencias de escritura y permite administrar los valores disponibles.

**Relación:** `personas.sexo_id → sexos.id`. Es opcional porque una persona puede no tener ese dato registrado.

### 4.3 `cargos`

**Propósito:** catálogo de cargos laborales de empleados.

**Por qué existe:** un empleado no debe guardar texto libre como `Recepcionista`, `recepcionista` o `Recepción`. La tabla estandariza las opciones.

**Ejemplos:** Administrador, Recepcionista, Asistente odontológico, Odontólogo general.

**Relación:** `empleados.cargo_id → cargos.id`.

### 4.4 `acciones_permiso`

**Propósito:** define las acciones posibles de un permiso.

**Ejemplos:** VER, CREAR, EDITAR, ELIMINAR.

**Relación:** `permisos.accion_permiso_id → acciones_permiso.id`.

### 4.5 `tipos_antecedente`

**Propósito:** clasifica antecedentes clínicos del paciente.

**Ejemplos:** Médico, Odontológico, Alergia, Medicamento, Otro.

**Relación:** `antecedentes_paciente.tipo_antecedente_id → tipos_antecedente.id`.

### 4.6 `especialidades`

**Propósito:** catálogo de especialidades clínicas de los profesionales.

**Ejemplos:** Odontología general, Ortodoncia, Endodoncia, Periodoncia.

**Relación:** se enlaza con profesionales mediante `profesional_especialidades`.

### 4.7 `servicios`

**Propósito:** catálogo de servicios que la clínica ofrece y agenda.

**Campos relevantes:**

| Campo | Uso |
|---|---|
| `codigo` | Identificador técnico del servicio |
| `nombre` | Nombre mostrado al usuario |
| `duracion_minutos` | Duración usada para calcular el fin de la cita |
| `precio` | Valor de referencia |
| `activo` | Indica si puede seguir ofreciendo el servicio |

**Ejemplos:** Valoración, Limpieza, Extracción, Endodoncia, Ortodoncia, Blanqueamiento.

## 5. Catálogos de citas

### 5.1 `estados_cita`

**Propósito:** controla el ciclo de vida de una cita.

**Ejemplos iniciales:** Agendada, Confirmada, Atendida, Cancelada, No asistió.

`color_hex` permite mostrar estados visualmente en el calendario. `es_final` indica que una cita no debería continuar su flujo normal, por ejemplo una cita cancelada.

**Relación:** `citas.estado_cita_id → estados_cita.id`.

### 5.2 `origenes_cita`

**Propósito:** registra cómo se creó una cita.

**Ejemplos:** Manual, Agente, Web, Teléfono.

Esto permite reportar cuántas citas llegaron por el chatbot frente a las creadas por recepción.

**Relación:** `citas.origen_cita_id → origenes_cita.id`.

## 6. Catálogos del odontograma

### 6.1 `tipos_denticion`

**Propósito:** clasifica la dentición como permanente o temporal.

**Relación:** `dientes.tipo_denticion_id → tipos_denticion.id`.

### 6.2 `estados_diente`

**Propósito:** define el estado general de una pieza dentro de un odontograma.

**Ejemplos:** Sano, Ausente, Extraído, Erupcionando, Implante, Corona, Endodoncia, Fractura.

`color_hex` y `codigo_visual` permiten que el frontend pinte el odontograma usando convenciones visuales configurables.

**Relación:** `odontograma_dientes.estado_diente_id → estados_diente.id`.

### 6.3 `superficies_dentales`

**Propósito:** catálogo de caras dentales donde se pueden registrar hallazgos.

**Ejemplos:** Mesial, Distal, Vestibular, Lingual, Palatina, Oclusal, Incisal y Raíz.

Los campos `aplica_a_anteriores` y `aplica_a_posteriores` sirven para que el frontend sepa qué superficies mostrar según la pieza.

**Relación:** `hallazgos_dentales.superficie_dental_id → superficies_dentales.id`.

### 6.4 `tipos_hallazgo`

**Propósito:** catálogo de hallazgos clínicos dentales.

**Ejemplos:** Caries, Restauración, Sellante, Fractura, Desgaste, Movilidad.

`requiere_superficie` define si el hallazgo necesita especificar una cara dental. Por ejemplo, una caries normalmente requiere superficie; una extracción puede afectar toda la pieza.

**Relación:** `hallazgos_dentales.tipo_hallazgo_id → tipos_hallazgo.id`.

### 6.5 `estados_hallazgo`

**Propósito:** indica el seguimiento de un hallazgo.

**Ejemplos:** Activo, Tratado, Inactivo.

**Relación:** `hallazgos_dentales.estado_hallazgo_id → estados_hallazgo.id`.

## 7. Personas, pacientes, empleados y usuarios

### 7.1 `personas`

**Propósito:** almacena información común de cualquier persona registrada.

**Campos principales:** documento, nombres, apellidos, fecha de nacimiento, sexo, teléfono, correo y dirección.

**Por qué existe:** evita duplicar estos datos entre pacientes, empleados y usuarios.

**Regla:** la combinación `tipo_documento_id + numero_documento` es única.

### 7.2 `pacientes`

**Propósito:** representa el contexto clínico de una persona.

**Por qué tiene ID propio:** permite que citas, historia clínica, conversaciones y notificaciones referencien al paciente mediante `paciente_id`, incluso si la misma persona también es empleada.

**Datos propios:** contacto y teléfono de emergencia, estado y fecha de registro.

**Relación:** `pacientes.persona_id → personas.id` con relación uno a uno.

### 7.3 `empleados`

**Propósito:** representa el contexto laboral de una persona.

**Datos propios:** cargo, fecha de vinculación y estado laboral.

**Relaciones:**

- `empleados.persona_id → personas.id`.
- `empleados.cargo_id → cargos.id`.

No todo empleado es profesional: una recepcionista es empleada, pero no debe aparecer como profesional en la agenda.

### 7.4 `usuarios`

**Propósito:** contiene las credenciales de acceso a la plataforma.

**Campos principales:** `password_hash`, estado, último acceso y fechas de creación/actualización.

**Regla:** la contraseña se almacena solo como hash. Nunca debe guardarse en texto plano.

Una persona puede existir sin usuario, por ejemplo un paciente registrado por recepción sin portal de pacientes.

### 7.5 `profesionales`

**Propósito:** identifica empleados habilitados para atender pacientes y registrar información clínica.

**Datos propios:** registro profesional y estado de habilitación.

**Relación:** `profesionales.empleado_id → empleados.id`.

Un profesional puede tener múltiples especialidades mediante `profesional_especialidades`.

### 7.6 `sesiones`

**Propósito:** administra sesiones JWT y refresh tokens.

**Por qué existe:** JWT por sí solo no permite revocar fácilmente una sesión. Esta tabla permite cerrar sesión, revocar un dispositivo, detectar expiraciones y mostrar sesiones activas al administrador.

**Campos principales:**

| Campo | Uso |
|---|---|
| `usuario_id` | Usuario dueño de la sesión |
| `refresh_token_hash` | Hash del refresh token; no se guarda el token real |
| `token_familia` | Agrupa tokens rotados de una misma sesión |
| `dispositivo`, `direccion_ip`, `agente_usuario` | Contexto de seguridad |
| `fecha_expiracion` | Límite de la sesión |
| `estado_sesion_id` | Estado configurable de sesión |

**Relaciones:**

- `sesiones.usuario_id → usuarios.id`.
- `sesiones.estado_sesion_id → estados_sesion.id`.

## 8. Roles y permisos

### 8.1 `roles`

**Propósito:** define perfiles de acceso configurables.

**Ejemplos:** Administrador, Recepcionista, Odontólogo, Asistente, Paciente.

Los roles no deben estar quemados en código. La interfaz administrativa puede crear o desactivar roles según la operación de la clínica.

### 8.2 `permisos`

**Propósito:** representa una acción permitida dentro de un módulo.

Un permiso se forma por:

```text
MODULO + ACCION
```

Ejemplo:

```text
CITAS + CREAR
ODONTOGRAMA + EDITAR
PACIENTES + VER
```

**Relación:** `permisos.accion_permiso_id → acciones_permiso.id`.

### 8.3 `usuario_roles`

**Propósito:** resuelve la relación muchos a muchos entre usuarios y roles.

Un usuario puede tener múltiples roles. Un rol puede pertenecer a muchos usuarios.

### 8.4 `rol_permisos`

**Propósito:** resuelve la relación muchos a muchos entre roles y permisos.

Ejemplo: el rol Recepcionista puede tener permiso para crear, editar y cancelar citas, pero no para modificar odontogramas.

## 9. Antecedentes y especialidades

### 9.1 `antecedentes_paciente`

**Propósito:** registra antecedentes relevantes para la atención clínica.

**Ejemplos:** alergia a penicilina, hipertensión, diabetes, medicamentos actuales, tratamientos odontológicos previos.

Cada registro conserva quién lo creó mediante `registrado_por_usuario_id`.

### 9.2 `profesional_especialidades`

**Propósito:** relaciona profesionales con especialidades.

**Por qué existe:** la relación es muchos a muchos. Un profesional puede ser odontólogo general y ortodoncista; una especialidad puede estar asociada a varios profesionales.

## 10. Disponibilidad y citas

### 10.1 `disponibilidades`

**Propósito:** define el horario recurrente de cada profesional.

El diseño usa un rango de días y una pausa de almuerzo. Así no se requieren cinco o siete filas cuando un mismo horario aplica a varios días seguidos.

**Campos principales:**

| Campo | Uso |
|---|---|
| `dia_inicio` | Primer día del rango; 1=Lunes, 7=Domingo |
| `dia_fin` | Último día del rango |
| `hora_inicio` | Inicio de jornada |
| `hora_almuerzo` | Inicio de pausa |
| `hora_retorno` | Fin de pausa |
| `hora_fin` | Fin de jornada |

Ejemplo de lunes a viernes:

```text
dia_inicio: 1
dia_fin: 5
hora_inicio: 08:00
hora_almuerzo: 12:00
hora_retorno: 13:00
hora_fin: 17:00
```

La API debe permitir citas solo en las franjas:

```text
08:00 a 12:00
13:00 a 17:00
```

Y debe validar que la cita no cruce la pausa de almuerzo ni el fin de jornada.

### 10.2 `citas`

**Propósito:** registra cada reserva entre paciente, profesional y servicio.

**Campos principales:**

| Campo | Uso |
|---|---|
| `paciente_id` | Paciente que recibirá la atención |
| `profesional_id` | Profesional asignado |
| `servicio_id` | Servicio solicitado |
| `fecha_hora_inicio`, `fecha_hora_fin` | Intervalo reservado |
| `estado_cita_id` | Estado actual de la cita |
| `origen_cita_id` | Origen, por ejemplo manual o agente |
| `creada_por_usuario_id` | Usuario que creó la cita manualmente, si aplica |

**Reglas de negocio:**

- La hora de fin debe ser posterior a la hora de inicio.
- La cita debe caber en la disponibilidad del profesional.
- La cita no puede ocupar la pausa de almuerzo.
- No puede cruzarse con otra cita activa del mismo profesional.
- La validación se implementa en la API .NET, tanto para el panel React como para el chatbot.

## 11. Historia clínica y atención

### 11.1 `historias_clinicas`

**Propósito:** contiene la historia clínica principal de cada paciente.

**Regla:** un paciente tiene una historia clínica principal; por eso `paciente_id` es único.

### 11.2 `atenciones_clinicas`

**Propósito:** guarda el resultado clínico de una cita atendida.

**Por qué se separa de citas:** la cita almacena datos administrativos de agenda; la atención contiene la evaluación, evolución y tratamiento clínico.

No duplica paciente, profesional ni servicio: esos datos se consultan mediante `atenciones_clinicas → citas`.

### 11.3 `diagnosticos`

**Propósito:** registra uno o varios diagnósticos de una atención clínica.

Se separa porque una misma atención puede tener múltiples diagnósticos.

### 11.4 `procedimientos_realizados`

**Propósito:** registra procedimientos ejecutados durante la atención.

El servicio agendado no necesariamente representa todos los procedimientos realizados. Una valoración puede terminar en varios procedimientos o tratamientos posteriores.

## 12. Odontograma

### 12.1 `dientes`

**Propósito:** catálogo global de piezas dentales usando notación FDI.

**Ejemplos:**

| Código | Significado |
|---|---|
| `11` | Incisivo central superior derecho |
| `26` | Primer molar superior izquierdo |
| `36` | Primer molar inferior izquierdo |
| `46` | Primer molar inferior derecho |

Los dientes permanentes usan códigos `11` a `48`; los temporales usan `51` a `85`.

### 12.2 `odontogramas`

**Propósito:** representa una versión o fotografía clínica del estado bucal en un momento específico.

**Por qué existe:** el estado dental cambia con el tiempo. Un odontograma por atención permite seguir evolución, tratamientos y cambios clínicos.

### 12.3 `odontograma_dientes`

**Propósito:** guarda el estado de cada pieza dentro de un odontograma.

Cuando se crea un odontograma de un adulto:

1. Se crea el registro en `odontogramas`.
2. La API consulta los dientes permanentes en `dientes`.
3. Inserta 32 registros en `odontograma_dientes`.
4. Cada pieza inicia normalmente con un estado como `SANO`.

No se crean 32 columnas. Se crea una fila por pieza dental.

La combinación `(odontograma_id, diente_codigo)` es única, por lo que una pieza no se repite dentro de un mismo odontograma.

### 12.4 `hallazgos_dentales`

**Propósito:** almacena hallazgos específicos por superficie dental.

Ejemplo:

```text
Diente: 46
Superficie: OCLUSAL
Hallazgo: CARIES
Estado: ACTIVO
```

`superficie_dental_id` es opcional porque algunos hallazgos afectan toda la pieza, por ejemplo una corona o una extracción.

## 13. Notificaciones internas: SignalR

### 13.1 `notificaciones_hub`

**Propósito:** almacena alertas internas del panel web y permite entregarlas en tiempo real mediante SignalR.

Esta tabla **no envía mensajes al paciente por WhatsApp**. Su finalidad es alertar a usuarios internos como odontólogos, recepcionistas, asistentes y administradores.

**Ejemplos de alertas:**

- Nueva cita asignada a un profesional.
- Cita cancelada.
- Ticket nuevo creado por el chatbot.
- Ticket asignado a una recepcionista.
- Alerta clínica o administrativa.

**Destinatarios:**

| Caso | Campo utilizado |
|---|---|
| Notificación a un odontólogo específico | `receptor_usuario_id` |
| Notificación a todos los recepcionistas | `receptor_rol_id` |
| Notificación a administradores | `receptor_rol_id` |

**Flujo SignalR:**

1. La API guarda una alerta en `notificaciones_hub`.
2. SignalR envía el evento al usuario o grupo de rol conectado.
3. React actualiza la campana de notificaciones o la bandeja de tickets.
4. Si el usuario estaba desconectado, consulta las alertas pendientes al iniciar sesión.
5. Al abrir la alerta, el frontend llama la API para actualizar su estado a leída.

**Nota:** una notificación debe dirigirse a un usuario o a un rol. La API debe impedir que ambos destinatarios se asignen simultáneamente salvo que se defina explícitamente una regla distinta.

## 14. Notificaciones externas: WhatsApp

### 14.1 `notificaciones_whatsapp`

**Propósito:** registra mensajes enviados al paciente o visitante por WhatsApp.

**Casos de uso:**

- Recordatorio de cita.
- Confirmación de cita.
- Cancelación o reprogramación.
- Mensaje de transferencia a un asesor humano.
- Mensaje general autorizado por la clínica.

**Campos importantes:**

| Campo | Uso |
|---|---|
| `telefono_destino` | Número del paciente o visitante |
| `contenido` | Texto del mensaje |
| `plantilla_nombre` | Plantilla aprobada por WhatsApp, si aplica |
| `mensaje_proveedor_id` | Identificador devuelto por Meta/Twilio/proveedor |
| `programada_para` | Fecha/hora de envío planeado |
| `enviada_en`, `entregada_en`, `leida_en` | Seguimiento del envío |
| `error_detalle` | Motivo de fallo |

## 15. Chatbot, tickets y panel de recepción

### 15.1 `conversaciones_chatbot`

**Propósito:** identifica una conversación entre un paciente o visitante y el bot por un canal externo.

`identificador_chat` almacena el identificador del chat del proveedor, por ejemplo el `chat_id` del canal.

**Estados esperados:**

| Estado | Significado |
|---|---|
| Activa | El chatbot puede atender el flujo normal |
| Escalada | El bot pidió atención humana y se creó un ticket |
| Atendida humano | Una recepcionista tomó el caso; el bot debe permanecer pausado |
| Cerrada | El ticket y la conversación terminaron |

### 15.2 `mensajes_chatbot`

**Propósito:** guarda el historial completo de la conversación.

La misma tabla almacena mensajes de:

- Paciente o visitante.
- Chatbot.
- Sistema.
- Herramientas.
- Asesor humano.

La recepcionista ve estos mensajes en su panel y responde usando un mensaje con rol `AGENTE_HUMANO`. El backend guarda el mensaje y lo envía por el canal original de la conversación.

### 15.3 `tickets_soporte`

**Propósito:** controla la transferencia del chatbot hacia una recepcionista.

El ticket no duplica mensajes ni crea otro chat. Está vinculado a `conversaciones_chatbot` y permite saber:

- Por qué se escaló el caso.
- Prioridad.
- Resumen que generó el bot.
- Confianza del RAG cuando aplique.
- Qué recepcionista lo tomó.
- Cuándo fue atendido, resuelto y cerrado.

**Flujo de handoff:**

```text
Paciente escribe por WhatsApp
        │
        ▼
Chatbot intenta resolver
        │
        ├── Resuelve: continúa conversación automática
        │
        └── No resuelve / paciente pide persona
                │
                ▼
        Crea TICKETS_SOPORTE con estado ABIERTO
                │
                ├── Conversación cambia a ESCALADA
                ├── Se genera NOTIFICACIONES_HUB para RECEPCIONISTA
                ├── SignalR actualiza el panel de recepción
                └── WhatsApp informa al paciente que un asesor continuará
                        │
                        ▼
             Recepcionista toma el ticket
                        │
                        ├── Ticket: ASIGNADO o EN_ATENCION
                        ├── Conversación: ATENDIDA_HUMANO
                        └── Bot queda pausado
                                │
                                ▼
               Recepcionista responde desde React
                                │
                                ▼
              Backend registra MENSAJES_CHATBOT
              y envía mensaje por WhatsApp
                                │
                                ▼
              Recepcionista resuelve y cierra
                        │
                        ├── Ticket: RESUELTO y luego CERRADO
                        └── Conversación: CERRADA
```

### 15.4 Panel propio de recepción

El panel de recepción debe tener dos áreas:

```text
┌──────────────────────────┬───────────────────────────────────────────┐
│ Tickets pendientes       │ Conversación seleccionada                  │
│                          │                                           │
│ #25 Juan - Alta          │ Bot: ¿En qué puedo ayudarte?              │
│ #26 Ana - Normal         │ Paciente: Necesito cancelar mi cita.       │
│ #27 Carlos - Urgente     │ Bot: Solicité apoyo de recepción.          │
│                          │                                           │
│                          │ [Escriba la respuesta]         [Enviar]  │
│                          │                                           │
│                          │ [Tomar] [Resolver] [Cerrar]              │
└──────────────────────────┴───────────────────────────────────────────┘
```

| Elemento de interfaz | Fuente de datos |
|---|---|
| Lista de casos abiertos | `tickets_soporte` |
| Datos del paciente | `tickets_soporte → pacientes → personas` |
| Resumen y motivo | `tickets_soporte` |
| Historial del chat | `mensajes_chatbot` |
| Estado de conversación | `conversaciones_chatbot` |
| Usuario que atiende | `tickets_soporte.asignado_a_usuario_id` |
| Actualización en vivo | `notificaciones_hub` + SignalR |

## 16. Auditoría y reportes

### 16.1 `tipos_evento_auditoria`

**Propósito:** catálogo de acciones que deben quedar registradas.

**Ejemplos:** inicio de sesión, intento fallido, crear cita, cancelar cita, actualizar odontograma, tomar ticket, cerrar ticket, cambiar rol o permiso.

### 16.2 `auditoria_eventos`

**Propósito:** conserva la bitácora funcional y de seguridad para que el administrador pueda revisar qué se hizo en el sistema.

**Campos importantes:**

| Campo | Uso |
|---|---|
| `usuario_id` | Usuario que realizó la acción |
| `sesion_id` | Sesión desde la que se hizo |
| `tipo_evento_id` | Acción registrada |
| `entidad_tipo`, `entidad_id` | Registro afectado, por ejemplo cita o ticket |
| `datos_anteriores`, `datos_nuevos` | Información antes y después del cambio |
| `direccion_ip`, `agente_usuario` | Contexto de seguridad |
| `exitoso`, `detalle_error` | Resultado de la operación |

**Reportes administrativos posibles:**

- Usuarios que iniciaron sesión hoy.
- Intentos fallidos de autenticación.
- Sesiones activas por usuario, dispositivo o IP.
- Citas creadas por origen: manual, agente, web o teléfono.
- Citas canceladas y motivo.
- Cambios realizados en pacientes, historia clínica y odontograma.
- Cambios de roles y permisos.
- Tickets creados, tomados, resueltos y cerrados por recepcionista.
- Tiempo promedio de atención de tickets.

## 17. Reglas transversales de implementación

### 17.1 Seguridad

- Las contraseñas se guardan como hash seguro.
- Los refresh tokens se almacenan como hash.
- Los access tokens JWT deben tener vida corta.
- El cierre de sesión debe revocar la sesión o el refresh token correspondiente.
- La API valida permisos antes de cada acción.
- Las credenciales, tokens y claves externas se guardan en variables de entorno, no en el repositorio.

### 17.2 Agenda

- El backend es la única fuente de verdad para disponibilidad y cruces.
- La misma validación aplica a citas creadas en React y por el chatbot.
- La API debe usar transacciones o control de concurrencia al reservar para evitar doble agendamiento.
- Una cita debe respetar horario laboral, almuerzo y citas existentes del profesional.

### 17.3 Chatbot

- El chatbot no accede directamente a Oracle.
- El chatbot usa endpoints .NET para disponibilidad, citas, cancelaciones, reprogramaciones y tickets.
- Si la conversación está `ATENDIDA_HUMANO`, el bot no debe responder automáticamente.
- La recepcionista responde desde su panel React; el backend envía el mensaje por WhatsApp o Telegram.
- Al cerrar el ticket se cierra la conversación, según la política definida por la clínica.

### 17.4 Odontograma

- El catálogo `dientes` es global.
- Cada odontograma representa un momento clínico.
- `odontograma_dientes` contiene una fila por pieza en esa versión.
- `hallazgos_dentales` agrega detalle por cara dental.
- No se crean 32 columnas ni se duplica el catálogo dental por paciente.

## 18. Resumen de responsabilidades

| Grupo funcional | Tablas principales |
|---|---|
| Catálogos generales | `tipos_documento`, `sexos`, `cargos`, `acciones_permiso`, `tipos_antecedente`, `especialidades`, `servicios` |
| Catálogos de citas | `estados_cita`, `origenes_cita` |
| Catálogos odontológicos | `tipos_denticion`, `estados_diente`, `superficies_dentales`, `tipos_hallazgo`, `estados_hallazgo` |
| Personas y acceso | `personas`, `pacientes`, `empleados`, `usuarios`, `profesionales`, `sesiones` |
| Autorización | `roles`, `permisos`, `usuario_roles`, `rol_permisos` |
| Operación clínica | `antecedentes_paciente`, `historias_clinicas`, `atenciones_clinicas`, `diagnosticos`, `procedimientos_realizados` |
| Agenda | `disponibilidades`, `citas` |
| Odontograma | `dientes`, `odontogramas`, `odontograma_dientes`, `hallazgos_dentales` |
| Alertas SignalR | `tipos_notificacion_hub`, `prioridades_notificacion`, `estados_notificacion_hub`, `notificaciones_hub` |
| WhatsApp | `tipos_notificacion_whatsapp`, `estados_notificacion_whatsapp`, `notificaciones_whatsapp` |
| Chatbot y recepción | `canales_chat`, `estados_conversacion_chatbot`, `roles_mensaje_chatbot`, `conversaciones_chatbot`, `mensajes_chatbot`, `estados_ticket_soporte`, `motivos_ticket_soporte`, `tickets_soporte` |
| Auditoría | `tipos_evento_auditoria`, `auditoria_eventos` |
