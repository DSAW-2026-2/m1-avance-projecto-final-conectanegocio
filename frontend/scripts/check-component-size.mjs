import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const sourceDirectory = fileURLToPath(new URL('../src/', import.meta.url));
const limit = 80;

function lineCount(source) {
  return source.replace(/\n$/, '').split('\n').length;
}

async function jsxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return jsxFiles(path);
    return entry.isFile() && path.endsWith('.jsx') ? [path] : [];
  }));
  return nested.flat();
}

if (process.argv.includes('--self-test')) {
  if (lineCount(Array(80).fill('x').join('\n')) !== 80 ||
      lineCount(Array(81).fill('x').join('\n')) <= limit) {
    throw new Error('The 80-line boundary check failed.');
  }
  console.log('Component-size boundary self-test passed.');
} else {
  const files = await jsxFiles(sourceDirectory);
  const failures = [];
  for (const file of files) {
    const lines = lineCount(await readFile(file, 'utf8'));
    if (lines > limit) failures.push(`${file}: ${lines} lines (maximum ${limit})`);
  }
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Checked ${files.length} JSX files: all within ${limit} lines.`);
  }
}
