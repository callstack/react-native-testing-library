// @flow
import makeQuery from './makeQuery';
import { matchString } from './matchers';
import type { A11yRole } from '../../types.flow';

export type A11yRoleMatchers = {|
  getByA11yRole: (A11yRole | RegExp) => ReactTestInstance,
  getAllByA11yRole: (A11yRole | RegExp) => Array<ReactTestInstance> | [],
  queryByA11yRole: (A11yRole | RegExp) => ReactTestInstance | null,
  queryAllByA11yRole: (A11yRole | RegExp) => Array<ReactTestInstance> | [],
|};

export default makeQuery(
  'accessibilityRole',
  {
    getBy: ['getByA11yRole', 'getByAccessibilityRole'],
    getAllBy: ['getAllByA11yRole', 'getAllByAccessibilityRole'],
    queryBy: ['queryByA11yRole', 'queryByAccessibilityRole'],
    queryAllBy: ['queryAllByA11yRole', 'queryAllByAccessibilityRole'],
  },
  matchString
);
