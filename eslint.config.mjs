import tseslint from 'typescript-eslint';
import callstackConfig from '@callstack/eslint-config/react-native.flat.js';
import { fixupPluginRules } from '@eslint/compat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const patchedCallstackConfig = callstackConfig.map((configItem) => {
  if (!configItem.plugins?.react) {
    return configItem;
  }

  return {
    ...configItem,
    plugins: {
      ...configItem.plugins,
      react: fixupPluginRules(configItem.plugins.react),
    },
  };
});

export default [
  {
    ignores: ['build/', 'experiments-rtl/', 'website/', 'eslint.config.mjs', 'jest-setup.ts'],
  },
  ...patchedCallstackConfig,
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
    rules: {
      'react/no-multi-comp': 'off',
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
