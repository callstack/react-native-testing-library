# `render` API

## `render` function \{#render}

```jsx
function render(
  component: React.Element<any>,
  options?: RenderOptions
): RenderResult
```

The `render` function is the entry point for writing React Native Testing Library tests. It deeply renders the given React element and returns helpers to query the output components' structure.

```jsx
import { render, screen } from '@testing-library/react-native';

test('basic test', () => {
  render(<MyApp />);
  expect(screen.getAllByRole('button', { name: 'start' })).toBeOnTheScreen();
});
```

> When using React context providers, like Redux Provider, you'll likely want to wrap rendered component with them. In such cases, it's convenient to create your own custom `render` method. [Follow this great guide on how to set this up](https://testing-library.com/docs/react-testing-library/setup#custom-render).

### Options

The behavior of the `render` method can be customized by passing various options as a second argument of the `RenderOptions` type:

#### `wrapper`

```ts
wrapper?: React.ComponentType<any>,
```

This option allows you to wrap the tested component, passed as the first option to the `render()` function, in an additional wrapper component. This is useful for creating reusable custom render functions for common React Context providers.

#### `concurrentRoot` \{#concurrent-root}

Set to `false` to disable concurrent rendering.
Otherwise, `render` will default to using concurrent rendering used in the React Native New Architecture.

#### `createNodeMock` \{#create-node-mock}

```ts
createNodeMock?: (element: React.Element) => unknown,
```

This option allows you to pass `createNodeMock` option to `ReactTestRenderer.create()` method in order to allow for custom mock refs. You can learn more about this option from [React Test Renderer documentation](https://reactjs.org/docs/test-renderer.html#ideas).

#### `unstable_validateStringsRenderedWithinText`

```ts
unstable_validateStringsRenderedWithinText?: boolean;
```

:::note
This options is experimental, in some cases it might not work as intended, and its behavior might change without observing [SemVer](https://semver.org/) requirements for breaking changes.
:::

This **experimental** option allows you to replicate React Native behavior of throwing `Invariant Violation: Text strings must be rendered within a <Text> component` error when you try to render `string` value under components different than `<Text>`, e.g., under `<View>`.

React Test Renderer does not enforce this check; hence, by default, React Native Testing Library also does not check this. That might result in runtime errors when running your code on a device, while the code works without errors in tests.

### Result

The `render` function returns the same queries and utilities as the [`screen`](/react-native-testing-library/docs/api/screen.md) object. We recommend using the `screen` object for a more developer-friendly experience.

See [this article](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen) from Kent C. Dodds for more details.

## `renderAsync` function \{#render-async}

:::info RNTL minimal version

This API requires RNTL v13.3.0 or later.

:::

```tsx
async function renderAsync(
  component: React.Element<any>,
  options?: RenderAsyncOptions
): Promise<RenderAsyncResult>;
```

The `renderAsync` function is the async version of [`render`](#render) designed for working with React 19 and React Suspense. This function uses async `act` function internally to ensure all pending React updates are executed during rendering.

```jsx
import { renderAsync, screen } from '@testing-library/react-native';

test('async component test', async () => {
  await renderAsync(<MyAsyncApp />);
  expect(screen.getAllByRole('button', { name: 'start' })).toBeOnTheScreen();
});
```

### Options

`renderAsync` accepts the same options as `render`.

### Result

The `renderAsync` function returns a promise that resolves to the same queries and utilities as the [`screen`](/react-native-testing-library/docs/api/screen.md) object. Use the `screen` object for queries and the lifecycle methods from the render result when needed.

:::warning Async lifecycle methods

When using `renderAsync`, you have to use correspodning lifecycle methods: `rerenderAsync` and `unmountAsync` instead of their sync versions.

:::
