import type { ReactNode } from 'react';
import * as React from 'react';

import { renderHook } from '../pure';

test('gives committed result', async () => {
  const { result } = await renderHook(() => {
    const [state, setState] = React.useState(1);

    React.useEffect(() => {
      setState(2);
    }, []);

    return [state, setState];
  });

  expect(result.current).toEqual([2, expect.any(Function)]);
});

test('allows rerendering', async () => {
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

test('allows wrapper components', async () => {
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

function useMyHook<T>(param: T) {
  return { param };
}

test('props type is inferred correctly when initial props is defined', async () => {
  const { result, rerender } = await renderHook((num: number) => useMyHook(num), {
    initialProps: 5,
  });
  expect(result.current.param).toBe(5);

  await rerender(6);
  expect(result.current.param).toBe(6);
});

test('props type is inferred correctly when initial props is explicitly undefined', async () => {
  const { result, rerender } = await renderHook((num: number | undefined) => useMyHook(num), {
    initialProps: undefined,
  });

  expect(result.current.param).toBeUndefined();

  await rerender(6);
  expect(result.current.param).toBe(6);
});
