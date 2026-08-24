---
title: "Configuración del Agente IA"
order: 1
author: "Dr. Lucas Kim"
date: "2026-08-23"
---

El **Agente IA de NexusOdonto** asiste en el triaje automatizado de pacientes, interpretación de sintomatología dental y generación de resúmenes clínicos en lenguaje natural.

> [!NOTE] Integración NLP
> El módulo de IA utiliza un modelo de procesamiento de lenguaje natural integrado mediante SDK .NET para procesar consultas clínicas de manera segura.

## Características Principales

### 1. Triaje de Pacientes
Clasificación automática de urgencias odontológicas (dolor agudo, trauma, control rutinario).

### 2. Resumen de Historia Clínica
Generación de resúmenes ejecutivos a partir de las notas de evolución de la consulta.

```json
{
  "agent": "NexusOdonto-IA-v2",
  "endpoint": "/api/v1/agent/query",
  "status": "active",
  "confidenceScore": 0.96
}
```
