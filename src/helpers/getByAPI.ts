import type { ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
import * as React from 'react';
import prettyFormat from 'pretty-format';
import type { TextMatch } from '../matches';
import { ErrorWithStack, prepareErrorMessage } from './errors';
import { getAllByTestId, getByTestId } from './byTestId';
import { getAllByText, getByText } from './byText';
import {
  getAllByPlaceholderText,
  getByPlaceholderText,
} from './byPlaceholderText';
import { getAllByDisplayValue, getByDisplayValue } from './byDisplayValue';
import type { TextMatchOptions } from './byText';

export type GetByAPI = {
  getByText: (
    text: TextMatch,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance;
  getByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance;
  getByDisplayValue: (
    value: TextMatch,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance;
  getByTestId: (
    testID: TextMatch,
    queryOptions?: TextMatchOptions
  ) => ReactTestInstance;
  getAllByTestId: (
    testID: TextMatch,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  getAllByText: (
    text: TextMatch,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  getAllByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions
  ) => Array<ReactTestInstance>;
  getAllByDisplayValue: (
    value: TextMatch,
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

export const getByAPI = (renderer: ReactTestRenderer): GetByAPI => ({
  getByText: getByText(renderer),
  getByPlaceholderText: getByPlaceholderText(renderer),
  getByDisplayValue: getByDisplayValue(renderer),
  getByTestId: getByTestId(renderer),
  getAllByText: getAllByText(renderer),
  getAllByPlaceholderText: getAllByPlaceholderText(renderer),
  getAllByDisplayValue: getAllByDisplayValue(renderer),
  getAllByTestId: getAllByTestId(renderer),

  // Unsafe
  UNSAFE_getByType: UNSAFE_getByType(renderer.root),
  UNSAFE_getAllByType: UNSAFE_getAllByType(renderer.root),
  UNSAFE_getByProps: UNSAFE_getByProps(renderer.root),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(renderer.root),
});
