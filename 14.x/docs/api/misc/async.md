# Async utilities

## `findBy*` queries

The `findBy*` queries are used to find elements that are not instantly available but will be added as a result of some asynchronous action. Learn more details [here](/react-native-testing-library/14.x/docs/api/queries.md#find-by).

## `waitFor`

```tsx
function waitFor<T>(
  expectation: () => T,
  options?: {
    timeout?: number;
    interval?: number;
    onTimeout?: (error: Error) => Error;
  }
): Promise<T>;
```

Waits for the `expectation` callback to pass. `waitFor` runs the callback multiple times until timeout is reached, as specified by the `timeout` and `interval` options. The callback must throw an error when the expectation is not met. Returning any value, including a falsy one, is treated as meeting the expectation, and the callback result is returned to the caller.

```tsx
await waitFor(() => expect(mockFunction).toHaveBeenCalledWith());
```

`waitFor` executes the `expectation` callback every `interval` (default: 50 ms) until `timeout` (default: 1000 ms) is reached. Execution stops as soon as the callback doesn't throw an error, and the callback's return value is returned to the caller. If timeout is reached, `waitFor` re-throws the final error thrown by `expectation`.

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

Since `waitFor` runs the `expectation` callback multiple times, [avoid performing side effects](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#performing-side-effects-in-waitfor) in `waitFor`.

```jsx
await waitFor(async () => {
  // ❌ button will be pressed on each waitFor iteration
  await fireEvent.press(screen.getByText('press me'));
  expect(mockOnPress).toHaveBeenCalled();
});
```

:::note
Avoiding side effects in `expectation` callback can be partially enforced with the [`no-wait-for-side-effects` rule](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-wait-for-side-effects.md).
:::

Use a [single assertion per `waitFor`](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#having-multiple-assertions-in-a-single-waitfor-callback) for consistency and faster failing tests. For multiple assertions, use separate `waitFor` calls. Often you won't need to wrap the second assertion in `waitFor` since the first one waits for the asynchronous change.

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

In the following example we test that a function is called after 10 seconds using fake timers. With fake timers, the test doesn't depend on real time passing, making it faster and more reliable. We don't need to advance fake timers through Jest's API because `waitFor` handles this.

```tsx
// in component
setTimeout(() => {
  someFunction();
}, 10000);

// in test
jest.useFakeTimers();

await waitFor(
  () => {
    expect(someFunction).toHaveBeenCalledWith();
  },
  { timeout: 10000 }
);
```

:::note
If you receive warnings related to `act()` function consult our [Understanding Act](/react-native-testing-library/14.x/docs/advanced/understanding-act.md) function document.
:::

### Options

- `timeout`: How long to wait for, in ms. Defaults to 1000 ms (configured by `asyncUtilTimeout` option).
- `interval`: How often to check, in ms. Defaults to 50 ms.
- `onTimeout`: Callback to transform the error before it's thrown. Useful for debugging, e.g., `onTimeout: () => { screen.debug(); }`.

## `waitForElementToBeRemoved`

```ts
function waitForElementToBeRemoved<T>(
  expectation: () => T,
  options?: {
    timeout?: number;
    interval?: number;
    onTimeout?: (error: Error) => Error;
  }
): Promise<T>;
```

Waits for non-deterministic periods of time until queried element is removed or times out. `waitForElementToBeRemoved` periodically calls `expectation` every `interval` milliseconds to determine whether the element has been removed or not.

```jsx
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native';

test('waiting for an Banana to be removed', async () => {
  await render(<Banana />);

  await waitForElementToBeRemoved(() => screen.getByText('Banana ready'));
});
```

This method expects that the element is initially present in the render tree and then is removed from it. If the element is not present when you call this method it throws an error.

You can use any of `getBy`, `getAllBy`, `queryBy` and `queryAllBy` queries for `expectation` parameter.

:::note
If you receive warnings related to `act()` function consult our [Understanding Act](/react-native-testing-library/14.x/docs/advanced/understanding-act.md) function document.
:::
