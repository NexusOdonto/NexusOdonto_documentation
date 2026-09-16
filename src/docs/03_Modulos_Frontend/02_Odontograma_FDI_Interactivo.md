---
title: "Odontograma FDI Interactivo"
order: 2
author: "NexusOdonto Clinical Engineering"
date: "2026-09-16"
---

# Odontograma FDI Interactivo (5 Superficies Anatómicas)

El Odontograma es el módulo insignia de NexusOdonto para el registro visual del estado de salud bucodental del paciente, implementado bajo el estándar internacional de la Federación Dental Internacional (FDI / ISO 3950).

---

## 1. Notación FDI y Cuadrantes

El componente `OdontogramaUI` renderiza dos denticiones completas:

### Dentición Permanente (Adultos - 32 piezas):
* **Cuadrante 1 (Superior Derecho):** Dientes 18 al 11.
* **Cuadrante 2 (Superior Izquierdo):** Dientes 21 al 28.
* **Cuadrante 4 (Inferior Derecho):** Dientes 48 al 41.
* **Cuadrante 3 (Inferior Izquierdo):** Dientes 31 al 38.

### Dentición Temporal (Niños/Decidua - 20 piezas):
* **Cuadrante 5 (Superior Derecho):** Dientes 55 al 51.
* **Cuadrante 6 (Superior Izquierdo):** Dientes 61 al 65.
* **Cuadrante 8 (Inferior Derecho):** Dientes 85 al 81.
* **Cuadrante 7 (Inferior Izquierdo):** Dientes 71 al 75.

---

## 2. Anatomía de Superficies Dentales

Cada pieza dental se modela con 5 regiones anatómicas interactivas independientes:

```
                     ┌──────────────────────┐
                     │    VESTIBULAR (V)    │
                     ├──────────┬───────────┤
        MESIAL (M)   │ OCLUSAL/ │  DISTAL   │
                     │ INCISAL  │    (D)    │
                     ├──────────┴───────────┤
                     │ LINGUAL/PALATINO (L) │
                     └──────────────────────┘
```

---

## 3. Estados y Diagnósticos Odontológicos

| Estado Dental | Código | Color / Representación Visual |
|---|---|---|
| **Sano** | `SANO` | Blanco / Neutro (#FFFFFF) |
| **Caries** | `CARIES` | Rojo (#EF4444) |
| **Restauración / Obturación** | `RESTAURADO` | Azul (#3B82F6) |
| **Prótesis Fija / Corona** | `CORONA` | Amarillo / Dorado (#F59E0B) |
| **Prótesis Removible** | `PROTESIS_REM` | Morado (#8B5CF6) |
| **Endodoncia (Tratamiento de Conducto)**| `ENDODONCIA` | Verde Azulado (#10B981) con marca radicular |
| **Exodoncia / Pieza Ausente** | `AUSENTE` | Aspa Negra (#1F2937) |
| **Sellante** | `SELLANTE` | Verde (#22C55E) |
| **Fractura Dental** | `FRACTURA` | Rayo Rojo (#DC2626) |

---

## 4. Garantías de Seguridad y Persistencia

1. **Aislamiento por `patientId`:** Los datos se obtienen exclusivamente para el paciente seleccionado. Si el rol es `PACIENTE`, el selector queda bloqueado y se fuerza la consulta del usuario en sesión.
2. **Límite de Notas (2000 chars):** Los campos de observaciones y notas clínicas se validan y recortan a 2000 caracteres para evitar desbordamientos en Oracle Database.
3. **Limpieza de Marcadores Legacy:** Se eliminó la dependencia de `ODONTOGRAM_STATE`, guardando únicamente estados discretos y normalizados por pieza y superficie.
