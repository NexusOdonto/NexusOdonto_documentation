# 📚 NexusOdonto — Portal de Documentación Técnica

<div align="center">

# 🦷 NexusOdonto Docs
### **Centro de Conocimiento, Arquitectura y Bitácora Técnica de NexusOdonto**
*Plataforma interactiva de documentación técnica desarrollada con React 19, Vite, TypeScript y animaciones fluidas con Motion.*

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Motion](https://img.shields.io/badge/Motion-React-FF4081?logo=framer&logoColor=white)](https://motion.dev/)
[![Markdown](https://img.shields.io/badge/Markdown-GFM-000000?logo=markdown&logoColor=white)](https://github.com/remarkjs/react-markdown)
[![Status](https://img.shields.io/badge/Status-Online_v2.0--stable-10B981)](#)

</div>

---

## 📖 Descripción General

**NexusOdonto Documentation** es el portal centralizado de referencia técnica, arquitectura de software, especificaciones de endpoints API, esquemas de bases de datos, guías de seguridad RBAC y bitácoras diarias de desarrollo del ecosistema clínico **NexusOdonto**.

Construido como una Single Page Application (SPA) ultrarrápida, permite a desarrolladores, arquitectos y evaluadores explorar todo el conocimiento técnico del proyecto con una experiencia visual moderna, navegación por secciones dinámicas, renderizado en tiempo real de Markdown GFM y componentes interactivos de última generación.

---

## 🚀 Características y Módulos Principales

### 📑 1. Motor de Documentación Markdown en Tiempo Real
- **Renderizado GFM Completo:** Tablas, listas de verificación, bloques de código con resaltado sintáctico (`rehype-highlight`), alertas GitHub-style y soporte para fórmulas.
- **Carga Modular de Secciones:** Ingesta automática y estructurada de documentos agrupados por dominios técnicos.

### 🧭 2. Navegación Inteligente y Sidebar Dinámico
- **Menú Lateral Plegable:** Sidebar con soporte de colapso y despliegue animado mediante `motion/react`.
- **Atajo de Teclado Global:** Alterna el sidebar rápidamente presionando `Ctrl + B` (o `Cmd + B` en macOS).
- **Control Centralizado:** Unificación del control desde el menú de hamburguesa en la barra superior.

### 👥 3. Directorio Interactivo del Equipo (`TeamPage`)
- **Efecto RareUI `GridReveal`:** Visualización de tarjetas de desarrolladores con shader de cuadrícula y partículas interactivas en lienzo canvas HTML5.
- **Filtros por Rol y Búsqueda en Vivo:** Filtrado instantáneo por nombre, rol (`Frontend`, `Backend`) y biografía técnica.

### 🐾 4. Showcase de la Mascota Oficial
- **Líder NexusOdonto:** Sección de bienvenida diseñada en 2 columnas con insignias oficiales, estado de guardián de código, indicadores de supervisión y marco fotográfico optimizado sin distorsiones.

### 📝 5. Bitácora Diaria de Commits y Dailies
- Visualización cronológica de avances diarios del equipo de desarrollo, registros de commits y seguimiento ágil del proyecto.

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología / Biblioteca | Versión |
| :--- | :--- | :--- |
| **Framework UI** | [React](https://react.dev/) | `^19.2.8` |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.2` |
| **Bundler & Dev Server** | [Vite](https://vitejs.dev/) | `^8.2.0` |
| **Enrutamiento** | [React Router DOM](https://reactrouter.com/) | `^7.18.2` |
| **Animaciones & Transiciones** | [Motion](https://motion.dev/) | `^13.4.0` |
| **Renderizado Markdown** | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) | `^10.1.0` / `^4.0.1` |
| **Resaltado de Código** | [rehype-highlight](https://github.com/rehypejs/rehype-highlight) | `^7.0.2` |
| **Utilidades de Estilos** | `clsx` + `tailwind-merge` | `^2.1.1` / `^3.7.0` |

---

## 📂 Estructura del Proyecto

```text
NexusOdonto_documentation/
├── public/
│   ├── lider.jpg                     # Fotografía de la mascota oficial
│   └── ...                           # Assets públicos e íconos
├── src/
│   ├── assets/                       # Imágenes y videos de equipo
│   ├── components/
│   │   ├── layout/                   # Sidebar, TopBar, Footer
│   │   └── ui/                       # GridReveal, Icons, Badges
│   ├── context/                      # SidebarContext y estados globales
│   ├── docs/                         # Documentación técnica en Markdown (.md)
│   │   ├── 01_Arquitectura_y_Entorno/
│   │   ├── 02_Roles_y_Permisos/
│   │   ├── 03_Modulos_Frontend/
│   │   ├── 04_API_y_Servicios/
│   │   └── 05_Bitacora_de_Commits_y_Dailies/
│   ├── features/
│   │   ├── home/                     # HomePage y Hero Showcase
│   │   ├── docs/                     # Visualizador de Markdown y contenido
│   │   └── team/                     # TeamPage y directorio interactivo
│   ├── layouts/                      # Layout general de documentación
│   ├── styles/                       # Tokens, layout y hojas de estilo CSS
│   ├── utils/                        # Cargadores de markdown, slugs y configs
│   ├── App.tsx                       # Rutas y configuración principal
│   └── main.tsx                      # Punto de entrada de la aplicación
├── package.json                      # Dependencias y scripts
├── tsconfig.json                     # Configuración de TypeScript
├── vite.config.ts                    # Configuración de Vite
└── README.md                         # Documentación del proyecto
```

---

## ⚡ Instalación y Ejecución Local

### Prerrequisitos
- **Node.js**: Versión 18.0 o superior
- **npm** o gestor de paquetes preferido

### 1. Clonar el repositorio
```bash
git clone https://github.com/NexusOdonto/NexusOdonto_documentation.git
cd NexusOdonto_documentation
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible localmente en `http://localhost:5173/`.

### 4. Compilar para producción
```bash
npm run build
```

### 5. Previsualizar la compilación de producción
```bash
npm run preview
```

---

## ⌨️ Atajos de Teclado y Accesibilidad

| Atajo | Acción |
| :--- | :--- |
| `Ctrl + B` / `Cmd + B` | Colapsar / Desplegar barra de navegación lateral (Sidebar) |
| `Tab` / `Shift + Tab` | Navegación accesible por teclado |

---

## 👥 Equipo de Desarrollo

Este portal de documentación y el ecosistema **NexusOdonto** han sido diseñados y desarrollados por un equipo multidisciplinario de ingenieros de software, especialistas en backend .NET, desarrolladores frontend React e investigadores de IA:

- **Andrés Felipe Navas Alvear**
- **Daniel Santiago Plaza Mantilla**
- **Felipe Corredor Silva**
- **Jeison Leonardo Cristancho**
- **Jhon Alejandro Escobar Lozada**
- **Kevin Geovanni Pico Ramírez**
- **Sergio Andrés Serrano Rivero**
- **Brayan Snehyder Castro Velandia**
- 🐾 **Líder NexusOdonto** *(Mascota Oficial & Guardián del Código)*

---

<div align="center">
  <sub>© 2026 NexusOdonto. Todos los derechos reservados.</sub>
</div>
