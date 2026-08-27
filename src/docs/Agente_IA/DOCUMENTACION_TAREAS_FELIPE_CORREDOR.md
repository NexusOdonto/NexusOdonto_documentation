# Documentación Técnica de Tareas Realizadas

**Autor:** Felipe Corredor Silva  
**Fecha:** 25/08/2025  
**Proyecto:** NexusOdonto - ChatBot AI & Orquestación Global  

---

## Índice
1. [Visión General](#1-visión-general)
2. [Tarea 1: Orquestación Global con Docker Compose (#16)](#2-tarea-1-orquestación-global-con-docker-compose-16)
   - [Contexto Técnico](#contexto-técnico)
   - [Cambios e Infraestructura Implementada](#cambios-e-infraestructura-implementada)
   - [Configuración de `docker-compose.yml`](#configuración-de-docker-composeyml)
   - [Criterios de Aceptación Cumplidos (DoD)](#criterios-de-aceptación-cumplidos-dod)
3. [Tarea 2: Autenticación Service-to-Service (API Key) para el Agente (#17)](#3-tarea-2-autenticación-service-to-service-api-key-para-el-agente-17)
   - [Contexto Técnico](#contexto-técnico-1)
   - [Implementación en el Agente Python](#implementación-en-el-agente-python)
   - [Criterios de Aceptación Cumplidos (DoD)](#criterios-de-aceptación-cumplidos-dod-1)
4. [Resumen de Ramas Git Creadas y Gestión de Cambios](#4-resumen-de-ramas-git-creadas-y-gestión-de-cambios)

---

## 1. Visión General

Durante la jornada de trabajo del 25/08/2025, **Felipe Corredor Silva** lideró e implementó la arquitectura de orquestación de infraestructura mediante **Docker Compose** para los 5 componentes centrales del sistema NexusOdonto, así como la configuración de la seguridad **Service-to-Service (API Key)** para la comunicación entre el Agente de Python y la API de .NET.

---

## 2. Tarea 1: Orquestación Global con Docker Compose (#16)

### Contexto Técnico
El sistema NexusOdonto consta de 5 piezas móviles que deben comunicarse en paralelo dentro del mismo ecosistema de contenedores:
1. **Oracle Database** (Base de datos relacional principal)
2. **API en .NET** (Backend de la clínica)
3. **Evolution API** (Gateway de integración con WhatsApp)
4. **Qdrant Vector DB** (Base de datos vectorial para RAG)
5. **Agente Python** (Bot de Inteligencia Artificial con FastAPI)

### Cambios e Infraestructura Implementada
- **Red de comunicación interna:** Creación y vinculación de la red tipo *bridge* llamada `odontologia_network` para permitir el descubrimiento por nombre de host.
- **Persistencia de Datos:**
  - `oracle_data`: Mapeado a `/opt/oracle/oradata` para prevenir la pérdida de datos relacionales al reiniciar el contenedor.
  - `evolution_instances`: Mapeado a `/evolution/instances` para preservar las sesiones de WhatsApp Web iniciadas en la API.
- **Imagen Oficial de Evolution API:** Actualización de la imagen a `evoapicloud/evolution-api:v2.1.1`.
- **Variables de Entorno del Agente Python:** Configuración de las URLs internas para resolución directa de DNS en Docker (`http://backend-api:5000/api/v1`, `http://qdrant-db:6333`, `http://evolution-whatsapp:8080`).

### Configuración de `docker-compose.yml`

```yaml
services:
  oracle-db:
    image: gvenzl/oracle-free:latest
    container_name: odontologia_oracle
    environment:
      - ORACLE_PASSWORD=Admin123Password!
      - APP_USER=odontologia_user
      - APP_PASSWORD=Odontologia123!
    ports:
      - "1521:1521"
    volumes:
      - oracle_data:/opt/oracle/oradata
    networks:
      - odontologia_network

  backend-api:
    build:
      context: ./Backend_Odontologia
      dockerfile: Dockerfile
    container_name: backend-api
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_HTTP_PORTS=5000
    depends_on:
      - oracle-db
    networks:
      - odontologia_network

  evolution-whatsapp:
    image: evoapicloud/evolution-api:v2.1.1
    container_name: evolution_whatsapp
    ports:
      - "8080:8080"
    environment:
      - AUTHENTICATION_API_KEY=CLAVE_SECRETA_ODONTO_2026
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_GLOBAL_URL=http://agente-python:8000/webhook/whatsapp
      - WEBHOOK_EVENTS_MESSAGES_UPSERT=true
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - odontologia_network

  qdrant-db:
    image: qdrant/qdrant:v1.11.0
    container_name: qdrant_vector
    ports:
      - "6333:6333"
    networks:
      - odontologia_network

  agente-python:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: agente_python
    ports:
      - "8000:8000"
    environment:
      - QDRANT_URL=http://qdrant-db:6333
      - EVOLUTION_API_URL=http://evolution-whatsapp:8080
      - DOTNET_API_URL=http://backend-api:5000/api/v1
    depends_on:
      - oracle-db
      - qdrant-db
      - evolution-whatsapp
      - backend-api
    networks:
      - odontologia_network

volumes:
  oracle_data:
  evolution_instances:

networks:
  odontologia_network:
    driver: bridge
```

### Criterios de Aceptación Cumplidos (DoD)
- [x] Al ejecutar `docker compose up -d`, los 5 contenedores se levantan exitosamente sin conflictos de puertos.
- [x] Los contenedores se pueden comunicar entre sí usando sus nombres de host internos (ej. `http://backend-api:5000`).

---

## 3. Tarea 2: Autenticación Service-to-Service (API Key) para el Agente (#17)

### Contexto Técnico
La API de .NET utiliza autenticación con tokens JWT para el personal clínico. Al ser el Agente de Python un sistema automatizado, requiere un mecanismo de autenticación **Service-to-Service** seguro para consultar disponibilidad y agendar citas en nombre de los pacientes.

### Implementación en el Agente Python
En el archivo [`app/clients/dotnet_client.py`](file:///c:/Users/ESSA3/Documents/NexusOdonto_ChatBot_AI/app/clients/dotnet_client.py), se configuró la inyección automática del encabezado de seguridad `X-Api-Key`:

```python
import os
import logging
from typing import Optional, Dict, Any, List
import httpx
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class DotNetClient:
    def __init__(self):
        self.base_url: str = os.getenv("DOTNET_API_URL", "http://localhost:5000/api/v1").rstrip("/")
        self.secret_token: str = os.getenv("AGENT_INTERNAL_SECRET", "")
        self.timeout: float = float(os.getenv("DOTNET_API_TIMEOUT", "10.0"))

    def _get_headers(self) -> Dict[str, str]:
        """Encabezados con token Service-to-Service (API Key) para autenticación en .NET."""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if self.secret_token:
            headers["Authorization"] = f"Bearer {self.secret_token}"
            headers["X-Api-Key"] = self.secret_token
            headers["x-api-key"] = self.secret_token
        return headers

    async def consultar_disponibilidad(
        self, profesional_id: Optional[int] = None, fecha: Optional[str] = None
    ) -> Optional[List[Dict[str, Any]]]:
        url = f"{self.base_url}/citas/disponibilidad"
        params: Dict[str, Any] = {}
        if profesional_id:
            params["profesionalId"] = profesional_id
        if fecha:
            params["fecha"] = fecha

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params, headers=self._get_headers())
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"[.NET Client] Error HTTP {e.response.status_code}: {e.response.text}")
                return None
```

### Criterios de Aceptación Cumplidos (DoD)
- [x] El Agente de Python inyecta correctamente el encabezado `X-Api-Key` en todas las peticiones salientes hacia la API en .NET.
- [x] El secreto se mantiene centralizado a través de la variable de entorno `AGENT_INTERNAL_SECRET` en el archivo `.env`.

---

## 4. Resumen de Ramas Git Creadas y Gestión de Cambios

- **Rama para Issue #16 (DevOps):** `chore/devops-docker-compose`
- **Rama para Issue #17 (Security S2S):** `feat/api-bot-authentication`
- **Integración:** Sincronización limpia realizada con `git pull origin develop` y resolución exitosa de stashes.

---
*Documentación generada para registro del proyecto NexusOdonto.*
