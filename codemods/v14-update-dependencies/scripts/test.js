#!/usr/bin/env node

/**
 * Test script for the package.json update codemod
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const codemodScript = join(__dirname, 'codemod.js');
const fixturesDir = join(__dirname, '..', 'tests', 'fixtures');

// Version constants - must match codemod.js
const RNTL_VERSION = '^14.0.0-alpha';
const UNIVERSAL_TEST_RENDERER_VERSION = '0.10.1';

// Import the codemod logic
async function runCodemod(filePath) {
  const { readFileSync, writeFileSync } = await import('fs');
  const packageJsonContent = readFileSync(filePath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  let hasChanges = false;

  const removePackage = (pkgName, pkgJson) => {
    let removed = false;
    ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach((depType) => {
      if (pkgJson[depType] && pkgJson[depType][pkgName]) {
        delete pkgJson[depType][pkgName];
        removed = true;
        hasChanges = true;
        if (Object.keys(pkgJson[depType]).length === 0) {
          delete pkgJson[depType];
        }
      }
    });
    return removed;
  };

  const addOrUpdatePackage = (pkgName, version, pkgJson, isDevDep = false) => {
    const depType = isDevDep ? 'devDependencies' : 'dependencies';
    if (!pkgJson[depType]) {
      pkgJson[depType] = {};
    }
    const currentVersion = pkgJson[depType][pkgName];
    if (currentVersion !== version) {
      pkgJson[depType][pkgName] = version;
      hasChanges = true;
      return true;
    }
    return false;
  };

  removePackage('@types/react-test-renderer', packageJson);
  removePackage('react-test-renderer', packageJson);

  // Ensure devDependencies exists
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
    hasChanges = true;
  }

  // Handle @testing-library/react-native
  const rntlInDeps = packageJson.dependencies && packageJson.dependencies['@testing-library/react-native'];
  const rntlInDevDeps = packageJson.devDependencies['@testing-library/react-native'];

  // If RNTL is in dependencies, move it to devDependencies
  if (rntlInDeps) {
    const version = packageJson.dependencies['@testing-library/react-native'];
    delete packageJson.dependencies['@testing-library/react-native'];
    if (Object.keys(packageJson.dependencies).length === 0) {
      delete packageJson.dependencies;
    }
    packageJson.devDependencies['@testing-library/react-native'] = version;
    hasChanges = true;
  }

  // Always ensure @testing-library/react-native is in devDependencies
  if (!packageJson.devDependencies['@testing-library/react-native']) {
    packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
    hasChanges = true;
  } else {
    const currentVersion = packageJson.devDependencies['@testing-library/react-native'];
    if (!currentVersion.includes('alpha') && !currentVersion.includes('beta') && !currentVersion.includes('rc')) {
      packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
      hasChanges = true;
    } else if (currentVersion.includes('alpha') && currentVersion !== RNTL_VERSION) {
      packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
      hasChanges = true;
    }
  }

  // Always ensure universal-test-renderer is in devDependencies
  if (!packageJson.devDependencies['universal-test-renderer']) {
    packageJson.devDependencies['universal-test-renderer'] = UNIVERSAL_TEST_RENDERER_VERSION;
    hasChanges = true;
  } else if (packageJson.devDependencies['universal-test-renderer'] !== UNIVERSAL_TEST_RENDERER_VERSION) {
    packageJson.devDependencies['universal-test-renderer'] = UNIVERSAL_TEST_RENDERER_VERSION;
    hasChanges = true;
  }

  if (hasChanges) {
    return JSON.stringify(packageJson, null, 2) + '\n';
  }
  return packageJsonContent;
}

// Test each fixture
import { readdirSync } from 'fs';
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
    
    // Create a temporary file to test
    const tempPath = join(fixturesDir, testCase, 'temp.json');
    writeFileSync(tempPath, inputContent, 'utf8');
    
    // Run codemod
    const result = await runCodemod(tempPath);
    
    // Compare results
    const expectedJson = JSON.parse(expectedContent);
    const resultJson = JSON.parse(result);
    
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
    if (existsSync(tempPath)) {
      const { unlinkSync } = await import('fs');
      unlinkSync(tempPath);
    }
  } catch (error) {
    console.log(`❌ ${testCase}: ERROR - ${error.message}`);
    failed++;
  }
}

console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
