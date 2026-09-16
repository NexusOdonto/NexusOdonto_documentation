---
title: "Estandarización de Notificaciones Toaster"
section: "03_Modulos_Frontend"
order: 10
date: "2026-09-16"
author: "Equipo de Arquitectura Frontend NexusOdonto"
summary: "Patrón unificado de retroalimentación asíncrona, proveedor Sonner/Toaster desacoplado vía React Portal, posicionamiento inferior derecho y prevención de solapamientos."
---

# Estandarización de Notificaciones Toaster

Para proveer feedback inmediato y consistente tras mutaciones en la historia clínica, confirmación de citas, alertas de cobro y recepciones de mensajes de chat, el frontend implementa un sistema unificado de notificaciones toast desacoplado del DOM convencional.

---

## 1. Configuración del Proveedor Toaster en el Root

El proveedor de notificaciones se monta directamente en el raíz de la aplicación (`App.tsx`) fuera del contenedor de navegación principal para evitar colisiones visuales con la `TopBar` y la `Sidebar`:

```tsx
// App.tsx - Inyección del Toaster Global
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        
        {/* Notificaciones globales desacopladas */}
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              backdropFilter: "blur(12px)",
              color: "#f8fafc",
              borderRadius: "1rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};
```

---

## 2. API Unificada de Emisión (`notify`)

Se encapsulan las llamadas directas de la librería en un helper estandarizado:

```typescript
// services/notify.ts - Helper estándar de alertas
import { toast } from "sonner";

export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: "🦷",
      className: "border-emerald-500/40 text-emerald-400",
    });
  },

  error: (message: string, errorDetail?: string) => {
    toast.error(message, {
      description: errorDetail || "Comprueba tu conexión o contacta soporte.",
      className: "border-rose-500/40 text-rose-400",
      duration: 6000,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      className: "border-cyan-500/40 text-cyan-400",
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading = "Guardando cambios en expediente...",
      success = "Operación completada con éxito",
      error = "Error al procesar la solicitud",
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success: (data) => (typeof success === "function" ? success(data) : success),
      error: (err) => (typeof error === "function" ? error(err) : error),
    });
  },
};
```

---

## 3. Casos de Uso en Componentes Clínicos

```tsx
// OdontogramaView.tsx - Uso de notify.promise en guardado clínico
import { notify } from "@/services/notify";
import { saveToothCondition } from "@/services/odontogramaApi";

const handleToothUpdate = async (toothNumber: number, condition: string) => {
  const saveAction = saveToothCondition(patientId, toothNumber, condition);

  await notify.promise(saveAction, {
    loading: `Actualizando pieza dental #${toothNumber}...`,
    success: `Pieza dental #${toothNumber} registrada correctamente.`,
    error: "No se pudo guardar la condición dental en Oracle Database.",
  });
};
```

> [!NOTE]
> **Accesibilidad (a11y):** Los toasts se emiten con roles semánticos `aria-live="polite"` para mensajes informativos y `aria-live="assertive"` para errores críticos, garantizando que lectores de pantalla anuncien el evento sin interrumpir la digitación del odontólogo.
