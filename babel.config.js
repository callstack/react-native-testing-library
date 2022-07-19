module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14',
        },
        bugfixes: true,
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
  env: {
    test: {
      // https://github.com/react-native-community/upgrade-support/issues/152
      plugins: ['@babel/plugin-transform-flow-strip-types'],
    },
  },
};
