const fs = require('fs');
const path = require('path');

const docsRoot = path.resolve(__dirname, '..', 'src', 'docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('[SEC 03] Successfully wrote:', relPath);
}

writeDoc('03_Modulos_Frontend/01_Arquitectura_Frontend_y_Layouts.md', `---
title: "Arquitectura Frontend, Contextos y Layouts"
order: 1
author: "NexusOdonto Frontend Team"
date: "2026-09-16"
---

# Arquitectura Frontend, Contextos y Layouts

El Frontend de NexusOdonto es una SPA reactiva estructurada por *feature modules* bajo React 18, Vite y TypeScript, priorizando la separación de responsabilidades, la inmutabilidad del estado y una experiencia de usuario clínica limpia.

---

## 1. Estructura de Directorios (\`src/\`)

\`\`\`
src/
├── assets/          # Logos, tipografías e imágenes estáticas
├── components/      # Componentes UI reutilizables (Botones, Modales, Inputs, Tablas)
│   ├── layout/      # Sidebar, TopBar, Header, DrawerPortal
│   └── ui/          # Badges, Tooltips, Avatares, Iconografía
├── context/         # React Contexts globales
│   ├── AuthContext.tsx    # Sesión, usuario activo, tokens y permisos
│   ├── ThemeContext.tsx   # Tema claro / oscuro persistente
│   └── ToastContext.tsx   # Sistema de notificaciones toast animadas
├── features/        # Módulos funcionales de la aplicación
│   ├── agenda/            # Agenda clínica y calendario semanal/mensual
│   ├── atencion-chat/     # Panel de soporte y asesor humano en vivo
│   ├── citas/             # Tabla de citas, filtros y agendamiento
│   ├── dashboard/         # Dashboard modular según rol de usuario
│   ├── historia-clinica/  # Evoluciones, antecedentes y exportación PDF
│   ├── odontograma/       # Odontograma FDI interactivo bidimensional
│   ├── pacientes/         # Listado, ficha y exportación CSV de pacientes
│   ├── perfil/            # Ficha de usuario, cambio de clave y Blobatars
│   ├── profesionales/     # Directorio de odontólogos y turnos
│   ├── servicios/         # Catálogo de tratamientos y tarifas
│   └── usuarios/          # Administración de accesos y roles
├── routes/          # Definición de rutas, ProtectedRoute y PublicOnlyRoute
├── services/        # Clientes HTTP Axios tipados para la API REST
├── types/           # Definiciones de tipos e interfaces TypeScript
└── utils/           # Utilidades de fechas (America/Bogota), validaciones y RBAC
\`\`\`

---

## 2. Enrutamiento y Protección de Rutas

El enrutamiento se organiza en \`src/routes/index.tsx\` con dos envoltorios de seguridad:

1. **\`ProtectedRoute\`:** Verifica que exista un token JWT válido y un usuario activo en \`AuthContext\`. Si el usuario no tiene permisos para la ruta solicitada según \`hasRouteAccess(user, path)\`, lo redirige al \`/dashboard\` o a su vista permitida por defecto sin exponer vistas prohibidas.
2. **\`PublicOnlyRoute\`:** Utilizado en \`/login\`, \`/register\` y \`/recuperar-clave\`. Si el usuario ya está autenticado, lo redirige inmediatamente a la aplicación interna.
`);

writeDoc('03_Modulos_Frontend/02_Odontograma_FDI_Interactivo.md', `---
title: "Odontograma FDI Interactivo"
order: 2
author: "NexusOdonto Clinical Engineering"
date: "2026-09-16"
---

# Odontograma FDI Interactivo (5 Superficies Anatómicas)

El Odontograma es el módulo insignia de NexusOdonto para el registro visual del estado de salud bucodental del paciente, implementado bajo el estándar internacional de la Federación Dental Internacional (FDI / ISO 3950).

---

## 1. Notación FDI y Cuadrantes

El componente \`OdontogramaUI\` renderiza dos denticiones completas:

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

\`\`\`
                     ┌──────────────────────┐
                     │    VESTIBULAR (V)    │
                     ├──────────┬───────────┤
        MESIAL (M)   │ OCLUSAL/ │  DISTAL   │
                     │ INCISAL  │    (D)    │
                     ├──────────┴───────────┤
                     │ LINGUAL/PALATINO (L) │
                     └──────────────────────┘
\`\`\`

---

## 3. Estados y Diagnósticos Odontológicos

| Estado Dental | Código | Color / Representación Visual |
|---|---|---|
| **Sano** | \`SANO\` | Blanco / Neutro (#FFFFFF) |
| **Caries** | \`CARIES\` | Rojo (#EF4444) |
| **Restauración / Obturación** | \`RESTAURADO\` | Azul (#3B82F6) |
| **Prótesis Fija / Corona** | \`CORONA\` | Amarillo / Dorado (#F59E0B) |
| **Prótesis Removible** | \`PROTESIS_REM\` | Morado (#8B5CF6) |
| **Endodoncia (Tratamiento de Conducto)**| \`ENDODONCIA\` | Verde Azulado (#10B981) con marca radicular |
| **Exodoncia / Pieza Ausente** | \`AUSENTE\` | Aspa Negra (#1F2937) |
| **Sellante** | \`SELLANTE\` | Verde (#22C55E) |
| **Fractura Dental** | \`FRACTURA\` | Rayo Rojo (#DC2626) |

---

## 4. Garantías de Seguridad y Persistencia

1. **Aislamiento por \`patientId\`:** Los datos se obtienen exclusivamente para el paciente seleccionado. Si el rol es \`PACIENTE\`, el selector queda bloqueado y se fuerza la consulta del usuario en sesión.
2. **Límite de Notas (2000 chars):** Los campos de observaciones y notas clínicas se validan y recortan a 2000 caracteres para evitar desbordamientos en Oracle Database.
3. **Limpieza de Marcadores Legacy:** Se eliminó la dependencia de \`ODONTOGRAM_STATE\`, guardando únicamente estados discretos y normalizados por pieza y superficie.
`);

writeDoc('03_Modulos_Frontend/03_Agenda_y_Gestion_de_Citas.md', `---
title: "Agenda y Gestión de Citas"
order: 3
author: "NexusOdonto Frontend Team"
date: "2026-09-16"
---

# Agenda y Gestión de Citas

El módulo de citas combina una vista tabular de alta densidad (\`CitasTable.tsx\`) y una agenda visual interactiva por horas y profesionales (\`AgendaView.tsx\`).

---

## 1. Características Principales

* **Sincronización Horaria en Tiempo de Colombia (\`America/Bogota\`):**
  * Todas las conversiones de fecha y hora se realizan con respecto a UTC-5 para prevenir desplazamientos de horario en navegadores con distintas zonas horarias.
* **Auto-asignación de Odontólogo Disponible:**
  * Cuando un paciente solicita una cita a través de la web o del chatbot sin especificar doctor, el sistema consulta los turnos libres y asigna automáticamente al odontólogo con menor carga horaria disponible.
* **Estados de Citas y Flujo de Vida:**
  * \`PROGRAMADA\` -> \`CONFIRMADA\` -> \`EN_ATENCION\` -> \`COMPLETADA\` / \`CANCELADA\` / \`NO_ASISTIO\`.

---

## 2. Refactor Tabular de \`CitasTable.tsx\`

Para optimizar la legibilidad en pantallas clínicas de recepción y consultorio, la tabla de citas fue refactorizada a un diseño estructurado con:
* Paginación dinámica y búsqueda en tiempo real por nombre de paciente o documento.
* Filtros rápidos por estado de cita (\`Todas\`, \`Hoy\`, \`Pendientes\`, \`Completadas\`).
* Acciones contextuales por fila (Confirmar, Reagendar, Cancelar, Atender).
`);

writeDoc('03_Modulos_Frontend/04_Historia_Clinica_y_PDFs.md', `---
title: "Historia Clínica y Generación de PDFs"
order: 4
author: "NexusOdonto Clinical Engineering"
date: "2026-09-16"
---

# Historia Clínica Electrónica y Motor de PDFs

NexusOdonto proporciona un expediente clínico digital completo que cumple con las regulaciones de historia clínica electrónica y permite la exportación instantánea en formato PDF.

---

## 1. Visualizador de Detalle con Portal (\`DrawerPortal\`)

Para evitar problemas de recorte de texto (*text clipping*) y solapamiento de capas en pantallas con múltiples niveles de anidación, el cajón lateral de detalles del paciente se renderiza utilizando un **React Portal** directo sobre el elemento \`document.body\`:
* Renderizado fuera de la jerarquía DOM padre.
* Transición suave de entrada/salida (*slide-over*).
* Historial cronológico de evoluciones médicas con fecha, hora, diagnóstico CIE-10 y firma digital del odontólogo responsable.

---

## 2. Motor de Generación de Documentos PDF

El frontend incluye tres plantillas especializadas para la emisión de documentos oficiales:

1. **\`HistoriaClinicaPDF\`:** Resumen completo del expediente, antecedentes médicos (alergias, patologías, medicamentos), odontograma actual y registro de evoluciones.
2. **\`FormulaMedicaPDF\`:** Recetario médico odontológico con membrete institucional de la clínica, datos del paciente, dosificación de medicamentos, indicaciones y firma del odontólogo tratante.
3. **\`RegistroIndividualPDF\`:** Comprobante de atención individual por sesión para entrega física o digital al paciente o aseguradora.
`);

writeDoc('03_Modulos_Frontend/05_Modulo_Atencion_Chat_y_Asesor.md', `---
title: "Módulo de Atención Chat y Asesor Humano"
order: 5
author: "NexusOdonto Support Team"
date: "2026-09-16"
---

# Módulo de Atención Chat y Asesor Humano en Vivo

Cuando un paciente interactúa con el Asistente IA y requiere asistencia especializada o solicita hablar con un humano, el sistema escala la conversación a la vista \`AtencionAsesorView.tsx\`.

---

## 1. Flujo de Escalamiento y Tickets

\`\`\`
  [ Paciente en Chatbot ] ──> Solicita soporte humano ──> [ Ticket Creado en DB ]
                                                                 │
                                                                 ▼
  [ Recepcionista / Asesor ] <── Notificación en vivo <── [ Cola de Tickets ]
           │
           ├── Responde en tiempo real por el panel web
           ├── Envía mensaje directo a WhatsApp del paciente ("send-whatsapp")
           └── Resuelve el ticket ("ResolveTicket" con o sin retorno al Bot)
\`\`\`

---

## 2. Optimizaciones de UX / UI en la Vista de Chat

* **Identificación por Número Telefónico:** La lista de conversaciones activas muestra el número de teléfono formateado y nombre del paciente en lugar de etiquetas genéricas.
* **Preservación del Scroll y Navegación Móvil:** Al volver atrás en dispositivos móviles, se mantiene la lista sin reinicializaciones molestas de estado.
* **Resolución Flexible de Tickets:** Posibilidad de cerrar el ticket dejando la conversación archivada o reactivando el bot automático para futuras consultas.
`);

writeDoc('03_Modulos_Frontend/06_Gestion_de_Pacientes_y_Usuarios.md', `---
title: "Gestión de Pacientes y Administración de Usuarios"
order: 6
author: "NexusOdonto Core Team"
date: "2026-09-16"
---

# Gestión de Pacientes y Administración de Usuarios

Módulos administrativos para el registro de pacientes, control de fichas y administración de cuentas de usuario con avatares geométricos dinámicos.

---

## 1. Módulo de Pacientes (\`PacientesView.tsx\`)

* **Búsqueda Avanzada:** Filtrado instantáneo por número de documento, nombres, apellidos o correo.
* **Exportación CSV Enriquecida:** Exporta la base de pacientes con todos los campos clave (Tipo Documento, Número, Nombre Completo, Teléfono, Correo, Fecha de Nacimiento, Sexo, Estado Activo/Inactivo).
* **Ficha Rápida:** Acceso con un clic a la historia clínica, citas pendientes y odontograma del paciente.

---

## 2. Módulo de Usuarios (\`UsuariosView.tsx\` / \`UsuariosTable.tsx\`)

* **Control de Estado:** Activación y desactivación de usuarios con confirmación visual.
* **Protección Admin Semilla:** El usuario \`AD001\` tiene deshabilitados los botones de desactivación y eliminación para evitar bloqueos del sistema.
* **Avatares Blobatar:** Integración de avatares geométricos vectoriales animados generados algorítmicamente a partir del identificador o correo del usuario.
`);
