---
title: "Base de Datos Oracle y Caché Semántica"
order: 3
author: "NexusOdonto DBA & Architecture Team"
date: "2026-09-16"
---

# Base de Datos Oracle y Caché Semántica

NexusOdonto combina la robustez transaccional ACID de Oracle Database con el alto rendimiento de búsqueda vectorial de PostgreSQL para la inteligencia artificial.

---

## 1. Esquema Relacional Principal (Oracle 19c / 23ai)

El modelo de datos se gestiona mediante migraciones de Entity Framework Core con tablas creadas en el tablespace por defecto de la aplicación.

### Tablas Principales

| Tabla / Entidad | Descripción | Claves Foráneas / Índices Clave |
|---|---|---|
| `PERSONS` | Datos personales base de pacientes, doctores y empleados. | `DocumentTypeId`, índice único en `DocumentNumber`. |
| `USERS` | Cuentas de acceso con hash de contraseña BCrypt. | `PersonId` (1:1), campos `IsActive`, `GoogleId`. |
| `ROLES` | Definición canónica de roles del sistema. | `Code` único (`ADMINISTRADOR`, `ODONTOLOGO`, etc.). |
| `PERMISSIONS` | Permisos atómicos granulares del sistema. | `Code` único (`PATIENTS:VIEW`, `ODONTOGRAM:CREATE`, etc.). |
| `USER_ROLES` | Relación muchos a muchos entre usuarios y roles. | (`UserId`, `RoleId`) clave compuesta. |
| `ROLE_PERMISSIONS`| Asignación de permisos por rol. | (`RoleId`, `PermissionId`) clave compuesta. |
| `EMPLOYEES` | Ficha laboral de administradores, recepcionistas y asistentes. | `PersonId`, `JobTitleId`, `EmployeeCode` único. |
| `PROFESSIONALS` | Ficha profesional de odontólogos y especialistas. | `PersonId`, `SpecialtyId`, `LicenseNumber`. |
| `PATIENTS` | Ficha clínica y antecedentes de pacientes. | `PersonId`, `EmergencyContact`, `BloodType`. |
| `SERVICES` | Catálogo de procedimientos odontológicos y tarifas. | `Code`, `Category`, `Price`, `IsActive`. |
| `APPOINTMENTS` | Citas médicas y estado de agendamiento. | `PatientId`, `ProfessionalId`, `ServiceId`, `AppointmentDateTime`. |
| `ODONTOGRAMS` | Cabecera del odontograma por sesión o paciente. | `PatientId`, `ProfessionalId`, `RecordDate`. |
| `ODONTOGRAM_ITEMS`| Estado individual de cada diente y superficie. | `OdontogramId`, `ToothNumber`, `SurfaceCode`, `StatusCode`. |
| `CLINICAL_RECORDS`| Evoluciones e historia clínica longitudinal. | `PatientId`, `ProfessionalId`, `EvolutionNote` (max 2000 ch). |
| `CHATBOT_TICKETS` | Tickets de soporte escalados a recepcionistas/asesores. | `ConversationId`, `Status`, `AssignedAdvisorId`. |

---

## 2. Reglas Técnicas y Consideraciones Oracle (Anti-ORA Errors)

1. **Truncamiento Preventivo de Notas Clínicas (Anti-ORA-12899):**
   * Oracle limita columnas `VARCHAR2(2000)` a 2000 bytes. Almacenar caracteres acentuados o emojis puede exceder el límite en codificación UTF-8.
   * El servicio de Odontograma y Evoluciones ejecuta un sanitizado y recorte automático de cadenas a 2000 caracteres antes de persistir:
   ```csharp
   if (!string.IsNullOrEmpty(request.Notes) && request.Notes.Length > 2000)
   {
       request.Notes = request.Notes.Substring(0, 2000);
   }
   ```

2. **Eliminación del marcador de estado legacy (`ODONTOGRAM_STATE`):**
   * Se eliminó el almacenamiento redundante de JSON serialized en texto para los estados dentales, migrando a filas normalizadas en `ODONTOGRAM_ITEMS` para optimizar consultas e integridad referencial.

3. **Soft Delete y Filtros Globales de Consulta:**
   * Las entidades implementan `IsActive` o `IsDeleted`.
   * En `DatabaseInitializer`, se utiliza `.IgnoreQueryFilters()` para reactivar cuentas semilla (como el Admin `AD001`) si fueron marcadas como inactivas accidentalmente.

---

## 3. Base de Datos de Caché Semántica (PostgreSQL + Pgvector)

El chatbot utiliza una base de datos auxiliar para almacenar vectores de embeddings (768 dimensiones) generados con `text-embedding-004` de Google.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE semantic_cache (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    response_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hit_count INT DEFAULT 1
);

CREATE INDEX semantic_cache_embedding_idx 
ON semantic_cache USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```
