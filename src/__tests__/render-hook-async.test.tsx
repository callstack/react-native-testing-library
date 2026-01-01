import type { ReactNode } from 'react';
import * as React from 'react';

import { act, renderHookAsync } from '..';
import { excludeConsoleMessage } from '../test-utils/console';

const testGateReact19 = React.version.startsWith('19.') ? test : test.skip;

// eslint-disable-next-line no-console
const originalConsoleError = console.error;
afterEach(() => {
  // eslint-disable-next-line no-console
  console.error = originalConsoleError;
});

function useSuspendingHook(promise: Promise<string>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: React 18 does not have `use` hook
  return React.use(promise);
}

test('renderHookAsync renders hook asynchronously', async () => {
  const { result } = await renderHookAsync(() => {
    const [state, setState] = React.useState(1);

    React.useEffect(() => {
      setState(2);
    }, []);

    return state;
  });

  expect(result.current).toEqual(2);
});

test('renderHookAsync with wrapper option', async () => {
  const Context = React.createContext('default');

  function useTestHook() {
    return React.useContext(Context);
  }

  function Wrapper({ children }: { children: ReactNode }) {
    return <Context.Provider value="provided">{children}</Context.Provider>;
  }

  const { result } = await renderHookAsync(useTestHook, { wrapper: Wrapper });
  expect(result.current).toEqual('provided');
});

test('rerenderAsync function updates hook asynchronously', async () => {
  function useTestHook(props: { value: number }) {
    const [state, setState] = React.useState(props.value);

    React.useEffect(() => {
      setState(props.value * 2);
    }, [props.value]);

    return state;
  }

  const { result, rerenderAsync } = await renderHookAsync(useTestHook, {
    initialProps: { value: 5 },
  });
  expect(result.current).toEqual(10);

  await rerenderAsync({ value: 10 });
  expect(result.current).toEqual(20);
});

test('unmount function unmounts hook asynchronously', async () => {
  let cleanupCalled = false;

  function useTestHook() {
    React.useEffect(() => {
      return () => {
        cleanupCalled = true;
      };
    }, []);

    return 'test';
  }

  const { unmountAsync } = await renderHookAsync(useTestHook);
  expect(cleanupCalled).toBe(false);

  await unmountAsync();
  expect(cleanupCalled).toBe(true);
});

test('handles hook with state updates during effects', async () => {
  function useTestHook() {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
      setCount((prev) => prev + 1);
    }, []);

    return count;
  }

  const { result } = await renderHookAsync(useTestHook);
  expect(result.current).toBe(1);
});

test('handles multiple state updates in effects', async () => {
  function useTestHook() {
    const [first, setFirst] = React.useState(1);
    const [second, setSecond] = React.useState(2);

    React.useEffect(() => {
      setFirst(10);
      setSecond(20);
    }, []);

    return { first, second };
  }

  const { result } = await renderHookAsync(useTestHook);
  expect(result.current).toEqual({ first: 10, second: 20 });
});

testGateReact19('handles hook with suspense', async () => {
  let resolvePromise: (value: string) => void;
  const promise = new Promise<string>((resolve) => {
    resolvePromise = resolve;
  });

  const { result } = await renderHookAsync(useSuspendingHook, {
    initialProps: promise,
    wrapper: ({ children }) => <React.Suspense fallback="loading">{children}</React.Suspense>,
  });

  // Initially suspended, result should not be available
  expect(result.current).toBeNull();

  // eslint-disable-next-line require-await
  await act(async () => resolvePromise('resolved'));
  expect(result.current).toBe('resolved');
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

testGateReact19('handles hook suspense with error boundary', async () => {
  const ERROR_MESSAGE = 'Hook Promise Rejected In Test';
  // eslint-disable-next-line no-console
  console.error = excludeConsoleMessage(console.error, ERROR_MESSAGE);

  let rejectPromise: (error: Error) => void;
  const promise = new Promise<string>((_resolve, reject) => {
    rejectPromise = reject;
  });

  const { result } = await renderHookAsync(useSuspendingHook, {
    initialProps: promise,
    wrapper: ({ children }) => (
      <ErrorBoundary fallback="error-fallback">
        <React.Suspense fallback="loading">{children}</React.Suspense>
      </ErrorBoundary>
    ),
  });

  // Initially suspended
  expect(result.current).toBeNull();

  // eslint-disable-next-line require-await
  await act(async () => rejectPromise(new Error(ERROR_MESSAGE)));

  // After error, result should still be null (error boundary caught it)
  expect(result.current).toBeNull();
});

test('handles custom hooks with complex logic', async () => {
  function useCounter(initialValue: number) {
    const [count, setCount] = React.useState(initialValue);

    const increment = React.useCallback(() => {
      setCount((prev) => prev + 1);
    }, []);

    const decrement = React.useCallback(() => {
      setCount((prev) => prev - 1);
    }, []);

    const reset = React.useCallback(() => {
      setCount(initialValue);
    }, [initialValue]);

    return { count, increment, decrement, reset };
  }

  const { result } = await renderHookAsync(useCounter, { initialProps: 5 });
  expect(result.current.count).toBe(5);

  // eslint-disable-next-line require-await
  await act(async () => {
    result.current.increment();
  });
  expect(result.current.count).toBe(6);

  // eslint-disable-next-line require-await
  await act(async () => {
    result.current.reset();
  });
  expect(result.current.count).toBe(5);

  // eslint-disable-next-line require-await
  await act(async () => {
    result.current.decrement();
  });
  expect(result.current.count).toBe(4);
});

test('handles hook with cleanup and re-initialization', async () => {
  let effectCount = 0;
  let cleanupCount = 0;

  function useTestHook(props: { key: string }) {
    const [value, setValue] = React.useState(props.key);

    React.useEffect(() => {
      effectCount++;
      setValue(`${props.key}-effect`);

      return () => {
        cleanupCount++;
      };
    }, [props.key]);

    return value;
  }

  const { result, rerenderAsync, unmountAsync } = await renderHookAsync(useTestHook, {
    initialProps: { key: 'initial' },
  });

  expect(result.current).toBe('initial-effect');
  expect(effectCount).toBe(1);
  expect(cleanupCount).toBe(0);

  await rerenderAsync({ key: 'updated' });
  expect(result.current).toBe('updated-effect');
  expect(effectCount).toBe(2);
  expect(cleanupCount).toBe(1);

  await unmountAsync();
  expect(effectCount).toBe(2);
  expect(cleanupCount).toBe(2);
});
