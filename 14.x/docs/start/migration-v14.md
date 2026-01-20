# Migration to 14.x

:::warning Alpha Version

This version is currently in alpha. APIs and behavior may change before the stable release. Please report any issues you encounter.

:::

This guide describes the migration to React Native Testing Library version 14 from version 13.x.

## Overview

RNTL v14 drops support for React 18 and adopts React 19's async rendering model. Here's what changed:

- React 19.0.0+ and React Native 0.78+ are now required
- `render`, `renderHook`, `fireEvent`, and `act` are now async
- Switched from deprecated [React Test Renderer](https://reactjs.org/docs/test-renderer.html) to [Test Renderer](https://github.com/mdjastrzebski/test-renderer)
- Removed deprecated APIs: `update`, `getQueriesForElement`, `UNSAFE_root`, `concurrentRoot` option
- Reintroduced `container` API, which is now safe to use

:::info React 18 Users

If you need to support React 18, please continue using RNTL v13.x.

:::

## Quick Migration

We provide codemods to automate most of the migration:

**Step 1: Update dependencies**


```sh [npx]
npx codemod@latest rntl-v14-update-deps --target .
npm install
```

```sh [yarn]
yarn dlx codemod@latest rntl-v14-update-deps --target .
yarn install
```

```sh [pnpm]
pnpm dlx codemod@latest rntl-v14-update-deps --target .
pnpm install
```

```sh [bunx]
bunx codemod@latest rntl-v14-update-deps --target .
bun install
```

**Step 2: Update test code to async**


```sh [npx]
npx codemod@latest rntl-v14-async-functions --target ./src
```

```sh [yarn]
yarn dlx codemod@latest rntl-v14-async-functions --target ./src
```

```sh [pnpm]
pnpm dlx codemod@latest rntl-v14-async-functions --target ./src
```

```sh [bunx]
bunx codemod@latest rntl-v14-async-functions --target ./src
```

After running the codemods, review the changes and run your tests.

## Breaking Changes

### Supported React and React Native versions

**This version requires React 19+ and React Native 0.78+.** If you need to support React 18, please use the latest v13.x version.

| RNTL Version | React Version | React Native Version |
| ------------ | ------------- | -------------------- |
| v14.x        | >= 19.0.0     | >= 0.78              |
| v13.x        | >= 18.0.0     | >= 0.71              |

### Test Renderer replaces React Test Renderer

In v14, React Native Testing Library uses [Test Renderer](https://github.com/mdjastrzebski/test-renderer) instead of the deprecated [React Test Renderer](https://reactjs.org/docs/test-renderer.html). Test Renderer works with React 19 and has better TypeScript support.

**What changed:**

- The underlying renderer is now Test Renderer instead of React Test Renderer
- This is mostly an internal change; your tests should work without modifications in most cases
- Type definitions now use [`HostElement`](https://github.com/mdjastrzebski/test-renderer#hostelement) from Test Renderer instead of `ReactTestInstance`

**Migration:**

#### 1. Update dependencies

Run codemod for updating dependencies:


```sh [npx]
npx codemod@latest rntl-v14-update-deps
npm install
```

```sh [yarn]
yarn dlx codemod@latest rntl-v14-update-deps
yarn install
```

```sh [pnpm]
pnpm dlx codemod@latest rntl-v14-update-deps
pnpm install
```

```sh [bunx]
bunx codemod@latest rntl-v14-update-deps
bun install
```

##### Manual changes

Remove React Test Renderer and its type definitions from your dev dependencies, and add Test Renderer:


```sh [npm]
npm uninstall react-test-renderer @types/react-test-renderer
npm install -D test-renderer
```

```sh [yarn]
yarn remove react-test-renderer @types/react-test-renderer
yarn add -D test-renderer
```

```sh [pnpm]
pnpm remove react-test-renderer @types/react-test-renderer
pnpm add -D test-renderer
```

```sh [bun]
bun remove react-test-renderer @types/react-test-renderer
bun add -D test-renderer
```

#### 2. Update type imports (if needed)

If you were directly importing types from React Test Renderer, you may need to update your imports:

```ts
// Before (v13)
import type { ReactTestInstance } from 'react-test-renderer';

// After (v14)
import type { HostElement } from 'test-renderer';
```

**Note:** Most users won't need to update type imports, as React Native Testing Library now exports the necessary types directly.

See the [Test Renderer documentation](https://github.com/mdjastrzebski/test-renderer) for more.

### Async APIs by Default

With React 18 support dropped, RNTL v14 uses React 19's async rendering model. The following functions are now async by default:

- `render()` → returns `Promise<RenderResult>`
- `rerender()` and `unmount()` → return `Promise<void>`
- `renderHook()` → returns `Promise<RenderHookResult>`
- `fireEvent()` and helpers (`press`, `changeText`, `scroll`) → return `Promise<void>`
- `act()` → always returns `Promise<T>`

:::tip Already using async APIs?

If you adopted the async APIs introduced in RNTL v13.3 (`renderAsync`, `fireEventAsync`, `renderHookAsync`), rename them to their non-async counterparts (`render`, `fireEvent`, `renderHook`). The async versions have been removed since the standard APIs are now async by default.

:::

#### `render` is now async \{#render-async-default}

In v14, `render` is async by default and returns a Promise. This allows proper support for `Suspense` boundaries and the `use()` hook.

**Before (v13):**

```ts
import { render, screen } from '@testing-library/react-native';

it('should render component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

**After (v14):**

```ts
import { render, screen } from '@testing-library/react-native';

it('should render component', async () => {
  await render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

See the [`render` API documentation](/react-native-testing-library/14.x/docs/api/render.md).

#### `renderHook` is now async

In v14, `renderHook` is async by default and returns a Promise.

**Before (v13):**

```ts
import { renderHook } from '@testing-library/react-native';

it('should test hook', () => {
  const { result, rerender } = renderHook(() => useMyHook());

  rerender(newProps);
  unmount();
});
```

**After (v14):**

```ts
import { renderHook } from '@testing-library/react-native';

it('should test hook', async () => {
  const { result, rerender } = await renderHook(() => useMyHook());

  await rerender(newProps);
  await unmount();
});
```

See the [`renderHook` API documentation](/react-native-testing-library/14.x/docs/api/misc/render-hook.md).

#### `fireEvent` is now async

In v14, `fireEvent` and its helpers (`press`, `changeText`, `scroll`) are async by default and return a Promise.

**Before (v13):**

```ts
import { fireEvent, screen } from '@testing-library/react-native';

it('should press button', () => {
  render(<MyComponent />);
  fireEvent.press(screen.getByText('Press me'));
  expect(onPress).toHaveBeenCalled();
});
```

**After (v14):**

```ts
import { fireEvent, screen } from '@testing-library/react-native';

it('should press button', async () => {
  await render(<MyComponent />);
  await fireEvent.press(screen.getByText('Press me'));
  expect(onPress).toHaveBeenCalled();
});
```

#### `act` is now async

In v14, `act` is async by default and always returns a Promise. You should always `await` the result of `act()`.

**What changed:**

- `act` now always returns `Promise<T>` instead of `T | Thenable<T>`
- `act` should always be awaited

:::note

The transition to async `act` may prevent testing very short transient states, as awaiting `act` will flush all pending updates before returning.

:::

**Before (v13):**

```ts
import { act } from '@testing-library/react-native';

it('should update state', () => {
  act(() => {
    setState('new value');
  });
  expect(state).toBe('new value');
});
```

**After (v14):**

```ts
import { act } from '@testing-library/react-native';

it('should update state', async () => {
  await act(() => {
    setState('new value');
  });
  expect(state).toBe('new value');
});
```

**Note**: Even if your callback is synchronous, you should still use `await act(...)` as `act` now always returns a Promise.

See the [`act` API documentation](/react-native-testing-library/14.x/docs/api/misc/other.md#act).

#### Why async APIs?

The async APIs properly handle `Suspense` boundaries and the `use()` hook, and ensure all pending React updates complete before assertions run. This matches React 19's async rendering model.

### Removed APIs

#### `update` alias removed

The `update` alias for `rerender` has been removed. Use `rerender` instead:

```ts
// Before (v13)
screen.update(<MyComponent />);
const { update } = render(<MyComponent />);
update(<MyComponent newProp />);

// After (v14)
await screen.rerender(<MyComponent />);
const { rerender } = await render(<MyComponent />);
await rerender(<MyComponent newProp />);
```

#### `getQueriesForElement` export removed

The `getQueriesForElement` export alias for `within` has been removed. Use `within` instead:

```ts
// Before (v13)
import { getQueriesForElement } from '@testing-library/react-native';

const queries = getQueriesForElement(element);

// After (v14)
import { within } from '@testing-library/react-native';

const queries = within(element);
```

**Note:** `getQueriesForElement` was just an alias for `within`, so the functionality is identical - only the import needs to change.

#### `UNSAFE_root` removed

`UNSAFE_root` has been removed. Use `container` to access the pseudo-element container, or `root` to access the first rendered host element:

```ts
// Before (v13)
const unsafeRoot = screen.UNSAFE_root;

// After (v14)
const container = screen.container; // pseudo-element container
const root = screen.root; // first rendered host element
```

#### Legacy `UNSAFE_*` queries removed

The legacy `UNSAFE_getAllByType`, `UNSAFE_getByType`, `UNSAFE_getAllByProps`, and `UNSAFE_getByProps` queries have been removed. These queries could return composite (user-defined) components, which is no longer supported with [Test Renderer](https://github.com/mdjastrzebski/test-renderer) as it only renders host elements.

If you were using these legacy queries, you should refactor your tests to use the standard queries (`getByRole`, `getByText`, `getByTestId`, etc.) which target host elements.

```ts
// Before (v13)
const buttons = screen.UNSAFE_getAllByType(Button);
const input = screen.UNSAFE_getByProps({ placeholder: 'Enter text' });

// After (v14)
const buttons = screen.getAllByRole('button');
const input = screen.getByPlaceholderText('Enter text');
```

#### `concurrentRoot` option removed

The `concurrentRoot` option has been removed from both `render` options and `configure` function. In v14, concurrent rendering is always enabled, since it's the standard rendering mode for React 19 and React Native's New Architecture.

```ts
// Before (v13)
render(<MyComponent />, { concurrentRoot: true });  // Enable concurrent mode
render(<MyComponent />, { concurrentRoot: false }); // Disable concurrent mode
configure({ concurrentRoot: false });               // Disable globally

// After (v14)
await render(<MyComponent />); // Always uses concurrent rendering
```

**Migration:** Remove any `concurrentRoot` options from your `render` calls and `configure` function. If you were setting `concurrentRoot: true`, just remove the option. If you were setting `concurrentRoot: false` to disable concurrent rendering, this is no longer supported in v14.

### `container` API reintroduced

In v14, the `container` API has been reintroduced and is now safe to use. Previously, `container` was renamed to `UNSAFE_root` in v12 due to behavioral differences from React Testing Library's `container`. Now `container` returns a pseudo-element container whose children are the elements you rendered, consistent with React Testing Library's behavior.

**What changed:**

- `screen.container` is now available and safe to use
- `container` returns a pseudo-element container from Test Renderer
- The container's children are the elements you rendered
- `UNSAFE_root` has been removed

**Before (v13):**

```ts
import { render, screen } from '@testing-library/react-native';

it('should access root', () => {
  render(<MyComponent />);
  // UNSAFE_root was the only way to access the container
  const root = screen.UNSAFE_root;
});
```

**After (v14):**

```ts
import { render, screen } from '@testing-library/react-native';

it('should access container', async () => {
  await render(<MyComponent />);
  // container is now safe and available
  const container = screen.container;
  // root is the first child of container
  const root = screen.root;
});
```

See the [`screen` API documentation](/react-native-testing-library/14.x/docs/api/screen.md#container).

### Text string validation enforced by default

In v14, Test Renderer enforces React Native's requirement that text strings must be rendered within a `<Text>` component. The `unstable_validateStringsRenderedWithinText` option has been removed from `RenderOptions` since this validation is now always on.

**What changed:**

- Text string validation is now always enabled and cannot be disabled
- The `unstable_validateStringsRenderedWithinText` option has been removed
- Tests will now throw `Invariant Violation: Text strings must be rendered within a <Text> component` errors when attempting to render strings outside of `<Text>` components, matching React Native's runtime behavior

**Migration:**

If you were using `unstable_validateStringsRenderedWithinText: true` in your render options, you can simply remove this option as the validation is now always enabled:

```ts
// Before (v13)
render(<MyComponent />, {
  unstable_validateStringsRenderedWithinText: true,
});

// After (v14)
await render(<MyComponent />);
// Validation is now always enabled
```

If you were relying on the previous behavior where strings could be rendered outside of `<Text>` components, you'll need to fix your components to wrap strings in `<Text>` components, as this matches React Native's actual runtime behavior.

## Codemods

Two codemods are available to automate the migration. Both are safe to run multiple times - they only transform code that hasn't been migrated yet.

### `rntl-v14-update-deps`

Updates your `package.json`:

- Removes React Test Renderer (`react-test-renderer` and `@types/react-test-renderer`)
- Adds Test Renderer (`test-renderer`)
- Updates `@testing-library/react-native` to alpha version


```sh [npx]
npx codemod@latest rntl-v14-update-deps --target .
npm install
```

```sh [yarn]
yarn dlx codemod@latest rntl-v14-update-deps --target .
yarn install
```

```sh [pnpm]
pnpm dlx codemod@latest rntl-v14-update-deps --target .
pnpm install
```

```sh [bunx]
bunx codemod@latest rntl-v14-update-deps --target .
bun install
```

### `rntl-v14-async-functions`

Transforms test files:

- Adds `await` to `render()`, `act()`, `renderHook()`, `fireEvent()` calls
- Makes test functions async when needed
- Handles `screen.rerender()`, `screen.unmount()`, and renderer methods


```sh [npx]
npx codemod@latest rntl-v14-async-functions --target ./src
```

```sh [yarn]
yarn dlx codemod@latest rntl-v14-async-functions --target ./src
```

```sh [pnpm]
pnpm dlx codemod@latest rntl-v14-async-functions --target ./src
```

```sh [bunx]
bunx codemod@latest rntl-v14-async-functions --target ./src
```

#### Custom render functions

If you have custom render helpers (like `renderWithProviders`), you can specify them using the `customRenderFunctions` parameter. The codemod will then also transform calls to these functions:


```sh [npx]
npx codemod@latest rntl-v14-async-functions \
  --target ./src \
  --param customRenderFunctions="renderWithProviders,renderWithTheme"
```

```sh [yarn]
yarn dlx codemod@latest rntl-v14-async-functions \
  --target ./src \
  --param customRenderFunctions="renderWithProviders,renderWithTheme"
```

```sh [pnpm]
pnpm dlx codemod@latest rntl-v14-async-functions \
  --target ./src \
  --param customRenderFunctions="renderWithProviders,renderWithTheme"
```

```sh [bunx]
bunx codemod@latest rntl-v14-async-functions \
  --target ./src \
  --param customRenderFunctions="renderWithProviders,renderWithTheme"
```

This will add `await` to your custom render calls and make the containing test functions async, just like it does for the standard `render` function.

#### Limitations

- Helper functions defined in test files are not transformed by default
- Namespace imports (`import * as RNTL`) are not handled

## Full Changelog

[https://github.com/callstack/react-native-testing-library/compare/v13.3.3...v14.0.0](https://github.com/callstack/react-native-testing-library/compare/v13.3.3...v14.0.0)
