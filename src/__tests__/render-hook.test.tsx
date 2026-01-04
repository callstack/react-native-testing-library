import type { ReactNode } from 'react';
import * as React from 'react';
import { Text } from 'react-native';

import { act, renderHook } from '..';
import { excludeConsoleMessage } from '../test-utils/console';

// eslint-disable-next-line no-console
const originalConsoleError = console.error;
afterEach(() => {
  // eslint-disable-next-line no-console
  console.error = originalConsoleError;
});

test('renders hook and waits for effects to complete', async () => {
  const { result } = await renderHook(() => {
    const [state, setState] = React.useState(1);

    React.useEffect(() => {
      setState(2);
    }, []);

    return [state, setState];
  });

  expect(result.current).toEqual([2, expect.any(Function)]);
});

test('handles multiple state updates in single effect', async () => {
  function useTestHook() {
    const [first, setFirst] = React.useState(1);
    const [second, setSecond] = React.useState(2);

    React.useEffect(() => {
      setFirst(10);
      setSecond(20);
    }, []);

    return { first, second };
  }

  const { result } = await renderHook(useTestHook);
  expect(result.current).toEqual({ first: 10, second: 20 });
});

test('renders hook with initialProps', async () => {
  function useTestHook(props: { value: number }) {
    const [state, setState] = React.useState(props.value);

    React.useEffect(() => {
      setState(props.value * 2);
    }, [props.value]);

    return state;
  }

  const { result } = await renderHook(useTestHook, {
    initialProps: { value: 5 },
  });
  expect(result.current).toEqual(10);
});

test('rerenders hook with new props', async () => {
  const { result, rerender } = await renderHook(
    (props: { branch: 'left' | 'right' }) => {
      const [left, setLeft] = React.useState('left');
      const [right, setRight] = React.useState('right');

      switch (props.branch) {
        case 'left':
          return [left, setLeft];
        case 'right':
          return [right, setRight];
        default:
          throw new Error('No Props passed. This is a bug in the implementation');
      }
    },
    { initialProps: { branch: 'left' } },
  );

  expect(result.current).toEqual(['left', expect.any(Function)]);

  await rerender({ branch: 'right' });

  expect(result.current).toEqual(['right', expect.any(Function)]);
});

test('rerender updates hook state based on props', async () => {
  function useTestHook(props: { value: number }) {
    const [state, setState] = React.useState(props.value);

    React.useEffect(() => {
      setState(props.value * 2);
    }, [props.value]);

    return state;
  }

  const { result, rerender } = await renderHook(useTestHook, {
    initialProps: { value: 5 },
  });
  expect(result.current).toEqual(10);

  await rerender({ value: 10 });
  expect(result.current).toEqual(20);
});

test('supports wrapper option for context providers', async () => {
  const Context = React.createContext('default');
  function Wrapper({ children }: { children: ReactNode }) {
    return <Context.Provider value="provided">{children}</Context.Provider>;
  }
  const { result } = await renderHook(
    () => {
      return React.useContext(Context);
    },
    {
      wrapper: Wrapper,
    },
  );

  expect(result.current).toEqual('provided');
});

test('unmount triggers cleanup effects', async () => {
  let cleanupCalled = false;

  function useTestHook() {
    React.useEffect(() => {
      return () => {
        cleanupCalled = true;
      };
    }, []);

    return 'test';
  }

  const { unmount } = await renderHook(useTestHook);
  expect(cleanupCalled).toBe(false);

  await unmount();
  expect(cleanupCalled).toBe(true);
});

test('handles cleanup effects on rerender and unmount', async () => {
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

  const { result, rerender, unmount } = await renderHook(useTestHook, {
    initialProps: { key: 'initial' },
  });

  expect(result.current).toBe('initial-effect');
  expect(effectCount).toBe(1);
  expect(cleanupCount).toBe(0);

  await rerender({ key: 'updated' });
  expect(result.current).toBe('updated-effect');
  expect(effectCount).toBe(2);
  expect(cleanupCount).toBe(1);

  await unmount();
  expect(effectCount).toBe(2);
  expect(cleanupCount).toBe(2);
});

function useMyHook<T>(param: T) {
  return { param };
}

test('infers props type from initialProps', async () => {
  const { result, rerender } = await renderHook((num: number) => useMyHook(num), {
    initialProps: 5,
  });
  expect(result.current.param).toBe(5);

  await rerender(6);
  expect(result.current.param).toBe(6);
});

test('infers props type when initialProps is undefined', async () => {
  const { result, rerender } = await renderHook((num: number | undefined) => useMyHook(num), {
    initialProps: undefined,
  });

  expect(result.current.param).toBeUndefined();

  await rerender(6);
  expect(result.current.param).toBe(6);
});

function useSuspendingHook(promise: Promise<string>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: React 18 does not have `use` hook
  return React.use(promise);
}

test('supports React Suspense', async () => {
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

test('handles Suspense errors with error boundary', async () => {
  const ERROR_MESSAGE = 'Hook Promise Rejected In Test';
  // eslint-disable-next-line no-console
  console.error = excludeConsoleMessage(console.error, ERROR_MESSAGE);

  let rejectPromise: (error: Error) => void;
  const promise = new Promise<string>((_resolve, reject) => {
    rejectPromise = reject;
  });

  const { result } = await renderHook(useSuspendingHook, {
    initialProps: promise,
    wrapper: ({ children }) => (
      <ErrorBoundary fallback="error-fallback">
        <React.Suspense fallback={<Text>Loading...</Text>}>{children}</React.Suspense>
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

test('handles hooks with callbacks and complex state', async () => {
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

  const { result } = await renderHook(useCounter, { initialProps: 5 });
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
