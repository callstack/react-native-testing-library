// @flow
import waitFor from '../waitFor';
import type { WaitForOptions } from '../waitFor';
import { ErrorWithStack } from './errors';

type AllQuery = <T>(
  instance: ReactTestInstance
  // $FlowFixMe - Property @@iterator is missing in T [1] but exists in $Iterable [2]
) => (...args: T) => Array<ReactTestInstance>;

export function makeGetAllQuery<T>(
  allQuery: AllQuery,
  instance: ReactTestInstance,
  getMissingError: (args: T) => string
): (...args: Array<T>) => Array<ReactTestInstance> {
  return function getAllFn(...args: Array<T>) {
    const results = allQuery(instance)(...args);

    if (results.length === 0) {
      throw new ErrorWithStack(getMissingError(...args), getAllFn);
    }

    return results;
  };
}

export function makeSingleQuery<T>(
  allQuery: AllQuery,
  instance: ReactTestInstance,
  getMultipleError: (args: T) => string
): (...args: Array<T>) => null | ReactTestInstance {
  return function singleQueryFn(...args: Array<T>) {
    const results = allQuery(instance)(...args);

    if (results.length > 1) {
      throw new ErrorWithStack(getMultipleError(...args), singleQueryFn);
    }

    if (results.length === 0) {
      return null;
    }

    return results[0];
  };
}

export function makeGetQuery<T>(
  allQuery: AllQuery,
  instance: ReactTestInstance,
  getMultipleError: (args: T) => string,
  getMissingError: (args: T) => string
): (...args: Array<T>) => ReactTestInstance {
  return function getFn(...args: Array<T>) {
    const results = allQuery(instance)(...args);

    if (results.length > 1) {
      throw new ErrorWithStack(getMultipleError(...args), getFn);
    }

    if (results.length === 0) {
      throw new ErrorWithStack(getMissingError(...args), getFn);
    }

    return results[0];
  };
}

export function makeFindAllQuery<T>(
  getAllQuery: AllQuery,
  instance: ReactTestInstance
): (
  args: T,
  waitForOptions?: WaitForOptions
) => Promise<Array<ReactTestInstance>> {
  return function findAllFn(args: T, waitForOptions: WaitForOptions = {}) {
    return waitFor(() => getAllQuery(instance)(args), waitForOptions);
  };
}
export function makeFindQuery<T>(
  getQuery: (instance: ReactTestInstance) => (args: any) => ReactTestInstance,
  instance: ReactTestInstance
): (args: T, waitForOptions?: WaitForOptions) => Promise<ReactTestInstance> {
  return function findFn(args: T, waitForOptions: WaitForOptions = {}) {
    return waitFor(() => getQuery(instance)(args), waitForOptions);
  };
}
