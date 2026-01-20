# Async utilities

## `findBy*` queries

The `findBy*` queries are used to find elements that are not instantly available but will be added as a result of some asynchronous action. Learn more details [here](/react-native-testing-library/docs/api/queries.md#find-by).

## `waitFor`

```tsx
function waitFor<T>(
  expectation: () => T,
  options?: { timeout: number; interval: number }
): Promise<T>;
```

Waits for the `expectation` callback to pass. `waitFor` may run the callback multiple times until the timeout is reached, as specified by the `timeout` and `interval` options. The callback must throw an error when the expectation isn't met. Returning any value, including a falsy one, is treated as meeting the expectation, and the callback result is returned to the caller of `waitFor`.

```tsx
await waitFor(() => expect(mockFunction).toHaveBeenCalledWith());
```

`waitFor` executes the `expectation` callback every `interval` (default: every 50 ms) until `timeout` (default: 1000 ms) is reached. The repeated execution stops as soon as it doesn't throw an error, and the value returned by the callback is returned to the `waitFor` caller. Otherwise, when it reaches the timeout, the final error thrown by `expectation` is re-thrown by `waitFor` to the calling code.

```tsx
// ❌ `waitFor` will return immediately because callback does not throw
await waitFor(() => false);
```

`waitFor` is an async function, so you need to `await` the result to pause test execution.

```jsx
// ❌ missing `await`: `waitFor` will just return Promise that will be rejected when the timeout is reached
waitFor(() => expect(1).toBe(2));
```

:::note
You can enforce awaiting `waitFor` by using the [await-async-utils](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/await-async-utils.md) rule from [eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library).
:::

Since `waitFor` is likely to run the `expectation` callback multiple times, it's highly recommended [not to perform any side effects](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#performing-side-effects-in-waitfor) in `waitFor`.

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

It's also recommended to have a [single assertion per each `waitFor`](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#having-multiple-assertions-in-a-single-waitfor-callback) for more consistency and faster failing tests. If you want to make several assertions, put them in separate `waitFor` calls. In many cases you won't need to wrap the second assertion in `waitFor` since the first one will do the waiting required for the asynchronous change to happen.

`waitFor` checks whether Jest fake timers are enabled and adapts its behavior accordingly. The following snippet is a simplified version of how it behaves when fake timers are enabled:

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

In the following example we test that a function is called after 10 seconds using fake timers. Since we're using fake timers, the test won't depend on real time passing and will be much faster and more reliable. We don't have to advance fake timers through Jest fake timers API because `waitFor` already does this for us.

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

:::note
If you receive warnings related to `act()` function consult our [Understanding Act](/react-native-testing-library/docs/advanced/understanding-act.md) function document.
:::

## `waitForElementToBeRemoved`

```ts
function waitForElementToBeRemoved<T>(
  expectation: () => T,
  options?: { timeout: number; interval: number }
): Promise<T>;
```

Waits until the queried element is removed or times out. `waitForElementToBeRemoved` periodically calls `expectation` every `interval` milliseconds to determine whether the element has been removed or not.

```jsx
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native';

test('waiting for an Banana to be removed', async () => {
  render(<Banana />);

  await waitForElementToBeRemoved(() => screen.getByText('Banana ready'));
});
```

This method expects the element to be initially present in the render tree and then removed from it. If the element isn't present when you call this method, it throws an error.

You can use any of `getBy`, `getAllBy`, `queryBy`, and `queryAllBy` queries for the `expectation` parameter.

:::note
If you receive warnings related to `act()` function consult our [Understanding Act](/react-native-testing-library/docs/advanced/understanding-act.md) function document.
:::
