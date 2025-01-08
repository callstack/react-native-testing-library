import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import callstackConfig from '@callstack/eslint-config/react-native.flat.js';

export default [
  {
    ignores: [
      'flow-typed/',
      'build/',
      'experiments-rtl/',
      'website/',
      'eslint.config.mjs',
      'jest-setup.ts',
    ],
  },
  ...callstackConfig,
  ...tseslint.configs.strict,
  {
    files: ['**/*.test.{ts,tsx}', 'src/test-utils/**'],
    rules: {
      'react-native/no-color-literals': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/no-raw-text': 'off',
      'react-native-a11y/has-valid-accessibility-descriptors': 'off',
      'react-native-a11y/has-valid-accessibility-ignores-invert-colors': 'off',
      'react-native-a11y/has-valid-accessibility-value': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
