# Documentacion Jeison Cristancho

## 1. Objetivo del proyecto

Se está construyendo un chatbot odontológico para Nexus Odonto, orientado a atender pacientes por WhatsApp y a coordinar procesos de agenda, información clínica y atención inicial. La solución combina:

- FastAPI como backend del agente
- LangGraph para el flujo conversacional
- OpenAI para la lógica del asistente
- Qdrant para memoria vectorial / conocimiento clínico
- PostgreSQL para checkpoints y persistencia del estado del hilo de conversación
- Evolution API para el envío y recepción de mensajes por WhatsApp
- API .NET para integración con la agenda y la información del consultorio

---

## 2. Qué se implementó durante el dia 27/8/2026

### 2.1 Backend principal y arranque del servicio

Se dejó estructurado el servicio principal en [app/main.py](../app/main.py), con:

- Inicialización de FastAPI
- Middleware para validación de webhooks de WhatsApp
- CORS habilitado para integración externa
- Health check en /health
- Startup y shutdown del sistema
- Configuración de scheduler para recordatorios automáticos
- Preparación de PostgreSQL y de Qdrant al iniciar la aplicación

Este punto es clave porque deja el servicio listo para operar como punto central para todos los flujos del bot.

### 2.2 Flujo conversacional con LangGraph

La lógica principal del agente quedó montada en:

- [app/graph/builder.py](../app/graph/builder.py)
- [app/graph/nodes.py](../app/graph/nodes.py)
- [app/graph/state.py](../app/graph/state.py)

Se implementó un grafo con estas piezas:

- `security_check`: valida si el mensaje del usuario es seguro o puede representar prompt injection, jailbreak o contenido ofensivo.
- `chatbot`: genera la respuesta del asistente virtual con contexto del día actual y de la conversación.
- `tools`: permite invocar herramientas del agente como búsqueda clínica y consulta de disponibilidad.

También se configuró un estado persistente para la conversación con checkpoints en PostgreSQL, para que el hilo no se pierda si el backend se reinicia.

### 2.3 Integración con WhatsApp / webhook

La entrada de mensajes de WhatsApp quedó conectada en:

- [app/api/routes/webhook.py](../app/api/routes/webhook.py)

Este webhook:

- acepta mensajes entrantes desde Evolution API
- valida que el mensaje venga de un interlocutor válido
- ignora mensajes propios del bot
- controla escalamiento a atención humana
- decide si el mensaje debe ir al agente o directamente a una respuesta de atención humana
- envía la respuesta final de vuelta al paciente por WhatsApp

Se añadió una lógica de escalamiento para cuando:

- el usuario pide hablar con un humano
- la confianza del RAG está por debajo del umbral configurado
- el bot detecta una intención de soporte o seguimiento manual

### 2.4 RAG de conocimiento clínico con Qdrant

La base de conocimiento clínica quedó integrada en:

- [app/agents/tools/qdrant_tool.py](../app/agents/tools/qdrant_tool.py)

Se configuró:

- conexión a Qdrant
- creación de colección si no existe
- embeddings usando OpenAI
- recuperación semántica con Qdrant
- reranking con CrossEncoder para mejorar la calidad de los resultados
- herramienta `buscar_conocimiento_clinico` accesible para el agente

La idea es que el bot no responda solo con generalidades, sino que recurra a un repositorio documental clínico para responder con base en información útil y verificada.

### 2.5 Herramientas del agente para agenda y disponibilidad

La capa de agenda quedó implementada en:

- [app/agents/tools/agenda_tools.py](../app/agents/tools/agenda_tools.py)

Se desarrollaron dos herramientas clave:

1. `consultar_disponibilidad_tool`
   - recibe especialidad y fecha
   - consulta especialidades del backend .NET
   - encuentra profesionales y servicios
   - valida horarios disponibles por profesional
   - devuelve una versión amigable para el usuario

2. `agendar_cita_tool`
   - valida la identidad del paciente dentro de la conversación
   - busca paciente por teléfono si hace falta
   - vincula al paciente si existe
   - envía la información al backend .NET para registrar la cita
   - devuelve confirmación final

También se definió la regla de negocio de seguridad para la agenda: antes de agendar, el bot debe proponer la cita y pedir confirmación explícita del paciente.

### 2.6 Cliente para API .NET

Se creó la capa de comunicación con el backend del consultorio en:

- [app/clients/dotnet_client.py](../app/clients/dotnet_client.py)

La integración incluye:

- consultas de especialidades
- consulta de profesionales
- consulta de servicios
- disponibilidad por fecha
- búsqueda de pacientes
- vinculación de paciente a conversación
- obtención de contexto de conversación
- creación de citas
- consulta de citas
- creación de tickets de soporte

Esto deja el bot preparado para trabajar con el sistema de negocio central del consultorio.

### 2.7 Recordatorios automáticos por WhatsApp

La lógica de recordatorios quedó en:

- [app/services/appointment_reminders.py](../app/services/appointment_reminders.py)

Su funcionalidad es:

- consultar las citas del día siguiente desde .NET
- normalizar nombres de campos para soportar varias estructuras de respuesta
- detectar paciente, servicio y teléfono
- enviar un mensaje por WhatsApp recordando la cita

El scheduler se monta en [app/main.py](../app/main.py) para ejecutarse en una hora específica del día, configurada en [app/core/config.py](../app/core/config.py).

### 2.8 Persistencia de conversación con PostgreSQL

La persistencia del estado del agente quedó implementada en:

- [app/session/postgres_checkpointer.py](../app/session/postgres_checkpointer.py)

Esto permite:

- guardar checkpoints del grafo
- recuperar el estado de la conversación tras reinicios
- mantener continuidad del hilo conversacional

---

## 3. Patrón arquitectónico que quedó definido

La solución se organiza en varios módulos con roles bien definidos:

### Capa de entrada

- WhatsApp webhook
- Validación de firma/autenticación
- Manejo de mensajes entrantes

### Capa de orquestación

- LangGraph
- LLM
- herramientas
- estado de sesión

### Capa de conocimiento

- Qdrant
- embeddings
- reranker
- recuperación semántica

### Capa de negocio/externa

- .NET API
- agenda
- pacientes
- artículos/servicios
- tickets

### Capa de infraestructura

- PostgreSQL
- scheduler/recordatorios
- logging y monitoreo

---

## 4. Reglas y decisiones de negocio que se definieron

Durante estas sesiones se fijaron varias decisiones importantes:

### 4.1 Seguridad del chatbot

- El agente debe detectar prompts de jailbreak, intentos de manipulación o mensajes ofensivos.
- Si detecta algo sospechoso, bloquea la conversación en ese hilo.
- El bot está configurado para responder de forma limitada y médica sin hacer diagnósticos directos.

### 4.2 Agendamiento responsable

- No se agenda una cita sin mostrar los datos de la cita y pedir confirmación explícita.
- Se exige que el paciente confirme antes de registrar la cita.
- Si la confianza de la respuesta es baja, se escaló a atención humana.

### 4.3 Atención odontológica

- El bot no sustituye la evaluación de un profesional.
- En urgencias o síntomas importantes, se recomienda contacto directo con el consultorio o urgencias.

### 4.4 Reducción de riesgo y escalamiento

- Cuando el agente no tiene certeza suficiente, evita responder una información que pueda ser incorrecta.
- En ese caso se crea un ticket de soporte o se deriva la solicitud a una persona.

---

## 5. Estado actual del proyecto

El proyecto ya quedó con una base funcional bastante sólida de:

- backend en Python/FastAPI
- flujo conversacional con LangGraph
- integraciones con WhatsApp y .NET
- memoria semántica con Qdrant
- agenda real con consulta y agendamiento
- recordatorios automáticos
- persistencia del estado por hilo

En términos de avance, lo más importante es que ya no está solo un prototipo aislado; ya se tiene una estructura de aplicación operativa y conectada a los principales elementos del negocio.

---

## 6. Pendientes y próximos pasos sugeridos

Aún quedan pendientes tareas importantes para cerrar la operación real del sistema:

- validar la API .NET frente al Swagger real
- confirmar contratos exactos de fechas, payloads y errores
- ajustar detalles de autenticación y permisos del backend .NET
- revisar campos reales de paciente, agenda y servicios con el equipo del negocio
- probar flujos reales de agendamiento y recordatorios con datos reales
- definir una política más específica para escalamiento, tickets y reprogramación

---
