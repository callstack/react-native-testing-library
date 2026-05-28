import { PackageManagerTabs } from '@rspress/core/theme';

# Quick Start

## Installation

Open a Terminal in your project's folder and run:

<PackageManagerTabs
command={{
    npm: 'npm install -D @testing-library/react-native',
    yarn: 'yarn add -D @testing-library/react-native',
    pnpm: 'pnpm add -D @testing-library/react-native',
    bun: 'bun add -D @testing-library/react-native',
  }}
/>

This library has a peer dependency on [Test Renderer](https://github.com/mdjastrzebski/test-renderer). Make sure to install it:

<PackageManagerTabs
command={{
    npm: 'npm install -D test-renderer',
    yarn: 'yarn add -D test-renderer',
    pnpm: 'pnpm add -D test-renderer',
    bun: 'bun add -D test-renderer',
  }}
/>

Test Renderer has better compatibility with React 19 and improved type safety compared to the deprecated [React Test Renderer](https://reactjs.org/docs/test-renderer.html).

## Agent docs in the package

RNTL ships package-specific documentation for coding agents in `node_modules/@testing-library/react-native/docs/`.
Add this snippet to your project's `AGENTS.md` or `CLAUDE.md` file so agents use the docs for the installed package version:

```md
# React Native Testing Library in this project

This project uses `@testing-library/react-native`. Its APIs and testing conventions can differ from your training data.
Before writing or changing RNTL tests, read the relevant guide in
`node_modules/@testing-library/react-native/docs/`, starting with
`node_modules/@testing-library/react-native/docs/guides/llm-guidelines.md`.
Prefer those package docs over stale assumptions, and follow deprecation notices.
```

### Jest matchers

RNTL automatically extends Jest with React Native-specific matchers. The only thing you need to do is to import anything from `@testing-library/react-native` which you already need to do to access the `render` function.

### ESLint plugin

Set up [`eslint-plugin-testing-library`](https://github.com/testing-library/eslint-plugin-testing-library) to avoid common Testing Library mistakes and bad practices.

Install the plugin (assuming you already have `eslint` installed & configured):

<PackageManagerTabs
command={{
    npm: 'npm install -D eslint-plugin-testing-library',
    yarn: 'yarn add -D eslint-plugin-testing-library',
    pnpm: 'pnpm add -D eslint-plugin-testing-library',
    bun: 'bun add -D eslint-plugin-testing-library',
  }}
/>

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
