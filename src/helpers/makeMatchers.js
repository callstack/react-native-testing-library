// @flow
import { ErrorWithStack } from './errors';

const prepareErrorMessage = error =>
  // Strip info about custom predicate
  error.message.replace(/ matching custom predicate[^]*/gm, '');

function matchString(label?: string, matcher: string | RegExp) {
  if (!label) {
    return false;
  }

  if (typeof matcher === 'string') {
    return label === matcher;
  }

  return label.match(matcher);
}

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

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const makeMatchers = (name: string) => (instance: ReactTestInstance) => {
  const getBy = (matcher: string | RegExp) => {
    try {
      return instance.find(node =>
        Boolean(isNodeValid(node) && matchString(node.props[name], matcher))
      );
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), `getBy${name}`);
    }
  };

  const getAllBy = (matcher: string | RegExp) => {
    const results = instance.findAll(node =>
      Boolean(
        isNodeValid(node) && matchString(node.props.accessibilityHint, matcher)
      )
    );

    if (results === 0) {
      throw new ErrorWithStack('No instances found', `getAllBy${name}`);
    }

    return results;
  };

  const queryBy = (matcher: string | RegExp) => {
    try {
      return getBy(matcher);
    } catch (error) {
      return createQueryByError(error, `queryBy${name}`);
    }
  };

  const queryAllBy = (matcher: string | RegExp) => {
    try {
      return getAllBy(matcher);
    } catch (error) {
      return [];
    }
  };

  const methodSuffix = capitalize(name);

  return {
    [`getBy${methodSuffix}`]: getBy,
    [`getAllBy${methodSuffix}`]: getAllBy,
    [`queryBy${methodSuffix}`]: queryBy,
    [`queryAllBy${methodSuffix}`]: queryAllBy,
  };
};

export default makeMatchers;
