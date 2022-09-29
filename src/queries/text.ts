import type { ReactTestInstance } from 'react-test-renderer';
import * as React from 'react';
import { createLibraryNotSupportedError } from '../helpers/errors';
import { filterNodeByType } from '../helpers/filterNodeByType';
import {
  isHostElementOfType,
  getCompositeParentOfType,
} from '../helpers/component-tree';
import { matches, TextMatch } from '../matches';
import type { NormalizerFn } from '../matches';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

export type TextMatchOptions = {
  exact?: boolean;
  normalizer?: NormalizerFn;
};

const getChildrenAsText = (
  children: React.ReactChild[],
  TextComponent: React.ComponentType
) => {
  const textContent: string[] = [];
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
  node: ReactTestInstance,
  text: TextMatch,
  TextComponent: React.ComponentType,
  options: TextMatchOptions = {}
) => {
  const isTextComponent = filterNodeByType(node, TextComponent);
  if (isTextComponent) {
    const textChildren = getChildrenAsText(node.props.children, TextComponent);
    if (textChildren) {
      const textToTest = textChildren.join('');
      const { exact, normalizer } = options;
      return matches(text, textToTest, normalizer, exact);
    }
  }
  return false;
};

const queryAllByText = (
  instance: ReactTestInstance
): ((
  text: TextMatch,
  options?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByTextFn(text, options) {
    try {
      const { Text } = require('react-native');
      const baseInstance = isHostElementOfType(instance, Text)
        ? getCompositeParentOfType(instance, Text)
        : instance;

      if (!baseInstance) {
        return [];
      }

      const results = baseInstance.findAll((node) =>
        getNodeByText(node, text, Text, options)
      );

      return results;
    } catch (error) {
      throw createLibraryNotSupportedError(error);
    }
  };

const getMultipleError = (text: TextMatch) =>
  `Found multiple elements with text: ${String(text)}`;
const getMissingError = (text: TextMatch) =>
  `Unable to find an element with text: ${String(text)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByText,
  getMissingError,
  getMultipleError
);

export type ByTextQueries = {
  getByText: GetByQuery<TextMatch, TextMatchOptions>;
  getAllByText: GetAllByQuery<TextMatch, TextMatchOptions>;
  queryByText: QueryByQuery<TextMatch, TextMatchOptions>;
  queryAllByText: QueryAllByQuery<TextMatch, TextMatchOptions>;
  findByText: FindByQuery<TextMatch, TextMatchOptions>;
  findAllByText: FindAllByQuery<TextMatch, TextMatchOptions>;
};

export const bindByTextQueries = (
  instance: ReactTestInstance
): ByTextQueries => ({
  getByText: getBy(instance),
  getAllByText: getAllBy(instance),
  queryByText: queryBy(instance),
  queryAllByText: queryAllBy(instance),
  findByText: findBy(instance),
  findAllByText: findAllBy(instance),
});
