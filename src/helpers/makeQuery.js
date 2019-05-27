// @flow
import { ErrorWithStack } from './errors';

const prepareErrorMessage = error =>
  // Strip info about custom predicate
  error.message.replace(/ matching custom predicate[^]*/gm, '');

function getNodeName(node: ReactTestInstance) {
  return typeof node.type !== 'string'
    ? node.type.displayName || node.type.name
    : '';
}

function isNodeValid(node: ReactTestInstance) {
  return ['View', 'Text', 'TextInput', 'Image', 'ScrollViewMock'].includes(
    getNodeName(node)
  );
}

const createQueryByError = (error: Error, callsite: Function) => {
  if (error.message.includes('No instances found')) {
    return null;
  }
  throw new ErrorWithStack(error.message, callsite);
};

type QueryNames = {
  getBy: string,
  getAllBy: string,
  queryBy: string,
  queryAllBy: string,
};

const makeQuery = <P: any, M: any>(
  name: string,
  queryNames: QueryNames,
  matcherFn: (prop: P, value: M) => boolean
) => (instance: ReactTestInstance) => {
  const getBy = (matcher: M) => {
    try {
      return instance.find(node =>
        Boolean(isNodeValid(node) && matcherFn(node.props[name], matcher))
      );
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getBy);
    }
  };

  const getAllBy = (matcher: M) => {
    const results = instance.findAll(node =>
      Boolean(isNodeValid(node) && matcherFn(node.props[name], matcher))
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
    [queryNames.getBy]: getBy,
    [queryNames.getAllBy]: getAllBy,
    [queryNames.queryBy]: queryBy,
    [queryNames.queryAllBy]: queryAllBy,
  };
};

export default makeQuery;
