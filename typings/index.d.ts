import * as React from 'react';
import { ReactTestInstance, ReactTestRendererJSON } from 'react-test-renderer';

export interface GetByAPI {
  getByText: (text: string | RegExp) => ReactTestInstance;
  getByPlaceholder: (placeholder: string | RegExp) => ReactTestInstance;
  getByTestId: (testID: string) => ReactTestInstance;
  getAllByText: (text: string | RegExp) => Array<ReactTestInstance>;
  getAllByPlaceholder: (placeholder: string | RegExp) => Array<ReactTestInstance>;
}

export interface QueryByAPI {
  queryByText: (name: string | RegExp) => ReactTestInstance | null;
  queryByPlaceholder: (placeholder: string | RegExp) => ReactTestInstance | null;
  queryByTestId: (testID: string) => ReactTestInstance | null;
  queryAllByText: (text: string | RegExp) => Array<ReactTestInstance> | [];
  queryAllByPlaceholder: (placeholder: string | RegExp) => Array<ReactTestInstance> | [];
}

export interface Thenable {
  then: (resolve: () => any, reject?: () => any) => any,
}

export interface RenderOptions {
  createNodeMock: (element: React.ReactElement<any>) => any;
}

export interface RenderAPI extends GetByAPI, QueryByAPI {
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
