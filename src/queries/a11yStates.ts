import type { ReactTestInstance } from 'react-test-renderer';
import { AccessibilityState } from 'react-native';
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

export function matchArrayValue(
  prop: Array<string> | undefined,
  matcher: string | Array<string>
): boolean {
  if (!prop || matcher.length === 0) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop.includes(matcher);
  }

  return !matcher.some((e) => !prop.includes(e));
}

const queryAllByA11yStates = (
  instance: ReactTestInstance
): ((
  accessibilityStateKey: AccessibilityStateKeys
) => Array<ReactTestInstance>) =>
  function queryAllByDisplayValueFn(accessibilityStateKey) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchArrayValue(node.props.accessibilityState, accessibilityStateKey)
    );
  };

const getMultipleError = (a11yStates: AccessibilityStateKeys) =>
  `Found multiple elements with accessibilityState: ${JSON.stringify(
    a11yStates
  )}`;
const getMissingError = (a11yStates: AccessibilityStateKeys) =>
  `Unable to find an element with accessibilityState: ${JSON.stringify(
    a11yStates
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
};

export const bindByA11yStatesQueries = (
  instance: ReactTestInstance
): ByA11yStatesQueries => ({
  getByA11yStates: getBy(instance),
  getAllByA11yStates: getAllBy(instance),
  queryByA11yStates: queryBy(instance),
  queryAllByA11yStates: queryAllBy(instance),
  findByA11yStates: findBy(instance),
  findAllByA11yStates: findAllBy(instance),
});
