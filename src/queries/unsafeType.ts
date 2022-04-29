import type { ReactTestInstance } from 'react-test-renderer';
import * as React from 'react';
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

// Unsafe aliases
export type UnsafeByTypeQueries = {
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance;
  UNSAFE_getAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>;
  UNSAFE_queryByType: <P>(
    type: React.ComponentType<P>
  ) => ReactTestInstance | null;
  UNSAFE_queryAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>;

  // Renamed
  // TODO: remove in the next release
  queryByType: () => void;
  queryAllByType: () => void;
};

export const bindUnsafeByTypeQueries = (
  instance: ReactTestInstance
): UnsafeByTypeQueries => ({
  UNSAFE_getByType: UNSAFE_getByType(instance),
  UNSAFE_getAllByType: UNSAFE_getAllByType(instance),
  UNSAFE_queryByType: UNSAFE_queryByType(instance),
  UNSAFE_queryAllByType: UNSAFE_queryAllByType(instance),

  // Renamed
  // TODO: remove in the next release
  queryByType: () =>
    throwRemovedFunctionError('queryByType', 'migration-v2#removed-functions'),
  queryAllByType: () =>
    throwRemovedFunctionError(
      'queryAllByType',
      'migration-v2#removed-functions'
    ),
});
