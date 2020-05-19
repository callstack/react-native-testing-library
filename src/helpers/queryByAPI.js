// @flow
import * as React from 'react';
import {
  getByTestId,
  getByText,
  getByPlaceholder,
  getByDisplayValue,
  getAllByTestId,
  getAllByText,
  getAllByPlaceholder,
  getAllByDisplayValue,
  UNSAFE_getByType,
  UNSAFE_getByProps,
  UNSAFE_getAllByType,
  UNSAFE_getAllByProps,
} from './getByAPI';
import { createQueryByError, throwRemovedFunctionError } from './errors';

export const queryByText = (instance: ReactTestInstance) =>
  function queryByTextFn(text: string | RegExp) {
    try {
      return getByText(instance)(text);
    } catch (error) {
      return createQueryByError(error, queryByTextFn);
    }
  };

export const queryByPlaceholder = (instance: ReactTestInstance) =>
  function queryByPlaceholderFn(placeholder: string | RegExp) {
    try {
      return getByPlaceholder(instance)(placeholder);
    } catch (error) {
      return createQueryByError(error, queryByPlaceholderFn);
    }
  };

export const queryByDisplayValue = (instance: ReactTestInstance) =>
  function queryByDisplayValueFn(value: string | RegExp) {
    try {
      return getByDisplayValue(instance)(value);
    } catch (error) {
      return createQueryByError(error, queryByDisplayValueFn);
    }
  };

export const queryByTestId = (instance: ReactTestInstance) =>
  function queryByTestIdFn(testID: string) {
    try {
      return getByTestId(instance)(testID);
    } catch (error) {
      return createQueryByError(error, queryByTestIdFn);
    }
  };

export const queryAllByText = (instance: ReactTestInstance) => (
  text: string | RegExp
) => {
  try {
    return getAllByText(instance)(text);
  } catch (error) {
    return [];
  }
};

export const queryAllByPlaceholder = (instance: ReactTestInstance) => (
  placeholder: string | RegExp
) => {
  try {
    return getAllByPlaceholder(instance)(placeholder);
  } catch (error) {
    return [];
  }
};

export const queryAllByDisplayValue = (instance: ReactTestInstance) => (
  value: string | RegExp
) => {
  try {
    return getAllByDisplayValue(instance)(value);
  } catch (error) {
    return [];
  }
};

export const queryAllByTestId = (instance: ReactTestInstance) => (
  testID: string
) => {
  try {
    return getAllByTestId(instance)(testID);
  } catch (error) {
    return [];
  }
};

export const UNSAFE_queryByType = (instance: ReactTestInstance) =>
  function queryByTypeFn(type: React.ComponentType<any>) {
    try {
      return UNSAFE_getByType(instance)(type);
    } catch (error) {
      return createQueryByError(error, queryByTypeFn);
    }
  };

export const UNSAFE_queryByProps = (instance: ReactTestInstance) =>
  function queryByPropsFn(props: { [propName: string]: any }) {
    try {
      return UNSAFE_getByProps(instance)(props);
    } catch (error) {
      return createQueryByError(error, queryByPropsFn);
    }
  };

export const UNSAFE_queryAllByType = (instance: ReactTestInstance) => (
  type: React.ComponentType<any>
) => {
  try {
    return UNSAFE_getAllByType(instance)(type);
  } catch (error) {
    return [];
  }
};

export const UNSAFE_queryAllByProps = (instance: ReactTestInstance) => (props: {
  [propName: string]: any,
}) => {
  try {
    return UNSAFE_getAllByProps(instance)(props);
  } catch (error) {
    return [];
  }
};

export const queryByAPI = (instance: ReactTestInstance) => ({
  queryByTestId: queryByTestId(instance),
  queryByText: queryByText(instance),
  queryByPlaceholder: queryByPlaceholder(instance),
  queryByDisplayValue: queryByDisplayValue(instance),
  queryAllByTestId: queryAllByTestId(instance),
  queryAllByText: queryAllByText(instance),
  queryAllByPlaceholder: queryAllByPlaceholder(instance),
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
});
