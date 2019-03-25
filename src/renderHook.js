// @flow
import * as React from 'react';
import render from './render';

export const renderHook = <THook: (...arg: Array<mixed>) => mixed>(
  hook: THook,
  ...initialParams: Parameters<THook>
) => {
  type HookParameters = Parameters<THook>;
  let result: ReturnType<THook>;

  const HookTestHarness: React.FC<{ parameters: HookParameters }> = ({
    parameters,
  }) => {
    result = hook(...parameters);
    return null;
  };

  const getResult = () => result;

  const { unmount, update } = render(
    <HookTestHarness parameters={initialParams} />
  );

  return {
    getResult,
    unmount,
    rerender: (...newParams: HookParameters) => {
      update(<HookTestHarness parameters={newParams} />);
    },
  };
};
