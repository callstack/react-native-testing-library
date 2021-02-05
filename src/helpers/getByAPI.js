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
import { getAllByTestId, getByTestId } from './byTestId';

export type GetByAPI = {|
  getByText: (text: string | RegExp) => ReactTestInstance,
  getByPlaceholderText: (placeholder: string | RegExp) => ReactTestInstance,
  getByDisplayValue: (value: string | RegExp) => ReactTestInstance,
  getByTestId: (testID: string | RegExp) => ReactTestInstance,
  getAllByTestId: (testID: string | RegExp) => Array<ReactTestInstance>,
  getAllByText: (text: string | RegExp) => Array<ReactTestInstance>,
  getAllByPlaceholderText: (
    placeholder: string | RegExp
  ) => Array<ReactTestInstance>,
  getAllByDisplayValue: (value: string | RegExp) => Array<ReactTestInstance>,

  // Unsafe aliases
  UNSAFE_getByType: <P>(type: React.ComponentType<P>) => ReactTestInstance,
  UNSAFE_getAllByType: <P>(
    type: React.ComponentType<P>
  ) => Array<ReactTestInstance>,
  UNSAFE_getByProps: (props: { [string]: any }) => ReactTestInstance,
  UNSAFE_getAllByProps: (props: { [string]: any }) => Array<ReactTestInstance>,

  getByName: () => void,
  getByType: () => void,
  getByProps: () => void,
  getAllByName: () => void,
  getAllByType: () => void,
  getAllByProps: () => void,

  getByPlaceholder: () => void,
  getAllByPlaceholder: () => void,
|};

const filterNodeByType = (node, type) => node?.type === type;

const getNodeByText = (node, text) => {
  try {
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

    const isParentTextComponent = filterNodeByType(node.parent?.parent, Text);
    if (isParentTextComponent && !isTextComponent) {
      if (typeof node.children?.[0] === 'string') {
        const textToTest = node.children.join('');
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
    const { TextInput } = require('react-native');
    const nodeValue =
      node.props.value !== undefined
        ? node.props.value
        : node.props.defaultValue;
    return (
      filterNodeByType(node, TextInput) &&
      (typeof value === 'string' ? value === nodeValue : value.test(nodeValue))
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

export const getByText = (
  instance: ReactTestInstance
): ((text: string | RegExp) => ReactTestInstance) =>
  function getByTextFn(text: string | RegExp) {
    try {
      return instance.find((node) => getNodeByText(node, text));
    } catch (error) {
      throw new ErrorWithStack(
        prepareErrorMessage(error, 'text', text),
        getByTextFn
      );
    }
  };

export const getByPlaceholderText = (
  instance: ReactTestInstance
): ((placeholder: string | RegExp) => ReactTestInstance) =>
  function getByPlaceholderTextFn(placeholder: string | RegExp) {
    try {
      return instance.find((node) =>
        getTextInputNodeByPlaceholderText(node, placeholder)
      );
    } catch (error) {
      throw new ErrorWithStack(
        prepareErrorMessage(error, 'placeholder', placeholder),
        getByPlaceholderTextFn
      );
    }
  };

export const getByDisplayValue = (
  instance: ReactTestInstance
): ((displayValue: string | RegExp) => ReactTestInstance) =>
  function getByDisplayValueFn(displayValue: string | RegExp) {
    try {
      return instance.find((node) =>
        getTextInputNodeByDisplayValue(node, displayValue)
      );
    } catch (error) {
      throw new ErrorWithStack(
        prepareErrorMessage(error, 'display value', displayValue),
        getByDisplayValueFn
      );
    }
  };

export const getAllByText = (
  instance: ReactTestInstance
): ((text: string | RegExp) => Array<ReactTestInstance>) =>
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

export const getAllByPlaceholderText = (
  instance: ReactTestInstance
): ((placeholder: string | RegExp) => Array<ReactTestInstance>) =>
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

export const getAllByDisplayValue = (
  instance: ReactTestInstance
): ((value: string | RegExp) => Array<ReactTestInstance>) =>
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
