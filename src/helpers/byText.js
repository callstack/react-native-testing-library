// @flow
import * as React from 'react';
import { matches } from '../matches';
import type { NormalizerFn } from '../matches';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { filterNodeByType } from './filterNodeByType';
import { createLibraryNotSupportedError } from './errors';

export type TextMatchOptions = {
  exact?: boolean,
  normalizer?: NormalizerFn,
};

const getChildrenAsText = (children, TextComponent) => {
  const textContent = [];
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
      if (filterNodeByType(child, TextComponent)) {
        return;
      }

      if (filterNodeByType(child, React.Fragment)) {
        textContent.push(
          ...getChildrenAsText(child.props.children, TextComponent)
        );
      }
    }
  });

  return textContent;
};

const getNodeByText = (
  node,
  text: string | RegExp,
  options?: TextMatchOptions = {}
) => {
  try {
    const { Text } = require('react-native');
    const isTextComponent = filterNodeByType(node, Text);
    if (isTextComponent) {
      const textChildren = getChildrenAsText(node.props.children, Text);
      if (textChildren) {
        const textToTest = textChildren.join('');
        const { exact, normalizer } = options;
        return matches(text, textToTest, normalizer, exact);
      }
    }
    return false;
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByText = (
  instance: ReactTestInstance
): ((
  text: string | RegExp,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByTextFn(text, queryOptions) {
    const results = instance.findAll((node) =>
      getNodeByText(node, text, queryOptions)
    );

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
