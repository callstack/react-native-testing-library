import type { ReactTestInstance } from 'react-test-renderer';
import { matchObjectProp } from '../helpers/matchers/matchObjectProp';
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
import { BaseOptions } from './options';

type A11yValue = {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
};

const queryAllByA11yValue = (
  instance: ReactTestInstance
): ((
  value: A11yValue,
  queryOptions?: BaseOptions
) => Array<ReactTestInstance>) =>
  function queryAllByA11yValueFn(value, queryOptions) {
    return findAll(
      instance,
      (node) =>
        typeof node.type === 'string' &&
        matchObjectProp(node.props.accessibilityValue, value),
      { hidden: queryOptions?.hidden }
    );
  };

const getMultipleError = (value: A11yValue) =>
  `Found multiple elements with accessibilityValue: ${JSON.stringify(value)} `;
const getMissingError = (value: A11yValue) =>
  `Unable to find an element with accessibilityValue: ${JSON.stringify(value)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByA11yValue,
  getMissingError,
  getMultipleError
);

export type ByA11yValueQueries = {
  getByA11yValue: GetByQuery<A11yValue, BaseOptions>;
  getAllByA11yValue: GetAllByQuery<A11yValue, BaseOptions>;
  queryByA11yValue: QueryByQuery<A11yValue, BaseOptions>;
  queryAllByA11yValue: QueryAllByQuery<A11yValue, BaseOptions>;
  findByA11yValue: FindByQuery<A11yValue, BaseOptions>;
  findAllByA11yValue: FindAllByQuery<A11yValue, BaseOptions>;

  getByAccessibilityValue: GetByQuery<A11yValue, BaseOptions>;
  getAllByAccessibilityValue: GetAllByQuery<A11yValue, BaseOptions>;
  queryByAccessibilityValue: QueryByQuery<A11yValue, BaseOptions>;
  queryAllByAccessibilityValue: QueryAllByQuery<A11yValue, BaseOptions>;
  findByAccessibilityValue: FindByQuery<A11yValue, BaseOptions>;
  findAllByAccessibilityValue: FindAllByQuery<A11yValue, BaseOptions>;
};

export const bindByA11yValueQueries = (
  instance: ReactTestInstance
): ByA11yValueQueries => {
  const getByA11yValue = getBy(instance);
  const getAllByA11yValue = getAllBy(instance);
  const queryByA11yValue = queryBy(instance);
  const queryAllByA11yValue = queryAllBy(instance);
  const findByA11yValue = findBy(instance);
  const findAllByA11yValue = findAllBy(instance);

  return {
    getByA11yValue,
    getAllByA11yValue,
    queryByA11yValue,
    queryAllByA11yValue,
    findByA11yValue,
    findAllByA11yValue,

    getByAccessibilityValue: getByA11yValue,
    getAllByAccessibilityValue: getAllByA11yValue,
    queryByAccessibilityValue: queryByA11yValue,
    queryAllByAccessibilityValue: queryAllByA11yValue,
    findByAccessibilityValue: findByA11yValue,
    findAllByAccessibilityValue: findAllByA11yValue,
  };
};
