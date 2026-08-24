# Paquetes NuGet recomendados — Backend .NET del Sistema Odontológico

## 1. Alcance

Este documento lista los paquetes NuGet recomendados para implementar el backend del Sistema Odontológico con:

- ASP.NET Core Web API.
- Oracle Database con Entity Framework Core.
- Autenticación JWT con sesiones y refresh tokens.
- Roles y permisos configurables.
- SignalR para alertas internas en tiempo real.
- Swagger/OpenAPI.
- Validación de solicitudes.
- Auditoría, logs y manejo de errores.
- Integración REST con chatbot Python, WhatsApp y servicios externos.

> **Decisión recomendada:** usar una versión LTS de .NET y mantener todos los paquetes principales alineados con la misma versión mayor de .NET/EF Core. Si el proyecto se crea en .NET 8, usar paquetes compatibles con `net8.0`; no mezclar paquetes de EF Core 8 con EF Core 9 o 10.

## 2. Paquetes mínimos obligatorios

Estos paquetes cubren la base funcional del proyecto.

| Paquete | Para qué se usa | Obligatorio |
|---|---|---:|
| `Oracle.EntityFrameworkCore` | Conectar Entity Framework Core con Oracle Database | Sí |
| `Microsoft.EntityFrameworkCore.Design` | Migraciones y herramientas de diseño de EF Core | Sí |
| `Microsoft.EntityFrameworkCore.Tools` | Comandos de migración desde Package Manager Console | Sí |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | Validar access tokens JWT en la API | Sí |
| `Swashbuckle.AspNetCore` | Swagger/OpenAPI y UI de documentación de endpoints | Sí |
| `FluentValidation.AspNetCore` | Validar DTOs de entrada | Recomendado |
| `Serilog.AspNetCore` | Logging estructurado HTTP y de aplicación | Recomendado |

Oracle ofrece `Oracle.EntityFrameworkCore` como proveedor ODP.NET para utilizar EF Core con Oracle. El proveedor se apoya en `Oracle.ManagedDataAccess.Core`, por lo que normalmente no hace falta instalar este último de manera directa salvo que se use ODP.NET/ADO.NET explícitamente en código. [web:229][web:230]

## 3. Instalación inicial

Ejecutar desde la carpeta del proyecto Web API.

```bash
dotnet add package Oracle.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore
dotnet add package FluentValidation.AspNetCore
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

Para usar los comandos de EF Core desde terminal, instalar también la herramienta global si no existe:

```bash
dotnet tool install --global dotnet-ef
```

Verificar la instalación:

```bash
dotnet ef --version
```

## 4. Base de datos Oracle y EF Core

### 4.1 `Oracle.EntityFrameworkCore`

**Uso:** es el proveedor de Entity Framework Core para Oracle Database. Permite configurar el `DbContext`, ejecutar consultas LINQ y administrar entidades del modelo: pacientes, citas, historia clínica, odontograma, tickets, sesiones y auditoría.

```bash
dotnet add package Oracle.EntityFrameworkCore
```

Configuración conceptual en `Program.cs`:

```csharp
using Microsoft.EntityFrameworkCore;

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseOracle(
        builder.Configuration.GetConnectionString("OracleConnection")));
```

Ejemplo de cadena de conexión en `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "OracleConnection": "User Id=USUARIO;Password=CLAVE;Data Source=localhost:1521/XEPDB1"
  }
}
```

> No suban contraseñas reales al repositorio. En producción usen variables de entorno, secretos del VPS o un gestor de secretos.

### 4.2 `Microsoft.EntityFrameworkCore.Design`

**Uso:** habilita servicios de diseño de EF Core, principalmente migraciones y creación del contexto durante tiempo de diseño.

```bash
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### 4.3 `Microsoft.EntityFrameworkCore.Tools`

**Uso:** habilita comandos como `Add-Migration` y `Update-Database` en Visual Studio/Package Manager Console.

```bash
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

Comandos típicos con CLI:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4.4 `Oracle.ManagedDataAccess.Core` — opcional

**Uso:** instalarlo solo si necesitan usar directamente `OracleConnection`, `OracleCommand`, procedimientos almacenados, parámetros Oracle específicos o consultas ADO.NET de bajo nivel.

```bash
dotnet add package Oracle.ManagedDataAccess.Core
```

No es obligatorio si se trabaja exclusivamente con EF Core. El proveedor `Oracle.EntityFrameworkCore` ya tiene esta dependencia. [web:229][web:230]

## 5. Autenticación, autorización y sesiones

### 5.1 `Microsoft.AspNetCore.Authentication.JwtBearer`

**Uso:** valida tokens JWT enviados por React en el encabezado:

```http
Authorization: Bearer <access-token>
```

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

La API debe validar firma, emisor, audiencia y expiración del token. [web:224][web:226]

Configuración base:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var jwtSection = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSection["Key"]
    ?? throw new InvalidOperationException("JWT Key no configurada.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey)),

            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();
```

### 5.2 `Microsoft.IdentityModel.Tokens` y `System.IdentityModel.Tokens.Jwt`

**Uso:** en muchos proyectos llegan de forma transitiva con JWT Bearer. Sin embargo, pueden agregarse explícitamente si el servicio de autenticación genera JWT manualmente.

```bash
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Microsoft.IdentityModel.Tokens
```

**Uso en el proyecto:**

- Generar access token de corta duración.
- Crear claims de usuario, persona, roles y permisos si el diseño lo requiere.
- Crear refresh token criptográficamente seguro.
- Guardar en `sesiones` únicamente el hash del refresh token.
- Revocar sesión al cerrar sesión, cambiar contraseña o detectar actividad sospechosa.

### 5.3 `BCrypt.Net-Next`

**Uso:** crear y verificar hashes de contraseñas de usuarios.

```bash
dotnet add package BCrypt.Net-Next
```

Ejemplo:

```csharp
var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
var valido = BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash);
```

**Por qué se recomienda:** no deben almacenarse contraseñas con SHA-256 simple, MD5 ni texto plano. BCrypt incorpora salt y costo de cómputo para proteger contraseñas.

### 5.4 `Microsoft.AspNetCore.Identity.PasswordHasher` — alternativa

Alternativa si el equipo prefiere el hasher estándar de ASP.NET Core sin implementar ASP.NET Identity completo.

```bash
dotnet add package Microsoft.Extensions.Identity.Core
```

No instalen BCrypt y `PasswordHasher` para usar ambos sobre la misma columna. Elijan una estrategia y manténganla durante el proyecto.

## 6. Swagger y documentación de API

### 6.1 `Swashbuckle.AspNetCore`

**Uso:** genera documentación OpenAPI/Swagger y una UI para probar endpoints. Es obligatorio por el requerimiento del proyecto.

```bash
dotnet add package Swashbuckle.AspNetCore
```

Swashbuckle genera documentación y una interfaz para explorar/probar endpoints de ASP.NET Core. [web:235][web:236]

Configuración base:

```csharp
using Microsoft.OpenApi.Models;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Sistema Odontológico API",
        Version = "v1",
        Description = "API para gestión clínica, agenda, odontograma, tickets y chatbot."
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingrese: Bearer {token JWT}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
```

En el pipeline:

```csharp
app.UseSwagger();
app.UseSwaggerUI();
```

## 7. Validación de DTOs

### 7.1 `FluentValidation.AspNetCore`

**Uso:** valida DTOs recibidos por endpoints: registrar paciente, crear cita, iniciar sesión, asignar ticket, responder chat, registrar hallazgo dental, etc.

```bash
dotnet add package FluentValidation.AspNetCore
```

Ejemplo de validador para creación de cita:

```csharp
using FluentValidation;

public sealed class CrearCitaRequestValidator
    : AbstractValidator<CrearCitaRequest>
{
    public CrearCitaRequestValidator()
    {
        RuleFor(x => x.PacienteId)
            .GreaterThan(0);

        RuleFor(x => x.ProfesionalId)
            .GreaterThan(0);

        RuleFor(x => x.ServicioId)
            .GreaterThan(0);

        RuleFor(x => x.FechaHoraInicio)
            .GreaterThan(DateTime.UtcNow);

        RuleFor(x => x.FechaHoraFin)
            .GreaterThan(x => x.FechaHoraInicio);
    }
}
```

Registro aproximado:

```csharp
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
```

### 7.2 `MicroElements.Swashbuckle.FluentValidation` — opcional

**Uso:** integra reglas de FluentValidation en Swagger para que la documentación muestre restricciones de entrada.

```bash
dotnet add package MicroElements.Swashbuckle.FluentValidation
```

**Advertencia:** verificar cuidadosamente compatibilidad con la versión elegida de `Swashbuckle.AspNetCore` y .NET. Este paquete tiene versiones específicas por generación de Swagger/FluentValidation. [web:232][web:234]

Para el plazo de 10 días, es opcional: la API puede documentar validaciones mediante descripciones, ejemplos y respuestas `400 Bad Request` aunque no se instale.

## 8. SignalR y notificaciones internas

### 8.1 `Microsoft.AspNetCore.SignalR`

En proyectos ASP.NET Core modernos normalmente SignalR forma parte del framework compartido y no requiere agregar un paquete NuGet adicional.

Para el backend basta con:

```csharp
builder.Services.AddSignalR();
app.MapHub<NotificacionesHub>("/hubs/notificaciones");
```

**Uso en el proyecto:**

- Alertar a recepción cuando el chatbot crea un ticket.
- Avisar a odontólogo cuando se agenda, reprograma o cancela una cita.
- Actualizar tickets en vivo en el panel de recepción.
- Avisar a administrador sobre eventos críticos.
- Actualizar contador de notificaciones no leídas.

Ejemplo de Hub:

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public sealed class NotificacionesHub : Hub
{
}
```

Ejemplo de envío desde un servicio:

```csharp
using Microsoft.AspNetCore.SignalR;

public sealed class NotificacionHubService
{
    private readonly IHubContext<NotificacionesHub> _hubContext;

    public NotificacionHubService(IHubContext<NotificacionesHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public Task NotificarRecepcionAsync(object notificacion)
    {
        return _hubContext.Clients
            .Group("rol:RECEPCIONISTA")
            .SendAsync("NotificacionRecibida", notificacion);
    }
}
```

SignalR permite enviar mensajes a conexiones asociadas a usuarios específicos o a grupos. Esto sirve para grupos como `rol:RECEPCIONISTA`, `rol:ADMINISTRADOR` o notificaciones directas a un odontólogo. [web:144]

### 8.2 `Microsoft.AspNetCore.SignalR.StackExchangeRedis` — opcional

**Uso:** necesario solo si el sistema se despliega en múltiples instancias del backend y SignalR requiere escalar entre servidores mediante Redis.

```bash
dotnet add package Microsoft.AspNetCore.SignalR.StackExchangeRedis
```

Para un solo VPS y una instancia de la API, **no es necesario**.

## 9. Logging, auditoría y manejo de errores

### 9.1 `Serilog.AspNetCore`

**Uso:** logging estructurado de requests, errores, autenticación, tiempos de respuesta y eventos de aplicación.

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

Configuración básica:

```csharp
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/api-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();
```

En el pipeline:

```csharp
app.UseSerilogRequestLogging();
```

ASP.NET Core incluye infraestructura de logging mediante `Microsoft.Extensions.Logging`; Serilog complementa con logging estructurado y sinks para consola, archivos u otros destinos. [web:146]

### 9.2 `Serilog.Sinks.Async` — opcional

**Uso:** evita que escritura a archivos u otros sinks lentos afecte directamente el rendimiento de las solicitudes.

```bash
dotnet add package Serilog.Sinks.Async
```

Para el MVP no es indispensable.

### 9.3 Auditoría propia con `auditoria_eventos`

No se requiere paquete NuGet obligatorio. Implementar un servicio de aplicación propio, por ejemplo `IAuditoriaService`, que guarde eventos en la tabla `auditoria_eventos`.

Registrar como mínimo:

- Inicio de sesión exitoso y fallido.
- Cierre/revocación de sesión.
- Creación, edición, cancelación y atención de citas.
- Cambios de roles y permisos.
- Creación y modificación de antecedentes, historia clínica y odontograma.
- Creación, asignación, resolución y cierre de tickets.

Ejemplo de contrato:

```csharp
public interface IAuditoriaService
{
    Task RegistrarAsync(
        string codigoEvento,
        string descripcion,
        string? entidadTipo = null,
        long? entidadId = null,
        object? datosAnteriores = null,
        object? datosNuevos = null,
        bool exitoso = true,
        string? detalleError = null,
        CancellationToken cancellationToken = default);
}
```

## 10. Consumo de API: chatbot y WhatsApp

### 10.1 `Microsoft.Extensions.Http.Resilience` — recomendado

**Uso:** registra clientes HTTP resilientes para llamadas externas, por ejemplo:

- Backend .NET → API de Meta/Twilio/WhatsApp.
- Backend .NET → servicio de chatbot Python, si se requiere.
- Chatbot Python → API .NET, desde Python se configura resiliencia equivalente.

```bash
dotnet add package Microsoft.Extensions.Http.Resilience
```

Registro conceptual:

```csharp
builder.Services
    .AddHttpClient<IWhatsAppClient, WhatsAppClient>()
    .AddStandardResilienceHandler();
```

Esto ayuda a controlar reintentos, timeouts y fallos transitorios. Para el MVP, se puede usar `AddHttpClient` sin este paquete, pero la resiliencia es recomendable antes de producción.

### 10.2 `Refit` — opcional

**Uso:** crear clientes HTTP tipados declarativos para servicios externos.

```bash
dotnet add package Refit.HttpClientFactory
```

Ejemplo:

```csharp
public interface IWhatsAppApi
{
    [Post("/messages")]
    Task EnviarMensajeAsync([Body] WhatsAppMessageRequest request);
}
```

Para un equipo junior y un plazo corto, `HttpClientFactory` nativo puede ser más sencillo y suficiente.

## 11. Serialización JSON

### 11.1 `System.Text.Json`

Viene incluido en .NET. Es suficiente para DTOs, endpoints REST, datos de auditoría y respuestas API.

No instalar Newtonsoft.Json salvo que exista una integración específica que lo requiera.

### 11.2 `Newtonsoft.Json` — opcional

Instalar únicamente si necesitan capacidades que no resuelvan bien con `System.Text.Json`, como compatibilidad obligatoria con librerías antiguas o serialización JSON compleja heredada.

```bash
dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson
```

Para este proyecto se recomienda mantener `System.Text.Json`.

## 12. Mapeo de DTOs

### 12.1 `Mapster` — recomendado opcional

**Uso:** mapear entidades a DTOs y DTOs a entidades, por ejemplo `Paciente` a `PacienteResponse`, `CrearCitaRequest` a `Cita` o `Odontograma` a DTO de visualización.

```bash
dotnet add package Mapster
dotnet add package Mapster.DependencyInjection
```

Ejemplo:

```csharp
var response = paciente.Adapt<PacienteResponse>();
```

### 12.2 `AutoMapper` — alternativa

```bash
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

Elijan **Mapster o AutoMapper**, no ambos. Para un MVP, Mapster suele requerir menos configuración inicial; AutoMapper es muy conocido y también es válido.

## 13. Cache y control de concurrencia

### 13.1 `Microsoft.Extensions.Caching.Memory`

Incluido normalmente en el framework. Puede usarse para cachear catálogos de lectura frecuente:

- Estados de cita.
- Servicios.
- Especialidades.
- Tipos de documento.
- Superficies dentales.

No usar cache como fuente de verdad para disponibilidad o reservas de citas.

### 13.2 `Microsoft.Extensions.Caching.StackExchangeRedis` — opcional

Usar solo si el equipo incorpora Redis para cache distribuido, SignalR escalado, rate limiting distribuido o colas.

```bash
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis
```

Para un único VPS no es necesario durante el MVP.

### 13.3 Concurrencia de citas

No se resuelve con un paquete. Debe implementarse en la API usando:

- Transacciones de base de datos.
- Validación de solapamiento antes de insertar o reprogramar.
- Índices por `profesional_id` y fecha/hora.
- Opcionalmente, tokens de concurrencia/versión si se agrega una columna de control.

## 14. Paquetes no necesarios inicialmente

No agreguen estos paquetes solo por moda. Aumentan complejidad y no son imprescindibles para cumplir el alcance de 10 días.

| Paquete o tecnología | Por qué no es obligatorio ahora |
|---|---|
| MediatR | Útil en CQRS, pero no esencial para una API pequeña si la arquitectura ya está clara |
| MassTransit / RabbitMQ | No se requiere mensajería distribuida para un solo VPS; las tablas de notificación y workers cubren el MVP |
| Hangfire | Útil para recordatorios recurrentes, pero un `BackgroundService` puede ser suficiente para el MVP |
| Quartz.NET | Alternativa para tareas programadas; usarlo solo si el equipo necesita cron complejo |
| Redis | No necesario con una sola instancia del backend |
| Docker SDK para .NET | Docker se configura con archivos Dockerfile y docker-compose, no desde el backend |
| ASP.NET Core Identity completo | Puede ser excesivo si ya existe modelo propio de `usuarios`, `roles`, `permisos` y `sesiones` |
| Repositories genéricos | EF Core ya implementa patrones Unit of Work y Repository; no agregarlos sin una necesidad real |

## 15. Scheduler para recordatorios

El sistema necesita enviar recordatorios automáticos de citas y procesar notificaciones WhatsApp pendientes.

### Opción MVP: `BackgroundService` nativo

No necesita paquete adicional.

```csharp
public sealed class RecordatoriosWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public RecordatoriosWorker(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var servicio = scope.ServiceProvider
                .GetRequiredService<IProcesadorNotificacionesService>();

            await servicio.ProcesarPendientesAsync(stoppingToken);

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
```

Registro:

```csharp
builder.Services.AddHostedService<RecordatoriosWorker>();
```

### Opción futura: `Hangfire`

Usar solo si necesitan dashboard, reintentos configurables, tareas diferidas complejas y persistencia de jobs.

```bash
dotnet add package Hangfire.AspNetCore
```

Para Oracle deben validar primero compatibilidad del storage elegido. No lo adopten sin necesidad durante el MVP.

## 16. Recomendación de paquetes por proyecto

Si usan Clean Architecture con proyectos separados, la distribución sugerida es:

| Proyecto | Paquetes principales |
|---|---|
| `Domain` | Ninguno o solo dependencias muy puntuales. Debe permanecer limpio de EF Core, Oracle y Web API |
| `Application` | `FluentValidation`, `Mapster` o `AutoMapper` |
| `Infrastructure` | `Oracle.EntityFrameworkCore`, `Microsoft.EntityFrameworkCore.Design`, JWT/BCrypt si sus implementaciones viven aquí, Serilog sinks, HTTP clients |
| `WebApi` | `Microsoft.AspNetCore.Authentication.JwtBearer`, `Swashbuckle.AspNetCore`, `Serilog.AspNetCore`, SignalR, configuración de DI |

## 17. Lista final recomendada para el MVP

Instalar inicialmente:

```bash
dotnet add package Oracle.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Microsoft.IdentityModel.Tokens
dotnet add package BCrypt.Net-Next
dotnet add package Swashbuckle.AspNetCore
dotnet add package FluentValidation.AspNetCore
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
dotnet add package Microsoft.Extensions.Http.Resilience
dotnet add package Mapster
dotnet add package Mapster.DependencyInjection
```

Instalar solo si se requiere:

```bash
# ADO.NET Oracle directo o procedimientos almacenados
dotnet add package Oracle.ManagedDataAccess.Core

# Mostrar validaciones FluentValidation dentro de Swagger
dotnet add package MicroElements.Swashbuckle.FluentValidation

# Clientes HTTP declarativos
dotnet add package Refit.HttpClientFactory

# Escalamiento de SignalR a varias instancias
dotnet add package Microsoft.AspNetCore.SignalR.StackExchangeRedis

# Cache distribuido Redis
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis
```

## 18. Checklist antes de iniciar

- [ ] Crear solución y proyectos de arquitectura.
- [ ] Agregar `Oracle.EntityFrameworkCore` y configurar conexión Oracle mediante variable de entorno.
- [ ] Crear entidades y configuraciones Fluent API según el DBML.
- [ ] Crear primera migración o DDL de Oracle según la estrategia acordada.
- [ ] Configurar JWT, `password_hash`, sesiones y refresh token.
- [ ] Configurar Swagger con botón Authorize Bearer.
- [ ] Configurar FluentValidation para DTOs.
- [ ] Configurar middleware global de excepciones y respuestas estándar.
- [ ] Configurar Serilog y no registrar secretos, contraseñas ni tokens.
- [ ] Configurar SignalR para `NotificacionesHub`.
- [ ] Implementar auditoría de inicio de sesión, citas, tickets, roles y odontograma.
- [ ] Implementar worker de notificaciones WhatsApp y recordatorios.
- [ ] Documentar cada endpoint en Swagger: entrada, salida, códigos de respuesta y permisos requeridos.