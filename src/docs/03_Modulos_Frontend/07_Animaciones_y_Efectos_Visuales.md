---
title: "Animaciones y Efectos Visuales Avanzados"
order: 7
author: "NexusOdonto Frontend & UI/UX Team"
date: "2026-09-16"
summary: "Arquitectura de microinteracciones, animaciones físicas con motion/react, shaders WebGL y optimización de GPU"
---

# Animaciones y Efectos Visuales Avanzados en NexusOdonto

El Frontend de NexusOdonto incorpora una capa de microinteracciones, físicas elásticas y efectos visuales de alta fidelidad diseñada para elevar la experiencia clínica, proporcionar retroalimentación táctil/visual inmediata y mantener una tasa constante de **60 a 120 FPS** sin degradar el rendimiento del navegador.

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                   CAPA DE EXPERIENCIA VISUAL & ANIMACIÓN                │
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
  ┌──────────────┐             ┌──────────────┐             ┌─────────────────┐
  │ MOTION/REACT │             │ SHADERS GLSL │             │ FÍSICA CANVAS   │
  │ Micro-anim   │             │ (WebGL FBM)  │             │ (Colisiones)    │
  │ - Folders 3D │             │ - FluidOrb   │             │ - GravityLetters│
  │ - Spring Bell│             │ - NexusBot   │             │ - Hero Landing  │
  │ - Counters   │             │   Atmosphere │             │                 │
  └──────┬───────┘             └──────┬───────┘             └────────┬────────┘
         │                            │                              │
         └────────────────────────────┼──────────────────────────────┘
                                      │
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │       ACELERACIÓN POR HARDWARE & GPU COMPOSITOR │
             │  (transform, opacity, will-change, offscreen)   │
             │  + Respeto estricto de prefers-reduced-motion   │
             └─────────────────────────────────────────────────┘
```

---

## 1. Stack de Animación y Arquitectura

### Justificación Técnica de `motion` / `motion/react`
NexusOdonto adopta el paquete unificado `motion/react` (compatible con el compilador y ciclo de vida de React 18/19), sustituyendo las tradicionales clases CSS aisladas y complejas manipulaciones manuales del DOM:
1. **Físicas Basadas en Resortes (`spring`):** Movimientos naturales gobernados por masa, rigidez (`stiffness`) y amortiguamiento (`damping`), evitando la rigidez de las curvas de aceleración lineales.
2. **Ciclos de Salida Limpios con `AnimatePresence`:** Permite animar la salida de componentes que se desmontan del árbol de React (como modales, drawers y banners de notificación) sin retrasar la sincronización del estado.
3. **Valores Reactivos fuera del Render Loop (`MotionValue` & `useTransform`):** Modificación directa de atributos de estilo sin provocar re-renderizados costosos de componentes React padres.

### Prácticas de Rendimiento y Consumo de GPU
* **Propiedades Aceleradas por Hardware:** Solo se animan propiedades compuestas por el hilo del compositor de la GPU: `transform` (translate, rotate, scale) y `opacity`. Se prohíbe terminantemente animar `width`, `height`, `top` o `margin` en elementos críticos para evitar fases de *Layout Reflow* y *Paint*.
* **Gestión de Memoria y Cleanup:** Todos los hooks de animación, listeners de eventos (`pointermove`, `deviceorientation`) y loops de `requestAnimationFrame` se cancelan en la función de limpieza (`return () => ...`) del `useEffect`.
* **Accesibilidad y `prefers-reduced-motion`:**
  Todos los componentes consultan el hook `useReducedMotion()`. Si el usuario tiene activada la preferencia de reducción de movimiento en su sistema operativo, las animaciones complejas se desactivan o sustituyen por transiciones de opacidad instantáneas (`duration: 0` o `0.05s`).

---

## 2. Catálogo de Componentes Animados

### 1. Carpetas Clínicas 3D (`FolderComponent.tsx`)
Utilizado en el módulo de expedientes e historias clínicas para dar una metáfora física de "apertura de legajo médico".

* **Perspectiva y Rotación Angular:**
  El contenedor define una perspectiva 3D (`perspective: 1000px`). La tapa frontal (`flap`) rota sobre el eje X con origen en su base (`transform-origin: bottom`), abriéndose con una rotación de hasta `-45deg` a `-60deg`.
* **Despliegue Elástico de Tarjetas:**
  Al hacer hover o click, las fichas internas del paciente (`cards`) se elevan verticalmente (`translateY: -30px`) y se abren en abanico con ligeras rotaciones Z (`-3deg`, `0deg`, `+3deg`) usando una transición con resorte (`stiffness: 260, damping: 20`).
* **Tematización Dinámica:**
  Soporta temas clínicos (`black`, `white`, `blue`, `teal`, `amber`) con efectos de resplandor interno (*inset shadow*) y opacidades calibradas.

```tsx
// Ejemplo de configuración de resorte en FolderComponent
<motion.div
  animate={{
    rotateX: isOpen ? -50 : 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }}
  className="folder-flap"
/>
```

---

### 2. Campana de Notificaciones (`NotificationBell.tsx`)
Elemento interactivo situado en la barra superior (`TopBar`) para avisos de nuevas citas y mensajes del chatbot.

* **Física de Péndulo/Oscilación:**
  Implementa un modelo pendular donde la campana oscila sobre su vértice superior (`transformOrigin: "50% 0%"`). El badajo interior (`clapper`) se desfasa ligeramente en tiempo y velocidad (`CLAPPER_SWEEP = 13`, `CLAPPER_VELOCITY = 450`), simulando la inercia real de una campana metálica.
* **Badge Contador con Rebote Elástico (`spring scale`):**
  Cuando el contador de notificaciones pendientes se incrementa, el badge emerge mediante `AnimatePresence` con una animación elástica (`scale: [0, 1.25, 1]`, `stiffness: 600, damping: 20`).
* **Rodillo Numérico Flotante:**
  Las cifras individuales rotan verticalmente en una columna graduada con máscara de gradiente (`FADE`), ofreciendo una transición suave al cambiar de dígito.

---

### 3. Contadores Dinámicos (`AnimatedCounter.tsx`)
Utilizado en las tarjetas métricas del Dashboard para cifras estadísticas (citas agendadas hoy, pacientes atendidos, ingresos).

* **Interpolación Numérica Fluida:**
  Los valores numéricos se animan mediante un rodillo de 10 caras (`FACES = [0..9]`) montado en una rueda vertical con interpolación matemática `useTransform`.
* **Soporte de Decimales y Formateo:**
  Maneja precisión decimal dinámica, separadores de miles y animaciones individuales por columna, asegurando que solo giren los dígitos que cambian de valor.
* **Curva de Desaceleración Bézier:**
  Aplica la curva `cubic-bezier(0.22, 1, 0.36, 1)` para un aterrizaje suave y elegante al alcanzar la cifra objetivo.

---

### 4. Modales y Drawers (`AnimatePresence`)
Estandarización del ciclo de vida de paneles emergentes, diálogos de confirmación y el cajón de historia clínica (`DrawerPortal`).

* **Curvas de Transición Suaves:**
  * **Fondo Overlay:** `opacity: 0 -> 1` (entrada en 150 ms) y `1 -> 0` (salida en 120 ms).
  * **Contenedor Modal:** `opacity: 0 -> 1` con escalado `scale: 0.95 -> 1.0` y traslación vertical `y: 10 -> 0`.
* **Prevención de Parpadeos (*Flickering*):**
  El uso de `mode="wait"` o transiciones directas en `AnimatePresence` garantiza que el elemento conserve su layout y dimensiones hasta que la animación de salida finalice por completo.

---

## 3. Efectos Visuales Avanzados (Canvas / WebGL / Shaders)

### 1. Esfera Líquida Interactiva (`FluidOrb.tsx`)
Presente en áreas de bienvenida, landing pages y módulo de NexusBot.

* **Shader de Fragmentos GLSL (FBM - Fractional Brownian Motion):**
  Ejecuta un shader WebGL que calcula ruido Perlin fractal (`fbm`) superpuesto a un campo de deriva armónica (`drift`), generando una esfera translúcida con movimiento orgánico de fluidos.
* **Respuesta a Coordenadas del Puntero:**
  El movimiento de la esfera reacciona sutilmente a la posición del cursor del usuario mediante uniformes `u_resolution` y `u_time`.
* **Regla Crítica de Optimización de GPU (Pausado en Background):**
  Para evitar consumo innecesario de batería o recursos gráficos, el ciclo de renderizado `requestAnimationFrame` se pausa automáticamente cuando la pestaña del navegador pasa a segundo plano:

```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      lastTime = performance.now();
      render();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
}, []);
```

---

### 2. Tipografía con Gravedad (`GravityLetters.tsx`)
Simulación física interactiva para títulos destacados y eslóganes.

* **Motor de Física 2D en Canvas:**
  Simula gravedad constante, fricción de aire, ángulo de inclinación (`TILT = 26`) y coeficiente de restitución / rebote (`BOUNCE = 0.22`).
* **Detección de Colisión y Pilas de Glifos:**
  Las letras caen y colisionan entre sí, apilándose en la base del contenedor formando una estructura física interactiva que puede ser agitada o dispersada al interactuar.
* **Preservación de Accesibilidad y SEO:**
  Aunque los caracteres físicos se dibujan en un elemento `<canvas>`, el texto completo se mantiene intacto en un elemento hermano `<span className="sr-only">`, permitiendo que lectores de pantalla y motores de búsqueda indexen el contenido sin obstáculos.
