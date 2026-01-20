# Understanding `act` function

When writing RNTL tests, one of the things that confuses developers the most are cryptic [`act()`](https://reactjs.org/docs/testing-recipes.html#act) function errors logged to the console. This article explains the purpose and behavior of `act()` so you can write tests with more confidence.

## `act` warnings

Let’s start with typical `act()` warnings logged to console. There are two kinds of these issues, let’s call the first one the "sync `act()`" warning:

```
Warning: An update to Component inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */
```

The second one relates to async usage of `act` so let’s call it the "async `act`" error:

```
Warning: You called act(async () => ...) without await. This could lead to unexpected
testing behaviour, interleaving multiple act calls and mixing their scopes. You should
- await act(async () => ...);
```

## Synchronous `act`

### Responsibility

This function is intended only for using in automated tests and works only in development mode. Attempting to use it in production build will throw an error.

The responsibility for `act` function is to make React renders and updates work in tests in a similar way they work in real application by grouping and executing related units of interaction (e.g. renders, effects, etc) together.

To show that behavior, let's make a small experiment. First we define a function component that uses `useEffect` hook in a trivial way.

```jsx
function TestComponent() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    setCount((c) => c + 1);
  }, []);

  return <Text>Count {count}</Text>;
}
```

In the following tests we will directly use `ReactTestRenderer` instead of RNTL `render` function to render our component for tests. In order to expose familiar queries like `getByText` we will use `within` function from RNTL.

```jsx
test('render without act', () => {
  const renderer = TestRenderer.create(<TestComponent />);

  // Bind RNTL queries for root element.
  const view = within(renderer.root);
  expect(view.getByText('Count 0')).toBeOnTheScreen();
});
```

When testing without wrapping the rendering call in `act`, the assertion runs just after rendering but before `useEffect` hooks effects are applied. This is not what we expected in our tests.

```jsx
test('render with act', () => {
  let renderer: ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(<TestComponent />);
  });

  // Bind RNTL queries for root element.
  const view = within(renderer!.root);
  expect(view.getByText('Count 1')).toBeOnTheScreen();
});
```

When wrapping the rendering call with `act`, the changes caused by the `useEffect` hook are applied as expected.

### When to use act

The name `act` comes from [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert) unit testing pattern. Which means it’s related to part of the test when we execute some actions on the component tree.

The `act` function allows tests to wait for all pending React interactions to be applied before making assertions. When using `act`, we get a guarantee that any state updates will be executed and any enqueued effects will be executed.

Therefore, we should use `act` whenever there is some action that causes element tree to render, particularly:

- initial render call - `ReactTestRenderer.create` call
- re-rendering of component -`renderer.update` call
- triggering any event handlers that cause component tree render

For these basic cases, RNTL handles it for you. Our `render`, `update`, and `fireEvent` methods already wrap their calls in sync `act` so you don't have to do it explicitly.

Note that `act` calls can be safely nested and internally form a stack of calls. However, overlapping `act` calls, which can be achieved using async version of `act`, [are not supported](https://github.com/facebook/react/blob/main/packages/react/src/ReactAct.js#L161).

### Implementation

As of React version of 18.1.0, the `act` implementation is defined in the [ReactAct.js source file](https://github.com/facebook/react/blob/main/packages/react/src/ReactAct.js) inside React repository. This implementation has been fairly stable since React 17.0.

RNTL exports `act` for convenience of the users as defined in the [act.ts source file](https://github.com/callstack/react-native-testing-library/blob/main/src/act.ts). That file refers to [ReactTestRenderer.js source](https://github.com/facebook/react/blob/ce13860281f833de8a3296b7a3dad9caced102e9/packages/react-test-renderer/src/ReactTestRenderer.js#L52) file from React Test Renderer package, which finally leads to React act implementation in ReactAct.js (already mentioned above).

## Asynchronous `act`

So far we have seen synchronous version of `act` which runs its callback immediately. This can deal with things like synchronous effects or mocks using already resolved promises. However, not all component code is synchronous. Frequently our components or mocks contain some asynchronous behaviours like `setTimeout` calls or network calls. Starting from React 16.9, `act` can also be called in asynchronous mode. In such case `act` implementation checks that the passed callback returns [object resembling promise](https://github.com/facebook/react/blob/ce13860281f833de8a3296b7a3dad9caced102e9/packages/react/src/ReactAct.js#L60).

### Asynchronous code

The asynchronous version of `act` is also executed immediately, but the callback doesn't complete right away because of asynchronous operations inside.

Let's look at a simple example with a component using `setTimeout` to simulate asynchronous behavior:

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

test('render async natively', () => {
  render(<TestAsyncComponent />);
  expect(screen.getByText('Count 0')).toBeOnTheScreen();
});
```

If we test our component without handling its asynchronous behavior, we'll get a sync act warning:

```
Warning: An update to TestAsyncComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */
```

This is not yet the async act warning. It only asks us to wrap our event code with `act` calls. However, this time the state change doesn't come from externally triggered events but from an internal part of the component. So how can we apply `act` in this scenario?

### Solution with fake timers

First solution is to use Jest's fake timers inside out tests:

```jsx
test('render with fake timers', () => {
  jest.useFakeTimers();
  render(<TestAsyncComponent />);

  act(() => {
    jest.runAllTimers();
  });
  expect(screen.getByText('Count 1')).toBeOnTheScreen();
});
```

This way we can wrap the `jest.runAllTimers()` call, which triggers the `setTimeout` updates, inside an `act` call, resolving the act warning. Note that this whole code is synchronous thanks to Jest fake timers.

### Solution with real timers

If we wanted to stick with real timers then things get a bit more complex. Let’s start by applying a crude solution of opening async `act()` call for the expected duration of components updates:

```jsx
test('render with real timers - sleep', async () => {
  render(<TestAsyncComponent />);
  await act(async () => {
    await sleep(100); // Wait a bit longer than setTimeout in `TestAsyncComponent`
  });

  expect(screen.getByText('Count 1')).toBeOnTheScreen();
});
```

This works correctly because we use an explicit async `act()` call that resolves the console error. However, it relies on knowing exact implementation details, which is a bad practice.

Let’s try more elegant solution using `waitFor` that will wait for our desired state:

```jsx
test('render with real timers - waitFor', async () => {
  render(<TestAsyncComponent />);

  await waitFor(() => screen.getByText('Count 1'));
  expect(screen.getByText('Count 1')).toBeOnTheScreen();
});
```

This also works correctly because `waitFor` executes async `act()` internally.

The above code can be simplified using `findBy` query:

```jsx
test('render with real timers - findBy', async () => {
  render(<TestAsyncComponent />);

  expect(await screen.findByText('Count 1')).toBeOnTheScreen();
});
```

This also works because `findByText` internally calls `waitFor`, which uses async `act()`.

Note that all of the above examples are async tests using & awaiting async `act()` function call.

### Async act warning

If we modify any of the above async tests and remove the `await` keyword, we'll trigger the async `act()` warning:

```jsx
Warning: You called act(async () => ...) without await. This could lead to unexpected
testing behaviour, interleaving multiple act calls and mixing their scopes. You should
- await act(async () => ...);
```

React decides to show this error whenever it detects that async `act()`call [has not been awaited](https://github.com/facebook/react/blob/ce13860281f833de8a3296b7a3dad9caced102e9/packages/react/src/ReactAct.js#L93).

The exact reasons why you might see async `act()` warnings vary, but it means that `act()` has been called with a callback that returns a `Promise`-like object, but it hasn't been awaited.

## References

- [React `act` implementation source](https://github.com/facebook/react/blob/main/packages/react/src/ReactAct.js)
- [React testing recipes: `act()`](https://reactjs.org/docs/testing-recipes.html#act)
