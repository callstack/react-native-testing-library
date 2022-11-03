import type { ReactTestInstance } from 'react-test-renderer';
import { AccessibilityState } from 'react-native';
import { accessibilityStateKeys } from '../helpers/accessiblity';
import { matchAccessibilityState } from '../helpers/matchers/accessibilityState';
import { findAll } from '../helpers/findAll';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import { BaseOptions } from './options';

const queryAllByA11yState = (
  instance: ReactTestInstance
): ((
  matcher: AccessibilityState,
  queryOptions?: BaseOptions
) => Array<ReactTestInstance>) =>
  function queryAllByA11yStateFn(matcher, queryOptions) {
    return findAll(
      instance,
      (node) =>
        typeof node.type === 'string' && matchAccessibilityState(node, matcher),
      { hidden: queryOptions?.hidden }
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
  getByA11yState: GetByQuery<AccessibilityState, BaseOptions>;
  getAllByA11yState: GetAllByQuery<AccessibilityState, BaseOptions>;
  queryByA11yState: QueryByQuery<AccessibilityState, BaseOptions>;
  queryAllByA11yState: QueryAllByQuery<AccessibilityState, BaseOptions>;
  findByA11yState: FindByQuery<AccessibilityState, BaseOptions>;
  findAllByA11yState: FindAllByQuery<AccessibilityState, BaseOptions>;

  getByAccessibilityState: GetByQuery<AccessibilityState, BaseOptions>;
  getAllByAccessibilityState: GetAllByQuery<AccessibilityState, BaseOptions>;
  queryByAccessibilityState: QueryByQuery<AccessibilityState, BaseOptions>;
  queryAllByAccessibilityState: QueryAllByQuery<
    AccessibilityState,
    BaseOptions
  >;
  findByAccessibilityState: FindByQuery<AccessibilityState, BaseOptions>;
  findAllByAccessibilityState: FindAllByQuery<AccessibilityState, BaseOptions>;
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
  };
};
