import type { ReactTestInstance } from 'react-test-renderer';
import { AccessibilityState } from 'react-native';
import { accessibilityStateKeys } from '../helpers/accessiblity';
import { deprecateQueries } from '../helpers/deprecation';
import { findAll } from '../helpers/findAll';
import { matchAccessibilityState } from '../helpers/matchers/accessibilityState';
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
  matcher: AccessibilityState,
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

const buildErrorMessage = (state: AccessibilityState = {}) => {
  const errors: string[] = [];

  accessibilityStateKeys.forEach((stateKey) => {
    if (state[stateKey] !== undefined) {
      errors.push(`${stateKey} state: ${state[stateKey]}`);
    }
  });

  return errors.join(', ');
};

const getMultipleError = (state: AccessibilityState) =>
  `Found multiple elements with ${buildErrorMessage(state)}`;

const getMissingError = (state: AccessibilityState) =>
  `Unable to find an element with ${buildErrorMessage(state)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByA11yState,
  getMissingError,
  getMultipleError
);

export type ByA11yStateQueries = {
  getByA11yState: GetByQuery<AccessibilityState, CommonQueryOptions>;
  getAllByA11yState: GetAllByQuery<AccessibilityState, CommonQueryOptions>;
  queryByA11yState: QueryByQuery<AccessibilityState, CommonQueryOptions>;
  queryAllByA11yState: QueryAllByQuery<AccessibilityState, CommonQueryOptions>;
  findByA11yState: FindByQuery<AccessibilityState, CommonQueryOptions>;
  findAllByA11yState: FindAllByQuery<AccessibilityState, CommonQueryOptions>;

  getByAccessibilityState: GetByQuery<AccessibilityState, CommonQueryOptions>;
  getAllByAccessibilityState: GetAllByQuery<
    AccessibilityState,
    CommonQueryOptions
  >;
  queryByAccessibilityState: QueryByQuery<
    AccessibilityState,
    CommonQueryOptions
  >;
  queryAllByAccessibilityState: QueryAllByQuery<
    AccessibilityState,
    CommonQueryOptions
  >;
  findByAccessibilityState: FindByQuery<AccessibilityState, CommonQueryOptions>;
  findAllByAccessibilityState: FindAllByQuery<
    AccessibilityState,
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
      'Use {queryPrefix}ByRole(role, { disabled, selected, checked, busy, expanded }) query or expect(...).toHaveAccessibilityState(...) matcher instead.'
    ),
  };
};
