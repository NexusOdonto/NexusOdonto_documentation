const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docsRoot = path.resolve(__dirname, '..', 'src', 'docs', '05_Bitacora_de_Commits_y_Dailies');
fs.mkdirSync(docsRoot, { recursive: true });

// Clean old files in 05_Bitacora_de_Commits_y_Dailies
const oldFiles = fs.readdirSync(docsRoot);
for (const f of oldFiles) {
  fs.unlinkSync(path.join(docsRoot, f));
}

const repos = [
  { name: 'NexusOdontoFrontend', path: path.resolve(__dirname, '..', '..', 'NexusOdontoFrontend'), label: 'Frontend' },
  { name: 'NexusOdontoBackend_Api', path: path.resolve(__dirname, '..', '..', 'NexusOdontoBackend_Api'), label: 'Backend API' },
  { name: 'NexusOdonto_ChatBot_AI-develop', path: path.resolve(__dirname, '..', '..', 'NexusOdonto_ChatBot_AI-develop'), label: 'Agente IA Chatbot' },
  { name: 'NexusOdonto_documentation', path: path.resolve(__dirname, '..'), label: 'Documentación' },
];

const commitMap = {};

for (const r of repos) {
  try {
    const out = execSync('git log --date=short --pretty=format:"%ad|%h|%an|%s"', { cwd: r.path, encoding: 'utf8' });
    const lines = out.split('\n').filter(Boolean);
    for (const line of lines) {
      const [date, hash, author, ...subjectParts] = line.split('|');
      const subject = subjectParts.join('|');
      if (!commitMap[date]) commitMap[date] = [];
      commitMap[date].push({ repo: r.label, hash, author, subject });
    }
  } catch (err) {
    console.warn(`Could not read git log for ${r.name}:`, err.message);
  }
}

const daysSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const monthsSpanish = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const dates = Object.keys(commitMap).sort();
let orderCounter = 1;

for (const d of dates) {
  const dObj = new Date(d + 'T12:00:00Z');
  const dayOfWeek = dObj.getUTCDay();
  
  // IGNORAR SÁBADOS (6) Y DOMINGOS (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log(`[OMITIDO - FIN DE SEMANA]: ${d} (${daysSpanish[dayOfWeek]})`);
    continue;
  }

  const dayName = daysSpanish[dayOfWeek];
  const dayNum = dObj.getUTCDate();
  const monthName = monthsSpanish[dObj.getUTCMonth()];
  const year = dObj.getUTCFullYear();
  const commits = commitMap[d] || [];

  // Group commits by repo
  const byRepo = {};
  for (const c of commits) {
    if (!byRepo[c.repo]) byRepo[c.repo] = [];
    byRepo[c.repo].push(c);
  }

  // Determine primary type
  let type = 'Feature';
  if (commits.some(c => c.subject.startsWith('fix:') || c.subject.startsWith('fix('))) {
    type = 'Fix';
  }

  const filename = `Bitacora_${d}.md`;
  const fullPath = path.join(docsRoot, filename);

  let md = `---
title: "Bitácora del ${dayName} ${dayNum} de ${monthName} de ${year}"
order: ${orderCounter++}
author: "Equipo NexusOdonto"
date: "${d}"
type: "${type}"
summary: "${commits.length} commits registrados en ${Object.keys(byRepo).join(', ')}"
---

# Bitácora de Desarrollo: ${dayName}, ${dayNum} de ${monthName} de ${year}

Registro diario de trabajo, decisiones arquitectónicas, tareas ejecutadas y commits sincronizados en el ecosistema NexusOdonto.

---

## 1. Resumen Ejecutivo de la Jornada

* **Fecha de Trabajo:** ${d} (${dayName})
* **Total de Commits Registrados:** ${commits.length}
* **Módulos Afectados:** ${Object.keys(byRepo).join(', ')}

---

## 2. Detalle de Commits por Repositorio

`;

  for (const [repoLabel, repoCommits] of Object.entries(byRepo)) {
    md += `### ${repoLabel} (${repoCommits.length} commits)\n\n`;
    md += `| Hash | Autor | Descripción del Commit |\n`;
    md += `|---|---|---|\n`;
    for (const c of repoCommits) {
      const sanitizedSubject = c.subject.replace(/\|/g, '-');
      md += `| \`${c.hash}\` | ${c.author} | ${sanitizedSubject} |\n`;
    }
    md += `\n`;
  }

  md += `---

## 3. Decisiones Técnicas y Estado del Módulo

`;

  // Specific contextual notes for specific days
  if (d === '2026-08-24' || d === '2026-08-25' || d === '2026-08-26') {
    md += `* **Arquitectura Base y Modelado:** Definición de la Clean Architecture en .NET 8, inicialización de esquemas relacionales en Oracle Database y configuración de la SPA en React 18 con Vite y TypeScript.\n`;
    md += `* **Autenticación Primaria:** Implementación de hashing BCrypt para contraseñas y emisión de tokens JWT con roles básicos de sistema.\n`;
  } else if (d >= '2026-08-27' && d <= '2026-09-03') {
    md += `* **Seeders y Catálogos:** Configuración de \`DatabaseInitializer\` para garantizar la inserción determinista de usuarios semilla, códigos de empleados (\`AD001\`, \`RC001\`, \`OD001\`-\`OD003\`) y pacientes (\`1076543210\`-\`1076543213\`).\n`;
    md += `* **Integridad Referencial:** Establecimiento de índice único en \`PersonEntity.DocumentNumber\` y normalización de catálogos odontológicos.\n`;
  } else if (d >= '2026-09-04' && d <= '2026-09-10') {
    md += `* **Integración del Agente IA:** Despliegue del motor conversacional con Google Gemini 1.5 Flash en FastAPI y configuración de la base de datos de caché semántica con PostgreSQL + \`pgvector\` para optimizar costos.\n`;
    md += `* **Google OAuth y Tickets:** Soporte para inicio de sesión con Google, gestión de Refresh Tokens y creación del sistema de tickets de soporte para transferir conversaciones a recepcionistas humanos.\n`;
  } else if (d >= '2026-09-11' && d <= '2026-09-14') {
    md += `* **Odontograma FDI y Agenda:** Primeros despliegues de la interfaz de odontograma interactivo y módulo de agenda de turnos con integración de catálogos.\n`;
    md += `* **Blindaje de Seguridad:** Creación de \`SeedAdminGuard\` para proteger al usuario administrador semilla de desactivaciones accidentales y bloqueo de login interactivo para la cuenta de servicio del bot (\`BOT_SERVICE\`).\n`;
  } else if (d === '2026-09-15') {
    md += `* **Motor de PDFs y Portal Drawer:** Implementación de plantillas PDF para Historias Clínicas, Fórmulas Médicas y Registros de Atención. Corrección de desborde de texto mediante React Portal.\n`;
    md += `* **Anti-ORA-12899 y Zona Horaria:** Sanitizado y recorte automático de notas a 2000 caracteres en Oracle y calibración horaria en tiempo clínico de Colombia (\`America/Bogota\`).\n`;
  } else if (d === '2026-09-16') {
    md += `* **Aislamiento de Paciente y Refactor de Citas:** Pruebas de aislamiento estricto en odontogramas por \`patientId\`, migración de \`CitasTable.tsx\` a diseño tabular estructurado y soporte para desvinculación de Google OAuth.\n`;
    md += `* **Segregación Estricta de Recepcionistas:** Restricción de mutaciones sobre servicios y bloqueo de visualización de historias clínicas para el rol \`RECEPCIONISTA\` (fix \`bd072bc\`).\n`;
  }

  fs.writeFileSync(fullPath, md.trim() + '\n', 'utf8');
  console.log(`[GENERADO DÍA HÁBIL]: ${filename} (${dayName} ${d}) con ${commits.length} commits.`);
}

console.log('Proceso de generación de bitácoras diarias completado con éxito.');
