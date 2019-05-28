import * as React from 'react';
import { ReactTestInstance, ReactTestRendererJSON } from 'react-test-renderer';

export interface GetByAPI {
  getByText: (text: string | RegExp) => ReactTestInstance;
  getByPlaceholder: (placeholder: string | RegExp) => ReactTestInstance;
  getByTestId: (testID: string) => ReactTestInstance;
  getAllByText: (text: string | RegExp) => Array<ReactTestInstance>;
  getAllByPlaceholder: (
    placeholder: string | RegExp
  ) => Array<ReactTestInstance>;
}

export interface QueryByAPI {
  queryByText: (name: string | RegExp) => ReactTestInstance | null;
  queryByPlaceholder: (
    placeholder: string | RegExp
  ) => ReactTestInstance | null;
  queryByTestId: (testID: string) => ReactTestInstance | null;
  queryAllByText: (text: string | RegExp) => Array<ReactTestInstance> | [];
  queryAllByPlaceholder: (
    placeholder: string | RegExp
  ) => Array<ReactTestInstance> | [];
}

type QueryFn = (text: string | RegExp) => ReactTestInstance | null;
type GetFn = (text: string | RegExp) => ReactTestInstance;
type GetAllFn = (text: string | RegExp) => Array<ReactTestInstance> | [];
type ArrayQueryFn = (text: string | Array<string>) => ReactTestInstance | null;
type ArrayGetFn = (text: string | Array<string>) => ReactTestInstance;
type ArrayGetAllFn = (
  text: string | Array<string>
) => Array<ReactTestInstance> | [];

export interface A11yAPI {
  getByA11yLabel: GetFn;
  getAllByA11yLabel: GetAllFn;
  queryByA11yLabel: QueryFn;
  queryAllByA11yLabel: GetAllFn;
  getByA11yHint: GetFn;
  getAllByA11yHint: GetAllFn;
  queryByA11yHint: QueryFn;
  queryAllByA11yHint: GetAllFn;
  getByA11yRole: GetFn;
  getAllByA11yRole: GetAllFn;
  queryByA11yRole: QueryFn;
  queryAllByA11yRole: GetAllFn;
  getByA11yStates: ArrayGetFn;
  getAllByA11yStates: ArrayGetAllFn;
  queryByA11yStates: ArrayQueryFn;
  queryAllByA11yStates: ArrayGetAllFn;
}

export interface Thenable {
  then: (resolve: () => any, reject?: () => any) => any;
}

export interface RenderOptions {
  createNodeMock: (element: React.ReactElement<any>) => any;
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
  data?: any
) => any;

export type FireEventAPI = FireEventFunction & {
  press: (element: ReactTestInstance) => any;
  changeText: (element: ReactTestInstance, data?: any) => any;
  scroll: (element: ReactTestInstance, data?: any) => any;
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
export declare const flushMicrotasksQueue: () => Promise<any>;
export declare const debug: DebugAPI;
export declare const fireEvent: FireEventAPI;
export declare const waitForElement: WaitForElementFunction;
export declare const act: (callback: () => void) => Thenable;
