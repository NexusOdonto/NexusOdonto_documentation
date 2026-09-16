---
title: "Registro Individual de Tareas y Componentes del Sistema"
section: "03_Modulos_Frontend"
order: 11
date: "2026-09-16"
author: "Equipo Frontend NexusOdonto"
summary: "Catálogo exhaustivo e individualizado de componentes, hooks personalizados, máquinas de estado y módulos interactivos desarrollados a lo largo del proyecto."
---

# Registro Individual de Tareas y Componentes del Sistema

Este documento recopila el inventario detallado de componentes, utilidades, hooks y vistas desarrolladas individualmente para el ecosistema NexusOdonto Frontend.

---

## 1. Catálogo Modular de Componentes UI

| Componente | Ruta en Código | Propósito y Capacidades |
| :--- | :--- | :--- |
| **OdontogramCanvas** | `src/components/odontograma/OdontogramCanvas.tsx` | Renderizado SVG interactivo de 32 dientes adultos + 20 temporales con selección de 5 caras independientes. |
| **ToothDetailModal** | `src/components/odontograma/ToothDetailModal.tsx` | Modal para asignar procedimientos (caries, corona, endodoncia, sellante) con selector cromático. |
| **AgendaCalendarView** | `src/views/AgendaView.tsx` | Vista de calendario semanal/mensual con slots de 15/30 min y bloqueo automático de festivos Colombia. |
| **AppointmentCard** | `src/components/agenda/AppointmentCard.tsx` | Tarjeta de cita con badge de estado, avatar del paciente, botón de confirmación rápida por WhatsApp. |
| **AtencionAsesorView** | `src/views/AtencionAsesorView.tsx` | Panel maestro-detalle de tickets escalados con chat en tiempo real y auto-scroll inteligente. |
| **PatientHistoryPDF** | `src/components/pdf/PatientHistoryPDF.tsx` | Generador de historia clínica en formato PDF con membrete clínico, firma digital y odontograma impreso. |
| **NexusSearchModal** | `src/components/ui/SearchModal.tsx` | Paleta de comandos y buscador difuso global (`Ctrl+K`) montado sobre React Portal. |
| **BentoHeroGrid** | `src/features/home/HomePage.tsx` | Grid bento responsivo con cards dinámicas, gradientes clínicos y badges de acceso rápido. |

---

## 2. Hooks Personalizados (`custom hooks`)

```typescript
// src/hooks/useOdontogram.ts - Hook de estado reactivo para Odontograma
export function useOdontogram(patientId: number) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [teethData, setTeethData] = useState<Record<number, ToothCondition>>({});
  
  const updateSurface = (tooth: number, surface: string, condition: string) => {
    setTeethData(prev => ({
      ...prev,
      [tooth]: { ...prev[tooth], [surface]: condition }
    }));
  };

  return { selectedTooth, setSelectedTooth, teethData, updateSurface };
}
```

---

## 3. Matriz de Control y Trazabilidad Individual

Cada componente cuenta con aislamiento de responsabilidades, tipado estricto en TypeScript y desacoplamiento de servicios mediante la capa `src/services/api.ts`.
