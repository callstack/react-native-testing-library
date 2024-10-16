import * as React from 'react';
import { ErrorWithStack } from '../helpers/errors';
import { createQueryByError } from '../helpers/errors';
import { findAll } from '../helpers/find-all';
import { HostElement } from '../renderer/host-element';

const UNSAFE_getByType = (
  instance: HostElement,
): ((type: React.ComponentType<any>) => HostElement) =>
  function getByTypeFn(type: React.ComponentType<any>) {
    const results = findAllByType(instance, type);
    if (results.length === 0) {
      throw new ErrorWithStack(`No instances found with type:\n${type}`, getByTypeFn);
    }
    if (results.length > 1) {
      throw new ErrorWithStack(`Found multiple instances with type:\n${type}`, getByTypeFn);
    }
    return results[0];
  };

const UNSAFE_getAllByType = (
  instance: HostElement,
): ((type: React.ComponentType<any>) => Array<HostElement>) =>
  function getAllByTypeFn(type: React.ComponentType<any>) {
    const results = findAllByType(instance, type);
    if (results.length === 0) {
      throw new ErrorWithStack(`No instances found with type:\n${type}`, getAllByTypeFn);
    }
    return results;
  };

const UNSAFE_queryByType = (
  instance: HostElement,
): ((type: React.ComponentType<any>) => HostElement | null) =>
  function queryByTypeFn(type: React.ComponentType<any>) {
    try {
      return UNSAFE_getByType(instance)(type);
    } catch (error) {
      return createQueryByError(error, queryByTypeFn);
    }
  };

const UNSAFE_queryAllByType =
  (instance: HostElement): ((type: React.ComponentType<any>) => Array<HostElement>) =>
  (type: React.ComponentType<any>) => {
    try {
      return UNSAFE_getAllByType(instance)(type);
    } catch {
      return [];
    }
  };

// Unsafe aliases
export type UnsafeByTypeQueries = {
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => HostElement;
  UNSAFE_getAllByType: <P>(type: React.ComponentType<P>) => Array<HostElement>;
  UNSAFE_queryByType: <P>(type: React.ComponentType<P>) => HostElement | null;
  UNSAFE_queryAllByType: <P>(type: React.ComponentType<P>) => Array<HostElement>;
};

// TODO: migrate to makeQueries pattern
export const bindUnsafeByTypeQueries = (instance: HostElement): UnsafeByTypeQueries => ({
  UNSAFE_getByType: UNSAFE_getByType(instance),
  UNSAFE_getAllByType: UNSAFE_getAllByType(instance),
  UNSAFE_queryByType: UNSAFE_queryByType(instance),
  UNSAFE_queryAllByType: UNSAFE_queryAllByType(instance),
});

function findAllByType(instance: HostElement, type: React.ComponentType<any>) {
  return findAll(instance, (element) => element.type === type);
}
