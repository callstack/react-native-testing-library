import type { HostElement } from 'universal-test-renderer';
import prettyFormat from 'pretty-format';

import { ErrorWithStack, prepareErrorMessage } from '../helpers/errors';
import { createQueryByError } from '../helpers/errors';

type Props = Record<string, unknown>;

const UNSAFE_getByProps = (instance: HostElement): ((props: Props) => HostElement) =>
  function getByPropsFn(props: Props) {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPropsFn);
    }
  };

const UNSAFE_getAllByProps = (instance: HostElement): ((props: Props) => Array<HostElement>) =>
  function getAllByPropsFn(props: Props) {
    const results = instance.findAllByProps(props);
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with props:\n${prettyFormat(props)}`,
        getAllByPropsFn,
      );
    }
    return results;
  };

const UNSAFE_queryByProps = (instance: HostElement): ((props: Props) => HostElement | null) =>
  function queryByPropsFn(props: Props) {
    try {
      return UNSAFE_getByProps(instance)(props);
    } catch (error) {
      return createQueryByError(error, queryByPropsFn);
    }
  };

const UNSAFE_queryAllByProps =
  (instance: HostElement): ((props: Props) => Array<HostElement>) =>
  (props: Props) => {
    try {
      return UNSAFE_getAllByProps(instance)(props);
    } catch {
      return [];
    }
  };

// Unsafe aliases
export type UnsafeByPropsQueries = {
  UNSAFE_getByProps: (props: Props) => HostElement;
  UNSAFE_getAllByProps: (props: Props) => Array<HostElement>;
  UNSAFE_queryByProps: (props: Props) => HostElement | null;
  UNSAFE_queryAllByProps: (props: Props) => Array<HostElement>;
};

// TODO: migrate to makeQueries pattern
export const bindUnsafeByPropsQueries = (instance: HostElement): UnsafeByPropsQueries => ({
  UNSAFE_getByProps: UNSAFE_getByProps(instance),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(instance),
  UNSAFE_queryByProps: UNSAFE_queryByProps(instance),
  UNSAFE_queryAllByProps: UNSAFE_queryAllByProps(instance),
});
