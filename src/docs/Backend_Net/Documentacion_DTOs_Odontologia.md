# Documentación de DTOs del sistema odontológico


**Autor:** Sergio Andres Serrano Rivero 

**Proyecto:** NexusOdontoBackend API  
**Fecha:** 26 de agosto de 2026  
**Plataforma:** .NET 10


## 1. Propósito

Este documento describe los DTOs creados en la capa `Application` para transportar información entre la API y los casos de uso del sistema odontológico. Los DTOs evitan exponer directamente las entidades de dominio y mantienen las relaciones mediante identificadores simples de tipo `Guid`.

El alcance comprende 27 recursos del modelo de datos: 14 catálogos y 13 entidades núcleo. Debido a que varias entidades núcleo separan sus operaciones de creación y actualización, el resultado actual es de 36 clases DTO.

Los DTOs no contienen lógica de persistencia ni dependencias de Entity Framework. Las validaciones de longitud, formato, existencia de relaciones y reglas de negocio deben implementarse posteriormente mediante validadores y casos de uso.

## 2. Convenciones aplicadas

- Los identificadores y llaves foráneas se representan con `Guid`.
- Las propiedades obligatorias de texto se inicializan con `string.Empty` para evitar valores nulos en C#.
- El sufijo `?` identifica valores opcionales que pueden ser `null`.
- Los campos Oracle `NUMBER(1)` utilizados como indicadores se representan con `bool`.
- Los campos de fecha y hora se representan con `DateTime` o `DateTime?` según su nulabilidad.
- Los DTOs se declaran con `public class`; no utilizan `sealed`.
- Los catálogos utilizan un único DTO.
- Las entidades modificables utilizan contratos separados `CreateDto` y `UpdateDto`.
- No se crearon contratos `ResponseDto` para las entidades núcleo por decisión del equipo.
- Las relaciones se expresan con IDs; no se incluyen entidades de dominio ni objetos de navegación.

## 3. Catálogos

Los catálogos están ubicados en `Application/DTOs/Catalogos`. Cada recurso dispone de un único DTO de consulta y transporte.

### 3.1 `TipoDocumentoDto`

Ubicación: `Application/DTOs/Catalogos/TipoDocumento/TipoDocumentoDto.cs`

Representa los tipos de documento admitidos por el sistema.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del tipo de documento. |
| `Codigo` | `string` | Sí | Código único, por ejemplo `CC` o `CE`. |
| `Nombre` | `string` | Sí | Nombre visible del tipo de documento. |
| `Descripcion` | `string?` | No | Explicación opcional. |
| `Activo` | `bool` | Sí | Indica si está disponible para su uso. |
| `Orden` | `int?` | No | Posición opcional de presentación. |
| `FechaCreacion` | `DateTime` | Sí | Fecha de creación del registro. |

### 3.2 `SexoDto`

Ubicación: `Application/DTOs/Catalogos/Sexo/SexoDto.cs`

Representa las opciones configuradas para sexo.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador de la opción. |
| `Codigo` | `string` | Sí | Código único de la opción. |
| `Nombre` | `string` | Sí | Nombre presentado al usuario. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Activo` | `bool` | Sí | Indica si puede seleccionarse. |
| `Orden` | `int?` | No | Orden opcional de presentación. |
| `FechaCreacion` | `DateTime` | Sí | Fecha de creación del registro. |

### 3.3 `CargoDto`

Ubicación: `Application/DTOs/Catalogos/Cargo/CargoDto.cs`

Representa los cargos que pueden asignarse a empleados.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del cargo. |
| `Codigo` | `string` | Sí | Código único del cargo. |
| `Nombre` | `string` | Sí | Nombre del cargo. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Activo` | `bool` | Sí | Indica si el cargo está habilitado. |
| `Orden` | `int?` | No | Orden opcional de presentación. |
| `FechaCreacion` | `DateTime` | Sí | Fecha de creación del registro. |

### 3.4 `AccionPermisoDto`

Ubicación: `Application/DTOs/Catalogos/AccionPermiso/AccionPermisoDto.cs`

Representa acciones configurables como ver, crear, editar o eliminar.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador de la acción. |
| `Codigo` | `string` | Sí | Código único de la acción. |
| `Nombre` | `string` | Sí | Nombre visible de la acción. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Activo` | `bool` | Sí | Indica si la acción está habilitada. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

### 3.5 `EspecialidadDto`

Ubicación: `Application/DTOs/Catalogos/Especialidad/EspecialidadDto.cs`

Representa las especialidades que pueden asociarse a profesionales.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador de la especialidad. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre de la especialidad. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Activo` | `bool` | Sí | Indica si está habilitada. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

### 3.6 `ServicioDto`

Ubicación: `Application/DTOs/Catalogos/Servicio/ServicioDto.cs`

Representa los servicios odontológicos disponibles para agendamiento.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del servicio. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre del servicio. |
| `Descripcion` | `string?` | No | Descripción extensa opcional. |
| `DuracionMinutos` | `int` | Sí | Duración estimada en minutos. |
| `Precio` | `decimal?` | No | Precio opcional del servicio. |
| `Activo` | `bool` | Sí | Indica si puede seleccionarse. |
| `Orden` | `int?` | No | Orden opcional de presentación. |
| `CreadoEn` | `DateTime` | Sí | Fecha de creación del servicio. |

### 3.7 `EstadoCitaDto`

Ubicación: `Application/DTOs/Catalogos/EstadoCita/EstadoCitaDto.cs`

Representa los estados configurables del ciclo de vida de una cita.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del estado. |
| `Codigo` | `string` | Sí | Código único del estado. |
| `Nombre` | `string` | Sí | Nombre visible. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `ColorHex` | `string?` | No | Color hexadecimal de presentación. |
| `Orden` | `int?` | No | Orden de presentación. |
| `EsFinal` | `bool` | Sí | Indica si el estado finaliza el ciclo de la cita. |
| `Activo` | `bool` | Sí | Indica si el estado está habilitado. |

### 3.8 `OrigenCitaDto`

Ubicación: `Application/DTOs/Catalogos/OrigenCita/OrigenCitaDto.cs`

Representa el canal u origen mediante el cual se creó una cita.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del origen. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre del origen. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Activo` | `bool` | Sí | Indica si está habilitado. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

### 3.9 `EstadoSesionDto`

Ubicación: `Application/DTOs/Catalogos/EstadoSesion/EstadoSesionDto.cs`

Representa estados como activa, revocada o expirada.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del estado. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre del estado. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Activo` | `bool` | Sí | Indica si el estado está habilitado. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

### 3.10 `TipoNotificacionHubDto`

Ubicación: `Application/DTOs/Catalogos/TipoNotificacionHub/TipoNotificacionHubDto.cs`

Representa los tipos de alertas internas distribuidas al panel web.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del tipo. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre visible. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Icono` | `string?` | No | Nombre o referencia opcional del icono. |
| `Activo` | `bool` | Sí | Indica si está habilitado. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

### 3.11 `PrioridadNotificacionDto`

Ubicación: `Application/DTOs/Catalogos/PrioridadNotificacion/PrioridadNotificacionDto.cs`

Representa prioridades reutilizables por notificaciones y otros módulos.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador de la prioridad. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre visible. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `ColorHex` | `string?` | No | Color hexadecimal de presentación. |
| `Nivel` | `int?` | No | Nivel numérico de prioridad. |
| `Activo` | `bool` | Sí | Indica si está habilitada. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

### 3.12 `EstadoNotificacionHubDto`

Ubicación: `Application/DTOs/Catalogos/EstadoNotificacionHub/EstadoNotificacionHubDto.cs`

Representa estados persistentes de alertas internas.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del estado. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre visible. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Activo` | `bool` | Sí | Indica si está habilitado. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

### 3.13 `TipoNotificacionWhatsappDto`

Ubicación: `Application/DTOs/Catalogos/TipoNotificacionWhatsapp/TipoNotificacionWhatsappDto.cs`

Representa los tipos de mensajes externos enviados por WhatsApp.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del tipo. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre visible. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `PlantillaPredeterminada` | `string?` | No | Nombre opcional de la plantilla asociada. |
| `Activo` | `bool` | Sí | Indica si está habilitado. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

### 3.14 `EstadoNotificacionWhatsappDto`

Ubicación: `Application/DTOs/Catalogos/EstadoNotificacionWhatsapp/EstadoNotificacionWhatsappDto.cs`

Representa los estados reportados por el proveedor de WhatsApp.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador del estado. |
| `Codigo` | `string` | Sí | Código único. |
| `Nombre` | `string` | Sí | Nombre visible. |
| `Descripcion` | `string?` | No | Descripción opcional. |
| `Activo` | `bool` | Sí | Indica si está habilitado. |
| `Orden` | `int?` | No | Orden opcional de presentación. |

## 4. Entidades núcleo

### 4.1 Persona

Ubicación: `Application/DTOs/Personas`

#### `CreatePersonaDto`

Registra los datos generales de una nueva persona.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `TipoDocumentoId` | `Guid` | Sí | Referencia al catálogo de tipos de documento. |
| `NumeroDocumento` | `string` | Sí | Número de documento. |
| `Nombres` | `string` | Sí | Nombres de la persona. |
| `Apellidos` | `string` | Sí | Apellidos de la persona. |
| `FechaNacimiento` | `DateTime?` | No | Fecha de nacimiento. |
| `SexoId` | `Guid?` | No | Referencia opcional al catálogo de sexo. |
| `Telefono` | `string?` | No | Teléfono de contacto. |
| `Email` | `string?` | No | Correo electrónico. |
| `Direccion` | `string?` | No | Dirección. |

No recibe `Id`, `Activo` ni fechas de auditoría porque son administrados por el sistema.

#### `UpdatePersonaDto`

Actualiza los datos generales de una persona existente.

Contiene los mismos campos editables de creación y agrega `Activo` de tipo `bool`. El identificador se obtiene desde la ruta del endpoint y no forma parte del cuerpo.

### 4.2 Paciente

Ubicación: `Application/DTOs/Pacientes`

#### `CreatePacienteDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `PersonaId` | `Guid` | Sí | Persona existente que adquirirá el contexto de paciente. |
| `ContactoEmergencia` | `string?` | No | Nombre del contacto de emergencia. |
| `TelefonoEmergencia` | `string?` | No | Teléfono del contacto de emergencia. |

#### `UpdatePacienteDto`

Permite modificar `ContactoEmergencia`, `TelefonoEmergencia` y `Activo`. No incluye `PersonaId` porque la vinculación entre persona y paciente se considera inmutable.

### 4.3 Empleado

Ubicación: `Application/DTOs/Empleados`

#### `CreateEmpleadoDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `PersonaId` | `Guid` | Sí | Persona existente que será registrada como empleado. |
| `CargoId` | `Guid` | Sí | Cargo asignado al empleado. |
| `FechaVinculacion` | `DateTime` | Sí | Fecha de vinculación laboral. |

#### `UpdateEmpleadoDto`

Permite cambiar `CargoId`, `FechaVinculacion` y `Activo`. No permite reasignar el registro a otra persona.

### 4.4 Usuario

Ubicación: `Application/DTOs/Usuarios`

#### `CreateUsuarioDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `PersonaId` | `Guid` | Sí | Persona existente que tendrá acceso al sistema. |
| `Password` | `string` | Sí | Contraseña recibida únicamente como entrada. |

`Password` debe ser transformado a un hash seguro antes de la persistencia. El DTO nunca recibe ni devuelve `PasswordHash`.

#### `UpdateUsuarioDto`

Contiene únicamente `Activo` de tipo `bool`. La persona vinculada no puede sustituirse y el cambio de contraseña debe manejarse mediante un caso de uso específico.

### 4.5 Profesional

Ubicación: `Application/DTOs/Profesionales`

#### `CreateProfesionalDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `EmpleadoId` | `Guid` | Sí | Empleado existente habilitado como profesional. |
| `RegistroProfesional` | `string` | Sí | Número único de registro profesional. |

#### `UpdateProfesionalDto`

Permite modificar `RegistroProfesional` y `Activo`. No incluye `EmpleadoId` porque el profesional no debe reasignarse a otro empleado.

### 4.6 Sesión

Ubicación: `Application/DTOs/Sesiones/SesionDto.cs`

#### `SesionDto`

Contrato seguro de consulta para sesiones generadas por el sistema de autenticación.

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Id` | `Guid` | Sí | Identificador de la sesión. |
| `UsuarioId` | `Guid` | Sí | Usuario propietario de la sesión. |
| `Dispositivo` | `string?` | No | Descripción opcional del dispositivo. |
| `DireccionIp` | `string?` | No | Dirección IP asociada. |
| `AgenteUsuario` | `string?` | No | Agente de usuario del cliente. |
| `FechaCreacion` | `DateTime` | Sí | Momento de creación. |
| `FechaExpiracion` | `DateTime` | Sí | Momento de expiración. |
| `FechaUltimoUso` | `DateTime?` | No | Último uso registrado. |
| `RevocadaEn` | `DateTime?` | No | Momento de revocación, cuando aplica. |
| `EstadoSesionId` | `Guid` | Sí | Estado actual de la sesión. |

Por seguridad, no expone `RefreshTokenHash` ni `TokenFamilia`. Tampoco existen DTOs de creación o actualización porque el ciclo de vida de la sesión es interno.

### 4.7 Rol

Ubicación: `Application/DTOs/Roles`

#### `CreateRolDto`

Recibe `Codigo` y `Nombre` como cadenas obligatorias, además de `Descripcion` opcional.

#### `UpdateRolDto`

Permite modificar `Codigo`, `Nombre`, `Descripcion` y `Activo`. Los permisos del rol se administran mediante `RolPermisoDto`, no dentro de este contrato.

### 4.8 Permiso

Ubicación: `Application/DTOs/Permisos`

#### `CreatePermisoDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `Modulo` | `string` | Sí | Módulo protegido por el permiso. |
| `AccionPermisoId` | `Guid` | Sí | Acción configurable asociada. |
| `Descripcion` | `string?` | No | Descripción opcional. |

#### `UpdatePermisoDto`

Permite actualizar los mismos tres campos. No contiene `Activo` porque la tabla `permisos` no define esa columna.

### 4.9 Usuario y rol

Ubicación: `Application/DTOs/UsuarioRoles/UsuarioRolDto.cs`

#### `UsuarioRolDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `UsuarioId` | `Guid` | Sí | Usuario al que se asigna el rol. |
| `RolId` | `Guid` | Sí | Rol asignado. |

La fecha `AsignadoEn` es generada por el servidor y no se recibe desde la API.

### 4.10 Rol y permiso

Ubicación: `Application/DTOs/RolPermisos/RolPermisoDto.cs`

#### `RolPermisoDto`

Contiene `RolId` y `PermisoId`, ambos `Guid` obligatorios. Los dos valores representan la clave compuesta de la relación.

### 4.11 Profesional y especialidad

Ubicación: `Application/DTOs/ProfesionalEspecialidades/ProfesionalEspecialidadDto.cs`

#### `ProfesionalEspecialidadDto`

Contiene `ProfesionalId` y `EspecialidadId`, ambos `Guid` obligatorios. Los dos valores representan la clave compuesta de la relación.

### 4.12 Disponibilidad

Ubicación: `Application/DTOs/Disponibilidades`

#### `CreateDisponibilidadDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `ProfesionalId` | `Guid` | Sí | Profesional propietario del horario. |
| `DiaInicio` | `int` | Sí | Día inicial; debe validarse entre 1 y 7. |
| `DiaFin` | `int` | Sí | Día final; debe validarse entre 1 y 7. |
| `HoraInicio` | `string` | Sí | Inicio de jornada en formato `HH:mm`. |
| `HoraAlmuerzo` | `string` | Sí | Inicio del descanso en formato `HH:mm`. |
| `HoraRetorno` | `string` | Sí | Fin del descanso en formato `HH:mm`. |
| `HoraFin` | `string` | Sí | Fin de jornada en formato `HH:mm`. |

#### `UpdateDisponibilidadDto`

Permite actualizar los días, las cuatro horas y `Activo`. No incluye `ProfesionalId` para impedir la reasignación del horario.

Los casos de uso deben validar el formato de las horas, el rango de días y la coherencia cronológica de la jornada.

### 4.13 Cita

Ubicación: `Application/DTOs/Citas`

#### `CreateCitaDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `PacienteId` | `Guid` | Sí | Paciente para quien se agenda la cita. |
| `ProfesionalId` | `Guid` | Sí | Profesional asignado. |
| `ServicioId` | `Guid` | Sí | Servicio solicitado. |
| `FechaHoraInicio` | `DateTime` | Sí | Inicio programado. |
| `FechaHoraFin` | `DateTime` | Sí | Fin programado. |
| `EstadoCitaId` | `Guid` | Sí | Estado inicial de la cita. |
| `OrigenCitaId` | `Guid` | Sí | Origen de creación. |
| `MotivoConsulta` | `string?` | No | Motivo indicado por el paciente. |
| `Observaciones` | `string?` | No | Observaciones adicionales. |

No incluye `AtencionClinicaDto`. Tampoco recibe `CreadaPorUsuarioId` ni fechas de auditoría; estos valores deben obtenerse del usuario autenticado y del servidor.

#### `UpdateCitaDto`

| Propiedad | Tipo | Obligatoria | Descripción |
|---|---|---:|---|
| `ProfesionalId` | `Guid` | Sí | Profesional asignado. |
| `ServicioId` | `Guid` | Sí | Servicio programado. |
| `FechaHoraInicio` | `DateTime` | Sí | Nuevo inicio programado. |
| `FechaHoraFin` | `DateTime` | Sí | Nuevo fin programado. |
| `EstadoCitaId` | `Guid` | Sí | Estado de la cita. |
| `OrigenCitaId` | `Guid` | Sí | Origen registrado. |
| `MotivoConsulta` | `string?` | No | Motivo de consulta. |
| `Observaciones` | `string?` | No | Observaciones adicionales. |
| `MotivoCancelacion` | `string?` | No | Motivo requerido cuando la cita se cancela. |

`PacienteId` no forma parte de la actualización para impedir que una cita sea reasignada a otro paciente. Las reglas de disponibilidad, solapamiento, duración, transiciones de estado y cancelación pertenecen a los casos de uso.

## 5. Resumen del inventario documentado

| Grupo | Recursos | Clases DTO |
|---|---:|---:|
| Catálogos | 14 | 14 |
| Persona, paciente, empleado, usuario y profesional | 5 | 10 |
| Sesión | 1 | 1 |
| Rol y permiso | 2 | 4 |
| Relaciones de asignación | 3 | 3 |
| Disponibilidad y cita | 2 | 4 |
| **Total** | **27** | **36** |
