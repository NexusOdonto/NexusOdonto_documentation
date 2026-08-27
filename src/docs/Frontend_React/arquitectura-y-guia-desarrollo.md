# Arquitectura del Proyecto y Guía de Desarrollo

description: Resumen de refactorizaciones, sistema de temas y tutorial paso a paso para crear nuevas vistas.
category: Documentación Técnica

# 🚀 Arquitectura y Guía de Desarrollo - NexusOdonto Frontend

Este documento resume la **arquitectura**, las **refactorizaciones clave** y las **optimizaciones** realizadas en **NexusOdonto Frontend**, además de servir como guía de desarrollo para la creación de nuevos módulos.

---

## 📌 Resumen de Cambios y Mejoras Realizadas

1. **Refactorización a Arquitectura Feature-First:**
   
   - Organización modular por características (`auth`, `pacientes`, `servicios`) para mantener una separación de responsabilidades clara y código escalable[cite: 1].
   - Eliminación de archivos legados o duplicados (como antiguos `.css` por módulo o rutas sin usar)[cite: 1].

2. **Migración a Tailwind CSS v4 y Modo Oscuro/Claro Reactivo:**
   
   - Implementación de un `ThemeContext.tsx` global que administra el tema (`light`/`dark`) mediante un botón Toggle en `PageHeader.tsx`[cite: 1].
   - **Desconexión de `prefers-color-scheme`:** El tema responde únicamente al botón de la app, evitando desincronizaciones visuales provocadas por la configuración del navegador[cite: 1].
   - **Sincronización unificada de la interfaz:** Se adaptaron `Sidebar`, `PageHeader`, `DashboardLayout` y las tarjetas contenedoras para cambiar de paleta de colores de manera limpia e instantánea[cite: 1].

3. **Ajustes en Autenticación (Login Flexibilizado):**
   
   - Eliminación de la restricción del carácter `@` en el campo de usuario[cite: 1].
   - Permite el ingreso tanto por **correo electrónico** como por **número de documento (Cédula/CC)**[cite: 1].

4. **Optimizaciones de Performance:**
   
   - **Code Splitting / Lazy Loading:** Carga bajo demanda mediante `React.lazy` para evitar descargar dependencias pesadas en la pantalla inicial de inicio de sesión[cite: 1].
   - **Optimización de Assets:** Reducción de imágenes a formato `.webp` optimizadas[cite: 1].
   - **Tree-Shaking de Íconos:** Importación nombrada de `lucide-react` para mitigar sobrecargas en el bundle final[cite: 1].

---

## 📁 Estructura del Proyecto

El proyecto sigue la arquitectura **Feature-First**:

```text
src/
├── api/                          # Cliente HTTP y configuración de API
│   └── axiosClient.ts
├── assets/                       # Imágenes y recursos estáticos
│   ├── fondo-Login-ligh.webp     # Fondo login modo claro
│   ├── fondoLogin.webp           # Fondo login modo oscuro
│   ├── fondo-ligh.webp           # Fondo dashboard modo claro
│   ├── fondo-darck.webp          # Fondo dashboard modo oscuro
│   └── nexus-odonto-logo.webp    # Logo de la marca
├── components/                   # Componentes UI globales reutilizables
│   ├── layout/                   # Componentes de layout compartidos
│   │   ├── PageHeader.tsx        # Header principal con toggle de tema
│   │   └── Sidebar.tsx           # Sidebar de navegación
│   └── ui/                       # Componentes UI atómicos (botones, inputs, etc.)
│       └── Button.tsx
├── context/                      # Contextos globales de React
│   └── ThemeContext.tsx          # Contexto para gestión de tema claro/oscuro
├── features/                     # Módulos por funcionalidad (Feature-First)
│   ├── auth/                     # Módulo de autenticación
│   │   ├── LoginPage.tsx         # Vista de login
│   │   └── components/           # Componentes específicos de auth
│   │       ├── LoginButton.tsx
│   │       └── LoginInput.tsx
│   ├── pacientes/                # Módulo de gestión de pacientes
│   │   ├── PacientesView.tsx    # Vista listado de pacientes
│   │   ├── PacienteRegistroView.tsx  # Vista registro de paciente
│   │   └── components/           # Componentes específicos de pacientes
│   │       ├── PacienteForm.tsx
│   │       └── PacientesTable.tsx
│   └── servicios/                # Módulo de servicios
│       ├── ServiciosView.tsx     # Vista de servicios
│       └── components/
│           └── ServiciosGrid.tsx
├── layouts/                      # Layouts que envuelven vistas
│   └── DashboardLayout.tsx       # Layout principal del dashboard
├── routes/                       # Configuración de rutas
│   ├── ProtectedRoute.tsx        # Ruta protegida (auth)
│   └── index.tsx                 # Definición de rutas con lazy loading
├── types/                        # Definiciones de tipos TypeScript
│   ├── pacientes.ts              # Tipos del módulo pacientes
│   └── servicios.ts              # Tipos del módulo servicios
├── utils/                        # Utilidades y helpers
│   ├── cn.ts                     # Función para combinar clases
│   ├── currency.ts               # Formateo de moneda
│   └── dentalBgStyles.ts         # Estilos para odontograma
├── App.tsx                       # Componente raíz
├── index.css                     # Estilos globales + Tailwind CSS v4
├── main.tsx                      # Punto de entrada de la aplicación
└── vite-env.d.ts                 # Tipos de Vite

```[cite: 1]

---

## 🎨 Sistema de Diseño y Tema

### Gestión de Tema (Claro/Oscuro)

El proyecto usa un **Context Provider global** (`ThemeContext.tsx`)[cite: 1]:

- **Estado global**: El tema se almacena en `localStorage`[cite: 1].
- **Clase `.dark`**: Se aplica al elemento `document.documentElement`[cite: 1].
- **Fuente de verdad**: Desconectado de `prefers-color-scheme` para no interferir con las preferencias del navegador[cite: 1].
- **Variantes Tailwind**: Todos los componentes implementan la variante `dark:`[cite: 1].

---

## 🛠️ Guía Paso a Paso: Crear una Nueva Vista

Ejemplo: Crear un nuevo módulo de **Citas** (*Appointments*).

### Paso 1: Estructura de la Feature

Crea la carpeta dentro de `src/features/`[cite: 1]:

```bash
src/features/citas/
├── CitasView.tsx              # Vista principal
├── components/                # Componentes específicos del módulo
│   ├── CitasList.tsx
│   └── CitaForm.tsx
└── types.ts                   # Tipos TypeScript específicos

```[cite: 1]

### Paso 2: Creación del Componente de la Vista

**Archivo: `src/features/citas/CitasView.tsx`**

```tsx
import { useState } from "react";
import { CitasList } from "./components/CitasList";
import { CitaForm } from "./components/CitaForm";

interface Cita {
  id: number;
  paciente: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "confirmada" | "cancelada";
}

export function CitasView() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Citas
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Gestión de citas del consultorio.
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-800 transition-all"
            onClick={() => setShowForm(true)}
          >
            + Nueva Cita
          </button>
        </div>
        {showForm && <CitaForm onCancel="{()"> setShowForm(false)} />}
        <CitasList citas="{citas}"/>
      </div>
    </div>

  );
}

```[cite: 1]

### Paso 3: Lógica, Hooks y Estado

```tsx
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { axiosClient } from "@/api/axiosClient";

export function CitasView() {
  const { theme } = useTheme();
  const [citas, setCitas] = useState<Cita[]>([]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await axiosClient.get("/citas");
        setCitas(response.data);
      } catch (error) {
        console.error("Error al cargar citas:", error);
      }
    };
    fetchCitas();
  }, []);

  // ...
}

```[cite: 1]

### Paso 4: Convención de Estilos (Tailwind CSS v4)

Garantiza siempre el contraste para ambos modos:

- **Fondos**: `bg-white dark:bg-slate-900`[cite: 1]
- **Textos principales**: `text-slate-900 dark:text-slate-100`[cite: 1]
- **Textos secundarios**: `text-slate-600 dark:text-slate-400`[cite: 1]
- **Bordes**: `border-slate-200 dark:border-slate-800`[cite: 1]

### Paso 5: Registro de la Ruta

**Archivo: `src/routes/index.tsx`**

1. Agrega la importación dinámica (Lazy):

   ```tsx
   const CitasView = lazyImport(() => import("../features/citas/CitasView"), "CitasView");
   ```[cite: 1]
```

2. Define la ruta en el Router:
   
   ```tsx
   <Route <DashboardLayout element="{" path="/citas">
      <CitasView/>
    </DashboardLayout>
   }
   />
   ```[cite: 1]
   ```

3. Enlaza la vista en el menú principal (`src/components/layout/Sidebar.tsx`):
   
   ```tsx
   import { CalendarDays } from "lucide-react";
   
   ```

// Dentro de la lista de ítems:
{
  label: "Citas",
  icon: CalendarDays,
  path: "/citas",
}

```[cite: 1]

---

## 📦 Scripts de Desarrollo

```bash

# Instalar dependencias

npm install

# Iniciar servidor de desarrollo

npm run dev

# Compilar para producción

npm run build

# Previsualizar build de producción

npm run preview
```[cite: 1]
