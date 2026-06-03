module.exports = {
  preset: '@react-native/jest-preset',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: ['node_modules/(?!(jest-)?react-native|@react-native(-community)?)'],
  setupFilesAfterEnv: ['./jest-setup.ts'],
};
