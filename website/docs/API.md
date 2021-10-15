---
id: api
title: API
---

This page gathers public API of React Native Testing Library along with usage examples.

## `render`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/render.test.js)

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
import { render } from '@testing-library/react-native';
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
import { render } from '@testing-library/react-native';

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

Unmount the in-memory tree, triggering the appropriate lifecycle events.

:::note
Usually you should not need to call `unmount` as it is done automatically if your test runner supports `afterEach` hook (like Jest, mocha, Jasmine).
:::

### `debug`

```ts
debug(message?: string): void
```

Pretty prints deeply rendered component passed to `render` with optional message on top.

```jsx
const { debug } = render(<Component />);

debug('optional message');
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

#### `debug.shallow`

Pretty prints shallowly rendered component passed to `render` with optional message on top.

### `toJSON`

```ts
toJSON(): ReactTestRendererJSON | null
```

Get the rendered component JSON representation, e.g. for snapshot testing.

### `container`

```ts
container: ReactTestInstance;
```

A reference to the rendered root element.

## `cleanup`

```ts
const cleanup: () => void;
```

Unmounts React trees that were mounted with `render`.

:::info
Please note that this is done automatically if the testing framework you're using supports the `afterEach` global (like mocha, Jest, and Jasmine). If not, you will need to do manual cleanups after each test.
:::

For example, if you're using the `jest` testing framework, then you would need to use the `afterEach` hook like so:

```jsx
import { cleanup, render } from '@testing-library/react-native/pure';
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
import { render, fireEvent } from '@testing-library/react-native';

test('fire changeText event', () => {
  const onEventMock = jest.fn();
  const { getByPlaceholderText } = render(
    // MyComponent renders TextInput which has a placeholder 'Enter details'
    // and with `onChangeText` bound to handleChangeText
    <MyComponent handleChangeText={onEventMock} />
  );

  fireEvent(getByPlaceholderText('change'), 'onChangeText', 'ab');
  expect(onEventMock).toHaveBeenCalledWith('ab');
});
```

:::note
Please note that from version `7.0` `fireEvent` performs checks that should prevent events firing on disabled elements.
:::

An example using `fireEvent` with native events that aren't already aliased by the `fireEvent` api.

```jsx
import { TextInput, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

const onBlurMock = jest.fn();

const { getByPlaceholderText } = render(
  <View>
    <TextInput placeholder="my placeholder" onBlur={onBlurMock} />
  </View>
);

// you can omit the `on` prefix
fireEvent(getByPlaceholderText('my placeholder'), 'blur');
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
import { render, fireEvent } from '@testing-library/react-native';

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
import { render, fireEvent } from '@testing-library/react-native';

const onChangeTextMock = jest.fn();
const CHANGE_TEXT = 'content';

const { getByPlaceholderText } = render(
  <View>
    <TextInput placeholder="Enter data" onChangeText={onChangeTextMock} />
  </View>
);

fireEvent.changeText(getByPlaceholderText('Enter data'), CHANGE_TEXT);
```

### `fireEvent.scroll: (element: ReactTestInstance, ...data: Array<any>) => void`

Invokes `scroll` event handler on the element or parent element in the tree.

#### On a `ScrollView`

```jsx
import { ScrollView, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

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
import { render, fireEvent } from '@testing-library/react-native';

const onEndReached = jest.fn();
const { getByTestId } = render(
  <FlatList
    data={Array.from({ length: 10 }, (_, key) => ({ key: `${key}` }))}
    renderItem={() => <View style={{ height: 500, width: 100 }} />}
    onEndReached={onEndReached}
    onEndReachedThreshold={0.2}
    testID="flat-list"
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

fireEvent.scroll(getByTestId('flat-list'), eventData);
expect(onEndReached).toHaveBeenCalled();
```

:::note
If you're noticing that components are not being found on a list, even after mocking a scroll event, try changing the [`initialNumToRender`](https://reactnative.dev/docs/flatlist#initialnumtorender) that you have set. If you aren't comfortable changing the code to accept this prop from the unit test, try using an e2e test that might better suit what use case you're attempting to replicate.
:::

## `waitFor`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/waitFor.test.js)

Defined as:

```jsx
function waitFor<T>(
  expectation: () => T,
  { timeout: number = 4500, interval: number = 50 }
): Promise<T> {}
```

Waits for non-deterministic periods of time until your element appears or times out. `waitFor` periodically calls `expectation` every `interval` milliseconds to determine whether the element appeared or not.

```jsx
import { render, waitFor } from '@testing-library/react-native';

test('waiting for an Banana to be ready', async () => {
  const { getByText } = render(<Banana />);

  await waitFor(() => getByText('Banana ready'));
});
```

:::info
In order to properly use `waitFor` you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).
:::

## `waitForElementToBeRemoved`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/waitForElementToBeRemoved.test.js)

Defined as:

```jsx
function waitForElementToBeRemoved<T>(
  expectation: () => T,
  { timeout: number = 4500, interval: number = 50 }
): Promise<T> {}
```

Waits for non-deterministic periods of time until queried element is removed or times out. `waitForElementToBeRemoved` periodically calls `expectation` every `interval` milliseconds to determine whether the element has been removed or not.

```jsx
import {
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';

test('waiting for an Banana to be removed', async () => {
  const { getByText } = render(<Banana />);

  await waitForElementToBeRemoved(() => getByText('Banana ready'));
});
```

This method expects that the element is initally present in the render tree and then is removed from it. If the element is not present when you call this method it throws an error.

You can use any of `getBy`, `getAllBy`, `queryBy` and `queryAllBy` queries for `expectation` parameter.

:::info
In order to properly use `waitForElementToBeRemoved` you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).
:::

## `within`, `getQueriesForElement`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/within.test.js)

Defined as:

```jsx
function within(instance: ReactTestInstance): Queries
function getQueriesForElement(instance: ReactTestInstance): Queries
```

`within` (also available as `getQueriesForElement` alias) performs [queries](./Queries.md) scoped to given element.

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

## `query` APIs

Each of the get APIs listed in the render section above have a complimentary query API. The get APIs will throw errors if a proper node cannot be found. This is normally the desired effect. However, if you want to make an assertion that an element is not present in the hierarchy, then you can use the query API instead:

```jsx
import { render } from '@testing-library/react-native';

const { queryByText } = render(<Form />);
const submitButton = queryByText('submit');
expect(submitButton).toBeNull(); // it doesn't exist
```

## `queryAll` APIs

Each of the query APIs have a corresponding queryAll version that always returns an Array of matching nodes. getAll is the same but throws when the array has a length of 0.

```jsx
import { render } from '@testing-library/react-native';

const { queryAllByText } = render(<Forms />);
const submitButtons = queryAllByText('submit');
expect(submitButtons).toHaveLength(3); // expect 3 elements
```

## `act`

Useful function to help testing components that use hooks API. By default any `render`, `update`, `fireEvent`, and `waitFor` calls are wrapped by this function, so there is no need to wrap it manually. This method is re-exported from [`react-test-renderer`](https://github.com/facebook/react/blob/main/packages/react-test-renderer/src/ReactTestRenderer.js#L567]).
