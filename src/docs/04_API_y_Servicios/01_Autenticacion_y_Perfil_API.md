---
title: "API de Autenticación, Perfil y OAuth"
order: 1
author: "NexusOdonto Backend Team"
date: "2026-09-16"
---

# API de Autenticación, Perfil y Google OAuth

Catálogo de endpoints para inicio de sesión, registro, renovación de tokens, vinculación de proveedores OAuth y actualización del perfil del usuario.

---

## 1. Endpoints de Autenticación

### `POST /api/Auth/login`
Inicia sesión mediante credenciales locales (correo o documento y contraseña).

* **Headers:** `Content-Type: application/json`
* **Body Request:**
```json
{
  "email": "admin@nexusodonto.com",
  "password": "Admin123!"
}
```
* **Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "refreshToken": "d8e3b4f0-9a1b-4c2d-8e5f-1a2b3c4d5e6f",
    "expiresAt": "2026-09-16T18:00:00Z",
    "user": {
      "id": "12000000-0000-0000-0000-000000000001",
      "email": "admin@nexusodonto.com",
      "firstName": "Carlos",
      "lastName": "Administrator",
      "roles": ["ADMINISTRADOR"],
      "permissions": ["USERS:VIEW", "PATIENTS:VIEW", "APPOINTMENTS:VIEW"]
    }
  },
  "message": "Inicio de sesión exitoso."
}
```

---

### `POST /api/Auth/refresh-token`
Renueva un `accessToken` expirado utilizando el `refreshToken` vigente.

* **Body Request:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "d8e3b4f0-9a1b-4c2d-8e5f-1a2b3c4d5e6f"
}
```
* **Response (200 OK):** Devuelve nuevo par de `accessToken` y `refreshToken`.

---

### `POST /api/Auth/google`
Inicia sesión o registra a un paciente mediante Google OAuth 2.0.

* **Body Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

---

### `POST /api/Auth/google/link` y `POST /api/Auth/google/unlink`
* **Link:** Asocia el Google ID del token a la cuenta autenticada actual.
* **Unlink:** Desvincula la cuenta de Google (requiere que el usuario tenga contraseña local configurada).

---

## 2. Endpoints de Perfil (`/api/Auth/me`)

### `GET /api/Auth/me`
Obtiene los datos completos del usuario autenticado. Requiere `Authorization: Bearer <token>`.

### `PUT /api/Auth/me`
Actualiza los datos personales (nombres, apellidos, teléfono, dirección) del usuario actual.

* **Body Request:**
```json
{
  "firstName": "Carlos",
  "lastName": "Administrator",
  "phone": "+57 300 123 4567",
  "address": "Calle 100 # 15-20, Bogotá",
  "avatarUrl": "blobatar-geometric-01"
}
```
