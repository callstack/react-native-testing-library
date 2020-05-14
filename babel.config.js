module.exports = {
  presets: [
    '@babel/preset-flow',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8.3',
        },
        bugfixes: true,
      },
    ],
  ],
};
