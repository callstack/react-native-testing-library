import type { ReactNode } from 'react';
import React from 'react';
import TestRenderer from 'universal-test-renderer';

import { renderHook } from '../pure';

test('gives committed result', () => {
  const { result } = renderHook(() => {
    const [state, setState] = React.useState(1);

    React.useEffect(() => {
      setState(2);
    }, []);

    return [state, setState];
  });

  expect(result.current).toEqual([2, expect.any(Function)]);
});

test('allows rerendering', () => {
  const { result, rerender } = renderHook(
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

test('allows wrapper components', () => {
  const Context = React.createContext('default');
  function Wrapper({ children }: { children: ReactNode }) {
    return <Context.Provider value="provided">{children}</Context.Provider>;
  }
  const { result } = renderHook(
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

test('props type is inferred correctly when initial props is defined', () => {
  const { result, rerender } = renderHook((num: number) => useMyHook(num), {
    initialProps: 5,
  });
  expect(result.current.param).toBe(5);

  rerender(6);
  expect(result.current.param).toBe(6);
});

test('props type is inferred correctly when initial props is explicitly undefined', () => {
  const { result, rerender } = renderHook((num: number | undefined) => useMyHook(num), {
    initialProps: undefined,
  });

  expect(result.current.param).toBeUndefined();

  rerender(6);
  expect(result.current.param).toBe(6);
});

// TEMP
// /**
//  * This test makes sure that calling renderHook does
//  * not try to detect host component names in any form.
//  * But since there are numerous methods that could trigger that
//  * we check the count of renders using React Test Renderers.
//  */
// test('does render only once', () => {
//   jest.spyOn(TestRenderer, 'create');

//   renderHook(() => {
//     const [state, setState] = React.useState(1);
//     return [state, setState];
//   });

//   expect(TestRenderer.create).toHaveBeenCalledTimes(1);
// });
