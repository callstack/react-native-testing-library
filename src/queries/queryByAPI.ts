import type { ReactTestInstance } from 'react-test-renderer';
import * as React from 'react';
import {
  createQueryByError,
  throwRemovedFunctionError,
  throwRenamedFunctionError,
} from '../helpers/errors';
import {
  UNSAFE_getByType,
  UNSAFE_getByProps,
  UNSAFE_getAllByType,
  UNSAFE_getAllByProps,
} from './getByAPI';

export type QueryByAPI = {
  // Unsafe aliases
  UNSAFE_queryByType: <P>(
    type: React.ComponentType<P>
  ) => ReactTestInstance | null;
  UNSAFE_queryAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>;
  UNSAFE_queryByProps: (props: {
    [key: string]: any;
  }) => ReactTestInstance | null;
  UNSAFE_queryAllByProps: (props: {
    [key: string]: any;
  }) => Array<ReactTestInstance>;
  queryByName: () => void;
  queryByType: () => void;
  queryByProps: () => void;
  queryAllByName: () => void;
  queryAllByType: () => void;
  queryAllByProps: () => void;
};

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
  [propName: string]: any;
}) => Array<ReactTestInstance>) => (props: { [propName: string]: any }) => {
  try {
    return UNSAFE_getAllByProps(instance)(props);
  } catch (error) {
    return [];
  }
};

export const queryByAPI = (instance: ReactTestInstance): QueryByAPI => ({
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
