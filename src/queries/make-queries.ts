import type { HostElement } from 'universal-test-renderer';

import { ErrorWithStack } from '../helpers/errors';
import { formatJson } from '../helpers/format-element';
import { logger } from '../helpers/logger';
import { screen } from '../screen';
import type { WaitForOptions } from '../wait-for';
import { waitFor } from '../wait-for';

export type GetByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options,
) => HostElement;

export type GetAllByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options,
) => HostElement[];

export type QueryByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options,
) => HostElement | null;

export type QueryAllByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  options?: Options,
) => HostElement[];

export type FindByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  // Remove `& WaitForOptions` when all queries have been migrated to support 2nd arg query options.
  options?: Options & WaitForOptions,
  waitForOptions?: WaitForOptions,
) => Promise<HostElement>;

export type FindAllByQuery<Predicate, Options = void> = (
  predicate: Predicate,
  // Remove `& WaitForOptions` when all queries have been migrated to support 2nd arg query options.
  options?: Options & WaitForOptions,
  waitForOptions?: WaitForOptions,
) => Promise<HostElement[]>;

type UnboundQuery<Query> = (element: HostElement) => Query;

export type UnboundQueries<Predicate, Options> = {
  getBy: UnboundQuery<GetByQuery<Predicate, Options>>;
  getAllBy: UnboundQuery<GetAllByQuery<Predicate, Options>>;
  queryBy: UnboundQuery<QueryByQuery<Predicate, Options>>;
  queryAllBy: UnboundQuery<QueryAllByQuery<Predicate, Options>>;
  findBy: UnboundQuery<FindByQuery<Predicate, Options>>;
  findAllBy: UnboundQuery<FindAllByQuery<Predicate, Options>>;
};

const deprecatedKeys: (keyof WaitForOptions)[] = ['timeout', 'interval', 'stackTraceError'];

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
      logger.warn(
        `Use of option "${key}" in a findBy* query options (2nd parameter) is deprecated. Please pass this option in the waitForOptions (3rd parameter).
Example:

  findByText(text, {}, { ${key}: ${option.toString()} })`,
      );
    }
  });

  return waitForOptions;
}

function formatErrorMessage(message: string, printElementTree: boolean) {
  if (!printElementTree) {
    return message;
  }

  if (screen.isDetached) {
    return `${message}\n\nScreen is no longer attached. Check your test for "findBy*" or "waitFor" calls that have not been awaited.\n\nWe recommend enabling "eslint-plugin-testing-library" to catch these issues at build time:\nhttps://callstack.github.io/react-native-testing-library/docs/start/quick-start#eslint-plugin`;
  }

  const json = screen.toJSON();
  if (!json) {
    return message;
  }

  return `${message}\n\n${formatJson(json)}`;
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
  getMultipleError: (predicate: Predicate, options?: Options) => string,
): UnboundQueries<Predicate, Options> {
  function getAllByQuery(element: HostElement, { printElementTree = true } = {}) {
    return function getAllFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(element)(predicate, options);

      if (results.length === 0) {
        const errorMessage = formatErrorMessage(
          getMissingError(predicate, options),
          printElementTree,
        );
        throw new ErrorWithStack(errorMessage, getAllFn);
      }

      return results;
    };
  }

  function queryByQuery(element: HostElement, { printElementTree = true } = {}) {
    return function singleQueryFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(element)(predicate, options);

      if (results.length > 1) {
        throw new ErrorWithStack(
          formatErrorMessage(getMultipleError(predicate, options), printElementTree),
          singleQueryFn,
        );
      }

      if (results.length === 0) {
        return null;
      }

      return results[0];
    };
  }

  function getByQuery(element: HostElement, { printElementTree = true } = {}) {
    return function getFn(predicate: Predicate, options?: Options) {
      const results = queryAllByQuery(element)(predicate, options);

      if (results.length > 1) {
        throw new ErrorWithStack(getMultipleError(predicate, options), getFn);
      }

      if (results.length === 0) {
        const errorMessage = formatErrorMessage(
          getMissingError(predicate, options),
          printElementTree,
        );
        throw new ErrorWithStack(errorMessage, getFn);
      }

      return results[0];
    };
  }

  function findAllByQuery(element: HostElement) {
    return function findAllFn(
      predicate: Predicate,
      queryOptions?: Options & WaitForOptions,
      {
        onTimeout = (error) => appendElementTreeToError(error),
        ...waitForOptions
      }: WaitForOptions = {},
    ) {
      const stackTraceError = new ErrorWithStack('STACK_TRACE_ERROR', findAllFn);
      const deprecatedWaitForOptions = extractDeprecatedWaitForOptions(queryOptions);

      return waitFor(
        () => getAllByQuery(element, { printElementTree: false })(predicate, queryOptions),
        {
          ...deprecatedWaitForOptions,
          ...waitForOptions,
          stackTraceError,
          onTimeout,
        },
      );
    };
  }

  function findByQuery(element: HostElement) {
    return function findFn(
      predicate: Predicate,
      queryOptions?: Options & WaitForOptions,
      {
        onTimeout = (error) => appendElementTreeToError(error),
        ...waitForOptions
      }: WaitForOptions = {},
    ) {
      const stackTraceError = new ErrorWithStack('STACK_TRACE_ERROR', findFn);
      const deprecatedWaitForOptions = extractDeprecatedWaitForOptions(queryOptions);

      return waitFor(
        () => getByQuery(element, { printElementTree: false })(predicate, queryOptions),
        {
          ...deprecatedWaitForOptions,
          ...waitForOptions,
          stackTraceError,
          onTimeout,
        },
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
