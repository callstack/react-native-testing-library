import tseslint from 'typescript-eslint';
import callstackConfig from '@callstack/eslint-config/react-native.flat.js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jest from 'eslint-plugin-jest';

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
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000', '^react', '^@?\\w', '^'], ['^\\.']],
        },
      ],
    },
  },
  {
    rules: {
      'no-console': 'error',
      'import/order': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test-utils/**'],
    plugins: {
      jest: jest,
    },
    rules: {
      'react/no-multi-comp': 'off',
      'react-native/no-color-literals': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/no-raw-text': 'off',
      'react-native-a11y/has-valid-accessibility-descriptors': 'off',
      'react-native-a11y/has-valid-accessibility-ignores-invert-colors': 'off',
      'react-native-a11y/has-valid-accessibility-value': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'jest/no-standalone-expect': [
        'error',
        { additionalTestBlockFunctions: ['testGateReact19'] },
      ],
    },
  },
];
