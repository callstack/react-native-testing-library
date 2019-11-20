// @flow
import makeQuery from './makeQuery';
import { matchArray } from './matchers';
import type { A11yStates, A11yStatesEnum } from '../../types.flow';

export type A11yStatesMatchers = {|
  getByA11yStates: (A11yStatesEnum | A11yStates) => ReactTestInstance,
  getAllByA11yStates: (
    A11yStatesEnum | A11yStates
  ) => Array<ReactTestInstance> | [],
  queryByA11yStates: (A11yStatesEnum | A11yStates) => ReactTestInstance | null,
  queryAllByA11yStates: (
    A11yStatesEnum | A11yStates
  ) => Array<ReactTestInstance> | [],
|};

export default makeQuery(
  'accessibilityStates',
  {
    getBy: ['getByA11yStates', 'getByAccessibilityStates'],
    getAllBy: ['getAllByA11yStates', 'getAllByAccessibilityStates'],
    queryBy: ['queryByA11yStates', 'queryByAccessibilityStates'],
    queryAllBy: ['queryAllByA11yStates', 'queryAllByAccessibilityStates'],
  },
  matchArray
);
