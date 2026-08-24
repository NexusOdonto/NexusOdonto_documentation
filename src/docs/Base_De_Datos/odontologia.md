# Odontología — SQL

```sql
CREATE TABLE "tipos_documento" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(20) UNIQUE NOT NULL,
  "nombre" varchar2(80) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3),
  "fecha_creacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE "sexos" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(20) UNIQUE NOT NULL,
  "nombre" varchar2(80) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3),
  "fecha_creacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE "cargos" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3),
  "fecha_creacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE "acciones_permiso" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "tipos_antecedente" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "especialidades" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "servicios" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(120) UNIQUE NOT NULL,
  "descripcion" clob,
  "duracion_minutos" number(4) NOT NULL,
  "precio" number(12,2),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3),
  "creado_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE "estados_cita" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "color_hex" varchar2(7),
  "orden" number(3),
  "es_final" number(1) DEFAULT 0 NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL
);

CREATE TABLE "origenes_cita" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "tipos_denticion" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "estados_diente" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "color_hex" varchar2(7),
  "codigo_visual" varchar2(30),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "superficies_dentales" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "aplica_a_anteriores" number(1) DEFAULT 1 NOT NULL,
  "aplica_a_posteriores" number(1) DEFAULT 1 NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden_visual" number(3)
);

CREATE TABLE "tipos_hallazgo" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "color_hex" varchar2(7),
  "simbolo_visual" varchar2(30),
  "requiere_superficie" number(1) DEFAULT 0 NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "estados_hallazgo" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "color_hex" varchar2(7),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "estados_sesion" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "tipos_notificacion_hub" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(60) UNIQUE NOT NULL,
  "nombre" varchar2(120) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "icono" varchar2(100),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "prioridades_notificacion" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "color_hex" varchar2(7),
  "nivel" number(3),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "estados_notificacion_hub" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "tipos_notificacion_whatsapp" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(60) UNIQUE NOT NULL,
  "nombre" varchar2(120) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "plantilla_predeterminada" varchar2(100),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "estados_notificacion_whatsapp" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "canales_chat" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "estados_conversacion_chatbot" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "es_final" number(1) DEFAULT 0 NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "roles_mensaje_chatbot" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "estados_ticket_soporte" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "es_final" number(1) DEFAULT 0 NOT NULL,
  "permite_asignacion" number(1) DEFAULT 0 NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "motivos_ticket_soporte" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(60) UNIQUE NOT NULL,
  "nombre" varchar2(120) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "tipos_evento_auditoria" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(60) UNIQUE NOT NULL,
  "nombre" varchar2(150) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "categoria" varchar2(80),
  "nivel_riesgo" number(3),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "orden" number(3)
);

CREATE TABLE "personas" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "tipo_documento_id" number NOT NULL,
  "numero_documento" varchar2(30) NOT NULL,
  "nombres" varchar2(100) NOT NULL,
  "apellidos" varchar2(100) NOT NULL,
  "fecha_nacimiento" date,
  "sexo_id" number,
  "telefono" varchar2(30),
  "email" varchar2(150),
  "direccion" varchar2(250),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "fecha_creacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "actualizado_en" timestamp
);

CREATE TABLE "pacientes" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "persona_id" number UNIQUE NOT NULL,
  "contacto_emergencia" varchar2(150),
  "telefono_emergencia" varchar2(30),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "fecha_registro" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "actualizado_en" timestamp
);

CREATE TABLE "empleados" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "persona_id" number UNIQUE NOT NULL,
  "cargo_id" number NOT NULL,
  "fecha_vinculacion" date DEFAULT SYSDATE NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL,
  "fecha_creacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "actualizado_en" timestamp
);

CREATE TABLE "usuarios" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "persona_id" number UNIQUE NOT NULL,
  "password_hash" varchar2(500) NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL,
  "ultimo_acceso" timestamp,
  "fecha_creacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "actualizado_en" timestamp
);

CREATE TABLE "profesionales" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "empleado_id" number UNIQUE NOT NULL,
  "registro_profesional" varchar2(50) UNIQUE NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL
);

CREATE TABLE "sesiones" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "usuario_id" number NOT NULL,
  "refresh_token_hash" varchar2(512) UNIQUE NOT NULL,
  "token_familia" varchar2(100) NOT NULL,
  "dispositivo" varchar2(200),
  "direccion_ip" varchar2(64),
  "agente_usuario" varchar2(1000),
  "fecha_creacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "fecha_expiracion" timestamp NOT NULL,
  "fecha_ultimo_uso" timestamp,
  "revocada_en" timestamp,
  "estado_sesion_id" number NOT NULL
);

CREATE TABLE "roles" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "codigo" varchar2(50) UNIQUE NOT NULL,
  "nombre" varchar2(100) UNIQUE NOT NULL,
  "descripcion" varchar2(300),
  "activo" number(1) DEFAULT 1 NOT NULL,
  "fecha_creacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE "permisos" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "modulo" varchar2(80) NOT NULL,
  "accion_permiso_id" number NOT NULL,
  "descripcion" varchar2(300)
);

CREATE TABLE "usuario_roles" (
  "usuario_id" number NOT NULL,
  "rol_id" number NOT NULL,
  "asignado_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  PRIMARY KEY ("usuario_id", "rol_id")
);

CREATE TABLE "rol_permisos" (
  "rol_id" number NOT NULL,
  "permiso_id" number NOT NULL,
  PRIMARY KEY ("rol_id", "permiso_id")
);

CREATE TABLE "antecedentes_paciente" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "paciente_id" number NOT NULL,
  "tipo_antecedente_id" number NOT NULL,
  "descripcion" clob NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL,
  "registrado_por_usuario_id" number NOT NULL,
  "registrado_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE "profesional_especialidades" (
  "profesional_id" number NOT NULL,
  "especialidad_id" number NOT NULL,
  PRIMARY KEY ("profesional_id", "especialidad_id")
);

CREATE TABLE "disponibilidades" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "profesional_id" number NOT NULL,
  "dia_inicio" number(1) NOT NULL,
  "dia_fin" number(1) NOT NULL,
  "hora_inicio" varchar2(5) NOT NULL,
  "hora_almuerzo" varchar2(5) NOT NULL,
  "hora_retorno" varchar2(5) NOT NULL,
  "hora_fin" varchar2(5) NOT NULL,
  "activo" number(1) DEFAULT 1 NOT NULL
);

CREATE TABLE "citas" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "paciente_id" number NOT NULL,
  "profesional_id" number NOT NULL,
  "servicio_id" number NOT NULL,
  "fecha_hora_inicio" timestamp NOT NULL,
  "fecha_hora_fin" timestamp NOT NULL,
  "estado_cita_id" number NOT NULL,
  "origen_cita_id" number NOT NULL,
  "motivo_consulta" varchar2(1000),
  "observaciones" varchar2(2000),
  "creada_por_usuario_id" number,
  "creada_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "actualizada_en" timestamp,
  "cancelada_en" timestamp,
  "motivo_cancelacion" varchar2(1000)
);

CREATE TABLE "historias_clinicas" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "paciente_id" number UNIQUE NOT NULL,
  "fecha_apertura" date DEFAULT SYSDATE NOT NULL,
  "activa" number(1) DEFAULT 1 NOT NULL,
  "observaciones_generales" clob
);

CREATE TABLE "atenciones_clinicas" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "cita_id" number UNIQUE NOT NULL,
  "fecha_atencion" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "examen_clinico" clob,
  "notas_evolucion" clob,
  "plan_tratamiento" clob
);

CREATE TABLE "diagnosticos" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "atencion_clinica_id" number NOT NULL,
  "codigo" varchar2(30),
  "descripcion" clob NOT NULL,
  "tipo" varchar2(30) DEFAULT 'ODONTOLOGICO' NOT NULL
);

CREATE TABLE "procedimientos_realizados" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "atencion_clinica_id" number NOT NULL,
  "servicio_id" number,
  "descripcion" clob NOT NULL,
  "fecha_realizacion" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "valor_cobrado" number(12,2)
);

CREATE TABLE "dientes" (
  "codigo" varchar2(2) PRIMARY KEY,
  "nombre" varchar2(120) NOT NULL,
  "tipo_denticion_id" number NOT NULL,
  "cuadrante" number(1) NOT NULL,
  "posicion" number(1) NOT NULL
);

CREATE TABLE "odontogramas" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "historia_clinica_id" number NOT NULL,
  "atencion_clinica_id" number,
  "profesional_id" number NOT NULL,
  "fecha_registro" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "observaciones" clob
);

CREATE TABLE "odontograma_dientes" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "odontograma_id" number NOT NULL,
  "diente_codigo" varchar2(2) NOT NULL,
  "estado_diente_id" number NOT NULL,
  "observacion" clob
);

CREATE TABLE "hallazgos_dentales" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "odontograma_diente_id" number NOT NULL,
  "superficie_dental_id" number,
  "tipo_hallazgo_id" number NOT NULL,
  "estado_hallazgo_id" number NOT NULL,
  "observacion" clob,
  "registrado_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE "notificaciones_hub" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "emisor_usuario_id" number,
  "receptor_usuario_id" number,
  "receptor_rol_id" number,
  "tipo_notificacion_hub_id" number NOT NULL,
  "prioridad_notificacion_id" number NOT NULL,
  "titulo" varchar2(200) NOT NULL,
  "contenido" clob NOT NULL,
  "entidad_tipo" varchar2(80),
  "entidad_id" number,
  "estado_notificacion_hub_id" number NOT NULL,
  "creada_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "entregada_en" timestamp,
  "leida_en" timestamp
);

CREATE TABLE "notificaciones_whatsapp" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "cita_id" number,
  "paciente_id" number,
  "tipo_notificacion_whatsapp_id" number NOT NULL,
  "estado_notificacion_whatsapp_id" number NOT NULL,
  "telefono_destino" varchar2(30) NOT NULL,
  "contenido" clob NOT NULL,
  "plantilla_nombre" varchar2(100),
  "plantilla_parametros" clob,
  "proveedor" varchar2(50),
  "mensaje_proveedor_id" varchar2(150),
  "programada_para" timestamp NOT NULL,
  "enviada_en" timestamp,
  "entregada_en" timestamp,
  "leida_en" timestamp,
  "fallida_en" timestamp,
  "respuesta_proveedor" clob,
  "error_detalle" varchar2(1000)
);

CREATE TABLE "conversaciones_chatbot" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "paciente_id" number,
  "identificador_chat" varchar2(150) NOT NULL,
  "canal_chat_id" number NOT NULL,
  "estado_conversacion_id" number NOT NULL,
  "iniciada_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "ultima_interaccion_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "cerrada_en" timestamp
);

CREATE TABLE "mensajes_chatbot" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "conversacion_chatbot_id" number NOT NULL,
  "rol_mensaje_id" number NOT NULL,
  "contenido" clob NOT NULL,
  "confianza_rag" number(5,4),
  "creado_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE "tickets_soporte" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "conversacion_chatbot_id" number NOT NULL,
  "paciente_id" number,
  "motivo_ticket_id" number NOT NULL,
  "prioridad_notificacion_id" number NOT NULL,
  "estado_ticket_id" number NOT NULL,
  "titulo" varchar2(200) NOT NULL,
  "descripcion" clob,
  "resumen_chatbot" clob,
  "confianza_rag" number(5,4),
  "creado_en" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "asignado_a_usuario_id" number,
  "asignado_en" timestamp,
  "atendido_en" timestamp,
  "resuelto_por_usuario_id" number,
  "resuelto_en" timestamp,
  "resolucion" clob,
  "cerrado_en" timestamp
);

CREATE TABLE "auditoria_eventos" (
  "id" number GENERATED AS IDENTITY PRIMARY KEY,
  "usuario_id" number,
  "sesion_id" number,
  "tipo_evento_id" number NOT NULL,
  "entidad_tipo" varchar2(80),
  "entidad_id" number,
  "descripcion" varchar2(1000) NOT NULL,
  "datos_anteriores" clob,
  "datos_nuevos" clob,
  "direccion_ip" varchar2(64),
  "agente_usuario" varchar2(1000),
  "fecha_evento" timestamp DEFAULT SYSTIMESTAMP NOT NULL,
  "exitoso" number(1) DEFAULT 1 NOT NULL,
  "detalle_error" varchar2(1000)
);

CREATE UNIQUE INDEX ON "personas" ("tipo_documento_id", "numero_documento");

CREATE INDEX ON "personas" ("email");

CREATE UNIQUE INDEX ON "permisos" ("modulo", "accion_permiso_id");

CREATE INDEX ON "citas" ("profesional_id", "fecha_hora_inicio");

CREATE INDEX ON "citas" ("paciente_id", "fecha_hora_inicio");

CREATE UNIQUE INDEX ON "odontograma_dientes" ("odontograma_id", "diente_codigo");

CREATE UNIQUE INDEX ON "conversaciones_chatbot" ("canal_chat_id", "identificador_chat");

COMMENT ON TABLE "tipos_documento" IS 'Catalogo de tipos de documento de identidad.';

COMMENT ON COLUMN "tipos_documento"."codigo" IS 'Ejemplos: CC, CE, TI, PAS';

COMMENT ON TABLE "sexos" IS 'Catalogo configurable para sexo.';

COMMENT ON TABLE "cargos" IS 'Catalogo de cargos laborales: administrador, recepcionista, asistente, odontologo, etc.';

COMMENT ON TABLE "acciones_permiso" IS 'Acciones que se pueden conceder dentro de cada modulo.';

COMMENT ON COLUMN "acciones_permiso"."codigo" IS 'Ejemplos: VER, CREAR, EDITAR, ELIMINAR';

COMMENT ON TABLE "tipos_antecedente" IS 'Categorias de antecedentes: medico, odontologico, alergia, medicamento, etc.';

COMMENT ON TABLE "especialidades" IS 'Catalogo de especialidades odontologicas.';

COMMENT ON TABLE "servicios" IS 'Catalogo de servicios odontologicos que pueden agendarse.';

COMMENT ON TABLE "estados_cita" IS 'Estados configurables de una cita.';

COMMENT ON COLUMN "estados_cita"."codigo" IS 'Ejemplos: AGENDADA, CONFIRMADA, ATENDIDA, CANCELADA';

COMMENT ON TABLE "origenes_cita" IS 'Origen de creacion de una cita.';

COMMENT ON COLUMN "origenes_cita"."codigo" IS 'Ejemplos: MANUAL, AGENTE, WEB, TELEFONO';

COMMENT ON TABLE "tipos_denticion" IS 'Clasificacion de denticion para el catalogo dental FDI.';

COMMENT ON COLUMN "tipos_denticion"."codigo" IS 'PERMANENTE o TEMPORAL';

COMMENT ON TABLE "estados_diente" IS 'Estados generales de una pieza dental dentro de un odontograma.';

COMMENT ON COLUMN "estados_diente"."codigo" IS 'Ejemplos: SANO, AUSENTE, EXTRAIDO, IMPLANTE';

COMMENT ON TABLE "superficies_dentales" IS 'Caras dentales usadas para representar hallazgos en odontograma.';

COMMENT ON COLUMN "superficies_dentales"."codigo" IS 'Ejemplos: MESIAL, DISTAL, OCLUSAL, INCISAL';

COMMENT ON TABLE "tipos_hallazgo" IS 'Catalogo de hallazgos clinicos dentales.';

COMMENT ON COLUMN "tipos_hallazgo"."codigo" IS 'Ejemplos: CARIES, RESTAURACION, FRACTURA';

COMMENT ON TABLE "estados_hallazgo" IS 'Estado de seguimiento de un hallazgo dental.';

COMMENT ON COLUMN "estados_hallazgo"."codigo" IS 'Ejemplos: ACTIVO, TRATADO, INACTIVO';

COMMENT ON TABLE "estados_sesion" IS 'Estados de una sesion de autenticacion.';

COMMENT ON COLUMN "estados_sesion"."codigo" IS 'Ejemplos: ACTIVA, REVOCADA, EXPIRADA';

COMMENT ON TABLE "tipos_notificacion_hub" IS 'Tipos de alertas internas mostradas por SignalR en el panel web.';

COMMENT ON COLUMN "tipos_notificacion_hub"."codigo" IS 'Ejemplos: TICKET_CREADO, CITA_CREADA, CITA_CANCELADA';

COMMENT ON TABLE "prioridades_notificacion" IS 'Prioridades reutilizables para alertas internas y tickets.';

COMMENT ON COLUMN "prioridades_notificacion"."codigo" IS 'Ejemplos: BAJA, NORMAL, ALTA, URGENTE';

COMMENT ON TABLE "estados_notificacion_hub" IS 'Estado persistente de una alerta del panel SignalR.';

COMMENT ON COLUMN "estados_notificacion_hub"."codigo" IS 'Ejemplos: PENDIENTE, ENTREGADA, LEIDA, CANCELADA';

COMMENT ON TABLE "tipos_notificacion_whatsapp" IS 'Tipos de mensajes externos que se envian por WhatsApp.';

COMMENT ON COLUMN "tipos_notificacion_whatsapp"."codigo" IS 'Ejemplos: RECORDATORIO_CITA, TRANSFERENCIA_A_ASESOR';

COMMENT ON TABLE "estados_notificacion_whatsapp" IS 'Estados reportados por el proveedor de WhatsApp.';

COMMENT ON COLUMN "estados_notificacion_whatsapp"."codigo" IS 'Ejemplos: PENDIENTE, ENVIADA, ENTREGADA, LEIDA, FALLIDA';

COMMENT ON TABLE "canales_chat" IS 'Canales de comunicacion que usa el chatbot.';

COMMENT ON COLUMN "canales_chat"."codigo" IS 'Ejemplos: WHATSAPP, TELEGRAM';

COMMENT ON TABLE "estados_conversacion_chatbot" IS 'Controla si el bot responde o si la conversacion esta en manos de recepcion.';

COMMENT ON COLUMN "estados_conversacion_chatbot"."codigo" IS 'Ejemplos: ACTIVA, ESCALADA, ATENDIDA_HUMANO, CERRADA';

COMMENT ON TABLE "roles_mensaje_chatbot" IS 'Actor que genero un mensaje dentro de una conversacion.';

COMMENT ON COLUMN "roles_mensaje_chatbot"."codigo" IS 'Ejemplos: USUARIO, CHATBOT, AGENTE_HUMANO, SISTEMA';

COMMENT ON TABLE "estados_ticket_soporte" IS 'Estados del ticket creado cuando el chatbot transfiere un caso a recepcion.';

COMMENT ON COLUMN "estados_ticket_soporte"."codigo" IS 'Ejemplos: ABIERTO, ASIGNADO, EN_ATENCION, RESUELTO, CERRADO';

COMMENT ON TABLE "motivos_ticket_soporte" IS 'Motivos por los que se abre un ticket de atencion humana.';

COMMENT ON COLUMN "motivos_ticket_soporte"."codigo" IS 'Ejemplos: SOLICITUD_USUARIO, BAJA_CONFIANZA_RAG, ERROR_AGENDAMIENTO';

COMMENT ON TABLE "tipos_evento_auditoria" IS 'Eventos que se registran para reportes de seguridad y operacion del administrador.';

COMMENT ON COLUMN "tipos_evento_auditoria"."codigo" IS 'Ejemplos: INICIO_SESION, AGENDAR_CITA, CERRAR_TICKET';

COMMENT ON TABLE "personas" IS 'Entidad base de personas. Una persona puede tener registro de paciente, empleado y usuario simultaneamente.';

COMMENT ON TABLE "pacientes" IS 'Contexto clinico de una persona. Tiene ID propio para referencias de citas e historia clinica.';

COMMENT ON TABLE "empleados" IS 'Contexto laboral de una persona. Tiene ID propio y cargo de catalogo.';

COMMENT ON TABLE "usuarios" IS 'Credenciales de acceso. No toda persona o paciente necesita una cuenta.';

COMMENT ON TABLE "profesionales" IS 'Empleado habilitado para atender pacientes y registrar informacion clinica.';

COMMENT ON TABLE "sesiones" IS 'Sesion de autenticacion. Guarda hash de refresh token, nunca el token en texto plano.';

COMMENT ON TABLE "roles" IS 'Roles configurables: administrador, recepcionista, odontologo, asistente, paciente, etc.';

COMMENT ON TABLE "permisos" IS 'Permiso compuesto por un modulo y una accion configurable.';

COMMENT ON TABLE "usuario_roles" IS 'Relacion muchos a muchos entre usuarios y roles.';

COMMENT ON TABLE "rol_permisos" IS 'Relacion muchos a muchos entre roles y permisos.';

COMMENT ON TABLE "antecedentes_paciente" IS 'Antecedentes medicos y odontologicos relevantes para la atencion.';

COMMENT ON TABLE "profesional_especialidades" IS 'Relacion muchos a muchos entre profesionales y especialidades.';

COMMENT ON TABLE "disponibilidades" IS 'Horario recurrente. Ejemplo: lunes-viernes, 08:00-12:00 y 13:00-17:00.';

COMMENT ON COLUMN "disponibilidades"."dia_inicio" IS '1=Lunes, 7=Domingo';

COMMENT ON COLUMN "disponibilidades"."dia_fin" IS '1=Lunes, 7=Domingo';

COMMENT ON COLUMN "disponibilidades"."hora_inicio" IS 'Formato HH24:MI';

COMMENT ON COLUMN "disponibilidades"."hora_almuerzo" IS 'Inicio de pausa de almuerzo';

COMMENT ON COLUMN "disponibilidades"."hora_retorno" IS 'Fin de pausa de almuerzo';

COMMENT ON COLUMN "disponibilidades"."hora_fin" IS 'Fin de jornada';

COMMENT ON TABLE "citas" IS 'Reserva de servicio. API valida disponibilidad, hora de almuerzo y solapamiento de agenda.';

COMMENT ON TABLE "historias_clinicas" IS 'Historia clinica principal de un paciente.';

COMMENT ON TABLE "atenciones_clinicas" IS 'Resultado clinico de una cita atendida. Paciente, profesional y servicio se consultan desde CITAS.';

COMMENT ON TABLE "diagnosticos" IS 'Diagnosticos asociados a una atencion clinica.';

COMMENT ON TABLE "procedimientos_realizados" IS 'Procedimientos ejecutados durante una atencion.';

COMMENT ON TABLE "dientes" IS 'Catalogo global de piezas dentales. No se duplica por paciente.';

COMMENT ON COLUMN "dientes"."codigo" IS 'FDI: 11-48 permanentes; 51-85 temporales';

COMMENT ON TABLE "odontogramas" IS 'Version del estado bucal de un paciente en una fecha determinada.';

COMMENT ON TABLE "odontograma_dientes" IS 'Estado general de cada diente en un odontograma. Para adulto se generan 32 registros.';

COMMENT ON TABLE "hallazgos_dentales" IS 'Detalle de hallazgos por superficie: caries, restauracion, fractura, etc.';

COMMENT ON TABLE "notificaciones_hub" IS 'Bandeja persistente de alertas internas entregadas por SignalR a usuario o rol.';

COMMENT ON TABLE "notificaciones_whatsapp" IS 'Mensajes externos por WhatsApp enviados a pacientes o visitantes.';

COMMENT ON TABLE "conversaciones_chatbot" IS 'Conversacion unica que puede ser atendida por chatbot y despues por recepcionista.';

COMMENT ON COLUMN "conversaciones_chatbot"."identificador_chat" IS 'chat_id del canal externo';

COMMENT ON TABLE "mensajes_chatbot" IS 'Historial completo mostrado en el panel de recepcion. El asesor usa rol AGENTE_HUMANO.';

COMMENT ON TABLE "tickets_soporte" IS 'Controla el handoff del bot a un asesor. No duplica mensajes; usa MENSAJES_CHATBOT.';

COMMENT ON TABLE "auditoria_eventos" IS 'Bitacora para reportes administrativos, seguridad y trazabilidad.';

ALTER TABLE "personas" ADD FOREIGN KEY ("tipo_documento_id") REFERENCES "tipos_documento" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "personas" ADD FOREIGN KEY ("sexo_id") REFERENCES "sexos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "personas" ADD FOREIGN KEY ("id") REFERENCES "pacientes" ("persona_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "personas" ADD FOREIGN KEY ("id") REFERENCES "empleados" ("persona_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "empleados" ADD FOREIGN KEY ("cargo_id") REFERENCES "cargos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "personas" ADD FOREIGN KEY ("id") REFERENCES "usuarios" ("persona_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "empleados" ADD FOREIGN KEY ("id") REFERENCES "profesionales" ("empleado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sesiones" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sesiones" ADD FOREIGN KEY ("estado_sesion_id") REFERENCES "estados_sesion" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "permisos" ADD FOREIGN KEY ("accion_permiso_id") REFERENCES "acciones_permiso" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "usuario_roles" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "usuario_roles" ADD FOREIGN KEY ("rol_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "rol_permisos" ADD FOREIGN KEY ("rol_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "rol_permisos" ADD FOREIGN KEY ("permiso_id") REFERENCES "permisos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "antecedentes_paciente" ADD FOREIGN KEY ("paciente_id") REFERENCES "pacientes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "antecedentes_paciente" ADD FOREIGN KEY ("tipo_antecedente_id") REFERENCES "tipos_antecedente" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "antecedentes_paciente" ADD FOREIGN KEY ("registrado_por_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "profesional_especialidades" ADD FOREIGN KEY ("profesional_id") REFERENCES "profesionales" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "profesional_especialidades" ADD FOREIGN KEY ("especialidad_id") REFERENCES "especialidades" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "disponibilidades" ADD FOREIGN KEY ("profesional_id") REFERENCES "profesionales" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "citas" ADD FOREIGN KEY ("paciente_id") REFERENCES "pacientes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "citas" ADD FOREIGN KEY ("profesional_id") REFERENCES "profesionales" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "citas" ADD FOREIGN KEY ("servicio_id") REFERENCES "servicios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "citas" ADD FOREIGN KEY ("estado_cita_id") REFERENCES "estados_cita" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "citas" ADD FOREIGN KEY ("origen_cita_id") REFERENCES "origenes_cita" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "citas" ADD FOREIGN KEY ("creada_por_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "pacientes" ADD FOREIGN KEY ("id") REFERENCES "historias_clinicas" ("paciente_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "citas" ADD FOREIGN KEY ("id") REFERENCES "atenciones_clinicas" ("cita_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diagnosticos" ADD FOREIGN KEY ("atencion_clinica_id") REFERENCES "atenciones_clinicas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "procedimientos_realizados" ADD FOREIGN KEY ("atencion_clinica_id") REFERENCES "atenciones_clinicas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "procedimientos_realizados" ADD FOREIGN KEY ("servicio_id") REFERENCES "servicios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "dientes" ADD FOREIGN KEY ("tipo_denticion_id") REFERENCES "tipos_denticion" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "odontogramas" ADD FOREIGN KEY ("historia_clinica_id") REFERENCES "historias_clinicas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "odontogramas" ADD FOREIGN KEY ("atencion_clinica_id") REFERENCES "atenciones_clinicas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "odontogramas" ADD FOREIGN KEY ("profesional_id") REFERENCES "profesionales" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "odontograma_dientes" ADD FOREIGN KEY ("odontograma_id") REFERENCES "odontogramas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "odontograma_dientes" ADD FOREIGN KEY ("diente_codigo") REFERENCES "dientes" ("codigo") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "odontograma_dientes" ADD FOREIGN KEY ("estado_diente_id") REFERENCES "estados_diente" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "hallazgos_dentales" ADD FOREIGN KEY ("odontograma_diente_id") REFERENCES "odontograma_dientes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "hallazgos_dentales" ADD FOREIGN KEY ("superficie_dental_id") REFERENCES "superficies_dentales" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "hallazgos_dentales" ADD FOREIGN KEY ("tipo_hallazgo_id") REFERENCES "tipos_hallazgo" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "hallazgos_dentales" ADD FOREIGN KEY ("estado_hallazgo_id") REFERENCES "estados_hallazgo" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_hub" ADD FOREIGN KEY ("emisor_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_hub" ADD FOREIGN KEY ("receptor_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_hub" ADD FOREIGN KEY ("receptor_rol_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_hub" ADD FOREIGN KEY ("tipo_notificacion_hub_id") REFERENCES "tipos_notificacion_hub" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_hub" ADD FOREIGN KEY ("prioridad_notificacion_id") REFERENCES "prioridades_notificacion" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_hub" ADD FOREIGN KEY ("estado_notificacion_hub_id") REFERENCES "estados_notificacion_hub" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_whatsapp" ADD FOREIGN KEY ("cita_id") REFERENCES "citas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_whatsapp" ADD FOREIGN KEY ("paciente_id") REFERENCES "pacientes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_whatsapp" ADD FOREIGN KEY ("tipo_notificacion_whatsapp_id") REFERENCES "tipos_notificacion_whatsapp" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones_whatsapp" ADD FOREIGN KEY ("estado_notificacion_whatsapp_id") REFERENCES "estados_notificacion_whatsapp" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "conversaciones_chatbot" ADD FOREIGN KEY ("paciente_id") REFERENCES "pacientes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "conversaciones_chatbot" ADD FOREIGN KEY ("canal_chat_id") REFERENCES "canales_chat" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "conversaciones_chatbot" ADD FOREIGN KEY ("estado_conversacion_id") REFERENCES "estados_conversacion_chatbot" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "mensajes_chatbot" ADD FOREIGN KEY ("conversacion_chatbot_id") REFERENCES "conversaciones_chatbot" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "mensajes_chatbot" ADD FOREIGN KEY ("rol_mensaje_id") REFERENCES "roles_mensaje_chatbot" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tickets_soporte" ADD FOREIGN KEY ("conversacion_chatbot_id") REFERENCES "conversaciones_chatbot" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tickets_soporte" ADD FOREIGN KEY ("paciente_id") REFERENCES "pacientes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tickets_soporte" ADD FOREIGN KEY ("motivo_ticket_id") REFERENCES "motivos_ticket_soporte" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tickets_soporte" ADD FOREIGN KEY ("prioridad_notificacion_id") REFERENCES "prioridades_notificacion" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tickets_soporte" ADD FOREIGN KEY ("estado_ticket_id") REFERENCES "estados_ticket_soporte" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tickets_soporte" ADD FOREIGN KEY ("asignado_a_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tickets_soporte" ADD FOREIGN KEY ("resuelto_por_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "auditoria_eventos" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "auditoria_eventos" ADD FOREIGN KEY ("sesion_id") REFERENCES "sesiones" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "auditoria_eventos" ADD FOREIGN KEY ("tipo_evento_id") REFERENCES "tipos_evento_auditoria" ("id") DEFERRABLE INITIALLY IMMEDIATE;
```
