// @flow
import waitFor from '../waitFor';
import type { WaitForOptions } from '../waitFor';
import { ErrorWithStack } from './errors';

type QueryFunction<ArgType, ReturnType> = (
  instance: ReactTestInstance
) => (args: ArgType) => ReturnType;

type FindQueryFunction<ArgType, ReturnType> = (
  instance: ReactTestInstance
) => (args: ArgType, waitForOptions?: WaitForOptions) => Promise<ReturnType>;

type QueryAllByQuery<QueryArg> = QueryFunction<
  QueryArg,
  Array<ReactTestInstance>
>;
type QueryByQuery<QueryArg> = QueryFunction<QueryArg, null | ReactTestInstance>;

type GetAllByQuery<QueryArg> = QueryFunction<
  QueryArg,
  Array<ReactTestInstance>
>;
type GetByQuery<QueryArg> = QueryFunction<QueryArg, ReactTestInstance>;

type FindAllByQuery<QueryArg> = FindQueryFunction<
  QueryArg,
  Array<ReactTestInstance>
>;
type FindByQuery<QueryArg> = FindQueryFunction<QueryArg, ReactTestInstance>;

export type Queries<QueryArg> = {
  getBy: GetByQuery<QueryArg>,
  getAllBy: GetAllByQuery<QueryArg>,
  queryBy: QueryByQuery<QueryArg>,
  findBy: FindByQuery<QueryArg>,
  findAllBy: FindAllByQuery<QueryArg>,
};

export function makeQueries<QueryArg>(
  queryAllByQuery: QueryAllByQuery<QueryArg>,
  getMissingError: (args: QueryArg) => string,
  getMultipleError: (args: QueryArg) => string
): Queries<QueryArg> {
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
