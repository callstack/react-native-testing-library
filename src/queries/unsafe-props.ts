import prettyFormat from 'pretty-format';
import { HostComponent } from 'universal-test-renderer';
import { ErrorWithStack, prepareErrorMessage } from '../helpers/errors';
import { createQueryByError } from '../helpers/errors';
import { findAllByProps } from '../helpers/find-all';

const UNSAFE_getByProps = (
  instance: HostComponent,
): ((props: { [propName: string]: any }) => HostComponent) =>
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
  instance: HostComponent,
): ((props: { [propName: string]: any }) => Array<HostComponent>) =>
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
  instance: HostComponent,
): ((props: { [propName: string]: any }) => HostComponent | null) =>
  function queryByPropsFn(props: { [propName: string]: any }) {
    try {
      return UNSAFE_getByProps(instance)(props);
    } catch (error) {
      return createQueryByError(error, queryByPropsFn);
    }
  };

const UNSAFE_queryAllByProps =
  (instance: HostComponent): ((props: { [propName: string]: any }) => Array<HostComponent>) =>
  (props: { [propName: string]: any }) => {
    try {
      return UNSAFE_getAllByProps(instance)(props);
    } catch {
      return [];
    }
  };

// Unsafe aliases
export type UnsafeByPropsQueries = {
  UNSAFE_getByProps: (props: { [key: string]: any }) => HostComponent;
  UNSAFE_getAllByProps: (props: { [key: string]: any }) => Array<HostComponent>;
  UNSAFE_queryByProps: (props: { [key: string]: any }) => HostComponent | null;
  UNSAFE_queryAllByProps: (props: { [key: string]: any }) => Array<HostComponent>;
};

// TODO: migrate to makeQueries pattern
export const bindUnsafeByPropsQueries = (instance: HostComponent): UnsafeByPropsQueries => ({
  UNSAFE_getByProps: UNSAFE_getByProps(instance),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(instance),
  UNSAFE_queryByProps: UNSAFE_queryByProps(instance),
  UNSAFE_queryAllByProps: UNSAFE_queryAllByProps(instance),
});
