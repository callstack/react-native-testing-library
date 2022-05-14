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

export function matchObject<T extends Record<string, unknown>>(
  prop: T | undefined,
  matcher: T
): boolean {
  return prop
    ? Object.keys(matcher).length !== 0 &&
        Object.keys(prop).length !== 0 &&
        !Object.keys(matcher).some((key) => prop[key] !== matcher[key])
    : false;
}

const queryAllByA11yState = (
  instance: ReactTestInstance
): ((accessibilityStateKey: AccessibilityState) => Array<ReactTestInstance>) =>
  function queryAllByDisplayValueFn(accessibilityStateKey) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchObject(node.props.accessibilityState, accessibilityStateKey)
    );
  };

const getMultipleError = (a11yState: AccessibilityState) =>
  `Found multiple elements with accessibilityState: ${JSON.stringify(
    a11yState
  )}`;
const getMissingError = (a11yState: AccessibilityState) =>
  `Unable to find an element with accessibilityState: ${JSON.stringify(
    a11yState
  )}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByA11yState,
  getMissingError,
  getMultipleError
);

export type ByA11yStateQueries = {
  getByA11yState: GetByQuery<AccessibilityState>;
  getAllByA11yState: GetAllByQuery<AccessibilityState>;
  queryByA11yState: QueryByQuery<AccessibilityState>;
  queryAllByA11yState: QueryAllByQuery<AccessibilityState>;
  findByA11yState: FindByQuery<AccessibilityState>;
  findAllByA11yState: FindAllByQuery<AccessibilityState>;
};

export const bindByA11yStateQueries = (
  instance: ReactTestInstance
): ByA11yStateQueries => ({
  getByA11yState: getBy(instance),
  getAllByA11yState: getAllBy(instance),
  queryByA11yState: queryBy(instance),
  queryAllByA11yState: queryAllBy(instance),
  findByA11yState: findBy(instance),
  findAllByA11yState: findAllBy(instance),
});
