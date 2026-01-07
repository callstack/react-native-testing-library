#!/usr/bin/env node

/**
 * Test script for the package.json update codemod
 * Note: This test script uses console.log for test output, which is acceptable for test scripts
 */

/* eslint-disable no-console */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixturesDir = join(__dirname, '..', 'tests', 'fixtures');

// Import the codemod logic
async function runCodemod(filePath) {
  const { readFileSync } = await import('fs');
  const { default: transform } = await import('./codemod.ts');

  // Mock the codemod platform root object
  const packageJsonContent = readFileSync(filePath, 'utf8');
  const mockRoot = {
    filename: () => filePath,
    root: () => ({
      text: () => packageJsonContent,
    }),
  };

  const result = await transform(mockRoot);
  // Return result or original content if null (no changes)
  return result || packageJsonContent;
}

// Test each fixture
const testCases = readdirSync(fixturesDir);

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  const inputPath = join(fixturesDir, testCase, 'input.json');
  const expectedPath = join(fixturesDir, testCase, 'expected.json');

  if (!existsSync(inputPath) || !existsSync(expectedPath)) {
    console.log(`⚠️  ${testCase}: Missing input or expected file`);
    continue;
  }

  try {
    const inputContent = readFileSync(inputPath, 'utf8');
    const expectedContent = readFileSync(expectedPath, 'utf8');

    // Create a temporary file to test (must be named package.json for codemod to process it)
    const tempPath = join(fixturesDir, testCase, 'package.json');
    writeFileSync(tempPath, inputContent, 'utf8');

    // Run codemod
    const result = await runCodemod(tempPath);

    // Handle null result (no changes or skipped)
    const resultContent = result || inputContent;

    // Compare results
    const expectedJson = JSON.parse(expectedContent);
    const resultJson = JSON.parse(resultContent);

    if (JSON.stringify(expectedJson, null, 2) === JSON.stringify(resultJson, null, 2)) {
      console.log(`✅ ${testCase}: PASSED`);
      passed++;
    } else {
      console.log(`❌ ${testCase}: FAILED`);
      console.log('Expected:');
      console.log(JSON.stringify(expectedJson, null, 2));
      console.log('Got:');
      console.log(JSON.stringify(resultJson, null, 2));
      failed++;
    }

    // Clean up temp file
    const tempFilePath = join(fixturesDir, testCase, 'package.json');
    if (existsSync(tempFilePath)) {
      const { unlinkSync } = await import('fs');
      unlinkSync(tempFilePath);
    }
  } catch (error) {
    console.log(`❌ ${testCase}: ERROR - ${error.message}`);
    failed++;
  }
}

console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
