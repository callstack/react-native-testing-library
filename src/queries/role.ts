import type { ReactTestInstance } from 'react-test-renderer';
import { TextMatch } from '../matches';
import { matchStringProp } from '../helpers/matchers/matchStringProp';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

const queryAllByRole = (
  instance: ReactTestInstance
): ((role: TextMatch) => Array<ReactTestInstance>) =>
  function queryAllByRoleFn(role) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchStringProp(node.props.accessibilityRole, role)
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
  getByRole: GetByQuery<TextMatch>;
  getAllByRole: GetAllByQuery<TextMatch>;
  queryByRole: QueryByQuery<TextMatch>;
  queryAllByRole: QueryAllByQuery<TextMatch>;
  findByRole: FindByQuery<TextMatch>;
  findAllByRole: FindAllByQuery<TextMatch>;
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
