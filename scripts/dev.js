const path = require('path');
const rootDir = path.resolve(__dirname, '..');
process.chdir(rootDir);

// Inject Next.js CLI args (default to dev)
if (process.argv.length <= 2) {
  process.argv.push('dev');
}

require(path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next'));
