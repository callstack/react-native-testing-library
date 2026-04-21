import type { AccessibilityRole, Role } from 'react-native';
import type { TestInstance } from 'test-renderer';

import {
  accessibilityStateKeys,
  accessibilityValueKeys,
  computeAccessibleName,
  getRole,
  isAccessibilityElement,
  normalizeRole,
} from '../helpers/accessibility';
import { findAll } from '../helpers/find-all';
import type { AccessibilityStateMatcher } from '../helpers/matchers/match-accessibility-state';
import { matchAccessibilityState } from '../helpers/matchers/match-accessibility-state';
import type { AccessibilityValueMatcher } from '../helpers/matchers/match-accessibility-value';
import { matchAccessibilityValue } from '../helpers/matchers/match-accessibility-value';
import { matchStringProp } from '../helpers/matchers/match-string-prop';
import { matches, type TextMatch } from '../matches';
import type { StringWithAutocomplete } from '../types';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './make-queries';
import { makeQueries } from './make-queries';
import type { CommonQueryOptions } from './options';

export type ByRoleMatcher = StringWithAutocomplete<AccessibilityRole | Role> | RegExp;

export type ByRoleOptions = CommonQueryOptions &
  AccessibilityStateMatcher & {
    name?: TextMatch;
    value?: AccessibilityValueMatcher;
  };

const matchAccessibleNameIfNeeded = (instance: TestInstance, name?: TextMatch) => {
  if (name == null) return true;

  const accessibleName = computeAccessibleName(instance);
  return matches(name, accessibleName);
};

const matchAccessibleStateIfNeeded = (instance: TestInstance, options?: ByRoleOptions) => {
  return options != null ? matchAccessibilityState(instance, options) : true;
};

const matchAccessibilityValueIfNeeded = (
  instance: TestInstance,
  value?: AccessibilityValueMatcher,
) => {
  return value != null ? matchAccessibilityValue(instance, value) : true;
};

const queryAllByRole = (instance: TestInstance): QueryAllByQuery<ByRoleMatcher, ByRoleOptions> =>
  function queryAllByRoleFn(role, options) {
    const normalizedRole = typeof role === 'string' ? normalizeRole(role) : role;
    return findAll(
      instance,
      (item) =>
        // run the cheapest checks first, and early exit to avoid unneeded computations
        isAccessibilityElement(item) &&
        matchStringProp(getRole(item), normalizedRole) &&
        matchAccessibleStateIfNeeded(item, options) &&
        matchAccessibilityValueIfNeeded(item, options?.value) &&
        matchAccessibleNameIfNeeded(item, options?.name),
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

export const bindByRoleQueries = (instance: TestInstance): ByRoleQueries => ({
  getByRole: getBy(instance),
  getAllByRole: getAllBy(instance),
  queryByRole: queryBy(instance),
  queryAllByRole: queryAllBy(instance),
  findByRole: findBy(instance),
  findAllByRole: findAllBy(instance),
});
