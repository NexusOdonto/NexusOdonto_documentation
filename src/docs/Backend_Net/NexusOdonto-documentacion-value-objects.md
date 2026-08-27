# NexusOdontoBackend_Api — Value Objects del dominio

**Tarjeta:** Objetos de valor que encapsulan las reglas operativas de la clínica
**Rama:** `feat/domain-vo-operations-catalogs`
**Fecha:** 27 de agosto de 2026
**Alcance:** 13 Value Objects, 297 líneas

**Commits:**

| Hash | Contenido |
|---|---|
| `277dd59` | `CatalogCode`, `CatalogName` |
| `5166527` | `HireDate`, `ProfessionalLicense` |
| `697f631` | Los 9 restantes |

---

## Resumen

| Carpeta | Value Objects |
|---|---|
| `Catalogs/` | `CatalogCode`, `CatalogName`, `Price`, `ServiceDuration` |
| `People/` | `HireDate`, `ProfessionalLicense` |
| `Schedule/` | `TimeOfDay`, `WeekDay` |
| `Notifications/` | `NotificationTitle`, `PhoneNumber` |
| `Chatbot/` | `ChatIdentifier`, `RagConfidence`, `TicketTitle` |

La estructura de carpetas espeja `Domain/Entities/`. Un archivo por Value Object.

`dotnet build`: 0 errores, 0 advertencias.

---

## Qué es un Value Object aquí

La diferencia con una entidad está en **cómo se compara**:

```
Entidad      → por identidad   (dos pacientes "Juan Pérez" son personas distintas)
Value Object → por valor       (dos códigos "ACTIVO" son el mismo valor)
```

Tres propiedades definen a los 13:

1. **Sin identidad** — no tienen `Id`
2. **Inmutables** — no se modifican, se reemplazan
3. **Se autovalidan** — no pueden existir en estado inválido

La tercera es la que aporta el valor real. Antes de esta tarjeta:

```csharp
public DateTime HireDate { get; set; }
```

Nada impedía `employee.HireDate = new DateTime(2150, 1, 1)`. Con el Value Object esa línea no compila.

---

## El patrón

Los 13 comparten exactamente la misma estructura:

```
sealed record
├── public <Tipo> Value { get; }        propiedad inmutable
├── private <Nombre>(<Tipo> value)      constructor privado
├── public static <Nombre> Create(...)  fábrica que valida
└── public override string ToString()   representación legible
```

**El constructor privado es el mecanismo central.** Al no ser accesible desde fuera, la única forma de obtener una instancia es pasar por `Create`, y `Create` valida. No existe camino que produzca un objeto inválido.

`Create` sigue siempre el mismo orden:

```
1. Normalizar    (.Trim(), .ToUpperInvariant(), .Date, Math.Round)
2. Validar       (una guarda por regla, cada una con su mensaje)
3. Devolver      (return new X(valorNormalizado))
```

**Normalizar antes de validar** no es un detalle de estilo. Si llega `"   "`, el `.Trim()` lo convierte en `""` y la guarda de vacío lo detecta; al revés, se cuela.

---

## Decisión de diseño: `record` en lugar de clase base

El DoD original pedía una clase base `ValueObject` con comparación estructural. Se descartó por acuerdo del equipo, y la comparación por valor la aporta el modificador `record`.

Al declarar `record`, el compilador genera los cuatro miembros que la clase base habría centralizado:

```csharp
public override bool Equals(object? obj)   // compara propiedad por propiedad
public override int GetHashCode()          // hash basado en el contenido
public static bool operator ==(...)
public static bool operator !=(...)
```

**`GetHashCode` es el que importa y el que se olvida.** Si se compara por valor pero el hash sigue siendo el de la referencia, dos valores iguales caen en buckets distintos de un `HashSet` o `Dictionary`:

```
set.Add(CatalogCode.Create("ACTIVO"));
set.Add(CatalogCode.Create("ACTIVO"));

class  → Count = 2   (duplicado silencioso)
record → Count = 1   (correcto)
```

No lanza excepción: simplemente los datos salen mal.

**`sealed`** impide heredar. Sin él, una subclase rompería la simetría de `Equals`: `a.Equals(b)` podría dar distinto que `b.Equals(a)`.

---

## Los 13 Value Objects

### `Catalogs/`

| Value Object | Tipo | Reglas |
|---|---|---|
| `CatalogCode` | `string` | No vacío · máx. 50 · normalizado a mayúsculas |
| `CatalogName` | `string` | No vacío · máx. 80 |
| `Price` | `decimal` | ≥ 0 · redondeo a 2 decimales · máx. 9 999 999 999,99 |
| `ServiceDuration` | `int` | > 0 · máx. 9 999 |

**`CatalogCode` fuerza mayúsculas** porque un código es un identificador, no texto legible. Sin normalizar, `"activo"` y `"ACTIVO"` entran como registros distintos y el índice `UNIQUE` de Oracle no los detecta como duplicados.

Se usa `ToUpperInvariant()` y no `ToUpper()`: el segundo depende de la cultura del sistema, y en configuración turca la `i` minúscula se convierte en `İ` en lugar de `I`. Es un fallo que solo aparece en algunos servidores.

**`CatalogName` no fuerza mayúsculas** — es texto que se muestra al usuario.

**Los límites son el menor común.** La mayoría de catálogos usan `varchar2(50)` para el código y `varchar2(80)` para el nombre, pero `motivos_ticket_soporte` y `tipos_evento_auditoria` llegan a 60 y 120/150.

Como un solo Value Object cubre los doce catálogos, el límite es el más estricto. Con 60 caracteres permitidos, un código largo pasaría la validación y Oracle lo rechazaría al insertar en las tablas de 50, con un `ORA-12899` en producción.

**`Price` redondea a 2 decimales** para coincidir con `number(12,2)`. Usa `decimal`, nunca `double`: los binarios de punto flotante pierden centavos en las sumas.

### `People/`

| Value Object | Tipo | Reglas |
|---|---|---|
| `HireDate` | `DateTime` | No futura · normalizada a `.Date` |
| `ProfessionalLicense` | `string` | No vacío · máx. 50 |

**`HireDate` descarta la hora.** Dos empleados vinculados el mismo día pero registrados a distinta hora deben tener el mismo valor. Sin normalizar, la comparación por valor no funcionaría.

### `Schedule/`

| Value Object | Tipo | Reglas |
|---|---|---|
| `TimeOfDay` | `string` | Formato `HH:mm` verificado con `TimeOnly.TryParseExact` |
| `WeekDay` | `int` | Entre 0 y 6 |

**`TimeOfDay` cubre las cuatro columnas de `disponibilidades`** (`hora_inicio`, `hora_almuerzo`, `hora_retorno`, `hora_fin`), todas `varchar2(5)`. Se mantuvo como valor único en lugar de un `TimeRange` de dos valores para no alterar la forma de la entidad, que es de otra tarjeta.

### `Notifications/`

| Value Object | Tipo | Reglas |
|---|---|---|
| `NotificationTitle` | `string` | No vacío · máx. 200 |
| `PhoneNumber` | `string` | No vacío · máx. 30 · solo dígitos, `+`, `-` y espacios |

### `Chatbot/`

| Value Object | Tipo | Reglas |
|---|---|---|
| `ChatIdentifier` | `string` | No vacío · máx. 150 |
| `RagConfidence` | `decimal` | Entre 0 y 1 · redondeo a 4 decimales |
| `TicketTitle` | `string` | No vacío · máx. 200 |

**`RagConfidence` usa `decimal`** para coincidir con `number(5,4)`. Un `double` no representa exactamente valores del rango 0–1 y arrastraría error en comparaciones.

---

## Manejo de `null`

Los Value Objects de texto normalizan con el operador *null-conditional*:

```csharp
var license = value?.Trim();
```

Si el parámetro es `null`, la expresión completa devuelve `null` en lugar de lanzar `NullReferenceException`. La guarda posterior con `string.IsNullOrWhiteSpace` lo atrapa junto con la cadena vacía y la de solo espacios, y devuelve un `ArgumentException` con mensaje claro.

Además `IsNullOrWhiteSpace` está anotada con `[NotNullWhen(false)]`, así que tras la guarda el compilador sabe que el valor no es nulo. Las líneas siguientes quedan sin advertencias de nulabilidad.

---

## Estado frente al DoD

| Criterio | Estado |
|---|---|
| Comparación estructural por valor, no por referencia | ✅ vía `sealed record` |
| Propiedades internas de solo lectura o `init-only` | ✅ `public X Value { get; }` sin setter |
| `IReadOnlyList` en colecciones internas | N/A — ninguno tiene colecciones |

El primer criterio mencionaba una clase base genérica de `ValueObject`. Se descartó por acuerdo verbal del equipo; la comparación estructural la aporta el `record`, que genera exactamente los mismos miembros.

---

## Fuera de alcance

**La integración en las entidades.** La tarjeta pide construir los Value Objects; las 27 entidades aparecen como el alcance del que extraer las reglas, no como archivos a modificar. Cambiar el tipo de las propiedades en `Employee`, `Service`, `Availability` y las demás corresponde a otra tarjeta.

Consecuencia: los 13 Value Objects existen y compilan, pero **ninguna entidad los usa todavía**. Las validaciones no están activas hasta que se haga esa integración.

---

## Pendientes para el equipo

**1. Confirmar el rango de `WeekDay`.** Se validó 0–6 alineado con `System.DayOfWeek` (0 = domingo). El esquema declara `dia_inicio number(1)` sin más precisión. Si la convención del equipo es 1–7, es cambiar dos números.

**2. `Price` admite cero.** Un servicio de cortesía o una valoración gratuita son casos reales. Si el negocio exige precio estrictamente positivo, la guarda pasa de `< 0` a `<= 0`.

**3. `PhoneNumber` valida caracteres, no formato internacional.** Acepta dígitos, `+`, `-` y espacios. No verifica prefijos de país ni longitud mínima.

**4. Coordinación con Mapster.** Los DTOs usan tipos primitivos. Cuando las entidades adopten estos Value Objects, Mapster dejará de mapear por convención —sin lanzar error, simplemente deja la propiedad sin asignar—. Quien configure Mapster debería registrar un convertidor por Value Object:

```csharp
config.NewConfig<string, ProfessionalLicense>()
      .MapWith(src => ProfessionalLicense.Create(src));
```

Declarado una vez, aplica a todos los mapeos que usen ese tipo.

**5. Configuración de EF Core.** Los Value Objects de un solo valor se mapean con `HasConversion(vo => vo.Value, value => X.Create(value))`.

Riesgo a tener presente: la conversión de lectura llama a `Create`, que valida. Si la base ya contiene datos que no cumplen las reglas nuevas, la consulta falla al leer. Conviene un método de materialización que salte la validación, o limpiar los datos antes de activar la conversión.

**6. Unificar los mensajes de excepción.** Algunos quedaron en inglés y otros en español. El resto del proyecto (`UnitOfWork`, `AuthService`) usa español.
