import type { ReactTestInstance } from 'react-test-renderer';
import * as React from 'react';
import prettyFormat from 'pretty-format';
import type { TextMatch } from '../matches';
import { ErrorWithStack, prepareErrorMessage } from '../helpers/errors';
import {
  getAllByPlaceholderText,
  getByPlaceholderText,
} from './byPlaceholderText';
import type { TextMatchOptions } from './byText';

export type GetByAPI = {
  getByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance;
  getAllByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>;

  // Unsafe aliases
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance;
  UNSAFE_getAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>;
  UNSAFE_getByProps: (props: { [key: string]: any }) => ReactTestInstance;
  UNSAFE_getAllByProps: (props: {
    [key: string]: any;
  }) => Array<ReactTestInstance>;
};

export const UNSAFE_getByType = (
  instance: ReactTestInstance
): ((type: React.ComponentType<any>) => ReactTestInstance) =>
  function getByTypeFn(type: React.ComponentType<any>) {
    try {
      return instance.findByType(type);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTypeFn);
    }
  };

export const UNSAFE_getByProps = (
  instance: ReactTestInstance
): ((props: { [propName: string]: any }) => ReactTestInstance) =>
  function getByPropsFn(props: { [propName: string]: any }) {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPropsFn);
    }
  };

export const UNSAFE_getAllByType = (
  instance: ReactTestInstance
): ((type: React.ComponentType<any>) => Array<ReactTestInstance>) =>
  function getAllByTypeFn(type: React.ComponentType<any>) {
    const results = instance.findAllByType(type);
    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllByTypeFn);
    }
    return results;
  };

export const UNSAFE_getAllByProps = (
  instance: ReactTestInstance
): ((props: { [propName: string]: any }) => Array<ReactTestInstance>) =>
  function getAllByPropsFn(props: { [propName: string]: any }) {
    const results = instance.findAllByProps(props);
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with props:\n${prettyFormat(props)}`,
        getAllByPropsFn
      );
    }
    return results;
  };

export const getByAPI = (instance: ReactTestInstance): GetByAPI => ({
  getByPlaceholderText: getByPlaceholderText(instance),
  getAllByPlaceholderText: getAllByPlaceholderText(instance),

  // Unsafe
  UNSAFE_getByType: UNSAFE_getByType(instance),
  UNSAFE_getAllByType: UNSAFE_getAllByType(instance),
  UNSAFE_getByProps: UNSAFE_getByProps(instance),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(instance),
});
