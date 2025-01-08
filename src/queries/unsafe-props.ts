import type { ReactTestInstance } from 'react-test-renderer';
import prettyFormat from 'pretty-format';
import { ErrorWithStack, prepareErrorMessage } from '../helpers/errors';
import { createQueryByError } from '../helpers/errors';

export type UnsafeProps = Record<string, unknown>;

const UNSAFE_getByProps = (
  instance: ReactTestInstance,
): ((props: UnsafeProps) => ReactTestInstance) =>
  function getByPropsFn(props: UnsafeProps) {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPropsFn);
    }
  };

const UNSAFE_getAllByProps = (
  instance: ReactTestInstance,
): ((props: UnsafeProps) => Array<ReactTestInstance>) =>
  function getAllByPropsFn(props: UnsafeProps) {
    const results = instance.findAllByProps(props);
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with props:\n${prettyFormat(props)}`,
        getAllByPropsFn,
      );
    }
    return results;
  };

const UNSAFE_queryByProps = (
  instance: ReactTestInstance,
): ((props: UnsafeProps) => ReactTestInstance | null) =>
  function queryByPropsFn(props: UnsafeProps) {
    try {
      return UNSAFE_getByProps(instance)(props);
    } catch (error) {
      return createQueryByError(error, queryByPropsFn);
    }
  };

const UNSAFE_queryAllByProps =
  (instance: ReactTestInstance): ((props: UnsafeProps) => Array<ReactTestInstance>) =>
  (props: UnsafeProps) => {
    try {
      return UNSAFE_getAllByProps(instance)(props);
    } catch {
      return [];
    }
  };

// Unsafe aliases
export type UnsafeByPropsQueries = {
  UNSAFE_getByProps: (props: UnsafeProps) => ReactTestInstance;
  UNSAFE_getAllByProps: (props: UnsafeProps) => Array<ReactTestInstance>;
  UNSAFE_queryByProps: (props: UnsafeProps) => ReactTestInstance | null;
  UNSAFE_queryAllByProps: (props: UnsafeProps) => Array<ReactTestInstance>;
};

// TODO: migrate to makeQueries pattern
export const bindUnsafeByPropsQueries = (instance: ReactTestInstance): UnsafeByPropsQueries => ({
  UNSAFE_getByProps: UNSAFE_getByProps(instance),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(instance),
  UNSAFE_queryByProps: UNSAFE_queryByProps(instance),
  UNSAFE_queryAllByProps: UNSAFE_queryAllByProps(instance),
});
