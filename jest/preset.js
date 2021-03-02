const reactNativePreset = require('react-native/jest-preset');

module.exports = {
  ...reactNativePreset,
  // this is needed to make modern fake timers work
  // because the react-native preset overrides global.Promise
  setupFiles: [require.resolve('./save-promise.js')]
    .concat(reactNativePreset.setupFiles)
    .concat([require.resolve('./restore-promise.js')]),
};
