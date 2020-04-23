module.exports = {
  preset: 'react-native',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};
