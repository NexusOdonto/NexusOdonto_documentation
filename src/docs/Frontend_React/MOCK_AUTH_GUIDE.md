# Sistema de Autenticación Simulada (Mock Auth) y RBAC

## 📋 Credenciales de Prueba

El sistema incluye 3 usuarios preconfigurados para desarrollo y pruebas. Puedes ingresar con **cédula o correo electrónico**.

### 🔐 Usuario Administrador
- **Email**: `admin@nexusodonto.com`
- **Cédula**: `123456789`
- **Contraseña**: `admin123`
- **Rol**: `ADMIN`
- **Permisos**: Acceso total a todas las secciones
  - `/dashboard`
  - `/citas`
  - `/pacientes`
  - `/servicios`
  - `/usuarios`
  - `/odontograma`
  - `/agenda`
  - `/configuracion`

### 👨‍⚕️ Usuario Odontólogo
- **Email**: `doctor@nexusodonto.com`
- **Cédula**: `987654321`
- **Contraseña**: `doctor123`
- **Rol**: `ODONTOLOGO`
- **Permisos**: Acceso a gestión clínica
  - `/dashboard`
  - `/citas`
  - `/pacientes`
  - `/odontograma`
  - `/agenda`

### 👩‍💼 Usuario Recepcionista
- **Email**: `recepcion@nexusodonto.com`
- **Cédula**: `456789123`
- **Contraseña**: `recepcion123`
- **Rol**: `RECEPCIONISTA`
- **Permisos**: Acceso a gestión administrativa
  - `/dashboard`
  - `/citas`
  - `/pacientes`
  - `/agenda`

## 🏗️ Arquitectura Implementada

### 1. Feature-First Structure
```
src/features/auth/
├── mocks/
│   └── users.mock.ts          # Mocks de usuarios y permisos
├── components/
│   ├── LoginButton.tsx
│   ├── LoginInput.tsx
│   └── RoleSwitcher.tsx       # Switcher de roles (dev)
├── AuthContext.tsx            # Contexto de autenticación
└── LoginPage.tsx              # Página de login
```

### 2. Sistema de Autenticación
- **AuthContext**: Gestiona el estado de autenticación global
- **localStorage**: Persistencia de sesión del usuario
- **fake-jwt-token**: Token simulado para autenticación
- **Login/Logout**: Funciones completas de autenticación

### 3. Control de Acceso (RBAC)
- **ProtectedRoute**: Componente que protege rutas
- **ROLE_PERMISSIONS**: Mapa de permisos por rol
- **hasPermission**: Función helper para validar accesos
- **Sidebar dinámico**: Menú filtrado según rol del usuario

### 4. Componentes Integrados
- **LoginPage**: Formulario de login con validación
- **DashboardLayout**: Muestra usuario autenticado
- **PageHeader**: Avatar y nombre del usuario
- **Sidebar**: Menú filtrado por permisos
- **RoleSwitcher**: Herramienta de desarrollo para cambiar roles

## 🔧 Funcionalidades Implementadas

### ✅ Autenticación
- Login con validación de credenciales
- Manejo de errores en login
- Logout con limpieza de sesión
- Persistencia de sesión en localStorage
- Redirección automática al dashboard

### ✅ Control de Acceso
- Rutas protegidas por autenticación
- Validación de permisos por ruta
- Pantalla de acceso denegado (403)
- Redirección a login si no autenticado
- Menú sidebar filtrado por rol

### ✅ Integración UI
- Avatar de usuario en header
- Nombre del usuario en dashboard
- Error messages en login
- Loading states durante autenticación
- Role switcher en modo desarrollo

### ✅ Manejo de Temas
- Compatibilidad con modo claro/oscuro
- Imágenes de fondo dinámicas
- Estilos adaptativos

## 🧪 Pruebas Realizadas

### 1. Compilación TypeScript
- ✅ Sin errores de tipos
- ✅ Validación de interfaces
- ✅ Tipos de roles correctos

### 2. Build de Producción
- ✅ Build exitoso
- ✅ Optimización de chunks
- ✅ Bundle size optimizado

### 3. Servidor de Desarrollo
- ✅ Servidor ejecutándose en puerto 5174
- ✅ Hot reload funcional
- ✅ Sin errores en consola

## 📊 Estructura de Rutas

```typescript
// Rutas públicas
/login

// Rutas protegidas (requieren autenticación)
/dashboard       - Todos los roles
/citas          - Todos los roles
/pacientes      - Todos los roles
/servicios      - Solo ADMIN
/usuarios       - Solo ADMIN
/odontograma    - ADMIN, ODONTOLOGO
/agenda         - Todos los roles
```

## 🎯 Estado del Sistema

El sistema de autenticación simulada está **100% funcional** y listo para:

1. **Desarrollo**: Probar flujos de usuario con diferentes roles
2. **Testing**: Validar permisos y accesos
3. **Integración**: Reemplazar mocks con API real cuando esté disponible

## 🔄 Próximos Pasos

Para conectar con el backend real:

1. Reemplazar `authenticateUser` en `AuthContext.tsx` con llamada a API
2. Configurar interceptor de Axios para incluir token JWT
3. Implementar refresh token strategy
4. Remover `RoleSwitcher` en producción
5. Actualizar mocks según endpoints del backend

## 📝 Notas Importantes

- **RoleSwitcher**: Solo visible en modo desarrollo (`import.meta.env.DEV`)
- **LocalStorage**: La sesión persiste al recargar la página
- **Token Simulado**: Usa formato `fake-jwt-token-{timestamp}`
- **Contraseñas**: En plaintext para desarrollo (cifrar en producción)
- **Avatares**: Usan DiceBear API para generar avatares únicos
