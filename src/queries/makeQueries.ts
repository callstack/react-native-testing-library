import type { ReactTestInstance } from 'react-test-renderer';
import { ErrorWithStack } from '../helpers/errors';
import waitFor from '../waitFor';
import type { WaitForOptions } from '../waitFor';

export type GetByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options
) => ReactTestInstance;

export type GetAllByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options
) => ReactTestInstance[];

export type QueryByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options
) => ReactTestInstance | null;

export type QueryAllByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options
) => ReactTestInstance[];

export type FindByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options,
  waitForOptions?: WaitForOptions
) => Promise<ReactTestInstance>;

export type FindAllByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options,
  waitForOptions?: WaitForOptions
) => Promise<ReactTestInstance[]>;

type UnboundQuery<Query> = (instance: ReactTestInstance) => Query;

export type UnboundQueries<Predicate, Options> = {
  getBy: UnboundQuery<GetByQuery<Predicate, Options>>;
  getAllBy: UnboundQuery<GetAllByQuery<Predicate, Options>>;
  queryBy: UnboundQuery<QueryByQuery<Predicate, Options>>;
  queryAllBy: UnboundQuery<QueryAllByQuery<Predicate, Options>>;
  findBy: UnboundQuery<FindByQuery<Predicate, Options>>;
  findAllBy: UnboundQuery<FindAllByQuery<Predicate, Options>>;
};

export function makeQueries<Predicate, Options>(
  queryAllByQuery: UnboundQuery<QueryAllByQuery<Predicate, Options>>,
  getMissingError: (predicate: Predicate, options?: Options) => string,
  getMultipleError: (predicate: Predicate, options?: Options) => string
): UnboundQueries<Predicate, Options> {
  function getAllByQuery(instance: ReactTestInstance) {
    return function getAllFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(instance)(predicate, options);

      if (results.length === 0) {
        throw new ErrorWithStack(getMissingError(predicate, options), getAllFn);
      }

      return results;
    };
  }

  function queryByQuery(instance: ReactTestInstance) {
    return function singleQueryFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(instance)(predicate, options);

      if (results.length > 1) {
        throw new ErrorWithStack(
          getMultipleError(predicate, options),
          singleQueryFn
        );
      }

      if (results.length === 0) {
        return null;
      }

      return results[0];
    };
  }

  function getByQuery(instance: ReactTestInstance) {
    return function getFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(instance)(predicate, options);

      if (results.length > 1) {
        throw new ErrorWithStack(getMultipleError(predicate, options), getFn);
      }

      if (results.length === 0) {
        throw new ErrorWithStack(getMissingError(predicate, options), getFn);
      }

      return results[0];
    };
  }

  function findAllByQuery(instance: ReactTestInstance) {
    return function findAllFn(
      predicate: Predicate,
      queryOptions?: Options,
      waitForOptions?: WaitForOptions
    ) {
      return waitFor(
        () => getAllByQuery(instance)(predicate, queryOptions),
        waitForOptions
      );
    };
  }

  function findByQuery(instance: ReactTestInstance) {
    return function findFn(
      predicate: Predicate,
      queryOptions?: Options,
      waitForOptions?: WaitForOptions
    ) {
      return waitFor(
        () => getByQuery(instance)(predicate, queryOptions),
        waitForOptions
      );
    };
  }

  return {
    getBy: getByQuery,
    getAllBy: getAllByQuery,
    queryBy: queryByQuery,
    queryAllBy: queryAllByQuery,
    findBy: findByQuery,
    findAllBy: findAllByQuery,
  };
}
