module.exports = {
  presets: [
    '@babel/preset-flow',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
        bugfixes: true,
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
