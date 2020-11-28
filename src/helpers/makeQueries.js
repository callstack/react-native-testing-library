// @flow
import waitFor from '../waitFor';
import type { WaitForOptions } from '../waitFor';
import { ErrorWithStack } from './errors';

type AllQuery = (
  instance: ReactTestInstance
) => (args: any) => Array<ReactTestInstance>;

export const makeGetAllQuery = (
  allQuery: AllQuery,
  instance: ReactTestInstance,
  getMissingElementError: (args: any) => string
) =>
  function getAllFn(...args: Array<any>) {
    const results = allQuery(instance)(...args);
    if (!results.length) {
      throw new ErrorWithStack(getMissingElementError(...args), getAllFn);
    }

    return results;
  };

export const makeSingleQuery = (
  allQuery: AllQuery,
  instance: ReactTestInstance,
  getMissingElementError: (args: any, nbResults: number) => string
) =>
  function singleQueryFn(...args: Array<any>) {
    const results = allQuery(instance)(...args);

    if (results.length > 1) {
      throw new ErrorWithStack(
        getMissingElementError(...args, results.length),
        singleQueryFn
      );
    }

    if (results.length === 0) {
      return null;
    }

    return results[0];
  };

export const makeGetQuery = (
  allQuery: AllQuery,
  instance: ReactTestInstance,
  getMissingElementError: (args: any, nbResults: number) => string
) =>
  function getFn(...args: Array<any>) {
    const results = allQuery(instance)(...args);

    if (results.length !== 1) {
      throw new ErrorWithStack(
        getMissingElementError(...args, results.length),
        getFn
      );
    }

    return results[0];
  };

export const makeFindAllQuery = (
  getAllQuery: AllQuery,
  instance: ReactTestInstance
) =>
  function findAllFn(args: any, waitForOptions: WaitForOptions = {}) {
    return waitFor(() => getAllQuery(instance)(args), waitForOptions);
  };

export const makeFindQuery = (
  getQuery: (instance: ReactTestInstance) => (args: any) => ReactTestInstance,
  instance: ReactTestInstance
) =>
  function findFn(args: any, waitForOptions: WaitForOptions = {}) {
    return waitFor(() => getQuery(instance)(args), waitForOptions);
  };
