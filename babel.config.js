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
  env: {
    test: {
      presets: ['@react-native/babel-preset'],
    },
  },
};
