import type { ContainerElement, HostElement } from 'universal-test-renderer';

import { findAll } from '../helpers/find-all';
import { isHostTextInput } from '../helpers/host-component-names';
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

type ByPlaceholderTextOptions = CommonQueryOptions & TextMatchOptions;

const matchPlaceholderText = (
  node: HostElement,
  placeholder: TextMatch,
  options: TextMatchOptions = {},
) => {
  const { exact, normalizer } = options;
  return matches(placeholder, node.props.placeholder, normalizer, exact);
};

const queryAllByPlaceholderText = (
  instance: ContainerElement | HostElement,
): QueryAllByQuery<TextMatch, ByPlaceholderTextOptions> =>
  function queryAllByPlaceholderFn(placeholder, queryOptions) {
    return findAll(
      instance,
      (node) => isHostTextInput(node) && matchPlaceholderText(node, placeholder, queryOptions),
      queryOptions,
    );
  };

const getMultipleError = (placeholder: TextMatch) =>
  `Found multiple elements with placeholder: ${String(placeholder)} `;
const getMissingError = (placeholder: TextMatch) =>
  `Unable to find an element with placeholder: ${String(placeholder)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByPlaceholderText,
  getMissingError,
  getMultipleError,
);

export type ByPlaceholderTextQueries = {
  getByPlaceholderText: GetByQuery<TextMatch, ByPlaceholderTextOptions>;
  getAllByPlaceholderText: GetAllByQuery<TextMatch, ByPlaceholderTextOptions>;
  queryByPlaceholderText: QueryByQuery<TextMatch, ByPlaceholderTextOptions>;
  queryAllByPlaceholderText: QueryAllByQuery<TextMatch, ByPlaceholderTextOptions>;
  findByPlaceholderText: FindByQuery<TextMatch, ByPlaceholderTextOptions>;
  findAllByPlaceholderText: FindAllByQuery<TextMatch, ByPlaceholderTextOptions>;
};

export const bindByPlaceholderTextQueries = (
  instance: ContainerElement | HostElement,
): ByPlaceholderTextQueries => ({
  getByPlaceholderText: getBy(instance),
  getAllByPlaceholderText: getAllBy(instance),
  queryByPlaceholderText: queryBy(instance),
  queryAllByPlaceholderText: queryAllBy(instance),
  findByPlaceholderText: findBy(instance),
  findAllByPlaceholderText: findAllBy(instance),
});
