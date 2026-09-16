const { execSync } = require('child_process');
const repos = [
  'NexusOdontoFrontend',
  'NexusOdontoBackend_Api',
  'NexusOdonto_ChatBot_AI-develop',
  'NexusOdonto_documentation'
];

const commitMap = {};

for (const repo of repos) {
  try {
    const out = execSync('git log --date=short --pretty=format:"%ad|%h|%an|%s"', { cwd: repo, encoding: 'utf8' });
    const lines = out.split('\n').filter(Boolean);
    for (const line of lines) {
      const [date, hash, author, ...subjectParts] = line.split('|');
      const subject = subjectParts.join('|');
      if (!commitMap[date]) commitMap[date] = [];
      commitMap[date].push({ repo, hash, author, subject });
    }
  } catch (e) {
    console.error('Error in repo', repo, e.message);
  }
}

const dates = Object.keys(commitMap).sort();
const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

console.log('=== AUDITORIA DE FECHAS DE COMMITS ===');
for (const d of dates) {
  const dayOfWeek = new Date(d + 'T12:00:00Z').getUTCDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  console.log(`${d} (${dayNames[dayOfWeek]})${isWeekend ? ' [FIN DE SEMANA - OMITIR]' : ' [DIA HABIL - GENERAR BITACORA]'}: ${commitMap[d].length} commits`);
}
