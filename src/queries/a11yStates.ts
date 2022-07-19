import type { ReactTestInstance } from 'react-test-renderer';
import { AccessibilityState } from 'react-native';
import { matchArrayProp } from '../helpers/matchers/matchArrayProp';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

type AccessibilityStateKey = keyof AccessibilityState;
type AccessibilityStateKeys =
  | AccessibilityStateKey
  | Array<AccessibilityStateKey>;

const queryAllByA11yStates = (
  instance: ReactTestInstance
): ((
  accessibilityStates: AccessibilityStateKeys
) => Array<ReactTestInstance>) =>
  function queryAllByA11yStatesFn(accessibilityStates) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchArrayProp(node.props.accessibilityState, accessibilityStates)
    );
  };

const getMultipleError = (states: AccessibilityStateKeys) =>
  `Found multiple elements with accessibilityState: ${JSON.stringify(states)}`;
const getMissingError = (states: AccessibilityStateKeys) =>
  `Unable to find an element with accessibilityState: ${JSON.stringify(
    states
  )}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByA11yStates,
  getMissingError,
  getMultipleError
);

export type ByA11yStatesQueries = {
  getByA11yStates: GetByQuery<AccessibilityStateKeys>;
  getAllByA11yStates: GetAllByQuery<AccessibilityStateKeys>;
  queryByA11yStates: QueryByQuery<AccessibilityStateKeys>;
  queryAllByA11yStates: QueryAllByQuery<AccessibilityStateKeys>;
  findByA11yStates: FindByQuery<AccessibilityStateKeys>;
  findAllByA11yStates: FindAllByQuery<AccessibilityStateKeys>;

  getByAccessibilityStates: GetByQuery<AccessibilityStateKeys>;
  getAllByAccessibilityStates: GetAllByQuery<AccessibilityStateKeys>;
  queryByAccessibilityStates: QueryByQuery<AccessibilityStateKeys>;
  queryAllByAccessibilityStates: QueryAllByQuery<AccessibilityStateKeys>;
  findByAccessibilityStates: FindByQuery<AccessibilityStateKeys>;
  findAllByAccessibilityStates: FindAllByQuery<AccessibilityStateKeys>;
};

export const bindByA11yStatesQueries = (
  instance: ReactTestInstance
): ByA11yStatesQueries => {
  const getByA11yStates = getBy(instance);
  const getAllByA11yStates = getAllBy(instance);
  const queryByA11yStates = queryBy(instance);
  const queryAllByA11yStates = queryAllBy(instance);
  const findByA11yStates = findBy(instance);
  const findAllByA11yStates = findAllBy(instance);

  return {
    getByA11yStates,
    getAllByA11yStates,
    queryByA11yStates,
    queryAllByA11yStates,
    findByA11yStates,
    findAllByA11yStates,

    getByAccessibilityStates: getByA11yStates,
    getAllByAccessibilityStates: getAllByA11yStates,
    queryByAccessibilityStates: queryByA11yStates,
    queryAllByAccessibilityStates: queryAllByA11yStates,
    findByAccessibilityStates: findByA11yStates,
    findAllByAccessibilityStates: findAllByA11yStates,
  };
};
