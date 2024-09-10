import type { ReactTestInstance } from 'react-test-renderer';
import { findAll } from '../helpers/find-all';
import { isHostImage } from '../helpers/host-component-names';
import { matches, TextMatch, TextMatchOptions } from '../matches';
import { makeQueries } from './make-queries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './make-queries';
import type { CommonQueryOptions } from './options';

type ByAltTextOptions = CommonQueryOptions & TextMatchOptions;

export function matchAltText(
  element: ReactTestInstance,
  expectedAltText: TextMatch,
  options: TextMatchOptions = {},
) {
  const altText = element.props.alt;
  if (altText == null) return false;

  const { normalizer, exact } = options;

  return matches(expectedAltText, altText, normalizer, exact);
}

const queryAllByAltText = (
  instance: ReactTestInstance,
): QueryAllByQuery<TextMatch, ByAltTextOptions> =>
  function queryAllByAltTextFn(text, options = {}) {
    return findAll(instance, (node) => isHostImage(node) && matchAltText(node, text, options), {
      ...options,
      matchDeepestOnly: true,
    });
  };

const getMultipleError = (text: TextMatch) =>
  `Found multiple elements with alt text: ${String(text)}`;

const getMissingError = (text: TextMatch) =>
  `Unable to find an element with alt text: ${String(text)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByAltText,
  getMissingError,
  getMultipleError,
);

export type ByAltTextQueries = {
  getByAltText: GetByQuery<TextMatch, ByAltTextOptions>;
  getAllByAltText: GetAllByQuery<TextMatch, ByAltTextOptions>;
  queryByAltText: QueryByQuery<TextMatch, ByAltTextOptions>;
  queryAllByAltText: QueryAllByQuery<TextMatch, ByAltTextOptions>;
  findByAltText: FindByQuery<TextMatch, ByAltTextOptions>;
  findAllByAltText: FindAllByQuery<TextMatch, ByAltTextOptions>;
};

export const bindByAltTextQueries = (instance: ReactTestInstance): ByAltTextQueries => ({
  getByAltText: getBy(instance),
  getAllByAltText: getAllBy(instance),
  queryByAltText: queryBy(instance),
  queryAllByAltText: queryAllBy(instance),
  findByAltText: findBy(instance),
  findAllByAltText: findAllBy(instance),
});
