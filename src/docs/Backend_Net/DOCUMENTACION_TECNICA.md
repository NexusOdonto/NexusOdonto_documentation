# Documentación Técnica: Núcleo Arquitectónico y Resiliencia de la API

Esta documentación detalla los componentes fundamentales establecidos en las capas de **Domain**, **Application** y **Api** para la solución **NexusOdontoBackend_Api**. Estos cimientos garantizan la pureza del dominio, transaccionalidad aislada, manejo centralizado y seguro de excepciones, y resiliencia en comunicaciones externas.

---

## Tabla de Contenidos
1. [Visión General de la Arquitectura](#1-visión-general-de-la-arquitectura)
2. [Capa Domain: Núcleo y Auditoría Base](#2-capa-domain-núcleo-y-auditoría-base)
   - [BaseEntity.cs](#baseentitycs)
3. [Capa Application: Contratos Transaccionales y Excepciones](#3-capa-application-contratos-transaccionales-y-excepciones)
   - [Patrón Unit of Work (`IUnitOfWork.cs`)](#patrón-unit-of-work-iunitofworkcs)
   - [Excepciones Personalizadas (`NotFoundException.cs`, `ValidationException.cs`)](#excepciones-personalizadas)
4. [Capa Api: Middleware de Excepciones y Clientes HTTP Resilientes](#4-capa-api-middleware-de-excepciones-y-clientes-http-resilientes)
   - [GlobalExceptionMiddleware.cs](#globalexceptionmiddlewarecs)
   - [Clientes HTTP Resilientes (`AppExtensions.cs`)](#clientes-http-resilientes-appextensionscs)
   - [Pipeline de Aplicación (`Program.cs`)](#pipeline-de-aplicación-programcs)
5. [Guía de Uso y Ejemplos](#5-guía-de-uso-y-ejemplos)

---

## 1. Visión General de la Arquitectura

El sistema sigue los principios de **Clean Architecture** (Arquitectura Limpia), organizando las responsabilidades en capas desacopladas:

```text
[ Cliente React / Servicios Externos ]
                  │
                  ▼ (HTTP / JSON)
        [ Capa API (Controllers) ]
        ├── GlobalExceptionMiddleware (Manejo de Errores)
        └── Resilient HttpClients (WhatsApp / Agente Python)
                  │
                  ▼
    [ Capa Application (Casos de Uso) ]
        ├── IUnitOfWork (Contratos Transaccionales)
        └── Custom Exceptions (NotFound, Validation)
                  │
                  ▼
      [ Capa Domain (Reglas de Negocio) ]
        └── BaseEntity (Id, Auditoría y Soft Delete)
```

---

## 2. Capa Domain: Núcleo y Auditoría Base

El proyecto **Domain** se mantiene totalmente puro (cero dependencias a frameworks de persistencia como Entity Framework Core o a la infraestructura).

### `BaseEntity.cs`
Clase base abstracta de la cual heredarán todas las entidades del sistema (ej. `Usuario`, `Paciente`, `Cita`). Estandariza la clave primaria y provee campos de auditoría básica y borrado lógico (*Soft Delete*).

- **Ubicación:** `Domain/Common/BaseEntity.cs`
- **Namespace:** `Domain.Common`

```csharp
namespace Domain.Common;

public abstract class BaseEntity
{
    public long Id { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime? FechaActualizacion { get; set; }
    public bool Activo { get; set; } = true;
}
```

#### Especificación de Campos:
- **`Id` (`long`)**: Identificador único y clave primaria estándar.
- **`FechaCreacion` (`DateTime`)**: Stamp de fecha/hora en formato UTC asignado automáticamente al instanciar.
- **`FechaActualizacion` (`DateTime?`)**: Nulo por defecto. Debe actualizarse únicamente cuando se modifique la entidad.
- **`Activo` (`bool`)**: Indicador para borrado lógico (*Soft Delete*), previniendo la eliminación física de registros clínicos de la base de datos.

---

## 3. Capa Application: Contratos Transaccionales y Excepciones

La capa de aplicación define los contratos de persistencia y la jerarquía de excepciones de negocio.

### Patrón Unit of Work (`IUnitOfWork.cs`)
Aísla la tecnología de persistencia de la capa de aplicación y permite coordinar múltiples operaciones de repositorio en una transacción atómica.

- **Ubicación:** `Application/Contracts/Repositories/IUnitOfWork.cs`
- **Namespace:** `Application.Contracts.Repositories`

```csharp
namespace Application.Contracts.Repositories;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
```

#### Firma de Métodos:
- `SaveChangesAsync`: Persiste de forma asíncrona todos los cambios pendientes en el contexto.
- `BeginTransactionAsync`: Inicia explícitamente una transacción de base de datos.
- `CommitTransactionAsync`: Confirma la transacción actual.
- `RollbackTransactionAsync`: Revierte los cambios de la transacción actual si ocurre un fallo.

---

### Excepciones Personalizadas

Permiten a los servicios de aplicación lanzar excepciones fuertemente tipadas sin preocuparse por la representación HTTP.

- **Ubicación:** `Application/Exceptions/`
- **Namespace:** `Application.Exceptions`

#### 1. `NotFoundException.cs` (HTTP 404)
```csharp
namespace Application.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException()
        : base("El recurso solicitado no fue encontrado.")
    {
    }

    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string name, object key)
        : base($"El recurso '{name}' con clave ({key}) no fue encontrado.")
    {
    }
}
```

#### 2. `ValidationException.cs` (HTTP 400)
Soporta captura manual de errores en diccionario y mapeo automático de resultados de **FluentValidation**.

```csharp
using FluentValidation.Results;

namespace Application.Exceptions;

public class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException()
        : base("Se han producido uno o más errores de validación.")
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(string message)
        : base(message)
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("Se han producido uno o más errores de validación.")
    {
        Errors = errors;
    }

    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this("Se han producido uno o más errores de validación.")
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }
}
```

---

## 4. Capa Api: Middleware de Excepciones y Clientes HTTP Resilientes

### `GlobalExceptionMiddleware.cs`
Middleware personalizado que envuelve la ejecución del pipeline HTTP. Intercepta excepciones de dominio y errores no controlados, evitando la devolución de páginas HTML predeterminadas de ASP.NET Core o la filtración de *stack traces*.

- **Ubicación:** `Api/Middleware/GlobalExceptionMiddleware.cs`
- **Namespace:** `Api.Middleware`

#### Mapeo de Códigos HTTP:
| Excepción | Código HTTP | Nivel de Log |
| :--- | :---: | :--- |
| `ValidationException` | `400 Bad Request` | Warning |
| `NotFoundException` / `KeyNotFoundException` | `404 Not Found` | Warning |
| `UnauthorizedAccessException` | `401 Unauthorized` | Warning |
| Excepción no controlada (`Exception`) | `500 Internal Server Error` | **Error (Serilog)** |

#### Estructura de Respuesta JSON (`ErrorResponse`):
```json
{
  "status": 400,
  "message": "Se han producido uno o más errores de validación.",
  "details": {
    "email": [
      "El formato del correo electrónico no es válido."
    ]
  }
}
```

En errores 500 (Server Error):
```json
{
  "status": 500,
  "message": "Ha ocurrido un error interno en el servidor."
}
```

---

### Clientes HTTP Resilientes (`AppExtensions.cs`)
Configuración centralizada de clientes HTTP preparados para la comunicación con webhook de WhatsApp/Telegram y el Agente Python.

- **Ubicación:** `Api/Extensions/AppExtensions.cs`
- **Namespace:** `Api.Extensions`

Utiliza la extensión nativa `.AddStandardResilienceHandler()` de `Microsoft.Extensions.Http.Resilience`, la cual incluye automáticamente:
- **Retry Policy** (Reintentos exponenciales)
- **Circuit Breaker** (Disyuntor)
- **Timeout** (Tiempos de espera)
- **Rate Limiter** (Control de tasa de peticiones)

```csharp
using Api.Middleware;
using Microsoft.Extensions.Http.Resilience;

namespace Api.Extensions;

public static class AppExtensions
{
    public static IServiceCollection AddResilientHttpClients(this IServiceCollection services)
    {
        services.AddHttpClient("WhatsAppWebhook")
            .AddStandardResilienceHandler();

        services.AddHttpClient("PythonAgent")
            .AddStandardResilienceHandler();

        return services;
    }

    public static IApplicationBuilder UseGlobalExceptionMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionMiddleware>();
    }
}
```

---

### Pipeline de Aplicación (`Program.cs`)
Configuración principal de arranque en `Program.cs` integrando **Serilog**, clientes resilientes y el registro temprano del middleware global.

- **Ubicación:** `Api/Program.cs`

```csharp
using Api.Extensions;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configuración de Serilog para logging estructurado
builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console());

// Registro de servicios de infraestructura y API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Registrar clientes HTTP con políticas de resiliencia
builder.Services.AddResilientHttpClients();

var app = builder.Build();

// Registrar Middleware de Excepciones tempranamente en el pipeline
app.UseGlobalExceptionMiddleware();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

## 5. Guía de Uso y Ejemplos

### Ejemplo 1: Crear una Entidad en Domain
```csharp
using Domain.Common;

namespace Domain.Entities;

public class Paciente : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;
    public string DocumentoIdentidad { get; set; } = string.Empty;
}
```

### Ejemplo 2: Lanzar Excepciones en un Servicio de Aplicación
```csharp
public async Task<PacienteDto> ObtenerPorIdAsync(long id)
{
    var paciente = await _pacienteRepository.GetByIdAsync(id);
    if (paciente == null)
    {
        throw new NotFoundException("Paciente", id);
    }
    return paciente.Adapt<PacienteDto>();
}
```

### Ejemplo 3: Inyección y Consumo de Clientes HTTP Resilientes
```csharp
public class BotIntegrationService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public BotIntegrationService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task EnviarNotificacionAsync(object payload)
    {
        var client = _httpClientFactory.CreateClient("PythonAgent");
        var response = await client.PostAsJsonAsync("/api/v1/agent", payload);
        response.EnsureSuccessStatusCode();
    }
}
```
