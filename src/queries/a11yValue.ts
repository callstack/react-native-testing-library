import type { ReactTestInstance } from 'react-test-renderer';
import { matchObjectProp } from '../helpers/matchers/matchObjectProp';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

type A11yValue = {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
};

const queryAllByA11yValue = (
  instance: ReactTestInstance
): ((value: A11yValue) => Array<ReactTestInstance>) =>
  function queryAllByA11yValueFn(value) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchObjectProp(node.props.accessibilityValue, value)
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
  getByA11yValue: GetByQuery<A11yValue>;
  getAllByA11yValue: GetAllByQuery<A11yValue>;
  queryByA11yValue: QueryByQuery<A11yValue>;
  queryAllByA11yValue: QueryAllByQuery<A11yValue>;
  findByA11yValue: FindByQuery<A11yValue>;
  findAllByA11yValue: FindAllByQuery<A11yValue>;
};

export const bindByA11yValueQueries = (
  instance: ReactTestInstance
): ByA11yValueQueries => ({
  getByA11yValue: getBy(instance),
  getAllByA11yValue: getAllBy(instance),
  queryByA11yValue: queryBy(instance),
  queryAllByA11yValue: queryAllBy(instance),
  findByA11yValue: findBy(instance),
  findAllByA11yValue: findAllBy(instance),
});
