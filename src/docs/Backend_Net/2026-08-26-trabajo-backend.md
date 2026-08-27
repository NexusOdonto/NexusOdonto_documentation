# Trabajo backend — 26 de agosto de 2026

**Autor:** Alejandro Escobar

Documentación del avance realizado en **NexusOdontoBackend_Api** el 26/08/2026, basada únicamente en los commits de git de ese día.

---

## Resumen ejecutivo

El día se centró en consolidar el dominio y la capa de aplicación tras el trabajo clínico del 25/08:

1. **Organización de DTOs** iniciales (`CrearPaciente` / `CrearServicio`) y merge del flujo clínico REST (#34).
2. **DotNetEnv** para cargar `.env` desde la raíz del API y unificación del patrón de dominio `Update(...)` en entidades clínicas y de seguridad (#35).
3. **Rewrite del Domain en inglés**: bases `Entity` / `BaseEntity` / `CatalogEntity` y módulos People, Catalogs, Clinical, Schedule, Odontogram, Notifications, Chatbot, Audit y Security; controllers, services y DTOs alineados; autenticación con `PersonId` + `UserRole`; Mapster registrado en `Program.cs` (#36).
4. **Fluent API EF Core**: configurations para todos los modelos de Domain (~52) y `ApplyConfigurationsFromAssembly` en `AppDbContext` (#37).
5. **Capas de DTOs** de identidad, agenda, catálogos, clínica, odontograma, chatbot y notificaciones (#38 + commit hacia #41).

**PRs mergeados ese día:** #34, #35, #36, #37, #38. El commit de DTOs clínicos/odontograma (`b25293e`) dejó listo el avance que se mergeó como #41 al día siguiente (27/08).

---

## Commits y PRs (orden cronológico)

| Hora (aprox.) | Commit / merge | Descripción |
|---------------|----------------|-------------|
| 08:30 | `7dd3af5` | Reorganización de `CrearPacienteRequestDto` y `CrearServicioRequestDto` en sus carpetas |
| 08:44 | `a51ac15` — **PR #34** | Merge `feat/clinical-rest-endpoints` |
| 08:57 | `75a31ae` | DotNetEnv + refactor de métodos de actualización en entidades |
| 08:58 | `4192f07` — **PR #35** | Merge en `Infra-AppDbContext` |
| 11:46 | `1818455` | Domain/API en inglés, Mapster, auth con `PersonId` / `UserRole`, limpieza de controllers |
| 11:47 | `aa10c05` — **PR #36** | Merge del rewrite de dominio/auth |
| 12:17 | `1160304` | Entity configurations EF Core para todos los modelos Domain |
| 12:17 | `dad05d2` — **PR #37** | Merge `feature-cracion_configuration` |
| 14:11 | `98e06ad` | DTOs de catálogos, empleados y modelos Create/Update |
| 14:14 | `d4b0db9` | DTOs de catálogos restantes + actualización de Cita y Disponibilidad |
| 14:15 | `a320889` — **PR #38** | Merge `feature/dtos-identity-scheduling` |
| 17:01 | `b25293e` | DTOs de catálogos (EN), clínico, odontograma, chatbot y notificaciones (avance hacia **#41**) |

---

## DotNetEnv y patrón de dominio (`Update` / constructores)

- En `Api/Program.cs` se carga el archivo `.env` subiendo directorios desde el content root (`LoadEnvFile`) y se agregan variables de entorno a la configuración.
- Las entidades de Domain usan constructor privado + constructor público con invariantes, y métodos `Update(...)` / helpers (`Deactivate`, `RegisterAccess`) que actualizan `UpdatedAt`.
- Bases compartidas en `Domain/Common`:
  - `Entity` — identidad
  - `BaseEntity` — `CreatedAt`, `UpdatedAt`, `IsActive`, `Deactivate()`
  - `CatalogEntity` — catálogos tipados

---

## Rewrite Domain en inglés y carpetas

Módulos bajo `Domain/Entities/`:

| Módulo | Contenido (ejemplos) |
|--------|----------------------|
| **People** | `Person`, `User`, `Patient`, `Employee`, `Professional`, `Session` |
| **Catalogs** | especialidades, estados, tipos, servicios, etc. |
| **Clinical** | historia, atención, diagnósticos, antecedentes, procedimientos |
| **Schedule** | citas, disponibilidades |
| **Odontogram** | odontograma, dientes, hallazgos |
| **Notifications** | hub y WhatsApp |
| **Chatbot** | conversaciones, mensajes, tickets de soporte |
| **Audit** | eventos de auditoría |
| **Security** | `Role`, `Permission`, `UserRole`, `ActionPermission` |

Controllers, services y parte de los DTOs pasaron a nombres en inglés; en Application coexisten carpetas legacy en español (`Catalogos`, `Citas`, `Usuarios`, …) con las nuevas en inglés (`Catalogs`, `Clinical`, `Odontogram`, …).

---

## Joins M:N: `ICollection` y `UserRole` con payload

- Relaciones muchos-a-muchos “solo FK” se modelan con navegaciones `ICollection<T>` (p. ej. `Role` ↔ `Permission`, `Professional` ↔ `Specialty`), sin entidades puente vacías.
- **`UserRole`** sí es entidad propia en `Domain/Entities/Security` porque lleva payload (`AssignedAt`) además de `UserId` / `RoleId`.
- Auth/registro usan `PersonId` en `User` y asocian roles vía `UserRole` (p. ej. en `AuthService.RegisterAsync`).

---

## Configurations EF Core (Infrastructure)

- ~52 classes `IEntityTypeConfiguration<T>` bajo `Infrastructure/Configurations/`, espejo de los módulos Domain (People, Catalogs, Clinical, Schedule, Odontogram, Notifications, Chatbot, Audit, Security).
- `AppDbContext.OnModelCreating` aplica `modelBuilder.ApplyConfigurationsFromAssembly(...)`.
- Índices y FKs relevantes (p. ej. `PersonId` único en `User` / `Patient` / `Employee`).

---

## Mapster en Program

Estado verificado en el código actual de `Api/Program.cs`:

- Se registran `TypeAdapterConfig.GlobalSettings` (singleton) e `IMapper` / `ServiceMapper` (scoped).
- Comentario explícito: *“Mapster kept registered for future DTO mapping configs.”*
- **No hay** perfiles `TypeAdapterConfig` ni usos de `Adapt<>` / `IMapper` fuera de ese registro: el mapeo activo sigue siendo manual (p. ej. `AuthService.MapToResponse`).

---

## Capas de DTOs

| Área | Ubicación (Application/DTOs) | Notas |
|------|------------------------------|-------|
| Auth | `Auth/` | `LoginRequestDto` (email + password), register, responses |
| Identidad / agenda (ES) | `Personas`, `Empleados`, `Usuarios`, `Roles`, `Permisos`, `Citas`, `Disponibilidades`, `Sesiones`, `Catalogos`, … | Introducidos en #38 |
| Clínica / odontograma / chat (EN) | `Catalogs`, `Clinical`, `Odontogram`, `Chatbot`, `Notifications`, `Support`, `Patient`, `Service`, … | Commit `b25293e` (hacia #41) |

Hay ~98 archivos DTO; conviven nomenclatura en español e inglés según el momento del refactor.

---

## Archivos y stack clave

| Área | Rutas / piezas |
|------|----------------|
| Host | `Api/Program.cs` (DotNetEnv, Serilog, Swagger, Mapster, Infrastructure) |
| Auth | `Api/Controllers/AuthController.cs`, `Application/Services/AuthService.cs` |
| REST existentes | `PatientsController`, `ServicesController`, `UsersController` (+ auth login) |
| Domain | `Domain/Common/*`, `Domain/Entities/**` |
| EF | `Infrastructure/Data/Context/AppDbContex.cs`, `Infrastructure/Configurations/**` |
| DI | `Infrastructure/DependencyInjection.cs` (Oracle + `IUnitOfWork`) |
| Contratos | `IRepository<T>`, `IUserRepository`, `IUnitOfWork` |

**Stack del día:** .NET API, EF Core + Oracle, Fluent API configurations, DotNetEnv, Mapster (registro), BCrypt + JWT en auth, Serilog.

---

## Pendientes sugeridos (estado real del repo)

Basados en el código actual, no en trabajo inventado:

1. **Implementar y registrar repositorios** — `Infrastructure/Repositories` solo tiene `.gitkeep`; `DependencyInjection` registra `AppDbContext` y `UnitOfWork`, pero **no** `IRepository<>` ni `IUserRepository`, aunque controllers/services ya los inyectan.
2. **Unificar DTOs ES/EN** — migrar o eliminar carpetas legacy en español para una sola convención en inglés alineada al Domain.
3. **Perfiles Mapster** — o bien definir mappings Create/Update/Response, o retirar el registro si el mapeo seguirá manual.
4. **Login por username** — el login actual es solo por **email** (`LoginRequestDto`); no existe propiedad `Username` en el modelo de usuario.
5. **Completar servicios/controllers** para módulos con Domain + DTOs pero sin API (agenda, clínica, odontograma, notificaciones, chatbot).
6. **PR #41** — el contenido de `b25293e` se mergeó el **27/08** (`6dc8abf`); documentar/validar ese merge en el seguimiento del día siguiente.

---

*Documentado por Alejandro Escobar — 26/08/2026*
