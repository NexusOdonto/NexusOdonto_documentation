---
title: "Variables de Entorno y Configuración del Bot"
section: "Agente_IA"
order: 3
date: "2026-09-16"
author: "Equipo NexusOdonto"
summary: "Variables de Entorno y Configuración del Bot — Documentación integral del ecosistema NexusOdonto."
---

# Variables de Entorno y Configuración del Bot

El microservicio de Inteligencia Artificial gestiona su configuración mediante archivos `.env` cargados a través de `pydantic-settings`.

---

## 1. Matriz de Variables de Entorno (`.env`)

| Variable | Tipo | Obligatoria | Valor Ejemplo / Descripción |
| :--- | :--- | :---: | :--- |
| `ENVIRONMENT` | `string` | Sí | `production` / `staging` / `development` |
| `PORT` | `int` | Sí | `8000` (Puerto expuesto en FastAPI) |
| `GEMINI_API_KEY` | `string` | Sí | Clave de API de Google AI Studio / Vertex AI |
| `GEMINI_MODEL_NAME` | `string` | No | `gemini-1.5-flash` (Por defecto) |
| `POSTGRES_DB_URL` | `string` | Sí | `postgresql+asyncpg://bot_usr:pwd@postgres:5432/nexus_bot_db` |
| `DOTNET_BACKEND_URL` | `string` | Sí | `http://backend-api:5000` (Ruta interna del backend) |
| `INTERNAL_SERVICE_SECRET` | `string` | Sí | Token secreto para autenticación entre microservicios |
| `WHATSAPP_TOKEN` | `string` | Sí | Meta Cloud API Token para mensajería WhatsApp |
| `WHATSAPP_PHONE_NUMBER_ID`| `string` | Sí | ID numérico del número de WhatsApp Business |
| `WHATSAPP_VERIFY_TOKEN` | `string` | Sí | Token de verificación para el webhook de Meta |

---

## 2. Docker Compose para el Microservicio IA

```yaml
# docker-compose.ai.yml
version: "3.8"

services:
  nexus-bot-service:
    build:
      context: ./NexusOdonto_ChatBot_AI
      dockerfile: Dockerfile
    container_name: nexus_chatbot_service
    restart: always
    environment:
      - ENVIRONMENT=production
      - PORT=8000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GEMINI_MODEL_NAME=gemini-1.5-flash
      - POSTGRES_DB_URL=postgresql+asyncpg://${BOT_DB_USER}:${BOT_DB_PASS}@bot-postgres:5432/nexus_bot
      - DOTNET_BACKEND_URL=http://backend-api:5000
      - INTERNAL_SERVICE_SECRET=${INTERNAL_SERVICE_SECRET}
      - WHATSAPP_TOKEN=${WHATSAPP_TOKEN}
      - WHATSAPP_PHONE_NUMBER_ID=${WHATSAPP_PHONE_NUMBER_ID}
      - WHATSAPP_VERIFY_TOKEN=${WHATSAPP_VERIFY_TOKEN}
    ports:
      - "8000:8000"
    depends_on:
      - bot-postgres
    networks:
      - nexus-internal-net

  bot-postgres:
    image: pgvector/pgvector:pg16
    container_name: nexus_bot_postgres
    restart: always
    environment:
      POSTGRES_USER: ${BOT_DB_USER}
      POSTGRES_PASSWORD: ${BOT_DB_PASS}
      POSTGRES_DB: nexus_bot
    volumes:
      - bot_pgdata:/var/lib/postgresql/data
    networks:
      - nexus-internal-net

volumes:
  bot_pgdata:

networks:
  nexus-internal-net:
    driver: bridge
```

---

## 3. Checklist de Verificación para Producción

1. [x] **Validación de Token de Webhook:** Probar el handshake `GET /webhook` con `hub.verify_token`.
2. [x] **Verificación de Extensión pgvector:** Confirmar que la extensión `CREATE EXTENSION IF NOT EXISTS vector;` esté ejecutada en la base de datos de PostgreSQL.
3. [x] **Control de Conexión .NET:** Ejecutar un health-check a `GET /health` del backend .NET para verificar la conectividad de red interna.
4. [x] **Monitoreo de Cuota Gemini:** Configurar alertas de presupuesto y cuota en Google Cloud Console para evitar interrupciones de servicio.
