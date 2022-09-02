// @flow
import * as React from 'react';

type GetReturn = ReactTestInstance;
type GetAllReturn = Array<ReactTestInstance>;
type QueryReturn = ReactTestInstance | null;
type QueryAllReturn = Array<ReactTestInstance> | [];
type FindReturn = Promise<ReactTestInstance>;
type FindAllReturn = Promise<ReactTestInstance[]>;

type TextMatch = string | RegExp;

declare type NormalizerFn = (textToNormalize: string) => string;
declare type NormalizerConfig = {
  trim?: boolean,
  collapseWhitespace?: boolean,
};
declare type TextMatchOptions = {
  exact?: boolean,
  normalizer?: NormalizerFn,
};
declare type A11yRole =
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

declare type A11yState = {|
  disabled?: boolean,
  selected?: boolean,
  checked?: boolean | 'mixed',
  busy?: boolean,
  expanded?: boolean,
|};

declare type A11yValue = {
  min?: number,
  max?: number,
  now?: number,
  text?: string,
};

type WaitForOptions = {
  timeout?: number,
  interval?: number,
  onTimeout?: (error: mixed) => Error,
};

type WaitForFunction = <T = any>(
  expectation: () => T,
  options?: WaitForOptions
) => Promise<T>;

interface ByTextQueries {
  getByText: (text: TextMatch, options?: TextMatchOptions) => ReactTestInstance;
  getAllByText: (
    text: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  queryByText: (
    name: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance | null;
  queryAllByText: (
    text: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance> | [];
  findByText: (
    text: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByText: (
    text: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

interface ByTestIdQueries {
  getByTestId: (
    testID: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance;
  getAllByTestId: (
    testID: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  queryByTestId: (testID: TextMatch) => ReactTestInstance | null;
  queryAllByTestId: (testID: TextMatch) => Array<ReactTestInstance> | [];
  findByTestId: (
    testID: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByTestId: (
    testID: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

interface ByDisplayValueQueries {
  getByDisplayValue: (
    value: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance;
  getAllByDisplayValue: (
    value: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  queryByDisplayValue: (
    value: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance | null;
  queryAllByDisplayValue: (
    value: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance> | [];
  findByDisplayValue: (
    value: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByDisplayValue: (
    value: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

interface ByPlaceholderTextQueries {
  getByPlaceholderText: (
    placeholder: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance;
  getAllByPlaceholderText: (
    placeholder: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  queryByPlaceholderText: (
    placeholder: TextMatch,
    options?: TextMatchOptions
  ) => ReactTestInstance | null;
  queryAllByPlaceholderText: (
    placeholder: TextMatch,
    options?: TextMatchOptions
  ) => Array<ReactTestInstance> | [];
  findByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

interface UnsafeByTypeQueries {
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance;
  UNSAFE_getAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>;
  UNSAFE_queryByType: <P>(
    type: React.ComponentType<P>
  ) => ReactTestInstance | null;
  UNSAFE_queryAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance> | [];
}

interface UnsafeByPropsQueries {
  UNSAFE_getByProps: (props: { [string]: any }) => ReactTestInstance;
  UNSAFE_getAllByProps: (props: { [string]: any }) => Array<ReactTestInstance>;
  UNSAFE_queryByProps: (props: { [string]: any }) => ReactTestInstance | null;
  UNSAFE_queryAllByProps: (props: { [string]: any }) =>
    | Array<ReactTestInstance>
    | [];
}
interface A11yAPI {
  // Label
  getByLabelText: (matcher: TextMatch) => GetReturn;
  getAllByLabelText: (matcher: TextMatch) => GetAllReturn;
  queryByLabelText: (matcher: TextMatch) => QueryReturn;
  queryAllByLabelText: (matcher: TextMatch) => QueryAllReturn;
  findByLabelText: (
    matcher: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
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
  getByRole: (matcher: A11yRole | RegExp) => GetReturn;
  getAllByRole: (matcher: A11yRole | RegExp) => GetAllReturn;
  queryByRole: (matcher: A11yRole | RegExp) => QueryReturn;
  queryAllByRole: (matcher: A11yRole | RegExp) => QueryAllReturn;
  findByRole: (
    matcher: A11yRole | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByRole: (
    matcher: A11yRole | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // State
  getByA11yState: (matcher: A11yState) => GetReturn;
  getAllByA11yState: (matcher: A11yState) => GetAllReturn;
  queryByA11yState: (matcher: A11yState) => QueryReturn;
  queryAllByA11yState: (matcher: A11yState) => QueryAllReturn;
  findByA11yState: (
    matcher: A11yState,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yState: (
    matcher: A11yState,
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
}

interface Thenable {
  then: (resolve: () => any, reject?: () => any) => any;
}

type Debug = {
  (message?: string): void,
  shallow: (message?: string) => void,
};

type Queries = ByTextQueries &
  ByTestIdQueries &
  ByDisplayValueQueries &
  ByPlaceholderTextQueries &
  UnsafeByTypeQueries &
  UnsafeByPropsQueries &
  A11yAPI;

type FireEventFunction = (
  element: ReactTestInstance,
  eventName: string,
  ...data: Array<any>
) => any;

type FireEventAPI = FireEventFunction & {
  press: (element: ReactTestInstance, ...data: Array<any>) => any,
  changeText: (element: ReactTestInstance, ...data: Array<any>) => any,
  scroll: (element: ReactTestInstance, ...data: Array<any>) => any,
};

declare module '@testing-library/react-native' {
  declare interface RenderResult extends Queries {
    update(nextElement: React.Element<any>): void;
    rerender(nextElement: React.Element<any>): void;
    unmount(nextElement?: React.Element<any>): void;
    toJSON(): ReactTestRendererJSON[] | ReactTestRendererJSON | null;
    debug: Debug;
    container: ReactTestInstance;
  }

  declare type RenderAPI = RenderResult;

  declare interface RenderOptions {
    wrapper?: React.ComponentType<any>;
    createNodeMock?: (element: React.Element<any>) => any;
  }

  declare export var render: (
    component: React.Element<any>,
    options?: RenderOptions
  ) => RenderResult;

  declare export var screen: RenderResult;

  declare export var cleanup: () => void;
  declare export var fireEvent: FireEventAPI;

  declare export var waitFor: WaitForFunction;

  declare type WaitForElementToBeRemovedFunction = <T = any>(
    expectation: () => T,
    options?: WaitForOptions
  ) => Promise<T>;

  declare export var waitForElementToBeRemoved: WaitForElementToBeRemovedFunction;

  declare export var act: (callback: () => void) => Thenable;
  declare export var within: (instance: ReactTestInstance) => Queries;
  declare export var getQueriesForElement: (
    instance: ReactTestInstance
  ) => Queries;

  declare export var getDefaultNormalizer: (
    normalizerConfig?: NormalizerConfig
  ) => NormalizerFn;

  declare type RenderHookResult<Result, Props> = {
    rerender: (props: Props) => void,
    result: { current: Result },
    unmount: () => void,
  };

  declare type RenderHookOptions<Props> = {
    initialProps?: Props,
    wrapper?: React.ComponentType<any>,
  };

  declare type RenderHookFunction = <Result, Props>(
    renderCallback: (props: Props) => Result,
    options?: RenderHookOptions<Props>
  ) => RenderHookResult<Result, Props>;

  declare export var renderHook: RenderHookFunction;
}
