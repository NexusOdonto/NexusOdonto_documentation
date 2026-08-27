# Documentación de Configuración de Entidades en Entity Framework Core

- **Autor:** Felipe Corredor
- **Fecha:** 26 de agosto de 2026
- **Proyecto:** NexusOdonto API
- **Capa:** Infrastructure (`Infrastructure/Configurations`)

---

## 1. Resumen Ejecutivo

El 26 de agosto de 2026, Felipe Corredor implementó la arquitectura de configuración de entidades para Entity Framework Core utilizando Fluent API (`IEntityTypeConfiguration<T>`). 

Esta implementación permite desacoplar las reglas del modelo relacional (nombres de tablas, columnas, restricciones de longitud, valores por defecto, índices y relaciones) de las clases del dominio (`Domain`), garantizando una arquitectura limpia, mantenible y escalable.

---

## 2. Convenciones y Estándares Aplicados

Durante el proceso de configuración se aplicaron los siguientes estándares técnicos:

- **Nombre de Tablas y Columnas en Mapeo Relacional:** Mapeo explícito a formato `snake_case` para mantener compatibilidad y estándar en base de datos PostgreSQL/SQL Server (`ToTable` y `HasColumnName`).
- **Claves Primarias:** Definición explícita de clave primaria (`HasKey`) e incremento automático (`ValueGeneratedOnAdd`).
- **Restricciones de Longitud:** Aplicación de límites máximos de caracteres (`HasMaxLength`) en atributos de texto para prevenir desbordamientos y optimizar el almacenamiento.
- **Campos Obligatorios:** Marcar explícitamente atributos no nulos (`IsRequired`).
- **Valores por Defecto:** Configuración de valores por defecto para estados booleanos (`HasDefaultValue(true)`) y marcas de tiempo (`HasDefaultValueSql("CURRENT_TIMESTAMP")`).
- **Índices de Rendimiento y Unicidad:** Creación de índices compuestos y únicos (`HasIndex`) en campos clave como correos electrónicos, documentos de identidad y combinaciones de búsqueda frecuente.

---

## 3. Módulos y Entidades Configuradas

Se estructuraron y configuraron un total de 52 entidades de dominio distribuidas en 9 módulos funcionales dentro de la carpeta `Infrastructure/Configurations`:

### Módulo Audit (Auditoría)
- AuditEventConfiguration: Mapeo de eventos de auditoría del sistema.

### Módulo Catalogs (Catálogos y Parámetros)
- ActionPermissionConfiguration: Permisos de acción.
- AntecedentTypeConfiguration: Tipos de antecedentes médicos.
- AppointmentOriginConfiguration: Orígenes de citas.
- AppointmentStatusConfiguration: Estados de citas.
- AuditEventTypeConfiguration: Tipos de eventos de auditoría.
- ChatChannelConfiguration: Canales de chat.
- ChatbotConversationStatusConfiguration: Estados de conversación del chatbot.
- ChatbotMessageRoleConfiguration: Roles de mensajes en chatbot.
- DentalSurfaceConfiguration: Superficies dentales.
- DentitionTypeConfiguration: Tipos de dentición.
- DocumentTypeConfiguration: Tipos de documento de identidad.
- FindingStatusConfiguration: Estados de hallazgos odontológicos.
- FindingTypeConfiguration: Tipos de hallazgos.
- HubNotificationStatusConfiguration: Estados de notificación Hub.
- HubNotificationTypeConfiguration: Tipos de notificación Hub.
- JobTitleConfiguration: Cargos laborales.
- NotificationPriorityConfiguration: Prioridades de notificación.
- ServiceConfiguration: Servicios odontológicos.
- SessionStatusConfiguration: Estados de sesión de usuario.
- SexConfiguration: Géneros/sexos.
- SpecialtyConfiguration: Especialidades médicas/odontológicas.
- SupportTicketReasonConfiguration: Razones de soporte.
- SupportTicketStatusConfiguration: Estados de ticket de soporte.
- ToothStatusConfiguration: Estados del diente.
- WhatsAppNotificationStatusConfiguration: Estados de notificación WhatsApp.
- WhatsAppNotificationTypeConfiguration: Tipos de notificación WhatsApp.

### Módulo Chatbot (Asistente Virtual y Soporte)
- ChatbotConversationConfiguration: Conversaciones con el chatbot.
- ChatbotMessageConfiguration: Mensajes individuales de la interacción.
- SupportTicketConfiguration: Tickets de soporte técnico.

### Módulo Clinical (Historia y Atención Clínica)
- ClinicalAttentionConfiguration: Atenciones clínicas registradas.
- ClinicalHistoryConfiguration: Historias clínicas de pacientes.
- DiagnosisConfiguration: Diagnósticos odontológicos.
- PatientAntecedentConfiguration: Antecedentes del paciente.
- ProcedurePerformedConfiguration: Procedimientos realizados.

### Módulo Notifications (Notificaciones)
- HubNotificationConfiguration: Notificaciones internas de la plataforma.
- WhatsAppNotificationConfiguration: Notificaciones y envíos vía WhatsApp.

### Módulo Odontogram (Odontograma)
- DentalFindingConfiguration: Hallazgos encontrados en piezas dentales.
- OdontogramConfiguration: Registro general del odontograma.
- OdontogramToothConfiguration: Relación pieza dental u odontograma.
- ToothConfiguration: Piezas dentales individuales.

### Módulo People (Gestión de Personas y Usuarios)
- EmployeeConfiguration: Empleados del sistema.
- PatientConfiguration: Pacientes.
- PersonConfiguration: Datos personales base.
- ProfessionalConfiguration: Odontólogos y profesionales.
- SessionConfiguration: Sesiones activas de usuarios.
- UserConfiguration: Credenciales y cuentas de usuarios.

### Módulo Schedule (Agenda y Citas)
- AppointmentConfiguration: Citas médicas programadas.
- AvailabilityConfiguration: Disponibilidad de profesionales.

### Módulo Security (Seguridad y Control de Acceso)
- PermissionConfiguration: Permisos del sistema.
- RoleConfiguration: Roles de usuario.
- UserRoleConfiguration: Relación de asignación de roles a usuarios.

---

## 4. Patrón de Código Implementado

A continuación se ilustra el patrón utilizado en la implementación de las clases de configuración:

```csharp
using Domain.Entities.People;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations.People;

public class PersonConfiguration : IEntityTypeConfiguration<Person>
{
    public void Configure(EntityTypeBuilder<Person> builder)
    {
        builder.ToTable("persons");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(c => c.DocumentTypeId)
            .HasColumnName("document_type_id")
            .IsRequired();

        builder.Property(c => c.DocumentNumber)
            .HasColumnName("document_number")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(c => c.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(c => c.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        builder.HasIndex(c => new { c.DocumentTypeId, c.DocumentNumber }).IsUnique();
        builder.HasIndex(c => c.Email);
    }
}
```

---

## 5. Conclusión y Beneficios

Con este trabajo realizado por Felipe Corredor el 26 de agosto de 2026:
- El modelo de datos queda formalmente mapeado y listo para la ejecución de migraciones en Entity Framework Core (`dotnet ef migrations add`).
- Se garantiza la integridad referencial y de datos a nivel de motor de base de datos.
- Se mantiene el desacoplamiento total entre las entidades del dominio y las especificidades de la base de datos relacional.
