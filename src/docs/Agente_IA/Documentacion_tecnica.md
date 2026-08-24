# Documento de Arquitectura y Especificación Técnica: Agente Conversacional con RAG para Sistema Odontológico

**Proyecto:** Sistema Integral de Gestión para Consultorios Odontológicos  
**Módulo:** Agente Conversacional Autónomo, Base de Conocimiento Vectorial (RAG) e Integraciones  
**Sub-equipo:** Agente de IA y Automatización  
**Stack de IA:** Python 3.11, FastAPI, LangGraph, LangChain, Qdrant, OpenAI Embeddings / LLMs, Evolution API  
**Infraestructura:** Docker / Docker Compose, Backend .NET Core API, Oracle Database  

- **Canal de Integración:** WhatsApp
- **Tecnología Seleccionada:** Evolution API (v2.1.1) - Repositorio Oficial: <https://github.com/evolution-foundation/evolution-api.git>

---

## 1. Alcance y Arquitectura General del Sistema

El agente conversacional resuelve la atención automatizada del consultorio odontológico mediante WhatsApp, operando bajo dos responsabilidades principales:

1. **Atención Clínica e Institucional con RAG:** Responde consultas sobre el catálogo de servicios (profilaxis, ortodoncia, endodoncia, exodoncias, blanqueamiento, resinas), tarifas estimadas, preparación preoperatoria, cuidados posteriores y políticas del consultorio. Utiliza búsqueda semántica sobre una base de datos vectorial para garantizar respuestas fundamentadas y libres de alucinaciones.
2. **Gestión Transaccional de Citas y Notificaciones:** Consulta disponibilidad de agenda en tiempo real, reserva, reprograma y cancela citas consumiendo la API REST en .NET Core (la cual interactúa con Oracle Database). Además, despacha recordatorios automáticos proactivos a los pacientes sin costo por mensaje.

```text
[ Paciente en WhatsApp ]
           │ (Mensaje de texto)
           ▼
[ Contenedor: Evolution API ] (:8080)
           │ HTTP POST (Webhook JSON)
           ▼
[ Contenedor: Agente FastAPI ] (:8000)
           │
           ├──► [ LangGraph Orquestador ] ◄── (Memoria por thread_id: Teléfono)
           │           │
           │           ├── (Consulta Clínica - RAG) ──► [ Contenedor: Qdrant ] (:6333)
           │           │
           │           └── (Cita / Agenda)          ──► [ Backend .NET Core API ] (:5000)
           │                                                       │
           │                                                       ▼
           │                                              [ Oracle Database ]
           │
           │ HTTP POST (/message/sendText)
           ▼
[ Contenedor: Evolution API ]
           │
           ▼
[ Paciente en WhatsApp ] (Respuesta Entregada)
```

---

# Módulo 1: Integración con WhatsApp y Evolution API

## 2. Contexto y Necesidad de Integración

El agente conversacional del consultorio odontológico debe interactuar en lenguaje natural con los pacientes para entregar información clínica mediante RAG, consultar disponibilidad de profesionales, agendar citas en el backend .NET y enviar recordatorios de manera oportuna. Para vincular el entorno en Python con WhatsApp se analizaron las dos alternativas técnicas viables: la API oficial de Meta (WhatsApp Cloud API) y el canal de código abierto basada en contenedores (Evolution API).

## 3. Análisis de Costos y Complejidad de Creación de Cuenta

- **API Oficial de Meta (WhatsApp Cloud API):** Solución con costos variables y un proceso de registro demandante. Exige crear una cuenta en *Meta for Developers*, configurar una organización en *Meta Business Manager*, registrar una aplicación comercial y someterse a verificaciones. En su modo de pruebas gratuito (*Sandbox*), únicamente permite enviar y recibir mensajes con un máximo de 5 números telefónicos previamente verificados. En producción, cobra por cada plantilla de mensaje enviada fuera de la ventana de atención y exige asociar métodos de pago corporativos.
- **Evolution API:** 100% gratuita y de código abierto. No requiere contratos, pagos por mensaje ni registros en portales de desarrolladores. Su vinculación se realiza desplegando el microservicio en Docker y escaneando un código QR desde la aplicación móvil de WhatsApp. Cualquier usuario o evaluador puede interactuar de inmediato desde su propio número sin trámites ni listas blancas previas.

## 4. Integración con Python, LangChain y LangGraph

- **Con la API oficial de Meta:** El servidor en FastAPI debe implementar un protocolo de verificación criptográfica inicial (*handshake* GET con tokens de desafío) y procesar esquemas JSON con múltiples capas de anidación para extraer el remitente y el texto. Además, requiere gestionar tokens de acceso con caducidad y llamadas a endpoints remotos en la nube de Meta.
- **Con Evolution API:** El microservicio envía al webhook de FastAPI un JSON plano y directo con el número telefónico del paciente y el cuerpo del mensaje. En Python, este número se extrae inmediatamente y se utiliza como identificador de sesión (`thread_id`) dentro del gestor de memoria de LangGraph. El grafo procesa el estado, ejecuta las herramientas de RAG o las consultas a la API de .NET, y FastAPI despacha la respuesta ejecutando una petición HTTP POST local autenticada mediante API Key hacia el contenedor de Evolution API.

## 5. Matriz Comparativa de Opciones

| Parámetro                    | WhatsApp Cloud API (Oficial Meta)                                      | Evolution API (Contenedor Open Source)                                   |
|:---------------------------- |:---------------------------------------------------------------------- |:------------------------------------------------------------------------ |
| **Costo Operativo**          | De pago en producción ($0.01 – $0.03 USD por mensaje saliente).        | 100% Gratuito y de código abierto. Sin costos por mensaje.               |
| **Complejidad de Cuenta**    | **Alta:** Meta for Developers, Business Manager y verificación.        | **Mínima:** Despliegue de contenedor y escaneo de código QR.             |
| **Límite de Destinatarios**  | Modo desarrollo limitado a máximo 5 números pre-registrados.           | **Sin límites:** Comunicación libre con cualquier número.                |
| **Recordatorios Proactivos** | Requiere plantillas aprobadas (*Utility Templates*) y pago por envío.  | **Gratis e ilimitado:** Despacho de texto dinámico en cualquier momento. |
| **Ventana de 24 Horas**      | **Estricta:** Bloquea texto libre fuera de 24h tras el último mensaje. | **Inexistente:** Permite emitir notificaciones en cualquier instante.    |
| **Integración con FastAPI**  | **Compleja:** Requiere *handshake* GET criptográfico y JSON anidado.   | **Sencilla:** Webhook con JSON plano y llamadas HTTP POST locales.       |
| **Dependencia de Hardware**  | Ninguna (servidores administrados por Meta).                           | Requiere mantener el contenedor activo y el móvil con sesión iniciada.   |

## 6. Límites de Mensajes, Ventana de Servicio y Recordatorios de Citas

- **API Oficial de Meta:** Rige una política estricta de ventana de 24 horas. Transcurrido ese lapso, el sistema se bloquea para texto libre y exige usar plantillas de utilidad (*Utility Templates*) aprobadas y de pago para enviar recordatorios.
- **Evolution API:** No impone restricciones de ventana de 24 horas ni límites arbitrarios de mensajes diarios. Un proceso en segundo plano en Python puede consultar a la API de .NET las citas programadas y enviar recordatorios personalizados con variables dinámicas (paciente, profesional, procedimiento y hora) de forma gratuita, desatendida e ilimitada, aplicando pausas de seguridad de 1 a 2 segundos entre envíos.

## 7. Justificación de la Elección Técnica

Se adopta **Evolution API** como la pasarela de comunicación definitiva para el sistema odontológico debido a que:

1. **Elimina barreras de acceso:** Permite realizar pruebas y sustentaciones inmediatas con cualquier número telefónico sin listas blancas ni verificaciones comerciales de Meta.
2. **Cero costos operativos:** Permite despachar recordatorios proactivos y atender dudas clínicas ilimitadamente sin cobro por mensaje saliente.
3. **Integración limpia con FastAPI/LangGraph:** Proporciona un payload directo para la extracción del `thread_id` del paciente y APIs REST locales de baja latencia.

## 8. Despliegue Standalone y Operación de Evolution API

### 8.1. Ejecución Standalone por Terminal (`docker run`) para Pasarela de WhatsApp

Si se desea levantar únicamente la pasarela de WhatsApp:

```bash
# 1. Crear volumen persistente para sesiones
docker volume create evolution_instances

# 2. Descargar la imagen oficial
docker pull atendai/evolution-api:v2.1.1

# 3. Ejecutar el contenedor
docker run -d \
  --name evolution_whatsapp \
  -p 8080:8080 \
  -e SERVER_URL=http://localhost:8080 \
  -e AUTHENTICATION_API_KEY=CLAVE_SECRETA_ODONTO_2026 \
  -e DATABASE_ENABLED=false \
  -e WEBHOOK_GLOBAL_ENABLED=true \
  -e WEBHOOK_GLOBAL_URL=http://localhost:8000/webhook/whatsapp \
  -e WEBHOOK_EVENTS_MESSAGES_UPSERT=true \
  -v evolution_instances:/evolution/instances \
  --restart always \
  atendai/evolution-api:v2.1.1
```

### 8.2. Comandos de Gestión y Operación de Evolution API

```bash
# Consultar logs en tiempo real
docker logs -f evolution_whatsapp

# Reiniciar el contenedor
docker restart evolution_whatsapp

# Detener el servicio preservando datos
docker compose down
```

## 9. Inicialización de Instancia y Vinculación de WhatsApp

Una vez levantado el contenedor, se inicializa la sesión y se genera el código QR para el consultorio:

### 9.1. Crear la Instancia

```bash
curl -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: CLAVE_SECRETA_ODONTO_2026" \
  -d '{
    "instanceName": "clinica_odonto",
    "token": "TOKEN_CLINICA_2026",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

### 9.2. Obtener el Código QR de Conexión

```bash
curl -X GET http://localhost:8080/instance/connect/clinica_odonto \
  -H "apikey: CLAVE_SECRETA_ODONTO_2026"
```

> **Nota:** Escanear el código QR resultante desde WhatsApp en el teléfono móvil (*Dispositivos vinculados > Vincular un dispositivo*).

### 9.3. Probar Envío de Mensaje Saliente

```bash
curl -X POST http://localhost:8080/message/sendText/clinica_odonto \
  -H "Content-Type: application/json" \
  -H "apikey: CLAVE_SECRETA_ODONTO_2026" \
  -d '{
    "number": "573001234567",
    "text": "Hola, bienvenido al sistema odontológico. ¿En qué podemos ayudarte hoy?",
    "delay": 1200
  }'
```

---

# Módulo 2: Base de Conocimiento Vectorial y RAG (Qdrant)

## 10. Comparativa, Selección y Arquitectura de la Base de Datos Vectorial

### 10.1. Matriz Comparativa

| Parámetro                  | Qdrant (Seleccionada)                                                              | ChromaDB (Descartada)                                                             | Oracle 23ai AI Vector Search (Descartada)                          |
|:-------------------------- |:---------------------------------------------------------------------------------- |:--------------------------------------------------------------------------------- |:------------------------------------------------------------------ |
| **Arquitectura**           | Microservicio independiente cliente-servidor en Docker escrito en Rust.            | Embebido en proceso sobre archivos locales SQLite/DuckDB.                         | Motor relacional corporativo con tipo de dato nativo `VECTOR`.     |
| **Concurrencia**           | **Alta concurrencia**: Procesamiento paralelo de consultas asíncronas.             | **Baja**: Riesgo de bloqueos de archivo (`database is locked`) bajo concurrencia. | Alta concurrencia transaccional ACID.                              |
| **Dashboard / Panel Web**  | **Web UI interactiva integrada** en el puerto 6333 para inspección en tiempo real. | No posee panel web gráfico nativo.                                                | Requiere SQL Developer o Oracle Enterprise Manager.                |
| **Consumo de Memoria**     | **50 MB – 100 MB RAM** (código máquina nativo sin Garbage Collector).              | Mínimo en pruebas locales, pero escala con el proceso Python.                     | **Alto**: Requiere de 2 GB a 4 GB de memoria RAM dedicados.        |
| **Integración con Python** | Paquete oficial de alto rendimiento `langchain-qdrant`.                            | Paquete estándar `langchain-chroma`.                                              | Integración `langchain-community` con dependencias complejas en C. |

### 10.2. Análisis de las Opciones Descartadas

* **ChromaDB:** Se descarta debido a sus limitaciones en entornos concurrentes. Al operar por defecto sobre SQLite local, cuando FastAPI recibe múltiples mensajes simultáneos desde WhatsApp, los accesos paralelos generan bloqueos de base de datos (`database is locked`) y caídas del servicio. Además, carece de interfaz web nativa para monitorear colecciones.
* **Oracle 23ai AI Vector Search:** Si bien la base de datos Oracle es de uso obligatorio para la información transaccional de la clínica gestionada por el backend en .NET, integrarla simultáneamente para RAG en Python introduce alta complejidad técnica: dependencias de librerías nativas en C (Oracle Client), cadenas de conexión pesadas y un alto consumo de RAM (varios gigabytes dedicados), comprometiendo los recursos del servidor compartido.

### 10.3. Justificación de Qdrant y Ventajas de su Motor en Rust

Se selecciona **Qdrant** por las siguientes ventajas técnicas:

1. **Eficiencia en Recursos:** Al estar compilado nativamente en Rust sin máquina virtual ni pausas por Garbage Collector, consume entre **50 MB y 100 MB de RAM**, dejando el servidor libre para la API de .NET, Oracle y el frontend.
2. **Latencia y Concurrencia:** Entrega latencias de búsqueda semántica constantes entre **1 y 5 ms**, manejando múltiples consultas asíncronas en paralelo sin bloqueos.
3. **Dashboard Web Integrado:** Proporciona una interfaz web interactiva en el puerto `6333` que permite visualizar colecciones, metadatos y realizar pruebas de búsqueda semántica en vivo durante la sustentación técnica.

## 11. Flujo de Integración de Qdrant con Python y LangGraph

La interacción entre el agente y Qdrant opera en dos fases:

```text
FASE 1: INGESTA DOCUMENTAL (Offline / Admin)
[ Documentos Clínicos (.pdf, .docx) ] 
       ──► [ Chunking Semántico + Metadatos ] 
       ──► [ OpenAI Embeddings ] 
       ──► [ Qdrant Collection (:6333) ]

FASE 2: INFERENCIA EN TIEMPO REAL (Online)
[ Mensaje Paciente ] 
       ──► [ LangGraph Orquestador ] 
       ──► ¿Duda Clínica? 
       ──► [ Tool: qdrant_retriever ] 
       ──► [ Inyección de Contexto en LLM ] 
       ──► [ Respuesta Oficial al Paciente ]
```

1. **Fase 1: Ingesta Documental:** Un script lee los documentos clínicos y administrativos del consultorio, los divide en fragmentos mediante *splitters* preservando metadatos (categoría, procedimiento, precio aproximado, preparación), calcula sus embeddings e inicializa la colección dentro de Qdrant.
2. **Fase 2: Inferencia en Tiempo de Ejecución:** FastAPI instancia `QdrantVectorStore` como un *retriever* semántico con umbral de similitud mínima, expuesto como una herramienta (`Tool`) dentro de LangChain/LangGraph. Cuando el paciente formula una consulta médica o de servicios, el nodo del asistente invoca la herramienta, recupera los fragmentos pertinentes en milisegundos y genera la respuesta fundamentada sin alucinaciones.

## 12. Despliegue Standalone de Qdrant

### 12.1. Despliegue de Qdrant Standalone (Opción Rápida por Terminal)

Si se desea ejecutar únicamente Qdrant sin levantar todo el stack:

```bash
docker run -d \
  --name qdrant_odonto \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant:v1.11.0
```

---

# Módulo 3: Orquestación Global y Entorno Python

## 13. Dependencias del Entorno Python (`requirements.txt`)

> [!NOTE]
> **Justificación de la versión de Python (3.11):** Se recomienda utilizar Python 3.11 (o máximo 3.12) y **no** versiones más recientes como 3.13 o 3.14. El ecosistema de IA (LangChain, Qdrant, Tiktoken, Pydantic) depende de librerías con extensiones en C y Rust que pueden tardar meses en publicar paquetes pre-compilados (*wheels*) para las versiones más nuevas de Python. Mantenerse en la versión 3.11 garantiza la máxima estabilidad, una instalación directa sin errores de compilación cruzada y un despliegue sin fricciones en el contenedor Docker.

```plaintext
# Orquestación de Agente y LLM
langchain==0.2.14
langchain-core==0.2.35
langchain-community==0.2.12
langgraph==0.2.14
langchain-openai==0.1.22

# Base de Datos Vectorial
qdrant-client==1.11.0
langchain-qdrant==0.1.3

# Servidor Web y API
fastapi==0.112.1
uvicorn[standard]==0.30.6
pydantic==2.8.2
httpx==0.27.0
python-dotenv==1.0.1

# Procesamiento Documental y Tokenización
tiktoken==0.7.0
pypdf==4.3.1
python-docx==1.1.2
```

## 14. Infraestructura y Despliegue con Docker

### 14.1. `docker-compose.yml`

```yaml
version: '3.8'

networks:
  odonto_network:
    driver: bridge

volumes:
  evolution_instances:
  qdrant_storage:

services:
  # Pasarela de WhatsApp
  evolution-api:
    image: atendai/evolution-api:v2.1.1
    container_name: evolution_whatsapp
    restart: always
    ports:
      - "8080:8080"
    environment:
      - SERVER_URL=http://localhost:8080
      - AUTHENTICATION_API_KEY=CLAVE_SECRETA_ODONTO_2026
      - DATABASE_ENABLED=false
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_GLOBAL_URL=http://agente_python:8000/webhook/whatsapp
      - WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false
      - WEBHOOK_EVENTS_MESSAGES_UPSERT=true
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - odonto_network

  # Base de Datos Vectorial (Qdrant)
  qdrant:
    image: qdrant/qdrant:v1.11.0
    container_name: qdrant_vector_db
    restart: always
    ports:
      - "6333:6333" # API REST y Web Dashboard UI
      - "6334:6334" # Puerto gRPC
    volumes:
      - qdrant_storage:/qdrant/storage
    networks:
      - odonto_network

  # Microservicio Agente en Python
  agente-python:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: agente_python
    restart: always
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=tu_openai_api_key
      - QDRANT_URL=http://qdrant:6333
      - EVOLUTION_API_URL=http://evolution-api:8080
      - EVOLUTION_API_KEY=CLAVE_SECRETA_ODONTO_2026
      - INSTANCE_NAME=clinica_odonto
      - DOTNET_API_URL=http://backend_dotnet:5000/api
      - AGENT_INTERNAL_SECRET=TOKEN_SECRETO_INTERNO_NET
    depends_on:
      - evolution-api
      - qdrant
    networks:
      - odonto_network
```

### 14.2. `Dockerfile` del Agente en Python

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 15. Guía de Comandos y Puesta en Marcha

### 15.1. Configuración del Entorno Local (Desarrollo)

```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Linux/Mac
# venv\Scripts\activate   # En Windows

# Instalar librerías
pip install -r requirements.txt
```

### 15.2. Despliegue de Todo el Sistema con Docker Compose

```bash
# 1. Descarga opcional previa de imágenes
docker pull atendai/evolution-api:v2.1.1
docker pull qdrant/qdrant:v1.11.0

# 2. Construir e iniciar todos los servicios en segundo plano
docker compose up -d --build

# 3. Verificar estado de los contenedores
docker ps
```

## 16. Verificación y Accesos Globales

* **Qdrant Web UI (Dashboard):** Abrir en el navegador `http://localhost:6333/dashboard` para inspeccionar colecciones, vectores cargados y metadatos.
* **Evolution API:** Acceso en `http://localhost:8080` para escanear el código QR y vincular la línea de WhatsApp.
* **FastAPI Docs:** Acceso a Swagger en `http://localhost:8000/docs` para validar los endpoints del webhook y del agente.
