import * as React from 'react';
import { AccessibilityState, AccessibilityStates, AccessibilityRole } from 'react-native';
import { ReactTestInstance, ReactTestRendererJSON } from 'react-test-renderer';

export interface GetByAPI {
  getByName: (name: React.ReactType | string) => ReactTestInstance;
  getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance;
  getByText: (text: string | RegExp) => ReactTestInstance;
  getByPlaceholder: (placeholder: string | RegExp) => ReactTestInstance;
  getByDisplayValue: (value: string | RegExp) => ReactTestInstance;
  getByProps: (props: Record<string, any>) => ReactTestInstance;
  getByTestId: (testID: string) => ReactTestInstance;
  getAllByTestId: (testID: string) => Array<ReactTestInstance>;
  getAllByName: (name: React.ReactType | string) => Array<ReactTestInstance>;
  getAllByType: <P>(type: React.ComponentType<P>) => Array<ReactTestInstance>;
  getAllByText: (text: string | RegExp) => Array<ReactTestInstance>;
  getAllByPlaceholder: (
    placeholder: string | RegExp
  ) => Array<ReactTestInstance>;
  getAllByDisplayValue: (value: string | RegExp) => Array<ReactTestInstance>;
  getAllByProps: (props: Record<string, any>) => Array<ReactTestInstance>;


  // Unsafe aliases
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance,
  UNSAFE_getAllByType: <P>(type: React.ComponentType<P>) => Array<ReactTestInstance>,
  UNSAFE_getByProps: (props: Record<string, any>) => ReactTestInstance,
  UNSAFE_getAllByProps: (props: Record<string, any>) => Array<ReactTestInstance>,
}

export interface QueryByAPI {
  queryByName: (name: React.ReactType | string) => ReactTestInstance | null;
  queryByType: <P>(type: React.ComponentType<P>) => ReactTestInstance | null;
  queryByText: (name: string | RegExp) => ReactTestInstance | null;
  queryByPlaceholder: (
    placeholder: string | RegExp
  ) => ReactTestInstance | null;
  queryByDisplayValue: (value: string | RegExp) => ReactTestInstance | null;
  queryByProps: (props: Record<string, any>) => ReactTestInstance | null;
  queryByTestId: (testID: string) => ReactTestInstance | null;
  queryAllByTestId: (testID: string) => Array<ReactTestInstance> | null;
  queryAllByName: (
    name: React.ReactType | string
  ) => Array<ReactTestInstance> | [];
  queryAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance> | [];
  queryAllByText: (text: string | RegExp) => Array<ReactTestInstance> | [];
  queryAllByPlaceholder: (
    placeholder: string | RegExp
  ) => Array<ReactTestInstance> | [];
  queryAllByDisplayValue: (
    value: string | RegExp
  ) => Array<ReactTestInstance> | [];
  queryAllByProps: (
    props: Record<string, any>
  ) => Array<ReactTestInstance> | [];

  // Unsafe aliases
  UNSAFE_queryByType: <P>(type: React.ComponentType<P>) => ReactTestInstance | null,
  UNSAFE_queryAllByType: <P>(type: React.ComponentType<P>) => Array<ReactTestInstance> | [],
  UNSAFE_queryByProps: (props: Record<string, any>) => ReactTestInstance | null,
  UNSAFE_queryAllByProps: (props: Record<string, any>) => Array<ReactTestInstance> | [],
}

type GetReturn = ReactTestInstance;
type GetAllReturn = Array<ReactTestInstance>;
type QueryReturn = ReactTestInstance | null;
type QueryAllReturn = Array<ReactTestInstance> | [];

// Not yet available in DefinitelyTyped
export type A11yValue = {
  min?: number,
  max?: number,
  now?: number,
  text?: string,
};

type A11yAPI = {
  // Label
  getByA11yLabel: (matcher: string | RegExp) => GetReturn,
  getAllByA11yLabel: (matcher: string | RegExp) => GetAllReturn,
  queryByA11yLabel: (matcher: string | RegExp) => QueryReturn,
  queryAllByA11yLabel: (matcher: string | RegExp) => QueryAllReturn,

  // Hint
  getByA11yHint: (matcher: string | RegExp) => GetReturn,
  getAllByA11yHint: (matcher: string | RegExp) => GetAllReturn,
  queryByA11yHint: (matcher: string | RegExp) => QueryReturn,
  queryAllByA11yHint: (matcher: string | RegExp) => QueryAllReturn,

  // Role
  getByA11yRole: (matcher: AccessibilityRole | RegExp) => GetReturn,
  getAllByA11yRole: (matcher: AccessibilityRole | RegExp) => GetAllReturn,
  queryByA11yRole: (matcher: AccessibilityRole | RegExp) => QueryReturn,
  queryAllByA11yRole: (matcher: AccessibilityRole | RegExp) => QueryAllReturn,

  // States
  getByA11yStates: (matcher: AccessibilityStates | Array<AccessibilityStates>) => GetReturn,
  getAllByA11yStates: (matcher: AccessibilityStates | Array<AccessibilityStates>) => GetAllReturn,
  queryByA11yStates: (matcher: AccessibilityStates | Array<AccessibilityStates>) => QueryReturn,
  queryAllByA11yStates: (matcher: AccessibilityStates | Array<AccessibilityStates>) => QueryAllReturn,

  // State
  getByA11yState: (matcher: AccessibilityState) => GetReturn,
  getAllByA11yState: (matcher: AccessibilityState) => GetAllReturn,
  queryByA11yState: (matcher: AccessibilityState) => QueryReturn,
  queryAllByA11yState: (matcher: AccessibilityState) => QueryAllReturn,

  // Value
  getByA11yValue: (matcher: A11yValue) => GetReturn,
  getAllByA11yValue: (matcher: A11yValue) => GetAllReturn,
  queryByA11yValue: (matcher: A11yValue) => QueryReturn,
  queryAllByA11yValue: (matcher: A11yValue) => QueryAllReturn,
};

export interface Thenable {
  then: (resolve: () => any, reject?: () => any) => any;
}

export interface RenderOptions {
  wrapper?: React.ComponentType<any>;
  createNodeMock?: (element: React.ReactElement<any>) => any;
}

export interface RenderAPI extends GetByAPI, QueryByAPI, A11yAPI {
  update(nextElement: React.ReactElement<any>): void;
  rerender(nextElement: React.ReactElement<any>): void;
  unmount(nextElement?: React.ReactElement<any>): void;
  toJSON(): ReactTestRendererJSON | null;
  debug(message?: string): void;
}

export type FireEventFunction = (
  element: ReactTestInstance,
  eventName: string,
  ...data: Array<any>
) => any;

export type FireEventAPI = FireEventFunction & {
  press: (element: ReactTestInstance) => any;
  changeText: (element: ReactTestInstance, ...data: Array<any>) => any;
  scroll: (element: ReactTestInstance, ...data: Array<any>) => any;
};

export type WaitForElementFunction = <T = any>(
  expectation: () => T,
  timeout?: number,
  interval?: number
) => Promise<T>;

export type DebugFunction = (
  instance: ReactTestInstance | React.ReactElement<any>,
  message?: string
) => void;

export type DebugAPI = DebugFunction & {
  shallow: DebugFunction;
  deep: (
    instance: React.ReactElement<any> | ReactTestRendererJSON | null,
    message?: string
  ) => void;
};

export declare const render: (
  component: React.ReactElement<any>,
  options?: RenderOptions
) => RenderAPI;
export declare const shallow: <P = {}>(
  instance: ReactTestInstance | React.ReactElement<P>
) => { output: React.ReactElement<P> };
export declare const flushMicrotasksQueue: () => Promise<any>;
export declare const cleanup: () => void;
export declare const debug: DebugAPI;
export declare const fireEvent: FireEventAPI;
export declare const waitForElement: WaitForElementFunction;
export declare const act: (callback: () => void) => Thenable;
