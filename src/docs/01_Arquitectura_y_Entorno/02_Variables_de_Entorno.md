---
title: "Variables de Entorno y Configuración"
order: 2
author: "NexusOdonto DevOps Team"
date: "2026-09-16"
---

# Variables de Entorno y Configuración del Sistema

A continuación se detalla la configuración requerida para cada uno de los entornos y proyectos del ecosistema.

---

## 1. Backend .NET Web API (`appsettings.json` / Variables de Entorno)

```json
{
  "ConnectionStrings": {
    "OracleDb": "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XEPDB1)));User Id=NEXUS_USER;Password=YourSecurePassword123!;"
  },
  "JwtSettings": {
    "Secret": "NexusOdonto_Super_Secret_Key_JWT_Production_2026_Minimum_256_Bits!",
    "Issuer": "NexusOdontoApi",
    "Audience": "NexusOdontoClient",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  },
  "Google": {
    "ClientId": "your-google-client-id.apps.googleusercontent.com",
    "ClientSecret": "GOCSPX-your-google-client-secret"
  },
  "InternalAuth": {
    "BotSecret": "nexus-internal-bot-secret-2026"
  },
  "SeedSettings": {
    "RunMigrations": true,
    "RunSeeds": true
  },
  "AllowedOrigins": [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://app.nexusodonto.com"
  ]
}
```

### Mapeo a Variables de Entorno en Docker / Linux:
* `ConnectionStrings__OracleDb` -> Cadena de conexión JDBC/Oracle.
* `JwtSettings__Secret` -> Llave secreta HMAC-SHA256 para firma de tokens.
* `InternalAuth__BotSecret` -> Secreto compartido para autenticar al bot.
* `SeedSettings__RunMigrations` -> `true` para aplicar migraciones al arrancar.
* `SeedSettings__RunSeeds` -> `true` para poblar roles, usuarios iniciales y catálogos.

---

## 2. Frontend React (`.env` / `.env.production`)

```env
# URL base de la API REST del backend
VITE_API_URL=http://localhost:5000/api

# Client ID de Google para inicio de sesión y vinculación OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Nombre de la aplicación en el título del navegador
VITE_APP_TITLE=NexusOdonto - Plataforma Clínica Odontológica

# Modo de depuración de logs
VITE_ENABLE_DEBUG_LOGS=false
```

---

## 3. Agente IA FastAPI (`.env`)

```env
# Credenciales del modelo Gemini
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere_2026

# Conexión al Backend API de NexusOdonto
NEXUS_API_BASE_URL=http://localhost:5000/api
INTERNAL_BOT_SECRET=nexus-internal-bot-secret-2026

# Base de datos de Caché Semántica
SEMANTIC_CACHE_DB_URL=postgresql://pguser:pgpassword@localhost:5432/nexus_semantic_cache

# Configuración del Servidor FastAPI
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8000
ENVIRONMENT=production
```
