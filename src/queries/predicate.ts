import type { ReactTestInstance } from 'react-test-renderer';
import { isHostElement } from '../helpers/component-tree';
import { findAll } from '../helpers/findAll';
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

type PredicateFn = (instance: ReactTestInstance) => boolean;
type ByPredicateQueryOptions = CommonQueryOptions;

function queryAllByPredicate(instance: ReactTestInstance) {
  return function queryAllByPredicateFn(
    predicate: PredicateFn,
    options?: ByPredicateQueryOptions
  ): Array<ReactTestInstance> {
    const results = findAll(
      instance,
      (node) => isHostElement(node) && predicate(node),
      options
    );

    return results;
  };
}

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
  getByPredicate: GetByQuery<PredicateFn, ByPredicateQueryOptions>;
  getAllByPredicate: GetAllByQuery<PredicateFn, ByPredicateQueryOptions>;
  queryByPredicate: QueryByQuery<PredicateFn, ByPredicateQueryOptions>;
  queryAllByPredicate: QueryAllByQuery<PredicateFn, ByPredicateQueryOptions>;
  findByPredicate: FindByQuery<PredicateFn, ByPredicateQueryOptions>;
  findAllByPredicate: FindAllByQuery<PredicateFn, ByPredicateQueryOptions>;
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
