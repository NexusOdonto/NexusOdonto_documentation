# Contrato REST y Swagger — Sistema Odontológico

Este documento establece el contrato de la API REST del sistema odontológico a partir de las capacidades funcionales y las relaciones definidas en su modelo de datos. Su objetivo es normalizar la comunicación entre las aplicaciones cliente y el backend, describiendo los recursos disponibles, las operaciones admitidas, las reglas de validación y las respuestas esperadas.

La API se organizará por módulos funcionales, entre ellos seguridad, pacientes, profesionales, agenda, atención clínica, odontograma, notificaciones y agente conversacional. Cada solicitud será procesada por un caso de uso de la capa Application, donde se aplicarán las reglas del negocio antes de utilizar los puertos de persistencia implementados en Infrastructure. De esta forma, el contrato HTTP permanece independiente de Oracle y de los detalles físicos de almacenamiento.

La especificación se documentará con OpenAPI 3.0 y utilizará el prefijo `/api/v1` para permitir la evolución controlada de versiones. Los cuerpos de solicitud y respuesta se representarán en JSON con propiedades en `camelCase`. Los recursos protegidos requerirán autenticación JWT Bearer y autorización basada en roles y permisos; solamente las operaciones expresamente definidas como públicas podrán ejecutarse sin una sesión autenticada.

### Convenciones y validaciones comunes

- Los identificadores `NUMBER` se representan como enteros JSON positivos.
- Las fechas usan `YYYY-MM-DD` y las marcas de tiempo ISO 8601 con zona horaria.
- Los listados aceptan `page`, `pageSize`, `search`, `activo` y filtros propios.
- `page` debe ser mayor que cero y `pageSize` debe estar entre 1 y 100.
- Los textos se recortan, validan por longitud y no aceptan contenido vacío.
- La desactivación lógica se prefiere sobre el borrado cuando existen referencias.
- Los identificadores del usuario responsable se obtienen del JWT y no del cuerpo.
- Las transiciones de estado deben validarse en el dominio.
- Las respuestas no deben revelar excepciones, SQL, cadenas de conexión ni hashes.

### Política de identificadores

Cada recurso se identifica en las rutas mediante el nombre semántico de su clave primaria:

- `personaId` identifica exclusivamente un registro de `personas`.
- `pacienteId` identifica un registro de `pacientes`. En el modelo actual su valor coincide con `persona_id` porque utiliza una clave primaria compartida.
- `empleadoId` identifica un registro de `empleados`. También corresponde internamente a su `persona_id`.
- `profesionalId` identifica la PK propia de `profesionales`; no debe confundirse con `empleadoId`.
- Los demás recursos utilizan nombres explícitos como `citaId`, `odontogramaId`, `atencionId` y `hallazgoId`.

Las relaciones incluidas en solicitudes y respuestas deben conservar la misma nomenclatura. Por ejemplo, una cita recibe `pacienteId`, `profesionalId` y `servicioId`; un odontograma anidado bajo un paciente usa `pacienteId`. Aunque dos valores coincidan físicamente en Oracle, el contrato no debe intercambiar sus significados.

Respuesta paginada:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0,
  "totalPages": 0
}
```

Formato uniforme de error:

```json
{
  "type": "https://httpstatuses.com/409",
  "title": "Conflict",
  "status": 409,
  "code": "Appointment.ScheduleConflict",
  "detail": "El profesional ya tiene una cita en ese horario.",
  "errors": {}
}
```

| Código | Cuándo se utiliza |
|---:|---|
| 200 | Consulta o actualización exitosa |
| 201 | Recurso creado; debe incluir su identificador |
| 204 | Acción exitosa sin cuerpo |
| 400 | JSON mal formado, tipos/formato inválidos o parámetros que no se pueden interpretar |
| 401 | Token ausente, inválido, revocado o vencido |
| 403 | Usuario autenticado sin el permiso requerido |
| 404 | Recurso o relación solicitada que no existe |
| 409 | Duplicado, solapamiento, dependencia o transición incompatible |
| 422 | Recurso existente pero no utilizable por una regla de negocio; el JSON es válido |
| 429 | Demasiadas solicitudes, especialmente en login y agente |
| 500 | Error interno controlado y registrado, sin detalles sensibles |

## Inventario del modelo: 57 tablas documentadas

| N.º | Tabla | Grupo |
|---:|---|---|
| 1 | `tipos_documento` | Catálogos |
| 2 | `sexos` | Catálogos |
| 3 | `cargos` | Catálogos |
| 4 | `especialidades` | Catálogos |
| 5 | `servicios` | Catálogos |
| 6 | `personas` | Personas y acceso |
| 7 | `pacientes` | Personas y acceso |
| 8 | `empleados` | Personas y acceso |
| 9 | `usuarios` | Personas y acceso |
| 10 | `profesionales` | Personas y acceso |
| 11 | `roles` | Seguridad |
| 12 | `permisos` | Seguridad |
| 13 | `usuario_roles` | Seguridad |
| 14 | `rol_permisos` | Seguridad |
| 15 | `antecedentes_paciente` | Antecedentes |
| 16 | `profesional_especialidades` | Especialidades |
| 17 | `disponibilidades` | Agenda |
| 18 | `citas` | Agenda |
| 19 | `historias_clinicas` | Historia clínica |
| 20 | `atenciones_clinicas` | Historia clínica |
| 21 | `diagnosticos` | Historia clínica |
| 22 | `procedimientos_realizados` | Historia clínica |
| 23 | `dientes` | Odontograma |
| 24 | `odontogramas` | Odontograma |
| 25 | `odontograma_dientes` | Odontograma |
| 26 | `hallazgos_dentales` | Odontograma |
| 27 | `notificaciones` | Mensajería |
| 28 | `conversaciones_agente` | Agente |
| 29 | `mensajes_agente` | Agente |
| 30 | `acciones_permiso` | Seguridad |
| 31 | `tipos_antecedente` | Catálogos clínicos |
| 32 | `estados_cita` | Catálogos de agenda |
| 33 | `origenes_cita` | Catálogos de agenda |
| 34 | `tipos_denticion` | Catálogos odontológicos |
| 35 | `estados_diente` | Catálogos odontológicos |
| 36 | `superficies_dentales` | Catálogos odontológicos |
| 37 | `tipos_hallazgo` | Catálogos odontológicos |
| 38 | `estados_hallazgo` | Catálogos odontológicos |
| 39 | `estados_sesion` | Seguridad |
| 40 | `tipos_notificacion_hub` | Mensajería |
| 41 | `prioridades_notificacion` | Mensajería |
| 42 | `estados_notificacion_hub` | Mensajería |
| 43 | `tipos_notificacion_whatsapp` | Mensajería |
| 44 | `estados_notificacion_whatsapp` | Mensajería |
| 45 | `canales_chat` | Agente y chatbot |
| 46 | `estados_conversacion_chatbot` | Agente y chatbot |
| 47 | `roles_mensaje_chatbot` | Agente y chatbot |
| 48 | `estados_ticket_soporte` | Soporte |
| 49 | `motivos_ticket_soporte` | Soporte |
| 50 | `tipos_evento_auditoria` | Auditoría |
| 51 | `sesiones` | Seguridad |
| 52 | `notificaciones_hub` | Mensajería |
| 53 | `notificaciones_whatsapp` | Mensajería |
| 54 | `conversaciones_chatbot` | Agente y chatbot |
| 55 | `mensajes_chatbot` | Agente y chatbot |
| 56 | `tickets_soporte` | Soporte |
| 57 | `auditoria_eventos` | Auditoría |

## Política de seguridad de la API

La API aplica una política de protección por defecto: todo endpoint requiere autenticación y autorización, salvo que su contrato lo marque expresamente como público. La ausencia de una anotación de acceso público implica que la solicitud debe presentar un JWT válido y el permiso indicado en la tabla del endpoint.

Las únicas operaciones públicas son:

| Método | Ruta | Motivo |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Obtener una sesión autenticada |
| `POST` | `/api/v1/auth/refresh` | Renovar una sesión mediante un refresh token válido |

Son operaciones protegidas `POST /api/v1/auth/logout`, `GET /api/v1/auth/me` y todos los endpoints relacionados con pacientes, empleados, profesionales, usuarios, roles, permisos, agenda, citas, historia clínica, odontograma, notificaciones y demás recursos operativos.

La autorización utiliza permisos con el formato `MODULO.ACCION`. Por ejemplo:

- `GET /api/v1/citas` requiere `CITAS.VER`.
- `POST /api/v1/citas` requiere `CITAS.CREAR`.
- `POST /api/v1/citas/{citaId}/cancelar` requiere `CITAS.CANCELAR`.
- `GET /api/v1/pacientes/{pacienteId}/historia-clinica` requiere `HISTORIA_CLINICA.VER`.

Los endpoints del agente conversacional tampoco son públicos. Si los consume un proceso o servicio externo, deberá autenticarse mediante una API key rotativa o un JWT de servicio de corta duración. Esa identidad técnica recibirá únicamente permisos del módulo `AGENTE` y los permisos operativos mínimos que necesite, sin reutilizar credenciales de usuarios humanos.

La interfaz de Swagger/OpenAPI estará protegida en ambientes de integración, pruebas y producción. Solamente podrá quedar pública en desarrollo local. Independientemente de la visibilidad de la interfaz, Swagger no omite la autenticación exigida por los endpoints y debe declarar el esquema Bearer y, cuando corresponda, el esquema de credenciales de servicio.

## Autenticación transversal

La autenticación utiliza principalmente `usuarios`, pero consulta `personas`, `usuario_roles`, `roles`, `rol_permisos` y `permisos`.

| Método | Ruta | Resultado | Permiso requerido |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Access token, refresh token y perfil | `PÚBLICO` |
| `POST` | `/api/v1/auth/refresh` | Renueva tokens válidos | `PÚBLICO` |
| `POST` | `/api/v1/auth/logout` | Invalida la sesión | `AUTH.CERRAR_SESION` |
| `GET` | `/api/v1/auth/me` | Persona, roles y permisos efectivos | `AUTH.VER_PERFIL` |

Validaciones específicas: credenciales obligatorias (`400`), credenciales incorrectas o cuenta inactiva (`401`), exceso de intentos (`429`) y refresh token inválido o revocado (`401`).

## 1. Tipos de documento — `tipos_documento`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/tipos-documento` | Listar y filtrar | `CATALOGOS.VER` |
| `GET` | `/api/v1/tipos-documento/{tipoDocumentoId}` | Consultar detalle | `CATALOGOS.VER` |
| `POST` | `/api/v1/tipos-documento` | Crear | `CATALOGOS.CREAR` |
| `PUT` | `/api/v1/tipos-documento/{tipoDocumentoId}` | Actualizar | `CATALOGOS.EDITAR` |
| `PATCH` | `/api/v1/tipos-documento/{tipoDocumentoId}/estado` | Activar o desactivar | `CATALOGOS.CAMBIAR_ESTADO` |

Validaciones: `codigo` y `nombre` obligatorios (`422`); código duplicado sin distinguir mayúsculas (`409`); ID inexistente (`404`); desactivación permitida, conservando personas históricas; administración sin permiso (`403`).

## 2. Sexos — `sexos`

Este catálogo se utiliza para consultar los valores disponibles al registrar o actualizar una persona. Sus registros se administran mediante los seeders de la aplicación, por lo que la API lo expone únicamente para lectura.

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/sexos` | Consultar los valores disponibles | `CATALOGOS.VER` |
| `GET` | `/api/v1/sexos/{sexoId}` | Consultar un valor específico | `CATALOGOS.VER` |

Validaciones: identificador existente (`404`); parámetros de consulta válidos (`400`); valor inactivo no retornado en los listados destinados a nuevos registros; acceso autenticado cuando la política de seguridad lo requiera (`401` y `403`). La API no permite crear, actualizar ni eliminar estos valores.

## 3. Cargos — `cargos`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/cargos` | Listar cargos | `CATALOGOS.VER` |
| `GET` | `/api/v1/cargos/{cargoId}` | Consultar cargo | `CATALOGOS.VER` |
| `POST` | `/api/v1/cargos` | Crear cargo | `CATALOGOS.CREAR` |
| `PUT` | `/api/v1/cargos/{cargoId}` | Actualizar cargo | `CATALOGOS.EDITAR` |
| `PATCH` | `/api/v1/cargos/{cargoId}/estado` | Cambiar estado | `CATALOGOS.CAMBIAR_ESTADO` |

Validaciones: nombre obligatorio y único (`409` si se repite); longitud excedida (`422`); ID inexistente (`404`); cargo inactivo no asignable a empleados nuevos (`422`).

## 4. Especialidades — `especialidades`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/especialidades` | Listar especialidades | `CATALOGOS.VER` |
| `GET` | `/api/v1/especialidades/{especialidadId}` | Consultar detalle | `CATALOGOS.VER` |
| `POST` | `/api/v1/especialidades` | Crear | `CATALOGOS.CREAR` |
| `PUT` | `/api/v1/especialidades/{especialidadId}` | Actualizar | `CATALOGOS.EDITAR` |
| `PATCH` | `/api/v1/especialidades/{especialidadId}/estado` | Cambiar estado | `CATALOGOS.CAMBIAR_ESTADO` |

Validaciones: nombre obligatorio y único (`409`); especialidad inexistente (`404`); especialidad inactiva no asignable a profesionales (`422`); acceso administrativo requerido (`403`).

## 5. Servicios — `servicios`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/servicios` | Listar servicios | `CATALOGOS.VER` |
| `GET` | `/api/v1/servicios/{servicioId}` | Consultar servicio | `CATALOGOS.VER` |
| `POST` | `/api/v1/servicios` | Crear servicio | `CATALOGOS.CREAR` |
| `PUT` | `/api/v1/servicios/{servicioId}` | Actualizar | `CATALOGOS.EDITAR` |
| `PATCH` | `/api/v1/servicios/{servicioId}/estado` | Cambiar estado | `CATALOGOS.CAMBIAR_ESTADO` |

Validaciones: nombre único (`409`); duración mayor que cero y precio no negativo (`422`); ID inexistente (`404`); servicio inactivo no disponible para nuevas citas (`422`).

```json
{
  "nombre": "Valoración odontológica",
  "descripcion": "Consulta inicial",
  "duracionMinutos": 45,
  "precio": 80000,
  "activo": true
}
```

## 6. Personas — `personas`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/personas` | Buscar por documento, nombre o correo | `PERSONAS.VER` |
| `GET` | `/api/v1/personas/{personaId}` | Consultar persona | `PERSONAS.VER` |
| `POST` | `/api/v1/personas` | Registrar persona | `PERSONAS.CREAR` |
| `PUT` | `/api/v1/personas/{personaId}` | Actualizar datos | `PERSONAS.EDITAR` |
| `PATCH` | `/api/v1/personas/{personaId}/estado` | Cambiar estado | `PERSONAS.CAMBIAR_ESTADO` |

Validaciones: tipo documental inexistente (`404`); tipo documental existente pero inactivo (`422`); combinación tipo/número duplicada (`409`); nombres, apellidos y documento obligatorios (`422`); fecha de nacimiento futura (`422`); correo o teléfono con formato inválido (`400`).

## 7. Pacientes — `pacientes`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/pacientes` | Listar pacientes | `PACIENTES.VER` |
| `GET` | `/api/v1/pacientes/{pacienteId}` | Consultar perfil completo | `PACIENTES.VER` |
| `POST` | `/api/v1/pacientes` | Crear o vincular paciente | `PACIENTES.CREAR` |
| `PUT` | `/api/v1/pacientes/{pacienteId}` | Actualizar datos de paciente | `PACIENTES.EDITAR` |
| `PATCH` | `/api/v1/pacientes/{pacienteId}/estado` | Cambiar estado | `PACIENTES.CAMBIAR_ESTADO` |

Validaciones: persona inexistente (`404`); persona ya vinculada como paciente (`409`); teléfono de emergencia sin contacto o viceversa (`422`); paciente inactivo no puede recibir citas nuevas (`422`). La creación puede abrir su historia clínica en una transacción.

## 8. Empleados — `empleados`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/empleados` | Listar por cargo o estado | `EMPLEADOS.VER` |
| `GET` | `/api/v1/empleados/{empleadoId}` | Consultar perfil laboral | `EMPLEADOS.VER` |
| `POST` | `/api/v1/empleados` | Vincular persona como empleado | `EMPLEADOS.CREAR` |
| `PUT` | `/api/v1/empleados/{empleadoId}` | Actualizar cargo y vinculación | `EMPLEADOS.EDITAR` |
| `PATCH` | `/api/v1/empleados/{empleadoId}/estado` | Cambiar estado laboral | `EMPLEADOS.CAMBIAR_ESTADO` |

Validaciones: persona y cargo existentes (`404`); cargo inactivo (`422`); empleado duplicado (`409`); fecha de vinculación futura no autorizada (`422`); desactivar un profesional con citas futuras requiere resolución previa (`409`).

## 9. Usuarios — `usuarios`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/usuarios` | Listar cuentas | `USUARIOS.VER` |
| `GET` | `/api/v1/usuarios/{usuarioId}` | Consultar cuenta y roles | `USUARIOS.VER` |
| `POST` | `/api/v1/usuarios` | Crear credenciales | `USUARIOS.CREAR` |
| `PATCH` | `/api/v1/usuarios/{usuarioId}/estado` | Habilitar o bloquear | `USUARIOS.CAMBIAR_ESTADO` |
| `POST` | `/api/v1/usuarios/{usuarioId}/restablecer-password` | Restablecer contraseña | `USUARIOS.RESTABLECER_PASSWORD` |

Validaciones: persona inexistente (`404`); persona ya vinculada a otra cuenta de usuario (`409`); contraseña conforme a la política (`422`); la contraseña jamás se incluye en una respuesta; bloqueo de la última cuenta administradora activa (`409`); operación sin permiso (`403`).

## 10. Profesionales — `profesionales`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/profesionales` | Listar por especialidad | `PROFESIONALES.VER` |
| `GET` | `/api/v1/profesionales/{profesionalId}` | Consultar perfil clínico | `PROFESIONALES.VER` |
| `POST` | `/api/v1/profesionales` | Registrar profesional | `PROFESIONALES.CREAR` |
| `PUT` | `/api/v1/profesionales/{profesionalId}` | Actualizar registro | `PROFESIONALES.EDITAR` |
| `PATCH` | `/api/v1/profesionales/{profesionalId}/estado` | Cambiar habilitación | `PROFESIONALES.CAMBIAR_ESTADO` |

Validaciones: empleado inexistente (`404`); empleado existente pero inactivo (`422`); registro profesional obligatorio y único (`409`); empleado ya registrado como profesional (`409`); desactivación con citas futuras (`409`).

## 11. Roles — `roles`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/roles` | Listar roles | `SEGURIDAD.VER` |
| `GET` | `/api/v1/roles/{rolId}` | Consultar rol y permisos | `SEGURIDAD.VER` |
| `POST` | `/api/v1/roles` | Crear rol | `SEGURIDAD.CREAR` |
| `PUT` | `/api/v1/roles/{rolId}` | Actualizar rol | `SEGURIDAD.EDITAR` |
| `PATCH` | `/api/v1/roles/{rolId}/estado` | Cambiar estado | `SEGURIDAD.CAMBIAR_ESTADO` |

Validaciones: nombre obligatorio y único (`409`); rol inexistente (`404`); rol inactivo no asignable (`422`); protección de roles esenciales configurable (`409`).

## 12. Permisos — `permisos`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/permisos` | Listar por módulo | `SEGURIDAD.VER` |
| `GET` | `/api/v1/permisos/{permisoId}` | Consultar permiso | `SEGURIDAD.VER` |
| `POST` | `/api/v1/permisos` | Crear permiso | `SEGURIDAD.CREAR` |
| `PUT` | `/api/v1/permisos/{permisoId}` | Actualizar descripción | `SEGURIDAD.EDITAR` |

Validaciones: módulo y acción obligatorios (`422`); combinación `modulo + accion` duplicada (`409`); permiso inexistente (`404`); cambios reservados a seguridad (`403`).

## 13. Roles de usuario — `usuario_roles`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/usuarios/{usuarioId}/roles` | Consultar asignaciones | `USUARIOS.VER` |
| `PUT` | `/api/v1/usuarios/{usuarioId}/roles` | Reemplazar roles | `USUARIOS.GESTIONAR_ROLES` |
| `POST` | `/api/v1/usuarios/{usuarioId}/roles/{rolId}` | Asignar rol | `USUARIOS.ASIGNAR` |
| `DELETE` | `/api/v1/usuarios/{usuarioId}/roles/{rolId}` | Retirar rol | `USUARIOS.RETIRAR` |

Validaciones: usuario y rol existentes (`404`); rol activo (`422`); asignación duplicada (`409`); usuario sin ningún rol operativo (`422`); impedir eliminar el último administrador (`409`).

## 14. Permisos de rol — `rol_permisos`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/roles/{rolId}/permisos` | Consultar permisos | `SEGURIDAD.VER` |
| `PUT` | `/api/v1/roles/{rolId}/permisos` | Reemplazar permisos | `SEGURIDAD.GESTIONAR_PERMISOS` |
| `POST` | `/api/v1/roles/{rolId}/permisos/{permisoId}` | Asignar permiso | `SEGURIDAD.ASIGNAR` |
| `DELETE` | `/api/v1/roles/{rolId}/permisos/{permisoId}` | Retirar permiso | `SEGURIDAD.RETIRAR` |

Validaciones: rol y permiso existentes (`404`); asignación duplicada (`409`); retiro que dejaría sin administración al sistema (`409`); autorización de seguridad requerida (`403`).

## 15. Antecedentes del paciente — `antecedentes_paciente`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/pacientes/{pacienteId}/antecedentes` | Listar antecedentes | `PACIENTES.VER` |
| `GET` | `/api/v1/pacientes/{pacienteId}/antecedentes/{antecedenteId}` | Consultar detalle | `PACIENTES.VER` |
| `POST` | `/api/v1/pacientes/{pacienteId}/antecedentes` | Registrar antecedente | `PACIENTES.CREAR` |
| `PUT` | `/api/v1/pacientes/{pacienteId}/antecedentes/{antecedenteId}` | Corregir | `PACIENTES.EDITAR` |
| `PATCH` | `/api/v1/pacientes/{pacienteId}/antecedentes/{antecedenteId}/estado` | Cambiar estado | `PACIENTES.CAMBIAR_ESTADO` |

Validaciones: paciente existente (`404`); tipo dentro de valores permitidos y descripción obligatoria (`422`); antecedente perteneciente a otro paciente (`404`); usuario registrador tomado del JWT.

## 16. Especialidades del profesional — `profesional_especialidades`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/profesionales/{profesionalId}/especialidades` | Consultar asignaciones | `PROFESIONALES.VER` |
| `PUT` | `/api/v1/profesionales/{profesionalId}/especialidades` | Reemplazar asignaciones | `PROFESIONALES.GESTIONAR_ESPECIALIDADES` |
| `POST` | `/api/v1/profesionales/{profesionalId}/especialidades/{especialidadId}` | Asignar | `PROFESIONALES.ASIGNAR` |
| `DELETE` | `/api/v1/profesionales/{profesionalId}/especialidades/{especialidadId}` | Retirar | `PROFESIONALES.RETIRAR` |

Validaciones: profesional y especialidad existentes (`404`); especialidad activa (`422`); combinación duplicada (`409`); retiro incompatible con citas futuras del servicio especializado, si aplica (`409`).

## 17. Disponibilidades — `disponibilidades`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/profesionales/{profesionalId}/disponibilidades` | Consultar horario recurrente | `AGENDA.VER` |
| `GET` | `/api/v1/profesionales/{profesionalId}/horarios-disponibles` | Calcular espacios por fecha y servicio | `AGENDA.VER` |
| `POST` | `/api/v1/profesionales/{profesionalId}/disponibilidades` | Crear franja | `AGENDA.CREAR` |
| `PUT` | `/api/v1/profesionales/{profesionalId}/disponibilidades/{disponibilidadId}` | Modificar franja | `AGENDA.EDITAR` |
| `PATCH` | `/api/v1/profesionales/{profesionalId}/disponibilidades/{disponibilidadId}/estado` | Cambiar estado | `AGENDA.CAMBIAR_ESTADO` |

Validaciones: días entre 1 y 7 (`422`); `diaInicio <= diaFin`; orden `horaInicio < horaAlmuerzo < horaRetorno < horaFin` (`422`); franja superpuesta (`409`); modificación que invalida citas existentes (`409`).

## 18. Citas — `citas`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/citas` | Listar por fecha, paciente, profesional o estado | `CITAS.VER` |
| `GET` | `/api/v1/citas/{citaId}` | Consultar detalle compuesto | `CITAS.VER` |
| `POST` | `/api/v1/citas` | Agendar | `CITAS.CREAR` |
| `PUT` | `/api/v1/citas/{citaId}` | Actualizar datos permitidos | `CITAS.EDITAR` |
| `POST` | `/api/v1/citas/{citaId}/reprogramar` | Reprogramar | `CITAS.REPROGRAMAR` |
| `POST` | `/api/v1/citas/{citaId}/cancelar` | Cancelar | `CITAS.CANCELAR` |
| `PATCH` | `/api/v1/citas/{citaId}/estado` | Ejecutar transición | `CITAS.CAMBIAR_ESTADO` |

Validaciones: paciente, profesional y servicio existentes (`404`); todos activos (`422`); fecha futura; intervalo dentro de jornada y fuera del almuerzo (`422`); solapamiento (`409`); transición inválida (`409`); cancelación sin motivo (`422`). La duración del servicio determina la hora final.

```json
{
  "pacienteId": 31,
  "profesionalId": 7,
  "servicioId": 3,
  "fechaHoraInicio": "2026-09-01T10:00:00-05:00",
  "motivoConsulta": "Dolor en molar inferior derecho",
  "origen": "MANUAL"
}
```

## 19. Historias clínicas — `historias_clinicas`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/pacientes/{pacienteId}/historia-clinica` | Consultar historia consolidada | `HISTORIA_CLINICA.VER` |
| `POST` | `/api/v1/pacientes/{pacienteId}/historia-clinica` | Abrir historia | `HISTORIA_CLINICA.CREAR` |
| `PUT` | `/api/v1/pacientes/{pacienteId}/historia-clinica` | Actualizar observaciones | `HISTORIA_CLINICA.EDITAR` |

Validaciones: paciente existente (`404`); una sola historia por paciente (`409`); fecha de apertura válida (`422`); acceso restringido a personal clínico autorizado (`403`).

## 20. Atenciones clínicas — `atenciones_clinicas`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/atenciones/{atencionId}` | Consultar atención completa | `HISTORIA_CLINICA.VER` |
| `POST` | `/api/v1/citas/{citaId}/atencion` | Registrar atención | `CITAS.CREAR` |
| `PUT` | `/api/v1/atenciones/{atencionId}` | Actualizar notas autorizadas | `HISTORIA_CLINICA.EDITAR` |

Validaciones: cita existente (`404`); una atención por cita (`409`); cita cancelada o no asistida (`422`); profesional no asignado (`403`); fecha anterior a la cita o futura (`422`); campos clínicos obligatorios conforme a la política.

## 21. Diagnósticos — `diagnosticos`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/atenciones/{atencionId}/diagnosticos` | Listar diagnósticos | `HISTORIA_CLINICA.VER` |
| `GET` | `/api/v1/diagnosticos/{diagnosticoId}` | Consultar diagnóstico | `HISTORIA_CLINICA.VER` |
| `POST` | `/api/v1/atenciones/{atencionId}/diagnosticos` | Registrar diagnóstico | `HISTORIA_CLINICA.CREAR` |
| `PUT` | `/api/v1/diagnosticos/{diagnosticoId}` | Corregir diagnóstico | `HISTORIA_CLINICA.EDITAR` |

Validaciones: atención existente (`404`); descripción y tipo obligatorios (`422`); código con formato definido si se suministra (`422`); profesional no autorizado (`403`).

## 22. Procedimientos realizados — `procedimientos_realizados`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/atenciones/{atencionId}/procedimientos` | Listar procedimientos | `HISTORIA_CLINICA.VER` |
| `GET` | `/api/v1/procedimientos/{procedimientoId}` | Consultar detalle | `HISTORIA_CLINICA.VER` |
| `POST` | `/api/v1/atenciones/{atencionId}/procedimientos` | Registrar procedimiento | `HISTORIA_CLINICA.CREAR` |
| `PUT` | `/api/v1/procedimientos/{procedimientoId}` | Corregir procedimiento | `HISTORIA_CLINICA.EDITAR` |

Validaciones: atención y servicio existentes (`404`); descripción obligatoria; valor no negativo (`422`); fecha coherente con la atención (`422`); duplicado accidental conforme a regla definida (`409`).

## 23. Dientes — `dientes`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/dientes` | Listar catálogo FDI | `CATALOGOS.VER` |
| `GET` | `/api/v1/dientes/{dienteCodigo}` | Consultar pieza | `CATALOGOS.VER` |
| `POST` | `/api/v1/dientes` | Crear pieza de catálogo | `CATALOGOS.CREAR` |
| `PUT` | `/api/v1/dientes/{dienteCodigo}` | Actualizar metadatos | `CATALOGOS.EDITAR` |

Validaciones: código FDI obligatorio y único (`409`); dentición, cuadrante y posición coherentes (`422`); código inexistente (`404`); cambios estructurales requieren permiso administrativo (`403`).

## 24. Odontogramas — `odontogramas`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/pacientes/{pacienteId}/odontogramas` | Listar versiones | `ODONTOGRAMA.VER` |
| `GET` | `/api/v1/odontogramas/{odontogramaId}` | Consultar versión completa | `ODONTOGRAMA.VER` |
| `POST` | `/api/v1/pacientes/{pacienteId}/odontogramas` | Crear e inicializar versión | `ODONTOGRAMA.CREAR` |
| `PUT` | `/api/v1/odontogramas/{odontogramaId}` | Actualizar observaciones | `ODONTOGRAMA.EDITAR` |

Validaciones: historia clínica inexistente (`404`); paciente inexistente (`404`); profesional inexistente (`404`); profesional existente pero inactivo (`422`); usuario autenticado sin autorización clínica (`403`); atención informada que no pertenece al paciente (`409`); tipo de dentición inexistente (`404`); tipo de dentición existente pero inactivo (`422`).

## 25. Dientes del odontograma — `odontograma_dientes`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/odontogramas/{odontogramaId}/dientes` | Listar piezas de la versión | `ODONTOGRAMA.VER` |
| `GET` | `/api/v1/odontogramas/{odontogramaId}/dientes/{dienteCodigo}` | Consultar pieza | `ODONTOGRAMA.VER` |
| `PUT` | `/api/v1/odontogramas/{odontogramaId}/dientes/{dienteCodigo}` | Actualizar estado general | `ODONTOGRAMA.EDITAR` |

Validaciones: odontograma y código dental existentes (`404`); combinación duplicada impedida (`409`); estado general dentro del catálogo definido (`422`); pieza no correspondiente a la dentición seleccionada (`422`).

## 26. Hallazgos dentales — `hallazgos_dentales`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/odontogramas/{odontogramaId}/dientes/{dienteCodigo}/hallazgos` | Listar hallazgos | `ODONTOGRAMA.VER` |
| `POST` | `/api/v1/odontogramas/{odontogramaId}/dientes/{dienteCodigo}/hallazgos` | Registrar hallazgo | `ODONTOGRAMA.CREAR` |
| `PUT` | `/api/v1/hallazgos-dentales/{hallazgoId}` | Actualizar hallazgo | `ODONTOGRAMA.EDITAR` |
| `PATCH` | `/api/v1/hallazgos-dentales/{hallazgoId}/estado` | Cambiar el estado del hallazgo sin eliminar su trazabilidad | `ODONTOGRAMA.CAMBIAR_ESTADO` |

Validaciones: pieza del odontograma existente (`404`); superficie dentro de los valores permitidos (`422`); superficie nula solo para hallazgos de pieza completa; tipo y estado obligatorios (`422`); duplicado incompatible en la misma superficie (`409`); transición de estado inválida (`409`). Los hallazgos no se eliminan físicamente: se cambia su estado para conservar la trazabilidad clínica.

## 27. Notificaciones — `notificaciones`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/notificaciones` | Listar por estado, tipo o cita | `NOTIFICACIONES.VER` |
| `GET` | `/api/v1/notificaciones/{notificacionId}` | Consultar detalle | `NOTIFICACIONES.VER` |
| `POST` | `/api/v1/citas/{citaId}/notificaciones` | Programar | `NOTIFICACIONES.CREAR` |
| `POST` | `/api/v1/notificaciones/{notificacionId}/reintentar` | Reintentar fallida | `NOTIFICACIONES.REINTENTAR` |
| `POST` | `/api/v1/notificaciones/{notificacionId}/cancelar` | Cancelar pendiente | `NOTIFICACIONES.CANCELAR` |

Validaciones: cita existente (`404`); destinatario, mensaje y fecha obligatorios (`422`); fecha programada ya vencida (`422`); reintento si no está fallida (`409`); cancelación si ya fue enviada (`409`); transición de estado atómica.

## 28. Conversaciones del agente — `conversaciones_agente`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/agente/conversaciones` | Listar conversaciones | `AGENTE.VER` |
| `GET` | `/api/v1/agente/conversaciones/{conversacionId}` | Consultar contexto | `AGENTE.VER` |
| `POST` | `/api/v1/agente/conversaciones` | Abrir o recuperar por chat | `AGENTE.CREAR` |
| `PATCH` | `/api/v1/agente/conversaciones/{conversacionId}/paciente` | Vincular paciente | `AGENTE.VINCULAR_PACIENTE` |

Validaciones: identificador de chat obligatorio y único (`409`); paciente opcional pero existente si se envía (`404`); conflicto al vincular otro paciente (`409`); límite de solicitudes (`429`); acceso técnico autorizado (`403`).

## 29. Mensajes del agente — `mensajes_agente`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/agente/conversaciones/{conversacionId}/mensajes` | Consultar historial paginado | `AGENTE.VER` |
| `GET` | `/api/v1/agente/mensajes/{mensajeId}` | Consultar mensaje | `AGENTE.VER` |
| `POST` | `/api/v1/agente/conversaciones/{conversacionId}/mensajes` | Registrar mensaje | `AGENTE.CREAR` |

Validaciones: conversación existente (`404`); rol limitado a usuario, asistente, sistema o herramienta (`422`); contenido obligatorio y con longitud máxima (`422`); duplicación idempotente si el canal reintenta (`409` o respuesta idempotente); límite de frecuencia (`429`).

El modelo SQL incluye los siguientes recursos como continuación del inventario y de los contratos ya documentados. Se mantiene la protección por defecto: todos estos endpoints requieren autenticación y el permiso indicado.

Los catálogos de las secciones 30 a 50 son administrados mediante seeders y se exponen únicamente para lectura. No admiten creación, actualización ni eliminación desde la API. En todos ellos, un identificador inexistente responde `404`; un valor existente pero inactivo que se intente utilizar en una operación responde `422`.

## 30. Acciones de permiso — `acciones_permiso`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/acciones-permiso` | Consultar acciones activas | `SEGURIDAD.VER` |
| `GET` | `/api/v1/acciones-permiso/{accionPermisoId}` | Consultar acción | `SEGURIDAD.VER` |

Validaciones: acción inexistente (`404`); parámetros inválidos (`400`); token ausente o inválido (`401`); usuario autenticado sin el permiso requerido (`403`). La API no permite escritura sobre este catálogo.

## 31. Tipos de antecedente — `tipos_antecedente`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/tipos-antecedente` | Consultar tipos activos | `HISTORIA_CLINICA.VER` |
| `GET` | `/api/v1/tipos-antecedente/{tipoAntecedenteId}` | Consultar tipo | `HISTORIA_CLINICA.VER` |

Validaciones: Tipo inexistente (`404`); tipo existente pero inactivo no utilizable (`422`); parámetros inválidos (`400`). La API no permite escritura sobre este catálogo.

## 32. Estados de cita — `estados_cita`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/estados-cita` | Consultar estados activos | `CITAS.VER` |
| `GET` | `/api/v1/estados-cita/{estadoCitaId}` | Consultar estado | `CITAS.VER` |

Validaciones: Estado inexistente (`404`); estado inactivo (`422`); transición hacia o desde un estado final no permitida (`409`). La API no permite escritura sobre este catálogo.

## 33. Orígenes de cita — `origenes_cita`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/origenes-cita` | Consultar orígenes activos | `CITAS.VER` |
| `GET` | `/api/v1/origenes-cita/{origenCitaId}` | Consultar origen | `CITAS.VER` |

Validaciones: Origen inexistente (`404`); origen inactivo (`422`); filtros inválidos (`400`). La API no permite escritura sobre este catálogo.

## 34. Tipos de dentición — `tipos_denticion`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/tipos-denticion` | Consultar tipos activos | `ODONTOGRAMA.VER` |
| `GET` | `/api/v1/tipos-denticion/{tipoDenticionId}` | Consultar tipo | `ODONTOGRAMA.VER` |

Validaciones: Tipo inexistente (`404`); tipo inactivo no utilizable (`422`); parámetros inválidos (`400`). La API no permite escritura sobre este catálogo.

## 35. Estados de diente — `estados_diente`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/estados-diente` | Consultar estados activos | `ODONTOGRAMA.VER` |
| `GET` | `/api/v1/estados-diente/{estadoDienteId}` | Consultar estado | `ODONTOGRAMA.VER` |

Validaciones: Estado inexistente (`404`); estado inactivo no asignable (`422`); filtros inválidos (`400`). La API no permite escritura sobre este catálogo.

## 36. Superficies dentales — `superficies_dentales`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/superficies-dentales` | Consultar superficies compatibles | `ODONTOGRAMA.VER` |
| `GET` | `/api/v1/superficies-dentales/{superficieDentalId}` | Consultar superficie | `ODONTOGRAMA.VER` |

Validaciones: Superficie inexistente (`404`); superficie inactiva (`422`); superficie incompatible con la pieza anterior o posterior (`422`). La API no permite escritura sobre este catálogo.

## 37. Tipos de hallazgo — `tipos_hallazgo`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/tipos-hallazgo` | Consultar tipos activos | `ODONTOGRAMA.VER` |
| `GET` | `/api/v1/tipos-hallazgo/{tipoHallazgoId}` | Consultar tipo | `ODONTOGRAMA.VER` |

Validaciones: Tipo inexistente (`404`); tipo inactivo (`422`); ausencia de superficie cuando el tipo la requiere (`422`). La API no permite escritura sobre este catálogo.

## 38. Estados de hallazgo — `estados_hallazgo`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/estados-hallazgo` | Consultar estados activos | `ODONTOGRAMA.VER` |
| `GET` | `/api/v1/estados-hallazgo/{estadoHallazgoId}` | Consultar estado | `ODONTOGRAMA.VER` |

Validaciones: Estado inexistente (`404`); estado inactivo (`422`); transición clínica incompatible (`409`). La API no permite escritura sobre este catálogo.

## 39. Estados de sesión — `estados_sesion`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/estados-sesion` | Consultar estados de sesión | `SEGURIDAD.VER_SESIONES` |
| `GET` | `/api/v1/estados-sesion/{estadoSesionId}` | Consultar estado | `SEGURIDAD.VER_SESIONES` |

Validaciones: Estado inexistente (`404`); token inválido (`401`); permiso insuficiente (`403`). Las transiciones son internas. La API no permite escritura sobre este catálogo.

## 40. Tipos de notificación Hub — `tipos_notificacion_hub`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/tipos-notificacion-hub` | Consultar tipos activos | `NOTIFICACIONES.VER` |
| `GET` | `/api/v1/tipos-notificacion-hub/{tipoNotificacionHubId}` | Consultar tipo | `NOTIFICACIONES.VER` |

Validaciones: Tipo inexistente (`404`); tipo inactivo (`422`); parámetros inválidos (`400`). La API no permite escritura sobre este catálogo.

## 41. Prioridades de notificación — `prioridades_notificacion`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/prioridades-notificacion` | Consultar prioridades activas | `NOTIFICACIONES.VER` |
| `GET` | `/api/v1/prioridades-notificacion/{prioridadNotificacionId}` | Consultar prioridad | `NOTIFICACIONES.VER` |

Validaciones: Prioridad inexistente (`404`); prioridad inactiva (`422`); configuración interna inconsistente (`500`). La API no permite escritura sobre este catálogo.

## 42. Estados de notificación Hub — `estados_notificacion_hub`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/estados-notificacion-hub` | Consultar estados activos | `NOTIFICACIONES.VER` |
| `GET` | `/api/v1/estados-notificacion-hub/{estadoNotificacionHubId}` | Consultar estado | `NOTIFICACIONES.VER` |

Validaciones: Estado inexistente (`404`); estado inactivo (`422`); transición incompatible (`409`). La API no permite escritura sobre este catálogo.

## 43. Tipos de notificación WhatsApp — `tipos_notificacion_whatsapp`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/tipos-notificacion-whatsapp` | Consultar tipos activos | `NOTIFICACIONES.VER` |
| `GET` | `/api/v1/tipos-notificacion-whatsapp/{tipoNotificacionWhatsappId}` | Consultar tipo | `NOTIFICACIONES.VER` |

Validaciones: Tipo inexistente (`404`); tipo inactivo (`422`); plantilla requerida pero no configurada (`422`). La API no permite escritura sobre este catálogo.

## 44. Estados de notificación WhatsApp — `estados_notificacion_whatsapp`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/estados-notificacion-whatsapp` | Consultar estados activos | `NOTIFICACIONES.VER` |
| `GET` | `/api/v1/estados-notificacion-whatsapp/{estadoNotificacionWhatsappId}` | Consultar estado | `NOTIFICACIONES.VER` |

Validaciones: Estado inexistente (`404`); estado inactivo (`422`); retroceso incompatible del estado de entrega (`409`). La API no permite escritura sobre este catálogo.

## 45. Canales de chat — `canales_chat`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/canales-chat` | Consultar canales activos | `AGENTE.VER` |
| `GET` | `/api/v1/canales-chat/{canalChatId}` | Consultar canal | `AGENTE.VER` |

Validaciones: canal inexistente (`404`); canal existente pero inactivo no admite conversaciones nuevas (`422`); credencial ausente o inválida (`401`); identidad autenticada sin el permiso requerido (`403`). La API no permite escritura sobre este catálogo.

## 46. Estados de conversación — `estados_conversacion_chatbot`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/estados-conversacion-chatbot` | Consultar estados activos | `AGENTE.VER` |
| `GET` | `/api/v1/estados-conversacion-chatbot/{estadoConversacionId}` | Consultar estado | `AGENTE.VER` |

Validaciones: Estado inexistente (`404`); estado inactivo (`422`); transición desde estado final (`409`). La API no permite escritura sobre este catálogo.

## 47. Roles de mensaje — `roles_mensaje_chatbot`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/roles-mensaje-chatbot` | Consultar roles activos | `AGENTE.VER` |
| `GET` | `/api/v1/roles-mensaje-chatbot/{rolMensajeId}` | Consultar rol | `AGENTE.VER` |

Validaciones: Rol inexistente (`404`); rol inactivo (`422`); rol incompatible con la identidad emisora (`403`). La API no permite escritura sobre este catálogo.

## 48. Estados de ticket de soporte — `estados_ticket_soporte`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/estados-ticket-soporte` | Consultar estados activos | `SOPORTE.VER` |
| `GET` | `/api/v1/estados-ticket-soporte/{estadoTicketSoporteId}` | Consultar estado | `SOPORTE.VER` |

Validaciones: Estado inexistente (`404`); estado inactivo (`422`); asignación no permitida por el estado (`422`); transición desde estado final (`409`). La API no permite escritura sobre este catálogo.

## 49. Motivos de ticket de soporte — `motivos_ticket_soporte`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/motivos-ticket-soporte` | Consultar motivos activos | `SOPORTE.VER` |
| `GET` | `/api/v1/motivos-ticket-soporte/{motivoTicketId}` | Consultar motivo | `SOPORTE.VER` |

Validaciones: Motivo inexistente (`404`); motivo inactivo (`422`); parámetros inválidos (`400`). La API no permite escritura sobre este catálogo.

## 50. Tipos de evento de auditoría — `tipos_evento_auditoria`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/tipos-evento-auditoria` | Consultar tipos activos | `AUDITORIA.VER` |
| `GET` | `/api/v1/tipos-evento-auditoria/{tipoEventoAuditoriaId}` | Consultar tipo | `AUDITORIA.VER` |

Validaciones: Tipo inexistente (`404`); acceso sin permiso (`403`); configuración de riesgo inconsistente (`500`). La API no permite escritura sobre este catálogo.

## 51. Sesiones — `sesiones`

Las sesiones almacenan el hash del refresh token; el token original nunca forma parte de una consulta administrativa.

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/sesiones` | Consultar sesiones propias | `AUTH.VER_SESIONES` |
| `GET` | `/api/v1/sesiones/{sesionId}` | Consultar metadatos de una sesión propia | `AUTH.VER_SESIONES` |
| `POST` | `/api/v1/sesiones/{sesionId}/revocar` | Revocar sesión propia | `AUTH.REVOCAR_SESION` |
| `GET` | `/api/v1/administracion/sesiones` | Consultar sesiones del sistema | `SEGURIDAD.VER_SESIONES` |
| `POST` | `/api/v1/administracion/sesiones/{sesionId}/revocar` | Revocar por seguridad | `SEGURIDAD.REVOCAR_SESION` |

Validaciones: sesión inexistente o perteneciente a otro usuario (`404`, para no revelar su existencia); sesión ya revocada o expirada (`409`); token inválido (`401`); permiso administrativo insuficiente (`403`). Ninguna respuesta incluye `refresh_token_hash`.

## 52. Notificaciones internas — `notificaciones_hub`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/notificaciones-hub` | Consultar notificaciones propias | `NOTIFICACIONES.VER` |
| `GET` | `/api/v1/notificaciones-hub/{notificacionHubId}` | Consultar detalle propio | `NOTIFICACIONES.VER` |
| `POST` | `/api/v1/notificaciones-hub` | Crear notificación interna | `NOTIFICACIONES.CREAR` |
| `POST` | `/api/v1/notificaciones-hub/{notificacionHubId}/marcar-leida` | Marcar como leída | `NOTIFICACIONES.EDITAR_PROPIAS` |
| `POST` | `/api/v1/notificaciones-hub/{notificacionHubId}/cancelar` | Cancelar una pendiente | `NOTIFICACIONES.CANCELAR` |

Validaciones: notificación, tipo, prioridad o estado inexistente (`404`); catálogo existente pero inactivo (`422`); se debe informar receptor de usuario o receptor de rol, pero no ambos (`422`); notificación ajena (`404`); transición incompatible (`409`).

## 53. Notificaciones de WhatsApp — `notificaciones_whatsapp`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/notificaciones-whatsapp` | Consultar envíos | `NOTIFICACIONES.VER_WHATSAPP` |
| `GET` | `/api/v1/notificaciones-whatsapp/{notificacionWhatsappId}` | Consultar detalle | `NOTIFICACIONES.VER_WHATSAPP` |
| `POST` | `/api/v1/notificaciones-whatsapp` | Programar envío | `NOTIFICACIONES.CREAR_WHATSAPP` |
| `POST` | `/api/v1/notificaciones-whatsapp/{notificacionWhatsappId}/cancelar` | Cancelar envío pendiente | `NOTIFICACIONES.CANCELAR_WHATSAPP` |
| `POST` | `/api/v1/notificaciones-whatsapp/{notificacionWhatsappId}/reintentar` | Reintentar envío fallido | `NOTIFICACIONES.REINTENTAR_WHATSAPP` |
| `POST` | `/api/v1/integraciones/whatsapp/estados` | Recibir estado firmado del proveedor | `SERVICIO_WHATSAPP.ACTUALIZAR_ESTADO` |

Validaciones: cita, paciente, tipo o estado inexistente (`404`); catálogo existente pero inactivo (`422`); teléfono o fecha no interpretable (`400`); cancelar una notificación enviada (`409`); reintentar una notificación no fallida (`409`); webhook sin firma válida (`401`).

## 54. Conversaciones del chatbot — `conversaciones_chatbot`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/conversaciones-chatbot` | Consultar conversaciones | `AGENTE.VER` |
| `GET` | `/api/v1/conversaciones-chatbot/{conversacionChatbotId}` | Consultar contexto | `AGENTE.VER` |
| `POST` | `/api/v1/conversaciones-chatbot` | Abrir o recuperar conversación | `AGENTE.CREAR` |
| `POST` | `/api/v1/conversaciones-chatbot/{conversacionChatbotId}/escalar` | Transferir a atención humana | `AGENTE.ESCALAR` |
| `POST` | `/api/v1/conversaciones-chatbot/{conversacionChatbotId}/cerrar` | Cerrar conversación | `AGENTE.CERRAR` |
| `PATCH` | `/api/v1/conversaciones-chatbot/{conversacionChatbotId}/paciente` | Vincular paciente | `AGENTE.VINCULAR_PACIENTE` |

Validaciones: conversación, canal, estado o paciente inexistente (`404`); canal o estado inactivo (`422`); combinación canal/identificador duplicada (`409`, salvo recuperación idempotente); conflicto al reemplazar un paciente vinculado (`409`); transición desde estado final (`409`).

## 55. Mensajes del chatbot — `mensajes_chatbot`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/conversaciones-chatbot/{conversacionChatbotId}/mensajes` | Consultar historial paginado | `AGENTE.VER` |
| `GET` | `/api/v1/mensajes-chatbot/{mensajeChatbotId}` | Consultar mensaje | `AGENTE.VER` |
| `POST` | `/api/v1/conversaciones-chatbot/{conversacionChatbotId}/mensajes` | Registrar mensaje | `AGENTE.CREAR_MENSAJE` |

Validaciones: conversación, mensaje o rol inexistente (`404`); conversación cerrada (`409`); rol inactivo (`422`); contenido vacío o demasiado largo (`422`); confianza RAG fuera de 0 a 1 (`422`); acceso a una conversación no autorizada (`403`).

## 56. Tickets de soporte — `tickets_soporte`

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/tickets-soporte` | Listar tickets | `SOPORTE.VER` |
| `GET` | `/api/v1/tickets-soporte/{ticketSoporteId}` | Consultar detalle y conversación | `SOPORTE.VER` |
| `POST` | `/api/v1/tickets-soporte` | Crear escalamiento | `SOPORTE.CREAR` |
| `POST` | `/api/v1/tickets-soporte/{ticketSoporteId}/asignar` | Asignar usuario | `SOPORTE.ASIGNAR` |
| `POST` | `/api/v1/tickets-soporte/{ticketSoporteId}/iniciar-atencion` | Iniciar atención | `SOPORTE.ATENDER` |
| `POST` | `/api/v1/tickets-soporte/{ticketSoporteId}/resolver` | Registrar resolución | `SOPORTE.RESOLVER` |
| `POST` | `/api/v1/tickets-soporte/{ticketSoporteId}/cerrar` | Cerrar ticket | `SOPORTE.CERRAR` |

Validaciones: ticket, conversación, motivo, prioridad, estado o usuario inexistente (`404`); catálogo existente pero inactivo (`422`); título o resolución obligatoria ausente (`422`); confianza RAG fuera de 0 a 1 (`422`); asignación no permitida por el estado (`422`); transición incompatible (`409`).

## 57. Eventos de auditoría — `auditoria_eventos`

La auditoría es inmutable desde la API. Los eventos son generados internamente por los casos de uso.

| Método | Ruta | Caso de uso | Permiso requerido |
|---|---|---|---|
| `GET` | `/api/v1/auditoria-eventos` | Consultar eventos con filtros | `AUDITORIA.VER` |
| `GET` | `/api/v1/auditoria-eventos/{auditoriaEventoId}` | Consultar detalle | `AUDITORIA.VER` |

Validaciones: evento o tipo inexistente (`404`); rango de fechas o filtro no interpretable (`400`); token inválido (`401`); acceso sin permiso (`403`); datos sensibles ocultos en la respuesta. No se permiten operaciones públicas de creación, actualización ni eliminación.

## Operaciones compuestas que no corresponden a una sola tabla

Algunos casos de uso deben coordinar varias tablas dentro de una transacción, aunque cada tabla ya tenga su sección individual:

- Registrar paciente: `personas + pacientes + historias_clinicas`.
- Crear usuario: `usuarios + usuario_roles`.
- Registrar profesional: `empleados + profesionales + profesional_especialidades`.
- Agendar o reprogramar cita: `disponibilidades + servicios + citas + notificaciones`.
- Registrar atención: `citas + atenciones_clinicas + diagnosticos + procedimientos_realizados`.
- Crear odontograma: `odontogramas + dientes + odontograma_dientes`.
- Procesar interacción del agente: `conversaciones_agente + mensajes_agente`, consumiendo la API de citas.

## Catálogo base de permisos

| Módulo | Acciones |
|---|---|
| `AUTH` | `CERRAR_SESION`, `VER_PERFIL` |
| `CATALOGOS` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO` |
| `PERSONAS` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO` |
| `PACIENTES` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO` |
| `EMPLEADOS` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO` |
| `PROFESIONALES` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO`, `ASIGNAR`, `RETIRAR`, `GESTIONAR_ESPECIALIDADES` |
| `USUARIOS` | `VER`, `CREAR`, `CAMBIAR_ESTADO`, `ASIGNAR`, `RETIRAR`, `GESTIONAR_ROLES`, `RESTABLECER_PASSWORD` |
| `SEGURIDAD` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO`, `ASIGNAR`, `RETIRAR`, `GESTIONAR_PERMISOS` |
| `AGENDA` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO` |
| `CITAS` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO`, `REPROGRAMAR`, `CANCELAR` |
| `HISTORIA_CLINICA` | `VER`, `CREAR`, `EDITAR` |
| `ODONTOGRAMA` | `VER`, `CREAR`, `EDITAR`, `CAMBIAR_ESTADO` |
| `NOTIFICACIONES` | `VER`, `CREAR`, `REINTENTAR`, `CANCELAR` |
| `AGENTE` | `VER`, `CREAR`, `VINCULAR_PACIENTE` |

## Ubicación en la arquitectura hexagonal

| Capa | Responsabilidad |
|---|---|
| Domain | Entidades, objetos de valor, estados y reglas invariantes |
| Application | Comandos, consultas, validadores, puertos y DTO de casos de uso |
| Infrastructure | Repositorios Oracle, EF Core, transacciones y consultas optimizadas |
| Api | Rutas, JWT, autorización, DTO HTTP, Swagger y manejo de errores |

La capa Api expone los endpoints HTTP y genera su documentación mediante Swagger/OpenAPI. Cada endpoint delega la operación correspondiente a un caso de uso de Application, mientras que Domain concentra las reglas esenciales del negocio y protege la consistencia de sus entidades. Infrastructure implementa los mecanismos necesarios para consultar y almacenar la información en Oracle. Esta distribución permite que el contrato HTTP describa las capacidades del sistema sin depender de la estructura interna de la base de datos.
