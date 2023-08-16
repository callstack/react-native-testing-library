module.exports = {
  preset: './jest-preset',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  testPathIgnorePatterns: [
    'timerUtils',
    'examples/',
    'experiments-app/',
    'experiments-rtl/',
  ],
  testTimeout: 60000,
  transformIgnorePatterns: [
    '/node_modules/(?!(@react-native|react-native)/).*/',
  ],
  snapshotSerializers: ['@relmify/jest-serializer-strip-ansi/always'],
  clearMocks: true,
};
