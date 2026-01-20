# React 19 & Suspense Support

React 19 introduced full support for React Suspense, [`React.use()`](https://react.dev/reference/react/use), and other async rendering features to React Native [0.78.0](https://github.com/facebook/react-native/releases/tag/v0.78.0).

When testing components that use these features, React requires the [`async act`](https://react.dev/reference/react/act) helper to handle async state updates. This means React Native Testing Library needs new async versions of its core APIs. These async APIs work with both React 18 and React 19.

## New async APIs

RNTL 13.3 introduces async versions of the core testing APIs to handle React 19's async rendering:

**Rendering APIs:**

- **[`renderAsync`](/react-native-testing-library/docs/api/render.md#render-async)** - async version of `render`
- **[`screen.rerenderAsync`](/react-native-testing-library/docs/api/screen.md#rerender-async)** - async version of `screen.rerender`
- **[`screen.unmountAsync`](/react-native-testing-library/docs/api/screen.md#unmount-async)** - async version of `screen.unmount`

**Event APIs:**

- **[`fireEventAsync`](/react-native-testing-library/docs/api/events/fire-event.md#fire-event-async)** - async version of `fireEvent`

## APIs that remain unchanged

Many existing APIs continue to work without modification:

- **[Query methods](/react-native-testing-library/docs/api/queries.md)**: `screen.getBy*`, `screen.queryBy*`, `screen.findBy*` - all work the same
- **[User Event API](/react-native-testing-library/docs/api/events/user-event.md)** - already async, so no API changes needed
- **[Jest matchers](/react-native-testing-library/docs/api/jest-matchers.md)** - work with already-rendered output, so no changes required

## What changes in your tests

### Making tests async

The main change is using [`renderAsync`](/react-native-testing-library/docs/api/render.md#renderasync) instead of `render`, which requires:

1. Making your test function `async`
2. Adding `await` before `renderAsync`

```tsx
// Synchronous approach (React 18 pattern)
test('my component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});

// Async approach (React 19 ready)
test('my component', async () => {
  await renderAsync(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

### When to use async APIs

Use the async APIs when your components:

- Use React Suspense for data fetching or code splitting
- Call `React.use()` for reading promises or context
- Have async state updates that need proper `act()` handling

## Migration strategy

### New projects

Use the async-ready APIs (`renderAsync`, User Event, Jest Matchers, etc.) from the start. They work with both React 18 and React 19.

### Existing projects

You can migrate gradually:

- **Existing tests** continue to work with synchronous APIs (`render`, etc.)
- **New tests** should use async APIs
- **Tests with Suspense/`React.use()`** must use async APIs

### Future direction

Async APIs will become the default recommendation as React 19 adoption grows. Starting with them now saves migration effort.
