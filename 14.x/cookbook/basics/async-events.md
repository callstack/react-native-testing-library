# Async Events

## Summary

In RNTL v14, all tests are async since `render()`, `fireEvent()`, and other core APIs return Promises. Beyond the basic async APIs, there are additional async utilities for handling events that complete over time:

1. **Waiting for elements to appear**: Use `findBy*` queries when elements appear after some delay (e.g., after data fetching).
2. **Waiting for conditions**: Use `waitFor()` to wait for arbitrary conditions to be met.
3. **Waiting for elements to disappear**: Use `waitForElementToBeRemoved()` when elements should be removed after some action.

These utilities help you write reliable tests that properly handle timing in your application.

### Example

Consider a test for a user signing in with correct credentials:

```javascript
test('User can sign in with correct credentials', async () => {
  // Typical test setup
  const user = userEvent.setup();
  await render(<App />);

  // No need to use async here, components are already rendered
  expect(screen.getByRole('header', { name: 'Sign in to Hello World App!' })).toBeOnTheScreen();

  // Using await as User Event requires it
  await user.type(screen.getByLabelText('Username'), 'admin');
  await user.type(screen.getByLabelText('Password'), 'admin1');
  await user.press(screen.getByRole('button', { name: 'Sign In' }));

  // Using await as sign in operation is asynchronous
  expect(await screen.findByRole('header', { name: 'Welcome admin!' })).toBeOnTheScreen();

  // Follow-up assertions do not need to be async, as we already waited for sign in operation to complete
  expect(
    screen.queryByRole('header', { name: 'Sign in to Hello World App' })
  ).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Username')).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Password')).not.toBeOnTheScreen();
});
```

## Async utilities

There are several asynchronous utilities you might use in your tests.

### `findBy*` queries

The most common are the [`findBy*` queries](/react-native-testing-library/14.x/docs/api/queries.md#find-by). These are useful when waiting for a matching element to appear. They can be understood as a [`getBy*` queries](/react-native-testing-library/14.x/docs/api/queries.md#get-by) used in conjunction with a [`waitFor` function](/react-native-testing-library/14.x/docs/api/misc/async.md#waitfor).

They accept the same predicates as `getBy*` queries like `findByRole`, `findByTest`, etc. They also have a multiple elements variant called [`findAllBy*`](/react-native-testing-library/14.x/docs/api/queries.md#find-all-by).

```typescript
function findByRole: (
  role: TextMatch,
  queryOptions?: {
    // Query specific options
  }
  waitForOptions?: {
    timeout?: number;
    interval?: number;
    // ..
  }
): Promise<HostElement>;
```

Each query has a default `timeout` value of 1000 ms and a default `interval` of 50 ms. Custom timeout and check intervals can be specified if needed, as shown below:

#### Example

```typescript
const button = await screen.findByRole(
  'button',
  { name: 'Start' },
  { timeout: 1000, interval: 50 }
);
```

Alternatively, a default global `timeout` value can be set using the [`configure` function](/react-native-testing-library/14.x/docs/api/misc/config.md#configure):

```typescript
configure({ asyncUtilTimeout: timeout });
```

### `waitFor` function

The `waitFor` function is another option, serving as a lower-level utility in more advanced cases.

```typescript
function waitFor<T>(
  expectation: () => T,
  options?: {
    timeout: number;
    interval: number;
  }
): Promise<T>;
```

It accepts an `expectation` to be validated and repeats the check every defined interval until it no longer throws an error. Similarly to `findBy*` queries they accept `timeout` and `interval` options and have the same default values of 1000ms for timeout, and a checking interval of 50 ms.

#### Example

```typescript
await waitFor(() => expect(mockAPI).toHaveBeenCalledTimes(1));
```

If you want to use it with `getBy*` queries, use the `findBy*` queries instead, as they essentially do the same, but offer better developer experience.

### `waitForElementToBeRemoved` function

A specialized function, [`waitForElementToBeRemoved`](/react-native-testing-library/14.x/docs/api/misc/async.md#waitforelementtoberemoved), is used to verify that a matching element was present but has since been removed.

```typescript
function waitForElementToBeRemoved<T>(
  expectation: () => T,
  options?: {
    timeout: number;
    interval: number;
  }
): Promise<T> {}
```

This function is, in a way, the negation of `waitFor` as it expects the initial expectation to be true (not throw an error), only to turn invalid (start throwing errors) on subsequent runs. It operates using the same `timeout` and `interval` parameters as `findBy*` queries and `waitFor`.

#### Example

```typescript
await waitForElementToBeRemoved(() => getByText('Hello World'));
```

## Fake Timers

Asynchronous tests can take long to execute due to the delays introduced by asynchronous operations. To mitigate this, fake timers can be used. These are particularly useful when delays are mere waits, such as the 130 milliseconds wait introduced by the UserEvent `press()` event due to React Native runtime behavior or simulated 1000 wait in a API call mock. Fake timers allow for precise fast-forwarding through these wait periods.

Here are the basics of using [Jest fake timers](https://jestjs.io/docs/timer-mocks):

- Enable fake timers with: `jest.useFakeTimers()`
- Disable fake timers with: `jest.useRealTimers()`
- Advance fake timers forward with: `jest.advanceTimersByTime(interval)`
- Run **all timers** to completion with: `jest.runAllTimers()`
- Run **currently pending timers** to completion with: `jest.runOnlyPendingTimers()`

Be cautious when running all timers to completion as it might create an infinite loop if these timers schedule follow-up timers. In such cases, it's safer to use `jest.runOnlyPendingTimers()` to avoid ending up in an infinite loop of scheduled tasks.

You can use both built-in Jest fake timers, as well as [Sinon.JS fake timers](https://sinonjs.org/releases/latest/fake-timers/).

Note: you do not need to advance timers by hand when using User Event API, as it's automatically.
