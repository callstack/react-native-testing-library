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
import { matchAccessibilityState } from './a11yState';

type ByRoleOptions = {
  name?: TextMatch;
} & AccessibilityState;

type AccessibilityStateKey = keyof AccessibilityState;

const accessibilityStateKeys: AccessibilityStateKey[] = [
  'disabled',
  'selected',
  'checked',
  'busy',
  'expanded',
];

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

const matchAccessibleStateIfNeeded = (
  node: ReactTestInstance,
  options?: ByRoleOptions
) => {
  return options != null ? matchAccessibilityState(node, options) : true;
};

const queryAllByRole = (
  instance: ReactTestInstance
): ((role: TextMatch, options?: ByRoleOptions) => Array<ReactTestInstance>) =>
  function queryAllByRoleFn(role, options) {
    return instance.findAll(
      (node) =>
        // run the cheapest checks first, and early exit too avoid unneeded computations

        typeof node.type === 'string' &&
        matchStringProp(node.props.accessibilityRole, role) &&
        matchAccessibleStateIfNeeded(node, options) &&
        matchAccessibleNameIfNeeded(node, options?.name)
    );
  };

const buildErrorMessage = (role: TextMatch, options: ByRoleOptions = {}) => {
  const errors = [`role: "${String(role)}"`];

  if (options.name) {
    errors.push(`name: "${String(options.name)}"`);
  }

  accessibilityStateKeys.forEach((stateKey) => {
    if (options[stateKey]) {
      errors.push(`${stateKey} state: ${options[stateKey]}`);
    }
  });

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
