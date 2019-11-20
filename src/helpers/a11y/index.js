// @flow
import makeStateMatcher, { type A11yStateMatchers } from './state';
import makeStatesMatcher, { type A11yStatesMatchers } from './states';
import makeRoleMatcher, { type A11yRoleMatchers } from './role';
import makeHintMatcher, { type A11yHintMatchers } from './hint';
import makeLabelMatcher, { type A11yLabelMatchers } from './label';
import makeValueMatcher, { type A11yValueMatchers } from './value';

type A11yAPI = {|
  ...A11yLabelMatchers,
  ...A11yHintMatchers,
  ...A11yRoleMatchers,
  ...A11yStatesMatchers,
  ...A11yStateMatchers,
  ...A11yValueMatchers,
|};

const a11yAPI = (instance: ReactTestInstance): A11yAPI =>
  ({
    ...makeLabelMatcher(instance),
    ...makeHintMatcher(instance),
    ...makeRoleMatcher(instance),
    ...makeStatesMatcher(instance),
    ...makeStateMatcher(instance),
    ...makeValueMatcher(instance),
  }: any);

export default a11yAPI;
