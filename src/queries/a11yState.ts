import type { ReactTestInstance } from 'react-test-renderer';
import { AccessibilityState } from 'react-native';
import { matchObject } from '../helpers/matchers/matchObject';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

const queryAllByA11yState = (
  instance: ReactTestInstance
): ((state: AccessibilityState) => Array<ReactTestInstance>) =>
  function queryAllByA11yStateFn(state) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchObject(node.props.accessibilityState, state)
    );
  };

const getMultipleError = (state: AccessibilityState) =>
  `Found multiple elements with accessibilityState: ${JSON.stringify(state)}`;
const getMissingError = (state: AccessibilityState) =>
  `Unable to find an element with accessibilityState: ${JSON.stringify(state)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByA11yState,
  getMissingError,
  getMultipleError
);

export type ByA11yStateQueries = {
  getByA11yState: GetByQuery<AccessibilityState>;
  getAllByA11yState: GetAllByQuery<AccessibilityState>;
  queryByA11yState: QueryByQuery<AccessibilityState>;
  queryAllByA11yState: QueryAllByQuery<AccessibilityState>;
  findByA11yState: FindByQuery<AccessibilityState>;
  findAllByA11yState: FindAllByQuery<AccessibilityState>;
};

export const bindByA11yStateQueries = (
  instance: ReactTestInstance
): ByA11yStateQueries => ({
  getByA11yState: getBy(instance),
  getAllByA11yState: getAllBy(instance),
  queryByA11yState: queryBy(instance),
  queryAllByA11yState: queryAllBy(instance),
  findByA11yState: findBy(instance),
  findAllByA11yState: findAllBy(instance),
});
