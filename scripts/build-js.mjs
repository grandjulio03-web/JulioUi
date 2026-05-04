/**
 * Concatenate src/js modules into dist/my-framework.js (order matters).
 * Run: node scripts/build-js.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'accordion.js',
  'alert.js',
  'carousel.js',
  'dropdown.js',
  'forms.js',
  'modal.js',
  'pagination.js',
  'tabs.js',
  'air-ui.js',
];

const parts = files.map((f) => readFileSync(join(root, 'src', 'js', f), 'utf8'));
const badgeNote = '// No JavaScript needed - pure CSS badges\n';
const tooltipNote = '// No JavaScript needed - pure CSS tooltips\n// All functionality handled by CSS hover states\n';
const out =
  parts[0] +
  '\n' +
  parts[1] +
  '\n' +
  badgeNote +
  parts[2] +
  '\n' +
  parts[3] +
  '\n' +
  parts[4] +
  '\n' +
  parts[5] +
  '\n' +
  parts[6] +
  '\n' +
  parts[7] +
  '\n' +
  tooltipNote +
  parts[8] +
  '\n';

writeFileSync(join(root, 'dist', 'my-framework.js'), out, 'utf8');
console.log('Wrote dist/my-framework.js');
