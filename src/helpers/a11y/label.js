// @flow
import makeQuery from './makeQuery';
import { matchString } from './matchers';

export type A11yLabelMatchers = {|
  getByA11yLabel: (string | RegExp) => ReactTestInstance,
  getAllByA11yLabel: (string | RegExp) => Array<ReactTestInstance>,
  queryByA11yLabel: (string | RegExp) => ReactTestInstance | null,
  queryAllByA11yLabel: (string | RegExp) => Array<ReactTestInstance> | [],
|};

export default makeQuery(
  'accessibilityLabel',
  {
    getBy: ['getByA11yLabel', 'getByAccessibilityLabel'],
    getAllBy: ['getAllByA11yLabel', 'getAllByAccessibilityLabel'],
    queryBy: ['queryByA11yLabel', 'queryByAccessibilityLabel'],
    queryAllBy: ['queryAllByA11yLabel', 'queryAllByAccessibilityLabel'],
  },
  matchString
);
