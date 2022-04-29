import type { ReactTestInstance } from 'react-test-renderer';
import * as React from 'react';
import prettyFormat from 'pretty-format';
import { ErrorWithStack, prepareErrorMessage } from '../helpers/errors';
import {
  createQueryByError,
  throwRemovedFunctionError,
} from '../helpers/errors';

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

// Unsafe aliases
export type UnsafeByPropsQueries = {
  UNSAFE_getByProps: (props: { [key: string]: any }) => ReactTestInstance;
  UNSAFE_getAllByProps: (props: {
    [key: string]: any;
  }) => Array<ReactTestInstance>;
  UNSAFE_queryByProps: (props: {
    [key: string]: any;
  }) => ReactTestInstance | null;
  UNSAFE_queryAllByProps: (props: {
    [key: string]: any;
  }) => Array<ReactTestInstance>;

  // Removed aliases
  // TODO: remove in the next release
  queryByName: () => void;
  queryByProps: () => void;
  queryAllByName: () => void;
  queryAllByProps: () => void;
};

export const bindUnsafeByPropsQueries = (
  instance: ReactTestInstance
): UnsafeByPropsQueries => ({
  UNSAFE_getByProps: UNSAFE_getByProps(instance),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(instance),
  UNSAFE_queryByProps: UNSAFE_queryByProps(instance),
  UNSAFE_queryAllByProps: UNSAFE_queryAllByProps(instance),

  // Removed aliases
  // TODO: remove in the next release
  queryByName: () =>
    throwRemovedFunctionError('queryByName', 'migration-v2#removed-functions'),
  queryAllByName: () =>
    throwRemovedFunctionError(
      'queryAllByName',
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
