#!/usr/bin/env node

import type { Transform } from 'codemod:ast-grep';
import type JSONLang from 'codemod:ast-grep/langs/json';

const RNTL_VERSION = '^14.0.0-alpha.5';
const UNIVERSAL_TEST_RENDERER_VERSION = '0.10.1';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export default async function transform(
  root: Parameters<Transform<JSONLang>>[0],
): Promise<string | null> {
  const filename = root.filename();

  if (!isPackageJsonFile(filename)) {
    return null;
  }

  try {
    const content = root.root().text();
    const packageJson: PackageJson = JSON.parse(content);

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

    if (ensureRNTLInDevDependencies(packageJson)) {
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
    // Re-throw error to let the codemod platform handle it
    // This provides better error reporting than silently returning null
    throw new Error(
      `Error processing ${filename}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function isPackageJsonFile(filename: string): boolean {
  return filename.endsWith('package.json');
}

function hasRNTLOrUTR(packageJson: PackageJson): boolean {
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

function removePackageFromAllDependencyTypes(pkgName: string, packageJson: PackageJson): boolean {
  let removed = false;
  (
    ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const
  ).forEach((depType) => {
    if (packageJson[depType]?.[pkgName]) {
      delete packageJson[depType]![pkgName];
      removed = true;
      if (Object.keys(packageJson[depType]!).length === 0) {
        delete packageJson[depType];
      }
    }
  });
  return removed;
}

function removeEmptyDependencyObject(packageJson: PackageJson, depType: keyof PackageJson): void {
  const deps = packageJson[depType];
  if (deps && typeof deps === 'object' && !Array.isArray(deps) && !Object.keys(deps).length) {
    delete packageJson[depType];
  }
}

function ensureDevDependenciesObjectExists(packageJson: PackageJson): boolean {
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
    return true;
  }
  return false;
}

function removeObsoletePackages(packageJson: PackageJson): boolean {
  const removedTypes = removePackageFromAllDependencyTypes(
    '@types/react-test-renderer',
    packageJson,
  );
  const removedRenderer = removePackageFromAllDependencyTypes('react-test-renderer', packageJson);
  return removedTypes || removedRenderer;
}

function ensureRNTLInDevDependencies(packageJson: PackageJson): boolean {
  let hasChanges = false;
  const rntlInDeps = packageJson.dependencies?.['@testing-library/react-native'];

  if (rntlInDeps) {
    delete packageJson.dependencies!['@testing-library/react-native'];
    removeEmptyDependencyObject(packageJson, 'dependencies');
    hasChanges = true;
  }

  const currentVersion = packageJson.devDependencies?.['@testing-library/react-native'];
  if (currentVersion !== RNTL_VERSION) {
    packageJson.devDependencies!['@testing-library/react-native'] = RNTL_VERSION;
    hasChanges = true;
  }

  return hasChanges;
}

function updateUTRVersionInDevDependencies(packageJson: PackageJson): boolean {
  const currentVersion = packageJson.devDependencies?.['universal-test-renderer'];
  if (currentVersion !== UNIVERSAL_TEST_RENDERER_VERSION) {
    packageJson.devDependencies!['universal-test-renderer'] = UNIVERSAL_TEST_RENDERER_VERSION;
    return true;
  }
  return false;
}
