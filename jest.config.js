module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  testPathIgnorePatterns: ['build/', 'examples/', 'experiments-app/'],
  testTimeout: 60000,
  transformIgnorePatterns: [
    '/node_modules/(?!(@react-native|react-native|react-native-gesture-handler)/).*/',
  ],
  snapshotSerializers: ['@relmify/jest-serializer-strip-ansi/always'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.js',
    '!src/test-utils/**', // Exclude setup files
  ],
};
