# `renderHook` function

## `renderHook`

```ts
function renderHook<Result, Props>(
  hookFn: (props?: Props) => Result,
  options?: RenderHookOptions<Props>
): RenderHookResult<Result, Props>;
```

Renders a test component that calls the provided `callback`, including any hooks it calls, every time it renders. Returns a [`RenderHookResult`](#renderhookresult) object that you can interact with.

```ts
import { renderHook } from '@testing-library/react-native';
import { useCount } from '../useCount';

it('should increment count', () => {
  const { result } = renderHook(() => useCount());

  expect(result.current.count).toBe(0);
  act(() => {
    // Note that you should wrap the calls to functions your hook returns with `act` if they trigger an update of your hook's state to ensure pending useEffects are run before your next assertion.
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```

```ts
// useCount.js
export const useCount = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((previousCount) => previousCount + 1);

  return { count, increment };
};
```

The `renderHook` function accepts the following arguments:

Callback is a function that is called each `render` of the test component. This function should call one or more hooks for testing.

The `props` passed into the callback will be the `initialProps` provided in the `options` to `renderHook`, unless new props are provided by a subsequent `rerender` call.

### `options`

A `RenderHookOptions<Props>` object to modify the execution of the `callback` function, containing the following properties:

#### `initialProps` \{#initial-props}

The initial values to pass as `props` to the `callback` function of `renderHook`. The `Props` type is determined by the type passed to or inferred by the `renderHook` call.

#### `wrapper`

A React component to wrap the test component in when rendering. This is usually used to add context providers from `React.createContext` for the hook to access with `useContext`.

### `concurrentRoot` \{#concurrent-root}

Set to `false` to disable concurrent rendering.
Otherwise, `render` will default to using concurrent rendering used in the React Native New Architecture.

### Result

```ts
interface RenderHookResult<Result, Props> {
  result: { current: Result };
  rerender: (props: Props) => void;
  unmount: () => void;
}
```

The `renderHook` function returns an object that has the following properties:

#### `result`

The `current` value of the `result` will reflect the latest of whatever is returned from the `callback` passed to `renderHook`. The `Result` type is determined by the type passed to or inferred by the `renderHook` call.

#### `rerender`

A function to rerender the test component, causing any hooks to be recalculated. If `newProps` are passed, they replace the `callback` function's `initialProps` for subsequent rerenders. The `Props` type is determined by the type passed to or inferred by the `renderHook` call.

#### `unmount`

A function to unmount the test component. This is commonly used to trigger cleanup effects for `useEffect` hooks.

### Examples

Here are some additional examples of using the `renderHook` API.

#### With `initialProps`

```ts
const useCount = (initialCount: number) => {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount((previousCount) => previousCount + 1);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  return { count, increment };
};

it('should increment count', () => {
  const { result, rerender } = renderHook((initialCount: number) => useCount(initialCount), {
    initialProps: 1,
  });

  expect(result.current.count).toBe(1);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(2);
  rerender(5);
  expect(result.current.count).toBe(5);
});
```

#### With `wrapper`

```tsx
it('should use context value', () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Context.Provider value="provided">{children}</Context.Provider>;
  }

  const { result } = renderHook(() => useHook(), { wrapper: Wrapper });
  // ...
});
```

## `renderHookAsync` function

```ts
async function renderHookAsync<Result, Props>(
  hookFn: (props?: Props) => Result,
  options?: RenderHookOptions<Props>
): Promise<RenderHookAsyncResult<Result, Props>>;
```

Async versions of `renderHook` designed for working with React 19 and React Suspense. This method uses async `act` function internally to ensure all pending React updates are executed during rendering.

- **Returns a Promise**: Should be awaited
- **Async methods**: Both `rerender` and `unmount` return Promises and should be awaited
- **Suspense support**: Compatible with React Suspense boundaries and `React.use()`

### Result \{#result-async}

```ts
interface RenderHookAsyncResult<Result, Props> {
  result: { current: Result };
  rerenderAsync: (props: Props) => Promise<void>;
  unmountAsync: () => Promise<void>;
}
```

The `RenderHookAsyncResult` differs from `RenderHookResult` in that `rerenderAsync` and `unmountAsync` are async functions that return Promises.

```ts
import { renderHookAsync, act } from '@testing-library/react-native';

test('should handle async hook behavior', async () => {
  const { result, rerenderAsync } = await renderHookAsync(useAsyncHook);

  // Test initial state
  expect(result.current.loading).toBe(true);

  // Wait for async operation to complete
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  // Re-render to get updated state
  await rerenderAsync();
  expect(result.current.loading).toBe(false);
});
```

Use `renderHookAsync` when testing hooks that use React Suspense, `React.use()`, or other concurrent features where re-render timing matters.
