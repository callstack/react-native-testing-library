import type { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch } from '../matches';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import { TextMatchOptions } from './text';

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
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByLabelTextFn(text, queryOptions?: TextMatchOptions) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        getNodeByLabelText(node, text, queryOptions)
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
  getByLabelText: GetByQuery<TextMatch, TextMatchOptions>;
  getAllByLabelText: GetAllByQuery<TextMatch, TextMatchOptions>;
  queryByLabelText: QueryByQuery<TextMatch, TextMatchOptions>;
  queryAllByLabelText: QueryAllByQuery<TextMatch, TextMatchOptions>;
  findByLabelText: FindByQuery<TextMatch, TextMatchOptions>;
  findAllByLabelText: FindAllByQuery<TextMatch, TextMatchOptions>;
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
