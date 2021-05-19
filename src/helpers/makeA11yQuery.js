// @flow
import waitFor from '../waitFor';
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
  const getBy = (matcher: M) => {
    try {
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

  const getAllBy = (matcher: M) => {
    const results = instance.findAll(
      (node) => isNodeValid(node) && matcherFn(node.props[name], matcher)
    );

    if (results.length === 0) {
      throw new ErrorWithStack(
        prepareErrorMessage(new Error('No instances found'), name, matcher),
        getAllBy
      );
    }

    return results;
  };

  const queryBy = (matcher: M) => {
    try {
      return getBy(matcher);
    } catch (error) {
      return createQueryByError(error, queryBy);
    }
  };

  const queryAllBy = (matcher: M) => {
    try {
      return getAllBy(matcher);
    } catch (error) {
      return [];
    }
  };

  const findBy = (matcher: M, waitForOptions?: WaitForOptions) => {
    return waitFor(() => getBy(matcher), waitForOptions);
  };

  const findAllBy = (matcher: M, waitForOptions?: WaitForOptions) => {
    return waitFor(() => getAllBy(matcher), waitForOptions);
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
