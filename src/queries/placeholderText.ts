import type { ReactTestInstance } from 'react-test-renderer';
import { findAll } from '../helpers/findAll';
import { matches, TextMatch, TextMatchOptions } from '../matches';
import { isHostTextInput } from '../helpers/host-component-names';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import type { CommonQueryOptions } from './options';

type ByPlaceholderTextOptions = CommonQueryOptions & TextMatchOptions;

const matchPlaceholderText = (
  node: ReactTestInstance,
  placeholder: TextMatch,
  options: TextMatchOptions = {}
) => {
  const { exact, normalizer } = options;
  return matches(placeholder, node.props.placeholder, normalizer, exact);
};

const queryAllByPlaceholderText = (
  instance: ReactTestInstance
): QueryAllByQuery<TextMatch, ByPlaceholderTextOptions> =>
  function queryAllByPlaceholderFn(placeholder, queryOptions) {
    return findAll(
      instance,
      (node) =>
        isHostTextInput(node) &&
        matchPlaceholderText(node, placeholder, queryOptions),
      queryOptions
    );
  };

const getMultipleError = (placeholder: TextMatch) =>
  `Found multiple elements with placeholder: ${String(placeholder)} `;
const getMissingError = (placeholder: TextMatch) =>
  `Unable to find an element with placeholder: ${String(placeholder)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByPlaceholderText,
  getMissingError,
  getMultipleError
);

export type ByPlaceholderTextQueries = {
  getByPlaceholderText: GetByQuery<TextMatch, ByPlaceholderTextOptions>;
  getAllByPlaceholderText: GetAllByQuery<TextMatch, ByPlaceholderTextOptions>;
  queryByPlaceholderText: QueryByQuery<TextMatch, ByPlaceholderTextOptions>;
  queryAllByPlaceholderText: QueryAllByQuery<
    TextMatch,
    ByPlaceholderTextOptions
  >;
  findByPlaceholderText: FindByQuery<TextMatch, ByPlaceholderTextOptions>;
  findAllByPlaceholderText: FindAllByQuery<TextMatch, ByPlaceholderTextOptions>;
};

export const bindByPlaceholderTextQueries = (
  instance: ReactTestInstance
): ByPlaceholderTextQueries => ({
  getByPlaceholderText: getBy(instance),
  getAllByPlaceholderText: getAllBy(instance),
  queryByPlaceholderText: queryBy(instance),
  queryAllByPlaceholderText: queryAllBy(instance),
  findByPlaceholderText: findBy(instance),
  findAllByPlaceholderText: findAllBy(instance),
});
