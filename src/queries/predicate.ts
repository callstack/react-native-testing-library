import type { ReactTestInstance } from 'react-test-renderer';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

type PredicateFn = (instance: ReactTestInstance) => boolean;
// Not used so far
type PredicateQueryOptions = void;

const queryAllByPredicate = (
  instance: ReactTestInstance
): ((
  predicate: PredicateFn,
  options?: PredicateQueryOptions
) => Array<ReactTestInstance>) =>
  function queryAllByTestIdFn(predicate) {
    const results = instance.findAll(
      (node) => typeof node.type === 'string' && predicate(node)
    );

    return results;
  };

const getMultipleError = (predicate: PredicateFn) =>
  `Found multiple elements matching predicate: ${predicate}`;

const getMissingError = (predicate: PredicateFn) =>
  `Unable to find an element matching predicate: ${predicate}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByPredicate,
  getMissingError,
  getMultipleError
);

export type ByTestIdQueries = {
  getByPredicate: GetByQuery<PredicateFn, PredicateQueryOptions>;
  getAllByPredicate: GetAllByQuery<PredicateFn, PredicateQueryOptions>;
  queryByPredicate: QueryByQuery<PredicateFn, PredicateQueryOptions>;
  queryAllByPredicate: QueryAllByQuery<PredicateFn, PredicateQueryOptions>;
  findByPredicate: FindByQuery<PredicateFn, PredicateQueryOptions>;
  findAllByPredicate: FindAllByQuery<PredicateFn, PredicateQueryOptions>;
};

export const bindByPredicateQueries = (
  instance: ReactTestInstance
): ByTestIdQueries => ({
  getByPredicate: getBy(instance),
  getAllByPredicate: getAllBy(instance),
  queryByPredicate: queryBy(instance),
  queryAllByPredicate: queryAllBy(instance),
  findByPredicate: findBy(instance),
  findAllByPredicate: findAllBy(instance),
});
