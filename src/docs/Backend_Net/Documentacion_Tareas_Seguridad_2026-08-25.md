# Documentación de tareas de seguridad y usuarios

**Autor:** Sergio Andres Serrano Rivero 

**Proyecto:** NexusOdontoBackend API  
**Fecha:** 25 de agosto de 2026  
**Arquitectura:** Domain, Application, Infrastructure y Api  
**Plataforma:** .NET 10

## Objetivo

Durante la jornada se desarrollaron cuatro tareas relacionadas con la seguridad del sistema: el modelo de usuarios, roles y permisos; el servicio de autenticación; la exposición de autenticación y gestión de usuarios mediante controladores REST; y el filtro de autorización dinámica por permisos.

La implementación evita definir roles fijos en el código. La autorización se basa en el identificador del rol y en los permisos almacenados para cada módulo y acción.

Como corrección transversal, los identificadores de entidades, llaves foráneas, DTOs, contratos de repositorio y parámetros de los controladores fueron unificados con el tipo `Guid`.

## 1. Entidades de seguridad, roles y permisos

Se incorporó en Domain el modelo necesario para representar usuarios, roles administrables y permisos dinámicos.

### Archivos principales

- `Domain/Common/BaseEntity.cs`
- `Domain/Entities/Usuario.cs`
- `Domain/Entities/Rol.cs`
- `Domain/Entities/Permiso.cs`
- `Domain/ValueObjects/Correo.cs`
- `Domain/ValueObjects/NombreUsuario.cs`
- `Domain/ValueObjects/NombreRol.cs`
- `Domain/ValueObjects/ModuloPermiso.cs`
- `Domain/ValueObjects/PasswordHash.cs`

### Comportamiento implementado

`Usuario` contiene el nombre, correo, hash de contraseña y la llave foránea `RolId`. El identificador del rol utiliza `Guid` y se valida para impedir el uso de `Guid.Empty`.

`Rol` contiene un nombre validado y las colecciones de usuarios y permisos. Estas colecciones se inicializan al crear la entidad para evitar referencias nulas.

`Permiso` representa las acciones disponibles para un módulo mediante las propiedades `PuedeCrear`, `PuedeEditar`, `PuedeVer` y `PuedeEliminar`. Un permiso puede relacionarse con varios roles.

Los value objects concentran validaciones y normalización. Por ejemplo, el módulo del permiso se almacena normalizado en mayúsculas y el correo se valida antes de formar parte de un usuario.

Las entidades no contienen dependencias de Entity Framework Core. De esta forma, Domain permanece independiente de la persistencia.

## 2. Servicio de autenticación

Se implementó el servicio encargado de registrar usuarios, validar credenciales y generar tokens JWT.

### Archivos principales

- `Application/Services/AuthService.cs`
- `Application/Contracts/Services/IAuthService.cs`
- `Application/Contracts/Services/JwtSettings.cs`
- `Application/Contracts/Repositories/IRepository.cs`
- `Application/Contracts/Repositories/IUsuarioRepository.cs`
- `Application/Contracts/Repositories/IUnitOfWork.cs`
- `Application/DTOs/Auth/LoginRequestDto.cs`
- `Application/DTOs/Auth/RegisterRequestDto.cs`
- `Application/DTOs/Auth/AuthResponseDto.cs`
- `Application/DTOs/Auth/UsuarioResponseDto.cs`

### Registro de usuarios

`RegisterAsync` verifica que no exista otro usuario con el mismo correo. La contraseña recibida se transforma con `BCrypt.Net.BCrypt.HashPassword` antes de crear la entidad. El DTO de respuesta nunca contiene la contraseña original ni su hash.

Después de agregar el usuario mediante `IUsuarioRepository`, los cambios se confirman mediante `IUnitOfWork.SaveChangesAsync`.

### Inicio de sesión

`LoginAsync` consulta al usuario por correo y valida la contraseña mediante `BCrypt.Net.BCrypt.Verify`. Si el usuario no existe o la contraseña es incorrecta, devuelve `null`, permitiendo que la API responda con `401 Unauthorized`.

### Contenido del JWT

El token contiene solamente la información necesaria para identificar al usuario y aplicar autorización:

- `sub`: identificador `Guid` del usuario.
- `rolId`: identificador `Guid` del rol.
- `ClaimTypes.Role`: nombre del rol.
- Fecha de vencimiento calculada desde `JwtSettings.ExpirationMinutes`.

La clave de firma, el emisor y la audiencia son validados antes de emitir el token.

### Dependencias agregadas

- `BCrypt.Net-Next`: hash y verificación de contraseñas.
- `System.IdentityModel.Tokens.Jwt`: creación y serialización del JWT.

## 3. Controladores de autenticación y usuarios

Se expusieron los servicios de autenticación y la gestión básica de usuarios mediante endpoints REST.

### Archivos principales

- `Api/Controllers/AuthController.cs`
- `Api/Controllers/UsuariosController.cs`
- `Application/DTOs/Usuarios/UpdateUsuarioRequestDto.cs`

### AuthController

El controlador publica:

```http
POST /api/auth/login
```

El endpoint recibe `LoginRequestDto`, ejecuta `IAuthService.LoginAsync` y devuelve:

- `200 OK` cuando las credenciales son válidas.
- `401 Unauthorized` cuando el correo o la contraseña son incorrectos.

El endpoint está marcado con `[AllowAnonymous]` para permitir el inicio de sesión sin un JWT previo.

### UsuariosController

El controlador está protegido con `[Authorize]` y publica las operaciones básicas solicitadas:

| Método | Ruta | Operación |
|---|---|---|
| `POST` | `/api/usuarios` | Crear usuario |
| `GET` | `/api/usuarios` | Listar usuarios |
| `PUT` | `/api/usuarios/{id}` | Editar usuario |
| `PATCH` | `/api/usuarios/{id}/desactivar` | Desactivar usuario |

Las rutas que reciben identificadores usan la restricción `{id:guid}`. La desactivación es lógica: actualiza `Activo` a `false` y registra la fecha de actualización.

El controlador inyecta `IAuthService`, `IUsuarioRepository` e `IUnitOfWork`, de acuerdo con la responsabilidad de cada operación.

## 4. Autorización dinámica mediante permisos

Se creó un filtro reutilizable para proteger controladores o endpoints según el módulo y la acción requerida.

### Archivo principal

- `Api/Filters/RequirePermissionAttribute.cs`

### Componentes incluidos

`PermissionAction` representa las acciones disponibles:

- `Create`
- `Edit`
- `View`
- `Delete`

`RequirePermissionAttribute` permite declarar el módulo y la acción necesarios en un endpoint.

`RequirePermissionFilter` implementa `IAsyncAuthorizationFilter` e intercepta la petición antes de ejecutar el método del controlador.

### Flujo de autorización

1. Comprueba que exista un usuario autenticado.
2. Extrae el identificador del usuario desde `sub` o `ClaimTypes.NameIdentifier`.
3. Extrae `rolId` desde el JWT.
4. Valida que ambos valores tengan formato `Guid`.
5. Consulta al usuario y su rol mediante `IUsuarioRepository`.
6. Verifica que el rol recuperado coincida con el `rolId` del token.
7. Busca el permiso correspondiente al módulo solicitado.
8. Evalúa la acción requerida mediante `PuedeCrear`, `PuedeEditar`, `PuedeVer` o `PuedeEliminar`.
9. Permite continuar cuando existe autorización o devuelve `403 Forbidden` cuando el permiso no está habilitado.

Si la petición no está autenticada, el filtro establece un desafío de autenticación, correspondiente a `401 Unauthorized`.

### Uso previsto

Para proteger la creación de roles se utilizará:

```csharp
[Authorize]
[RequirePermission("ROLES", PermissionAction.Create)]
[HttpPost]
public async Task<IActionResult> Crear(...)
```

La decisión no depende de que el rol se llame `Paciente` o `Administrador`. Un Paciente será bloqueado cuando su rol no tenga habilitado `PuedeCrear` para el módulo `ROLES`.

### Condición de integración

Para validar el criterio de aceptación de extremo a extremo, la implementación concreta de `IUsuarioRepository.GetByIdWithRoleAsync` debe cargar el rol junto con su colección de permisos. Además, el atributo debe aplicarse al endpoint real de creación de roles.

La prueba de integración deberá utilizar un JWT perteneciente a un usuario cuyo rol no tenga permiso de creación en `ROLES` y confirmar una respuesta `403 Forbidden`, sin ejecutar la creación del recurso.

## Corrección de identificadores

Los identificadores inicialmente declarados como `long` fueron corregidos a `Guid` de manera consistente en:

- `BaseEntity.Id`.
- Llaves foráneas de las entidades.
- `Usuario.RolId`.
- DTOs de autenticación y usuarios.
- Contratos de repositorio.
- Parámetros y restricciones de rutas en `UsuariosController`.

Con esta corrección, todos los identificadores del código fuente analizado mantienen el mismo tipo.

## Validación técnica

Se ejecutó la compilación completa de la solución con advertencias tratadas como errores:

```powershell
dotnet build .\NexusOdontoBackend_Api.slnx --no-restore -warnaserror
```

Resultado obtenido:

```text
Compilación correcta.
0 advertencias
0 errores
```

El mensaje `NETSDK1057` mostrado por el SDK solamente informa que se está utilizando una versión preliminar de .NET y no representa un error de compilación.

## Estado final

Las cuatro tareas de código fueron incorporadas y compiladas correctamente. El modelo de seguridad, el servicio JWT, los controladores REST y el filtro de permisos se encuentran definidos.

La comprobación funcional completa de autenticación y permisos depende de los adaptadores de persistencia, del registro de dependencias y de aplicar el filtro a los endpoints definitivos conforme dichos componentes sean integrados por las tareas responsables.
