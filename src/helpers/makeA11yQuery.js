// @flow
import waitFor from '../waitFor';
import { getQueriesForElement } from '../within';
import type { WaitForOptions } from '../waitFor';
import {
  ErrorWithStack,
  prepareErrorMessage,
  createQueryByError,
} from './errors';

function isNodeValid(node: ReactTestInstance) {
  return typeof node.type === 'string';
}

function makeAliases(aliases: Array<string>, query: Function) {
  return aliases
    .map((alias) => ({ [alias]: query }))
    .reduce((acc, query) => ({ ...acc, ...query }), {});
}

// The WaitForOptions has been moved to the third param of findBy* methods with the addition of QueryOptions.
// To make the migration easier and to avoid a breaking change, keep reading these options from second param
// but warn.
const deprecatedKeys: $Keys<WaitForOptions>[] = [
  'timeout',
  'interval',
  'stackTraceError',
];
const warnDeprectedWaitForOptionsUsage = (queryOptions?: WaitForOptions) => {
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
          `Use of option "${key}" in a findBy* query's second parameter, QueryOptions, is deprecated. Please pass this option in the third, WaitForOptions, parameter. 
Example: 
  findByText(text, {}, { ${key}: ${queryOptions[key].toString()} })`
        );
      }
    });
    return waitForOptions;
  }
};

type QueryOptions = {
  name: string | RegExp,
};

type QueryNames = {
  getBy: Array<string>,
  getAllBy: Array<string>,
  queryBy: Array<string>,
  queryAllBy: Array<string>,
  findBy: Array<string>,
  findAllBy: Array<string>,
};

const makeA11yQuery = <P: mixed, M: mixed>(
  name: string,
  queryNames: QueryNames,
  matcherFn: (prop: P, value: M) => boolean
): ((instance: ReactTestInstance) => { ... }) => (
  instance: ReactTestInstance
) => {
  const filterWithName = (
    node: ReactTestInstance,
    options: QueryOptions,
    matcher: M
  ) => {
    const matchesRole =
      isNodeValid(node) && matcherFn(node.props[name], matcher);

    return (
      matchesRole && !!getQueriesForElement(node).queryByText(options.name)
    );
  };

  const getBy = (matcher: M, queryOptions?: QueryOptions) => {
    try {
      if (queryOptions?.name) {
        return instance.find((node) =>
          filterWithName(node, queryOptions, matcher)
        );
      }

      return instance.find(
        (node) => isNodeValid(node) && matcherFn(node.props[name], matcher)
      );
    } catch (error) {
      throw new ErrorWithStack(
        prepareErrorMessage(error, name, matcher),
        getBy
      );
    }
  };

  const getAllBy = (matcher: M, options?: QueryOptions) => {
    let results = [];

    if (options?.name) {
      results = instance.findAll((node) =>
        filterWithName(node, options, matcher)
      );
    } else {
      results = instance.findAll(
        (node) => isNodeValid(node) && matcherFn(node.props[name], matcher)
      );
    }

    if (results.length === 0) {
      throw new ErrorWithStack(
        prepareErrorMessage(new Error('No instances found'), name, matcher),
        getAllBy
      );
    }

    return results;
  };

  const queryBy = (matcher: M, options?: QueryOptions) => {
    try {
      return getBy(matcher, options);
    } catch (error) {
      return createQueryByError(error, queryBy);
    }
  };

  const queryAllBy = (matcher: M, options?: QueryOptions) => {
    try {
      return getAllBy(matcher, options);
    } catch (error) {
      return [];
    }
  };

  const findBy = (
    matcher: M,
    queryOptions?: QueryOptions,
    waitForOptions?: WaitForOptions = {}
  ) => {
    const deprecatedWaitForOptions = warnDeprectedWaitForOptionsUsage(
      queryOptions
    );

    return waitFor(() => getBy(matcher, queryOptions), {
      ...deprecatedWaitForOptions,
      ...waitForOptions,
    });
  };

  const findAllBy = (
    matcher: M,
    queryOptions: QueryOptions,
    waitForOptions?: WaitForOptions = {}
  ) => {
    const deprecatedWaitForOptions = warnDeprectedWaitForOptionsUsage(
      queryOptions
    );

    return waitFor(() => getAllBy(matcher, queryOptions), {
      ...deprecatedWaitForOptions,
      ...waitForOptions,
    });
  };

  return {
    ...makeAliases(queryNames.getBy, getBy),
    ...makeAliases(queryNames.getAllBy, getAllBy),
    ...makeAliases(queryNames.queryBy, queryBy),
    ...makeAliases(queryNames.queryAllBy, queryAllBy),
    ...makeAliases(queryNames.findBy, findBy),
    ...makeAliases(queryNames.findAllBy, findAllBy),
  };
};

export default makeA11yQuery;
