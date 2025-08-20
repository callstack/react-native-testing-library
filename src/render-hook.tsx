import * as React from 'react';

import render from './render';
import renderAsync from './render-async';
import type { RefObject } from './types';

export type RenderHookResult<Result, Props> = {
  result: RefObject<Result>;
  rerender: (props: Props) => void;
  unmount: () => void;
};

export type RenderHookAsyncResult<Result, Props> = {
  result: RefObject<Result>;
  rerenderAsync: (props: Props) => Promise<void>;
  unmountAsync: () => Promise<void>;
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

  /**
   * Set to `false` to disable concurrent rendering.
   * Otherwise `renderHook` will default to concurrent rendering.
   */
  concurrentRoot?: boolean;
};

export function renderHook<Result, Props>(
  hookToRender: (props: Props) => Result,
  options?: RenderHookOptions<Props>,
): RenderHookResult<Result, Props> {
  const result = React.createRef<Result>() as RefObject<Result>;

  function HookContainer({ hookProps }: { hookProps: Props }) {
    const renderResult = hookToRender(hookProps);
    React.useEffect(() => {
      result.current = renderResult;
    });

    return null;
  }

  const { initialProps, ...renderOptions } = options ?? {};
  const { rerender: rerenderComponent, unmount } = render(
    // @ts-expect-error since option can be undefined, initialProps can be undefined when it should'nt
    <HookContainer hookProps={initialProps} />,
    renderOptions,
  );

  return {
    result: result,
    rerender: (hookProps: Props) => rerenderComponent(<HookContainer hookProps={hookProps} />),
    unmount,
  };
}

export async function renderHookAsync<Result, Props>(
  hookToRender: (props: Props) => Result,
  options?: RenderHookOptions<Props>,
): Promise<RenderHookAsyncResult<Result, Props>> {
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
    rerenderAsync: (hookProps: Props) =>
      rerenderComponentAsync(<TestComponent hookProps={hookProps} />),
    unmountAsync,
  };
}
