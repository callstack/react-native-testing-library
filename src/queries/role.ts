import type { ReactTestInstance } from 'react-test-renderer';
import type { AccessibilityRole } from 'react-native';
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

type Role = AccessibilityRole | TextMatch;

type ByRoleOptions = {
  name?: TextMatch;
};

const filterByAccessibleName = (
  node: ReactTestInstance,
  name: TextMatch | undefined
) => {
  if (!name) return true;

  const { queryByText, queryByLabelText } = getQueriesForElement(node);
  return Boolean(queryByText(name) || queryByLabelText(name));
};

const queryAllByRole = (
  instance: ReactTestInstance
): ((role: Role, options?: ByRoleOptions) => Array<ReactTestInstance>) =>
  function queryAllByRoleFn(role, options) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchStringProp(node.props.accessibilityRole, role) &&
        filterByAccessibleName(node, options?.name)
    );
  };

const getMultipleError = (role: Role) =>
  `Found multiple elements with accessibilityRole: ${String(role)} `;
const getMissingError = (role: Role) =>
  `Unable to find an element with accessibilityRole: ${String(role)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByRole,
  getMissingError,
  getMultipleError
);

export type ByRoleQueries = {
  getByRole: GetByQuery<Role, ByRoleOptions>;
  getAllByRole: GetAllByQuery<Role, ByRoleOptions>;
  queryByRole: QueryByQuery<Role, ByRoleOptions>;
  queryAllByRole: QueryAllByQuery<Role, ByRoleOptions>;
  findByRole: FindByQuery<Role, ByRoleOptions>;
  findAllByRole: FindAllByQuery<Role, ByRoleOptions>;
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
