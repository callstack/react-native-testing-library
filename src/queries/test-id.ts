import type { HostElement } from 'universal-test-renderer';

import { findAll } from '../helpers/find-all';
import type { TextMatch, TextMatchOptions } from '../matches';
import { matches } from '../matches';
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

type ByTestIdOptions = CommonQueryOptions & TextMatchOptions;

const matchTestId = (node: HostElement, testId: TextMatch, options: TextMatchOptions = {}) => {
  const { exact, normalizer } = options;
  return matches(testId, node.props.testID, normalizer, exact);
};

const queryAllByTestId = (element: HostElement): QueryAllByQuery<TextMatch, ByTestIdOptions> =>
  function queryAllByTestIdFn(testId, queryOptions) {
    return findAll(element, (node) => matchTestId(node, testId, queryOptions), queryOptions);
  };

const getMultipleError = (testId: TextMatch) =>
  `Found multiple elements with testID: ${String(testId)}`;
const getMissingError = (testId: TextMatch) =>
  `Unable to find an element with testID: ${String(testId)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByTestId,
  getMissingError,
  getMultipleError,
);

export type ByTestIdQueries = {
  getByTestId: GetByQuery<TextMatch, ByTestIdOptions>;
  getAllByTestId: GetAllByQuery<TextMatch, ByTestIdOptions>;
  queryByTestId: QueryByQuery<TextMatch, ByTestIdOptions>;
  queryAllByTestId: QueryAllByQuery<TextMatch, ByTestIdOptions>;
  findByTestId: FindByQuery<TextMatch, ByTestIdOptions>;
  findAllByTestId: FindAllByQuery<TextMatch, ByTestIdOptions>;
};

export const bindByTestIdQueries = (element: HostElement): ByTestIdQueries => ({
  getByTestId: getBy(element),
  getAllByTestId: getAllBy(element),
  queryByTestId: queryBy(element),
  queryAllByTestId: queryAllBy(element),
  findByTestId: findBy(element),
  findAllByTestId: findAllBy(element),
});
