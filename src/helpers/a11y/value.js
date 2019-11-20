// @flow
import makeQuery from './makeQuery';
import { matchObject } from './matchers';
import type { A11yValue } from '../../types.flow';

export type A11yValueMatchers = {|
  getByA11yValue: A11yValue => ReactTestInstance,
  getAllByA11yValue: A11yValue => Array<ReactTestInstance> | [],
  queryByA11yValue: A11yValue => ReactTestInstance | null,
  queryAllByA11yValue: A11yValue => Array<ReactTestInstance> | [],
|};

export default makeQuery(
  'accessibilityValue',
  {
    getBy: ['getByA11yValue', 'getByAccessibilityValue'],
    getAllBy: ['getAllByA11yValue', 'getAllByAccessibilityValue'],
    queryBy: ['queryByA11yValue', 'queryByAccessibilityValue'],
    queryAllBy: ['queryAllByA11yValue', 'queryAllByAccessibilityValue'],
  },
  matchObject
);
