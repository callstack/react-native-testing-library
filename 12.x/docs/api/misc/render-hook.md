# `renderHook` function

```ts
function renderHook<Result, Props>(
  callback: (props?: Props) => Result,
  options?: RenderHookOptions<Props>
): RenderHookResult<Result, Props>;
```

Renders a test component that will call the provided `callback`, including any hooks it calls, every time it renders. Returns [`RenderHookResult`](#renderhookresult) object, which you can interact with.

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

## `options`

A `RenderHookOptions<Props>` object to modify the execution of the `callback` function, containing the following properties:

### `initialProps`

The initial values to pass as `props` to the `callback` function of `renderHook`. The `Props` type is determined by the type passed to or inferred by the `renderHook` call.

### `wrapper`

A React component to wrap the test component in when rendering. This is usually used to add context providers from `React.createContext` for the hook to access with `useContext`.

## `RenderHookResult`

```ts
interface RenderHookResult<Result, Props> {
  result: { current: Result };
  rerender: (props: Props) => void;
  unmount: () => void;
}
```

The `renderHook` function returns an object that has the following properties:

### `result`

The `current` value of the `result` will reflect the latest of whatever is returned from the `callback` passed to `renderHook`. The `Result` type is determined by the type passed to or inferred by the `renderHook` call.

### `rerender`

A function to rerender the test component, causing any hooks to be recalculated. If `newProps` are passed, they will replace the `callback` function's `initialProps` for subsequent rerenders. The `Props` type is determined by the type passed to or inferred by the `renderHook` call.

### `unmount`

A function to unmount the test component. This is commonly used to trigger cleanup effects for `useEffect` hooks.

## Examples

Here we present some extra examples of using `renderHook` API.

### With `initialProps`

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

### With `wrapper`

```tsx
it('should use context value', () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Context.Provider value="provided">{children}</Context.Provider>;
  }

  const { result } = renderHook(() => useHook(), { wrapper: Wrapper });
  // ...
});
```
