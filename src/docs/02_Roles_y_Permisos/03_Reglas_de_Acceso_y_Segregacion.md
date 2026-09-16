---
title: "Reglas de Acceso y Segregación por Rol"
order: 3
author: "NexusOdonto Security Team"
date: "2026-09-16"
---

# Reglas de Acceso y Segregación por Rol

Para garantizar el cumplimiento de normativas de privacidad médica y evitar fugas de información sensible o métricas de negocio, NexusOdonto aplica reglas estrictas de segregación tanto en el Frontend como en el Backend.

---

## 1. Matriz de Rutas Permitidas en Frontend (`routePermissions.ts`)

```typescript
export const ROLE_ALLOWED_ROUTES: Record<SystemRole, string[]> = {
  ADMINISTRADOR: [
    "/dashboard",
    "/citas",
    "/agenda",
    "/atencion-chat",
    "/pacientes",
    "/pacientes/nuevo",
    "/profesionales",
    "/servicios",
    "/historia-clinica",
    "/odontograma",
    "/usuarios",
    "/roles-permisos",
    "/configuracion",
    "/perfil",
  ],
  ODONTOLOGO: [
    "/dashboard",
    "/citas",
    "/agenda",
    "/pacientes",
    "/pacientes/nuevo",
    "/profesionales",
    "/servicios",
    "/historia-clinica",
    "/odontograma",
    "/perfil",
  ],
  RECEPCIONISTA: [
    "/dashboard",
    "/citas",
    "/agenda",
    "/atencion-chat",
    "/pacientes",
    "/pacientes/nuevo",
    "/profesionales",
    "/servicios",
    "/perfil",
  ],
  PACIENTE: [
    "/dashboard",
    "/citas",
    "/servicios",
    "/profesionales",
    "/historia-clinica",
    "/odontograma",
    "/perfil",
  ],
};
```

---

## 2. Segregación Crítica por Rol

### 1. Rol RECEPCIONISTA (Restricción de Mutaciones Clínicas y Catálogos)
* **Historia Clínica y Odontograma:** La recepcionista no tiene acceso a las vistas de historias clínicas detalladas (`/historia-clinica`) ni odontograma (`/odontograma`).
* **Servicios y Tarifas (`ServiciosView.tsx`):** La recepcionista puede visualizar el catálogo de servicios y precios para informar a los pacientes, pero los botones de acción para **Crear**, **Editar**, **Activar/Desactivar** o **Eliminar** servicios quedan ocultos y deshabilitados (fix `bd072bc`).

### 2. Rol PACIENTE (Aislamiento Total de Datos Médicos y Financieros)
* **Aislamiento de Citas:** El paciente solo puede ver y solicitar citas para su propio `patientId`.
* **Aislamiento de Odontograma:** El paciente visualiza su odontograma en modo de solo lectura. No tiene selector de pacientes ni puede ver odontogramas de terceros.
* **Métricas y KPIs:** El dashboard del paciente no muestra ingresos monetarios de la clínica, total de pacientes atendidos ni métricas administrativas globales.

### 3. Rol ODONTÓLOGO (Bloqueo de Profesional Responsable)
* Al registrar un odontograma o evolución clínica, el sistema fija automáticamente al odontólogo autenticado como el profesional responsable (`ProfessionalId`), impidiendo que un doctor registre procedimientos a nombre de otro colega (fix `0c479bb`).
