import * as React from 'react';

import { renderInternal } from './render';

export type RenderHookResult<Result, Props> = {
  rerender: (props: Props) => void;
  result: React.MutableRefObject<Result>;
  unmount: () => void;
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
  const { initialProps, ...renderOptions } = options ?? {};

  const result: React.MutableRefObject<Result | null> = React.createRef();

  function TestComponent({ hookProps }: { hookProps: Props }) {
    const renderResult = hookToRender(hookProps);

    React.useEffect(() => {
      result.current = renderResult;
    });

    return null;
  }

  const { rerender: componentRerender, unmount } = renderInternal(
    // @ts-expect-error since option can be undefined, initialProps can be undefined when it should'nt
    <TestComponent hookProps={initialProps} />,
    renderOptions,
  );

  function rerender(hookProps: Props) {
    return componentRerender(<TestComponent hookProps={hookProps} />);
  }

  return {
    // Result should already be set after the first render effects are run.
    result: result as React.MutableRefObject<Result>,
    rerender,
    unmount,
  };
}
