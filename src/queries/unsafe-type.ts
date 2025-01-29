import type * as React from 'react';
import type { ReactTestInstance } from 'react-test-renderer';

import { ErrorWithStack, prepareErrorMessage } from '../helpers/errors';
import { createQueryByError } from '../helpers/errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnsafeComponentType = React.ComponentType<any>;

const UNSAFE_getByType = (
  instance: ReactTestInstance,
): ((type: UnsafeComponentType) => ReactTestInstance) =>
  function getByTypeFn(type: UnsafeComponentType) {
    try {
      return instance.findByType(type);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTypeFn);
    }
  };

const UNSAFE_getAllByType = (
  instance: ReactTestInstance,
): ((type: UnsafeComponentType) => Array<ReactTestInstance>) =>
  function getAllByTypeFn(type: UnsafeComponentType) {
    const results = instance.findAllByType(type);
    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllByTypeFn);
    }
    return results;
  };

const UNSAFE_queryByType = (
  instance: ReactTestInstance,
): ((type: UnsafeComponentType) => ReactTestInstance | null) =>
  function queryByTypeFn(type: UnsafeComponentType) {
    try {
      return UNSAFE_getByType(instance)(type);
    } catch (error) {
      return createQueryByError(error, queryByTypeFn);
    }
  };

const UNSAFE_queryAllByType =
  (instance: ReactTestInstance): ((type: UnsafeComponentType) => Array<ReactTestInstance>) =>
  (type: UnsafeComponentType) => {
    try {
      return UNSAFE_getAllByType(instance)(type);
    } catch {
      return [];
    }
  };

// Unsafe aliases
export type UnsafeByTypeQueries = {
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance;
  UNSAFE_getAllByType: <P>(type: React.ComponentType<P>) => Array<ReactTestInstance>;
  UNSAFE_queryByType: <P>(type: React.ComponentType<P>) => ReactTestInstance | null;
  UNSAFE_queryAllByType: <P>(type: React.ComponentType<P>) => Array<ReactTestInstance>;
};

// TODO: migrate to makeQueries pattern
export const bindUnsafeByTypeQueries = (instance: ReactTestInstance): UnsafeByTypeQueries => ({
  UNSAFE_getByType: UNSAFE_getByType(instance),
  UNSAFE_getAllByType: UNSAFE_getAllByType(instance),
  UNSAFE_queryByType: UNSAFE_queryByType(instance),
  UNSAFE_queryAllByType: UNSAFE_queryAllByType(instance),
});
