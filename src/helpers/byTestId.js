// @flow
import {
  makeGetAllQuery,
  makeSingleQuery,
  makeGetQuery,
  makeFindAllQuery,
  makeFindQuery,
} from './makeQueries';

const getNodeByTestId = (node, testID) => {
  return typeof testID === 'string'
    ? testID === node.props.testID
    : testID.test(node.props.testID);
};

export const queryAllByTestId = (
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

export const getAllByTestId = (
  instance: ReactTestInstance
): ((testId: string | RegExp) => Array<ReactTestInstance>) =>
  makeGetAllQuery(queryAllByTestId, instance, getMissingError);

export const queryByTestId = (
  instance: ReactTestInstance
): ((testId: string | RegExp) => ReactTestInstance | null) =>
  makeSingleQuery(queryAllByTestId, instance, getMultipleError);

export const getByTestId = (
  instance: ReactTestInstance
): ((testId: string | RegExp) => ReactTestInstance) =>
  makeGetQuery(queryAllByTestId, instance, getMultipleError, getMissingError);

export const findAllByTestId = (
  instance: ReactTestInstance
): ((testId: string | RegExp) => Promise<Array<ReactTestInstance>>) =>
  makeFindAllQuery(getAllByTestId, instance);

export const findByTestId = (
  instance: ReactTestInstance
): ((testId: string | RegExp) => Promise<ReactTestInstance>) =>
  makeFindQuery(getByTestId, instance);
