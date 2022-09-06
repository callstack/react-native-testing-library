import React from 'react';
import type { ComponentType } from 'react';
import render from './render';

export type RenderHookResult<Result, Props> = {
  rerender: (props: Props) => void;
  result: { current: Result };
  unmount: () => void;
};

export type RenderHookOptions<Props> = Props extends
  | object
  | string
  | number
  | boolean
  ? {
      initialProps: Props;
      wrapper?: ComponentType<any>;
    }
  : { wrapper?: ComponentType<any>; initialProps?: never } | undefined;

export function renderHook<Result, Props>(
  renderCallback: (props: Props) => Result,
  options?: RenderHookOptions<Props>
): RenderHookResult<Result, Props> {
  const initialProps = options?.initialProps;
  const wrapper = options?.wrapper;

  const result: React.MutableRefObject<Result | null> = React.createRef();

  function TestComponent({
    renderCallbackProps,
  }: {
    renderCallbackProps: Props;
  }) {
    const renderResult = renderCallback(renderCallbackProps);

    React.useEffect(() => {
      result.current = renderResult;
    });

    return null;
  }

  const { rerender: baseRerender, unmount } = render(
    // @ts-expect-error since option can be undefined, initialProps can be undefined when it should'nt
    <TestComponent renderCallbackProps={initialProps} />,
    { wrapper }
  );

  function rerender(rerenderCallbackProps: Props) {
    return baseRerender(
      <TestComponent renderCallbackProps={rerenderCallbackProps} />
    );
  }

  // @ts-expect-error result is ill typed because ref is initialized to null
  return { result, rerender, unmount };
}
