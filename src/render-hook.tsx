import * as React from 'react';

import renderAsync from './render-async';
import type { RefObject } from './types';

export type RenderHookResult<Result, Props> = {
  result: RefObject<Result>;
  rerender: (props: Props) => Promise<void>;
  unmount: () => Promise<void>;
};

export type RenderHookOptions<Props> = {
  /**
   * The initial props to pass to the hook.
   */
  initialProps?: Props;

  /**
   * Pass a React Component as the wrapper option to have it rendered around the inner element. This is most useful for creating
   * reusable custom render functions for common data providers.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper?: React.ComponentType<any>;
};

export async function renderHook<Result, Props>(
  hookToRender: (props: Props) => Result,
  options?: RenderHookOptions<NoInfer<Props>>,
): Promise<RenderHookResult<Result, Props>> {
  const result = React.createRef<Result>() as RefObject<Result>;

  function TestComponent({ hookProps }: { hookProps: Props }) {
    const renderResult = hookToRender(hookProps);
    React.useEffect(() => {
      result.current = renderResult;
    });

    return null;
  }

  const { initialProps, ...renderOptions } = options ?? {};
  const { rerenderAsync: rerenderComponentAsync, unmountAsync } = await renderAsync(
    // @ts-expect-error since option can be undefined, initialProps can be undefined when it should'nt
    <TestComponent hookProps={initialProps} />,
    renderOptions,
  );

  return {
    result: result,
    rerender: (hookProps: Props) => rerenderComponentAsync(<TestComponent hookProps={hookProps} />),
    unmount: unmountAsync,
  };
}
