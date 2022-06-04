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

type A11yValue = {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
};

export function matchObject<T extends Record<string, unknown>>(
  prop: T | undefined,
  matcher: T
): boolean {
  return prop
    ? Object.keys(matcher).length !== 0 &&
        Object.keys(prop).length !== 0 &&
        Object.keys(matcher).every((key) => prop[key] === matcher[key])
    : false;
}

const queryAllByA11yValue = (
  instance: ReactTestInstance
): ((displayValue: A11yValue) => Array<ReactTestInstance>) =>
  function queryAllByDisplayValueFn(displayValue) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchObject(node.props.accessibilityValue, displayValue)
    );
  };

const getMultipleError = (a11yValue: A11yValue) =>
  `Found multiple elements with accessibilityValue: ${JSON.stringify(
    a11yValue
  )} `;
const getMissingError = (a11yValue: A11yValue) =>
  `Unable to find an element with accessibilityValue: ${JSON.stringify(
    a11yValue
  )}`;

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
