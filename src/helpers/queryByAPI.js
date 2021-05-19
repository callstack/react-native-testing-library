// @flow
import * as React from 'react';
import type { TextMatchOptions } from './byText';
import {
  UNSAFE_getByType,
  UNSAFE_getByProps,
  UNSAFE_getAllByType,
  UNSAFE_getAllByProps,
} from './getByAPI';
import { queryByTestId, queryAllByTestId } from './byTestId';
import { queryByText, queryAllByText } from './byText';
import {
  queryByPlaceholderText,
  queryAllByPlaceholderText,
} from './byPlaceholderText';
import { queryByDisplayValue, queryAllByDisplayValue } from './byDisplayValue';
import {
  createQueryByError,
  throwRemovedFunctionError,
  throwRenamedFunctionError,
} from './errors';

export type QueryByAPI = {|
  queryByText: (
    name: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance | null,
  queryAllByText: (
    text: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>,
  queryByPlaceholderText: (
    placeholder: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance | null,
  queryAllByPlaceholderText: (
    placeholder: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>,
  queryByDisplayValue: (
    value: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance | null,
  queryAllByDisplayValue: (
    value: string | RegExp,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>,
  queryByTestId: (testID: string | RegExp) => ReactTestInstance | null,
  queryAllByTestId: (testID: string | RegExp) => Array<ReactTestInstance>,

  // Unsafe aliases
  UNSAFE_queryByType: <P>(
    type: React.ComponentType<P>
  ) => ReactTestInstance | null,
  UNSAFE_queryAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>,
  UNSAFE_queryByProps: (props: { [string]: any }) => ReactTestInstance | null,
  UNSAFE_queryAllByProps: (props: {
    [string]: any,
  }) => Array<ReactTestInstance>,
  queryByName: () => void,
  queryByType: () => void,
  queryByProps: () => void,
  queryAllByName: () => void,
  queryAllByType: () => void,
  queryAllByProps: () => void,

  queryByPlaceholder: () => void,
  queryAllByPlaceholder: () => void,
|};

export const UNSAFE_queryByType = (
  instance: ReactTestInstance
): ((type: React.ComponentType<any>) => ReactTestInstance | null) =>
  function queryByTypeFn(type: React.ComponentType<any>) {
    try {
      return UNSAFE_getByType(instance)(type);
    } catch (error) {
      return createQueryByError(error, queryByTypeFn);
    }
  };

export const UNSAFE_queryByProps = (
  instance: ReactTestInstance
): ((props: { [propName: string]: any }) => ReactTestInstance | null) =>
  function queryByPropsFn(props: { [propName: string]: any }) {
    try {
      return UNSAFE_getByProps(instance)(props);
    } catch (error) {
      return createQueryByError(error, queryByPropsFn);
    }
  };

export const UNSAFE_queryAllByType = (
  instance: ReactTestInstance
): ((type: React.ComponentType<any>) => Array<ReactTestInstance>) => (
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
): ((props: {
  [propName: string]: any,
}) => Array<ReactTestInstance>) => (props: { [propName: string]: any }) => {
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
