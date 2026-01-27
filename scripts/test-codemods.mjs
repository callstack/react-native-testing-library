#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// console.log('Running rntl-v14-update-deps codemod tests...\n');
// try {
//   execSync(`yarn dlx tsx ${join(rootDir, 'codemods/v14-update-deps/scripts/test.js')}`, {
//     cwd: rootDir,
//     stdio: 'inherit',
//   });
//   console.log('\n✅ v14 Update-deps codemod tests passed\n');
// } catch (error) {
//   console.error('\n❌ v14 Update-deps codemod tests failed');
//   process.exit(1);
// }

// console.log('✅ All codemod tests passed');

// console.log('Running rntl-v14-async-functions codemod tests...\n');
// try {
//   execSync(
//     `yarn dlx codemod@latest jssg test -l tsx ${join(rootDir, 'codemods/v14-async-functions/scripts/codemod.ts')} ${join(rootDir, 'codemods/v14-async-functions/tests/fixtures')}`,
//     {
//       cwd: rootDir,
//       stdio: 'inherit',
//     },
//   );
//   console.log('\n✅ v14 Async-functions codemod tests passed\n');
// } catch (error) {
//   console.error('\n❌ v14 Async-functions codemod tests failed');
//   process.exit(1);
// }

console.log('Running rntl-v13-async-functions codemod tests...\n');
try {
  execSync(
    `yarn dlx codemod@latest jssg test -l tsx ${join(rootDir, 'codemods/v13-async-functions/scripts/codemod.ts')} ${join(rootDir, 'codemods/v13-async-functions/tests/fixtures')}`,
    {
      cwd: rootDir,
      stdio: 'inherit',
    },
  );
  console.log('\n✅ v13 Async-functions codemod tests passed\n');
} catch (error) {
  console.error('\n❌ v13 Async-functions codemod tests failed');
  process.exit(1);
}