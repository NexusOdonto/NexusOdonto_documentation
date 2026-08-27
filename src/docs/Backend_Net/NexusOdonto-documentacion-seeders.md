# NexusOdontoBackend_Api — Seeders de catálogos de seguridad y odontología

**Tarjeta:** Datos semilla con `HasData()` para 16 tablas fundamentales
**Rama:** `feat/seeders-clinical-security`
**Fecha:** 27 de agosto de 2026
**Alcance:** 16 seeders, 178 registros

---

## Resumen

| Seeder | Registros | Prefijo Guid |
|---|---|---|
| `DocumentTypeSeeder` | 4 | `e0000000` |
| `SexSeeder` | 3 | `f0000000` |
| `JobTitleSeeder` | 4 | `11000000` |
| `ActionPermissionSeeder` | 4 | `12000000` |
| `RoleSeeder` | 5 | `13000000` |
| `PermissionSeeder` | 32 | `14000000` |
| `SessionStatusSeeder` | 3 | `15000000` |
| `AuditEventTypeSeeder` | 4 | `16000000` |
| `AntecedentTypeSeeder` | 4 | `17000000` |
| `SpecialtySeeder` | 6 | `18000000` |
| `DentitionTypeSeeder` | 2 | `19000000` |
| `ToothStatusSeeder` | 5 | `1a000000` |
| `DentalSurfaceSeeder` | 7 | `1b000000` |
| `FindingTypeSeeder` | 5 | `1c000000` |
| `FindingStatusSeeder` | 3 | `1d000000` |
| `ToothSeeder` | 52 | — (PK es `Code`) |
| | **178** | |

`dotnet build`: 0 errores, 0 advertencias.

---

## Estructura

```
Infrastructure/Data/Seeder/
├── DocumentType/DocumentTypeSeeder.cs
├── Sex/SexSeeder.cs
├── JobTitle/JobTitleSeeder.cs
└── ...
```

Una carpeta por entidad, un archivo dentro. Espeja la carpetización de
`Infrastructure/Configurations/` y la convención establecida en el PR #56.

Cada seeder es una clase estática con un único método público:

```csharp
public static void Seed(ModelBuilder modelBuilder)
```

Recibe el `ModelBuilder` —no el `EntityTypeBuilder`— para poder invocarse desde
`AppDbContext.OnModelCreating` sin tocar los archivos de configuración de
entidad, que pertenecen a otra tarjeta.

**Nota sobre el alias `using`:** cada archivo declara
`using XEntity = Domain.Entities.Catalogs.X;`. Es necesario porque el namespace
del seeder (`Infrastructure.Data.Seeder.DocumentType`) tiene el mismo nombre que
el tipo que siembra, y sin el alias la referencia queda ambigua. Es una
consecuencia de nombrar la carpeta igual que la entidad.

---

## Los tres problemas que `HasData` plantea en este dominio

Resolverlos antes de escribir evita pelear con migraciones inestables.

### 1. Los `Guid` no pueden generarse en tiempo de ejecución

```csharp
public abstract class Entity
{
    public Guid Id { get; set; } = Guid.NewGuid();   // se ejecuta en cada construcción
}
```

`HasData` exige valores deterministas: el mismo identificador en cada ejecución.
Con un `Guid` generado al vuelo, cada `dotnet ef migrations add` detectaría datos
distintos y produciría una migración con `DeleteData` + `InsertData` de todo.

Todos los identificadores están escritos como literales fijos.

### 2. `CreatedAt` tiene el mismo problema

```csharp
public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
```

Cada seeder declara una fecha constante:

```csharp
var seedCreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
```

### 3. Los constructores de las entidades son privados

`HasData` acepta instancias o objetos anónimos. Se usan **objetos anónimos**,
siguiendo la convención del PR #56: los constructores públicos no reciben `Id`
ni `CreatedAt`, y el constructor sin parámetros es privado.

Los tipos anulables llevan cast explícito (`(int?)1`, `(DateTime?)null`,
`(decimal?)60000m`). Sin él, el tipo anónimo infiere `int` en lugar de `int?` y
EF puede rechazar el mapeo.

---

## Esquema de identificadores

Los `Guid` siguen un patrón legible en vez de valores aleatorios:

```
e0000000-0000-0000-0000-000000000001   ← DocumentType, registro 1
1a000000-0000-0000-0000-000000000003   ← ToothStatus, registro 3
```

Prefijo por catálogo, sufijo secuencial. Al ver un identificador en un log o en
una llave foránea se reconoce de inmediato a qué tabla pertenece.

Los prefijos `1`–`9` y `a`–`d` ya estaban ocupados por los 13 seeders del
PR #56, de modo que esta tarjeta arranca en `e`.

---

## Dependencias entre seeders

Tres seeders exponen sus identificadores como `public static readonly Guid`
porque otros los referencian como llave foránea:

| Seeder | Expone | Lo consume |
|---|---|---|
| `ActionPermissionSeeder` | `View`, `Create`, `Edit`, `Delete` | `PermissionSeeder` |
| `DentitionTypeSeeder` | `Permanent`, `Deciduous` | `ToothSeeder` |
| `RoleSeeder` | los 5 roles | Asignación de permisos, pendiente |

La alternativa —repetir el literal en ambos archivos— abre la puerta a que se
desincronicen tras un cambio, produciendo una llave foránea rota que solo
aparece al generar la migración.

---

## Seeders generados por bucle

Dos casos no se escriben registro por registro.

### `PermissionSeeder` — 32 registros

Ocho módulos por cuatro acciones. El identificador se construye con un patrón
determinista:

```csharp
Id = new Guid($"14000000-0000-0000-{m + 1:D4}-{a + 1:D12}")
```

Índice de módulo y de acción incrustados en el `Guid`, de modo que sigue siendo
estable entre migraciones.

Los ocho módulos definidos: `PACIENTES`, `CITAS`, `CATALOGOS`, `USUARIOS`,
`HISTORIAS`, `ODONTOGRAMA`, `NOTIFICACIONES`, `SOPORTE`.

### `ToothSeeder` — 52 registros

La numeración FDI es sistemática: el primer dígito es el cuadrante y el segundo
la posición.

```
Permanentes   11-18  21-28  31-38  41-48    32 piezas
Temporales    51-55  61-65  71-75  81-85    20 piezas
```

Dos bucles anidados generan las 52 piezas derivando `Quadrant` y `Position` del
código. El nombre se compone del cuadrante y la posición anatómica
(«Upper Right Central Incisor», «Primary Lower Left Second Molar»).

`Tooth` es la única entidad del grupo cuya llave primaria **no es un `Guid`**:
es `Code`, un `string` de dos caracteres. Solo consume el identificador de
`DentitionType`.

---

## Entidades que no heredan de `CatalogEntity`

Tres seeders tienen forma distinta porque sus entidades también la tienen:

| Entidad | Hereda de | Consecuencia en el seeder |
|---|---|---|
| `Role` | `BaseEntity` | Sin `SortOrder` |
| `Permission` | `Entity` | Solo `Id`; sin `CreatedAt`, `IsActive` ni `SortOrder` |
| `Tooth` | — | Clase suelta; PK `Code`, sin campos de auditoría |

---

## Contenido sembrado

**Seguridad** — Tipos de documento (CC, CE, TI, PAS) · Sexos (Femenino,
Masculino, Otro) · Cargos (Administrador, Recepcionista, Odontólogo, Asistente) ·
Acciones de permiso (Ver, Crear, Editar, Eliminar) · Roles (Administrador,
Odontólogo, Recepcionista, Asistente, Paciente) · Estados de sesión (Activa,
Revocada, Expirada) · Tipos de evento de auditoría con categoría y nivel de
riesgo.

**Clínico** — Tipos de antecedente (Médico, Odontológico, Alergia, Medicamento) ·
Especialidades (6 odontológicas).

**Odontograma** — Tipos de dentición (Permanente, Temporal) · Estados de diente
con color hexadecimal y código visual · Superficies dentales indicando si
aplican a anteriores o posteriores · Tipos de hallazgo indicando si requieren
superficie · Estados de hallazgo con color · Las 52 piezas FDI.

Los colores hexadecimales y códigos visuales no son decorativos: son lo que
permite al frontend renderizar el odontograma sin codificar la paleta en el
cliente.

---

## Estado frente al DoD

| Criterio | Estado |
|---|---|
| Las llaves primarias coinciden con los códigos de los catálogos | ✅ Guid fijo por registro, `Code` legible |
| La migración se genera sin conflictos de llaves foráneas ni duplicados | ⚠️ Depende de la invocación |
| `dotnet ef database update` puebla las 16 tablas | ⚠️ Depende de la invocación |

**Los dos últimos criterios no pueden verificarse desde esta tarjeta.**

---

## Pendiente crítico: la invocación

Los seeders son métodos estáticos que **nadie llama todavía**.
`AppDbContext.OnModelCreating` contiene únicamente
`ApplyConfigurationsFromAssembly`.

Tal como está, `dotnet ef migrations add` no genera un solo `InsertData` — ni de
estos 16 seeders ni de los 13 del PR #56, que están en la misma situación.

Falta agregar en `OnModelCreating`:

```csharp
DocumentTypeSeeder.Seed(modelBuilder);
SexSeeder.Seed(modelBuilder);
// ... una línea por seeder
```

Esa tarea corresponde a otra tarjeta.

**`dotnet build` no detecta errores de seed.** Una propiedad requerida sin
valor, un `Guid` de llave foránea inexistente o un duplicado compilan sin
problema y fallan al generar la migración. Conviene que quien la genere ejecute
`dotnet ef migrations add` sobre esta rama antes de mergear.

---

## Pendientes para el equipo

**1. Confirmar los ocho módulos de `Permission`.** La tarjeta solo daba
`PACIENTES_VER` y `CITAS_CREAR` como ejemplos. Los ocho definidos son un
supuesto razonable, pero esos códigos son el contrato con las políticas de
autorización ya declaradas en los controladores (`CATALOGOS.VER`,
`PACIENTES.CREAR`). Si el equipo maneja otra lista, hay que ajustarla antes de
generar la migración.

**2. La relación rol–permiso no está sembrada.** `Role` y `Permission` tienen
una relación muchos a muchos que EF resuelve con una tabla puente. La tarjeta no
pedía poblarla, pero sin ella los roles nacen sin permisos asignados y el
control de acceso no funcionará aunque ambos catálogos existan.

**3. `AuditEventType.RiskLevel` usa una escala 1–3** (1 bajo, 3 alto), definida
en esta tarjeta a falta de una convención previa. El esquema declara
`nivel_riesgo number(3)`, que admite hasta 999.
