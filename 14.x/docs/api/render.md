# `render` API

## `render` function \{#render}

```ts
async function render<T>(
  element: React.ReactElement<T>,
  options?: RenderOptions
): Promise<RenderResult>;
```

The `render` function is the entry point for writing React Native Testing Library tests. It deeply renders the given React element and returns helpers to query the output. The function is async and uses async `act` internally, so all pending React updates run before it resolves. This works with async React features like `Suspense` boundaries and the `use()` hook.

```jsx
import { render, screen } from '@testing-library/react-native';

test('basic test', async () => {
  await render(<MyApp />);
  expect(screen.getAllByRole('button', { name: 'start' })).toBeOnTheScreen();
});
```

> When using React context providers like Redux Provider, you'll likely want to wrap the rendered component with them. In such cases, create your own custom `render` method. [Follow this guide on how to set it up](https://testing-library.com/docs/react-testing-library/setup#custom-render).

### Options

You can customize the `render` method by passing options as the second argument:

#### `wrapper`

```ts
wrapper?: React.ComponentType<any>,
```

Wraps the tested component in an additional wrapper component. Use this to create custom render functions for common React Context providers.

#### `createNodeMock` \{#create-node-mock}

```ts
createNodeMock?: (element: React.ReactElement) => object,
```

Passes `createNodeMock` to the renderer's `create()` method for custom mock refs. This option is passed through to [Test Renderer](https://github.com/mdjastrzebski/test-renderer).

:::note Text string validation

Test Renderer enforces React Native's requirement that text strings must be rendered within a `<Text>` component. If you render a `string` value under components other than `<Text>` (e.g., under `<View>`), it throws an `Invariant Violation: Text strings must be rendered within a <Text> component` error. This matches React Native's runtime behavior.

This validation is always enabled and cannot be disabled. Your tests will catch the same text rendering errors that would occur in production.

:::

### Result

The `render` function returns a promise that resolves to the same queries and utilities as the [`screen`](/react-native-testing-library/14.x/docs/api/screen.md) object. Use `screen` for queries and the lifecycle methods from the render result when needed.

See [this article](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen) from Kent C. Dodds for more details.

:::note Type information

Query results and element references use the `HostElement` type from [Test Renderer](https://github.com/mdjastrzebski/test-renderer). If you need to type element variables, import this type directly from `test-renderer`.

:::
