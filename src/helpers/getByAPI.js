// @flow
import * as React from 'react';
import prettyFormat from 'pretty-format';
import {
  ErrorWithStack,
  createLibraryNotSupportedError,
  prepareErrorMessage,
  throwRemovedFunctionError,
  throwRenamedFunctionError,
} from './errors';

const filterNodeByType = (node, type) => node.type === type;

const getNodeByText = (node, text) => {
  try {
    // eslint-disable-next-line
    const { Text } = require('react-native');
    const isTextComponent = filterNodeByType(node, Text);
    if (isTextComponent) {
      const textChildren = getChildrenAsText(node.props.children, Text);
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

const getChildrenAsText = (children, TextComponent, textContent = []) => {
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      textContent.push(child);
      return;
    }

    if (typeof child === 'number') {
      textContent.push(child.toString());
      return;
    }

    if (child?.props?.children) {
      // Bail on traversing text children down the tree if current node (child)
      // has no text. In such situations, react-test-renderer will traverse down
      // this tree in a separate call and run this query again. As a result, the
      // query will match the deepest text node that matches requested text.
      if (filterNodeByType(child, TextComponent) && textContent.length === 0) {
        return;
      }

      getChildrenAsText(child.props.children, TextComponent, textContent);
    }
  });

  return textContent;
};

const getTextInputNodeByPlaceholderText = (node, placeholder) => {
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

const getTextInputNodeByDisplayValue = (node, value) => {
  try {
    // eslint-disable-next-line
    const { TextInput } = require('react-native');
    return (
      filterNodeByType(node, TextInput) &&
      (typeof value === 'string'
        ? value === node.props.value
        : value.test(node.props.value))
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

export const getByText = (instance: ReactTestInstance) =>
  function getByTextFn(text: string | RegExp) {
    try {
      return instance.find((node) => getNodeByText(node, text));
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTextFn);
    }
  };

export const getByPlaceholderText = (instance: ReactTestInstance) =>
  function getByPlaceholderTextFn(placeholder: string | RegExp) {
    try {
      return instance.find((node) =>
        getTextInputNodeByPlaceholderText(node, placeholder)
      );
    } catch (error) {
      throw new ErrorWithStack(
        prepareErrorMessage(error),
        getByPlaceholderTextFn
      );
    }
  };

export const getByDisplayValue = (instance: ReactTestInstance) =>
  function getByDisplayValueFn(placeholder: string | RegExp) {
    try {
      return instance.find((node) =>
        getTextInputNodeByDisplayValue(node, placeholder)
      );
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByDisplayValueFn);
    }
  };

export const getByTestId = (instance: ReactTestInstance) =>
  function getByTestIdFn(testID: string) {
    try {
      const results = getAllByTestId(instance)(testID);
      if (results.length === 1) {
        return results[0];
      } else {
        throw new ErrorWithStack(
          ` Expected 1 but found ${
            results.length
          } instances with testID: ${String(testID)}`,
          getByTestIdFn
        );
      }
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTestIdFn);
    }
  };

export const getAllByText = (instance: ReactTestInstance) =>
  function getAllByTextFn(text: string | RegExp) {
    const results = instance.findAll((node) => getNodeByText(node, text));
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with text: ${String(text)}`,
        getAllByTextFn
      );
    }
    return results;
  };

export const getAllByPlaceholderText = (instance: ReactTestInstance) =>
  function getAllByPlaceholderTextFn(placeholder: string | RegExp) {
    const results = instance.findAll((node) =>
      getTextInputNodeByPlaceholderText(node, placeholder)
    );
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with placeholder: ${String(placeholder)}`,
        getAllByPlaceholderTextFn
      );
    }
    return results;
  };

export const getAllByDisplayValue = (instance: ReactTestInstance) =>
  function getAllByDisplayValueFn(value: string | RegExp) {
    const results = instance.findAll((node) =>
      getTextInputNodeByDisplayValue(node, value)
    );
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with display value: ${String(value)}`,
        getAllByDisplayValueFn
      );
    }
    return results;
  };

export const getAllByTestId = (instance: ReactTestInstance) =>
  function getAllByTestIdFn(testID: string): ReactTestInstance[] {
    const results = instance
      .findAllByProps({ testID })
      .filter((element) => typeof element.type === 'string');

    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with testID: ${String(testID)}`,
        getAllByTestIdFn
      );
    }
    return results;
  };

export const UNSAFE_getByType = (instance: ReactTestInstance) =>
  function getByTypeFn(type: React.ComponentType<any>) {
    try {
      return instance.findByType(type);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTypeFn);
    }
  };

export const UNSAFE_getByProps = (instance: ReactTestInstance) =>
  function getByPropsFn(props: { [propName: string]: any }) {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPropsFn);
    }
  };

export const UNSAFE_getAllByType = (instance: ReactTestInstance) =>
  function getAllByTypeFn(type: React.ComponentType<any>) {
    const results = instance.findAllByType(type);
    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllByTypeFn);
    }
    return results;
  };

export const UNSAFE_getAllByProps = (instance: ReactTestInstance) =>
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

export const getByAPI = (instance: ReactTestInstance) => ({
  getByText: getByText(instance),
  getByPlaceholderText: getByPlaceholderText(instance),
  getByDisplayValue: getByDisplayValue(instance),
  getByTestId: getByTestId(instance),
  getAllByText: getAllByText(instance),
  getAllByPlaceholderText: getAllByPlaceholderText(instance),
  getAllByDisplayValue: getAllByDisplayValue(instance),
  getAllByTestId: getAllByTestId(instance),

  // Unsafe
  UNSAFE_getByType: UNSAFE_getByType(instance),
  UNSAFE_getAllByType: UNSAFE_getAllByType(instance),
  UNSAFE_getByProps: UNSAFE_getByProps(instance),
  UNSAFE_getAllByProps: UNSAFE_getAllByProps(instance),

  // Removed
  getByName: () =>
    throwRemovedFunctionError('getByName', 'migration-v2#removed-functions'),
  getAllByName: () =>
    throwRemovedFunctionError('getAllByName', 'migration-v2#removed-functions'),
  getByType: () =>
    throwRemovedFunctionError('getByType', 'migration-v2#removed-functions'),
  getAllByType: () =>
    throwRemovedFunctionError('getAllByType', 'migration-v2#removed-functions'),
  getByProps: () =>
    throwRemovedFunctionError('getByProps', 'migration-v2#removed-functions'),
  getAllByProps: () =>
    throwRemovedFunctionError(
      'getAllByProps',
      'migration-v2#removed-functions'
    ),

  // Renamed
  getByPlaceholder: () =>
    throwRenamedFunctionError('getByPlaceholder', 'getByPlaceholderText'),
  getAllByPlaceholder: () =>
    throwRenamedFunctionError('getAllByPlaceholder', 'getByPlaceholderText'),
});
