# Investigación y configuración de Oracle AI Database 26ai Free con .NET 10

## Introducción

Este documento reúne la decisión técnica que ya se había planteado para utilizar Oracle AI Database 26ai Free dentro de una arquitectura hexagonal y la investigación adicional solicitada sobre su conexión con .NET 10.

La investigación contempla tres puntos principales: el funcionamiento de ODP.NET Core como proveedor oficial, la compatibilidad de Oracle con consultas, transacciones y capacidades avanzadas, y la integración con Entity Framework Core 10 como ORM.

Para el desarrollo del sistema se utilizará Oracle AI Database 26ai Free como motor de base de datos relacional y .NET 10 como plataforma del backend. La comunicación entre ambos se realizará mediante ODP.NET Core, el proveedor oficial de Oracle para aplicaciones .NET modernas.

El proyecto seguirá arquitectura hexagonal. Por esta razón, Oracle será considerado un adaptador de salida encargado de la persistencia. El dominio y los casos de uso no tendrán referencias directas a Oracle, Entity Framework Core, SQL, migraciones ni cadenas de conexión. Estas dependencias estarán ubicadas exclusivamente en el proyecto Infrastructure.

## Oracle AI Database 26ai Free

Oracle AI Database 26ai Free es la edición gratuita actual de Oracle Database. Es apropiada para desarrollo, pruebas, proyectos académicos y construcción de productos mínimos viables. Permite trabajar con las características relacionales necesarias para el sistema, incluyendo consultas, índices, restricciones, secuencias, transacciones y control de concurrencia.

Se selecciona la versión 26ai porque ofrece compatibilidad actual con .NET 10 y Entity Framework Core 10 mediante los proveedores oficiales de Oracle. También proporciona una ruta de crecimiento para incorporar características relacionadas con inteligencia artificial y datos vectoriales si posteriormente son necesarias para el agente conversacional o el sistema RAG.

La edición Free evita costos iniciales de licenciamiento. Si el sistema aumenta su volumen de información o necesita características empresariales de alta disponibilidad y soporte comercial, posteriormente se podrá evaluar otra edición de Oracle sin cambiar el enfoque general de acceso a datos.

### ¿Por qué se eligió Oracle 26ai?

Se eligió Oracle 26ai porque es la generación actual de Oracle Database y cuenta con soporte oficial para .NET 10 y Entity Framework Core 10 mediante ODP.NET 23.26. También ofrece una base tecnológica más adecuada para nuevas aplicaciones que Oracle 21c XE, especialmente si posteriormente se requieren capacidades de inteligencia artificial o búsquedas vectoriales.

Oracle 21c XE continúa siendo útil para sistemas existentes, pero en un desarrollo nuevo implicaría comenzar sobre una versión anterior sin una necesidad concreta. Oracle 26ai Free evita una actualización temprana y permite trabajar desde el inicio con la línea actual de proveedores de Oracle.

### ¿Por qué se eligió la edición Free?

La edición Free proporciona las funciones necesarias para construir y probar el sistema sin introducir costos de licenciamiento ni la complejidad operativa de Oracle Enterprise. Enterprise tendría sentido posteriormente si se requieren mayores capacidades, soporte comercial, alta disponibilidad o una infraestructura de producción más exigente.

La elección de Free corresponde al entorno inicial de desarrollo y no impide evaluar una edición superior cuando el sistema tenga requisitos reales de producción.

## ODP.NET Core

ODP.NET significa Oracle Data Provider for .NET. Su implementación para aplicaciones .NET modernas se distribuye mediante el paquete `Oracle.ManagedDataAccess.Core`.

Este proveedor contiene las clases fundamentales para conectarse y operar con Oracle desde .NET, entre ellas conexiones, comandos, parámetros, transacciones y lectores de datos. También administra detalles específicos del protocolo y de los tipos de Oracle.

Las clases principales que ofrece son:

- `OracleConnection`, para abrir y administrar conexiones.
- `OracleCommand`, para ejecutar instrucciones SQL y procedimientos.
- `OracleParameter`, para enviar parámetros de forma segura.
- `OracleTransaction`, para controlar transacciones.
- `OracleDataReader`, para leer los resultados de consultas.

ODP.NET Core es un proveedor administrado y multiplataforma. No requiere utilizar el antiguo proveedor no administrado de Oracle. Esto facilita su distribución mediante NuGet y su ejecución en entornos Windows, Linux o contenedores.

En este proyecto, ODP.NET Core será la dependencia base de comunicación con Oracle. Aunque la mayoría de las operaciones se realizarán mediante Entity Framework Core, resulta importante identificarlo explícitamente porque es el proveedor principal sobre el que trabaja la integración.

### Adaptación de la propuesta inicial

En la propuesta inicial, `Oracle.ManagedDataAccess.Core` se consideraba una dependencia transitiva, porque `Oracle.EntityFrameworkCore` ya lo instala internamente. Esa afirmación sigue siendo técnicamente válida; sin embargo, para responder al requerimiento de identificar e instalar explícitamente el proveedor principal ODP.NET Core, el paquete se declarará directamente en el proyecto Infrastructure.

Por tanto, la solución utilizará los dos paquetes oficiales:

- `Oracle.ManagedDataAccess.Core` como proveedor principal de conexión ODP.NET Core.
- `Oracle.EntityFrameworkCore` como proveedor ORM para Entity Framework Core 10.

No son alternativas entre sí. `Oracle.EntityFrameworkCore` trabaja sobre `Oracle.ManagedDataAccess.Core`, y ambos cumplen responsabilidades diferentes dentro de la misma integración.

## Compatibilidad con .NET 10

Oracle incorporó soporte para .NET 10 y Entity Framework Core 10 en la línea ODP.NET 23.26. Para mantener compatibilidad entre los componentes se utilizarán paquetes de la misma generación.

Las versiones seleccionadas son:

| Componente | Versión seleccionada |
|---|---:|
| .NET | 10.x |
| Entity Framework Core | 10.0.x |
| Oracle.ManagedDataAccess.Core | 23.26.300 |
| Oracle.EntityFrameworkCore | 10.23.26300 |
| Oracle AI Database | 26ai Free |

`Oracle.EntityFrameworkCore 10.23.26300` está dirigido a .NET 10 y requiere `Oracle.ManagedDataAccess.Core 23.26.300` o una versión compatible dentro de la misma línea. Esta selección mantiene alineados el runtime, el ORM y el proveedor de Oracle.

No se recomienda utilizar un proveedor Oracle 8.x o 9.x con Entity Framework Core 10. La versión mayor del proveedor de EF debe corresponder con la versión mayor de Entity Framework utilizada por el proyecto.

## Entity Framework Core con Oracle

Entity Framework Core será el ORM utilizado para representar las tablas mediante objetos de C#, ejecutar consultas LINQ, administrar cambios, configurar relaciones y generar migraciones.

La integración específica con Oracle se obtiene mediante `Oracle.EntityFrameworkCore`. Este paquete añade el método `UseOracle(...)` y se encarga de traducir las operaciones de Entity Framework al SQL compatible con Oracle.

La relación entre las dependencias es la siguiente:

- `Microsoft.EntityFrameworkCore` proporciona el ORM y las abstracciones principales.
- `Microsoft.EntityFrameworkCore.Design` proporciona las herramientas necesarias para crear migraciones.
- `Oracle.EntityFrameworkCore` implementa el proveedor de EF Core para Oracle.
- `Oracle.ManagedDataAccess.Core` implementa la comunicación de bajo nivel con Oracle mediante ODP.NET Core.

Aunque `Oracle.EntityFrameworkCore` incluye `Oracle.ManagedDataAccess.Core` como dependencia transitiva, en este proyecto ambos paquetes se declararán explícitamente. De esta manera queda documentado que ODP.NET Core es el proveedor principal solicitado para la conexión y se controla la versión utilizada por el equipo.

## Consultas, transacciones y características avanzadas

ODP.NET Core y Oracle Entity Framework Core permiten realizar operaciones asíncronas, consultas parametrizadas y transacciones. Entity Framework será utilizado para las operaciones habituales del sistema, mientras que ODP.NET directo podrá utilizarse únicamente cuando sea necesario ejecutar una función específica de Oracle que no esté cubierta adecuadamente por el ORM.

Las transacciones serán especialmente importantes en operaciones que requieran consistencia, por ejemplo el registro o reprogramación de una cita. La validación de disponibilidad y la creación de la cita deben formar parte de una misma operación transaccional para reducir el riesgo de reservas simultáneas sobre el mismo horario.

Oracle 26ai también dispone de capacidades relacionadas con vectores e inteligencia artificial. Estas funcionalidades pueden ser evaluadas para almacenar embeddings y realizar búsquedas semánticas. Su utilización no es obligatoria para establecer la conexión inicial y debe decidirse según las necesidades concretas del agente conversacional y del componente RAG.

Antes de adoptar características avanzadas se deberá validar su soporte específico en ODP.NET Core y Oracle Entity Framework Core, porque algunas funciones propias de Oracle pueden requerir acceso mediante clases del proveedor, SQL especializado o APIs distintas a las operaciones estándar de EF Core.

## Paquetes NuGet requeridos

Las dependencias relacionadas con Oracle y Entity Framework se instalarán en el proyecto Infrastructure. No deben instalarse en Domain ni Application, ya que estas capas constituyen el núcleo independiente de la arquitectura hexagonal.

| Paquete | Propósito |
|---|---|
| `Oracle.ManagedDataAccess.Core` | Proveedor principal ODP.NET Core para la conexión con Oracle |
| `Oracle.EntityFrameworkCore` | Proveedor de Entity Framework Core para Oracle |
| `Microsoft.EntityFrameworkCore` | ORM principal de la aplicación |
| `Microsoft.EntityFrameworkCore.Design` | Herramientas de diseño y creación de migraciones |
| `dotnet-ef` | Herramienta de línea de comandos para administrar migraciones |

### Procedimiento único de instalación

Desde la raíz de la solución se ejecutará un único procedimiento. Los nombres de la ruta deberán ajustarse al nombre real del proyecto Infrastructure:

```powershell
dotnet add .\src\Dental.Infrastructure\Dental.Infrastructure.csproj package Microsoft.EntityFrameworkCore --version 10.0.4
dotnet add .\src\Dental.Infrastructure\Dental.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Design --version 10.0.4
dotnet add .\src\Dental.Infrastructure\Dental.Infrastructure.csproj package Oracle.ManagedDataAccess.Core --version 23.26.300
dotnet add .\src\Dental.Infrastructure\Dental.Infrastructure.csproj package Oracle.EntityFrameworkCore --version 10.23.26300

dotnet new tool-manifest
dotnet tool install dotnet-ef --version 10.0.4

dotnet restore
dotnet build
```

El manifiesto local de herramientas permite que todos los integrantes utilicen la misma versión de `dotnet-ef`. Si el repositorio ya contiene `.config/dotnet-tools.json`, no se debe volver a ejecutar `dotnet new tool-manifest`; en ese caso solamente se restaura la herramienta mediante `dotnet tool restore`.

## Ubicación en la arquitectura hexagonal

Los paquetes anteriores y todos los archivos relacionados con Oracle estarán ubicados en Infrastructure. Allí se crearán posteriormente el `DbContext`, las configuraciones de mapeo, los repositorios y las migraciones.

Application contendrá únicamente las interfaces o puertos que describen las operaciones de persistencia requeridas por los casos de uso. Infrastructure implementará esas interfaces utilizando Oracle y Entity Framework Core. Api actuará como punto de entrada y registrará el adaptador de infraestructura mediante inyección de dependencias.

La distribución de responsabilidades será:

| Proyecto | Responsabilidad relacionada con Oracle |
|---|---|
| Domain | Ninguna dependencia de Oracle o EF Core |
| Application | Define puertos e interfaces de persistencia |
| Infrastructure | Contiene ODP.NET, EF Core, conexión, repositorios y migraciones |
| Api | Lee la configuración y registra Infrastructure |

La cadena de conexión estará en variables de entorno o configuración segura. Nunca deberá almacenarse directamente en Domain, Application ni en el repositorio con credenciales reales.

## Conclusión

La integración utilizará ODP.NET Core como proveedor principal y Oracle Entity Framework Core como capa ORM. Las versiones seleccionadas corresponden a la línea compatible con .NET 10 y Oracle AI Database 26ai.

La instalación explícita de `Oracle.ManagedDataAccess.Core` responde al requisito de utilizar el proveedor oficial de Oracle. La instalación de `Oracle.EntityFrameworkCore` permite conservar el modelo de trabajo con Entity Framework Core, consultas LINQ y migraciones.

Todas estas dependencias pertenecerán al adaptador de infraestructura, manteniendo Domain y Application independientes. Las entidades, tablas y migraciones se definirán en una etapa posterior, una vez se apruebe el modelo de datos del sistema.
