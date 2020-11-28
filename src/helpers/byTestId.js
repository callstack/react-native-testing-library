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

export const queryAllByTestId = (instance: ReactTestInstance) =>
  function getAllByTestIdFn(testID: string | RegExp): ReactTestInstance[] {
    const results = instance
      .findAll((node) => getNodeByTestId(node, testID))
      .filter((element) => typeof element.type === 'string');

    return results;
  };

export const getAllByTestId = (instance: ReactTestInstance) =>
  makeGetAllQuery(
    queryAllByTestId,
    instance,
    (testId) => `No instances found with testID: ${String(testId)}`
  );

export const queryByTestId = (instance: ReactTestInstance) =>
  makeSingleQuery(
    queryAllByTestId,
    instance,
    (testId: string, nbResults: number) =>
      ` Expected 1 but found ${nbResults} instances with testID: ${String(
        testId
      )}`
  );

export const getByTestId = (instance: ReactTestInstance) =>
  makeGetQuery(
    queryAllByTestId,
    instance,
    (testId: string, nbResults: number) =>
      nbResults > 1
        ? ` Expected 1 but found ${nbResults} instances with testID: ${String(
            testId
          )}`
        : `No instances found with testID: ${String(testId)}`
  );

export const findAllByTestId = (instance: ReactTestInstance) =>
  makeFindAllQuery(getAllByTestId, instance);

export const findByTestId = (instance: ReactTestInstance) =>
  makeFindQuery(getByTestId, instance);
