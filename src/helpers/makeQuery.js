// @flow
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
    .map(alias => ({ [alias]: query }))
    .reduce((acc, query) => ({ ...acc, ...query }), {});
}

type QueryNames = {
  getBy: Array<string>,
  getAllBy: Array<string>,
  queryBy: Array<string>,
  queryAllBy: Array<string>,
};

const makeQuery = <P: mixed, M: mixed>(
  name: string,
  queryNames: QueryNames,
  matcherFn: (prop: P, value: M) => boolean
) => (instance: ReactTestInstance) => {
  const getBy = (matcher: M) => {
    try {
      return instance.find(
        node => isNodeValid(node) && matcherFn(node.props[name], matcher)
      );
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getBy);
    }
  };

  const getAllBy = (matcher: M) => {
    const results = instance.findAll(
      node => isNodeValid(node) && matcherFn(node.props[name], matcher)
    );

    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllBy);
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

  return {
    ...makeAliases(queryNames.getBy, getBy),
    ...makeAliases(queryNames.getAllBy, getAllBy),
    ...makeAliases(queryNames.queryBy, queryBy),
    ...makeAliases(queryNames.queryAllBy, queryAllBy),
  };
};

export default makeQuery;
