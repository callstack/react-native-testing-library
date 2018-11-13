// @flow
import * as React from 'react';
import ErrorWithStack from './errorWithStack';

const getNodeByName = (node, name) =>
  node.type.name === name ||
  node.type.displayName === name ||
  (typeof name === 'function' && node.type === name);

const getNodeByText = (node, text) =>
  (getNodeByName(node, 'Text') || getNodeByName(node, 'TextInput')) &&
  (typeof text === 'string'
    ? text === node.props.children
    : text.test(node.props.children));

export const getByName = (instance: ReactTestInstance) =>
  function getByNameFn(name: string | React.ComponentType<*>) {
    try {
      return instance.find(node => getNodeByName(node, name));
    } catch (error) {
      throw new ErrorWithStack(`Component not found.`, getByNameFn);
    }
  };

export const getByText = (instance: ReactTestInstance) =>
  function getByTextFn(text: string | RegExp) {
    try {
      return instance.find(node => getNodeByText(node, text));
    } catch (error) {
      throw new ErrorWithStack(`Component not found.`, getByTextFn);
    }
  };

export const getByProps = (instance: ReactTestInstance) =>
  function getByPropsFn(props: { [propName: string]: any }) {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(`Component not found.`, getByPropsFn);
    }
  };

export const getByTestId = (instance: ReactTestInstance) =>
  function getByTestIdFn(testID: string) {
    try {
      return instance.findByProps({ testID });
    } catch (error) {
      throw new ErrorWithStack(`Component not found.`, getByTestIdFn);
    }
  };

export const getAllByName = (instance: ReactTestInstance) =>
  function getAllByNameFn(name: string | React.ComponentType<*>) {
    const results = instance.findAll(node => getNodeByName(node, name));
    if (results.length === 0) {
      throw new ErrorWithStack(`Components not found.`, getAllByNameFn);
    }
    return results;
  };

export const getAllByText = (instance: ReactTestInstance) =>
  function getAllByTextFn(text: string | RegExp) {
    const results = instance.findAll(node => getNodeByText(node, text));
    if (results.length === 0) {
      throw new ErrorWithStack(`Components not found.`, getAllByTextFn);
    }
    return results;
  };

export const getAllByProps = (instance: ReactTestInstance) =>
  function getAllByPropsFn(props: { [propName: string]: any }) {
    const results = instance.findAllByProps(props);
    if (results.length === 0) {
      throw new ErrorWithStack(`Components not found.`, getAllByPropsFn);
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
