import React from 'react';

function isReactMinorOrNewer(targetMinor: number): boolean {
  const match = /^(\d+)\.(\d+)/.exec(React.version);

  if (!match) {
    return false;
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);

  if (major !== 19) {
    return major > 19;
  }

  return minor >= targetMinor;
}

export const testGateReact19_2 = isReactMinorOrNewer(2) ? test : test.skip;
export const testGateReact19_3 = isReactMinorOrNewer(3) ? test : test.skip;
