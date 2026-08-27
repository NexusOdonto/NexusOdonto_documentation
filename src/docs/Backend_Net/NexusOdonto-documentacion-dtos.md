# NexusOdontoBackend_Api — DTOs de Catálogos, Clínico y Odontograma

**Tarjeta:** DTOs (Request/Response) de 27 tablas del esquema clínico
**Rama:** `feature/dtos-clinical-odontogram` → PR **#41** (mergeado)
**Commit:** `b25293e` · 26 de agosto de 2026
**Alcance:** 55 archivos, 630 líneas

---

## Resumen

| Bloque | Carpeta | Archivos |
|---|---|---|
| Catálogos | `Application/DTOs/Catalogs/` | 36 |
| Clínico | `Application/DTOs/Clinical/` | 7 |
| Odontograma | `Application/DTOs/Odontogram/` | 6 |
| Notificaciones | `Application/DTOs/Notifications/` | 2 |
| Chatbot | `Application/DTOs/Chatbot/` | 2 |
| Soporte | `Application/DTOs/Support/` | 2 |
| | **Total** | **55** |

`dotnet build`: 0 errores, 0 advertencias.

---

## Convenciones aplicadas

**Un tipo público por archivo**, con el nombre del archivo igual al de la clase.
Verificado sobre los 55.

**El namespace es la ruta de carpetas**, nunca el nombre del archivo:

```
Application/DTOs/Catalogs/ToothStatus/  →  namespace Application.DTOs.Catalogs.ToothStatus
```

Los tres archivos de cada entidad comparten namespace. No hay `using` entre DTOs
del mismo bloque.

**Una carpeta por entidad**, agrupadas por subdominio. Con 55 archivos, una
carpeta plana por bloque dejaba 36 archivos en `Catalogs/` y separaba
alfabéticamente el `Create` del `Response` de la misma entidad.

**Nomenclatura:**

| Patrón | Uso |
|---|---|
| `CreateXRequestDto` | Cuerpo del `POST` |
| `UpdateXRequestDto` | Cuerpo del `PUT`/`PATCH` |
| `XDto` | Salida de catálogos |

**Nulabilidad alineada al esquema.** Toda propiedad cuya columna admite `NULL`
se declaró anulable; las obligatorias van no anulables con `= string.Empty`.

**camelCase automático.** `AddControllers()` usa `JsonSerializerDefaults.Web`,
que aplica `JsonNamingPolicy.CamelCase` en ambos sentidos. No se usaron
atributos `[JsonPropertyName]`: serían redundantes y habría que mantenerlos
sincronizados a mano.

---

## Reglas de inclusión de campos

Tres criterios decidieron qué entra en cada DTO. Aplican al 90% de los casos.

### 1. Los campos con `DEFAULT` no entran en el Create

`IsActive` (`activo number(1) DEFAULT 1`) no está en ningún `CreateXRequestDto`:
todo registro nace activo. Sí está en los `Update`, porque desactivar **es** una
edición.

Lo mismo con los `estado_x_id`: la notificación nace en su estado inicial, el
ticket en el suyo. Aceptarlos por body permitiría crear un ticket ya cerrado.

### 2. La identidad del actor sale del token, nunca del body

Quedaron fuera de todo DTO:

| Columna | Entidad |
|---|---|
| `registrado_por_usuario_id` | `PatientAntecedent` |
| `emisor_usuario_id` | `HubNotification` |
| `resuelto_por_usuario_id` | `SupportTicket` |

Si se aceptaran por JSON, cualquiera con acceso al endpoint podría firmar un
antecedente médico a nombre de otro profesional. El servicio los obtiene del
usuario autenticado.

Por la misma razón quedaron fuera los timestamps con `DEFAULT SYSTIMESTAMP`: si
el cliente manda la fecha, puede antedatar registros clínicos.

### 3. La FK del padre va en el Create, nunca en el Update

`CreateDiagnosisRequestDto` lleva `ClinicalAttentionId`;
`UpdateDentalFindingRequestDto` no lleva `OdontogramToothId`.

Un update que incluyera la FK del padre permitiría mover un diagnóstico a otra
atención clínica, o un hallazgo a otro diente, con un simple `PUT`.

---

## Catálogos — 36 archivos

Doce entidades × 3 DTOs (`Dto`, `Create`, `Update`).

```
Catalogs/
├── AntecedentType/            ├── FindingStatus/
├── AuditEventType/            ├── FindingType/
├── ChatChannel/               ├── SupportTicketReason/
├── ChatbotConversationStatus/ ├── SupportTicketStatus/
├── ChatbotMessageRole/        ├── ToothStatus/
├── DentalSurface/             └── DentitionType/
```

**Base común** (heredada de `CatalogEntity`): `Code`, `Name`, `Description?`,
`SortOrder?`, más `IsActive` y `Id` en el `Dto`.

**Solo 5 de los 12 son uniformes.** La descripción de la tarjeta decía que a los
catálogos les bastaba con *(id, código, nombre, descripción, activo, orden)*,
pero siete tienen columnas propias:

| Catálogo | Campos adicionales | Para qué |
|---|---|---|
| `ToothStatus` | `ColorHex`, `VisualCode` | Color y símbolo del diente en el odontograma |
| `FindingType` | `ColorHex`, `VisualSymbol`, `RequiresSurface` | Símbolo a dibujar; si el hallazgo exige superficie |
| `FindingStatus` | `ColorHex` | Color del estado |
| `DentalSurface` | `AppliesToAnterior`, `AppliesToPosterior` | Un incisivo no tiene las mismas caras que un molar |
| `ChatbotConversationStatus` | `IsFinal` | Si el estado cierra la conversación |
| `SupportTicketStatus` | `IsFinal`, `AllowsAssignment` | Si cierra el ticket; si admite asignar responsable |
| `AuditEventType` | `Category`, `RiskLevel` | Clasificar y priorizar eventos |

Recortarlos a los seis campos genéricos habría dejado el odontograma sin forma
de renderizarse: el frontend tendría que hardcodear la paleta, que es
exactamente lo que se evita guardándola en la base.

`AppliesToAnterior` y `AppliesToPosterior` sí entran en el `Create` pese a tener
`DEFAULT 1`. No son banderas de ciclo de vida como `IsActive` — son datos
descriptivos que el usuario define al crear la superficie.

---

## Clínico — 7 archivos

| Entidad | Create | Update | Nota |
|---|---|---|---|
| `PatientAntecedent` | ✅ | ✅ | |
| `ClinicalAttention` | ✅ | ✅ | `AppointmentId` solo en Create: la columna es `UNIQUE` |
| `Diagnosis` | ✅ | ❌ | |
| `ProcedurePerformed` | ✅ | ❌ | |
| `ClinicalHistory` | ❌ | ✅ | |

**`Diagnosis` y `ProcedurePerformed` no llevan Update.** Son registros de hechos
clínicos. Si un diagnóstico está mal, se anula y se crea otro — no se reescribe
la historia. Es un requisito de trazabilidad, no una omisión.

**`ClinicalHistory` no lleva Create.** La abre `PacienteService` dentro de la
transacción de alta del paciente. El Update sí existe: editar observaciones y
cerrar la historia son operaciones válidas.

**`Diagnosis.Type` va como `string`, no `Guid`.** Es `varchar2(30)` con default,
no una FK a catálogo. Queda anulable para que el servicio aplique el valor por
defecto cuando el cliente lo omite.

---

## Odontograma — 6 archivos

| Entidad | Create | Update |
|---|---|---|
| `Odontogram` | ✅ | ✅ |
| `OdontogramTooth` | ✅ | ✅ |
| `DentalFinding` | ✅ | ✅ |

**`Tooth` no tiene DTOs de escritura.** Es el catálogo estático FDI: los 32
dientes no cambian nunca. Además su PK es `varchar2(2)` (`"11"`, `"48"`), no un
`Guid` — por eso `OdontogramTooth.ToothCode` es `string`.

**El Update de `Odontogram` solo lleva `Notes`.** No se reasigna la historia
clínica, la atención ni el profesional que lo levantó: eso convertiría un
registro clínico firmado en otro distinto.

**`DentalSurfaceId` es anulable** en `DentalFinding`: hay hallazgos que aplican
al diente completo, no a una cara.

---

## Notificaciones — 2 archivos

Solo Create. Una notificación enviada no se edita.

**`CreateHubNotificationRequestDto`** — `RecipientUserId` y `RecipientRoleId`
son ambos anulables: se notifica a una persona o a un rol entero.
`EntityType` + `EntityId` son una referencia polimórfica opcional.

**`CreateWhatsAppNotificationRequestDto`** — de las 18 columnas de la tabla,
solo 8 entran. El resto es telemetría del envío: `Provider`,
`ProviderMessageId`, los cinco timestamps del ciclo de vida,
`ProviderResponse` y `ErrorDetail`. Los llena la integración, no el cliente.

`ScheduledFor` sí entra: es `NOT NULL` **sin default**, así que el cliente debe
indicar cuándo se programa el envío.

---

## Chatbot — 2 archivos

Solo Create. Un mensaje enviado no se edita, y la conversación avanza por
eventos del sistema.

**`RagConfidence` es `decimal?`**, nunca `double`. La columna es `number(5,4)`;
un binario de punto flotante pierde precisión en un rango 0–1.

`ConversationStatusId` no entra: la conversación nace en el estado inicial.

---

## Soporte — 2 archivos

**`CreateSupportTicketRequestDto`** — incluye `ChatbotSummary` y
`RagConfidence`: los genera el bot al abrir el ticket, y son una foto del
momento de creación.

**`UpdateSupportTicketRequestDto`** — incluye `TicketStatusId`,
`AssignedToUserId` y `Resolution`, que no están en el Create. Asignar, avanzar
de estado y resolver son ediciones; abrir el ticket no las incluye.

Los cinco timestamps del ciclo de vida (`CreatedAt`, `AssignedAt`,
`AttendedAt`, `ResolvedAt`, `ClosedAt`) no aparecen en ningún DTO.

---

## Alineación con el dominio

Durante la tarjeta el equipo migró `Domain/Entities/` a inglés y lo reorganizó
por subdominios. Los DTOs se ajustaron para que **cada propiedad coincida
exactamente con la de su entidad**, de modo que Mapster mapee por convención sin
un solo `.Map()` manual.

Nombres corregidos tras contrastar con `Domain/Entities/`:

| Primera versión | Entidad real |
|---|---|
| `MedicalHistoryType` | `AntecedentType` |
| `ToothSurface` | `DentalSurface` |
| `PatientMedicalHistory` | `PatientAntecedent` |
| `ClinicalEncounter` | `ClinicalAttention` |
| `ClinicalRecord` | `ClinicalHistory` |
| `PerformedProcedure` | `ProcedurePerformed` |
| `WhatsappNotification` | `WhatsAppNotification` |

Propiedades:

| Primera versión | Entidad real |
|---|---|
| `HexColor` | `ColorHex` |
| `VisualSortOrder` | `SortOrder` (heredado de `CatalogEntity`) |
| `ChargedAmount` | `AmountCharged` |
| `ReceiverUserId` / `ReceiverRoleId` | `RecipientUserId` / `RecipientRoleId` |
| `Notes` (en `OdontogramTooth` y `DentalFinding`) | `Note` |

Las FK arrastraron el cambio: `AntecedentTypeId`, `ClinicalAttentionId`,
`ClinicalHistoryId`, `DentalSurfaceId`.

---

## Fuera de alcance

**Los DTOs de Response.** Los asumió otra persona del equipo. Los doce `XDto`
de catálogos sí se incluyeron porque ya estaban escritos antes de esa
repartición — conviene confirmar que no se dupliquen.

**`Tooth`, `AuditEvent` y los Create de `ClinicalHistory`.** El primero es
catálogo estático; el segundo lo escribe el sistema (exponer un `POST` de
auditoría invalidaría el rastro); el tercero lo crea el servicio de pacientes.

---

## Pendientes para el equipo

**1. `odontologia.sql` quedó obsoleto.** Sigue en español y con
`number GENERATED AS IDENTITY`, mientras el dominio ya es inglés con `Guid`.
Cualquiera que lo use como referencia trabajará contra un esquema inexistente.
Conviene regenerarlo o marcarlo como obsoleto.

**2. Dos convenciones de DTO conviviendo.** El PR #38 introdujo un bloque en
español con el patrón `CreateXDto` (`Catalogos/`, `Citas/`, `Personas/`,
`Usuarios/`, `Empleados/`, `Roles/`, `Permisos/`, `Sesiones/`). Los de esta
tarjeta están en inglés con `CreateXRequestDto`.

Hay solapamiento real: `Catalogos/ServicioDto` y `Catalogos/TipoDocumentoDto`
cubren catálogos que también existen en inglés en `Domain/Entities/Catalogs/`.
Conviene unificar antes de que se construyan controladores encima.

**3. Namespaces incorrectos en dos archivos ajenos.** `CreatePatientRequestDto`
está en `DTOs/Patient/` pero declara `namespace Application.DTOs`;
`CreateServiceRequestDto` igual. No pertenecen a esta tarjeta, pero van a
confundir a quien los importe.

**4. Coordinación inmediata: Mapster y los Value Objects entran el mismo día.**

La configuración de Mapster y la introducción de Value Objects en las entidades
están planificadas para el 27 de agosto. Ambas tocan el mismo punto: la
conversión entre los DTOs de esta tarjeta y el dominio.

Estos DTOs usan tipos primitivos (`string ProfessionalLicense`,
`decimal? Price`). Cuando las entidades adopten Value Objects, esas propiedades
dejarán de ser primitivas, y **Mapster no mapeará por convención**: no lanza
error, simplemente deja la propiedad sin asignar.

Quien configure Mapster debería registrar un convertidor por Value Object desde
el inicio, en lugar de parchear mapeo por mapeo después:

```csharp
config.NewConfig<string, ProfessionalLicense>()
      .MapWith(src => ProfessionalLicense.Create(src));
```

Declarado una vez, aplica a todos los mapeos que usen ese tipo. Con 27
entidades adoptando Value Objects, la diferencia entre decidirlo hoy y
descubrirlo en dos días es considerable.
