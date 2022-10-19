import type { ReactTestInstance } from 'react-test-renderer';
import type { AccessibilityState } from 'react-native';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

/**
 * Default accessibility state values based on experiments using accessibility
 * inspector/screen reader on iOS and Android.
 *
 * @see https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State
 */
const defaultState: AccessibilityState = {
  disabled: false,
  selected: false,
  checked: undefined,
  busy: false,
  expanded: undefined,
};

export function matchAccessibilityState(
  node: ReactTestInstance,
  matcher: AccessibilityState
) {
  const state = node.props.accessibilityState;
  return (
    matchState(state, matcher, 'disabled') &&
    matchState(state, matcher, 'selected') &&
    matchState(state, matcher, 'checked') &&
    matchState(state, matcher, 'busy') &&
    matchState(state, matcher, 'expanded')
  );
}

function matchState(
  value: AccessibilityState,
  matcher: AccessibilityState,
  key: keyof AccessibilityState
) {
  const valueWithDefault = value?.[key] ?? defaultState[key];
  return matcher[key] === undefined || matcher[key] === valueWithDefault;
}

const queryAllByA11yState = (
  instance: ReactTestInstance
): ((matcher: AccessibilityState) => Array<ReactTestInstance>) =>
  function queryAllByA11yStateFn(matcher) {
    return instance.findAll((node) => {
      return (
        typeof node.type === 'string' && matchAccessibilityState(node, matcher)
      );
    });
  };

const getMultipleError = (state: AccessibilityState) =>
  `Found multiple elements with accessibilityState: ${JSON.stringify(state)}`;
const getMissingError = (state: AccessibilityState) =>
  `Unable to find an element with accessibilityState: ${JSON.stringify(state)}`;

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

  getByAccessibilityState: GetByQuery<AccessibilityState>;
  getAllByAccessibilityState: GetAllByQuery<AccessibilityState>;
  queryByAccessibilityState: QueryByQuery<AccessibilityState>;
  queryAllByAccessibilityState: QueryAllByQuery<AccessibilityState>;
  findByAccessibilityState: FindByQuery<AccessibilityState>;
  findAllByAccessibilityState: FindAllByQuery<AccessibilityState>;
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
