// @flow
import makeQuery from './makeQuery';
import { matchObject } from './matchers';
import type { A11yState } from '../../types.flow';

export type A11yStateMatchers = {|
  getByA11yState: A11yState => ReactTestInstance,
  getAllByA11yState: A11yState => Array<ReactTestInstance> | [],
  queryByA11yState: A11yState => ReactTestInstance | null,
  queryAllByA11yState: A11yState => Array<ReactTestInstance> | [],
|};

export default makeQuery(
  'accessibilityState',
  {
    getBy: ['getByA11yState', 'getByAccessibilityState'],
    getAllBy: ['getAllByA11yState', 'getAllByAccessibilityState'],
    queryBy: ['queryByA11yState', 'queryByAccessibilityState'],
    queryAllBy: ['queryAllByA11yState', 'queryAllByAccessibilityState'],
  },
  matchObject
);
