import type { ReactTestInstance } from 'react-test-renderer';
import {
  accessibilityStateKeys,
  accessiblityValueKeys,
  isAccessibilityElement,
} from '../helpers/accessiblity';
import { findAll } from '../helpers/findAll';
import {
  AccessibilityStateMatcher,
  matchAccessibilityState,
} from '../helpers/matchers/accessibilityState';
import {
  AccessibilityValueMatcher,
  matchAccessibilityValue,
} from '../helpers/matchers/accessibilityValue';
import { matchStringProp } from '../helpers/matchers/matchStringProp';
import type { TextMatch } from '../matches';
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
import { CommonQueryOptions } from './options';

type ByRoleOptions = CommonQueryOptions &
  AccessibilityStateMatcher & {
    name?: TextMatch;
    value?: AccessibilityValueMatcher;
  };

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

const matchAccessibilityValueIfNeeded = (
  node: ReactTestInstance,
  value?: AccessibilityValueMatcher
) => {
  return value != null ? matchAccessibilityValue(node, value) : true;
};

const queryAllByRole = (
  instance: ReactTestInstance
): ((role: TextMatch, options?: ByRoleOptions) => Array<ReactTestInstance>) =>
  function queryAllByRoleFn(role, options) {
    return findAll(
      instance,
      (node) =>
        // run the cheapest checks first, and early exit to avoid unneeded computations
        typeof node.type === 'string' &&
        isAccessibilityElement(node) &&
        matchStringProp(node.props.accessibilityRole, role) &&
        matchAccessibleStateIfNeeded(node, options) &&
        matchAccessibilityValueIfNeeded(node, options?.value) &&
        matchAccessibleNameIfNeeded(node, options?.name),
      options
    );
  };

const formatQueryParams = (role: TextMatch, options: ByRoleOptions = {}) => {
  const params = [`role: "${String(role)}"`];

  if (options.name) {
    params.push(`name: "${String(options.name)}"`);
  }

  accessibilityStateKeys.forEach((stateKey) => {
    if (options[stateKey] !== undefined) {
      params.push(`${stateKey} state: ${options[stateKey]}`);
    }
  });

  accessiblityValueKeys.forEach((valueKey) => {
    if (options?.value?.[valueKey] !== undefined) {
      params.push(`${valueKey} value: ${options?.value?.[valueKey]}`);
    }
  });

  return params.join(', ');
};

const getMultipleError = (role: TextMatch, options?: ByRoleOptions) =>
  `Found multiple elements with ${formatQueryParams(role, options)}`;

const getMissingError = (role: TextMatch, options?: ByRoleOptions) =>
  `Unable to find an element with ${formatQueryParams(role, options)}`;

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
