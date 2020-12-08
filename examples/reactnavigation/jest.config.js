module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest-mocks.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)',
  ],
};
