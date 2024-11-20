import type { AccessibilityRole, Role } from 'react-native';
import { HostElement } from 'universal-test-renderer';
import {
  accessibilityStateKeys,
  accessibilityValueKeys,
  getRole,
  isAccessibilityElement,
  normalizeRole,
} from '../helpers/accessibility';
import { findAll } from '../helpers/find-all';
import {
  AccessibilityStateMatcher,
  matchAccessibilityState,
} from '../helpers/matchers/match-accessibility-state';
import {
  AccessibilityValueMatcher,
  matchAccessibilityValue,
} from '../helpers/matchers/match-accessibility-value';
import { matchStringProp } from '../helpers/matchers/match-string-prop';
import type { TextMatch } from '../matches';
import { StringWithAutocomplete } from '../types';
import { getQueriesForElement } from '../within';
import { makeQueries } from './make-queries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './make-queries';
import { CommonQueryOptions } from './options';

export type ByRoleMatcher = StringWithAutocomplete<AccessibilityRole | Role> | RegExp;

export type ByRoleOptions = CommonQueryOptions &
  AccessibilityStateMatcher & {
    name?: TextMatch;
    value?: AccessibilityValueMatcher;
  };

const matchAccessibleNameIfNeeded = (node: HostElement, name?: TextMatch) => {
  if (name == null) return true;

  const { queryAllByText, queryAllByLabelText } = getQueriesForElement(node);
  return queryAllByText(name).length > 0 || queryAllByLabelText(name).length > 0;
};

const matchAccessibleStateIfNeeded = (node: HostElement, options?: ByRoleOptions) => {
  return options != null ? matchAccessibilityState(node, options) : true;
};

const matchAccessibilityValueIfNeeded = (node: HostElement, value?: AccessibilityValueMatcher) => {
  return value != null ? matchAccessibilityValue(node, value) : true;
};

const queryAllByRole = (instance: HostElement): QueryAllByQuery<ByRoleMatcher, ByRoleOptions> =>
  function queryAllByRoleFn(role, options) {
    const normalizedRole = typeof role === 'string' ? normalizeRole(role) : role;
    return findAll(
      instance,
      (node) =>
        // run the cheapest checks first, and early exit to avoid unneeded computations
        isAccessibilityElement(node) &&
        matchStringProp(getRole(node), normalizedRole) &&
        matchAccessibleStateIfNeeded(node, options) &&
        matchAccessibilityValueIfNeeded(node, options?.value) &&
        matchAccessibleNameIfNeeded(node, options?.name),
      options,
    );
  };

const formatQueryParams = (role: TextMatch, options: ByRoleOptions = {}) => {
  const params = [`role: ${String(role)}`];

  if (options.name) {
    params.push(`name: ${String(options.name)}`);
  }

  accessibilityStateKeys.forEach((stateKey) => {
    if (options[stateKey] !== undefined) {
      params.push(`${stateKey} state: ${options[stateKey]}`);
    }
  });

  accessibilityValueKeys.forEach((valueKey) => {
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
  getMultipleError,
);

export type ByRoleQueries = {
  getByRole: GetByQuery<ByRoleMatcher, ByRoleOptions>;
  getAllByRole: GetAllByQuery<ByRoleMatcher, ByRoleOptions>;
  queryByRole: QueryByQuery<ByRoleMatcher, ByRoleOptions>;
  queryAllByRole: QueryAllByQuery<ByRoleMatcher, ByRoleOptions>;
  findByRole: FindByQuery<ByRoleMatcher, ByRoleOptions>;
  findAllByRole: FindAllByQuery<ByRoleMatcher, ByRoleOptions>;
};

export const bindByRoleQueries = (instance: HostElement): ByRoleQueries => ({
  getByRole: getBy(instance),
  getAllByRole: getAllBy(instance),
  queryByRole: queryBy(instance),
  queryAllByRole: queryAllBy(instance),
  findByRole: findBy(instance),
  findAllByRole: findAllBy(instance),
});
