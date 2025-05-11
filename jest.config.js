module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  testEnvironment: "jsdom", // This causes setImmediate to be undefined.
  testPathIgnorePatterns: ['build/', 'examples/', 'experiments-app/', 'timer-utils'],
  testTimeout: 60000,
  transformIgnorePatterns: ['/node_modules/(?!(@react-native|react-native)/).*/'],
  snapshotSerializers: ['@relmify/jest-serializer-strip-ansi/always'],
  clearMocks: true,
};
