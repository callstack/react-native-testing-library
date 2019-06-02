// @flow
import * as React from 'react';
import prettyFormat from 'pretty-format';
import isPlainObject from 'is-plain-object';
import {
  ErrorWithStack,
  createLibraryNotSupportedError,
  logDeprecationWarning,
  prepareErrorMessage,
} from './errors';

const filterNodeByType = (node, type) => node.type === type;

const filterNodeByName = (node, name) =>
  typeof node.type !== 'string' &&
  (node.type.displayName === name || node.type.name === name);

const getNodeByText = (node, text) => {
  try {
    // eslint-disable-next-line
    const { Text, TextInput } = require('react-native');
    const isTextComponent =
      filterNodeByType(node, Text) || filterNodeByType(node, TextInput);
    if (isTextComponent) {
      const textChildren = React.Children.map(
        node.props.children,
        // In some cases child might be undefined
        child => (child ? child.toString() : '')
      );
      if (textChildren) {
        const textToTest = textChildren.join('');
        return typeof text === 'string'
          ? text === textToTest
          : text.test(textToTest);
      }
    }
    return false;
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const getTextInputNodeByPlaceholder = (node, placeholder) => {
  try {
    // eslint-disable-next-line
    const { TextInput } = require('react-native');
    return (
      filterNodeByType(node, TextInput) &&
      (typeof placeholder === 'string'
        ? placeholder === node.props.placeholder
        : placeholder.test(node.props.placeholder))
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const makePaths = criteria =>
  [].concat(
    ...Object.keys(criteria).map(key =>
      isPlainObject(criteria[key])
        ? makePaths(criteria[key]).map(({ path, value }) => ({
            path: [key, ...path],
            value,
          }))
        : [{ path: [key], value: criteria[key] }]
    )
  );

const makeTest = criteria => {
  if (criteria.testID) {
    criteria.props = { testID: criteria.testID, ...criteria.props };
    delete criteria.testID;
  }
  const paths = makePaths(criteria);

  return node =>
    paths.every(({ path: [...path], value }) => {
      let curr = node;
      while (path.length) {
        curr = curr[path.shift()];
        if (!curr) return false;
      }
      return value instanceof RegExp && typeof curr === 'string'
        ? new RegExp(value).test(curr)
        : curr === value;
    });
};

export const getBy = (instance: ReactTestInstance) =>
  function getByFn(criteria: Function | { [string]: any }) {
    try {
      const test = typeof criteria === 'object' ? makeTest(criteria) : criteria;
      return instance.find(test);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByFn);
    }
  };

export const getByName = (instance: ReactTestInstance) =>
  function getByNameFn(name: string | React.ComponentType<*>) {
    logDeprecationWarning('getByName', 'getByType');
    try {
      return typeof name === 'string'
        ? instance.find(node => filterNodeByName(node, name))
        : instance.findByType(name);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByNameFn);
    }
  };

export const getByType = (instance: ReactTestInstance) =>
  function getByTypeFn(type: React.ComponentType<*>) {
    try {
      return instance.findByType(type);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTypeFn);
    }
  };

export const getByText = (instance: ReactTestInstance) =>
  function getByTextFn(text: string | RegExp) {
    try {
      return instance.find(node => getNodeByText(node, text));
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTextFn);
    }
  };

export const getByPlaceholder = (instance: ReactTestInstance) =>
  function getByPlaceholderFn(placeholder: string | RegExp) {
    try {
      return instance.find(node =>
        getTextInputNodeByPlaceholder(node, placeholder)
      );
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPlaceholderFn);
    }
  };

export const getByProps = (instance: ReactTestInstance) =>
  function getByPropsFn(props: { [propName: string]: any }) {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPropsFn);
    }
  };

export const getByTestId = (instance: ReactTestInstance) =>
  function getByTestIdFn(testID: string) {
    try {
      return instance.findByProps({ testID });
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTestIdFn);
    }
  };

export const getAllBy = (instance: ReactTestInstance) =>
  function getAllByFn(criteria: Function | { [string]: any }) {
    const test = typeof criteria === 'object' ? makeTest(criteria) : criteria;
    const results = instance.findAll(test);
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with for criteria:\n${prettyFormat(criteria)}`,
        getAllByFn
      );
    }
    return results;
  };

export const getAllByName = (instance: ReactTestInstance) =>
  function getAllByNameFn(name: string | React.ComponentType<*>) {
    logDeprecationWarning('getAllByName', 'getAllByType');
    const results =
      typeof name === 'string'
        ? instance.findAll(node => filterNodeByName(node, name))
        : instance.findAllByType(name);
    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllByNameFn);
    }
    return results;
  };

export const getAllByType = (instance: ReactTestInstance) =>
  function getAllByTypeFn(type: React.ComponentType<*>) {
    const results = instance.findAllByType(type);
    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllByTypeFn);
    }
    return results;
  };

export const getAllByText = (instance: ReactTestInstance) =>
  function getAllByTextFn(text: string | RegExp) {
    const results = instance.findAll(node => getNodeByText(node, text));
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with text: ${String(text)}`,
        getAllByTextFn
      );
    }
    return results;
  };

export const getAllByPlaceholder = (instance: ReactTestInstance) =>
  function getAllByPlaceholderFn(placeholder: string | RegExp) {
    const results = instance.findAll(node =>
      getTextInputNodeByPlaceholder(node, placeholder)
    );
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with placeholder: ${String(placeholder)}`,
        getAllByPlaceholderFn
      );
    }
    return results;
  };

export const getAllByProps = (instance: ReactTestInstance) =>
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

export const getAllByTestId = (instance: ReactTestInstance) =>
  function getAllByTestIdFn(testID: string) {
    const results = instance.findAllByProps({ testID });
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with testID: ${String(testID)}`,
        getAllByTestIdFn
      );
    }
    return results;
  };

export const getByAPI = (instance: ReactTestInstance) => ({
  getBy: getBy(instance),
  getByTestId: getByTestId(instance),
  getByName: getByName(instance),
  getByType: getByType(instance),
  getByText: getByText(instance),
  getByPlaceholder: getByPlaceholder(instance),
  getByProps: getByProps(instance),
  getAllBy: getAllBy(instance),
  getAllByTestId: getAllByTestId(instance),
  getAllByName: getAllByName(instance),
  getAllByType: getAllByType(instance),
  getAllByText: getAllByText(instance),
  getAllByPlaceholder: getAllByPlaceholder(instance),
  getAllByProps: getAllByProps(instance),
});
