#!/usr/bin/env node

/**
 * Codemod to update package.json dependencies for RNTL v14 migration:
 * - Removes @types/react-test-renderer
 * - Removes react-test-renderer
 * - Adds universal-test-renderer
 * - Updates @testing-library/react-native to latest alpha version
 */

import { readFileSync, writeFileSync } from 'fs';

// Version constants - adjust these to update versions
const RNTL_VERSION = '^14.0.0-alpha';
const UNIVERSAL_TEST_RENDERER_VERSION = '0.10.1';

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: No file path provided');
  process.exit(1);
}

try {
  // Read package.json
  const packageJsonContent = readFileSync(filePath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  let hasChanges = false;

  // Function to remove a package from dependencies, devDependencies, or peerDependencies
  const removePackage = (pkgName, pkgJson) => {
    let removed = false;
    ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach((depType) => {
      if (pkgJson[depType] && pkgJson[depType][pkgName]) {
        delete pkgJson[depType][pkgName];
        removed = true;
        hasChanges = true;
        // Remove the entire depType object if it's empty
        if (Object.keys(pkgJson[depType]).length === 0) {
          delete pkgJson[depType];
        }
      }
    });
    return removed;
  };

  // Function to add or update a package in dependencies or devDependencies
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

  // Remove @types/react-test-renderer
  if (removePackage('@types/react-test-renderer', packageJson)) {
    console.log(`Removed @types/react-test-renderer from ${filePath}`);
  }

  // Remove react-test-renderer
  if (removePackage('react-test-renderer', packageJson)) {
    console.log(`Removed react-test-renderer from ${filePath}`);
  }

  // Ensure devDependencies exists
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
    hasChanges = true;
  }

  // Handle @testing-library/react-native
  const rntlInDeps = packageJson.dependencies && packageJson.dependencies['@testing-library/react-native'];
  const rntlInDevDeps = packageJson.devDependencies['@testing-library/react-native'];
  const rntlVersion = rntlInDeps || rntlInDevDeps;

  // If RNTL is in dependencies, move it to devDependencies
  if (rntlInDeps) {
    const version = packageJson.dependencies['@testing-library/react-native'];
    delete packageJson.dependencies['@testing-library/react-native'];
    if (Object.keys(packageJson.dependencies).length === 0) {
      delete packageJson.dependencies;
    }
    packageJson.devDependencies['@testing-library/react-native'] = version;
    hasChanges = true;
    console.log(`Moved @testing-library/react-native from dependencies to devDependencies in ${filePath}`);
  }

  // Always ensure @testing-library/react-native is in devDependencies
  if (!packageJson.devDependencies['@testing-library/react-native']) {
    // Add if not present
    packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
    hasChanges = true;
    console.log(`Added @testing-library/react-native@${RNTL_VERSION} to devDependencies in ${filePath}`);
  } else {
    // Update existing version to alpha if needed
    const currentVersion = packageJson.devDependencies['@testing-library/react-native'];
    if (!currentVersion.includes('alpha') && !currentVersion.includes('beta') && !currentVersion.includes('rc')) {
      packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
      hasChanges = true;
      console.log(`Updated @testing-library/react-native to ${RNTL_VERSION} in ${filePath}`);
    } else if (currentVersion.includes('alpha') && currentVersion !== RNTL_VERSION) {
      // Normalize alpha versions to the range
      packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
      hasChanges = true;
      console.log(`Updated @testing-library/react-native to ${RNTL_VERSION} in ${filePath}`);
    }
  }

  // Always ensure universal-test-renderer is in devDependencies
  if (!packageJson.devDependencies['universal-test-renderer']) {
    packageJson.devDependencies['universal-test-renderer'] = UNIVERSAL_TEST_RENDERER_VERSION;
    hasChanges = true;
    console.log(`Added universal-test-renderer@${UNIVERSAL_TEST_RENDERER_VERSION} to devDependencies in ${filePath}`);
  } else if (packageJson.devDependencies['universal-test-renderer'] !== UNIVERSAL_TEST_RENDERER_VERSION) {
    packageJson.devDependencies['universal-test-renderer'] = UNIVERSAL_TEST_RENDERER_VERSION;
    hasChanges = true;
    console.log(`Updated universal-test-renderer to ${UNIVERSAL_TEST_RENDERER_VERSION} in ${filePath}`);
  }

  // Write back the updated package.json if there were changes
  if (hasChanges) {
    const updatedContent = JSON.stringify(packageJson, null, 2) + '\n';
    writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes needed for ${filePath}`);
  }
} catch (error) {
  console.error(`Error processing ${filePath}:`, error.message);
  process.exit(1);
}
