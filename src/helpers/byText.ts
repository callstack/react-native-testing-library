import type {
  ReactTestInstance,
  ReactTestRenderer,
  ReactTestRendererTree,
} from 'react-test-renderer';
import * as React from 'react';
import { matches, TextMatch } from '../matches';
import type { NormalizerFn } from '../matches';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { createLibraryNotSupportedError } from './errors';

export type TextMatchOptions = {
  exact?: boolean;
  normalizer?: NormalizerFn;
};

const getChildrenAsText = (
  children: ReactTestRendererTree | ReactTestRendererTree[] | null,
  TextComponent: React.ComponentType
): string[] => {
  if (!children) {
    return [];
  }

  if (typeof children === 'string') {
    return [children];
  }

  const textContent: string[] = [];
  if (!Array.isArray(children)) {
    // Bail on traversing text children down the tree if current node (child)
    // has no text. In such situations, react-test-renderer will traverse down
    // this tree in a separate call and run this query again. As a result, the
    // query will match the deepest text node that matches requested text.
    if (children.type === 'Text') {
      return [];
    }

    return getChildrenAsText(children.rendered, TextComponent);
  }

  children.forEach((child) =>
    textContent.push(...getChildrenAsText(child, TextComponent))
  );

  return textContent;
};

const getInstancesByText = (
  tree: ReactTestRendererTree,
  text: TextMatch,
  options: TextMatchOptions = {}
): Omit<ReactTestInstance, 'parent'>[] => {
  const instances: Omit<ReactTestInstance, 'parent'>[] = [];

  try {
    if (!tree.rendered) {
      return [];
    }

    if (!tree.instance) {
      if (!Array.isArray(tree.rendered)) {
        return [...getInstancesByText(tree.rendered, text, options)];
      }

      tree.rendered.forEach((rendered) => {
        instances.push(...getInstancesByText(rendered, text, options));
      });
      return instances;
    }

    const textChildren: string[] = [];
    const { Text } = require('react-native');
    if (!Array.isArray(tree.rendered)) {
      if (tree.rendered.type === 'Text') {
        textChildren.push(...getChildrenAsText(tree.rendered.rendered, Text));
      }
      instances.push(...getInstancesByText(tree.rendered, text, options));
    } else {
      tree.rendered.forEach((child) => {
        if (child.type === 'Text') {
          textChildren.push(...getChildrenAsText(child, Text));
        } else {
          instances.push(...getInstancesByText(child, text, options));
        }
      });
    }

    if (textChildren.length) {
      const textToTest = textChildren.join('');
      const { exact, normalizer } = options;
      if (matches(text, textToTest, normalizer, exact)) {
        instances.push(tree.instance);
      }
    }

    return instances;
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByText = (
  renderer: ReactTestRenderer
): ((
  text: TextMatch,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByTextFn(text, queryOptions) {
    const tree = renderer.toTree();
    const treeInstance = renderer.root;

    if (!tree) {
      return [];
    }

    const instancesFound = getInstancesByText(tree, text, queryOptions);

    // Instances in the tree are not of type ReactTestInstance because they do not have parent
    // This is problematic when firing events so we find in the root nodes the one that matches
    return instancesFound.map((instanceFound) => {
      return treeInstance.find((treeInstance) => {
        return (
          treeInstance.instance &&
          treeInstance.instance._reactInternals.stateNode === instanceFound
        );
      });
    });
  };

const getMultipleError = (text: TextMatch) =>
  `Found multiple elements with text: ${String(text)}`;
const getMissingError = (text: TextMatch) =>
  `Unable to find an element with text: ${String(text)}`;

const {
  getBy: getByText,
  getAllBy: getAllByText,
  queryBy: queryByText,
  findBy: findByText,
  findAllBy: findAllByText,
}: Queries<TextMatch> = makeQueries(
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
