# `screen` object

```ts
let screen: {
  ...queries;
  rerender(element: React.Element<unknown>): void;
  unmount(): void;
  debug(options?: DebugOptions): void
  toJSON(): ReactTestRendererJSON | null;
  root: ReactTestInstance;
  UNSAFE_root: ReactTestInstance;
};
```

The `screen` object offers a recommended way to access queries and utilities for the currently rendered UI.

This object is assigned after the `render` call and cleared after each test by calling [`cleanup`](/react-native-testing-library/12.x/docs/api/misc/other.md#cleanup). If no `render` call has been made in a given test, then it holds a special object and throws a helpful error on each property and method access.

### `...queries`

The most important feature of `screen` is providing a set of helpful queries that allow you to find certain elements in the view hierarchy.

See [Queries](/react-native-testing-library/12.x/docs/api/queries.md) for a complete list.

#### Example

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const buttonStart = screen.getByRole('button', { name: 'start' });
```

### `rerender`

_Also available under `update` alias_

```ts
function rerender(element: React.Element<unknown>): void;
```

Re-render the in-memory tree with a new root element. This simulates a React update render at the root. If the new element has the same type (and `key`) as the previous element, the tree will be updated; otherwise, it will re-mount a new tree, in both cases triggering the appropriate lifecycle events.

### `unmount`

```ts
function unmount(): void;
```

Unmount the in-memory tree, triggering the appropriate lifecycle events.

:::note
Usually you should not need to call `unmount` as it is done automatically if your test runner supports `afterEach` hook (like Jest, mocha, Jasmine).
:::

### `debug`

```ts
function debug(options?: { message?: string; mapProps?: MapPropsFunction }): void;
```

Pretty prints deeply rendered component passed to `render`.

#### `message` option \{#debug-message-option}

You can provide a message that will be printed on top.

```jsx
render(<Component />);
screen.debug({ message: 'optional message' });
```

logs optional message and colored JSX:

```jsx
optional message

<View
  onPress={[Function bound fn]}
>
  <Text>Press me</Text>
</View>
```

#### `mapProps` option \{#debug-map-props-option}

```ts
function debug({ mapProps: (props) => ({}) });
```

You can use the `mapProps` option to transform the props that will be printed :

```jsx
render(<View style={{ backgroundColor: 'red' }} />);
screen.debug({ mapProps: ({ style, ...props }) => ({ props }) });
```

This will log the rendered JSX without the `style` props.

The `children` prop cannot be filtered out so the following will print all rendered components with all props but `children` filtered out.

This option can be used to target specific props when debugging a query (for instance, keeping only the `children` prop when debugging a `getByText` query).

You can also transform prop values so that they are more readable (e.g., flatten styles).

```ts
import { StyleSheet } from 'react-native';

screen.debug({ mapProps : {({ style, ...props })} => ({ style : StyleSheet.flatten(style), ...props }) });
```

Or remove props that have little value when debugging tests, e.g. path prop for svgs

```ts
screen.debug({ mapProps: ({ path, ...props }) => ({ ...props }) });
```

### `toJSON`

```ts
function toJSON(): ReactTestRendererJSON | null;
```

Get the rendered component JSON representation, e.g. for snapshot testing.

### `root`

```ts
const root: ReactTestInstance;
```

Returns the rendered root [host element](/react-native-testing-library/12.x/docs/advanced/testing-env.md#host-and-composite-components).

This API is primarily useful for component tests, as it allows you to access root host view without using `*ByTestId` queries or similar methods.

### `UNSAFE_root`

:::caution
This API typically will return a composite view, which goes against recommended testing practices. This API is primarily available for legacy test suites that rely on such testing.
:::

```ts
const UNSAFE_root: ReactTestInstance;
```

Returns the rendered [composite root element](/react-native-testing-library/12.x/docs/advanced/testing-env.md#host-and-composite-components).

:::note
This API has been previously named `container` for compatibility with [React Testing Library](https://testing-library.com/docs/react-testing-library/other#container-1). However, despite the same name, the actual behavior has been significantly different; hence, we decided to change the name to `UNSAFE_root`.
:::
