import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'web-build/**', 'expo-env.d.ts'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  {
    files: ['basics-tutorial-react-strict-dom/**/*.ts', 'basics-tutorial-react-strict-dom/**/*.tsx'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
];
