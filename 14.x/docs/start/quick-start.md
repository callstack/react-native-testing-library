# Quick Start

:::warning Alpha Version

This version is currently in alpha. APIs and behavior may change before the stable release. Please report any issues you encounter.

:::

## Installation

Open a Terminal in your project's folder and run:


```sh [npm]
npm install -D @testing-library/react-native@alpha
```

```sh [yarn]
yarn add -D @testing-library/react-native@alpha
```

```sh [pnpm]
pnpm add -D @testing-library/react-native@alpha
```

```sh [bun]
bun add -D @testing-library/react-native@alpha
```

This library has a peer dependency on [Test Renderer](https://github.com/mdjastrzebski/test-renderer). Make sure to install it:


```sh [npm]
npm install -D test-renderer
```

```sh [yarn]
yarn add -D test-renderer
```

```sh [pnpm]
pnpm add -D test-renderer
```

```sh [bun]
bun add -D test-renderer
```

Test Renderer has better compatibility with React 19 and improved type safety compared to the deprecated [React Test Renderer](https://reactjs.org/docs/test-renderer.html).

### Jest matchers

RNTL automatically extends Jest with React Native-specific matchers. The only thing you need to do is to import anything from `@testing-library/react-native` which you already need to do to access the `render` function.

### ESLint plugin

Set up [`eslint-plugin-testing-library`](https://github.com/testing-library/eslint-plugin-testing-library) to avoid common Testing Library mistakes and bad practices.

Install the plugin (assuming you already have `eslint` installed & configured):


```sh [npm]
npm install -D eslint-plugin-testing-library
```

```sh [yarn]
yarn add -D eslint-plugin-testing-library
```

```sh [pnpm]
pnpm add -D eslint-plugin-testing-library
```

```sh [bun]
bun add -D eslint-plugin-testing-library
```

Then, add this to your ESLint config (e.g., `.eslintrc.js`). Extend the `react` plugin:

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
