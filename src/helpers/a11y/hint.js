// @flow
import makeQuery from './makeQuery';
import { matchString } from './matchers';

export type A11yHintMatchers = {|
  getByA11yHint: (string | RegExp) => ReactTestInstance,
  getAllByA11yHint: (string | RegExp) => Array<ReactTestInstance> | [],
  queryByA11yHint: (string | RegExp) => ReactTestInstance | null,
  queryAllByA11yHint: (string | RegExp) => Array<ReactTestInstance> | [],
|};

export default makeQuery(
  'accessibilityHint',
  {
    getBy: ['getByA11yHint', 'getByAccessibilityHint'],
    getAllBy: ['getAllByA11yHint', 'getAllByAccessibilityHint'],
    queryBy: ['queryByA11yHint', 'queryByAccessibilityHint'],
    queryAllBy: ['queryAllByA11yHint', 'queryAllByAccessibilityHint'],
  },
  matchString
);
