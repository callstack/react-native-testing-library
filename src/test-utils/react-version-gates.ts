import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const testRendererVersion = require('test-renderer/package.json').version;

function isVersionAtLeast(
  versionString: string,
  targetMajor: number,
  targetMinor: number,
  targetPatch: number,
): boolean {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(versionString);

  if (!match) {
    return false;
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);

  if (major !== targetMajor) {
    return major > targetMajor;
  }

  if (minor !== targetMinor) {
    return minor > targetMinor;
  }

  return patch >= targetPatch;
}

export const testGateReact19_2 =
  isVersionAtLeast(React.version, 19, 2, 0) && isVersionAtLeast(testRendererVersion, 1, 2, 0)
    ? test
    : test.skip;
