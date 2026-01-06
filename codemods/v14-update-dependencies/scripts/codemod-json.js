#!/usr/bin/env node

/**
 * Codemod to update package.json dependencies for RNTL v14 migration:
 * - Removes @types/react-test-renderer
 * - Removes react-test-renderer
 * - Moves @testing-library/react-native from dependencies to devDependencies if present
 * - Adds/updates @testing-library/react-native to ^14.0.0-alpha in devDependencies
 * - Adds/updates universal-test-renderer@0.10.1 to devDependencies
 * 
 * Only processes package.json files that already contain RNTL or UTR.
 */

// Version constants - adjust these to update versions
const RNTL_VERSION = '^14.0.0-alpha';
const UNIVERSAL_TEST_RENDERER_VERSION = '0.10.1';

// This will be called by the codemod platform for each file
async function transform(root) {
  const filename = root.filename();
  
  // Only process package.json files
  if (!filename.endsWith('package.json')) {
    return null;
  }

  try {
    // Read the file content
    const content = root.root().text();
    const packageJson = JSON.parse(content);

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

    // Check if RNTL or UTR already exists in the package.json
    // Only proceed if at least one of them is present
    const hasRNTL =
      (packageJson.dependencies && packageJson.dependencies['@testing-library/react-native']) ||
      (packageJson.devDependencies && packageJson.devDependencies['@testing-library/react-native']) ||
      (packageJson.peerDependencies && packageJson.peerDependencies['@testing-library/react-native']);
    
    const hasUTR =
      (packageJson.dependencies && packageJson.dependencies['universal-test-renderer']) ||
      (packageJson.devDependencies && packageJson.devDependencies['universal-test-renderer']) ||
      (packageJson.peerDependencies && packageJson.peerDependencies['universal-test-renderer']);

    // Skip this file if neither RNTL nor UTR is present
    if (!hasRNTL && !hasUTR) {
      return null; // No changes - skip this file
    }

    // Remove @types/react-test-renderer
    removePackage('@types/react-test-renderer', packageJson);

    // Remove react-test-renderer
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

    // Return the updated content if there were changes
    if (hasChanges) {
      return JSON.stringify(packageJson, null, 2) + '\n';
    }

    return null; // No changes
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

export default transform;
