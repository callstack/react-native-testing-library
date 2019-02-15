// @flow
import * as React from 'react';
import {
  getByTestId,
  getByName,
  getByType,
  getByText,
  getByPlaceholder,
  getByProps,
  getAllByName,
  getAllByType,
  getAllByText,
  getAllByPlaceholder,
  getAllByProps,
} from './getByAPI';
import { ErrorWithStack, logDeprecationWarning } from './errors';

const createQueryByError = (error: Error, callsite: Function) => {
  if (error.message.includes('No instances found')) {
    return null;
  }
  throw new ErrorWithStack(error.message, callsite);
};

export const queryByName = (instance: ReactTestInstance) =>
  function queryByNameFn(name: string | React.ComponentType<*>) {
    logDeprecationWarning('queryByName', 'getByName');
    try {
      return getByName(instance)(name);
    } catch (error) {
      return createQueryByError(error, queryByNameFn);
    }
  };

export const queryByType = (instance: ReactTestInstance) =>
  function queryByTypeFn(type: React.ComponentType<*>) {
    try {
      return getByType(instance)(type);
    } catch (error) {
      return createQueryByError(error, queryByTypeFn);
    }
  };

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
      return createQueryByError(error, queryByPlaceholder);
    }
  };

export const queryByProps = (instance: ReactTestInstance) =>
  function queryByPropsFn(props: { [propName: string]: any }) {
    try {
      return getByProps(instance)(props);
    } catch (error) {
      return createQueryByError(error, queryByPropsFn);
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

export const queryAllByName = (instance: ReactTestInstance) => (
  name: string | React.ComponentType<*>
) => {
  logDeprecationWarning('queryAllByName', 'getAllByName');
  try {
    return getAllByName(instance)(name);
  } catch (error) {
    return [];
  }
};

export const queryAllByType = (instance: ReactTestInstance) => (
  type: React.ComponentType<*>
) => {
  try {
    return getAllByType(instance)(type);
  } catch (error) {
    return [];
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

export const queryAllByProps = (instance: ReactTestInstance) => (props: {
  [propName: string]: any,
}) => {
  try {
    return getAllByProps(instance)(props);
  } catch (error) {
    return [];
  }
};

export const queryByAPI = (instance: ReactTestInstance) => ({
  queryByTestId: queryByTestId(instance),
  queryByName: queryByName(instance),
  queryByType: queryByType(instance),
  queryByText: queryByText(instance),
  queryByPlaceholder: queryByPlaceholder(instance),
  queryByProps: queryByProps(instance),
  queryAllByName: queryAllByName(instance),
  queryAllByType: queryAllByType(instance),
  queryAllByText: queryAllByText(instance),
  queryAllByPlaceholder: queryAllByPlaceholder(instance),
  queryAllByProps: queryAllByProps(instance),
});
