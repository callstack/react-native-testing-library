import * as React from 'react';

export function checkReactVersionAtLeast(
  major: number,
  minor: number
): boolean {
  if (React.version === undefined) return false;
  const [actualMajor, actualMinor] = React.version.split('.').map(Number);

  return actualMajor > major || (actualMajor === major && actualMinor >= minor);
}
