import type { ReactTestInstance } from 'react-test-renderer';
import { AccessibilityState } from 'react-native';
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

const queryAllByA11yState = (
  instance: ReactTestInstance
): ((state: AccessibilityState) => Array<ReactTestInstance>) =>
  function queryAllByA11yStateFn(state) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchObjectProp(node.props.accessibilityState, state)
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

  getByAccessibilityState: GetByQuery<AccessibilityState>;
  getAllByAccessibilityState: GetAllByQuery<AccessibilityState>;
  queryByAccessibilityState: QueryByQuery<AccessibilityState>;
  queryAllByAccessibilityState: QueryAllByQuery<AccessibilityState>;
  findByAccessibilityState: FindByQuery<AccessibilityState>;
  findAllByAccessibilityState: FindAllByQuery<AccessibilityState>;
};

export const bindByA11yStateQueries = (
  instance: ReactTestInstance
): ByA11yStateQueries => {
  const getByA11yState = getBy(instance);
  const getAllByA11yState = getAllBy(instance);
  const queryByA11yState = queryBy(instance);
  const queryAllByA11yState = queryAllBy(instance);
  const findByA11yState = findBy(instance);
  const findAllByA11yState = findAllBy(instance);

  return {
    getByA11yState,
    getAllByA11yState,
    queryByA11yState,
    queryAllByA11yState,
    findByA11yState,
    findAllByA11yState,

    getByAccessibilityState: getByA11yState,
    getAllByAccessibilityState: getAllByA11yState,
    queryByAccessibilityState: queryByA11yState,
    queryAllByAccessibilityState: queryAllByA11yState,
    findByAccessibilityState: findByA11yState,
    findAllByAccessibilityState: findAllByA11yState,
  };
};
