# Quick Start

## Installation

Open a Terminal in your project's folder and run:


```sh [yarn]
yarn add -D @testing-library/react-native
```

```sh [npm]
npm install -D @testing-library/react-native
```

This library has a peer dependency for `react-test-renderer` package. Make sure that your `react-test-renderer` version matches exactly your `react` version.

### Jest matchers

RNTL v13 automatically extends Jest with React Native-specific matchers. The only thing you need to do is to import anything from `@testing-library/react-native` which you already need to do to access the `render` function.

### ESLint plugin

We recommend setting up [`eslint-plugin-testing-library`](https://github.com/testing-library/eslint-plugin-testing-library) package to help you avoid common Testing Library mistakes and bad practices.

Install the plugin (assuming you already have `eslint` installed & configured):


```sh [yarn]
yarn add -D eslint-plugin-testing-library
```

```sh [npm]
npm install -D eslint-plugin-testing-library
```

Then, add relevant entry to your ESLint config (e.g., `.eslintrc.js`). We recommend extending the `react` plugin:

```js title=.eslintrc.js
module.exports = {
  overrides: [
    {
      // Test files only
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
```
