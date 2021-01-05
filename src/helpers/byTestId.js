// @flow
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';

const getNodeByTestId = (node, testID) => {
  return typeof testID === 'string'
    ? testID === node.props.testID
    : testID.test(node.props.testID);
};

const queryAllByTestId = (
  instance: ReactTestInstance
): ((testId: string | RegExp) => Array<ReactTestInstance>) =>
  function getAllByTestIdFn(testId) {
    const results = instance
      .findAll((node) => getNodeByTestId(node, testId))
      .filter((element) => typeof element.type === 'string');

    return results;
  };

const getMultipleError = (testId) =>
  `Found multiple elements with testID: ${String(testId)}`;
const getMissingError = (testId) =>
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
  getByTestId,
  getAllByTestId,
  queryByTestId,
  findByTestId,
  findAllByTestId,
  queryAllByTestId,
};
