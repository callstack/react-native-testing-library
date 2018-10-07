// @flow
import * as React from 'react';
import {
  getByTestId,
  getByName,
  getByText,
  getByProps,
  getAllByName,
  getAllByText,
  getAllByProps,
} from './getBy';

export const queryByName = (instance: ReactTestInstance) => (
  name: string | React.Element<*>
) => {
  try {
    return getByName(instance)(name);
  } catch (error) {
    return null;
  }
};

export const queryByText = (instance: ReactTestInstance) => (
  text: string | RegExp
) => {
  try {
    return getByText(instance)(text);
  } catch (error) {
    return null;
  }
};

export const queryByProps = (instance: ReactTestInstance) => (props: {
  [propName: string]: any,
}) => {
  try {
    return getByProps(instance)(props);
  } catch (error) {
    return null;
  }
};

export const queryByTestId = (instance: ReactTestInstance) => (
  testID: string
) => {
  try {
    return getByTestId(instance)(testID);
  } catch (error) {
    return null;
  }
};

export const queryAllByName = (instance: ReactTestInstance) => (
  name: string | React.Element<*>
) => {
  try {
    return getAllByName(instance)(name);
  } catch (error) {
    return null;
  }
};

export const queryAllByText = (instance: ReactTestInstance) => (
  text: string | RegExp
) => {
  try {
    return getAllByText(instance)(text);
  } catch (error) {
    return null;
  }
};

export const queryAllByProps = (instance: ReactTestInstance) => (props: {
  [propName: string]: any,
}) => {
  try {
    return getAllByProps(instance)(props);
  } catch (error) {
    return null;
  }
};
