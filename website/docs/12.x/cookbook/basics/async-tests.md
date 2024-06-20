# Async tests

## Summary

Typically, you would write synchronous tests. However, there are cases when using asynchronous (async) tests might be necessary or beneficial. The two most common scenarios are:
1. **Testing Code with asynchronous operations**: When your code relies on operations that are asynchronous, such as network calls, async tests are essential. Even though you should mock these network calls, the mock should act similarly to real async behavior.
2. **UserEvent API:** Using the UserEvent API in your tests creates more realistic event handling. These interactions introduce delays (typically event-loop ticks with 0 ms delays), requiring async tests to handle the timing correctly.

By using async tests when needed, you ensure your tests are reliable and simulate real-world conditions accurately.

### Example

Consider a basic asynchronous test for a user signing in with correct credentials:

```javascript
test('User can sign in with correct credentials', async () => {
  // Typical test setup
  const user = userEvent.setup();
  render(<App />);

  // No need to use async here, components are already rendered
  expect(screen.getByRole('header', { name: 'Sign in to Hello World App!' })).toBeOnTheScreen();

  // Using await as User Event requires it
  await user.type(screen.getByLabelText('Username'), 'admin');
  await user.type(screen.getByLabelText('Password'), 'admin1');
  await user.press(screen.getByRole('button', { name: 'Sign In' }));

  // Using await as sign in operation is asynchronous
  expect(await screen.findByRole('header', { name: 'Welcome admin!' })).toBeOnTheScreen();

  // Follow-up assertions do not need to be async, as we already waited for sign in operation to complete
  expect(screen.queryByRole('header', { name: 'Sign in to Hello World App' })).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Username')).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Password')).not.toBeOnTheScreen();
});
```

## Async utilities

There are several asynchronous utilities you might use in your tests. 

### `findBy*` queries
The most common utility are the `findBy*` queries. These are useful when you need to wait for a matching element to appear. They can be though of as a `getBy*` query used within a `waitFor` helper.

They accept the same predicates as `getBy*` queries like `findByRole`, `findByTest`, etc. They also have a multiple elements variant called `findAllBy*`.

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
): Promise<ReactTestInstance>;
```

Each query has a default `timeout` value of 1000 ms and `interval` of 50 ms. Custom timeout and check intervals can be specified if needed, as shown below:

```typescript
await screen.findByRole('button'), { name: 'Start' }, { timeout: 1000, interval: 50 });
```

Alternatively a default global `timeout` value can be set using `configure()` function:
```typescript
configure({ asyncUtilTimeout: timeout });
```

### `waitFor` function

The `waitFor` function is another option, serving as a lower-level utility in more advanced cases. 

It accepts an `expectation` to be validated and repeats the check every defined interval until it no longer throws an error. The default interval is 50 ms, and checks continue until a timeout is reached.

It accepts the same `timeout` and `interval` option as `findBy*` queries. 

```typescript
await waitFor(() => getByText('Hello World'));
```

If you want to use it with `getBy*` queries, use the `findBy*` queries instead, as they essentially do the same, but offer better error reporting, etc.


### `waitForElementToBeRemoved` function

A specialized function, `waitForElementToBeRemoved`, is used to verify that a matching element was present but has since been removed. This function is, in a way, the negation of `waitFor` as it expects the initial expectation to be true, only to turn invalid (throwing an error) on subsequent runs. It operates using the same `timeout` and `interval` parameters.

```typescript
await waitForElementToBeRemoved(() => getByText('Hello World'));
```

## Fake Timers

Regarding timers, asynchronous tests can take longer to execute due to the delays introduced by asynchronous operations. To mitigate this, fake timers can be used. These are particularly useful when delays are mere waits, such as the 130 milliseconds wait introduced by the UserEvent `press()` event due to React Native runtime behavior. Fake timers allow for fast-forwarding through these wait periods.

Here are the basics of using fake timers:
- Enable fake timers with: `jest.useFakeTimers();`
- Disable fake timers with: `jest.useRealTimers();`
- Move fake timers forward with: `jest.advanceTimersByTime(interval);`
- Run **all timers** to completion with: `jest.runAllTimers();`
- Run **currently pending timers** to completion with: `jest.runOnlyPendingTimers();`

Be cautious when running all timers to completion as it might create an infinite loop if these timers schedule follow-up timers. In such cases, it's safer to use `jest.runOnlyPendingTimers()` to avoid ending up in an infinite loop of scheduled tasks.

Note: you do not need to advance timers by hand when using User Event, it's automatically.