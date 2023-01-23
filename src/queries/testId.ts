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
import type { CommonQueryOptions } from './options';

type ByTestIdOptions = CommonQueryOptions & TextMatchOptions;

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
  queryOptions?: ByTestIdOptions
) => Array<ReactTestInstance>) =>
  function queryAllByTestIdFn(testId, queryOptions) {
    return findAll(
      instance,
      (node) =>
        typeof node.type === 'string' &&
        getNodeByTestId(node, testId, queryOptions),
      queryOptions
    );
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
  getByTestId: GetByQuery<TextMatch, ByTestIdOptions>;
  getAllByTestId: GetAllByQuery<TextMatch, ByTestIdOptions>;
  queryByTestId: QueryByQuery<TextMatch, ByTestIdOptions>;
  queryAllByTestId: QueryAllByQuery<TextMatch, ByTestIdOptions>;
  findByTestId: FindByQuery<TextMatch, ByTestIdOptions>;
  findAllByTestId: FindAllByQuery<TextMatch, ByTestIdOptions>;
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
