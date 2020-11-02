import * as React from 'react';
import {
  AccessibilityState,
  // @ts-ignore AccessibilityStates was deprecated in RN0.62 https://reactnative.dev/blog/2020/03/26/version-0.62#breaking-changes
  AccessibilityStates,
  AccessibilityRole,
} from 'react-native';
import { ReactTestInstance, ReactTestRendererJSON } from 'react-test-renderer';

type GetReturn = ReactTestInstance;
type GetAllReturn = Array<ReactTestInstance>;
type QueryReturn = ReactTestInstance | null;
type QueryAllReturn = Array<ReactTestInstance> | [];
type FindReturn = Promise<ReactTestInstance>;
type FindAllReturn = Promise<ReactTestInstance[]>;

interface GetByAPI {
  getByText: (text: string | RegExp) => ReactTestInstance;
  getByPlaceholderText: (placeholder: string | RegExp) => ReactTestInstance;
  getByDisplayValue: (value: string | RegExp) => ReactTestInstance;
  getByTestId: (testID: string | RegExp) => ReactTestInstance;
  getAllByTestId: (testID: string | RegExp) => Array<ReactTestInstance>;
  getAllByText: (text: string | RegExp) => Array<ReactTestInstance>;
  getAllByPlaceholderText: (
    placeholder: string | RegExp
  ) => Array<ReactTestInstance>;
  getAllByDisplayValue: (value: string | RegExp) => Array<ReactTestInstance>;

  // Unsafe aliases
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance;
  UNSAFE_getAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>;
  UNSAFE_getByProps: (props: Record<string, any>) => ReactTestInstance;
  UNSAFE_getAllByProps: (
    props: Record<string, any>
  ) => Array<ReactTestInstance>;

  // Removed
  /**
   * @deprecated This function has been removed. Please use other queries.
   */
  getByName: (name: React.ReactType | string) => ReactTestInstance;
  /**
   * @deprecated This function has been renamed to `UNSAFE_getByType`.
   */
  getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance;
  /**
   * @deprecated This function has been renamed to `UNSAFE_getByProps`.
   */
  getByProps: (props: Record<string, any>) => ReactTestInstance;
  /**
   * @deprecated This function has been removed. Please use other queries.
   */
  getAllByName: (name: React.ReactType | string) => Array<ReactTestInstance>;
  /**
   * @deprecated This function has been renamed to `UNSAFE_getAllByType`.
   */
  getAllByType: <P>(type: React.ComponentType<P>) => Array<ReactTestInstance>;
  /**
   * @deprecated This function has been renamed to `UNSAFE_getAllByProps`.
   */
  getAllByProps: (props: Record<string, any>) => Array<ReactTestInstance>;
}

interface QueryByAPI {
  queryByText: (name: string | RegExp) => ReactTestInstance | null;
  queryByPlaceholderText: (
    placeholder: string | RegExp
  ) => ReactTestInstance | null;
  queryByDisplayValue: (value: string | RegExp) => ReactTestInstance | null;
  queryByTestId: (testID: string | RegExp) => ReactTestInstance | null;
  queryAllByTestId: (testID: string | RegExp) => Array<ReactTestInstance> | [];
  queryAllByText: (text: string | RegExp) => Array<ReactTestInstance> | [];
  queryAllByPlaceholderText: (
    placeholder: string | RegExp
  ) => Array<ReactTestInstance> | [];
  queryAllByDisplayValue: (
    value: string | RegExp
  ) => Array<ReactTestInstance> | [];

  // Unsafe aliases
  UNSAFE_queryByType: <P>(
    type: React.ComponentType<P>
  ) => ReactTestInstance | null;
  UNSAFE_queryAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance> | [];
  UNSAFE_queryByProps: (props: Record<string, any>) => ReactTestInstance | null;
  UNSAFE_queryAllByProps: (
    props: Record<string, any>
  ) => Array<ReactTestInstance> | [];

  // Removed
  /**
   * @deprecated This function has been removed. Please use other queries.
   */
  queryByName: (name: React.ReactType | string) => ReactTestInstance | null;
  /**
   * @deprecated This function has been renamed to `UNSAFE_queryByType`.
   */
  queryByType: <P>(type: React.ComponentType<P>) => ReactTestInstance | null;
  /**
   * @deprecated This function has been renamed to `UNSAFE_queryByProps`.
   */
  queryByProps: (props: Record<string, any>) => ReactTestInstance | null;
  /**
   * @deprecated This function has been removed. Please use other queries.
   */
  queryAllByName: (
    name: React.ReactType | string
  ) => Array<ReactTestInstance> | [];
  /**
   * @deprecated This function has been renamed to `UNSAFE_queryAllByType`.
   */
  queryAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance> | [];
  /**
   * @deprecated This function has been renamed to `UNSAFE_queryAllByProps`.
   */
  queryAllByProps: (
    props: Record<string, any>
  ) => Array<ReactTestInstance> | [];
}

interface FindByAPI {
  findByText: (
    text: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByPlaceholderText: (
    placeholder: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByDisplayValue: (
    value: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByTestId: (
    testID: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByText: (
    text: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByPlaceholderText: (
    placeholder: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByDisplayValue: (
    value: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByTestId: (
    testID: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

// Not yet available in DefinitelyTyped
export type A11yValue = {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
};

type A11yAPI = {
  // Label
  getByA11yLabel: (matcher: string | RegExp) => GetReturn;
  getByLabelText: (matcher: string | RegExp) => GetReturn;
  getAllByA11yLabel: (matcher: string | RegExp) => GetAllReturn;
  getAllByLabelText: (matcher: string | RegExp) => GetAllReturn;
  queryByA11yLabel: (matcher: string | RegExp) => QueryReturn;
  queryByLabelText: (matcher: string | RegExp) => QueryReturn;
  queryAllByA11yLabel: (matcher: string | RegExp) => QueryAllReturn;
  queryAllByLabelText: (matcher: string | RegExp) => QueryAllReturn;
  findByA11yLabel: (
    matcher: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByLabelText: (
    matcher: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yLabel: (
    matcher: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByLabelText: (
    matcher: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Hint
  getByA11yHint: (matcher: string | RegExp) => GetReturn;
  getByHintText: (matcher: string | RegExp) => GetReturn;
  getAllByA11yHint: (matcher: string | RegExp) => GetAllReturn;
  getAllByHintText: (matcher: string | RegExp) => GetAllReturn;
  queryByA11yHint: (matcher: string | RegExp) => QueryReturn;
  queryByHintText: (matcher: string | RegExp) => QueryReturn;
  queryAllByA11yHint: (matcher: string | RegExp) => QueryAllReturn;
  queryAllByHintText: (matcher: string | RegExp) => QueryAllReturn;
  findByA11yHint: (
    matcher: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByHintText: (
    matcher: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yHint: (
    matcher: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByHintText: (
    matcher: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Role
  getByA11yRole: (matcher: AccessibilityRole | RegExp) => GetReturn;
  getByRole: (matcher: AccessibilityRole | RegExp) => GetReturn;
  getAllByA11yRole: (matcher: AccessibilityRole | RegExp) => GetAllReturn;
  getAllByRole: (matcher: AccessibilityRole | RegExp) => GetAllReturn;
  queryByA11yRole: (matcher: AccessibilityRole | RegExp) => QueryReturn;
  queryByRole: (matcher: AccessibilityRole | RegExp) => QueryReturn;
  queryAllByA11yRole: (matcher: AccessibilityRole | RegExp) => QueryAllReturn;
  queryAllByRole: (matcher: AccessibilityRole | RegExp) => QueryAllReturn;
  findByA11yRole: (
    matcher: AccessibilityRole | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByRole: (
    matcher: AccessibilityRole | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yRole: (
    matcher: AccessibilityRole | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByRole: (
    matcher: AccessibilityRole | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // States
  getByA11yStates: (
    matcher: AccessibilityStates | Array<AccessibilityStates>
  ) => GetReturn;
  getAllByA11yStates: (
    matcher: AccessibilityStates | Array<AccessibilityStates>
  ) => GetAllReturn;
  queryByA11yStates: (
    matcher: AccessibilityStates | Array<AccessibilityStates>
  ) => QueryReturn;
  queryAllByA11yStates: (
    matcher: AccessibilityStates | Array<AccessibilityStates>
  ) => QueryAllReturn;

  // State
  getByA11yState: (matcher: AccessibilityState) => GetReturn;
  getAllByA11yState: (matcher: AccessibilityState) => GetAllReturn;
  queryByA11yState: (matcher: AccessibilityState) => QueryReturn;
  queryAllByA11yState: (matcher: AccessibilityState) => QueryAllReturn;
  findByA11yState: (
    matcher: AccessibilityState,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yState: (
    matcher: AccessibilityState,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Value
  getByA11yValue: (matcher: A11yValue) => GetReturn;
  getAllByA11yValue: (matcher: A11yValue) => GetAllReturn;
  queryByA11yValue: (matcher: A11yValue) => QueryReturn;
  queryAllByA11yValue: (matcher: A11yValue) => QueryAllReturn;
  findByA11yValue: (
    matcher: A11yValue,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yValue: (
    matcher: A11yValue,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
};

export interface Thenable {
  then: (resolve: () => any, reject?: () => any) => any;
}

export interface RenderOptions {
  wrapper?: React.ComponentType<any>;
  createNodeMock?: (element: React.ReactElement<any>) => any;
}

type Debug = {
  (message?: string);
  shallow: (message?: string) => void;
};

type Queries = GetByAPI & QueryByAPI & FindByAPI & A11yAPI;

export interface RenderAPI extends Queries {
  update(nextElement: React.ReactElement<any>): void;
  rerender(nextElement: React.ReactElement<any>): void;
  unmount(nextElement?: React.ReactElement<any>): void;
  toJSON(): ReactTestRendererJSON | null;
  debug: Debug;
  container: ReactTestInstance;
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

export declare const render: (
  component: React.ReactElement<any>,
  options?: RenderOptions
) => RenderAPI;

export declare const cleanup: () => void;
export declare const fireEvent: FireEventAPI;

type WaitForOptions = {
  timeout?: number;
  interval?: number;
};

export type WaitForFunction = <T = any>(
  expectation: () => T,
  options?: WaitForOptions
) => Promise<T>;

export declare const waitFor: WaitForFunction;

export type WaitForElementToBeRemovedFunction = <T = any>(
  expectation: () => T,
  options?: WaitForOptions
) => Promise<T>;

export declare const waitForElementToBeRemoved: WaitForElementToBeRemovedFunction;

export declare const act: (callback: () => void) => Thenable;
export declare const within: (instance: ReactTestInstance) => Queries;
export declare const getQueriesForElement: (
  instance: ReactTestInstance
) => Queries;

/**
 * @deprecated This function has been removed. Please use `waitFor` function.
 */
export declare const waitForElement: WaitForFunction;

/**
 * @deprecated This function has been deprecated and will be removed in the next release.
 */
export declare const flushMicrotasksQueue: () => Promise<any>;

/**
 * @deprecated This function has been removed.
 */
export declare const shallow: <P = {}>(
  instance: ReactTestInstance | React.ReactElement<P>
) => { output: React.ReactElement<P> };
