// @flow
import * as React from 'react';
import {
  getByTestId,
  getByText,
  getByPlaceholderText,
  getByDisplayValue,
  getAllByTestId,
  getAllByText,
  getAllByPlaceholderText,
  getAllByDisplayValue,
  UNSAFE_getByType,
  UNSAFE_getByProps,
  UNSAFE_getAllByType,
  UNSAFE_getAllByProps,
} from './getByAPI';
import {
  createQueryByError,
  throwRemovedFunctionError,
  throwRenamedFunctionError,
} from './errors';

type QueryByAPI = {|
  queryByText: (name: string | RegExp) => ReactTestInstance | null,
  queryByPlaceholderText: (
    placeholder: string | RegExp
  ) => ReactTestInstance | null,
  queryByDisplayValue: (value: string | RegExp) => ReactTestInstance | null,
  queryByTestId: (testID: string | RegExp) => ReactTestInstance | null,
  queryAllByTestId: (testID: string | RegExp) => Array<ReactTestInstance> | [],
  queryAllByText: (text: string | RegExp) => Array<ReactTestInstance> | [],
  queryAllByPlaceholderText: (
    placeholder: string | RegExp
  ) => Array<ReactTestInstance> | [],
  queryAllByDisplayValue: (
    value: string | RegExp
  ) => Array<ReactTestInstance> | [],

  // Unsafe aliases
  UNSAFE_queryByType: <P>(
    type: React.ComponentType<P>
  ) => ReactTestInstance | null,
  UNSAFE_queryAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance> | [],
  UNSAFE_queryByProps: (props: { [string]: any }) => ReactTestInstance | null,
  UNSAFE_queryAllByProps: (props: { [string]: any }) =>
    | Array<ReactTestInstance>
    | [],

  queryByName: () => void,
  queryByType: () => void,
  queryByProps: () => void,
  queryAllByName: () => void,
  queryAllByType: () => void,
  queryAllByProps: () => void,

  queryByPlaceholder: () => void,
  queryAllByPlaceholder: () => void,
|};

export const queryByText = (
  instance: ReactTestInstance
): ((text: string | RegExp) => any) =>
  function queryByTextFn(text: string | RegExp) {
    try {
      return getByText(instance)(text);
    } catch (error) {
      return createQueryByError(error, queryByTextFn);
    }
  };

export const queryByPlaceholderText = (
  instance: ReactTestInstance
): ((placeholder: string | RegExp) => any) =>
  function queryByPlaceholderTextFn(placeholder: string | RegExp) {
    try {
      return getByPlaceholderText(instance)(placeholder);
    } catch (error) {
      return createQueryByError(error, queryByPlaceholderTextFn);
    }
  };

export const queryByDisplayValue = (
  instance: ReactTestInstance
): ((value: string | RegExp) => any) =>
  function queryByDisplayValueFn(value: string | RegExp) {
    try {
      return getByDisplayValue(instance)(value);
    } catch (error) {
      return createQueryByError(error, queryByDisplayValueFn);
    }
  };

export const queryByTestId = (
  instance: ReactTestInstance
): ((testID: string | RegExp) => any) =>
  function queryByTestIdFn(testID: string | RegExp) {
    try {
      return getByTestId(instance)(testID);
    } catch (error) {
      return createQueryByError(error, queryByTestIdFn);
    }
  };

export const queryAllByText = (
  instance: ReactTestInstance
): ((text: string | RegExp) => any | Array<any>) => (text: string | RegExp) => {
  try {
    return getAllByText(instance)(text);
  } catch (error) {
    return [];
  }
};

export const queryAllByPlaceholderText = (
  instance: ReactTestInstance
): ((placeholder: string | RegExp) => any | Array<any>) => (
  placeholder: string | RegExp
) => {
  try {
    return getAllByPlaceholderText(instance)(placeholder);
  } catch (error) {
    return [];
  }
};

export const queryAllByDisplayValue = (
  instance: ReactTestInstance
): ((value: string | RegExp) => any | Array<any>) => (
  value: string | RegExp
) => {
  try {
    return getAllByDisplayValue(instance)(value);
  } catch (error) {
    return [];
  }
};

export const queryAllByTestId = (
  instance: ReactTestInstance
): ((testID: string | RegExp) => any | Array<any>) => (
  testID: string | RegExp
) => {
  try {
    return getAllByTestId(instance)(testID);
  } catch (error) {
    return [];
  }
};

export const UNSAFE_queryByType = (
  instance: ReactTestInstance
): ((type: React.ComponentType<any>) => any) =>
  function queryByTypeFn(type: React.ComponentType<any>) {
    try {
      return UNSAFE_getByType(instance)(type);
    } catch (error) {
      return createQueryByError(error, queryByTypeFn);
    }
  };

export const UNSAFE_queryByProps = (
  instance: ReactTestInstance
): ((props: { [propName: string]: any }) => any) =>
  function queryByPropsFn(props: { [propName: string]: any }) {
    try {
      return UNSAFE_getByProps(instance)(props);
    } catch (error) {
      return createQueryByError(error, queryByPropsFn);
    }
  };

export const UNSAFE_queryAllByType = (
  instance: ReactTestInstance
): ((type: React.ComponentType<any>) => any | Array<any>) => (
  type: React.ComponentType<any>
) => {
  try {
    return UNSAFE_getAllByType(instance)(type);
  } catch (error) {
    return [];
  }
};

export const UNSAFE_queryAllByProps = (
  instance: ReactTestInstance
): ((props: { [propName: string]: any }) => any | Array<any>) => (props: {
  [propName: string]: any,
}) => {
  try {
    return UNSAFE_getAllByProps(instance)(props);
  } catch (error) {
    return [];
  }
};

export const queryByAPI = (instance: ReactTestInstance): QueryByAPI => ({
  queryByTestId: queryByTestId(instance),
  queryByText: queryByText(instance),
  queryByPlaceholderText: queryByPlaceholderText(instance),
  queryByDisplayValue: queryByDisplayValue(instance),
  queryAllByTestId: queryAllByTestId(instance),
  queryAllByText: queryAllByText(instance),
  queryAllByPlaceholderText: queryAllByPlaceholderText(instance),
  queryAllByDisplayValue: queryAllByDisplayValue(instance),

  // Unsafe
  UNSAFE_queryByType: UNSAFE_queryByType(instance),
  UNSAFE_queryAllByType: UNSAFE_queryAllByType(instance),
  UNSAFE_queryByProps: UNSAFE_queryByProps(instance),
  UNSAFE_queryAllByProps: UNSAFE_queryAllByProps(instance),

  // Removed
  queryByName: () =>
    throwRemovedFunctionError('queryByName', 'migration-v2#removed-functions'),
  queryAllByName: () =>
    throwRemovedFunctionError(
      'queryAllByName',
      'migration-v2#removed-functions'
    ),
  queryByType: () =>
    throwRemovedFunctionError('queryByType', 'migration-v2#removed-functions'),
  queryAllByType: () =>
    throwRemovedFunctionError(
      'queryAllByType',
      'migration-v2#removed-functions'
    ),
  queryByProps: () =>
    throwRemovedFunctionError('queryByProps', 'migration-v2#removed-functions'),
  queryAllByProps: () =>
    throwRemovedFunctionError(
      'queryAllByProps',
      'migration-v2#removed-functions'
    ),

  // Renamed
  queryByPlaceholder: () =>
    throwRenamedFunctionError('queryByPlaceholder', 'queryByPlaceholderText'),
  queryAllByPlaceholder: () =>
    throwRenamedFunctionError(
      'queryAllByPlaceholder',
      'queryAllByPlaceholderText'
    ),
});
