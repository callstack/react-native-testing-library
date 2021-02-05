// @flow
import * as React from 'react';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { filterNodeByType } from './filterNodeByType';
import { createLibraryNotSupportedError } from './errors';

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

const getNodeByText = (node, text: string | RegExp) => {
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
    return false;
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByText = (
  instance: ReactTestInstance
): ((text: string | RegExp) => Array<ReactTestInstance>) =>
  function queryAllByTextFn(text) {
    const results = instance.findAll((node) => getNodeByText(node, text));

    return results;
  };

const getMultipleError = (text: string | RegExp) =>
  `Found multiple elements with text: ${String(text)}`;
const getMissingError = (text: string | RegExp) =>
  `Unable to find an element with text: ${String(text)}`;

const {
  getBy: getByText,
  getAllBy: getAllByText,
  queryBy: queryByText,
  findBy: findByText,
  findAllBy: findAllByText,
}: Queries<string | RegExp> = makeQueries(
  queryAllByText,
  getMissingError,
  getMultipleError
);

export {
  findAllByText,
  findByText,
  getAllByText,
  getByText,
  queryAllByText,
  queryByText,
};
