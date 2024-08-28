module.exports = {
  preset: '@testing-library/react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./jest-setup.ts'],
  testMatch: ['**/*.test.{ts,tsx}'],
  reporters: [['jest-slow-test-reporter', { numTests: 8, warnOnSlowerThan: 300, color: true }]],
};
