---
id: other
title: Other APIs
---

## Async utilities

### `findBy*` queries

The `findBy*` queries are used to find elements that are not instantly available but will be added as a result of some asynchronous action. Learn more details [here](queries#find-by).

### `waitFor`

```tsx
function waitFor<T>(
  expectation: () => T,
  { timeout: number = 1000, interval: number = 50 },
): Promise<T> {}
```

Waits for a period of time for the `expectation` callback to pass. `waitFor` may run the callback a number of times until timeout is reached, as specified by the `timeout` and `interval` options. The callback must throw an error when the expectation is not met. Returning any value, including a falsy one, will be treated as meeting the expectation, and the callback result will be returned to the caller of `waitFor` function.

```tsx
await waitFor(() => expect(mockFunction).toHaveBeenCalledWith());
```

`waitFor` function will be executing `expectation` callback every `interval` (default: every 50 ms) until `timeout` (default: 1000 ms) is reached. The repeated execution of callback is stopped as soon as it does not throw an error, in such case the value returned by the callback is returned to `waitFor` caller. Otherwise, when it reaches the timeout, the final error thrown by `expectation` will be re-thrown by `waitFor` to the calling code.

```tsx
// ❌ `waitFor` will return immediately because callback does not throw
await waitFor(() => false);
```

`waitFor` is an async function so you need to `await` the result to pause test execution.

```jsx
// ❌ missing `await`: `waitFor` will just return Promise that will be rejected when the timeout is reached
waitFor(() => expect(1).toBe(2));
```

:::note
You can enforce awaiting `waitFor` by using the [await-async-utils](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/await-async-utils.md) rule from [eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library).
:::

Since `waitFor` is likely to run `expectation` callback multiple times, it is highly recommended for it [not to perform any side effects](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#performing-side-effects-in-waitfor) in `waitFor`.

```jsx
await waitFor(() => {
  // ❌ button will be pressed on each waitFor iteration
  fireEvent.press(screen.getByText('press me'));
  expect(mockOnPress).toHaveBeenCalled();
});
```

:::note
Avoiding side effects in `expectation` callback can be partially enforced with the [`no-wait-for-side-effects` rule](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-wait-for-side-effects.md).
:::

It is also recommended to have a [single assertion per each `waitFor`](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#having-multiple-assertions-in-a-single-waitfor-callback) for more consistency and faster failing tests. If you want to make several assertions, then they should be in seperate `waitFor` calls. In many cases you won't actually need to wrap the second assertion in `waitFor` since the first one will do the waiting required for asynchronous change to happen.

#### Using a React Native version < 0.71 with Jest fake timers

:::caution
When using a version of React Native < 0.71 and modern fake timers (the default for `Jest` >= 27), `waitFor` won't work (it will always timeout even if `expectation()` doesn't throw) unless you use the custom [@testing-library/react-native preset](https://github.com/callstack/react-native-testing-library#custom-jest-preset).
:::

`waitFor` checks whether Jest fake timers are enabled and adapts its behavior in such case. The following snippet is a simplified version of how it behaves when fake timers are enabled:

```tsx
let fakeTimeRemaining = timeout;
let lastError;

while (fakeTimeRemaining > 0) {
  fakeTimeRemaining = fakeTimeRemaining - interval;
  jest.advanceTimersByTime(interval);
  try {
    // resolve
    return expectation();
  } catch (error) {
    lastError = error;
  }
}

// reject
throw lastError;
```

In the following example we test that a function is called after 10 seconds using fake timers. Since we're using fake timers, the test won't depend on real time passing and thus be much faster and more reliable. Also we don't have to advance fake timers through Jest fake timers API because `waitFor` already does this for us.

```tsx
// in component
setTimeout(() => {
  someFunction();
}, 10000);

// in test
jest.useFakeTimers();

await waitFor(() => {
  expect(someFunction).toHaveBeenCalledWith();
}, 10000);
```

:::info
In order to properly use `waitFor` you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).
:::

:::note
If you receive warnings related to `act()` function consult our [Undestanding Act](./UnderstandingAct.md) function document.
:::

### `waitForElementToBeRemoved`

```ts
function waitForElementToBeRemoved<T>(
  expectation: () => T,
  { timeout: number = 4500, interval: number = 50 },
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

## Configuration

### `configure`

```ts
type Config = {
  asyncUtilTimeout: number;
  defaultHidden: boolean;
  defaultDebugOptions: Partial<DebugOptions>;
};

function configure(options: Partial<Config>) {}
```

#### `asyncUtilTimeout` option

Default timeout, in ms, for async helper functions (`waitFor`, `waitForElementToBeRemoved`) and `findBy*` queries. Defaults to 1000 ms.

#### `defaultIncludeHiddenElements` option

Default value for [includeHiddenElements](Queries.md#includehiddenelements-option) query option for all queries. The default value is set to `false`, so all queries will not match [elements hidden from accessibility](#ishiddenfromaccessibility). This is because the users of the app would not be able to see such elements.

This option is also available as `defaultHidden` alias for compatibility with [React Testing Library](https://testing-library.com/docs/dom-testing-library/api-configuration/#defaulthidden).

#### `defaultDebugOptions` option

Default [debug options](#debug) to be used when calling `debug()`. These default options will be overridden by the ones you specify directly when calling `debug()`.

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

### `isHiddenFromAccessibility`

```ts
function isHiddenFromAccessibility(
  element: ReactTestInstance | null
): boolean {}
```

Also available as `isInaccessible()` alias for React Testing Library compatibility.

Checks if given element is hidden from assistive technology, e.g. screen readers.

:::note
Like [`isInaccessible`](https://testing-library.com/docs/dom-testing-library/api-accessibility/#isinaccessible) function from DOM Testing Library this function considers both accessibility elements and presentational elements (regular `View`s) to be accessible, unless they are hidden in terms of host platform.

This covers only part of [ARIA notion of Accessiblity Tree](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), as ARIA excludes both hidden and presentational elements from the Accessibility Tree.
:::

For the scope of this function, element is inaccessible when it, or any of its ancestors, meets any of the following conditions:

- it has `display: none` style
- it has [`aria-hidden`](https://reactnative.dev/docs/accessibility#aria-hidden) prop set to `true`
- it has [`accessibilityElementsHidden`](https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios) prop set to `true`
- it has [`importantForAccessibility`](https://reactnative.dev/docs/accessibility#importantforaccessibility-android) prop set to `no-hide-descendants`
- it has sibling host element with either [`aria-modal`](https://reactnative.dev/docs/accessibility#aria-modal-ios) or [`accessibilityViewIsModal`](https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios) prop set to `true`

Specifying `accessible={false}`, `accessiblityRole="none"`, or `importantForAccessibility="no"` props does not cause the element to become inaccessible.

## Other helpers

### `within`, `getQueriesForElement`

```jsx
function within(element: ReactTestInstance): Queries {}

function getQueriesForElement(element: ReactTestInstance): Queries {}
```

`within` (also available as `getQueriesForElement` alias) performs [queries](./Queries.md) scoped to given element.

:::note
Please note that additional `render` specific operations like `update`, `unmount`, `debug`, `toJSON` are _not_ included.
:::

```jsx
const detailsScreen = within(screen.getByA11yHint('Details Screen'));
expect(detailsScreen.getByText('Some Text')).toBeOnTheScreen();
expect(detailsScreen.getByDisplayValue('Some Value')).toBeOnTheScreen();
expect(detailsScreen.queryByLabelText('Some Label')).toBeOnTheScreen();
await expect(detailsScreen.findByA11yHint('Some Label')).resolves.toBeOnTheScreen();
```

Use cases for scoped queries include:

- queries scoped to a single item inside a FlatList containing many items
- queries scoped to a single screen in tests involving screen transitions (e.g. with react-navigation)

### `act`

Useful function to help testing components that use hooks API. By default any `render`, `update`, `fireEvent`, and `waitFor` calls are wrapped by this function, so there is no need to wrap it manually. This method is re-exported from [`react-test-renderer`](https://github.com/facebook/react/blob/main/packages/react-test-renderer/src/ReactTestRenderer.js#L567]).

Consult our [Undestanding Act function](./UnderstandingAct.md) document for more understanding of its intricacies.

### `cleanup`

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