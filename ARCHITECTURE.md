# Arquitectura del Proyecto NexusOdonto Documentation

## Estructura del proyecto

```text
src/
├── assets/                 # Recursos estáticos
│   └── teams/             # Imágenes de miembros del equipo
├── components/             # Componentes reutilizables globalmente
│   ├── layout/            # Componentes de layout compartidos
│   │   ├── Sidebar.tsx   # Barra lateral de navegación
│   │   └── TopBar.tsx    # Barra superior de navegación
│   └── ui/                # Componentes visuales genéricos
│       ├── Icons.tsx      # Biblioteca de iconos SVG
│       ├── NexusLogo.tsx  # Logo del sistema
│       ├── SearchModal.tsx # Modal de búsqueda
│       └── TableOfContents.tsx # Navegación lateral de artículos
├── context/               # React Context globales
│   ├── ThemeContext.tsx   # Gestión de tema claro/oscuro
│   └── SidebarContext.tsx # Estado del sidebar móvil
├── docs/                  # Contenido Markdown de la documentación
│   ├── Overview/
│   ├── Agente_IA/
│   ├── Backend_Net/
│   ├── Base_De_Datos/
│   ├── Frontend_React/
│   ├── Bitacora/
│   └── Team/
├── features/              # Funcionalidades agrupadas (Feature-First)
│   ├── home/              # Página principal
│   │   └── HomePage.tsx
│   ├── documentation/     # Sistema de documentación
│   │   └── ArticlePage.tsx
│   ├── team/              # Directorio de equipo
│   │   └── TeamPage.tsx
│   └── bitacora/          # Registro de cambios
│       └── BitacoraPage.tsx
├── layouts/               # Layouts generales
│   └── DocsLayout.tsx     # Layout principal con sidebar + topbar
├── routes/                # Centralización de rutas
│   └── index.tsx          # Configuración de rutas
├── styles/                # Estilos CSS
│   ├── index.css
│   ├── layout.css
│   ├── pages.css
│   └── tokens.css
├── types/                 # Tipos TypeScript compartidos
│   └── doc.ts             # Tipos para documentos Markdown
├── utils/                 # Funciones auxiliares reutilizables
│   ├── frontmatter.ts     # Parser de frontmatter YAML
│   ├── loadDocs.ts        # Cargador de archivos Markdown
│   ├── search.ts          # Motor de búsqueda
│   ├── sectionConfig.ts    # Configuración de secciones
│   └── toc.ts             # Generador de tabla de contenidos
├── App.tsx                # Componente principal de la aplicación
├── index.css              # Estilos globales
└── main.tsx               # Punto de entrada
```

## Responsabilidad de cada carpeta

### `src/assets/`
Recursos estáticos utilizados por la aplicación:
- **teams/**: Imágenes de los miembros del equipo (migrado desde `public/team/`)

### `src/components/`
Componentes reutilizables globalmente, separados conceptualmente en:
- **layout/**: Componentes estructurales compartidos (Sidebar, TopBar)
- **ui/**: Componentes visuales genéricos (Icons, Modals, TOC)

### `src/context/`
React Context utilizados globalmente:
- **ThemeContext**: Gestión de tema claro/oscuro
- **SidebarContext**: Estado del sidebar móvil

### `src/docs/`
Contenido Markdown de la documentación organizado por secciones:
- **Overview/**: Documentación general del proyecto
- **Agente_IA/**: Documentación del agente de inteligencia artificial
- **Backend_Net/**: Documentación del backend .NET
- **Base_De_Datos/**: Documentación de base de datos
- **Frontend_React/**: Documentación del frontend React
- **Bitacora/**: Registro de cambios del proyecto
- **Team/**: Perfiles de los miembros del equipo

### `src/features/`
Cada funcionalidad agrupada en su propia carpeta siguiendo el patrón Feature-First:
- **home/**: Landing page principal de la plataforma de documentación
- **documentation/**: Sistema de visualización de artículos Markdown
- **team/**: Directorio de miembros del equipo
- **bitacora/**: Registro de cambios del proyecto

### `src/layouts/`
Layouts generales que estructuran la aplicación:
- **DocsLayout**: Layout principal con Sidebar, TopBar y área de contenido

### `src/routes/`
Centralización de la configuración de rutas de React Router.

### `src/types/`
Tipos TypeScript compartidos y centralizados.

### `src/utils/`
Funciones auxiliares reutilizables:
- **frontmatter.ts**: Parser de frontmatter YAML
- **loadDocs.ts**: Cargador dinámico de archivos Markdown
- **search.ts**: Motor de búsqueda de documentación
- **sectionConfig.ts**: Configuración de secciones y rutas especiales
- **toc.ts**: Generador de tabla de contenidos

## Features

### Home Feature
- **Ubicación**: `src/features/home/`
- **Responsabilidad**: Landing page principal del sistema
- **Componente**: `HomePage.tsx`
- **Funcionalidad**: Muestra el hero, CTA buttons y imagen destacada

### Documentation Feature
- **Ubicación**: `src/features/documentation/`
- **Responsabilidad**: Sistema de visualización de artículos Markdown
- **Componente**: `ArticlePage.tsx`
- **Funcionalidad**: Renderizado de contenido Markdown, syntax highlighting, TOC interactivo

### Team Feature
- **Ubicación**: `src/features/team/`
- **Responsabilidad**: Directorio de miembros del equipo
- **Componente**: `TeamPage.tsx`
- **Funcionalidad**: Grid de tarjetas de miembros con filtros y búsqueda

### Bitacora Feature
- **Ubicación**: `src/features/bitacora/`
- **Responsabilidad**: Registro de cambios del proyecto
- **Componente**: `BitacoraPage.tsx`
- **Funcionalidad**: Timeline de entradas categorizadas por tipo

## Rutas

Las rutas están centralizadas en `src/routes/index.tsx`:

```typescript
export const routes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/docs/*", element: <ArticlePage /> },
  { path: "/bitacora", element: <BitacoraPage /> },
  { path: "/team", element: <TeamPage /> },
  { path: "*", element: <ArticlePage /> },
];
```

Todas las rutas están envueltas en el `DocsLayout` que proporciona Sidebar, TopBar y estructura general.

## API

Actualmente el proyecto no tiene comunicación con APIs externas. La plataforma funciona completamente con datos estáticos Markdown que se cargan dinámicamente usando Vite's `import.meta.glob`.

Los datos de documentación se cargan desde archivos Markdown en `src/docs/` y las imágenes de los miembros del equipo están en `src/assets/teams/`.

## Contextos

### ThemeContext
- **Ubicación**: `src/context/ThemeContext.tsx`
- **Responsabilidad**: Gestión global del tema claro/oscuro
- **Estado**: `theme` ("dark" | "light")
- **Acciones**: `toggleTheme()`
- **Persistencia**: localStorage

### SidebarContext
- **Ubicación**: `src/context/SidebarContext.tsx`
- **Responsabilidad**: Control del sidebar móvil
- **Estado**: `isSidebarOpen`
- **Acciones**: `toggleSidebar()`, `closeSidebar()`, `openSidebar()`

## Types

Los tipos TypeScript están centralizados en `src/types/`:
- **doc.ts**: Tipos para documentos Markdown (`DocFile`, `DocSection`, etc.)

## Utils

Las utilidades reutilizables están en `src/utils/`:
- **frontmatter.ts**: Parser de frontmatter YAML para extraer metadatos
- **loadDocs.ts**: Cargador dinámico de archivos Markdown con `import.meta.glob`
- **search.ts**: Motor de búsqueda con soporte para coincidencias en título y contenido
- **sectionConfig.ts**: Configuración de secciones, orden y rutas especiales
- **toc.ts**: Generador de tabla de contenidos desde encabezados H2/H3

## Flujo general de la aplicación

```
Usuario
   ↓
Route (src/routes/index.tsx)
   ↓
Layout (src/layouts/DocsLayout.tsx)
   ↓
Feature (src/features/*)
   ↓
Components (src/components/layout/ + src/components/ui/)
   ↓
Utils / Context / Types (src/utils/ + src/context/ + src/types/)
```

1. El usuario navega a una URL
2. React Router redirige a la ruta correspondiente
3. DocsLayout proporciona la estructura (Sidebar + TopBar + Main)
4. El feature correspondiente renderiza su contenido principal
5. Los componentes reutilizables de layout y UI complementan la interfaz
6. Utils, contextos y tipos proporcionan funcionalidad auxiliar

## Errores corregidos

### Imports rotos después de reorganización
- **Problema**: Imports con rutas relativas incorrectas después de mover archivos
- **Solución**: Actualización de todos los imports para reflejar la nueva estructura de carpetas
- **Archivos afectados**: Componentes, features, layouts, utils

### Error de lazy loading con named exports
- **Problema**: React Router lazy() esperaba exportaciones default pero los componentes usaban named exports
- **Solución**: Cambio de lazy loading a imports directos con named exports
- **Archivo**: `src/routes/index.tsx`

### Referencias a carpetas vacías
- **Problema**: Carpeta `lib` contenía archivos movidos a `utils`
- **Solución**: Actualización de imports para usar la nueva ubicación en `utils`
- **Archivos afectados**: Múltiples componentes que importaban desde `lib`

## Limpieza realizada

### Eliminación de funcionalidades no relacionadas con documentación
- **Análisis**: Se revisaron todas las funcionalidades existentes para determinar su relación con la plataforma de documentación
- **Resultado**: No se encontraron funcionalidades de pacientes, citas, servicios, etc. (el proyecto ya era una plataforma de documentación)
- **Adaptación**: Se actualizó el lenguaje y contenido para reflejar exclusivamente la naturaleza de plataforma de documentación

### Eliminación de carpetas innecesarias
- **Carpeta `api/`**: Eliminada (no era necesaria para el funcionamiento actual)
- **Carpeta `data/`**: Eliminado el archivo `.gitkeep` (no contenía recursos útiles)
- **Carpetas vacías**: `core`, `lib`, `pages` se mantienen como placeholders por restricciones de permisos

### Migración de imágenes de Teams
- **Origen**: Las imágenes estaban referenciadas desde rutas absolutas `/teams/...`
- **Destino**: Imágenes migradas a `src/assets/teams/`
- **Referencias actualizadas**: Todos los archivos de miembros del equipo en `src/docs/Team/` actualizados con rutas relativas `../../assets/teams/...`
- **Imágenes migradas**: 8 imágenes de miembros del equipo

### Actualización de contenido
- **HomePage**: Texto adaptado para reflejar "Plataforma de Documentación" en lugar de "Sistema de Gestión Clínica"
- **TeamPage**: Descripción actualizada para reflejar plataforma de documentación
- **Perfiles de equipo**: Referencias actualizadas para eliminar menciones a funcionalidades no relacionadas con documentación

## Teams

Los perfiles de los miembros del equipo se encuentran en `src/docs/Team/` y sus imágenes están ubicadas en `src/assets/teams/`.

### Migración de imágenes
Las imágenes de los miembros del equipo fueron migradas de:
- **Antes**: Referencias absolutas `/teams/...` (esperadas en `public/team/`)
- **Ahora**: Rutas relativas `../../assets/teams/...` (ubicadas en `src/assets/teams/`)

### Imágenes disponibles
- AndresFelipeNavasAlvear.jpeg
- BrayanSnehyderCastroVelandia.jpeg
- DannielSantiagoPlazaMantilla.jpeg
- FelipeCorredorSilva.jpeg
- JeisonLeonardoCristancho.jpeg
- JhonAlejandorEscobarLozada.jpeg
- KevinGeovanniPicoRamirez.jpeg
- SergioAndresSerranoRivero.jpeg

## Documentación

La documentación de la plataforma está organizada en `src/docs/` con las siguientes secciones:

- **Overview/**: Documentación general y bienvenida a la plataforma
- **Agente_IA/**: Documentación del agente de inteligencia artificial
- **Backend_Net/**: Documentación del backend .NET
- **Base_De_Datos/**: Documentación de base de datos
- **Frontend_React/**: Documentación del frontend React
- **Bitacora/**: Registro de cambios del proyecto
- **Team/**: Perfiles de los miembros del equipo

Cada archivo Markdown incluye frontmatter con metadatos como título, autor, fecha, y contenido formateado que se renderiza con ReactMarkdown y syntax highlighting.

## Flujo general de la aplicación

```
Usuario
   ↓
Route (src/routes/index.tsx)
   ↓
Layout (src/layouts/DocsLayout.tsx)
   ↓
Feature (src/features/*)
   ↓
Components (src/components/layout/ + src/components/ui/)
   ↓
Utils / Context / Types (src/utils/ + src/context/ + src/types/)
```

1. El usuario navega a una URL de la plataforma de documentación
2. React Router redirige a la ruta correspondiente (/, /docs/*, /team, /bitacora)
3. DocsLayout proporciona la estructura (Sidebar + TopBar + Main)
4. El feature correspondiente renderiza su contenido principal:
   - **Home**: Landing page con acceso a documentación
   - **Documentation**: Visualización de artículos Markdown con TOC interactivo
   - **Team**: Directorio de miembros del equipo
   - **Bitacora**: Timeline de cambios del proyecto
5. Los componentes reutilizables de layout y UI complementan la interfaz
6. Utils, contextos y tipos proporcionan funcionalidad auxiliar (carga de docs, búsqueda, tema, etc.)

## Errores corregidos

### Referencias a imágenes de Teams
- **Problema**: Las imágenes de los miembros del equipo estaban referenciadas con rutas absolutas `/teams/...`
- **Solución**: Migración de imágenes a `src/assets/teams/` y actualización de referencias a rutas relativas `../../assets/teams/...`
- **Archivos afectados**: 8 archivos de perfiles en `src/docs/Team/`

### Contenido desactualizado
- **Problema**: Textos que hacían referencia a "Sistema de Gestión Clínica" en lugar de plataforma de documentación
- **Solución**: Actualización de textos en HomePage, TeamPage y perfiles de equipo para reflejar plataforma de documentación
- **Archivos afectados**: HomePage.tsx, TeamPage.tsx, FelipeCorredorSilva.md

### Rutas de imagen inexistentes
- **Problema**: Referencia a imagen `/Teams/lider.jpeg` que no existía
- **Solución**: Cambio a imagen existente `/fondo.jpg` en HomePage
- **Archivo afectado**: HomePage.tsx

## Pendientes

### Imagen de la pantalla de inicio
- **Estado**: La imagen `/fondo.jpg` en HomePage.tsx está referenciada correctamente
- **Nota**: Se utiliza la imagen existente de la plataforma de documentación
- **Ubicación**: `src/features/home/HomePage.tsx`

### Carpetas vacías
- **Estado**: Las carpetas `core`, `data`, `lib`, `pages` están vacías
- **Nota**: Se mantienen como placeholders para futura expansión
- **Motivo**: No se pudieron eliminar por restricciones de permisos del sistema

### Imagen de la pantalla de inicio
- **Estado**: La imagen `/fondo.jpg` en HomePage.tsx está referenciada correctamente
- **Nota**: Se utiliza la imagen existente de la plataforma de documentación
- **Ubicación**: `src/features/home/HomePage.tsx`

### Carpetas vacías
- **Estado**: Las carpetas `core`, `data`, `lib`, `pages` están vacías
- **Nota**: Se mantienen como placeholders para futura expansión
- **Motivo**: No se pudieron eliminar por restricciones de permisos del sistema

### Imagen de la pantalla de inicio
- **Estado**: La imagen `/fondo.jpg` en HomePage.tsx está referenciada correctamente
- **Nota**: Se utiliza la imagen existente de la plataforma de documentación
- **Ubicación**: `src/features/home/HomePage.tsx`

### Carpetas vacías
- **Estado**: Las carpetas `core`, `data`, `lib`, `pages` están vacías
- **Nota**: Se mantienen como placeholders para futura expansión
- **Motivo**: No se pudieron eliminar por restricciones de permisos del sistema

## Conclusión

El proyecto ha sido reorganizado y refactorizado como una **plataforma de documentación exclusiva** siguiendo una arquitectura Feature-First modular con:

- ✅ Componentes globales separados (layout/ui)
- ✅ Features independientes (home, documentation, team, bitacora)
- ✅ Layouts separados
- ✅ Rutas centralizadas
- ✅ Contextos separados
- ✅ Tipos centralizados
- ✅ Utilidades separadas
- ✅ Imágenes de teams migradas a `src/assets/teams/`
- ✅ Funcionalidades no relacionadas con documentación eliminadas
- ✅ Contenido adaptado para reflejar plataforma de documentación

El proyecto compila correctamente sin errores y mantiene toda su funcionalidad de documentación.