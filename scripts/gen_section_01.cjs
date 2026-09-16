const fs = require('fs');
const path = require('path');

const docsRoot = path.resolve(__dirname, '..', 'src', 'docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('[SEC 01] Successfully wrote:', relPath);
}

writeDoc('01_Arquitectura_y_Entorno/01_Vision_General_y_Stack.md', `---
title: "Visión General y Stack Tecnológico"
order: 1
author: "NexusOdonto Tech Lead"
date: "2026-09-16"
---

# Visión General y Arquitectura del Sistema NexusOdonto

**NexusOdonto** es una plataforma odontológica integral de grado empresarial diseñada para la digitalización de la atención clínica, odontogramas interactivos bajo norma FDI, agendamiento inteligente con balanceo de carga de profesionales y triaje conversacional asistido por Inteligencia Artificial multimodal.

\`\`\`
                     +----------------------------------------------+
                     |            CLIENTE / USUARIOS SPA            |
                     |  (Pacientes, Odontólogos, Recepción, Admin)  |
                     +----------------------+-----------------------+
                                            | HTTPS / WSS
                                            v
                     +----------------------------------------------+
                     |      FRONTEND WEB (React 18 + Vite + TS)     |
                     |  - Odontograma Interactivo FDI (5 caras)     |
                     |  - Agenda y Turnos en Horario Colombia       |
                     |  - Motor de PDF (Historia, Fórmula, Registro)|
                     |  - Panel Atención Chat y Asesor Humano       |
                     +----------------------+-----------------------+
                                            | REST API (JWT Bearer)
                                            v
                     +----------------------------------------------+
                     |      BACKEND WEB API (.NET 8 C# Clean)       |
                     |  - Domain-Driven Design + EF Core            |
                     |  - RBAC Canónico & SeedAdminGuard            |
                     |  - Google OAuth Link / Unlink & JWT Refresh  |
                     |  - Auto-asignación de odontólogos libres     |
                     +----------------------+---------------+-------+
                                            |               | X-Internal-Secret
                                            |               v
                                            |     +-----------------------------------+
                                            |     |    AGENTE IA (Python FastAPI)     |
                                            |     |  - Gemini 1.5 Flash / Pro LLM     |
                                            |     |  - PostgreSQL + Pgvector Cache    |
                                            |     |  - Citas & Triaje sin login       |
                                            |     +-----------------------------------+
                                            v
                     +----------------------------------------------+
                     |        MOTOR DE BASE DE DATOS ORACLE         |
                     |  - Oracle 19c / 23ai Relational DB           |
                     |  - Tablas transaccionales y de auditoría     |
                     |  - Límite de notas 2000 chars (Anti-ORA)     |
                     +----------------------------------------------+
\`\`\`

---

## 1. Stack Tecnológico Central

| Capa / Módulo | Tecnología | Versión / Especificación | Responsabilidad Principal |
|---|---|---|---|
| **Frontend Web** | React + TypeScript + Vite | React 18.3, TS 5.4, Vite 5.2 | Interfaz SPA reactiva, Odontograma FDI interactivo, renderizado de PDF, gestión de sesiones y control de accesos RBAC. |
| **Estilos & UI** | CSS Modules / Custom Tokens | Design System Nexus Tokens, Lucide Icons, Blobatar | Consistencia visual clínica, diseño responsive (mobile first para chat y citas) y avatares geométricos. |
| **Backend API** | ASP.NET Core (.NET 8) | C# 12, .NET 8 LTS | Clean Architecture, controladores REST, Entity Framework Core, validaciones FluentValidation, BCrypt y JWT. |
| **Motor de Base de Datos** | Oracle Database | 19c / 23ai Free Container | Almacenamiento relacional transaccional ACID, tablas de usuarios, historias clínicas, citas, odontogramas y servicios. |
| **Agente Inteligente (AI)** | Python + FastAPI | Python 3.11, FastAPI, Google GenAI SDK | Asistente conversacional de triaje, agendamiento de citas guiado y derivación a asesores humanos. |
| **Caché Semántica** | PostgreSQL + Pgvector | PostgreSQL 16 con extensión vector | Reducción de costos de inferencia en LLMs y almacenamiento de embeddings de preguntas frecuentes. |
| **Orquestación & CI/CD** | Docker & Docker Compose | Compose v2 Multi-service | Entorno de desarrollo y staging unificado con contenedores para API, Oracle, Chatbot y Semantic DB. |

---

## 2. Principios de Diseño y Arquitectura

1. **Aislamiento Estricto de Datos del Paciente:**
   * El paciente únicamente tiene visibilidad sobre sus propias citas, odontogramas e historias clínicas (\`patient_id\` vinculado a su identidad autenticada).
   * Se previene cualquier fuga de métricas administrativas, ingresos financieros o listas globales de pacientes hacia perfiles no autorizados.

2. **Gestión Determinista de Horarios (Zona Horaria Colombia):**
   * Toda la lógica de disponibilidad y agendamiento opera en \`America/Bogota\` (UTC-5), garantizando que las citas creadas por pacientes, recepcionistas o el bot coincidan de manera exacta con los turnos clínicos.

3. **Resiliencia de Seeders y Protección de Cuentas Maestras:**
   * El usuario Administrador semilla (\`AD001\` / \`admin@nexusodonto.com\`) cuenta con un guardián de seguridad (\`SeedAdminGuard\`) en el backend que bloquea su desactivación o eliminación en caliente.

4. **Integración Segura entre Microservicios y Bot:**
   * El chatbot se comunica con la API central mediante el encabezado de seguridad \`X-Internal-Secret\`, restringiendo operaciones automatizadas y bloqueando inicios de sesión interactivos directos desde la cuenta de servicio del bot (\`BOT_SERVICE\`).
`);

writeDoc('01_Arquitectura_y_Entorno/02_Variables_de_Entorno.md', `---
title: "Variables de Entorno y Configuración"
order: 2
author: "NexusOdonto DevOps Team"
date: "2026-09-16"
---

# Variables de Entorno y Configuración del Sistema

A continuación se detalla la configuración requerida para cada uno de los entornos y proyectos del ecosistema.

---

## 1. Backend .NET Web API (\`appsettings.json\` / Variables de Entorno)

\`\`\`json
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
\`\`\`

### Mapeo a Variables de Entorno en Docker / Linux:
* \`ConnectionStrings__OracleDb\` -> Cadena de conexión JDBC/Oracle.
* \`JwtSettings__Secret\` -> Llave secreta HMAC-SHA256 para firma de tokens.
* \`InternalAuth__BotSecret\` -> Secreto compartido para autenticar al bot.
* \`SeedSettings__RunMigrations\` -> \`true\` para aplicar migraciones al arrancar.
* \`SeedSettings__RunSeeds\` -> \`true\` para poblar roles, usuarios iniciales y catálogos.

---

## 2. Frontend React (\`.env\` / \`.env.production\`)

\`\`\`env
# URL base de la API REST del backend
VITE_API_URL=http://localhost:5000/api

# Client ID de Google para inicio de sesión y vinculación OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Nombre de la aplicación en el título del navegador
VITE_APP_TITLE=NexusOdonto - Plataforma Clínica Odontológica

# Modo de depuración de logs
VITE_ENABLE_DEBUG_LOGS=false
\`\`\`

---

## 3. Agente IA FastAPI (\`.env\`)

\`\`\`env
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
\`\`\`
`);

writeDoc('01_Arquitectura_y_Entorno/03_Base_de_Datos_Oracle_y_Cache.md', `---
title: "Base de Datos Oracle y Caché Semántica"
order: 3
author: "NexusOdonto DBA & Architecture Team"
date: "2026-09-16"
---

# Base de Datos Oracle y Caché Semántica

NexusOdonto combina la robustez transaccional ACID de Oracle Database con el alto rendimiento de búsqueda vectorial de PostgreSQL para la inteligencia artificial.

---

## 1. Esquema Relacional Principal (Oracle 19c / 23ai)

El modelo de datos se gestiona mediante migraciones de Entity Framework Core con tablas creadas en el tablespace por defecto de la aplicación.

### Tablas Principales

| Tabla / Entidad | Descripción | Claves Foráneas / Índices Clave |
|---|---|---|
| \`PERSONS\` | Datos personales base de pacientes, doctores y empleados. | \`DocumentTypeId\`, índice único en \`DocumentNumber\`. |
| \`USERS\` | Cuentas de acceso con hash de contraseña BCrypt. | \`PersonId\` (1:1), campos \`IsActive\`, \`GoogleId\`. |
| \`ROLES\` | Definición canónica de roles del sistema. | \`Code\` único (\`ADMINISTRADOR\`, \`ODONTOLOGO\`, etc.). |
| \`PERMISSIONS\` | Permisos atómicos granulares del sistema. | \`Code\` único (\`PATIENTS:VIEW\`, \`ODONTOGRAM:CREATE\`, etc.). |
| \`USER_ROLES\` | Relación muchos a muchos entre usuarios y roles. | (\`UserId\`, \`RoleId\`) clave compuesta. |
| \`ROLE_PERMISSIONS\`| Asignación de permisos por rol. | (\`RoleId\`, \`PermissionId\`) clave compuesta. |
| \`EMPLOYEES\` | Ficha laboral de administradores, recepcionistas y asistentes. | \`PersonId\`, \`JobTitleId\`, \`EmployeeCode\` único. |
| \`PROFESSIONALS\` | Ficha profesional de odontólogos y especialistas. | \`PersonId\`, \`SpecialtyId\`, \`LicenseNumber\`. |
| \`PATIENTS\` | Ficha clínica y antecedentes de pacientes. | \`PersonId\`, \`EmergencyContact\`, \`BloodType\`. |
| \`SERVICES\` | Catálogo de procedimientos odontológicos y tarifas. | \`Code\`, \`Category\`, \`Price\`, \`IsActive\`. |
| \`APPOINTMENTS\` | Citas médicas y estado de agendamiento. | \`PatientId\`, \`ProfessionalId\`, \`ServiceId\`, \`AppointmentDateTime\`. |
| \`ODONTOGRAMS\` | Cabecera del odontograma por sesión o paciente. | \`PatientId\`, \`ProfessionalId\`, \`RecordDate\`. |
| \`ODONTOGRAM_ITEMS\`| Estado individual de cada diente y superficie. | \`OdontogramId\`, \`ToothNumber\`, \`SurfaceCode\`, \`StatusCode\`. |
| \`CLINICAL_RECORDS\`| Evoluciones e historia clínica longitudinal. | \`PatientId\`, \`ProfessionalId\`, \`EvolutionNote\` (max 2000 ch). |
| \`CHATBOT_TICKETS\` | Tickets de soporte escalados a recepcionistas/asesores. | \`ConversationId\`, \`Status\`, \`AssignedAdvisorId\`. |

---

## 2. Reglas Técnicas y Consideraciones Oracle (Anti-ORA Errors)

1. **Truncamiento Preventivo de Notas Clínicas (Anti-ORA-12899):**
   * Oracle limita columnas \`VARCHAR2(2000)\` a 2000 bytes. Almacenar caracteres acentuados o emojis puede exceder el límite en codificación UTF-8.
   * El servicio de Odontograma y Evoluciones ejecuta un sanitizado y recorte automático de cadenas a 2000 caracteres antes de persistir:
   \`\`\`csharp
   if (!string.IsNullOrEmpty(request.Notes) && request.Notes.Length > 2000)
   {
       request.Notes = request.Notes.Substring(0, 2000);
   }
   \`\`\`

2. **Eliminación del marcador de estado legacy (\`ODONTOGRAM_STATE\`):**
   * Se eliminó el almacenamiento redundante de JSON serialized en texto para los estados dentales, migrando a filas normalizadas en \`ODONTOGRAM_ITEMS\` para optimizar consultas e integridad referencial.

3. **Soft Delete y Filtros Globales de Consulta:**
   * Las entidades implementan \`IsActive\` o \`IsDeleted\`.
   * En \`DatabaseInitializer\`, se utiliza \`.IgnoreQueryFilters()\` para reactivar cuentas semilla (como el Admin \`AD001\`) si fueron marcadas como inactivas accidentalmente.

---

## 3. Base de Datos de Caché Semántica (PostgreSQL + Pgvector)

El chatbot utiliza una base de datos auxiliar para almacenar vectores de embeddings (768 dimensiones) generados con \`text-embedding-004\` de Google.

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE semantic_cache (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    response_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hit_count INT DEFAULT 1
);

CREATE INDEX semantic_cache_embedding_idx 
ON semantic_cache USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
\`\`\`
`);

writeDoc('01_Arquitectura_y_Entorno/04_Despliegue_y_Docker.md', `---
title: "Despliegue y Orquestación con Docker"
order: 4
author: "NexusOdonto DevOps Team"
date: "2026-09-16"
---

# Despliegue y Orquestación con Docker Compose

El proyecto incluye un entorno de orquestación estandarizado mediante Docker Compose que levanta todos los microservicios, bases de datos y la interfaz web.

---

## 1. Arquitectura de Contenedores

\`\`\`yaml
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
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
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
\`\`\`

---

## 2. Comandos de Operación

### Iniciar todos los servicios en segundo plano:
\`\`\`bash
docker compose up -d --build
\`\`\`

### Ver logs en tiempo real del backend o bot:
\`\`\`bash
docker compose logs -f backend-api
docker compose logs -f chatbot-ai
\`\`\`

### Detener los servicios preservando los volúmenes de datos:
\`\`\`bash
docker compose down
\`\`\`
`);
