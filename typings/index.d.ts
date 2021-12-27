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

type TextMatch = string | RegExp;

interface GetByAPI {
  getByText: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance;
  getByPlaceholderText: (
    placeholder: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance;
  getByDisplayValue: (
    value: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance;
  getByTestId: (
    testID: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance;
  getAllByTestId: (
    testID: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  getAllByText: (
    text: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  getAllByPlaceholderText: (
    placeholder: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  getAllByDisplayValue: (
    value: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance>;

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
  queryByText: (
    name: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance | null;
  queryByPlaceholderText: (
    placeholder: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance | null;
  queryByDisplayValue: (
    value: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance | null;
  queryByTestId: (testID: TextMatch) => ReactTestInstance | null;
  queryAllByTestId: (testID: TextMatch) => Array<ReactTestInstance> | [];
  queryAllByText: (
    text: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance> | [];
  queryAllByPlaceholderText: (
    placeholder: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance> | [];
  queryAllByDisplayValue: (
    value: TextMatch,
    options?: TextMatchOptions
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
    text: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByDisplayValue: (
    value: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByTestId: (
    testID: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByText: (
    text: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByDisplayValue: (
    value: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByTestId: (
    testID: TextMatch,
    queryOptions?: TextMatchOptions,
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
  getByA11yLabel: (matcher: TextMatch) => GetReturn;
  getByLabelText: (matcher: TextMatch) => GetReturn;
  getAllByA11yLabel: (matcher: TextMatch) => GetAllReturn;
  getAllByLabelText: (matcher: TextMatch) => GetAllReturn;
  queryByA11yLabel: (matcher: TextMatch) => QueryReturn;
  queryByLabelText: (matcher: TextMatch) => QueryReturn;
  queryAllByA11yLabel: (matcher: TextMatch) => QueryAllReturn;
  queryAllByLabelText: (matcher: TextMatch) => QueryAllReturn;
  findByA11yLabel: (
    matcher: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByLabelText: (
    matcher: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yLabel: (
    matcher: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByLabelText: (
    matcher: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Hint
  getByA11yHint: (matcher: TextMatch) => GetReturn;
  getByHintText: (matcher: TextMatch) => GetReturn;
  getAllByA11yHint: (matcher: TextMatch) => GetAllReturn;
  getAllByHintText: (matcher: TextMatch) => GetAllReturn;
  queryByA11yHint: (matcher: TextMatch) => QueryReturn;
  queryByHintText: (matcher: TextMatch) => QueryReturn;
  queryAllByA11yHint: (matcher: TextMatch) => QueryAllReturn;
  queryAllByHintText: (matcher: TextMatch) => QueryAllReturn;
  findByA11yHint: (
    matcher: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByHintText: (
    matcher: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yHint: (
    matcher: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByHintText: (
    matcher: TextMatch,
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
  (message?: string): void;
  shallow: (message?: string) => void;
};

type Queries = GetByAPI & QueryByAPI & FindByAPI & A11yAPI;

export interface RenderAPI extends Queries {
  update(nextElement: React.ReactElement<any>): void;
  rerender(nextElement: React.ReactElement<any>): void;
  unmount(nextElement?: React.ReactElement<any>): void;
  toJSON(): ReactTestRendererJSON[] | ReactTestRendererJSON | null;
  debug: Debug;
  container: ReactTestInstance;
}

export type FireEventFunction = (
  element: ReactTestInstance,
  eventName: string,
  ...data: Array<any>
) => any;

export type FireEventAPI = FireEventFunction & {
  press: (element: ReactTestInstance, ...data: Array<any>) => any;
  changeText: (element: ReactTestInstance, ...data: Array<any>) => any;
  scroll: (element: ReactTestInstance, ...data: Array<any>) => any;
};

export declare const render: (
  component: React.ReactElement<any>,
  options?: RenderOptions
) => RenderAPI;

export declare const cleanup: () => void;
export declare const fireEvent: FireEventAPI;

type NormalizerFn = (textToNormalize: string) => string;
type NormalizerConfig = {
  trim?: boolean;
  collapseWhitespace?: boolean;
};
type TextMatchOptions = {
  exact?: boolean;
  normalizer?: NormalizerFn;
};

type WaitForOptions = {
  timeout?: number;
  interval?: number;
  onTimeout?: (error: Error) => Error;
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

export declare const getDefaultNormalizer: (
  normalizerConfig?: NormalizerConfig
) => NormalizerFn;

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
