const baseProject = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  testPathIgnorePatterns: ['dist/', 'examples/', 'experiments-app/', 'codemods/', 'refs/'],
  modulePathIgnorePatterns: ['<rootDir>/refs/'],
  testTimeout: 60000,
  transformIgnorePatterns: ['/node_modules/(?!(@react-native|react-native)/).*/'],
  snapshotSerializers: [
    '@relmify/jest-serializer-strip-ansi/always',
    './src/test-utils/event-serializer.ts',
  ],
  clearMocks: true,
};

module.exports = {
  testTimeout: 60000,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.js',
    '!src/test-utils/**', // Exclude setup files
  ],
  projects: [
    { ...baseProject, displayName: 'legacy' },
    // `userEvent` tests again with `configure({ eventSystem: 'modern' })`. They share snapshots with
    // the legacy run, so both event systems must call the same handlers with the same native events.
    {
      ...baseProject,
      displayName: 'modern',
      roots: ['<rootDir>/src/user-event'],
      setupFilesAfterEnv: [...baseProject.setupFilesAfterEnv, './jest-setup-modern.ts'],
    },
  ],
};
