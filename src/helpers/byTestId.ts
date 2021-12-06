import type { ReactTestInstance } from 'react-test-renderer';
import { matches } from '../matches';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import type { TextMatchOptions } from './byText';

const getNodeByTestId = (
  node: ReactTestInstance,
  testID: string | RegExp,
  options: TextMatchOptions = {}
) => {
  const { exact, normalizer } = options;
  return matches(testID, node.props.testID, normalizer, exact);
};

const queryAllByTestId = (
  instance: ReactTestInstance
): ((
  testId: string | RegExp,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByTestIdFn(testId, queryOptions) {
    const results = instance
      .findAll((node) => getNodeByTestId(node, testId, queryOptions))
      .filter((element) => typeof element.type === 'string');

    return results;
  };

const getMultipleError = (testId: string | RegExp) =>
  `Found multiple elements with testID: ${String(testId)}`;
const getMissingError = (testId: string | RegExp) =>
  `Unable to find an element with testID: ${String(testId)}`;

const {
  getBy: getByTestId,
  getAllBy: getAllByTestId,
  queryBy: queryByTestId,
  findBy: findByTestId,
  findAllBy: findAllByTestId,
}: Queries<string | RegExp> = makeQueries(
  queryAllByTestId,
  getMissingError,
  getMultipleError
);

export {
  findAllByTestId,
  findByTestId,
  getAllByTestId,
  getByTestId,
  queryAllByTestId,
  queryByTestId,
};
