# `screen` object

```ts
let screen: {
  ...queries;
  rerender(element: React.Element<unknown>): Promise<void>;
  unmount(): Promise<void>;
  debug(options?: DebugOptions): void
  toJSON(): JsonElement | null;
  container: HostElement;
  root: HostElement | null;
};
```

The `screen` object provides access to queries and utilities for the currently rendered UI.

This object is assigned after the `render` call and cleared after each test by calling [`cleanup`](/react-native-testing-library/14.x/docs/api/misc/other.md#cleanup). If no `render` call has been made in a given test, then it holds a special object and throws a helpful error on each property and method access.

### `...queries`

The main feature of `screen` is its queries for finding elements in the view hierarchy.

See [Queries](/react-native-testing-library/14.x/docs/api/queries.md) for a complete list.

#### Example

```jsx
import { render, screen } from '@testing-library/react-native';

test('example', async () => {
  await render(<MyComponent />);
  const buttonStart = screen.getByRole('button', { name: 'start' });
});
```

### `rerender`

```ts
function rerender(element: React.Element<unknown>): Promise<void>;
```

Re-render the in-memory tree with a new root element. This simulates a React update render at the root. If the new element has the same type (and `key`) as the previous element, the tree will be updated; otherwise, it will re-mount a new tree, in both cases triggering the appropriate lifecycle events.

This method is async and uses async `act` internally to execute all pending React updates during updating. This works with async React features like `Suspense` boundaries and the `use()` hook.

```jsx
import { render, screen } from '@testing-library/react-native';

test('async rerender test', async () => {
  await render(<MyComponent initialData="first" />);

  await screen.rerender(<MyComponent initialData="updated" />);
  expect(screen.getByText('updated')).toBeOnTheScreen();
});
```

### `unmount`

```ts
function unmount(): Promise<void>;
```

Unmount the in-memory tree, triggering the appropriate lifecycle events.

This method is async and uses async `act` internally to execute all pending React updates during unmounting. This works with async React features like `Suspense` boundaries and the `use()` hook.

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
await render(<Component />);
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
await render(<View style={{ backgroundColor: 'red' }} />);
screen.debug({ mapProps: ({ style, ...props }) => ({ props }) });
```

This will log the rendered JSX without the `style` props.

The `children` prop cannot be filtered out so the following will print all rendered components with all props but `children` filtered out.

This option can be used to target specific props when debugging a query (for instance, keeping only the `children` prop when debugging a `getByText` query).

You can also transform prop values so that they are more readable (e.g., flatten styles).

```ts
import { StyleSheet } from 'react-native';

screen.debug({
  mapProps: ({ style, ...props }) => ({ style: StyleSheet.flatten(style), ...props }),
});
```

Or remove props that have little value when debugging tests, e.g. path prop for svgs

```ts
screen.debug({ mapProps: ({ path, ...props }) => ({ ...props }) });
```

### `toJSON`

```ts
function toJSON(): JsonElement | null;
```

Get the rendered component JSON representation, e.g. for snapshot testing.

### `container`

```ts
const container: HostElement;
```

Returns a pseudo-element container whose children are the elements you asked to render. This is the root container element from [Test Renderer](https://github.com/mdjastrzebski/test-renderer).

The `container` provides access to the entire rendered tree. Use it to query or manipulate the rendered output, similar to how `container` works in [React Testing Library](https://testing-library.com/docs/react-testing-library/other#container-1).

```jsx
import { render, screen } from '@testing-library/react-native';

test('example', async () => {
  await render(<MyComponent />);
  // container contains the entire rendered tree
  const container = screen.container;
  expect(container).toBeTruthy();
});
```

### `root`

```ts
const root: HostElement | null;
```

Returns the rendered root [host element](/react-native-testing-library/14.x/docs/advanced/testing-env.md#host-and-composite-components), or `null` if nothing was rendered. This is the first child of the `container`, which represents the actual root element you rendered.

This API is useful for component tests where you need to access the root host view without using `*ByTestId` queries or similar methods.

:::note

In rare cases where your root element is a `React.Fragment` with multiple children, the `container` will have more than one child, and `root` will return only the first one. In such cases, use `container.children` to access all rendered elements.

:::

```jsx
import { render, screen } from '@testing-library/react-native';

test('example', async () => {
  await render(
    <View testID="root-view">
      <Text>Hello</Text>
    </View>
  );
  // root is the View element you rendered
  expect(screen.root.props.testID).toBe('root-view');
});
```
