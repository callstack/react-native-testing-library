#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('Running async-functions codemod tests...\n');
try {
  execSync(
    `yarn dlx codemod@latest jssg test -l tsx ${join(rootDir, 'codemods/v14-async-functions/scripts/codemod.ts')} ${join(rootDir, 'codemods/v14-async-functions/tests/fixtures')}`,
    {
      cwd: rootDir,
      stdio: 'inherit',
    },
  );
  console.log('\n✅ Async-functions codemod tests passed\n');
} catch (error) {
  console.error('\n❌ Async-functions codemod tests failed');
  process.exit(1);
}

console.log('Running update-deps codemod tests...\n');
try {
  execSync(`yarn dlx tsx ${join(rootDir, 'codemods/v14-update-deps/scripts/test.js')}`, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('\n✅ Update-deps codemod tests passed\n');
} catch (error) {
  console.error('\n❌ Update-deps codemod tests failed');
  process.exit(1);
}

console.log('✅ All codemod tests passed');
