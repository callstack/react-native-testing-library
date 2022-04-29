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
import type { TextMatchOptions } from './text';

const getNodeByTestId = (
  node: ReactTestInstance,
  testID: TextMatch,
  options: TextMatchOptions = {}
) => {
  const { exact, normalizer } = options;
  return matches(testID, node.props.testID, normalizer, exact);
};

const queryAllByTestId = (
  instance: ReactTestInstance
): ((
  testId: TextMatch,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByTestIdFn(testId, queryOptions) {
    const results = instance
      .findAll((node) => getNodeByTestId(node, testId, queryOptions))
      .filter((element) => typeof element.type === 'string');

    return results;
  };

const getMultipleError = (testId: TextMatch) =>
  `Found multiple elements with testID: ${String(testId)}`;
const getMissingError = (testId: TextMatch) =>
  `Unable to find an element with testID: ${String(testId)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByTestId,
  getMissingError,
  getMultipleError
);

export type ByTestIdQueries = {
  getByTestId: GetByQuery<TextMatch, TextMatchOptions>;
  getAllByTestId: GetAllByQuery<TextMatch, TextMatchOptions>;
  queryByTestId: QueryByQuery<TextMatch, TextMatchOptions>;
  queryAllByTestId: QueryAllByQuery<TextMatch, TextMatchOptions>;
  findByTestId: FindByQuery<TextMatch, TextMatchOptions>;
  findAllByTestId: FindAllByQuery<TextMatch, TextMatchOptions>;
};

export const bindByTestIdQueries = (
  instance: ReactTestInstance
): ByTestIdQueries => ({
  getByTestId: getBy(instance),
  getAllByTestId: getAllBy(instance),
  queryByTestId: queryBy(instance),
  queryAllByTestId: queryAllBy(instance),
  findByTestId: findBy(instance),
  findAllByTestId: findAllBy(instance),
});
