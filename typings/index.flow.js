// @flow
import * as React from 'react';

type GetReturn = ReactTestInstance;
type GetAllReturn = Array<ReactTestInstance>;
type QueryReturn = ReactTestInstance | null;
type QueryAllReturn = Array<ReactTestInstance> | [];
type FindReturn = Promise<ReactTestInstance>;
type FindAllReturn = Promise<ReactTestInstance[]>;

type CommonQueryOptions = {
  includeHiddenElements?: boolean,
  hidden?: boolean,
};

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
  text?: TextMatch,
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

type ByTextOptions = CommonQueryOptions & TextMatchOptions;

interface ByTextQueries {
  getByText: (text: TextMatch, options?: ByTextOptions) => ReactTestInstance;
  getAllByText: (
    text: TextMatch,
    options?: ByTextOptions
  ) => Array<ReactTestInstance>;
  queryByText: (
    name: TextMatch,
    options?: ByTextOptions
  ) => ReactTestInstance | null;
  queryAllByText: (
    text: TextMatch,
    options?: ByTextOptions
  ) => Array<ReactTestInstance> | [];
  findByText: (
    text: TextMatch,
    queryOptions?: ByTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByText: (
    text: TextMatch,
    queryOptions?: ByTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

type ByTestIdOptions = CommonQueryOptions & TextMatchOptions;

interface ByTestIdQueries {
  getByTestId: (
    testID: TextMatch,
    options?: ByTestIdOptions
  ) => ReactTestInstance;
  getAllByTestId: (
    testID: TextMatch,
    options?: ByTestIdOptions
  ) => Array<ReactTestInstance>;
  queryByTestId: (
    testID: TextMatch,
    options?: ByTestIdOptions
  ) => ReactTestInstance | null;
  queryAllByTestId: (
    testID: TextMatch,
    options?: ByTestIdOptions
  ) => Array<ReactTestInstance> | [];
  findByTestId: (
    testID: TextMatch,
    queryOptions?: ByTestIdOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByTestId: (
    testID: TextMatch,
    queryOptions?: ByTestIdOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

type ByDisplayValueOptions = CommonQueryOptions & TextMatchOptions;

interface ByDisplayValueQueries {
  getByDisplayValue: (
    value: TextMatch,
    options?: ByDisplayValueOptions
  ) => ReactTestInstance;
  getAllByDisplayValue: (
    value: TextMatch,
    options?: ByDisplayValueOptions
  ) => Array<ReactTestInstance>;
  queryByDisplayValue: (
    value: TextMatch,
    options?: ByDisplayValueOptions
  ) => ReactTestInstance | null;
  queryAllByDisplayValue: (
    value: TextMatch,
    options?: ByDisplayValueOptions
  ) => Array<ReactTestInstance> | [];
  findByDisplayValue: (
    value: TextMatch,
    queryOptions?: ByDisplayValueOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByDisplayValue: (
    value: TextMatch,
    queryOptions?: ByDisplayValueOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

type ByPlaceholderTextOptions = CommonQueryOptions & TextMatchOptions;

interface ByPlaceholderTextQueries {
  getByPlaceholderText: (
    placeholder: TextMatch,
    options?: ByPlaceholderTextOptions
  ) => ReactTestInstance;
  getAllByPlaceholderText: (
    placeholder: TextMatch,
    options?: ByPlaceholderTextOptions
  ) => Array<ReactTestInstance>;
  queryByPlaceholderText: (
    placeholder: TextMatch,
    options?: ByPlaceholderTextOptions
  ) => ReactTestInstance | null;
  queryAllByPlaceholderText: (
    placeholder: TextMatch,
    options?: ByPlaceholderTextOptions
  ) => Array<ReactTestInstance> | [];
  findByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: ByPlaceholderTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: ByPlaceholderTextOptions,
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

type ByRoleOptions = CommonQueryOptions & {
  ...A11yState,
  name?: string,
  value?: A11yValue,
};

type ByLabelTextOptions = CommonQueryOptions & TextMatchOptions;
type ByHintTextOptions = CommonQueryOptions & TextMatchOptions;

interface A11yAPI {
  // Label
  getByLabelText: (
    matcher: TextMatch,
    options?: ByLabelTextOptions
  ) => GetReturn;
  getAllByLabelText: (
    matcher: TextMatch,
    options?: ByLabelTextOptions
  ) => GetAllReturn;
  queryByLabelText: (
    matcher: TextMatch,
    options?: ByLabelTextOptions
  ) => QueryReturn;
  queryAllByLabelText: (
    matcher: TextMatch,
    options?: ByLabelTextOptions
  ) => QueryAllReturn;
  findByLabelText: (
    matcher: TextMatch,
    queryOptions?: ByLabelTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByLabelText: (
    matcher: TextMatch,
    queryOptions?: ByLabelTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Hint
  getByA11yHint: (matcher: TextMatch, options?: ByHintTextOptions) => GetReturn;
  getByHintText: (matcher: TextMatch, options?: ByHintTextOptions) => GetReturn;
  getAllByA11yHint: (
    matcher: TextMatch,
    options?: ByHintTextOptions
  ) => GetAllReturn;
  getAllByHintText: (
    matcher: TextMatch,
    options?: ByHintTextOptions
  ) => GetAllReturn;
  queryByA11yHint: (
    matcher: TextMatch,
    options?: ByHintTextOptions
  ) => QueryReturn;
  queryByHintText: (
    matcher: TextMatch,
    options?: ByHintTextOptions
  ) => QueryReturn;
  queryAllByA11yHint: (
    matcher: TextMatch,
    options?: ByHintTextOptions
  ) => QueryAllReturn;
  queryAllByHintText: (
    matcher: TextMatch,
    options?: ByHintTextOptions
  ) => QueryAllReturn;
  findByA11yHint: (
    matcher: TextMatch,
    queryOptions?: ByHintTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByHintText: (
    matcher: TextMatch,
    queryOptions?: ByHintTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yHint: (
    matcher: TextMatch,
    queryOptions?: ByHintTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByHintText: (
    matcher: TextMatch,
    queryOptions?: ByHintTextOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Role
  getByRole: (matcher: A11yRole | RegExp, role?: ByRoleOptions) => GetReturn;
  getAllByRole: (
    matcher: A11yRole | RegExp,
    options?: ByRoleOptions
  ) => GetAllReturn;
  queryByRole: (
    matcher: A11yRole | RegExp,
    options?: ByRoleOptions
  ) => QueryReturn;
  queryAllByRole: (
    matcher: A11yRole | RegExp,
    options?: ByRoleOptions
  ) => QueryAllReturn;
  findByRole: (
    matcher: A11yRole | RegExp,
    queryOptions?: ByRoleOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByRole: (
    matcher: A11yRole | RegExp,
    queryOptions?: ByRoleOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // State
  getByA11yState: (
    matcher: A11yState,
    options?: CommonQueryOptions
  ) => GetReturn;
  getAllByA11yState: (
    matcher: A11yState,
    options?: CommonQueryOptions
  ) => GetAllReturn;
  queryByA11yState: (
    matcher: A11yState,
    options?: CommonQueryOptions
  ) => QueryReturn;
  queryAllByA11yState: (
    matcher: A11yState,
    options?: CommonQueryOptions
  ) => QueryAllReturn;
  findByA11yState: (
    matcher: A11yState,
    queryOptions?: CommonQueryOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yState: (
    matcher: A11yState,
    queryOptions?: CommonQueryOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Value
  getByA11yValue: (
    matcher: A11yValue,
    options?: CommonQueryOptions
  ) => GetReturn;
  getAllByA11yValue: (
    matcher: A11yValue,
    options?: CommonQueryOptions
  ) => GetAllReturn;
  queryByA11yValue: (
    matcher: A11yValue,
    options?: CommonQueryOptions
  ) => QueryReturn;
  queryAllByA11yValue: (
    matcher: A11yValue,
    options?: CommonQueryOptions
  ) => QueryAllReturn;
  findByA11yValue: (
    matcher: A11yValue,
    queryOptions?: CommonQueryOptions,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yValue: (
    matcher: A11yValue,
    queryOptions?: CommonQueryOptions,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
}

interface Thenable {
  then: (resolve: () => any, reject?: () => any) => any;
}

type MapPropsFunction = (
  props: { [string]: mixed },
  node: ReactTestRendererJSON
) => { [string]: mixed };

type DebugOptions = {
  message?: string,
  mapProps?: MapPropsFunction,
};

type Debug = {
  (options?: DebugOptions | string): void,
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
    root: ReactTestInstance;
    UNSAFE_root: ReactTestInstance;
    container: ReactTestInstance;
  }

  declare type RenderAPI = RenderResult;

  declare interface RenderOptions {
    wrapper?: React.ComponentType<any>;
    createNodeMock?: (element: React.Element<any>) => any;
    unstable_validateStringsRenderedWithinText?: boolean;
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

  declare interface Config {
    asyncUtilTimeout: number;
    defaultIncludeHiddenElements: boolean;
    defaultDebugOptions?: $Shape<DebugOptions>;
  }

  declare interface ConfigAliasOptions {
    /** Alias to `defaultIncludeHiddenElements` for RTL compatibility */
    defaultHidden: boolean;
  }

  declare export var configure: (
    options: $Shape<Config & ConfigAliasOptions>
  ) => void;
  declare export var resetToDefaults: () => void;

  declare export var act: (callback: () => void) => Thenable;
  declare export var within: (instance: ReactTestInstance) => Queries;
  declare export var getQueriesForElement: (
    element: ReactTestInstance
  ) => Queries;

  declare export var getDefaultNormalizer: (
    normalizerConfig?: NormalizerConfig
  ) => NormalizerFn;

  declare export var isHiddenFromAccessibility: (
    element: ReactTestInstance | null
  ) => boolean;
  declare export var isInaccessible: (
    element: ReactTestInstance | null
  ) => boolean;

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
