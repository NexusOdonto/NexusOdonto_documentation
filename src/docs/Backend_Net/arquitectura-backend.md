---
title: "Arquitectura del Backend .NET"
order: 1
author: "Ing. Marcos Silva"
date: "2026-08-23"
---

Guía detallada sobre la estructura, patrones de diseño y convenciones utilizadas en el backend de NexusOdonto, construido sobre **.NET 8**.

> [!NOTE] Consejos Clave
> El proyecto sigue los principios de la **Arquitectura Limpia (Clean Architecture)** para separar las reglas de negocio de los detalles de implementación de frameworks y bases de datos.

## Estructura de Solución

La solución está dividida en cuatro capas principales que interactúan mediante inyección de dependencias, asegurando un bajo acoplamiento.

### 1. Domain
Contiene las entidades del negocio, interfaces de repositorios y excepciones de dominio. No tiene dependencias externas.

### 2. Application
Implementa los casos de uso del sistema. Define DTOs, validaciones e interfaces de servicios externos.

### 3. Infrastructure
Implementaciones concretas: Entity Framework Core, acceso a datos, integraciones de correo y almacenamiento.

### 4. API (Presentation)
Controladores REST, configuración de Swagger, Middlewares globales y registro de inyección de dependencias.

---

## Implementación de CQRS

Utilizamos la librería **MediatR** para implementar el patrón Command Query Responsibility Segregation (CQRS) en la capa de Aplicación.

```csharp
// CreatePatientCommand.cs
using MediatR;
using NexusOdonto.Domain.Entities;

namespace NexusOdonto.Application.Patients.Commands;

public record CreatePatientCommand(
    string FirstName,
    string LastName,
    string DocumentId,
    string Email
) : IRequest<Guid>;

public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, Guid>
{
    private readonly IPatientRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreatePatientCommandHandler(IPatientRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
    {
        var patient = new Patient(request.FirstName, request.LastName, request.DocumentId);

        await _repository.AddAsync(patient, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return patient.Id;
    }
}
```

> [!IMPORTANT] Nota sobre Validaciones
> Las validaciones de los comandos se realizan utilizando **FluentValidation** en un Pipeline Behavior de MediatR, asegurando que los comandos inválidos nunca lleguen al Handler.
