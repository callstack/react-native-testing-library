// @flow
import * as React from 'react';
import {
  ErrorWithStack,
  createLibraryNotSupportedError,
  prepareErrorMessage,
} from './errors';

const filterNodeByType = (node, type) => node.type === type;

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

export const getByTestId = (instance: ReactTestInstance) =>
  function getByTestIdFn(testID: string) {
    try {
      return instance.findByProps({ testID });
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTestIdFn);
    }
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

export const getByAPI = (instance: ReactTestInstance) => ({
  getByTestId: getByTestId(instance),
  getByText: getByText(instance),
  getByPlaceholder: getByPlaceholder(instance),
  getAllByText: getAllByText(instance),
  getAllByPlaceholder: getAllByPlaceholder(instance),
});
