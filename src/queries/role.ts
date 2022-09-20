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
};

const matchAccessibleName = (node: ReactTestInstance, name?: TextMatch) => {
  if (name == null) return true;

  const { queryAllByText, queryAllByLabelText } = getQueriesForElement(node);
  return (
    queryAllByText(name).length > 0 || queryAllByLabelText(name).length > 0
  );
};

const queryAllByRole = (
  instance: ReactTestInstance
): ((role: TextMatch, options?: ByRoleOptions) => Array<ReactTestInstance>) =>
  function queryAllByRoleFn(role, options) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchStringProp(node.props.accessibilityRole, role) &&
        matchAccessibleName(node, options?.name)
    );
  };

const getMultipleError = (role: TextMatch) =>
  `Found multiple elements with accessibilityRole: ${String(role)} `;
const getMissingError = (role: TextMatch) =>
  `Unable to find an element with accessibilityRole: ${String(role)}`;

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
