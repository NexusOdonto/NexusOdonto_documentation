# Reporte de trabajo Frontend - NexusOdonto

**Nombre:** Brayan Snehyder Castro Velandia  
**Rol:** Frontend  
**Fecha:** 26/08/2026  

---

## Módulo de Pacientes

Durante la jornada continué con el desarrollo visual y funcional del módulo de **Pacientes**.

### Funcionalidades realizadas

- Implementé la **búsqueda de pacientes** por nombre y número de documento.
- Agregué **debounce** para controlar la búsqueda mientras el usuario escribe.
- Implementé **paginación visual** para organizar los resultados.
- Añadí estados de **carga** mediante skeleton.
- Agregué un estado visual cuando **no se encuentran pacientes**.
- Organicé el formulario de registro en `PacienteForm.tsx`.
- Implementé validaciones con **React Hook Form** y **Zod**.
- Validé nombres, apellidos, documento y fecha de nacimiento.
- Evité visualmente el registro de pacientes con el **mismo número de documento**.
- Hice que al registrar un paciente este aparezca inmediatamente en la **tabla**.
- Realicé ajustes **responsive** para móviles.

## Módulo de Servicios

También desarrollé el catálogo visual de **Servicios Odontológicos**.

### Funcionalidades realizadas

- Creé la vista y las tarjetas de servicios.
- Mostré **nombre, descripción, duración y precio**.
- Implementé el formato visual del precio en **pesos colombianos (COP)**.
- Añadí estados **Activo/Inactivo**, mostrando los servicios inactivos de forma atenuada.
- Implementé la **búsqueda de servicios**.
- Agregué filtros por **estado** y **rango de precio**.
- Añadí el botón **Nuevo Servicio** con un formulario visual.
- Permití agregar nuevos servicios visualmente desde el catálogo.
- Adapté el catálogo para diferentes tamaños de pantalla.

## Resultado

Los módulos de **Pacientes** y **Servicios** quedaron funcionales a nivel frontend, con búsqueda, filtros, validaciones e interacción visual.

La integración definitiva con el backend queda pendiente para una etapa posterior.
