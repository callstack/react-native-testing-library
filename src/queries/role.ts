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

const accessibilityStates = [
  'disabled',
  'selected',
  'checked',
  'busy',
  'expanded',
] as const;

const queryAllByRole = (
  instance: ReactTestInstance
): ((role: TextMatch, options?: ByRoleOptions) => Array<ReactTestInstance>) =>
  function queryAllByRoleFn(role, options) {
    return instance.findAll((node) => {
      const matchRole =
        typeof node.type === 'string' &&
        matchStringProp(node.props.accessibilityRole, role);

      if (!matchRole) return false;

      if (options?.name) {
        if (!matchAccessibleNameIfNeeded(node, options.name)) {
          return false;
        }
      }

      return accessibilityStates.every((accessibilityState) => {
        const queriedState = options?.[accessibilityState];

        // test for true instead of `undefined`, because `{disabled: false} should match
        // a button without a disable state`
        if (queriedState === true) {
          return (
            queriedState === node.props.accessibilityState?.[accessibilityState]
          );
        } else {
          return true;
        }
      });
    });
  };

const computeErrorMessage = (role: TextMatch, options: ByRoleOptions = {}) => {
  let errorMessage = `accessibilityRole: ${String(role)}`;

  if (options.name) {
    errorMessage += `, name: ${String(options.name)}`;
  }

  if (
    accessibilityStates.some(
      (accessibilityState) => typeof options[accessibilityState] !== 'undefined'
    )
  ) {
    errorMessage += ', accessibilityStates:';
    accessibilityStates.forEach((accessibilityState) => {
      if (options[accessibilityState]) {
        errorMessage += ` ${accessibilityState}:${options[accessibilityState]}`;
      }
    });
  }

  return errorMessage;
};
const getMultipleError = (role: TextMatch, options?: ByRoleOptions) =>
  `Found multiple elements with ${computeErrorMessage(role, options)}`;
const getMissingError = (role: TextMatch, options?: ByRoleOptions) =>
  `Unable to find an element with ${computeErrorMessage(role, options)}`;

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
