// @flow
import * as React from 'react';
import ErrorWithStack from './errorWithStack';

const getNodeByName = (node, name) =>
  node.type.name === name ||
  node.type.displayName === name ||
  node.type === name;

const getNodeByText = (node, text) =>
  (getNodeByName(node, 'Text') || getNodeByName(node, 'TextInput')) &&
  (typeof text === 'string'
    ? text === node.props.children
    : text.test(node.props.children));

export const getByName = (instance: ReactTestInstance) => (
  name: string | React.ComponentType<*>
) => {
  try {
    return instance.find(node => getNodeByName(node, name));
  } catch (error) {
    throw new ErrorWithStack(`Error: Component not found.`, getByName);
  }
};

export const getByText = (instance: ReactTestInstance) => (
  text: string | RegExp
) => {
  try {
    return instance.find(node => getNodeByText(node, text));
  } catch (error) {
    throw new ErrorWithStack(`Error: Component not found.`, getByText);
  }
};

export const getByProps = (instance: ReactTestInstance) => (props: {
  [propName: string]: any,
}) => {
  try {
    return instance.findByProps(props);
  } catch (error) {
    throw new ErrorWithStack(`Error: Component not found.`, getByProps);
  }
};

export const getByTestId = (instance: ReactTestInstance) => (testID: string) =>
  getByProps(instance)({ testID });

export const getAllByName = (instance: ReactTestInstance) => (
  name: string | React.ComponentType<*>
) => {
  const results = instance.findAll(node => getNodeByName(node, name));
  if (results.length === 0) {
    throw new ErrorWithStack(`Error: Components not found.`, getAllByName);
  }
  return results;
};

export const getAllByText = (instance: ReactTestInstance) => (
  text: string | RegExp
) => {
  const results = instance.findAll(node => getNodeByText(node, text));
  if (results.length === 0) {
    throw new ErrorWithStack(`Error: Components not found.`, getAllByText);
  }
  return results;
};

export const getAllByProps = (instance: ReactTestInstance) => (props: {
  [propName: string]: any,
}) => {
  const results = instance.findAllByProps(props);
  if (results.length === 0) {
    throw new ErrorWithStack(`Error: Components not found.`, getAllByProps);
  }
  return results;
};

export const getByAPI = (instance: ReactTestInstance) => ({
  getByTestId: getByTestId(instance),
  getByName: getByName(instance),
  getByText: getByText(instance),
  getByProps: getByProps(instance),
  getAllByName: getAllByName(instance),
  getAllByText: getAllByText(instance),
  getAllByProps: getAllByProps(instance),
});
