---
title: "Arquitectura Frontend, Contextos y Layouts"
order: 1
author: "NexusOdonto Frontend Team"
date: "2026-09-16"
---

# Arquitectura Frontend, Contextos y Layouts

El Frontend de NexusOdonto es una SPA reactiva estructurada por *feature modules* bajo React 18, Vite y TypeScript, priorizando la separación de responsabilidades, la inmutabilidad del estado y una experiencia de usuario clínica limpia.

---

## 1. Estructura de Directorios (`src/`)

```
src/
├── assets/          # Logos, tipografías e imágenes estáticas
├── components/      # Componentes UI reutilizables (Botones, Modales, Inputs, Tablas)
│   ├── layout/      # Sidebar, TopBar, Header, DrawerPortal
│   └── ui/          # Badges, Tooltips, Avatares, Iconografía
├── context/         # React Contexts globales
│   ├── AuthContext.tsx    # Sesión, usuario activo, tokens y permisos
│   ├── ThemeContext.tsx   # Tema claro / oscuro persistente
│   └── ToastContext.tsx   # Sistema de notificaciones toast animadas
├── features/        # Módulos funcionales de la aplicación
│   ├── agenda/            # Agenda clínica y calendario semanal/mensual
│   ├── atencion-chat/     # Panel de soporte y asesor humano en vivo
│   ├── citas/             # Tabla de citas, filtros y agendamiento
│   ├── dashboard/         # Dashboard modular según rol de usuario
│   ├── historia-clinica/  # Evoluciones, antecedentes y exportación PDF
│   ├── odontograma/       # Odontograma FDI interactivo bidimensional
│   ├── pacientes/         # Listado, ficha y exportación CSV de pacientes
│   ├── perfil/            # Ficha de usuario, cambio de clave y Blobatars
│   ├── profesionales/     # Directorio de odontólogos y turnos
│   ├── servicios/         # Catálogo de tratamientos y tarifas
│   └── usuarios/          # Administración de accesos y roles
├── routes/          # Definición de rutas, ProtectedRoute y PublicOnlyRoute
├── services/        # Clientes HTTP Axios tipados para la API REST
├── types/           # Definiciones de tipos e interfaces TypeScript
└── utils/           # Utilidades de fechas (America/Bogota), validaciones y RBAC
```

---

## 2. Enrutamiento y Protección de Rutas

El enrutamiento se organiza en `src/routes/index.tsx` con dos envoltorios de seguridad:

1. **`ProtectedRoute`:** Verifica que exista un token JWT válido y un usuario activo en `AuthContext`. Si el usuario no tiene permisos para la ruta solicitada según `hasRouteAccess(user, path)`, lo redirige al `/dashboard` o a su vista permitida por defecto sin exponer vistas prohibidas.
2. **`PublicOnlyRoute`:** Utilizado en `/login`, `/register` y `/recuperar-clave`. Si el usuario ya está autenticado, lo redirige inmediatamente a la aplicación interna.
