# Understanding `act` function

When writing RNTL tests, cryptic [`act()`](https://react.dev/link/wrap-tests-with-act) function errors logged to console often confuse developers. This article explains the purpose and behavior of `act()` so you can write tests with more confidence.

## `act` warning

Let's start with a typical `act()` warning logged to console:

```
An update to Root inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser.
Learn more at https://react.dev/link/wrap-tests-with-act
```

## Understanding `act`

### Responsibility

This function is intended only for using in automated tests and works only in development mode. Attempting to use it in production build will throw an error.

The responsibility for `act` function is to make React renders and updates work in tests in a similar way they work in real application by grouping and executing related units of interaction (e.g. renders, effects, etc) together.

Let's demonstrate this with a small experiment. First, define a function component that uses `useEffect`:

```jsx
function TestComponent() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    setCount((c) => c + 1);
  }, []);

  return <Text>Count {count}</Text>;
}
```

In the following tests we will directly use [Test Renderer](https://github.com/mdjastrzebski/test-renderer) instead of RNTL `render` function to render our component for tests. In order to expose familiar queries like `getByText` we will use `within` function from RNTL.

```jsx
import { createRoot } from 'test-renderer';
import { within } from '@testing-library/react-native';

test('render without act', () => {
  const renderer = createRoot();
  renderer.render(<TestComponent />);

  // Bind RNTL queries for root element.
  const view = within(renderer.container);
  expect(view.getByText('Count 0')).toBeTruthy();
});
```

When testing without `act` wrapping the render call, the assertion runs just after rendering but before `useEffect` effects are applied. This isn't what we expected.

```jsx
import { createRoot } from 'test-renderer';
import { act, within } from '@testing-library/react-native';

test('render with act', async () => {
  const renderer = createRoot();
  await act(() => {
    renderer.render(<TestComponent />);
  });

  // Bind RNTL queries for root element.
  const view = within(renderer.container);
  expect(view.getByText('Count 1')).toBeTruthy();
});
```

**Note**: In v14, `act` is now async by default and always returns a Promise. You should always use `await act(...)`.

When wrapping rendering call with `act` we see that the changes caused by `useEffect` hook have been applied as we would expect.

### When to use act

The name `act` comes from [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert) unit testing pattern. Which means it's related to part of the test when we execute some actions on the component tree.

So far we learned that `act` function allows tests to wait for all pending React interactions to be applied before we make our assertions. When using `act` we get guarantee that any state updates will be executed as well as any enqueued effects will be executed.

Therefore, we should use `act` whenever there is some action that causes element tree to render, particularly:

- initial render call - `renderer.render` call
- re-rendering of component - `renderer.render` call with updated element
- triggering any event handlers that cause component tree render

Thankfully, for these basic cases RNTL has got you covered as our `render`, `rerender` and `fireEvent` methods already wrap their calls in `act` so that you do not have to do it explicitly. In v14, these functions are all async and should be awaited.

Note that `act` calls can be safely nested and internally form a stack of calls.

### Implementation

The `act` implementation is defined in the [ReactAct.js source file](https://github.com/facebook/react/blob/main/packages/react/src/ReactAct.js) inside React repository. RNTL v14 requires React 19+, which provides the `act` function directly via `React.act`.

RNTL exports `act` for convenience as defined in the [act.ts source file](https://github.com/callstack/react-native-testing-library/blob/main/src/act.ts). In v14, `act` is async by default and always returns a Promise. This works with async React features like `Suspense` boundaries and the `use()` hook. The underlying implementation wraps React's `act` function to ensure consistent async behavior.

**Important**: You should always use `act` exported from `@testing-library/react-native` rather than the one from `react`. The RNTL version automatically ensures async behavior, whereas using `React.act` directly could still trigger synchronous act behavior if used improperly, leading to subtle test issues.

## Asynchronous code

In v14, `act` is always async and returns a Promise. While the callback you pass to `act` can be synchronous (dealing with things like synchronous effects or mocks using already resolved promises), the `act` function itself should always be awaited. However, not all component code is synchronous. Frequently our components or mocks contain some asynchronous behaviours like `setTimeout` calls or network calls.

### Handling asynchronous operations

When the callback passed to `act` contains asynchronous operations, the Promise returned by `act` will resolve only after those operations complete.

Here's a simple example with a component using `setTimeout` to simulate asynchronous behavior:

```jsx
function TestAsyncComponent() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    setTimeout(() => {
      setCount((c) => c + 1);
    }, 50);
  }, []);

  return <Text>Count {count}</Text>;
}
```

```jsx
import { render, screen } from '@testing-library/react-native';

test('render async natively', async () => {
  await render(<TestAsyncComponent />);
  expect(screen.getByText('Count 0')).toBeOnTheScreen();
});
```

If we test our component in a native way without handling its asynchronous behaviour we will end up with an act warning. This is because the `setTimeout` callback will trigger a state update after the test has finished.

### Solution with fake timers

Use Jest's fake timers:

```jsx
test('render with fake timers', async () => {
  jest.useFakeTimers();
  await render(<TestAsyncComponent />);

  await act(() => {
    jest.runAllTimers();
  });
  expect(screen.getByText('Count 1')).toBeOnTheScreen();
});
```

**Note**: In v14, both `render` and `act` are async by default, so you should await them.

That way we can wrap `jest.runAllTimers()` call which triggers the `setTimeout` updates inside an `act` call, hence resolving the act warning.

### Solution with real timers

With real timers, things get more complex. Start with a simple solution: wrap an async `act()` call for the expected duration of component updates:

```jsx
test('render with real timers - sleep', async () => {
  await render(<TestAsyncComponent />);
  await act(() => {
    await sleep(100); // Wait a bit longer than setTimeout in `TestAsyncComponent`
  });

  expect(screen.getByText('Count 1')).toBeOnTheScreen();
});
```

This works correctly as we use an explicit async `act()` call that resolves the console error. However, it relies on our knowledge of exact implementation details which is a bad practice.

A better solution uses `waitFor` to wait for the desired state:

```jsx
test('render with real timers - waitFor', async () => {
  await render(<TestAsyncComponent />);

  await waitFor(() => screen.getByText('Count 1'));
  expect(screen.getByText('Count 1')).toBeOnTheScreen();
});
```

This also works correctly, because `waitFor` call executes async `act()` call internally.

The above code can be simplified using `findBy` query:

```jsx
test('render with real timers - findBy', async () => {
  await render(<TestAsyncComponent />);

  expect(await screen.findByText('Count 1')).toBeOnTheScreen();
});
```

This also works since `findByText` internally calls `waitFor` which uses async `act()`.

Note that all of the above examples are async tests using & awaiting async `act()` function call.

## References

- [React `act` implementation source](https://github.com/facebook/react/blob/main/packages/react/src/ReactAct.js)
- [React testing documentation](https://react.dev/link/wrap-tests-with-act)
