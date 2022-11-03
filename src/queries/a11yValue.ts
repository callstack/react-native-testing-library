import type { ReactTestInstance } from 'react-test-renderer';
import { accessiblityValueKeys } from '../helpers/accessiblity';
import { findAll } from '../helpers/findAll';
import {
  AccessibilityValueMatcher,
  matchAccessibilityValue,
} from '../helpers/matchers/accessibilityValue';
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

const queryAllByA11yValue = (
  instance: ReactTestInstance
): ((
  value: AccessibilityValueMatcher,
  queryOptions?: CommonQueryOptions
) => Array<ReactTestInstance>) =>
  function queryAllByA11yValueFn(value, queryOptions) {
    return findAll(
      instance,
      (node) =>
        typeof node.type === 'string' && matchAccessibilityValue(node, value),
      queryOptions
    );
  };

const buildErrorMessage = (value: AccessibilityValueMatcher) => {
  const errors: string[] = [];

  accessiblityValueKeys.forEach((valueKey) => {
    if (value[valueKey] !== undefined) {
      errors.push(`${valueKey} value: ${value[valueKey]}`);
    }
  });

  return errors.join(', ');
};

const getMultipleError = (value: AccessibilityValueMatcher) =>
  `Found multiple elements with ${buildErrorMessage(value)}`;

const getMissingError = (value: AccessibilityValueMatcher) =>
  `Unable to find an element with ${buildErrorMessage(value)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByA11yValue,
  getMissingError,
  getMultipleError
);

export type ByA11yValueQueries = {
  getByA11yValue: GetByQuery<AccessibilityValueMatcher, CommonQueryOptions>;
  getAllByA11yValue: GetAllByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;
  queryByA11yValue: QueryByQuery<AccessibilityValueMatcher, CommonQueryOptions>;
  queryAllByA11yValue: QueryAllByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;
  findByA11yValue: FindByQuery<AccessibilityValueMatcher, CommonQueryOptions>;
  findAllByA11yValue: FindAllByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;

  getByAccessibilityValue: GetByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;
  getAllByAccessibilityValue: GetAllByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;
  queryByAccessibilityValue: QueryByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;
  queryAllByAccessibilityValue: QueryAllByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;
  findByAccessibilityValue: FindByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;
  findAllByAccessibilityValue: FindAllByQuery<
    AccessibilityValueMatcher,
    CommonQueryOptions
  >;
};

export const bindByA11yValueQueries = (
  instance: ReactTestInstance
): ByA11yValueQueries => {
  const getByA11yValue = getBy(instance);
  const getAllByA11yValue = getAllBy(instance);
  const queryByA11yValue = queryBy(instance);
  const queryAllByA11yValue = queryAllBy(instance);
  const findByA11yValue = findBy(instance);
  const findAllByA11yValue = findAllBy(instance);

  return {
    getByA11yValue,
    getAllByA11yValue,
    queryByA11yValue,
    queryAllByA11yValue,
    findByA11yValue,
    findAllByA11yValue,

    getByAccessibilityValue: getByA11yValue,
    getAllByAccessibilityValue: getAllByA11yValue,
    queryByAccessibilityValue: queryByA11yValue,
    queryAllByAccessibilityValue: queryAllByA11yValue,
    findByAccessibilityValue: findByA11yValue,
    findAllByAccessibilityValue: findAllByA11yValue,
  };
};
