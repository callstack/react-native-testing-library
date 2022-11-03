---
id: api
title: API
---

### Table of contents:

- [`render`](#render)
  - [`render` options](#render-options)
    - [`wrapper` option](#wrapper-option)
    - [`createNodeMock` option](#createnodemock-option)
    - [`unstable_validateStringsRenderedWithinText` option](#unstable_validatestringsrenderedwithintext-option)
  - [`...queries`](#queries)
    - [Example](#example)
  - [`update`](#update)
  - [`unmount`](#unmount)
  - [`debug`](#debug)
    - [`message` option](#message-option)
    - [`mapProps` option](#mapprops-option)
    - [`debug.shallow`](#debugshallow)
  - [`toJSON`](#tojson)
  - [`container`](#container)
- [`screen`](#screen)
- [`cleanup`](#cleanup)
- [`fireEvent`](#fireevent)
- [`fireEvent[eventName]`](#fireeventeventname)
  - [`fireEvent.press`](#fireeventpress)
  - [`fireEvent.changeText`](#fireeventchangetext)
  - [`fireEvent.scroll`](#fireeventscroll)
    - [On a `ScrollView`](#on-a-scrollview)
    - [On a `FlatList`](#on-a-flatlist)
- [`waitFor`](#waitfor)
- [`waitForElementToBeRemoved`](#waitforelementtoberemoved)
- [`within`, `getQueriesForElement`](#within-getqueriesforelement)
- [`query` APIs](#query-apis)
- [`queryAll` APIs](#queryall-apis)
- [`act`](#act)
- [`renderHook`](#renderhook)
  - [`callback`](#callback)
  - [`options` (Optional)](#options-optional)
    - [`initialProps`](#initialprops)
    - [`wrapper`](#wrapper)
  - [`RenderHookResult` object](#renderhookresult-object)
    - [`result`](#result)
    - [`rerender`](#rerender)
    - [`unmount`](#unmount-1)
  - [Examples](#examples)
    - [With `initialProps`](#with-initialprops)
    - [With `wrapper`](#with-wrapper)
- [Configuration](#configuration)
  - [`configure`](#configure)
    - [`asyncUtilTimeout` option](#asyncutiltimeout-option)
    - [`defaultDebugOptions` option](#defaultdebugoptions-option)
  - [`resetToDefaults()`](#resettodefaults)
  - [Environment variables](#environment-variables)
    - [`RNTL_SKIP_AUTO_CLEANUP`](#rntl_skip_auto_cleanup)
    - [`RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS`](#rntl_skip_auto_detect_fake_timers)
- [Accessibility](#accessibility)
  - [`isInaccessible`](#isinaccessible)

This page gathers public API of React Native Testing Library along with usage examples.

## `render`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/render.test.tsx)

Defined as:

```jsx
function render(
  component: React.Element<any>,
  options?: RenderOptions,
): RenderResult {}
```

Deeply renders given React element and returns helpers to query the output components structure.

```jsx
import { render } from '@testing-library/react-native';
import { QuestionsBoard } from '../QuestionsBoard';

test('should verify two questions', () => {
  render(<QuestionsBoard {...props} />);
  const allQuestions = screen.queryAllByRole('header');

  expect(allQuestions).toHaveLength(2);
});
```

> When using React context providers, like Redux Provider, you'll likely want to wrap rendered component with them. In such cases it's convenient to create your custom `render` method. [Follow this great guide on how to set this up](https://testing-library.com/docs/react-testing-library/setup#custom-render).

The `render` method returns a `RenderResult` object having properties described below.

:::info
Latest `render` result is kept in [`screen`](#screen) variable that can be imported from `@testing-library/react-native` package. 

Using `screen` instead of destructuring `render` result is recommended approach. See [this article](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen) from Kent C. Dodds for more details.
:::

### `render` options

The behavior of `render` method can be customized by passing various options as a second argument of `RenderOptions` type:

#### `wrapper` option

```ts
wrapper?: React.ComponentType<any>,
```

This options allows you to wrap tested component, passed as the first option to the `render()` function, in additional wrapper component. This is most useful for creating reusable custom render functions for common React Context providers.

#### `createNodeMock` option

```ts
createNodeMock?: (element: React.Element<any>) => any,
```

This options allows you to pass `createNodeMock` option to `ReactTestRenderer.create()` method in order to allow for custom mock refs. You can learn more about this options from [React Test Renderer documentation](https://reactjs.org/docs/test-renderer.html#ideas).

#### `unstable_validateStringsRenderedWithinText` option

```ts
unstable_validateStringsRenderedWithinText?: boolean;
```

:::note
This options is experimental, in some cases it might not work as intended, and its behavior might change without observing [SemVer](https://semver.org/) requirements for breaking changes. 
:::

This **experimental** option allows you to replicate React Native behavior of throwing `Invariant Violation: Text strings must be rendered within a <Text> component` error when you try to render `string` value under components different than `<Text>`, e.g. under `<View>`. 

This check is not enforced by React Test Renderer and hence by default React Native Testing Library also does not check this. That might result in runtime errors when running your code on a device, while the code works without errors in tests.

### `...queries`

The most important feature of `render` is providing a set of helpful queries that allow you to find certain elements in the view hierarchy.

See [Queries](./Queries.md) for a complete list.

#### Example

```jsx
import { render } from '@testing-library/react-native';

const { getByText, queryByA11yState } = render(<Component />);
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

interface DebugOptions { 
  message?: string;
  mapProps?: MapPropsFunction;
}

debug(options?: DebugOptions | string): void
```

Pretty prints deeply rendered component passed to `render`. 

#### `message` option

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


#### `mapProps` option

You can use the `mapProps` option to transform the props that will be printed : 

```jsx
render(<View style={{ backgroundColor: 'red' }}/>);
debug({ mapProps : ({ style, ...props }) => ({ props }) })
```

This will log the rendered JSX without the `style` props. 

The `children` prop cannot be filtered out so the following will print all rendered components with all props but children filtered.


```ts
debug({ mapProps : props => ({}) })
```

This option can be used to target specific props when debugging a query (for instance keeping only `children` prop when debugging a `getByText` query).

 You can also transform prop values so that they are more readable (e.g. flatten styles).

 ```tsx
import { StyleSheet } from 'react-native';

debug({ mapProps : {({ style, ...props })} => ({ style : StyleSheet.flatten(style), ...props }) });
 ```

Or remove props that have little value when debugging tests, e.g. path prop for svgs

```tsx 
debug({ mapProps : ({ path, ...props }) => ({ ...props })});
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

## `screen`

```ts
let screen: RenderResult;
```

Hold the value of latest render call for easier access to query and other functions returned by [`render`](#render). 

Its value is automatically cleared after each test by calling [`cleanup`](#cleanup). If no `render` call has been made in a given test then it holds a special object that implements `RenderResult` but throws a helpful error on each property and method access.

This can also be used to build test utils that would normally require to be in render scope, either in a test file or globally for your project. For instance: 

```ts
// Prints the rendered components omitting all props except children.
const debugText = () => screen.debug({ mapProps : props => ({}) })
```

## `cleanup`

```ts
const cleanup: () => void;
```

Unmounts React trees that were mounted with `render` and clears `screen` variable that holds latest `render` output.

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

## `fireEvent`

```ts
function fireEvent(
  element: ReactTestInstance,
  eventName: string,
  ...data: Array<any>
): void {}
```

Fires native-like event with data.

Invokes a given event handler (whether native or custom) on the element, bubbling to the root of the rendered tree.

```jsx
import { render, screen, fireEvent } from '@testing-library/react-native';

test('fire changeText event', () => {
  const onEventMock = jest.fn();
  render(
    // MyComponent renders TextInput which has a placeholder 'Enter details'
    // and with `onChangeText` bound to handleChangeText
    <MyComponent handleChangeText={onEventMock} />
  );

  fireEvent(screen.getByPlaceholderText('change'), 'onChangeText', 'ab');
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

render(
  <View>
    <TextInput placeholder="my placeholder" onBlur={onBlurMock} />
  </View>
);

// you can omit the `on` prefix
fireEvent(screen.getByPlaceholderText('my placeholder'), 'blur');
```

## `fireEvent[eventName]`

```ts
fireEvent[eventName](element: ReactTestInstance, ...data: Array<any>): void
```

Convenience methods for common events like: `press`, `changeText`, `scroll`.

### `fireEvent.press`

```
fireEvent.press: (element: ReactTestInstance, ...data: Array<any>) => void
```

Invokes `press` event handler on the element or parent element in the tree.

```jsx
import { View, Text, TouchableOpacity } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onPressMock = jest.fn();
const eventData = {
  nativeEvent: {
    pageX: 20,
    pageY: 30,
  },
};

render(
  <View>
    <TouchableOpacity onPress={onPressMock}>
      <Text>Press me</Text>
    </TouchableOpacity>
  </View>
);

fireEvent.press(screen.getByText('Press me'), eventData);
expect(onPressMock).toHaveBeenCalledWith(eventData);
```

### `fireEvent.changeText`

```
fireEvent.changeText: (element: ReactTestInstance, ...data: Array<any>) => void
```

Invokes `changeText` event handler on the element or parent element in the tree.

```jsx
import { View, TextInput } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onChangeTextMock = jest.fn();
const CHANGE_TEXT = 'content';

render(
  <View>
    <TextInput placeholder="Enter data" onChangeText={onChangeTextMock} />
  </View>
);

fireEvent.changeText(screen.getByPlaceholderText('Enter data'), CHANGE_TEXT);
```

### `fireEvent.scroll`

```
fireEvent.scroll: (element: ReactTestInstance, ...data: Array<any>) => void
```

Invokes `scroll` event handler on the element or parent element in the tree.

#### On a `ScrollView`

```jsx
import { ScrollView, Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onScrollMock = jest.fn();
const eventData = {
  nativeEvent: {
    contentOffset: {
      y: 200,
    },
  },
};

render(
  <ScrollView onScroll={onScrollMock}>
    <Text>XD</Text>
  </ScrollView>
);

fireEvent.scroll(screen.getByText('scroll-view'), eventData);
```

#### On a `FlatList`

```jsx
import { FlatList, View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onEndReached = jest.fn();
render(
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

fireEvent.scroll(screen.getByTestId('flat-list'), eventData);
expect(onEndReached).toHaveBeenCalled();
```

:::note
If you're noticing that components are not being found on a list, even after mocking a scroll event, try changing the [`initialNumToRender`](https://reactnative.dev/docs/flatlist#initialnumtorender) that you have set. If you aren't comfortable changing the code to accept this prop from the unit test, try using an e2e test that might better suit what use case you're attempting to replicate.
:::

## `waitFor`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/waitFor.test.tsx)

Defined as:

```jsx
function waitFor<T>(
  expectation: () => T,
  { timeout: number = 4500, interval: number = 50 }
): Promise<T> {}
```

Waits for non-deterministic periods of time until your element appears or times out. `waitFor` periodically calls `expectation` every `interval` milliseconds to determine whether the element appeared or not.

```jsx
import { render, screen, waitFor } from '@testing-library/react-native';

test('waiting for an Banana to be ready', async () => {
  render(<Banana />);

  await waitFor(() => screen.getByText('Banana ready'));
});
```

:::info
In order to properly use `waitFor` you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).
:::

:::note
If you receive warnings related to `act()` function consult our [Undestanding Act](./UnderstandingAct.md) function document.
:::

## `waitForElementToBeRemoved`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/waitForElementToBeRemoved.test.tsx)

Defined as:

```jsx
function waitForElementToBeRemoved<T>(
  expectation: () => T,
  { timeout: number = 4500, interval: number = 50 }
): Promise<T> {}
```

Waits for non-deterministic periods of time until queried element is removed or times out. `waitForElementToBeRemoved` periodically calls `expectation` every `interval` milliseconds to determine whether the element has been removed or not.

```jsx
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native';

test('waiting for an Banana to be removed', async () => {
  render(<Banana />);

  await waitForElementToBeRemoved(() => screen.getByText('Banana ready'));
});
```

This method expects that the element is initially present in the render tree and then is removed from it. If the element is not present when you call this method it throws an error.

You can use any of `getBy`, `getAllBy`, `queryBy` and `queryAllBy` queries for `expectation` parameter.

:::info
In order to properly use `waitForElementToBeRemoved` you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).
:::

:::note
If you receive warnings related to `act()` function consult our [Undestanding Act](./UnderstandingAct.md) function document.
:::

## `within`, `getQueriesForElement`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/within.test.tsx)

Defined as:

```jsx
function within(
  element: ReactTestInstance
): Queries {}

function getQueriesForElement(
  element: ReactTestInstance
): Queries {}
```

`within` (also available as `getQueriesForElement` alias) performs [queries](./Queries.md) scoped to given element.

:::note
Please note that additional `render` specific operations like `update`, `unmount`, `debug`, `toJSON` are _not_ included.
:::

```jsx
const detailsScreen = within(screen.getByA11yHint('Details Screen'));
expect(detailsScreen.getByText('Some Text')).toBeTruthy();
expect(detailsScreen.getByDisplayValue('Some Value')).toBeTruthy();
expect(detailsScreen.queryByLabelText('Some Label')).toBeTruthy();
await expect(detailsScreen.findByA11yHint('Some Label')).resolves.toBeTruthy();
```

Use cases for scoped queries include:

- queries scoped to a single item inside a FlatList containing many items
- queries scoped to a single screen in tests involving screen transitions (e.g. with react-navigation)

## `query` APIs

Each of the get APIs listed in the render section above have a complimentary query API. The get APIs will throw errors if a proper node cannot be found. This is normally the desired effect. However, if you want to make an assertion that an element is not present in the hierarchy, then you can use the query API instead:

```jsx
import { render, screen } from '@testing-library/react-native';

render(<Form />);
const submitButton = screen.queryByText('submit');
expect(submitButton).toBeNull(); // it doesn't exist
```

## `queryAll` APIs

Each of the query APIs have a corresponding queryAll version that always returns an Array of matching nodes. getAll is the same but throws when the array has a length of 0.

```jsx
import { render } from '@testing-library/react-native';

render(<Forms />);
const submitButtons = screen.queryAllByText('submit');
expect(submitButtons).toHaveLength(3); // expect 3 elements
```

## `act`

Useful function to help testing components that use hooks API. By default any `render`, `update`, `fireEvent`, and `waitFor` calls are wrapped by this function, so there is no need to wrap it manually. This method is re-exported from [`react-test-renderer`](https://github.com/facebook/react/blob/main/packages/react-test-renderer/src/ReactTestRenderer.js#L567]).

Consult our [Undestanding Act function](./UnderstandingAct.md) document for more understanding of its intricacies.

## `renderHook`

Defined as:

```ts
function renderHook<Result, Props>(
  callback: (props?: Props) => Result,
  options?: RenderHookOptions<Props>
): RenderHookResult<Result, Props>;
```

Renders a test component that will call the provided `callback`, including any hooks it calls, every time it renders. Returns [`RenderHookResult`](#renderhookresult-object) object, which you can interact with.

```ts
import { renderHook } from '@testing-library/react-native';
import { useCount } from '../useCount';

it('should increment count', () => {
  const { result } = renderHook(() => useCount());

  expect(result.current.count).toBe(0);
  act(() => {
    // Note that you should wrap the calls to functions your hook returns with `act` if they trigger an update of your hook's state to ensure pending useEffects are run before your next assertion.
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```

```ts
// useCount.js
export const useCount = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((previousCount) => previousCount + 1);

  return { count, increment };
};
```

The `renderHook` function accepts the following arguments:

### `callback`

The function that is called each `render` of the test component. This function should call one or more hooks for testing.

The `props` passed into the callback will be the `initialProps` provided in the `options` to `renderHook`, unless new props are provided by a subsequent `rerender` call.

### `options` (Optional)

A `RenderHookOptions<Props>` object to modify the execution of the `callback` function, containing the following properties:

#### `initialProps`

The initial values to pass as `props` to the `callback` function of `renderHook`. The `Props` type is determined by the type passed to or inferred by the `renderHook` call.

#### `wrapper`

A React component to wrap the test component in when rendering. This is usually used to add context providers from `React.createContext` for the hook to access with `useContext`.

### `RenderHookResult` object

```ts
interface RenderHookResult<Result, Props> {
  result: { current: Result };
  rerender: (props: Props) => void;
  unmount: () => void;
}
```

The `renderHook` function returns an object that has the following properties:

#### `result`

The `current` value of the `result` will reflect the latest of whatever is returned from the `callback` passed to `renderHook`. The `Result` type is determined by the type passed to or inferred by the `renderHook` call.

#### `rerender`

A function to rerender the test component, causing any hooks to be recalculated. If `newProps` are passed, they will replace the `callback` function's `initialProps` for subsequent rerenders. The `Props` type is determined by the type passed to or inferred by the `renderHook` call.

#### `unmount`

A function to unmount the test component. This is commonly used to trigger cleanup effects for `useEffect` hooks.

### Examples

Here we present some extra examples of using `renderHook` API.

#### With `initialProps`

```ts
const useCount = (initialCount: number) => {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount((previousCount) => previousCount + 1);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  return { count, increment };
};

it('should increment count', () => {
  const { result, rerender } = renderHook(
    (initialCount: number) => useCount(initialCount),
    { initialProps: 1 }
  );

  expect(result.current.count).toBe(1);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(2);
  rerender(5);
  expect(result.current.count).toBe(5);
});
```

#### With `wrapper`

```tsx
it('should use context value', () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Context.Provider value="provided">{children}</Context.Provider>;
  }

  const { result } = renderHook(() => useHook(), { wrapper: Wrapper });
  // ...
});
```


## Configuration

### `configure`

```ts
type Config = {
  asyncUtilTimeout: number;
};

function configure(options: Partial<Config>)  {}
```
#### `asyncUtilTimeout` option

Default timeout, in ms, for async helper functions (`waitFor`, `waitForElementToBeRemoved`) and `findBy*` queries. Defaults to 1000 ms.

#### `defaultDebugOptions` option

Default [debug options](#message-option) to be used when calling `debug()`. These default options will be overridden by the ones you specify directly when calling `debug()`.

### `resetToDefaults()`

```ts
function resetToDefaults() {}
```

### Environment variables

#### `RNTL_SKIP_AUTO_CLEANUP`
Set to `true` to disable automatic `cleanup()` after each test. It works the same as importing `react-native-testing-library/dont-cleanup-after-each` or using `react-native-testing-library/pure`.

```shell
$ RNTL_SKIP_AUTO_CLEANUP=true jest
```

#### `RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS`
Set to `true` to disable auto-detection of fake timers. This might be useful in rare cases when you want to use non-Jest fake timers. See [issue #886](https://github.com/callstack/react-native-testing-library/issues/886) for more details.

```shell
$ RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS=true jest
```

## Accessibility

### `isInaccessible`

```ts
function isInaccessible(
  element: ReactTestInstance | null
): boolean {}
```

Checks if given element is hidden from assistive technology, e.g. screen readers. 

:::note
Like [`isInaccessible`](https://testing-library.com/docs/dom-testing-library/api-accessibility/#isinaccessible) function from [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro) this function considers both accessibility elements and presentational elements (regular `View`s) to be accessible, unless they are hidden in terms of host platform. 

This covers only part of [ARIA notion of Accessiblity Tree](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), as ARIA excludes both hidden and presentational elements from the Accessibility Tree.
:::

For the scope of this function, element is inaccessible when it, or any of its ancestors, meets any of the following conditions: 
 * it has `display: none` style
 * it has [`accessibilityElementsHidden`](https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios) prop set to `true` 
 * it has [`importantForAccessibility`](https://reactnative.dev/docs/accessibility#importantforaccessibility-android) prop set to `no-hide-descendants`
 * it has sibling host element with [`accessibilityViewIsModal`](https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios) prop set to `true`
 
Specifying `accessible={false}`, `accessiblityRole="none"`, or `importantForAccessibility="no"` props does not cause the element to become inaccessible.
