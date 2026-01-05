import type { ReactNode } from 'react';
import * as React from 'react';

import { unsafe_renderHookSync } from '../../pure';

test('renders hook and returns committed result', () => {
  const { result } = unsafe_renderHookSync(() => {
    const [state, setState] = React.useState(1);

    React.useEffect(() => {
      setState(2);
    }, []);

    return [state, setState];
  });

  expect(result.current).toEqual([2, expect.any(Function)]);
});

test('works with wrapper option', () => {
  const Context = React.createContext('default');
  function Wrapper({ children }: { children: ReactNode }) {
    return <Context.Provider value="provided">{children}</Context.Provider>;
  }
  const { result } = unsafe_renderHookSync(
    () => {
      return React.useContext(Context);
    },
    {
      wrapper: Wrapper,
    },
  );

  expect(result.current).toEqual('provided');
});

test('works with initialProps option', () => {
  const { result } = unsafe_renderHookSync(
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
});

test('works without initialProps option', () => {
  function useTestHook() {
    const [count, setCount] = React.useState(0);
    return { count, setCount };
  }

  const { result } = unsafe_renderHookSync(useTestHook);
  expect(result.current.count).toBe(0);
});

test('rerender updates hook with new props', () => {
  const { result, rerender } = unsafe_renderHookSync(
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

  rerender({ branch: 'right' });
  expect(result.current).toEqual(['right', expect.any(Function)]);
});

test('unmount triggers cleanup effects', () => {
  let cleanupCalled = false;

  function useTestHook() {
    React.useEffect(() => {
      return () => {
        cleanupCalled = true;
      };
    }, []);

    return 'test';
  }

  const { unmount } = unsafe_renderHookSync(useTestHook);
  expect(cleanupCalled).toBe(false);

  unmount();
  expect(cleanupCalled).toBe(true);
});

function useMyHook<T>(param: T) {
  return { param };
}

test('props type is inferred correctly when initial props is defined', () => {
  const { result, rerender } = unsafe_renderHookSync((num: number) => useMyHook(num), {
    initialProps: 5,
  });
  expect(result.current.param).toBe(5);

  rerender(6);
  expect(result.current.param).toBe(6);
});

test('props type is inferred correctly when initial props is explicitly undefined', () => {
  const { result, rerender } = unsafe_renderHookSync((num: number | undefined) => useMyHook(num), {
    initialProps: undefined,
  });

  expect(result.current.param).toBeUndefined();

  rerender(6);
  expect(result.current.param).toBe(6);
});
