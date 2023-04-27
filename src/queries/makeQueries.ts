import type { ReactTestInstance } from 'react-test-renderer';
import { ErrorWithStack } from '../helpers/errors';
import waitFor from '../waitFor';
import type { WaitForOptions } from '../waitFor';
import format from '../helpers/format';
import { screen } from '../screen';
import { defaultMapProps } from '../helpers/format-default';

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
  // Remove `& WaitForOptions` when all queries have been migrated to support 2nd arg query options.
  options?: Options & WaitForOptions,
  waitForOptions?: WaitForOptions
) => Promise<ReactTestInstance>;

export type FindAllByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  // Remove `& WaitForOptions` when all queries have been migrated to support 2nd arg query options.
  options?: Options & WaitForOptions,
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

const deprecatedKeys: (keyof WaitForOptions)[] = [
  'timeout',
  'interval',
  'stackTraceError',
];

// The WaitForOptions has been moved to the second option param of findBy* methods with the adding of TextMatchOptions
// To make the migration easier and avoid a breaking change, keep reading this options from the first param but warn
function extractDeprecatedWaitForOptions(options?: WaitForOptions) {
  if (!options) {
    return undefined;
  }

  const waitForOptions: WaitForOptions = {
    timeout: options.timeout,
    interval: options.interval,
    stackTraceError: options.stackTraceError,
  };

  deprecatedKeys.forEach((key) => {
    const option = options[key];
    if (option) {
      // eslint-disable-next-line no-console
      console.warn(
        `Use of option "${key}" in a findBy* query options (2nd parameter) is deprecated. Please pass this option in the waitForOptions (3rd parameter).
Example:

  findByText(text, {}, { ${key}: ${option.toString()} })`
      );
    }
  });

  return waitForOptions;
}

function formatErrorMessage(message: string, printElementTree: boolean) {
  if (!printElementTree) {
    return message;
  }

  const json = screen.toJSON();
  if (!json) {
    return message;
  }

  return `${message}\n\n${format(json, {
    mapProps: defaultMapProps,
  })}`;
}

function appendElementTreeToError(error: Error) {
  const oldMessage = error.message;
  error.message = formatErrorMessage(oldMessage, true);

  // Required to make Jest print the element tree on error
  error.stack = error.stack?.replace(oldMessage, error.message);

  return error;
}

export function makeQueries<Predicate, Options>(
  queryAllByQuery: UnboundQuery<QueryAllByQuery<Predicate, Options>>,
  getMissingError: (predicate: Predicate, options?: Options) => string,
  getMultipleError: (predicate: Predicate, options?: Options) => string
): UnboundQueries<Predicate, Options> {
  function getAllByQuery(
    instance: ReactTestInstance,
    { printElementTree = true } = {}
  ) {
    return function getAllFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(instance)(predicate, options);

      if (results.length === 0) {
        const errorMessage = formatErrorMessage(
          getMissingError(predicate, options),
          printElementTree
        );
        throw new ErrorWithStack(errorMessage, getAllFn);
      }

      return results;
    };
  }

  function queryByQuery(
    instance: ReactTestInstance,
    { printElementTree = true } = {}
  ) {
    return function singleQueryFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(instance)(predicate, options);

      if (results.length > 1) {
        throw new ErrorWithStack(
          formatErrorMessage(
            getMultipleError(predicate, options),
            printElementTree
          ),
          singleQueryFn
        );
      }

      if (results.length === 0) {
        return null;
      }

      return results[0];
    };
  }

  function getByQuery(
    instance: ReactTestInstance,
    { printElementTree = true } = {}
  ) {
    return function getFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(instance)(predicate, options);

      if (results.length > 1) {
        throw new ErrorWithStack(getMultipleError(predicate, options), getFn);
      }

      if (results.length === 0) {
        const errorMessage = formatErrorMessage(
          getMissingError(predicate, options),
          printElementTree
        );
        throw new ErrorWithStack(errorMessage, getFn);
      }

      return results[0];
    };
  }

  function findAllByQuery(instance: ReactTestInstance) {
    return function findAllFn(
      predicate: Predicate,
      queryOptions?: Options & WaitForOptions,
      {
        onTimeout = (error) => appendElementTreeToError(error),
        ...waitForOptions
      }: WaitForOptions = {}
    ) {
      const stackTraceError = new ErrorWithStack(
        'STACK_TRACE_ERROR',
        findAllFn
      );
      const deprecatedWaitForOptions =
        extractDeprecatedWaitForOptions(queryOptions);

      return waitFor(
        () =>
          getAllByQuery(instance, { printElementTree: false })(
            predicate,
            queryOptions
          ),
        {
          ...deprecatedWaitForOptions,
          ...waitForOptions,
          stackTraceError,
          onTimeout,
        }
      );
    };
  }

  function findByQuery(instance: ReactTestInstance) {
    return function findFn(
      predicate: Predicate,
      queryOptions?: Options & WaitForOptions,
      {
        onTimeout = (error) => appendElementTreeToError(error),
        ...waitForOptions
      }: WaitForOptions = {}
    ) {
      const stackTraceError = new ErrorWithStack('STACK_TRACE_ERROR', findFn);
      const deprecatedWaitForOptions =
        extractDeprecatedWaitForOptions(queryOptions);

      return waitFor(
        () =>
          getByQuery(instance, { printElementTree: false })(
            predicate,
            queryOptions
          ),
        {
          ...deprecatedWaitForOptions,
          ...waitForOptions,
          stackTraceError,
          onTimeout,
        }
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
