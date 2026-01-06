#!/usr/bin/env node

const RNTL_VERSION = '^14.0.0-alpha';
const UNIVERSAL_TEST_RENDERER_VERSION = '0.10.1';

function isPackageJsonFile(filename) {
  return filename.endsWith('package.json');
}

function hasRNTLOrUTR(packageJson) {
  const hasRNTL =
    packageJson.dependencies?.['@testing-library/react-native'] ||
    packageJson.devDependencies?.['@testing-library/react-native'] ||
    packageJson.peerDependencies?.['@testing-library/react-native'];

  const hasUTR =
    packageJson.dependencies?.['universal-test-renderer'] ||
    packageJson.devDependencies?.['universal-test-renderer'] ||
    packageJson.peerDependencies?.['universal-test-renderer'];

  return hasRNTL || hasUTR;
}

function removePackageFromAllDependencyTypes(pkgName, packageJson) {
  let removed = false;
  ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach((depType) => {
    if (packageJson[depType]?.[pkgName]) {
      delete packageJson[depType][pkgName];
      removed = true;
      if (Object.keys(packageJson[depType]).length === 0) {
        delete packageJson[depType];
      }
    }
  });
  return removed;
}

function removeEmptyDependencyObject(packageJson, depType) {
  if (packageJson[depType] && !Object.keys(packageJson[depType]).length) {
    delete packageJson[depType];
  }
}

function ensureDevDependenciesObjectExists(packageJson) {
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
    return true;
  }
  return false;
}

function removeObsoletePackages(packageJson) {
  const removedTypes = removePackageFromAllDependencyTypes('@types/react-test-renderer', packageJson);
  const removedRenderer = removePackageFromAllDependencyTypes('react-test-renderer', packageJson);
  return removedTypes || removedRenderer;
}

function moveRNTLFromDependenciesToDevDependencies(packageJson) {
  const rntlInDeps = packageJson.dependencies?.['@testing-library/react-native'];
  if (rntlInDeps) {
    const version = packageJson.dependencies['@testing-library/react-native'];
    delete packageJson.dependencies['@testing-library/react-native'];
    removeEmptyDependencyObject(packageJson, 'dependencies');
    packageJson.devDependencies['@testing-library/react-native'] = version;
    return true;
  }
  return false;
}

function isPreReleaseVersion(version) {
  return version.includes('alpha') || version.includes('beta') || version.includes('rc');
}

function updateRNTLVersionInDevDependencies(packageJson) {
  if (!packageJson.devDependencies?.['@testing-library/react-native']) {
    packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
    return true;
  }

  const currentVersion = packageJson.devDependencies['@testing-library/react-native'];
  if (!isPreReleaseVersion(currentVersion)) {
    packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
    return true;
  }

  if (currentVersion.includes('alpha') && currentVersion !== RNTL_VERSION) {
    packageJson.devDependencies['@testing-library/react-native'] = RNTL_VERSION;
    return true;
  }

  return false;
}

function updateUTRVersionInDevDependencies(packageJson) {
  if (!packageJson.devDependencies?.['universal-test-renderer']) {
    packageJson.devDependencies['universal-test-renderer'] = UNIVERSAL_TEST_RENDERER_VERSION;
    return true;
  }

  if (packageJson.devDependencies['universal-test-renderer'] !== UNIVERSAL_TEST_RENDERER_VERSION) {
    packageJson.devDependencies['universal-test-renderer'] = UNIVERSAL_TEST_RENDERER_VERSION;
    return true;
  }

  return false;
}

async function transform(root) {
  const filename = root.filename();

  if (!isPackageJsonFile(filename)) {
    return null;
  }

  try {
    const content = root.root().text();
    const packageJson = JSON.parse(content);

    if (!hasRNTLOrUTR(packageJson)) {
      return null;
    }

    let hasChanges = false;

    if (removeObsoletePackages(packageJson)) {
      hasChanges = true;
    }

    if (ensureDevDependenciesObjectExists(packageJson)) {
      hasChanges = true;
    }

    if (moveRNTLFromDependenciesToDevDependencies(packageJson)) {
      hasChanges = true;
    }

    if (updateRNTLVersionInDevDependencies(packageJson)) {
      hasChanges = true;
    }

    if (updateUTRVersionInDevDependencies(packageJson)) {
      hasChanges = true;
    }

    if (hasChanges) {
      return JSON.stringify(packageJson, null, 2) + '\n';
    }

    return null;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

export default transform;
