---
title: "Despliegue y Orquestación con Docker"
order: 4
author: "NexusOdonto DevOps Team"
date: "2026-09-16"
---

# Despliegue y Orquestación con Docker Compose

El proyecto incluye un entorno de orquestación estandarizado mediante Docker Compose que levanta todos los microservicios, bases de datos y la interfaz web.

---

## 1. Arquitectura de Contenedores

```yaml
version: '3.8'

services:
  # 1. Base de Datos Oracle Express / Free
  oracle-db:
    image: container-registry.oracle.com/database/free:latest
    container_name: nexus-oracle-db
    ports:
      - "1521:1521"
    environment:
      - ORACLE_PWD=YourSecurePassword123!
      - ORACLE_CHARACTERSET=AL32UTF8
    volumes:
      - oracle_data:/opt/oracle/oradata
    networks:
      - nexus-network

  # 2. Backend Web API (.NET 8)
  backend-api:
    build:
      context: ./NexusOdontoBackend_Api
      dockerfile: Dockerfile
    container_name: nexus-backend-api
    depends_on:
      - oracle-db
    ports:
      - "5000:80"
    environment:
      - ConnectionStrings__OracleDb=Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle-db)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=FREEPDB1)));User Id=NEXUS_USER;Password=YourSecurePassword123!;
      - JwtSettings__Secret=NexusOdonto_Super_Secret_Key_JWT_Production_2026_Minimum_256_Bits!
      - SeedSettings__RunMigrations=true
      - SeedSettings__RunSeeds=true
      - InternalAuth__BotSecret=nexus-internal-bot-secret-2026
    networks:
      - nexus-network

  # 3. Base de Datos Semántica (Postgres + Pgvector)
  semantic-cache-db:
    image: pgvector/pgvector:pg16
    container_name: nexus-semantic-db
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=pguser
      - POSTGRES_PASSWORD=pgpassword
      - POSTGRES_DB=nexus_semantic_cache
    volumes:
      - pgvector_data:/var/lib/postgresql/data
    networks:
      - nexus-network

  # 4. Agente IA (FastAPI + Gemini)
  chatbot-ai:
    build:
      context: ./NexusOdonto_ChatBot_AI-develop
      dockerfile: Dockerfile
    container_name: nexus-chatbot-ai
    depends_on:
      - backend-api
      - semantic-cache-db
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NEXUS_API_BASE_URL=http://backend-api:80/api
      - INTERNAL_BOT_SECRET=nexus-internal-bot-secret-2026
      - SEMANTIC_CACHE_DB_URL=postgresql://pguser:pgpassword@semantic-cache-db:5432/nexus_semantic_cache
    networks:
      - nexus-network

  # 5. Frontend SPA (React + Vite + Nginx)
  frontend-web:
    build:
      context: ./NexusOdontoFrontend
      dockerfile: Dockerfile
    container_name: nexus-frontend-web
    ports:
      - "80:80"
    depends_on:
      - backend-api
    networks:
      - nexus-network

volumes:
  oracle_data:
  pgvector_data:

networks:
  nexus-network:
    driver: bridge
```

---

## 2. Comandos de Operación

### Iniciar todos los servicios en segundo plano:
```bash
docker compose up -d --build
```

### Ver logs en tiempo real del backend o bot:
```bash
docker compose logs -f backend-api
docker compose logs -f chatbot-ai
```

### Detener los servicios preservando los volúmenes de datos:
```bash
docker compose down
```
