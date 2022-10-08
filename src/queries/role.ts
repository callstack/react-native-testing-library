import { type AccessibilityState } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { matchStringProp } from '../helpers/matchers/matchStringProp';
import { TextMatch } from '../matches';
import { getQueriesForElement } from '../within';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

type ByRoleOptions = {
  name?: TextMatch;
} & AccessibilityState;

type AccessibilityStateField = keyof AccessibilityState;

const matchAccessibleNameIfNeeded = (
  node: ReactTestInstance,
  name?: TextMatch
) => {
  if (name == null) return true;

  const { queryAllByText, queryAllByLabelText } = getQueriesForElement(node);
  return (
    queryAllByText(name).length > 0 || queryAllByLabelText(name).length > 0
  );
};

// disabled:undefined is equivalent to disabled:false, same for selected. busy not, but it makes
// sense from a testing/voice-over perspective. checked and expanded do behave differently
const implicityFalseState: AccessibilityStateField[] = [
  'disabled',
  'selected',
  'busy',
];

const matchAccessibleStateIfNeeded = (
  node: ReactTestInstance,
  options?: ByRoleOptions
) =>
  accessibilityStates.every((accessibilityState) => {
    const queriedState = options?.[accessibilityState];

    if (typeof queriedState !== 'undefined') {
      // Some accessibilityState properties have implicit value (when not set)
      const defaultState = implicityFalseState.includes(accessibilityState)
        ? false
        : undefined;
      return (
        queriedState ===
        (node.props.accessibilityState?.[accessibilityState] ?? defaultState)
      );
    } else {
      return true;
    }
  });

const accessibilityStates: AccessibilityStateField[] = [
  'disabled',
  'selected',
  'checked',
  'busy',
  'expanded',
];

const queryAllByRole = (
  instance: ReactTestInstance
): ((role: TextMatch, options?: ByRoleOptions) => Array<ReactTestInstance>) =>
  function queryAllByRoleFn(role, options) {
    return instance.findAll((node) => {
      // run the cheapest checks first, and early exit too avoid unneeded computations
      const matchRole =
        typeof node.type === 'string' &&
        matchStringProp(node.props.accessibilityRole, role);

      if (!matchRole) return false;

      if (!matchAccessibleStateIfNeeded(node, options)) {
        return false;
      }

      return matchAccessibleNameIfNeeded(node, options?.name);
    });
  };

const buildErrorMessage = (role: TextMatch, options: ByRoleOptions = {}) => {
  const errors = [`role: "${String(role)}"`];

  if (options.name) {
    errors.push(`name: "${String(options.name)}"`);
  }

  if (
    accessibilityStates.some(
      (accessibilityState) => typeof options[accessibilityState] !== 'undefined'
    )
  ) {
    accessibilityStates.forEach((accessibilityState) => {
      if (options[accessibilityState]) {
        errors.push(
          `${accessibilityState} state: ${options[accessibilityState]}`
        );
      }
    });
  }

  return errors.join(', ');
};
const getMultipleError = (role: TextMatch, options?: ByRoleOptions) =>
  `Found multiple elements with ${buildErrorMessage(role, options)}`;
const getMissingError = (role: TextMatch, options?: ByRoleOptions) =>
  `Unable to find an element with ${buildErrorMessage(role, options)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByRole,
  getMissingError,
  getMultipleError
);

export type ByRoleQueries = {
  getByRole: GetByQuery<TextMatch, ByRoleOptions>;
  getAllByRole: GetAllByQuery<TextMatch, ByRoleOptions>;
  queryByRole: QueryByQuery<TextMatch, ByRoleOptions>;
  queryAllByRole: QueryAllByQuery<TextMatch, ByRoleOptions>;
  findByRole: FindByQuery<TextMatch, ByRoleOptions>;
  findAllByRole: FindAllByQuery<TextMatch, ByRoleOptions>;
};

export const bindByRoleQueries = (
  instance: ReactTestInstance
): ByRoleQueries => ({
  getByRole: getBy(instance),
  getAllByRole: getAllBy(instance),
  queryByRole: queryBy(instance),
  queryAllByRole: queryAllBy(instance),
  findByRole: findBy(instance),
  findAllByRole: findAllBy(instance),
});
