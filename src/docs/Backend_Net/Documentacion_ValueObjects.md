# Documentación de Value Objects

**Autor:** Sergio Andres Serrano Rivero 

**Proyecto:** NexusOdontoBackend API  
**Fecha:** 27 de agosto de 2026  
**Plataforma:** .NET 10



## 1. Propósito

Los Value Objects implementados representan conceptos del dominio que necesitan validarse antes de ser utilizados por las entidades y los casos de uso. En lugar de transportar valores primitivos sin significado, como `string`, `Guid` o `DateTime`, cada objeto expresa una regla concreta del negocio odontológico.

La implementación se encuentra en `Domain/ValueObjects` y mantiene independencia de Entity Framework Core, controladores, repositorios y otros detalles de infraestructura.

## 2. Diseño común

Los 27 Value Objects documentados comparten las siguientes características:

- Están implementados como `sealed record`, lo que proporciona igualdad por valor e impide herencia no controlada.
- Sus propiedades solo tienen lectura pública.
- Utilizan constructores privados.
- Se crean mediante un método estático `Create`.
- Rechazan valores inválidos mediante `DomainException`.
- Normalizan con `Trim()` los textos donde corresponde.
- No dependen de Entity Framework Core.
- No modifican datos después de su creación.

Los métodos `Create` constituyen el punto de entrada obligatorio para construir valores válidos. Que un Value Object valide su contenido no elimina la necesidad de comprobar en Application la existencia de relaciones, permisos o reglas que requieran consultar otros recursos.

## 3. Value Objects de seguridad

Ubicación: `Domain/ValueObjects/Security`.

### 3.1. ActionPermissionCode

Representa el código de una acción asociada a un permiso.

- No acepta valores vacíos o compuestos únicamente por espacios.
- Elimina espacios al inicio y al final.
- Permite un máximo de 50 caracteres.
- `ToString()` devuelve el código normalizado.

### 3.2. AuditEventDescription

Representa la descripción almacenada para un evento de auditoría.

- La descripción es obligatoria.
- Elimina espacios externos.
- Permite un máximo de 1.000 caracteres.
- No define el tipo del evento ni información técnica adicional.

### 3.3. AuditEventTypeCode

Representa el código que identifica un tipo de evento de auditoría.

- El código es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 60 caracteres.

### 3.4. PasswordHash

Representa un hash de contraseña ya generado.

- No acepta valores vacíos.
- Permite un máximo de 500 caracteres.
- No devuelve el contenido real mediante `ToString()`; devuelve `[PROTECTED]`.
- No genera ni verifica hashes. El hash debe producirse previamente mediante el servicio de autenticación correspondiente.

### 3.5. PermissionKey

Representa la combinación del módulo protegido y la acción permitida.

- `Module` es obligatorio, se normaliza con `Trim()` y admite hasta 80 caracteres.
- `ActionPermissionId` debe ser diferente de `Guid.Empty`.
- Permite expresar permisos como la combinación conceptual de un módulo y una acción registrada.

### 3.6. RefreshTokenHash

Representa el hash de un refresh token.

- No acepta valores vacíos.
- Permite un máximo de 512 caracteres.
- `ToString()` devuelve `[PROTECTED]` para evitar exposición accidental.
- No crea tokens ni realiza hashing por sí mismo.

### 3.7. RoleCode

Representa el código estable de un rol dinámico.

- El código es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 50 caracteres.
- No contiene una lista fija de roles; los roles continúan administrándose desde la base de datos.

### 3.8. RolePermissionAssignment

Representa la asignación entre un rol y un permiso.

- `RoleId` debe ser diferente de `Guid.Empty`.
- `PermissionId` debe ser diferente de `Guid.Empty`.
- No verifica que los registros existan; esa comprobación corresponde a Application y persistencia.

### 3.9. SessionStatusCode

Representa el código de estado de una sesión.

- No acepta valores vacíos.
- Elimina espacios externos.
- Permite un máximo de 50 caracteres.

### 3.10. UserRoleAssignment

Representa la asignación de un rol a un usuario en una fecha determinada.

- `UserId` y `RoleId` deben ser diferentes de `Guid.Empty`.
- `AssignedAt` no puede contener el valor predeterminado de `DateTime`.
- No determina si la asignación está duplicada; esa regla necesita consultar persistencia.

## 4. Value Objects de personas

Ubicación: `Domain/ValueObjects/People`.

### 4.1. DocumentNumber

Representa el número de documento de una persona.

- Es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 30 caracteres.
- No valida un formato nacional específico, porque este depende del tipo de documento.

### 4.2. DocumentTypeCode

Representa el código del catálogo de tipos de documento.

- Es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 20 caracteres.
- No comprueba que el tipo documental exista o esté activo.

### 4.3. EmergencyContact

Agrupa el nombre y teléfono de un contacto de emergencia.

- `Name` y `Phone` son individualmente opcionales.
- Debe proporcionarse al menos uno de los dos valores.
- Los valores vacíos o con espacios se convierten en `null`.
- El nombre permite un máximo de 150 caracteres.
- El teléfono permite un máximo de 30 caracteres.

### 4.4. SexCode

Representa el código del catálogo de sexo asociado a una persona.

- Es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 20 caracteres.
- No contiene valores quemados ni comprueba el catálogo en la base de datos.

## 5. Value Objects clínicos

Ubicación: `Domain/ValueObjects/Clinical`.

### 5.1. ClinicalAttentionAt

Representa la fecha y hora en que se realizó una atención clínica.

- Rechaza el valor predeterminado de `DateTime`.
- Conserva el valor recibido sin sustituirlo por la hora actual.
- `ToString()` utiliza el formato ISO 8601 (`O`).

### 5.2. ClinicalHistoryOpenedAt

Representa la fecha de apertura de una historia clínica.

- Rechaza el valor predeterminado de `DateTime`.
- No genera fechas dinámicas.
- Su representación textual utiliza formato ISO 8601.

### 5.3. DiagnosisDescription

Representa la descripción clínica de un diagnóstico.

- Es obligatoria.
- Elimina espacios externos.
- Actualmente no define una longitud máxima interna.
- No asigna códigos diagnósticos ni clasificaciones externas.

### 5.4. ProcedureDescription

Representa la descripción de un procedimiento realizado.

- Es obligatoria.
- Elimina espacios externos.
- Actualmente no define una longitud máxima interna.
- No incluye el valor cobrado ni el servicio asociado.

## 6. Value Objects de odontograma

Ubicación: `Domain/ValueObjects/Odontogram`.

### 6.1. DentalFindingRegisteredAt

Representa la fecha de registro de un hallazgo dental.

- Rechaza el valor predeterminado de `DateTime`.
- No utiliza la fecha actual automáticamente.
- `ToString()` utiliza formato ISO 8601.

### 6.2. DentalSurfaceCode

Representa el código de una superficie dental.

- Es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 50 caracteres.
- No valida el código contra el catálogo almacenado.

### 6.3. DentitionTypeCode

Representa el código de un tipo de dentición.

- Es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 50 caracteres.
- No contiene una lista fija de tipos de dentición.

### 6.4. FindingStatusCode

Representa el código de estado de un hallazgo odontológico.

- Es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 50 caracteres.

### 6.5. FindingTypeCode

Representa el código del tipo de hallazgo dental.

- Es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 50 caracteres.

### 6.6. OdontogramRecordedAt

Representa la fecha en que fue registrado un odontograma.

- Rechaza el valor predeterminado de `DateTime`.
- Mantiene la fecha proporcionada por la operación.
- Su representación textual utiliza formato ISO 8601.

### 6.7. OdontogramToothReference

Representa la referencia compuesta entre un odontograma y un diente.

- `OdontogramId` debe ser diferente de `Guid.Empty`.
- `ToothCode` es obligatorio.
- El código debe contener exactamente dos caracteres numéricos.
- No comprueba el rango FDI; para validar completamente el código dental debe utilizarse `ToothCode`.

### 6.8. ToothCode

Representa un código dental válido bajo la nomenclatura FDI de dos dígitos.

- Es obligatorio.
- Debe contener exactamente dos caracteres numéricos.
- Para dentición permanente acepta cuadrantes del 1 al 4 y posiciones del 1 al 8.
- Para dentición temporal acepta cuadrantes del 5 al 8 y posiciones del 1 al 5.
- Rechaza cualquier combinación fuera de esos rangos.

### 6.9. ToothStatusCode

Representa el código de estado general de un diente.

- Es obligatorio.
- Elimina espacios externos.
- Permite un máximo de 50 caracteres.
- No contiene estados definidos directamente en código.

## 7. Resumen cuantitativo

| Grupo | Cantidad |
|---|---:|
| Seguridad | 10 |
| Personas | 4 |
| Clínica | 4 |
| Odontograma | 9 |
| **Total** | **27** |

## 8. Estado de integración

Los Value Objects están implementados y compilando dentro de Domain. En el estado actual revisado todavía no sustituyen los tipos primitivos de las entidades. La integración posterior debe realizarse de manera coordinada con las configuraciones de Entity Framework Core, conversiones de valores, DTOs y casos de uso para evitar romper contratos existentes.

No deben agregarse dependencias de Entity Framework Core a estos objetos durante esa integración.
