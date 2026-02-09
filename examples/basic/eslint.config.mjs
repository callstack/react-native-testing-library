import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules/**', 'jest-setup.ts'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    ...testingLibrary.configs['flat/react'],
  },
];
