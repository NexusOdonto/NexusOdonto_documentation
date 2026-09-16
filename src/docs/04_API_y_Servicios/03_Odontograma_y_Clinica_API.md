---
title: "API de Odontograma e Historia Clínica"
order: 3
author: "NexusOdonto Clinical Engineering"
date: "2026-09-16"
---

# API de Odontograma e Historia Clínica

Endpoints especializados para la persistencia y recuperación del estado dental bajo estándar FDI y notas de evolución clínica.

---

## 1. Endpoints de Odontograma

### `GET /api/Odontograms/patient/{patientId}/latest`
Recupera el odontograma más reciente registrado para el paciente especificado.

* **Response (200 OK):**
```json
{
  "id": "2a000000-0000-0000-0000-000000000001",
  "patientId": "1b000000-0000-0000-0000-000000000013",
  "professionalId": "1a000000-0000-0000-0000-000000000001",
  "recordDate": "2026-09-15T10:30:00Z",
  "notes": "Odontograma inicial de control.",
  "items": [
    {
      "toothNumber": 16,
      "surfaceCode": "O",
      "statusCode": "CARIES",
      "note": "Caries oclusal profunda"
    },
    {
      "toothNumber": 21,
      "surfaceCode": "V",
      "statusCode": "RESTAURADO",
      "note": "Resina vestibular previa"
    }
  ]
}
```

---

### `POST /api/Odontograms`
Registra una nueva evaluación de odontograma para un paciente.

* **Body Request:**
```json
{
  "patientId": "1b000000-0000-0000-0000-000000000013",
  "notes": "Odontograma tras exodoncia pieza 18.",
  "items": [
    {
      "toothNumber": 18,
      "surfaceCode": "O",
      "statusCode": "AUSENTE",
      "note": "Exodoncia indicada y ejecutada"
    }
  ]
}
```

---

## 2. Endpoints de Historia Clínica (`/api/ClinicalRecords`)

* `GET /api/ClinicalRecords/patient/{patientId}`: Historial cronológico de evoluciones médicas.
* `POST /api/ClinicalRecords`: Registro de nueva evolución médica (diagnóstico CIE-10, procedimiento realizado, indicaciones al paciente).
