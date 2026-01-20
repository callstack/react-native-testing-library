# `renderHook` function

## `renderHook`

```ts
async function renderHook<Result, Props>(
  hookFn: (props: Props) => Result,
  options?: RenderHookOptions<Props>
): Promise<RenderHookResult<Result, Props>>;
```

Renders a test component that calls the provided `callback` (and any hooks it uses) on each render. Returns a Promise that resolves to a [`RenderHookResult`](#renderhookresult) object.

**This is the recommended default API** for testing hooks. It uses async `act` internally to ensure all pending React updates are executed during rendering. This makes it compatible with async React features like `Suspense` boundaries and the `use()` hook.

- **Returns a Promise**: Should be awaited
- **Async methods**: Both `rerender` and `unmount` return Promises and should be awaited
- **Suspense support**: Compatible with `Suspense` boundaries and `use()` hook

```ts
import { renderHook, act } from '@testing-library/react-native';
import { useCount } from '../useCount';

it('should increment count', async () => {
  const { result } = await renderHook(() => useCount());

  expect(result.current.count).toBe(0);
  await act(() => {
    // Note that you should wrap the calls to functions your hook returns with `act` if they trigger an update of your hook's state to ensure pending useEffects are run before your next assertion.
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```

```ts
// useCount.js
import { useState } from 'react';

export const useCount = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((previousCount) => previousCount + 1);

  return { count, increment };
};
```

The `renderHook` function accepts the following arguments:

**Callback**: A function called on each render of the test component. This function should call one or more hooks for testing.

The callback receives `props` from the `initialProps` option, or from a subsequent `rerender` call if provided.

### `options`

A `RenderHookOptions<Props>` object with the following properties:

#### `initialProps` \{#initial-props}

The initial values to pass as `props` to the `callback` function of `renderHook`. The `Props` type is determined by the type passed to or inferred by the `renderHook` call.

#### `wrapper`

A React component that wraps the test component. Use this to add context providers so hooks can access them with `useContext`.

### Result

```ts
interface RenderHookResult<Result, Props> {
  result: { current: Result };
  rerender: (props: Props) => Promise<void>;
  unmount: () => Promise<void>;
}
```

The `renderHook` function returns a Promise that resolves to an object with the following properties:

#### `result`

The `current` value contains whatever the `callback` returned from `renderHook`. The `Result` type is determined by the type passed to or inferred by the `renderHook` call.

**Note:** When using React Suspense, `result.current` will be `null` while the hook is suspended.

#### `rerender`

An async function that rerenders the test component and recalculates hooks. If `newProps` are passed, they replace the `callback` function's `initialProps` for subsequent rerenders. The `Props` type is determined by the type passed to or inferred by the `renderHook` call.

**Note**: This method returns a Promise and should be awaited.

#### `unmount`

An async function to unmount the test component. This is commonly used to trigger cleanup effects for `useEffect` hooks.

**Note**: This method returns a Promise and should be awaited.

### Examples

Additional examples of using `renderHook`:

#### With `initialProps`

```ts
import { useState, useEffect } from 'react';
import { renderHook, act } from '@testing-library/react-native';

const useCount = (initialCount: number) => {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount((previousCount) => previousCount + 1);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  return { count, increment };
};

it('should increment count', async () => {
  const { result, rerender } = await renderHook((initialCount: number) => useCount(initialCount), {
    initialProps: 1,
  });

  expect(result.current.count).toBe(1);

  await act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(2);
  await rerender(5);
  expect(result.current.count).toBe(5);
});
```

#### With `wrapper`

```tsx
it('should use context value', async () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Context.Provider value="provided">{children}</Context.Provider>;
  }

  const { result } = await renderHook(() => useHook(), { wrapper: Wrapper });
  // ...
});
```

#### With React Suspense

```tsx
import { renderHook, act } from '@testing-library/react-native';
import { Text } from 'react-native';

function useSuspendingHook(promise: Promise<string>) {
  return React.use(promise);
}

it('handles hook with suspense', async () => {
  let resolvePromise: (value: string) => void;
  const promise = new Promise<string>((resolve) => {
    resolvePromise = resolve;
  });

  const { result } = await renderHook(useSuspendingHook, {
    initialProps: promise,
    wrapper: ({ children }) => (
      <React.Suspense fallback={<Text>Loading...</Text>}>{children}</React.Suspense>
    ),
  });

  // Initially suspended, result should not be available
  expect(result.current).toBeNull();

  await act(() => resolvePromise('resolved'));
  expect(result.current).toBe('resolved');
});
```
