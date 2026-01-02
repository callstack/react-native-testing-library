function ensurePeerDeps() {
  // TEMP
  //const reactVersion = getPackageVersion('react');
  // ensurePackage('universal-test-renderer', reactVersion);
}

function ensurePackage(name: string, expectedVersion: string) {
  const actualVersion = getPackageVersion(name);
  if (!actualVersion) {
    const error = new Error(
      `Missing dev dependency "${name}@${expectedVersion}".\n\nFix it by running:\nnpm install -D ${name}@${expectedVersion}`,
    );
    Error.captureStackTrace(error, ensurePeerDeps);
    throw error;
  }

  if (expectedVersion !== actualVersion) {
    const error = new Error(
      `Incorrect version of "${name}" detected. Expected "${expectedVersion}", but found "${actualVersion}".\n\nFix it by running:\nnpm install -D ${name}@${expectedVersion}`,
    );
    Error.captureStackTrace(error, ensurePeerDeps);
    throw error;
  }
}

function getPackageVersion(name: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const packageJson = require(`${name}/package.json`);
    return packageJson.version;
  } catch {
    return null;
  }
}

if (!process.env.RNTL_SKIP_DEPS_CHECK) {
  ensurePeerDeps();
}
