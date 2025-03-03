/* eslint-disable @typescript-eslint/no-require-imports */

// Mock the require calls
jest.mock('react/package.json', () => ({ version: '19.0.0' }));
jest.mock('react-test-renderer/package.json', () => ({ version: '19.0.0' }));

describe('ensurePeerDeps', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.RNTL_SKIP_DEPS_CHECK;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should not throw when versions match', () => {
    expect(() => require('../ensure-peer-deps')).not.toThrow();
  });

  it('should throw when react-test-renderer is missing', () => {
    jest.mock('react-test-renderer/package.json', () => {
      throw new Error('Module not found');
    });

    expect(() => require('../ensure-peer-deps')).toThrow(
      'Missing dev dependency "react-test-renderer@19.0.0"',
    );
  });

  it('should throw when react-test-renderer version mismatches', () => {
    jest.mock('react-test-renderer/package.json', () => ({ version: '18.2.0' }));

    expect(() => require('../ensure-peer-deps')).toThrow(
      'Incorrect version of "react-test-renderer" detected. Expected "19.0.0", but found "18.2.0"',
    );
  });

  it('should skip dependency check when RNTL_SKIP_DEPS_CHECK is set', () => {
    process.env.RNTL_SKIP_DEPS_CHECK = '1';
    jest.mock('react-test-renderer/package.json', () => {
      throw new Error('Module not found');
    });

    expect(() => require('../ensure-peer-deps')).not.toThrow();
  });
});
