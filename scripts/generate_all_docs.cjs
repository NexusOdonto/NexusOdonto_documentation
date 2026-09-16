const fs = require('fs');
const path = require('path');

const docsRoot = path.resolve(__dirname, '..', 'src', 'docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('Successfully wrote:', relPath);
}

writeDoc('test.md', '# Test Doc');
