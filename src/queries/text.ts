import type { ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import {
  isHostElementForType,
  getCompositeParentOfType,
} from '../helpers/component-tree';
import { findAll } from '../helpers/findAll';
import { matchTextContent } from '../helpers/matchers/matchTextContent';
import { TextMatch, TextMatchOptions } from '../matches';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import { CommonQueryOptions } from './options';

type ByTextOptions = CommonQueryOptions & TextMatchOptions;

const queryAllByText = (
  instance: ReactTestInstance
): ((text: TextMatch, options?: ByTextOptions) => Array<ReactTestInstance>) =>
  function queryAllByTextFn(text, options) {
    const baseInstance = isHostElementForType(instance, Text)
      ? getCompositeParentOfType(instance, Text)
      : instance;

    if (!baseInstance) {
      return [];
    }

    const results = findAll(
      baseInstance,
      (node) => matchTextContent(node, text, options),
      { ...options, matchDeepestOnly: true }
    );

    return results;
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
  getByText: GetByQuery<TextMatch, ByTextOptions>;
  getAllByText: GetAllByQuery<TextMatch, ByTextOptions>;
  queryByText: QueryByQuery<TextMatch, ByTextOptions>;
  queryAllByText: QueryAllByQuery<TextMatch, ByTextOptions>;
  findByText: FindByQuery<TextMatch, ByTextOptions>;
  findAllByText: FindAllByQuery<TextMatch, ByTextOptions>;
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
