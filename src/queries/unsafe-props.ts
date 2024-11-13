import prettyFormat from 'pretty-format';
import { HostElement } from 'universal-test-renderer';
import { ErrorWithStack, prepareErrorMessage } from '../helpers/errors';
import { createQueryByError } from '../helpers/errors';
import { findAllByProps } from '../helpers/find-all';

const UNSAFE_getByProps = (
  instance: HostElement,
): ((props: { [propName: string]: any }) => HostElement) =>
  function getByPropsFn(props: { [propName: string]: any }) {
    try {
      const results = findAllByProps(instance, props);
      if (results.length === 0) {
        throw new ErrorWithStack(
          `No instances found with props:\n${prettyFormat(props)}`,
          getByPropsFn,
        );
      }
      if (results.length > 1) {
        throw new ErrorWithStack(
          `Found multiple instances with props:\n${prettyFormat(props)}`,
          getByPropsFn,
        );
      }
      return results[0];
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPropsFn);
    }
  };

const UNSAFE_getAllByProps = (
  instance: HostElement,
): ((props: { [propName: string]: any }) => Array<HostElement>) =>
  function getAllByPropsFn(props: { [propName: string]: any }) {
    const results = findAllByProps(instance, props);
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with props:\n${prettyFormat(props)}`,
        getAllByPropsFn,
      );
    }
    return results;
  };

const UNSAFE_queryByProps = (
  instance: HostElement,
): ((props: { [propName: string]: any }) => HostElement | null) =>
  function queryByPropsFn(props: { [propName: string]: any }) {
    try {
      return UNSAFE_getByProps(instance)(props);
    } catch (error) {
      return createQueryByError(error, queryByPropsFn);
    }
  };

const UNSAFE_queryAllByProps =
  (instance: HostElement): ((props: { [propName: string]: any }) => Array<HostElement>) =>
  (props: { [propName: string]: any }) => {
    try {
      return UNSAFE_getAllByProps(instance)(props);
    } catch {
      return [];
    }
  };

// Unsafe aliases
export type UnsafeByPropsQueries = {
  UNSAFE_getByProps: (props: { [key: string]: any }) => HostElement;
  UNSAFE_getAllByProps: (props: { [key: string]: any }) => Array<HostElement>;
  UNSAFE_queryByProps: (props: { [key: string]: any }) => HostElement | null;
  UNSAFE_queryAllByProps: (props: { [key: string]: any }) => Array<HostElement>;
};

// TODO: migrate to makeQueries pattern
export const bindUnsafeByPropsQueries = (instance: HostElement): UnsafeByPropsQueries => ({
  UNSAFE_getByProps: UNSAFE_getByProps(instance),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(instance),
  UNSAFE_queryByProps: UNSAFE_queryByProps(instance),
  UNSAFE_queryAllByProps: UNSAFE_queryAllByProps(instance),
});
