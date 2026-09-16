---
title: "Seguridad y Autenticación JWT"
order: 2
author: "NexusOdonto Security Team"
date: "2026-09-16"
---

# Seguridad, Autenticación JWT y OAuth 2.0

NexusOdonto utiliza una arquitectura de autenticación hibrida basada en tokens JWT con rotación de Refresh Tokens, integración con Google OAuth y mecanismos de protección activa contra escalamiento de privilegios.

---

## 1. Flujo de Autenticación con JWT

```
  [ Cliente Web / App ]                    [ Backend API ]                  [ Oracle DB ]
           │                                      │                               │
           │── 1. POST /api/Auth/login ──────────>│                               │
           │      { email, password }             │── 2. Validar Hash BCrypt ────>│
           │                                      │<─ 3. Usuario & Roles OK ──────│
           │<─ 4. 200 OK (AccessToken + Refresh)─│                               │
           │                                      │                               │
           │── 5. GET /api/Appointments ─────────>│                               │
           │      Header: Bearer <AccessToken>    │── 6. Validar Claims & Rol ───>│
           │<─ 7. 200 OK (Datos) ─────────────────│                               │
```

### Estructura de Claims del JWT Access Token:
* `sub`: Identificador GUID del usuario (`UserId`).
* `email`: Correo electrónico verificado.
* `role`: Código del rol primario (`ADMINISTRADOR`, `ODONTOLOGO`, etc.).
* `roleIds`: Arreglo de GUIDs de roles asociados.
* `permissions`: Lista de códigos de permisos activos (`APPOINTMENTS:VIEW`, etc.).
* `personId`: Identificador GUID de la entidad `Person`.
* `exp`: Timestamp Unix de expiración (60 minutos por defecto).

---

## 2. Google OAuth: Inicio de Sesión, Vinculación y Desvinculación

NexusOdonto permite que los usuarios autentiquen o enlacen su cuenta con Google:

* **Inicio de Sesión con Google (`POST /api/Auth/google`):** Valida el `id_token` de Google contra los servidores de Google OAuth. Si el usuario existe, emite los tokens JWT de NexusOdonto; si no existe, crea el perfil de Paciente automáticamente.
* **Vinculación de Cuenta (`POST /api/Auth/google/link`):** Permite a un usuario autenticado asociar su `GoogleId` a su perfil existente.
* **Desvinculación de Cuenta (`POST /api/Auth/google/unlink`):** Permite retirar la vinculación de Google, siempre y cuando el usuario cuente con una contraseña local válida para evitar bloqueos de acceso.

---

## 3. Mecanismos de Protección Activa

### 1. `SeedAdminGuard` (Protección de Cuenta Semilla)
El usuario Administrador `AD001` (`admin@nexusodonto.com`) está protegido a nivel de código de aplicación:
* Las solicitudes `DELETE /api/Users/{id}` o `PUT /api/Users/{id}/status` que apunten al `AdminUserId` son rechazadas con error `400 Bad Request` ("El usuario administrador semilla no puede ser desactivado ni eliminado").
* Al inicializar la base de datos (`DatabaseInitializer`), el sistema utiliza `.IgnoreQueryFilters()` para restaurar automáticamente el estado activo del administrador en caso de modificaciones externas.

### 2. Restricción de Inicio de Sesión Interactivo a `BOT_SERVICE`
* La cuenta `bot_service@nexusodonto.com` no puede iniciar sesión mediante el formulario de login ni por Google.
* Cualquier petición de autenticación para este usuario sin la cabecera interna `X-Internal-Secret` es interceptada y rechazada inmediatamente.
