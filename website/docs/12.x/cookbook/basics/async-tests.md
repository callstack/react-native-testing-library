# Async tests

## Summary

In the context of testing within development, it's important to understand when to use asynchronous tests. Generally, these are necessary when there is some asynchronous event happening in the tested component or hook, or when using UserEvent testing utilities which are asynchronous by nature.

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

There are several asynchronous utilities you might use in such tests. 

### `findBy*` queries
One common utility is the `findBy*` queries. These are useful when you need to wait for a matching element to appear and can be summed up as a `getBy*` query within a `waitFor` function. These are widely used due to their efficacy in handling asynchronous elements. They accept the same predicates as `getBy*` queries and have a multiple elements variant called `findAllBy*`. Additionally, custom timeout and check intervals can be specified if needed, as shown below:

```javascript
await screen.findByText('Hello', {}, { timeout: 1000, interval: 50 });
```

### `waitFor` function
The `waitFor` function is another option, serving as a lower-level utility in more advanced cases. It accepts an expectation to be validated and repeats the check every defined interval until it no longer throws an error. The default interval is 50 milliseconds, and checks continue until a timeout is reached. The global default timeout can be set using the configure option:

```javascript
configure({ asyncUtilTimeout: timeout });
```

This default timeout is 1000 milliseconds.

### `waitForElementToBeRemoved` function
A specialized function, waitForElementToBeRemoved, is used to verify that a matching element was present but has since been removed. This function is, in a way, the negation of `waitFor` as it expects the initial expectation to be true, only to turn invalid (throwing an error) on subsequent runs. It operates using the same timeout and interval parameters.

## Fake Timers
Regarding timers, asynchronous tests can take longer to execute due to the delays introduced by asynchronous operations. To mitigate this, fake timers can be used. These are particularly useful when delays are mere waits, such as the 130 milliseconds wait introduced by the UserEvent press() event due to React Native internals. Fake timers allow for fast-forwarding through these wait periods.

Here are the basics of using fake timers:
- Enable fake timers with: `jest.useFakeTimers();`
- Disable fake timers with: `jest.useRealTimers();`
- Move fake timers forward with: `jest.advanceTimersByTime(interval);`
- Run **all timers** to completion with: `jest.runAllTimers();`
- Run **currently pending timers** to completion with: `jest.runOnlyPendingTimers();`

Be cautious when running all timers to completion as it might create an infinite loop if these timers schedule follow-up timers. In such cases, it's safer to use `jest.runOnlyPendingTimers()` to avoid ending up in an infinite loop of scheduled tasks.

These practices and utilities ensure that asynchronous actions in your tests are handled correctly and efficiently, enabling you to simulate real-world interaction scenarios while keeping test execution times as short as possible. By understanding and appropriately applying these tools, you can create robust and reliable tests for applications that rely on asynchronous operations.
