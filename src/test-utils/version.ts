export interface Version {
  version: string;
  major: number;
  minor: number;
  patch: number;
}

export function getReactNativeVersion(): Version {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const version = require('react-native/package.json').version;
  const [major, minor, patch] = version.split('.');
  return {
    version,
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
  };
}
