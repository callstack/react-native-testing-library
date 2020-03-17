import * as React from 'react';
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
}

export type A11yRole =
  | 'none'
  | 'button'
  | 'link'
  | 'search'
  | 'image'
  | 'keyboardkey'
  | 'text'
  | 'adjustable'
  | 'imagebutton'
  | 'header'
  | 'summary'
  | 'alert'
  | 'checkbox'
  | 'combobox'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'scrollbar'
  | 'spinbutton'
  | 'switch'
  | 'tab'
  | 'tablist'
  | 'timer'
  | 'toolbar';

export type A11yState = {
  disabled?: boolean,
  selected?: boolean,
  checked?: boolean | 'mixed',
  busy?: boolean,
  expanded?: boolean,
};

export type A11yStates = 'selected' | 'disabled';

type GetReturn = ReactTestInstance;
type GetAllReturn = Array<ReactTestInstance>;
type QueryReturn = ReactTestInstance | null;
type QueryAllReturn = Array<ReactTestInstance> | [];

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
  getByA11yRole: (matcher: A11yRole | RegExp) => GetReturn,
  getAllByA11yRole: (matcher: A11yRole | RegExp) => GetAllReturn,
  queryByA11yRole: (matcher: A11yRole | RegExp) => QueryReturn,
  queryAllByA11yRole: (matcher: A11yRole | RegExp) => QueryAllReturn,

  // States
  getByA11yStates: (matcher: A11yStates | Array<A11yStates>) => GetReturn,
  getAllByA11yStates: (matcher: A11yStates | Array<A11yStates>) => GetAllReturn,
  queryByA11yStates: (matcher: A11yStates | Array<A11yStates>) => QueryReturn,
  queryAllByA11yStates: (matcher: A11yStates | Array<A11yStates>) => QueryAllReturn,

  // State
  getByA11yState: (matcher: A11yState) => GetReturn,
  getAllByA11yState: (matcher: A11yState) => GetAllReturn,
  queryByA11yState: (matcher: A11yState) => QueryReturn,
  queryAllByA11yState: (matcher: A11yState) => QueryAllReturn,
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
