import type { ReactTestInstance } from 'react-test-renderer';
import { TextMatch } from '../matches';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

export function matchStringValue(
  prop: string | undefined,
  matcher: TextMatch
): boolean {
  if (!prop) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop === matcher;
  }

  return Boolean(prop.match(matcher));
}

const queryAllByA11yHint = (
  instance: ReactTestInstance
): ((displayValue: TextMatch) => Array<ReactTestInstance>) =>
  function queryAllByDisplayValueFn(displayValue) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchStringValue(node.props.accessibilityHint, displayValue)
    );
  };

const getMultipleError = (a11yHint: TextMatch) =>
  `Found multiple elements with accessibilityHint: ${String(a11yHint)} `;
const getMissingError = (a11yHint: TextMatch) =>
  `Unable to find an element with accessibilityHint: ${String(a11yHint)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByA11yHint,
  getMissingError,
  getMultipleError
);

export type ByA11yHintQueries = {
  getByA11yHint: GetByQuery<TextMatch>;
  getAllByA11yHint: GetAllByQuery<TextMatch>;
  queryByA11yHint: QueryByQuery<TextMatch>;
  queryAllByA11yHint: QueryAllByQuery<TextMatch>;
  findByA11yHint: FindByQuery<TextMatch>;
  findAllByA11yHint: FindAllByQuery<TextMatch>;
};

export const bindByA11yHintQueries = (
  instance: ReactTestInstance
): ByA11yHintQueries => ({
  getByA11yHint: getBy(instance),
  getAllByA11yHint: getAllBy(instance),
  queryByA11yHint: queryBy(instance),
  queryAllByA11yHint: queryAllBy(instance),
  findByA11yHint: findBy(instance),
  findAllByA11yHint: findAllBy(instance),
});
