import type { ReactTestInstance } from 'react-test-renderer';
import { findAll } from '../helpers/findAll';
import { matches, TextMatch, TextMatchOptions } from '../matches';
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

type ByLabelTextOptions = CommonQueryOptions & TextMatchOptions;

const getNodeByLabelText = (
  node: ReactTestInstance,
  text: TextMatch,
  options: TextMatchOptions = {}
) => {
  const { exact, normalizer } = options;
  return matches(text, node.props.accessibilityLabel, normalizer, exact);
};

const queryAllByLabelText = (
  instance: ReactTestInstance
): ((
  text: TextMatch,
  queryOptions?: ByLabelTextOptions
) => Array<ReactTestInstance>) =>
  function queryAllByLabelTextFn(text, queryOptions) {
    return findAll(
      instance,
      (node) =>
        typeof node.type === 'string' &&
        getNodeByLabelText(node, text, queryOptions),
      queryOptions
    );
  };

const getMultipleError = (labelText: TextMatch) =>
  `Found multiple elements with accessibilityLabel: ${String(labelText)} `;
const getMissingError = (labelText: TextMatch) =>
  `Unable to find an element with accessibilityLabel: ${String(labelText)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByLabelText,
  getMissingError,
  getMultipleError
);

export type ByLabelTextQueries = {
  getByLabelText: GetByQuery<TextMatch, ByLabelTextOptions>;
  getAllByLabelText: GetAllByQuery<TextMatch, ByLabelTextOptions>;
  queryByLabelText: QueryByQuery<TextMatch, ByLabelTextOptions>;
  queryAllByLabelText: QueryAllByQuery<TextMatch, ByLabelTextOptions>;
  findByLabelText: FindByQuery<TextMatch, ByLabelTextOptions>;
  findAllByLabelText: FindAllByQuery<TextMatch, ByLabelTextOptions>;
};

export const bindByLabelTextQueries = (
  instance: ReactTestInstance
): ByLabelTextQueries => ({
  getByLabelText: getBy(instance),
  getAllByLabelText: getAllBy(instance),
  queryByLabelText: queryBy(instance),
  queryAllByLabelText: queryAllBy(instance),
  findByLabelText: findBy(instance),
  findAllByLabelText: findAllBy(instance),
});
