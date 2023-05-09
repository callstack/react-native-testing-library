import type { ReactTestInstance } from 'react-test-renderer';
import { accessibilityStateKeys } from '../helpers/accessiblity';
import { deprecateQueries } from '../helpers/deprecation';
import { findAll } from '../helpers/findAll';
import {
  AccessibilityStateMatcher,
  matchAccessibilityState,
} from '../helpers/matchers/accessibilityState';
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

const queryAllByA11yState = (
  instance: ReactTestInstance
): ((
  matcher: AccessibilityStateMatcher,
  queryOptions?: CommonQueryOptions
) => Array<ReactTestInstance>) =>
  function queryAllByA11yStateFn(matcher, queryOptions) {
    return findAll(
      instance,
      (node) =>
        typeof node.type === 'string' && matchAccessibilityState(node, matcher),
      queryOptions
    );
  };

const buildErrorMessage = (state: AccessibilityStateMatcher = {}) => {
  const errors: string[] = [];

  accessibilityStateKeys.forEach((stateKey) => {
    if (state[stateKey] !== undefined) {
      errors.push(`${stateKey} state: ${state[stateKey]}`);
    }
  });

  return errors.join(', ');
};

const getMultipleError = (state: AccessibilityStateMatcher) =>
  `Found multiple elements with ${buildErrorMessage(state)}`;

const getMissingError = (state: AccessibilityStateMatcher) =>
  `Unable to find an element with ${buildErrorMessage(state)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByA11yState,
  getMissingError,
  getMultipleError
);

export type ByA11yStateQueries = {
  getByA11yState: GetByQuery<AccessibilityStateMatcher, CommonQueryOptions>;
  getAllByA11yState: GetAllByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;
  queryByA11yState: QueryByQuery<AccessibilityStateMatcher, CommonQueryOptions>;
  queryAllByA11yState: QueryAllByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;
  findByA11yState: FindByQuery<AccessibilityStateMatcher, CommonQueryOptions>;
  findAllByA11yState: FindAllByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;

  getByAccessibilityState: GetByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;
  getAllByAccessibilityState: GetAllByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;
  queryByAccessibilityState: QueryByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;
  queryAllByAccessibilityState: QueryAllByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;
  findByAccessibilityState: FindByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;
  findAllByAccessibilityState: FindAllByQuery<
    AccessibilityStateMatcher,
    CommonQueryOptions
  >;
};

export const bindByA11yStateQueries = (
  instance: ReactTestInstance
): ByA11yStateQueries => {
  const getByA11yState = getBy(instance);
  const getAllByA11yState = getAllBy(instance);
  const queryByA11yState = queryBy(instance);
  const queryAllByA11yState = queryAllBy(instance);
  const findByA11yState = findBy(instance);
  const findAllByA11yState = findAllBy(instance);

  return {
    ...deprecateQueries(
      {
        getByA11yState,
        getAllByA11yState,
        queryByA11yState,
        queryAllByA11yState,
        findByA11yState,
        findAllByA11yState,
        getByAccessibilityState: getByA11yState,
        getAllByAccessibilityState: getAllByA11yState,
        queryByAccessibilityState: queryByA11yState,
        queryAllByAccessibilityState: queryAllByA11yState,
        findByAccessibilityState: findByA11yState,
        findAllByAccessibilityState: findAllByA11yState,
      },
      'Use {queryPrefix}ByRole(role, { disabled, selected, checked, busy, expanded }) query or expect(...).toHaveAccessibilityState(...) matcher from "@testing-library/jest-native" package instead.'
    ),
  };
};
