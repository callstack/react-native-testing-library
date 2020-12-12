// @flow
import waitFor from '../waitFor';
import type { WaitForOptions } from '../waitFor';
import { ErrorWithStack } from './errors';

// TODO: fix typing
// is it always string | RegExp for every query?
// what about options for each query?
type QueryArg = string | RegExp;

type QueryFunction<ArgType, ReturnType> = (
  instance: ReactTestInstance
) => (args: ArgType) => ReturnType;

type FindQueryFunction<ArgType, ReturnType> = (
  instance: ReactTestInstance
) => (args: ArgType, waitForOptions?: WaitForOptions) => Promise<ReturnType>;

type QueryAllByQuery = QueryFunction<QueryArg, Array<ReactTestInstance>>;
type QueryByQuery = QueryFunction<QueryArg, null | ReactTestInstance>;

type GetAllByQuery = QueryFunction<QueryArg, Array<ReactTestInstance>>;
type GetByQuery = QueryFunction<QueryArg, ReactTestInstance>;

type FindAllByQuery = FindQueryFunction<QueryArg, Array<ReactTestInstance>>;
type FindByQuery = FindQueryFunction<QueryArg, ReactTestInstance>;

type Queries = {
  getBy: GetByQuery,
  getAllBy: GetAllByQuery,
  queryBy: QueryByQuery,
  findBy: FindByQuery,
  findAllBy: FindAllByQuery,
};

export function makeQueries(
  queryAllByQuery: QueryAllByQuery,
  getMissingError: (args: QueryArg) => string,
  getMultipleError: (args: QueryArg) => string
): Queries {
  function getAllByQuery(instance: ReactTestInstance) {
    return function getAllFn(args: QueryArg) {
      const results = queryAllByQuery(instance)(args);

      if (results.length === 0) {
        throw new ErrorWithStack(getMissingError(args), getAllFn);
      }

      return results;
    };
  }

  function queryByQuery(instance: ReactTestInstance) {
    return function singleQueryFn(args: QueryArg) {
      const results = queryAllByQuery(instance)(args);

      if (results.length > 1) {
        throw new ErrorWithStack(getMultipleError(args), singleQueryFn);
      }

      if (results.length === 0) {
        return null;
      }

      return results[0];
    };
  }

  function getByQuery(instance: ReactTestInstance) {
    return function getFn(args: QueryArg) {
      const results = queryAllByQuery(instance)(args);

      if (results.length > 1) {
        throw new ErrorWithStack(getMultipleError(args), getFn);
      }

      if (results.length === 0) {
        throw new ErrorWithStack(getMissingError(args), getFn);
      }

      return results[0];
    };
  }

  function findAllByQuery(instance: ReactTestInstance) {
    return function findAllFn(
      args: QueryArg,
      waitForOptions?: WaitForOptions = {}
    ) {
      return waitFor(() => getAllByQuery(instance)(args), waitForOptions);
    };
  }

  function findByQuery(instance: ReactTestInstance) {
    return function findFn(
      args: QueryArg,
      waitForOptions?: WaitForOptions = {}
    ) {
      return waitFor(() => getByQuery(instance)(args), waitForOptions);
    };
  }

  return {
    getBy: getByQuery,
    getAllBy: getAllByQuery,
    queryBy: queryByQuery,
    findBy: findByQuery,
    findAllBy: findAllByQuery,
  };
}
