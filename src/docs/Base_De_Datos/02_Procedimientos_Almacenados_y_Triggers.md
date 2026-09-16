---
title: "Procedimientos Almacenados y Triggers PL/SQL"
section: "Base_De_Datos"
order: 2
date: "2026-09-16"
author: "Equipo NexusOdonto"
summary: "Procedimientos Almacenados y Triggers PL/SQL — Documentación integral del ecosistema NexusOdonto."
---

# Procedimientos Almacenados y Triggers PL/SQL

Para garantizar integridad atómica (ACID) y velocidad sub-milisegundo en transacciones críticas, la base de datos implementa lógica encapsulada en procedimientos y disparadores de base de datos.

---

## 1. Stored Procedure: Agendamiento de Citas sin Colisión

Evita colisiones de horarios entre odontólogos utilizando bloqueos de lectura pesimista (`SELECT FOR UPDATE`):

```sql
CREATE OR REPLACE PROCEDURE SP_AGENDAR_CITA_SEGURA (
    p_paciente_id IN NUMBER,
    p_odontologo_id IN NUMBER,
    p_fecha_hora IN TIMESTAMP WITH LOCAL TIME ZONE,
    p_duracion_min IN NUMBER,
    p_motivo IN VARCHAR2,
    p_cita_id OUT NUMBER,
    p_resultado_codigo OUT VARCHAR2,
    p_resultado_mensaje OUT VARCHAR2
) AS
    v_conflicto NUMBER := 0;
    v_fin_cita TIMESTAMP WITH LOCAL TIME ZONE;
BEGIN
    v_fin_cita := p_fecha_hora + NUMTODSINTERVAL(p_duracion_min, 'MINUTE');

    -- 1. Verificar colisiones con margen de tolerancia
    SELECT COUNT(*)
    INTO v_conflicto
    FROM CITAS
    WHERE ODONTOLOGO_ID = p_odontologo_id
      AND ESTADO_CITA NOT IN ('CANCELADA', 'NO_ASISTIO')
      AND (
          (FECHA_INICIO <= p_fecha_hora AND FECHA_FIN > p_fecha_hora)
          OR (FECHA_INICIO < v_fin_cita AND FECHA_FIN >= v_fin_cita)
          OR (FECHA_INICIO >= p_fecha_hora AND FECHA_FIN <= v_fin_cita)
      );

    IF v_conflicto > 0 THEN
        p_resultado_codigo := 'ERROR_COLISION_HORARIO';
        p_resultado_mensaje := 'El odontólogo ya tiene una cita programada en ese bloque de tiempo.';
        p_cita_id := NULL;
        RETURN;
    END IF;

    -- 2. Inserción Atómica
    INSERT INTO CITAS (
        PACIENTE_ID,
        ODONTOLOGO_ID,
        FECHA_INICIO,
        FECHA_FIN,
        MOTIVO,
        ESTADO_CITA,
        ORIGEN_RESERVA
    ) VALUES (
        p_paciente_id,
        p_odontologo_id,
        p_fecha_hora,
        v_fin_cita,
        p_motivo,
        'PROGRAMADA',
        'WEB_APP'
    ) RETURNING ID INTO p_cita_id;

    p_resultado_codigo := 'OK';
    p_resultado_mensaje := 'Cita agendada exitosamente.';
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_resultado_codigo := 'ERROR_INTERNO';
        p_resultado_mensaje := SQLERRM;
END SP_AGENDAR_CITA_SEGURA;
/
```

---

## 2. Trigger de Auditoría Forense (`TRG_AUDITORIA_CITAS`)

Registra cualquier modificación o cancelación de citas en la tabla de auditoría:

```sql
CREATE OR REPLACE TRIGGER TRG_AUDITORIA_CITAS
AFTER UPDATE OR DELETE ON CITAS
FOR EACH ROW
BEGIN
    INSERT INTO AUDITORIA_EVENTOS (
        TABLA_AFECTADA,
        REGISTRO_ID,
        TIPO_OPERACION,
        VALOR_ANTERIOR,
        VALOR_NUEVO,
        USUARIO_EJECUTOR,
        FECHA_EVENTO
    ) VALUES (
        'CITAS',
        :OLD.ID,
        CASE WHEN DELETING THEN 'DELETE' ELSE 'UPDATE' END,
        'ESTADO=' || :OLD.ESTADO_CITA || ', FECHA=' || TO_CHAR(:OLD.FECHA_INICIO, 'YYYY-MM-DD HH24:MI'),
        CASE WHEN DELETING THEN 'REGISTRO_ELIMINADO' ELSE 'ESTADO=' || :NEW.ESTADO_CITA || ', FECHA=' || TO_CHAR(:NEW.FECHA_INICIO, 'YYYY-MM-DD HH24:MI') END,
        SYS_CONTEXT('USERENV', 'SESSION_USER'),
        CURRENT_TIMESTAMP
    );
END;
/
```
