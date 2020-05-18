---
id: api
title: API
---

This page gathers public API of `react-native-testing-library` along with usage examples.

## `render`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/render.test.js)

Defined as:

```jsx
function render(
  component: React.Element<any>,
  options?: {
    /* A React Component that renders `component` as children */
    wrapper?: React.ComponentType<any>,
    /* You won't often use this, but it's helpful when testing refs */
    createNodeMock: (element: React.Element<any>) => any,
  }
): RenderResult {}
```

Deeply renders given React element and returns helpers to query the output components structure.

```jsx
import { render } from 'react-native-testing-library';
import { QuestionsBoard } from '../QuestionsBoard';

test('should verify two questions', () => {
  const { queryAllByA11yRole } = render(<QuestionsBoard {...props} />);
  const allQuestions = queryAllByA11yRole('header');

  expect(allQuestions).toHaveLength(2);
});
```

> When using React context providers, like Redux Provider, you'll likely want to wrap rendered component with them. In such cases it's convenient to create your custom `render` method. [Follow this great guide on how to set this up](https://testing-library.com/docs/react-testing-library/setup#custom-render).

The `render` method returns a `RenderResult` object that has a few properties:

### `...queries`

The most important feature of `render` is providing a set of helpful queries that allow you to find certain elements in the view hierarchy.

See [Queries](./Queries.md) for a complete list.

#### Example

```jsx
import { render } from 'react-native-testing-library';

const { getByText, queryByA11yStates } = render(<Component />);
```

### `update`

_Also available under `rerender` alias_

```ts
update(element: React.Element<any>): void
rerender(element: React.Element<any>): void
```

Re-render the in-memory tree with a new root element. This simulates a React update at the root. If the new element has the same type and key as the previous element, the tree will be updated; otherwise, it will re-mount a new tree. This is useful when testing for `componentDidUpdate` behavior, by passing updated props to the component.

[Example code](https://github.com/callstack/react-native-testing-library/blob/f96d782d26dd4815dbfd01de6ef7a647efd1f693/src/__tests__/act.test.js#L31-L37)

### `unmount`

```ts
unmount(): void
```

Unmount the in-memory tree, triggering the appropriate lifecycle events

### `debug`

```ts
debug(message?: string): void
```

Prints deeply rendered component passed to `render` with optional message on top. Uses [debug.deep](#debug) under the hood, but it's easier to use.

```jsx
const { debug } = render(<Component />);

debug('optional message');
```

logs optional message and colored JSX:

```jsx
optional message

<TouchableOpacity
  activeOpacity={0.2}
  onPress={[Function bound fn]}
>
  <Text>Press me</Text>
</TouchableOpacity>
```

#### `debug.shallow`

Prints shallowly rendered component passed to `render` with optional message on top. Uses [debug.shallow](#debug) under the hood, but it's easier to use.

### `toJSON`

```ts
toJSON(): ReactTestRendererJSON | null
```

Get the rendered component JSON representation, e.g. for snapshot testing.

## `cleanup`

```ts
const cleanup: () => void;
```

Unmounts React trees that were mounted with `render`.

For example, if you're using the `jest` testing framework, then you would need to use the `afterEach` hook like so:

```jsx
import { cleanup, render } from 'react-native-testing-library';
import { View } from 'react-native';

afterEach(cleanup);

it('renders a view', () => {
  render(<View />);
  // ...
});
```

The `afterEach(cleanup)` call also works in `describe` blocks:

```jsx
describe('when logged in', () => {
  afterEach(cleanup);

  it('renders the user', () => {
    render(<SiteHeader />);
    // ...
  });
});
```

Failing to call `cleanup` when you've called `render` could result in a memory leak and tests which are not "idempotent" (which can lead to difficult to debug errors in your tests).

The alternative to `cleanup` is balancing every `render` with an `unmount` method call.

## `fireEvent`

```ts
fireEvent(element: ReactTestInstance, eventName: string, ...data: Array<any>): void
```

Fires native-like event with data.

Invokes a given event handler (whether native or custom) on the element, bubbling to the root of the rendered tree.

```jsx
import { render, fireEvent } from 'react-native-testing-library';

test('fire changeText event', () => {
  const onEventMock = jest.fn();
  const { getByPlaceholder } = render(
    // MyComponent renders TextInput which has a placeholder 'Enter details'
    // and with `onChangeText` bound to handleChangeText
    <MyComponent handleChangeText={onEventMock} />
  );

  fireEvent(getByPlaceholder('change'), 'onChangeText', 'ab');
  expect(onEventMock).toHaveBeenCalledWith('ab');
});
```

An example using `fireEvent` with native events that aren't already aliased by the `fireEvent` api.

```jsx
import { TextInput, View } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

const onBlurMock = jest.fn();

const { getByPlaceholder } = render(
  <View>
    <TextInput placeholder="my placeholder" onBlur={onBlurMock} />
  </View>
);

// you can omit the `on` prefix
fireEvent(getByPlaceholder('my placeholder'), 'blur');
```

## `fireEvent[eventName]`

```ts
fireEvent[eventName](element: ReactTestInstance, ...data: Array<any>): void
```

Convenience methods for common events like: `press`, `changeText`, `scroll`.

### `fireEvent.press: (element: ReactTestInstance) => void`

Invokes `press` event handler on the element or parent element in the tree.

```jsx
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

const onPressMock = jest.fn();

const { getByText } = render(
  <View>
    <TouchableOpacity onPress={onPressMock}>
      <Text>Press me</Text>
    </TouchableOpacity>
  </View>
);

fireEvent.press(getByText('Press me'));
expect(onPressMock).toHaveBeenCalled();
```

### `fireEvent.changeText: (element: ReactTestInstance, ...data: Array<any>) => void`

Invokes `changeText` event handler on the element or parent element in the tree.

```jsx
import { View, TextInput } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

const onChangeTextMock = jest.fn();
const CHANGE_TEXT = 'content';

const { getByPlaceholder } = render(
  <View>
    <TextInput placeholder="Enter data" onChangeText={onChangeTextMock} />
  </View>
);

fireEvent.changeText(getByPlaceholder('Enter data'), CHANGE_TEXT);
```

### `fireEvent.scroll: (element: ReactTestInstance, ...data: Array<any>) => void`

Invokes `scroll` event handler on the element or parent element in the tree.

#### On a `ScrollView`

```jsx
import { ScrollView, Text } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

const onScrollMock = jest.fn();
const eventData = {
  nativeEvent: {
    contentOffset: {
      y: 200,
    },
  },
};

const { getByText } = render(
  <ScrollView onScroll={onScrollMock}>
    <Text>XD</Text>
  </ScrollView>
);

fireEvent.scroll(getByText('scroll-view'), eventData);
```

#### On a `FlatList`

```jsx
import { FlatList, View } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

const onEndReached = jest.fn();
const { getByType } = render(
  <FlatList
    data={Array.from({ length: 10 }, (_, key) => ({ key: `${key}` }))}
    renderItem={() => <View style={{ height: 500, width: 100 }} />}
    onEndReached={onEndReached}
    onEndReachedThreshold={0.2}
  />
);
const eventData = {
  nativeEvent: {
    contentOffset: {
      y: 500,
    },
    contentSize: {
      // Dimensions of the scrollable content
      height: 500,
      width: 100,
    },
    layoutMeasurement: {
      // Dimensions of the device
      height: 100,
      width: 100,
    },
  },
};

fireEvent.scroll(getByType(ScrollView), eventData);
expect(onEndReached).toHaveBeenCalled();
```

## `waitFor`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/waitFor.test.js)

Defined as:

```jsx
function waitFor<T>(
  expectation: () => T,
  { timeout: number = 4500, interval: number = 50 }
): Promise<T> {}
```

Waits for non-deterministic periods of time until your element appears or times out. `waitFor` periodically calls `expectation` every `interval` milliseconds to determine whether the element appeared or not.

```jsx
import { render, waitFor } from 'react-testing-library';

test('waiting for an Banana to be ready', async () => {
  const { getByText } = render(<Banana />);

  await waitFor(() => getByText('Banana ready'));
});
```

If you're using Jest's [Timer Mocks](https://jestjs.io/docs/en/timer-mocks#docsNav), remember not to use `async/await` syntax as it will stall your tests.

## `within`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/within.test.js)

Defined as:

```jsx
function within(instance: ReactTestInstance): Queries
```

Perform [queries](./Queries.md) scoped to given element.

:::note
Please note that additional `render` specific operations like `update`, `unmount`, `debug`, `toJSON` are _not_ included.
:::

```jsx
const detailsScreen = within(getByA11yHint('Details Screen'));
expect(detailsScreen.getByText('Some Text')).toBeTruthy();
expect(detailsScreen.getByDisplayValue('Some Value')).toBeTruthy();
expect(detailsScreen.queryByA11yLabel('Some Label')).toBeTruthy();
await expect(detailsScreen.findByA11yHint('Some Label')).resolves.toBeTruthy();
```

Use cases for scoped queries include:

- queries scoped to a single item inside a FlatList containing many items
- queries scoped to a single screen in tests involving screen transitions (e.g. with react-navigation)

## `flushMicrotasksQueue`

Waits for microtasks queue to flush. Useful if you want to wait for some promises with `async/await`.

```jsx
import { flushMicrotasksQueue, render } from 'react-native-testing-library';

test('fetch data', async () => {
  const { getByText } = render(<FetchData />);
  getByText('fetch');
  await flushMicrotasksQueue();
  expect(getByText('fetch').props.title).toBe('loaded');
});
```

## `query` APIs

Each of the get APIs listed in the render section above have a complimentary query API. The get APIs will throw errors if a proper node cannot be found. This is normally the desired effect. However, if you want to make an assertion that an element is not present in the hierarchy, then you can use the query API instead:

```jsx
import { render } from 'react-native-testing-library';

const { queryByText } = render(<Form />);
const submitButton = queryByText('submit');
expect(submitButton).toBeNull(); // it doesn't exist
```

## `queryAll` APIs

Each of the query APIs have a corresponding queryAll version that always returns an Array of matching nodes. getAll is the same but throws when the array has a length of 0.

```jsx
import { render } from 'react-native-testing-library';

const { queryAllByText } = render(<Forms />);
const submitButtons = queryAllByText('submit');
expect(submitButtons).toHaveLength(3); // expect 3 elements
```

## `act`

Useful function to help testing components that use hooks API. By default any `render`, `update`, and `fireEvent` calls are wrapped by this function, so there is no need to wrap it manually. This method is re-exported from [`react-test-renderer`](https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestRenderer.js#L567]).
