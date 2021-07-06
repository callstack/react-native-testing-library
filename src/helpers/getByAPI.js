// @flow
import * as React from 'react';
import prettyFormat from 'pretty-format';
import {
  ErrorWithStack,
  prepareErrorMessage,
  throwRemovedFunctionError,
  throwRenamedFunctionError,
} from './errors';
import { getAllByTestId, getByTestId } from './byTestId';
import { getAllByText, getByText } from './byText';
import {
  getAllByPlaceholderText,
  getByPlaceholderText,
} from './byPlaceholderText';
import { getAllByDisplayValue, getByDisplayValue } from './byDisplayValue';
import type { TextMatchOptions } from './byText';

export type GetByAPI = {|
  getByText: (
    text: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance,
  getByPlaceholderText: (
    placeholder: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance,
  getByDisplayValue: (
    value: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance,
  getByTestId: (
    testID: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance,
  getAllByTestId: (
    testID: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>,
  getAllByText: (
    text: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>,
  getAllByPlaceholderText: (
    placeholder: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>,
  getAllByDisplayValue: (
    value: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>,

  // Unsafe aliases
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance,
  UNSAFE_getAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>,
  UNSAFE_getByProps: (props: { [string]: any }) => ReactTestInstance,
  UNSAFE_getAllByProps: (props: { [string]: any }) => Array<ReactTestInstance>,

  getByName: () => void,
  getByType: () => void,
  getByProps: () => void,
  getAllByName: () => void,
  getAllByType: () => void,
  getAllByProps: () => void,

  getByPlaceholder: () => void,
  getAllByPlaceholder: () => void,
|};

export const UNSAFE_getByType = (
  instance: ReactTestInstance
): ((type: React.ComponentType<any>) => ReactTestInstance) =>
  function getByTypeFn(type: React.ComponentType<any>) {
    try {
      return instance.findByType(type);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTypeFn);
    }
  };

export const UNSAFE_getByProps = (
  instance: ReactTestInstance
): ((props: { [propName: string]: any }) => ReactTestInstance) =>
  function getByPropsFn(props: { [propName: string]: any }) {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPropsFn);
    }
  };

export const UNSAFE_getAllByType = (
  instance: ReactTestInstance
): ((type: React.ComponentType<any>) => Array<ReactTestInstance>) =>
  function getAllByTypeFn(type: React.ComponentType<any>) {
    const results = instance.findAllByType(type);
    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllByTypeFn);
    }
    return results;
  };

export const UNSAFE_getAllByProps = (
  instance: ReactTestInstance
): ((props: { [propName: string]: any }) => Array<ReactTestInstance>) =>
  function getAllByPropsFn(props: { [propName: string]: any }) {
    const results = instance.findAllByProps(props);
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with props:\n${prettyFormat(props)}`,
        getAllByPropsFn
      );
    }
    return results;
  };

export const getByAPI = (instance: ReactTestInstance): GetByAPI => ({
  getByText: getByText(instance),
  getByPlaceholderText: getByPlaceholderText(instance),
  getByDisplayValue: getByDisplayValue(instance),
  getByTestId: getByTestId(instance),
  getAllByText: getAllByText(instance),
  getAllByPlaceholderText: getAllByPlaceholderText(instance),
  getAllByDisplayValue: getAllByDisplayValue(instance),
  getAllByTestId: getAllByTestId(instance),

  // Unsafe
  UNSAFE_getByType: UNSAFE_getByType(instance),
  UNSAFE_getAllByType: UNSAFE_getAllByType(instance),
  UNSAFE_getByProps: UNSAFE_getByProps(instance),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(instance),

  // Removed
  getByName: () =>
    throwRemovedFunctionError('getByName', 'migration-v2#removed-functions'),
  getAllByName: () =>
    throwRemovedFunctionError('getAllByName', 'migration-v2#removed-functions'),
  getByType: () =>
    throwRemovedFunctionError('getByType', 'migration-v2#removed-functions'),
  getAllByType: () =>
    throwRemovedFunctionError('getAllByType', 'migration-v2#removed-functions'),
  getByProps: () =>
    throwRemovedFunctionError('getByProps', 'migration-v2#removed-functions'),
  getAllByProps: () =>
    throwRemovedFunctionError(
      'getAllByProps',
      'migration-v2#removed-functions'
    ),

  // Renamed
  getByPlaceholder: () =>
    throwRenamedFunctionError('getByPlaceholder', 'getByPlaceholderText'),
  getAllByPlaceholder: () =>
    throwRenamedFunctionError('getAllByPlaceholder', 'getByPlaceholderText'),
});
