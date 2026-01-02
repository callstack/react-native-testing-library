import type { HostElement } from 'universal-test-renderer';

import { findAll } from '../helpers/find-all';
import { isHostText } from '../helpers/host-component-names';
import { matchTextContent } from '../helpers/matchers/match-text-content';
import type { TextMatch, TextMatchOptions } from '../matches';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './make-queries';
import { makeQueries } from './make-queries';
import type { CommonQueryOptions } from './options';

type ByTextOptions = CommonQueryOptions & TextMatchOptions;

const queryAllByText = (element: HostElement): QueryAllByQuery<TextMatch, ByTextOptions> =>
  function queryAllByTextFn(text, options = {}) {
    return findAll(element, (node) => isHostText(node) && matchTextContent(node, text, options), {
      ...options,
      matchDeepestOnly: true,
    });
  };

const getMultipleError = (text: TextMatch) => `Found multiple elements with text: ${String(text)}`;

const getMissingError = (text: TextMatch) => `Unable to find an element with text: ${String(text)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByText,
  getMissingError,
  getMultipleError,
);

export type ByTextQueries = {
  getByText: GetByQuery<TextMatch, ByTextOptions>;
  getAllByText: GetAllByQuery<TextMatch, ByTextOptions>;
  queryByText: QueryByQuery<TextMatch, ByTextOptions>;
  queryAllByText: QueryAllByQuery<TextMatch, ByTextOptions>;
  findByText: FindByQuery<TextMatch, ByTextOptions>;
  findAllByText: FindAllByQuery<TextMatch, ByTextOptions>;
};

export const bindByTextQueries = (element: HostElement): ByTextQueries => ({
  getByText: getBy(element),
  getAllByText: getAllBy(element),
  queryByText: queryBy(element),
  queryAllByText: queryAllBy(element),
  findByText: findBy(element),
  findAllByText: findAllBy(element),
});
