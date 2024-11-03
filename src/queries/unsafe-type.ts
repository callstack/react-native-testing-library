import { HostComponent } from 'universal-test-renderer';
import { ErrorWithStack } from '../helpers/errors';
import { createQueryByError } from '../helpers/errors';
import { findAll } from '../helpers/find-all';

const UNSAFE_getByType = (instance: HostComponent): ((type: string) => HostComponent) =>
  function getByTypeFn(type: string) {
    const results = findAllByType(instance, type);
    if (results.length === 0) {
      throw new ErrorWithStack(`No instances found with type:\n${type}`, getByTypeFn);
    }
    if (results.length > 1) {
      throw new ErrorWithStack(`Found multiple instances with type:\n${type}`, getByTypeFn);
    }
    return results[0];
  };

const UNSAFE_getAllByType = (instance: HostComponent): ((type: string) => Array<HostComponent>) =>
  function getAllByTypeFn(type: string) {
    const results = findAllByType(instance, type);
    if (results.length === 0) {
      throw new ErrorWithStack(`No instances found with type:\n${type}`, getAllByTypeFn);
    }
    return results;
  };

const UNSAFE_queryByType = (instance: HostComponent): ((type: string) => HostComponent | null) =>
  function queryByTypeFn(type: string) {
    try {
      return UNSAFE_getByType(instance)(type);
    } catch (error) {
      return createQueryByError(error, queryByTypeFn);
    }
  };

const UNSAFE_queryAllByType =
  (instance: HostComponent): ((type: string) => Array<HostComponent>) =>
  (type: string) => {
    try {
      return UNSAFE_getAllByType(instance)(type);
    } catch {
      return [];
    }
  };

// Unsafe aliases
export type UnsafeByTypeQueries = {
  UNSAFE_getByType: (type: string) => HostComponent;
  UNSAFE_getAllByType: (type: string) => Array<HostComponent>;
  UNSAFE_queryByType: (type: string) => HostComponent | null;
  UNSAFE_queryAllByType: (type: string) => Array<HostComponent>;
};

// TODO: migrate to makeQueries pattern
export const bindUnsafeByTypeQueries = (instance: HostComponent): UnsafeByTypeQueries => ({
  UNSAFE_getByType: UNSAFE_getByType(instance),
  UNSAFE_getAllByType: UNSAFE_getAllByType(instance),
  UNSAFE_queryByType: UNSAFE_queryByType(instance),
  UNSAFE_queryAllByType: UNSAFE_queryAllByType(instance),
});

function findAllByType(instance: HostComponent, type: string) {
  return findAll(instance, (element) => element.type === type);
}
