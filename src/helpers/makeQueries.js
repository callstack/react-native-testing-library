// @flow
import waitFor from '../waitFor';
import type { WaitForOptions } from '../waitFor';
import { ErrorWithStack } from './errors';
import type { TextMatchOptions } from './byText';

type QueryFunction<ArgType, ReturnType> = (
  instance: ReactTestInstance
) => (args: ArgType, queryOptions?: TextMatchOptions) => ReturnType;

type FindQueryFunction<ArgType, ReturnType> = (
  instance: ReactTestInstance
) => (
  args: ArgType,
  queryOptions?: TextMatchOptions & WaitForOptions,
  waitForOptions?: WaitForOptions
) => Promise<ReturnType>;

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

// The WaitForOptions has been moved to the second option param of findBy* methods with the adding of TextMatchOptions
// To make the migration easier and avoid a breaking change, keep reading this options from the first param but warn
const deprecatedKeys: $Keys<WaitForOptions>[] = [
  'timeout',
  'interval',
  'stackTraceError',
];
const extractDeprecatedWaitForOptionUsage = (queryOptions?: WaitForOptions) => {
  if (queryOptions) {
    const waitForOptions: WaitForOptions = {
      timeout: queryOptions.timeout,
      interval: queryOptions.interval,
      stackTraceError: queryOptions.stackTraceError,
    };
    deprecatedKeys.forEach((key) => {
      if (queryOptions[key]) {
        // eslint-disable-next-line no-console
        console.warn(
          `Use of option "${key}" in a findBy* query's second parameter, TextMatchOptions, is deprecated. Please pass this option in the third, WaitForOptions, parameter. 
Example: 

  findByText(text, {}, { ${key}: ${queryOptions[key].toString()} })`
        );
      }
    });
    return waitForOptions;
  }
};

export function makeQueries<QueryArg>(
  queryAllByQuery: QueryAllByQuery<QueryArg>,
  getMissingError: (args: QueryArg) => string,
  getMultipleError: (args: QueryArg) => string
): Queries<QueryArg> {
  function getAllByQuery(instance: ReactTestInstance) {
    return function getAllFn(args: QueryArg, queryOptions?: TextMatchOptions) {
      const results = queryAllByQuery(instance)(args, queryOptions);

      if (results.length === 0) {
        throw new ErrorWithStack(getMissingError(args), getAllFn);
      }

      return results;
    };
  }

  function queryByQuery(instance: ReactTestInstance) {
    return function singleQueryFn(
      args: QueryArg,
      queryOptions?: TextMatchOptions
    ) {
      const results = queryAllByQuery(instance)(args, queryOptions);

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
    return function getFn(args: QueryArg, queryOptions?: TextMatchOptions) {
      const results = queryAllByQuery(instance)(args, queryOptions);

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
      queryOptions?: TextMatchOptions & WaitForOptions,
      waitForOptions?: WaitForOptions = {}
    ) {
      const deprecatedWaitForOptions = extractDeprecatedWaitForOptionUsage(
        queryOptions
      );
      return waitFor(() => getAllByQuery(instance)(args, queryOptions), {
        ...deprecatedWaitForOptions,
        ...waitForOptions,
      });
    };
  }

  function findByQuery(instance: ReactTestInstance) {
    return function findFn(
      args: QueryArg,
      queryOptions?: TextMatchOptions & WaitForOptions,
      waitForOptions?: WaitForOptions = {}
    ) {
      const deprecatedWaitForOptions = extractDeprecatedWaitForOptionUsage(
        queryOptions
      );
      return waitFor(() => getByQuery(instance)(args, queryOptions), {
        ...deprecatedWaitForOptions,
        ...waitForOptions,
      });
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
